/*********************************************************
 * Capture Subtitles
 *
 * Features:
 * 1. Retrieve subtitle data and retouch it at every request.
 * 2. Send retouched data to background script.
 *
 * Prerequisities:
 * The web page this script will be injected must has been DOM loaded already.
 *
 * This content script will be injected dynamically.
 * Exception error will be sent to background script.
 *
 * ********************************************************/
import * as selectors from '../utils/selectors';
import {
    iMessage,
    iResponse,
    orderNames,
    extensionNames,
    subtitle_piece,
} from '../utils/constants';

// --- chrome API Listener --------------------------------

/**
 * Accept `sendStatus` order.
 * */
chrome.runtime.onMessage.addListener(
    (
        message: iMessage,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response: iResponse) => void
    ): void => {
        const { from, to, order } = message;
        if (to !== extensionNames.captureSubtitle) return;
        const r: iResponse = {
            from: extensionNames.captureSubtitle,
            to: from,
        };

        if (order && order.length) {
            if (order.includes(orderNames.sendSubtitles)) {
                try {
                    const chunks: subtitle_piece[] = mainProcess();
                    r.subtitles = chunks;
                    r.complete = true;
                } catch (e) {
                    r.complete = false;
                    r.error = e;
                } finally {
                    sendResponse(r);
                }
            }
        }
    }
);

// -- Capture Methods -----------------------------------

/**********************************************
 * @return {subtitle_piece[]}
 * @throws {SyntaxError} - In case document.querySelectorAll fails to get DOM.
 *
 * */
const capturingSubtitle = (): subtitle_piece[] => {
    try {
        const spans: NodeListOf<HTMLSpanElement> =
            document.querySelectorAll<HTMLSpanElement>(
                selectors.transcript.transcripts
            );

        const subtitles: subtitle_piece[] = Array.from(spans).map(
            (span, index): subtitle_piece => {
                return { index: index, subtitle: span.innerText.trim() };
            }
        );
        return subtitles;
    } catch (e) {
        // Array.from(null)でSyntaxError. spansがnullだった可能性有
        throw e;
    }
};

/***
 * subtitle pieces to chunks
 *
 * @param {subtitle_piece[]} subtitles - Subtitle data just retrieved and not yet retouched.
 * @return {subtitle_piece[]} - Retouched subtitle data.
 *
 * Variables name:
 * - piece: An element in argument.
 * - block: Retouched element.
 *
 * Retouch process:
 *
 * ```
 *  const blocks = subtitles.map();
 * ```
 * 1. Keep push piece of subtitle into buff until its subtitle has period or question charactor at end of sentence.
 * 2. If subtitle has period or question charactor, then make buff turn to element of block.
 * 3. Then clear buff and go next.
 *
 * */
const subtitlesPiecesToBlocks = function (
    subtitles: subtitle_piece[]
): subtitle_piece[] {
    var buff: string[] = [];
    var index: number = null;

    const blocks: subtitle_piece[] = subtitles.map(
        (subtitle: subtitle_piece): subtitle_piece => {
            // Give index if buff is emptry to keep the block has same index at each element.
            if (buff.length === 0) {
                index = subtitle.index;
            }
            // If sentence is period or question, then return buff and index as object.
            // TODO: substr() is DEPRECATED.
            const s = subtitle.subtitle.trim().substr(-1, 1);
            if (s === '.' || s === '?') {
                const piece = {
                    index: index,
                    subtitle: [...buff, subtitle.subtitle].join(' '),
                };
                // Reset for next loop.
                buff = [];
                index = null;

                return piece;
            } else {
                // Keep pushing subtitle piece into buff until it has period or question charactor at end of sentence.
                buff.push(subtitle.subtitle);
            }
        }
    );

    // Removing undefined element.
    return blocks.filter((block: subtitle_piece) => block !== undefined);
};

/**
 *  Main Process
 *
 * */
const mainProcess = (): subtitle_piece[] => {
    const subtitlePieces = capturingSubtitle();
    const chunks: subtitle_piece[] = subtitlesPiecesToBlocks(subtitlePieces);

    return chunks;
};
