/***************************************
 * POPUP
 *
 * Using Material UI.
 ***************************************/
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
    iResponse,
    extensionNames,
    orderNames,
    urlPattern,
} from '../utils/constants';
import { sendMessagePromise } from '../utils/helpers';
import './popup.css';
// import MainContent from './MainContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import InvalidPanel from './InvalidPanel';
import ValidPanel from './ValidPanel';
import SlideAnimation from './SlideAnimation';
import { usePrevious } from '../hooks/usePrevious';

const theme = createTheme({
    palette: {
        // purple base
        primary: {
            main: '#6f006f',
            light: '#a200a2',
            dark: '#5e005e',
        },
        // Ud*my theme color
        secondary: {
            main: '#5624d0',
            light: '#6939dd',
            dark: '#4a1fb3',
        },
    },
});

const $ANIMATION_TIMER = 6000;

/****
 *
 * states:
 * - correctUrl: Validity of the tab's URL that popup popped up.
 * - building: While between REBUILD button pressed and complete deploying ExTranscript, it is true.
 * - built: If ExTranscript is running, then true.
 * - tabInfo: TabInfo that this extension is running on.
 * - turningOn: Status of REBUILD (TURN OFF) Button.
 *
 * Features:
 * - Check the URL validity by verifyValidPage() when popped up.
 * - Require background script to send status when popped up to fill each states.
 * - When REBUILD button on popup clicked, run handlerOfRun that orders background script to deploy ExTranscript.
 * - UI is styled by Material UI.
 *
 * */

/*****
 * 202404
 * state管理：
 *
 * これまでcorrectUrlでありさえすれば、「ビルド中」「ビルド済」「展開中」の３つのstate管理で運用していたが
 * 今回から「トランスクリプトがONであるか否か」「字幕は英語であるか否か」もpopupに表示することになったので
 * transcript、subtitleの状態も取得する
 *
 * 各状態について：
 *    待機中でかつボタンを無効にする条件：   correctUrl && !isTranscriptEnabled || !isSubtitleEnabled
 *    待機中でかつボタンを有効にする条件：   correctUrl && isTanscriptEnabled && isSubtitleEnabled
 *    （ExTranscriptを）生成中にする条件：  correctUrl && isTanscriptEnabled && isSubtitleEnabled
 *                                        && building && !isBuilt && !turningOn
 *    展開中にする条件：                   correctUrl && isTanscriptEnabled && isSubtitleEnabled
 *                                        && !building && isBuilt && turningOn
 *    一時的に展開をオフにする条件：        correctUrl&& !building && !isBuilt && !turningOn
 *
 * ****/
