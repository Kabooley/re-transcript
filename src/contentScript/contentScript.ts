/**********************************************************
 * content script
 *
 * Functionality:
 * 1. Watch if Transcript is turning on.
 * 2. Watch if subtitle language is English.
 * 3. Send result of 1 and 2 to background script.
 *
 * Watch control bar on Udemy movie container to detect click event on it.
 * Watch toggle buttons on control bar appeared or dispappeared by using moControlbar.
 * This content script will be injected dynamically.
 * Communicate with background script by using single message passing.
 *
 * *********************************************************/

import * as selectors from '../utils/selectors';
import {
    iMessage,
    iResponse,
    extensionNames,
    orderNames,
} from '../utils/constants';
import { sendMessagePromise, repeatActionPromise } from '../utils/helpers';
import { DomManipulationError, uError } from '../Error/Error';

//
// --- GLOBALS ---------------------------------------------------
//

const INTERVAL_TIME = 500;
// Delay to wait finish event.
const DELAY_AFTER_EVENT = 200;
let moControlbar: MutationObserver = null;
let controlbar: HTMLElement = null;

//
// --- CHROME API LISTENERS -------------------------------------
//

/**
 * Message Handler
 *
 * @param {iMessage} message
 * @param {function} sendResponse:
 * Invoke this function to response. The function is required.
 * @return {boolean} - MUST RETURN TRUE TO RUN sendResponse asynchronously.
 *
 *  1. sendStatus:
 *   Survey the subtitle language is English or not,
 *   and Transcript is open or not.
 *
 *  2. reset
 *    Run initialize() and respond result.
 *
 *  3. isPageIncludingMovie
 *    Survey the page is including Movie container or not.
 *
 *  4. turnOff
 *    Disconnect MutationObserver and remove event listener from Controlbar
 * */
chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender,
        sendResponse: (response: iResponse) => void
    ): boolean => {
        const { from, order, to } = message;
        const response: iResponse = {
            from: extensionNames.contentScript,
            to: from,
        };
        if (to !== extensionNames.contentScript) return;

        // ORDERS:
        if (order && order.length) {
            // SEND STATUS
            if (order.includes(orderNames.sendStatus)) {
                //
                try {
                    const isEnglish: boolean = isSubtitleEnglish();
                    let isOpen: boolean = false;
                    const toggle: HTMLElement =
                        document.querySelector<HTMLElement>(
                            selectors.controlBar.transcript.toggleButton
                        );
                    if (!toggle) isOpen = false;
                    else isOpen = isTranscriptOpen();

                    response.language = isEnglish;
                    response.isTranscriptDisplaying = isOpen;
                    // response.success = true;
                    response.complete = true;
                } catch (err) {
                    // response.success = false;
                    response.error = err;
                    response.complete = false;
                } finally {
                    sendResponse(response);
                }
            }
            // RESET
            if (order.includes(orderNames.reset)) {
                handlerOfReset()
                    .then(() => {
                        response.success = true;
                        response.complete = true;
                    })
                    .catch((e: uError) => {
                        console.error(e.message);
                        response.success = false;
                        response.complete = false;
                        response.error = e;
                    })
                    .finally(() => {
                        sendResponse(response);
                    });
            }

            // Is the page including Movie Container?
            if (order.includes(orderNames.isPageIncludingMovie)) {
                repeatCheckQueryAcquired(selectors.videoContainer, true)
                    .then((r: boolean) => {
                        response.isPageIncludingMovie = r;
                        response.complete = true;
                    })
                    .catch((err) => {
                        console.error(err);
                        response.complete = false;
                        response.error = err;
                    })
                    .finally(() => {
                        sendResponse(response);
                    });
            }
            // TURN OFF
            if (order.includes(orderNames.turnOff)) {
                moControlbar.disconnect();
                controlbar.removeEventListener('click', handlerOfControlbar);
                // moControlbar and controlbar should be null?
                response.complete = true;
                sendResponse(response);
            }
        }
        return true;
    }
);

/**
 *  Sends status of injected page to background.
 *
 * @param order:
 * @param {boolean} isOpened - True as Transcript is open.
 * @param {boolean} isEnglish - True as subtitle language is English.
 * */
const sendToBackground = async (order: {
    isOpened?: boolean;
    isEnglish?: boolean;
}): Promise<void> => {
    const { isOpened, isEnglish } = order;
    const m: iMessage = {
        from: extensionNames.contentScript,
        to: extensionNames.background,
    };

    if (isOpened !== undefined) {
        m['isTranscriptDisplaying'] = isOpened;
    }
    if (isEnglish !== undefined) {
        m['language'] = isEnglish;
    }

    await sendMessagePromise(m);
};

