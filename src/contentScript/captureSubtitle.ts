/********************************************************
 * Capture Subtitles
 * __________________________________________________
 *
 * このcontent scriptは動的にwebページへinjectされる
 *
 * 機能：
 *  1. 要請が来るたび、字幕を取得し、整形しなおす
 *  2. 整形字幕データを送信する
 *
 * リセット処理：
 *  必要ない
 *  order.resetに対応するときにおいて、
 *  DOM Manipulationは関数内部で実行時のみに行われるので
 *  イベントリスナなど付け替える必要がない
 *
 * 例外：
 * capturingSubtitle()でSuntaxErrorが起こる可能性があるかも
 *
 *
 * NOTE:
 *
 * このcontent scriptの機能が呼び出される状況は、DOMがページに
 * ローディング済であることを前提とする
 * なのであらゆるローディング待機の処理を持たない
 *
 *
 *********************************************************/
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
 * chrome.runtime.onMessage.addListener()
 * _______________________________________
 *
 * 次のorderに応対する
 * - captureSubtitle: 字幕を取得して送信する
 *
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
 * @throws {SyntaxError}
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
        // Array.from(null)でSyntaxError. spansがnullだった可能性がある
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
 *  Main Process Manager
 *
 *
 * */
const mainProcess = (): subtitle_piece[] => {
    const subtitlePieces = capturingSubtitle();
    const chunks: subtitle_piece[] = subtitlePiecesToChunks(subtitlePieces);

    return chunks;
};

/*
9/28:

    setTimeout(() => {}, 10000)
    chrome extensionのcontent scriptsはとっくに'load'イベントが過ぎたときにscriptをwebページに挿入するので
    発火タイミングを設定するのが無理
    なのでsetTimeout()を便宜上設定している


9/29:

    現時点でピリオド終了の文章の塊ができている
    文章の塊にインデックスをつけた（index番号はpiecesの順番ではなくてwebページから取得したときの順番のうち、塊にしたときに）
    文字列の連結を生成しているだけなので当然改行は含まれない
    'undefined'が生成されている(何かの文章は失われていないと思われるけど不安)   : 未解決


    `const piece = [...buff, string.text];`は
    string.textが空の時にpieceが[undefined]になる

    で、Array.prototype,join()は[undefined]がわたされても空の文字列を返す
    なので
    mapは空の文字列を返すはずで、undefinedにはならないはずなんだけどな～

                // temporary for debuging.
            if( piece.join(' ') === undefined) {
                console.log(piece.join(' '))
            }
    というのを追加してみたけどundefinedは検出されず

    ひとまず無視する


10/6:
    popup.jsと通信する
    popup.jsでボタンが押されてから字幕取得できるようにする

    popup.jsとcontentScript.jsとで通信する
        popup.js request to capture subtitles 
        contentScript got request and begin to capture subtitles


10/17: 自動スクロールの検知


    detectScroll()
    実現すること：
            Udemyの講義ページで、
            transcriptの字幕のうち現在表示されている字幕である「ハイライトされた字幕」要素と
            そのハイライト字幕要素の含まれる要素群の中での順番を取得したい

    内容:
    - ハイライト字幕が変更になったことを示すイベントの取得
            MutationObserverを使う
            moを字幕要素すべてにつけて、classが変更になったら発火するしくみをつくった

    - どの要素がハイライトされているのかの取得
            MutationObserverが発火したら実行されるコールバック関数内部で
            ハイライトされるcssセレクタ名を付けられている要素をquerySelectorで取得する

            実はUdemyのtranscriptはなぜだか字幕要素が「ダブる」ことがあり
            querySelectorAllとかするとまったく同じ字幕要素が複数取得する場合がある

            なのでquerySelector()で取得すれば
            たとえだぶっていても初めに一致した要素だけ返してくれる

    - ハイライト要素とその番号の更新
            ハイライト要素とその番号はcurrentHighlight()モジュールで管理している
            このモジュールを先の処理で取得した要素とその番号に更新する

10/21:
自動スクロール検知の件：

            detectScroll()で取得した字幕番号と、main()で取得している整形した字幕番号は一致している
            （というのを雑に確認した。ちゃんとやりたいけどそれは後回しでいい）

字幕整形の件：(全然今のところ優先度高くない)
            1.
            subtitlePiecesToChunks()の戻り値の配列にundefinedが入り込むのを何とかしたい
            undefinedの代わりに空文字列にしたい
            undefinedのままだと何かしらのエラーでundefinedなのかどうか判断できない

            2.
            ピリオド区切りだと一つの字幕の塊が長くなりすぎる
            '?'も区切り文字の一つとして登録する

整形字幕埋め込みの件:

            CSSの出番ですね...
            - とりあえず字幕をUdemyの講義ページに埋め込めることができるのか確認する
            - 埋め込めるならばCSSで飾り付ける
            - 埋め込めるならば任意の場所に字幕windowsを表示できるようにしたい

整形字幕も自動スクロールさせる件：



10/23:

  整形字幕埋め込みの件


11/12:

    contentScript.tsでスクレイピングしたデータを保存する
    


1/11:

  自動スクロール検知機能はたぶんcontroller.jsへ移したので
  こちらでは凍結する
  （未確認）
*/