const Popup = () => {
    const [correctUrl, setCorrectUrl] = useState<boolean>(false);
    const [building, setBuilding] = useState<boolean>(false);
    const [built, setBuilt] = useState<boolean>(false);
    const [tabInfo, setTabInfo] = useState<chrome.tabs.Tab>(null);
    const [turningOn, setTurningOn] = useState<boolean>(false);

    // iModelの`isTranscriptDisplaying`
    const [isTranscriptEnabled, setTranscriptEnabled] =
        useState<boolean>(false);
    // iModelの`isEnglish`
    const [isSubtitleEnabled, setSubtitleEnabled] = useState<boolean>(false);
    const [alertSuccess, setAlertSuccess] = useState<boolean>(false);
    const previousBuilt = usePrevious<boolean>(built);

    useEffect(() => {
        verifyValidPage();
    }, []);

    useEffect(() => {
        sendMessagePromise({
            from: extensionNames.popup,
            to: extensionNames.background,
            order: [orderNames.sendStatus],
        }).then((res: iResponse) => {
            const {
                isSubtitleCapturing,
                isExTranscriptStructured,
                isTranscriptDisplaying,
                isEnglish,
            } = res.state;

            // DEBUG:
            console.log('mounted');
            console.log(`transcript on: ${isTranscriptDisplaying}`);
            console.log(`subtitle on: ${isEnglish}`);

            setBuilding(isSubtitleCapturing);
            setBuilt(isExTranscriptStructured);
            setTurningOn(isExTranscriptStructured);
            setTranscriptEnabled(isTranscriptDisplaying);
            setSubtitleEnabled(isEnglish);
        });
    }, []);

    // これ前回のstateとも比較しないと無限ループになる
    useEffect(() => {
        if (!building && built && !previousBuilt) {
            setAlertSuccess(true);
        }
    }, [building, built, previousBuilt]);

    useEffect(() => {
        let timer: number = 0;
        if (alertSuccess) {
            timer = window.setTimeout(
                () => setAlertSuccess(false),
                $ANIMATION_TIMER
            );
        }
        return () => clearTimeout(timer);
    }, [alertSuccess]);

    const verifyValidPage = (): void => {
        chrome.tabs
            .query({
                active: true,
                currentWindow: true,
                lastFocusedWindow: true,
            })
            .then((tabs: chrome.tabs.Tab[]) => {
                const r: RegExpMatchArray = tabs[0].url.match(urlPattern);
                if (r && r.length) {
                    setCorrectUrl(true);
                    setTabInfo(tabs[0]);
                } else {
                    setCorrectUrl(false);
                }
            })
            .catch((err) => {
                console.error(err.message);
                // It is inconceivable that exception would occure here...
            });
    };

    /***
     * Handler of RUN process.
     *
     * Features:
     * - Send message to background script to run.
     * - Receive response that result of the process has been succeed or failed.
     * - Reflects the result.
     *
     * */
    const handlerOfRun = (): void => {
        if (!tabInfo) throw new Error('Error: tabInfo is null');
        setBuilding(true);

        sendMessagePromise({
            from: extensionNames.popup,
            to: extensionNames.background,
            order: [orderNames.run],
            tabInfo: tabInfo,
        })
            // NOTE: !res.success doesn't mean extension is impossible to execute but means that the tab is not ready to run extension.
            .then((res) => {
                const { success } = res;
                setBuilt(success);
                setBuilding(false);
            })
            .catch((e) => {
                setBuilt(false);
                setBuilding(false);
                setTurningOn(false);
            });
    };

    /***
     * Handler of turn off ExTranscript process.
     *
     * Features:
     * - Send message to background script to turn off ExTranscript.
     * - Receive response that result of the process has been succeed or failed.
     * - Reflects the result.
     *
     * */
    const handlerOfTurnOff = (): void => {
        sendMessagePromise({
            from: extensionNames.popup,
            to: extensionNames.background,
            order: [orderNames.turnOff],
        })
            .then(() => {
                setBuilt(false);
                setBuilding(false);
                setTurningOn(false);
            })
            .catch((e) => {
                setBuilt(false);
                setBuilding(false);
                setTurningOn(false);
            });
    };

    /***
     * Toggles turningOn state.
     *
     * This would be invoked when REBUILD button or TURN OFF button has been clicked.
     * */
    const handlerOfToggle = (): void => {
        turningOn
            ? (function () {
                  setTurningOn(false);
                  handlerOfTurnOff();
              })()
            : (function () {
                  setTurningOn(true);
                  handlerOfRun();
              })();
    };

    /***
     * NOTE: fix/202404 experiment
     *
     */
    const handleClickReload = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log('[popup] reload clicked');

        e.preventDefault();
        e.stopPropagation();
        // reloadしたら自動的にstateは初期化されるか？
        sendMessagePromise({
            from: extensionNames.popup,
            to: extensionNames.background,
            order: [orderNames.reload],
        });
    };

    const enableRebuildButton = isTranscriptEnabled && isSubtitleEnabled;

    return (
        <ThemeProvider theme={theme}>
            {alertSuccess && <SlideAnimation animate={alertSuccess} />}
            {correctUrl ? (
                <ValidPanel
                    isTranscriptEnabled={isTranscriptEnabled}
                    isSubtitleEnabled={isSubtitleEnabled}
                    building={building}
                    built={built}
                    turningOn={turningOn}
                    // setTranscriptEnabled={setTranscriptEnabled}
                    // setSubtitleEnabled={setSubtitleEnabled}
                    // setCorrectUrl={setCorrectUrl}
                    setBuilding={setBuilding}
                    setBuilt={setBuilt}
                    setTurningOn={setTurningOn}
                />
            ) : (
                <InvalidPanel />
            )}
        </ThemeProvider>
    );

    // return (
    //     <ThemeProvider theme={theme}>
    //         <MainContent
    //             built={built}
    //             building={building}
    //             correctUrl={correctUrl}
    //             handlerOfToggle={handlerOfToggle}
    //         />
    //         <button onClick={handleClickReload}>reload</button>
    //     </ThemeProvider>
    // );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<Popup />, root);