//
// ---- MAJOUR HANDLERS -----------------------------------------
//

/**
 * Handler of RESET order.
 *
 * Invoke initialize().
 * */
const handlerOfReset = async (): Promise<void> => {
    try {
        await initialize();
    } catch (e) {
        throw e;
    }
};

/**
 *  Handler of Click Event on Controlbar
 *
 * @param {PointEvent} ev
 *
 *
 * setTimeout() callback will be fired after click event has been done immediately.
 *
 * */
const handlerOfControlbar = function (ev: PointerEvent): void {
    //
    // Get DOMs among click event.
    const path: EventTarget[] = ev.composedPath();
    // DOM: toggle button of Transcript
    const transcriptToggle: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.transcript.toggleButton
    );
    // Toggle button of theater mode.
    const theaterToggle: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.theatre.theatreToggle
    );
    // Menu of Closed Caption
    const ccPopupMenu: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.cc.menuListParent
    );

    // Callback will be run after Click event has done.
    setTimeout(function () {
        // If either toggle button clicked...
        // Check Transcript toggle button is exist.
        // If exist, invoke isTranscriptOpen().
        // If no, send result to background script.
        if (path.includes(transcriptToggle) || path.includes(theaterToggle)) {
            let result: boolean;
            const t: HTMLElement = document.querySelector<HTMLElement>(
                selectors.controlBar.transcript.toggleButton
            );
            if (!t) result = false;
            else result = isTranscriptOpen();
            sendToBackground({ isOpened: result });
        }
        // If click event has happend in cc popup menu,
        // find out if the subtitle language has been changed,
        // or if subtitle setting has been changed.
        if (path.includes(ccPopupMenu)) {
            if (isItSelectLanguageMenu()) {
                const r: boolean = isSubtitleEnglish();
                sendToBackground({ isEnglish: r });
            }
        }
    }, DELAY_AFTER_EVENT);
};

//
// --- SURVEY METHODS --------------------------------------------
//

/**
 * Check Transcript is opened or not.
 *
 * @returns {boolean}: true for open, false for not open.
 *
 * Get DOM everytime this function invoked.
 * */
const isTranscriptOpen = (): boolean => {
    const toggleButton: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.transcript.toggleButton
    );
    return toggleButton.getAttribute('aria-expanded') === 'true' ? true : false;
};

/***
 * Is subtitle language is English?
 *
 *
 * @returns {boolean}: True as it's English, false as not.
 * @throws {DomManipulationError} : When dom acquisition failes.
 * Exception might be happen when selector is not matches.
 *
 * DOMs:
 * - listParent: Parent element of CC popup menu.
 * - checkButtons: Listed button elements on CC popup menu. It includes attributed that express selected or not.
 * - menuList: child elements of checkButtons's button element. The innerText includes languages that express subtitle languages.
 *
 * Process:
 * 1. Find out which language is selected by checking attribute boolean value.
 * 2. If it was true, save the counter of loop.
 * 3. Find out language by saved counter number.
 * 4. If it was English, then return true. (If no, return false).
 * */
const isSubtitleEnglish = (): boolean => {
    const listParent: HTMLElement = document.querySelector<HTMLElement>(
        selectors.controlBar.cc.menuListParent
    );
    const checkButtons: NodeListOf<HTMLElement> =
        listParent.querySelectorAll<HTMLElement>(
            selectors.controlBar.cc.menuCheckButtons
        );
    const menuList: NodeListOf<HTMLElement> =
        listParent.querySelectorAll<HTMLElement>(
            selectors.controlBar.cc.menuList
        );

    if (!listParent || !checkButtons || !menuList)
        throw new DomManipulationError('Failed to manipulate DOM');

    let counter: number = 0;
    let i: number = null;
    const els: HTMLElement[] = Array.from<HTMLElement>(checkButtons);
    for (const btn of els) {
        if (btn.getAttribute('aria-checked') === 'true') {
            i = counter;
            break;
        }
        counter++;
    }
    if (!i) {
        throw new Error(
            'Error: No language is selected or failed to retrieve DOM'
        );
    }

    const currentLanguage: string = Array.from(menuList)[i].innerText;
    if (currentLanguage.includes('English') || currentLanguage.includes('英語'))
        return true;
    else return false;
};

//
// --- OBSERVER METHODS -----------------------------------------
//

const config: MutationObserverInit = {
    attributes: false,
    childList: true,
    subtree: false,
};

/***
 * Watch controlbar
 * to find out transcript toggle button is appeared or disappeared.
 * Everytime appearing and disappearing, then let background script to know.
 *
 * */
