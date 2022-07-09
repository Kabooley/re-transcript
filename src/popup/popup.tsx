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
        // Ud*my theme color
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
 *
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