// --- LEGCAY CODE ---------------------------------

// // ---- Follow Auto-scroll Methods ------------------------------

// const currentHighlight = (function () {
//   var index: number = 0;
//   var element: Element = null;

//   return {
//     getCurrentHighlight: function () {
//       return Object.assign({}, { index, element });
//     },
//     setCurrentHighlight: function ({ i, e }: { i: number; e: Element }) {
//       index = i;
//       element = e;
//     },
//     resetCurrentHighlight: function () {
//       index = 0;
//       element = null;
//     },
//   };
// })();

/*
    本家の自動スクロール機能を追跡する
    自動スクロールで現在ハイライトされている字幕要素を追跡する

    具体的には
    トランスクリプト上の字幕要素には番号を順番に振り、
    ハイライトされている字幕が映るたびに検知して次のハイライト要素とその番号を取得する
*/
// const detectScroll = (): void => {
//   const _callback = (mr: MutationRecord[]): void => {
//     const latestHighlight = document.querySelector(selectors.highlight);
//     var latestIndex: number;

//     // Update
//     const list: NodeListOf<HTMLSpanElement> = document.querySelectorAll(
//       selectors.transcripts
//     );
//     latestIndex = getElementIndexOfList(list, latestHighlight);
//     if (latestIndex === -1) {
//       console.error(
//         "Error: [detectScroll()] No elements is matched in transcript"
//       );
//     } else {
//       currentHighlight.setCurrentHighlight({
//         i: latestIndex,
//         e: latestHighlight,
//       });

//       console.log("OBSERVED");
//       console.log(latestHighlight);
//       console.log(currentHighlight.getCurrentHighlight());
//     }
//   };

//   const observer = new MutationObserver(_callback);

//   // configuration of the observer:
//   const config = { attributes: true, childList: false, subtree: false };

//   //   target: span
//   const transcripts: NodeListOf<Element> = document.querySelectorAll(
//     selectors.transcripts
//   );

//   // set observer
//   transcripts.forEach((ts, index) => {
//     // pass in the target node, as well as the observer options
//     observer.observe(ts, config);
//   });
// };

// // いらないかも...
// const setCurrentHighlight = (): void => {
//   var count: number = 0;
//   const list: NodeListOf<Element> = document.querySelectorAll(
//     selectors.transcripts
//   );
//   const highlight: Element = document.querySelector(selectors.highlight);

//   for (const el of Array.from(list)) {
//     if (el === highlight) {
//       currentHighlight.setCurrentHighlight({ i: count, e: el });
//       break;
//     }
//     count++;
//   }
// };

// const getElementIndexOfList = (
//   from: NodeListOf<Element>,
//   lookFor: Element
// ): number => {
//   var num: number = 0;
//   for (const el of Array.from(from)) {
//     if (el === lookFor) return num;
//     num++;
//   }
//   // 一致するものがなかった場合
//   return -1;
// };

// Duplicated 2/3
//
// const state = (function () {
//   let _chunks: subtitle_piece[] = [];

//   return {
//       setChunks: (c: subtitle_piece[]): void => {
//           // 常に上書き
//           // 一旦全て配列を空にして
//           // shallow copyを渡す
//           _chunks.splice(0, _chunks.length);
//           _chunks = c.map((subtitle) => {
//               return { ...subtitle };
//           });
//       },
//       getChunks: (): subtitle_piece[] => {
//           // copyを渡すこと
//           return _chunks.map((c) => {
//               return { ...c };
//           });
//       },
//       lengthOfChunks: (): number => {
//           return _chunks.length;
//       },
//   };
// })();
