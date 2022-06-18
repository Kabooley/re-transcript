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

/*
  subtitlePiecesToChunks
  __________________________________________________
    @param subtitles {subtitle_piece[]}
    subtitle: Udemyの講義で流れてくる字幕一塊とその順番を表すindex

    用語の意味：
    piece: 破片  chunk: 塊
    pieceはパンくずで、chunkは1斤パンである
    chunksはスライスされた食パンのセットである

    整形処理の流れ:
    const chunks = subtitles.map( subtitle => {
    })

    subtitleの文末がピリオドまたはクエスチョンマークのsubtitleにであうまで、
    buff[]へsubtitle.subtitleをpushし続ける

    indexはbuff[]が空だった時だけ値を与える
    そうすることでbuff[]へ一番初めにpushされたsubtitleのindexだけ記憶できる

    このindex番号が後々字幕自動スクロールに必要になる

    文末がピリオドまたはハテナのsubtitleにであったらbuff[]とindexがプロパティの
    オブジェクトを生成して
    chunksへ返す

    以上が整形処理の流れ
*/
/***
 * subtitle pieces to chunks
 * 
 * @param {subtitle_piece[]} subtitles - Subtitle data just retrieved and not yet retouched.
 * @return {subtitle_piece[]} - Retouched subtitle data.
 * 
 * TODO: Size compare piece < chunk.なので名称を変更した方がいい。
 *  
 * */ 
const subtitlePiecesToChunks = function (
    subtitles: subtitle_piece[]
): subtitle_piece[] {
    var buff: string[] = [];
    var index: number = null;

    const chunks: subtitle_piece[] = subtitles.map(
        (subtitle: subtitle_piece): subtitle_piece => {
            // 塊を作り始める最初だけindexに値を与える
            if (buff.length === 0) {
                index = subtitle.index;
            }
            // TODO: substr() is DEPRECATED.
            const s = subtitle.subtitle.trim().substr(-1, 1);
            if (s === '.' || s === '?') {
                const piece = {
                    index: index,
                    subtitle: [...buff, subtitle.subtitle].join(' '),
                };
                // 次のchunkのためにリセットする
                buff = [];
                index = null;

                return piece;
            } else {
                // 文末ピリオドまたはハテナのsubtitleにであうまで
                // subtitleをpushし続ける
                buff.push(subtitle.subtitle);
            }
        }
    );

    // undefinedを取り除いて返す
    return chunks.filter((chunk: subtitle_piece) => chunk !== undefined);
};

/**
 *  Main Process
 *
 * */
const mainProcess = (): subtitle_piece[] => {
    const subtitlePieces = capturingSubtitle();
    const chunks: subtitle_piece[] = subtitlePiecesToChunks(subtitlePieces);

    return chunks;
};