const moCallback = (mr: MutationRecord[]): void => {
    let guard: boolean = false;
    mr.forEach((record) => {
        if (record.type === 'childList' && !guard) {
            guard = true;

            // Added Nodes
            record.addedNodes.forEach((node) => {
                const dataPurpose: string =
                    node.childNodes[0].parentElement.firstElementChild.getAttribute(
                        'data-purpose'
                    );
                if (dataPurpose && dataPurpose === 'transcript-toggle') {
                    sendToBackground({ isOpened: isTranscriptOpen() });
                }
            });

            // Removed Nodes
            record.removedNodes.forEach((node) => {
                const dataPurpose: string =
                    node.childNodes[0].parentElement.firstElementChild.getAttribute(
                        'data-purpose'
                    );
                if (dataPurpose && dataPurpose === 'transcript-toggle') {
                    sendToBackground({ isOpened: false });
                }
            });
        }
    });
};

//
// ---- OTHER METHODS -------------------------------------------
//

/***
 * Find out the element is exist which matches with passed selector.
 * @param {string} selector - Seletor that about to find out.
 * @return {boolean} - true as exist, false as not exist.
 * */
const investTheElementIncluded = (selector: string): boolean => {
    const e: HTMLElement = document.querySelector<HTMLElement>(selector);
    return e ? true : false;
};

/**************************************************
 * Repeat to run investTheElementIncluded function.
 *
 * @param {string} selector : selector for dom about to acquire.
 * @param {boolean} timeoutAsResolve: If true, then timeout will not occure error.
 * @return {boolean} : Return boolean result. True as dom acquired. False as not.
 *
 * */
const repeatCheckQueryAcquired = async (
    selector: string,
    timeoutAsResolve: boolean = false
): Promise<boolean> => {
    try {
        return await repeatActionPromise(
            function () {
                return investTheElementIncluded(selector);
            },
            timeoutAsResolve,
            100,
            10
        );
    } catch (e) {
        throw e;
    }
};

/*************************************************
 * Repeat to try query dom by given selector.
 * @param {string} selector: Selector for dom about to acquire.
 * @return {promise} represents HTMLElement as success.
 * @throws {DomManipulationError}
 *
 * */
const repeatQuerySelector = async (selector: string): Promise<HTMLElement> => {
    try {
        await repeatCheckQueryAcquired(selector);
        return document.querySelector<HTMLElement>(selector);
    } catch (err) {
        throw new DomManipulationError(
            `Error: Could not retrieve DOM with the selector ${selector}`
        );
    }
};

/***
 * Determine what the CC popup menu is showing.
 *
 * Menu might be...
 * - "Select subtitle language"
 * - "Setting of subtitle"
 *
 * @return {boolean} - True as the menu is showing "Select subtitle language" menu. False as "Setting of subtitle" menu.
 *
 * NOTE: DO INVOKE THIS FUNCTION everytime onClick event happend on CC popup menu!
 * */
const isItSelectLanguageMenu = (): boolean => {
    const menu: HTMLElement = document.querySelector<HTMLElement>(
        'div.control-bar-dropdown--menu--2bFbL.control-bar-dropdown--menu-dark--3cSQg > ul[data-purpose="captions-dropdown-menu"] > li[role="none"] > ul[aria-label="字幕"] > button'
    );
    return menu ? true : false;
};

/*****************************************
 *  Initialize for detecting injected page status.
 *
 *  set up controlbar click event listener.
 *  set up MutationObserver of controlbar.
 *
 * Among initialize process, stop MutationObserver.
 * And restart MutationObserver when done.
 * */
const initialize = async (): Promise<void> => {
    try {
        // For a moment stop MutationObserevr.
        if (moControlbar) moControlbar.disconnect();
        moControlbar = null;
        moControlbar = new MutationObserver(moCallback);
        // Retrieve controlbar DOM again.
        if (controlbar)
            controlbar.removeEventListener('click', handlerOfControlbar);
        controlbar = null;
        controlbar = await repeatQuerySelector(selectors.transcript.controlbar);
        controlbar.addEventListener('click', handlerOfControlbar);
        // Restart MutationObserver with retrieved controlbar DOM.
        moControlbar.observe(controlbar, config);
    } catch (err) {
        if (err instanceof DomManipulationError)
            console.error(`DomManipulationError: ${err.message}`);
        throw err;
    }
};

/**
 * Entry Point
 *
 * */
(function () {
    initialize().catch((e) => {
        chrome.runtime.sendMessage({
            from: extensionNames.contentScript,
            to: extensionNames.background,
            success: false,
            error: e,
        });
    });
})();
