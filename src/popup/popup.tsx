/***************************************
 * POPUP
 *
 * Using Material UI.
 ***************************************/
// NOTE: React is required by Material UI.
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
import MainContent from './MainContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        // purple base
        primary: {
            main: '#6f006f',
            light: '#a200a2',
            dark: '#5e005e',
        },
        // Udemy theme color
        secondary: {
            main: '#5624d0',
            light: '#6939dd',
            dark: '#4a1fb3',
        },
    },
});


/****
 * Top JSX.ELement of popup
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
 * */ 
const Popup = (): JSX.Element => {
    const [correctUrl, setCorrectUrl] = useState<boolean>(false);
    const [building, setBuilding] = useState<boolean>(false);
    const [built, setBuilt] = useState<boolean>(false);
    const [tabInfo, setTabInfo] = useState<chrome.tabs.Tab>(null);
    const [turningOn, setTurningOn] = useState<boolean>(false);

    useEffect(() => {
        verifyValidPage();
    }, []);

    useEffect(() => {
        sendMessagePromise({
            from: extensionNames.popup,
            to: extensionNames.background,
            order: [orderNames.sendStatus],
        }).then((res: iResponse) => {
            const { isSubtitleCapturing, isExTranscriptStructured } = res.state;
            setBuilding(isSubtitleCapturing);
            setBuilt(isExTranscriptStructured);
            setTurningOn(isExTranscriptStructured);
        });
    }, []);

    // Check if active tab URL is valid.
    //
    // If it's valid URL, save that chrome.tabs.Tab[0] into tabInfo
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
                // ここで例外が発生する状況が想定できない
                // TODO: 実行不可能であることをViewで示す
            });
    };

    const handlerOfRun = (): void => {
        if (!tabInfo) throw new Error('Error: tabInfo is null');
        setBuilding(true);

        sendMessagePromise({
            from: extensionNames.popup,
            to: extensionNames.background,
            order: [orderNames.run],
            tabInfo: tabInfo,
        })
            // NOTE: !res.successはRUNするためのページ環境になっていないことを示し、実行不可能のエラーではない
            .then((res) => {
                const { success } = res;
                setBuilt(success);
                setBuilding(false);
            })
            .catch((e) => {
                setBuilt(false);
                setBuilding(false);
                setTurningOn(false);
                // NOTE: 実行不可能であることはalertを出すのでpopupでは何も表示しない
                console.error(e);
            });
    };

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

    // toggles handler according to turningOn value.
    //
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

    return (
        <ThemeProvider theme={theme}>
            <MainContent
                built={built}
                building={building}
                correctUrl={correctUrl}
                handlerOfToggle={handlerOfToggle}
            />
        </ThemeProvider>
    );
};

const root = document.createElement('div');
document.body.appendChild(root);
ReactDOM.render(<Popup />, root);