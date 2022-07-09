/**
 * Async functions with or without arguments,
 * or with multiple or singular arguments unknown.
 *
 * NOTE: Generics type T must be same as unknownConditionFunc.
 * 
 * */
export type unknownAsyncCallback<T> = (...args: any[]) => Promise<T>;
/**
 * Function that decides to continue or solved by check returned value from callback.
 *
 * NOTE: Generics type T must be same as unknownAsyncCallback.
 * */
export type unknownConditionFunc<T> = (arg: T) => boolean;

/**
 * Generate funciton that repeats itself asynchronously.
 *
 * @param {number} interval - Milli sec time while interval.
 * @param {unknownAsyncCallback} callback - Function that will be run repeatedly.
 * @param {unknownConditionFunc} condition - Function that decides to continue or solved by check returned value from callback.
 * @param {number} upTo - Repeat up to this number.
 * @returns {}
 * */
export const repeatPromiseGenerator = function <T>(
    // インターバル間隔
    interval: number,
    // setIntervalへ渡すコールバック関数
    callback: unknownAsyncCallback<T>,
    // callbackの戻り値を判定する関数
    condition: unknownConditionFunc<T>,
    // 何回繰り返すのか
    upTo: number
) {
    return function (): Promise<T> {
        return new Promise((resolve, reject) => {
            let intervalId: NodeJS.Timer;
            let counter: number = 0;

            intervalId = setInterval(async function () {
                if (counter >= upTo) {
                    clearInterval(intervalId);
                    reject();
                    // reject時に返す値も予め用意できない
                }
                const result: T = await callback();
                if (condition(result)) {
                    clearInterval(intervalId);
                    resolve(result);
                } else counter++;
            }, interval);
        });
    };
};

// //
// // ---- USAGE --------------------------------------------------------------------
// // codesandboxで動作確認可能
// //
// type asyncUnknownFunc<T> = (...args: any[]) => Promise<T>;
// type unknownFunc<T> = (arg: T) => boolean;
// interface subtitle_piece {
//     subtitle: string;
// }
// const INTERVAL_TIME: number = 1000;

// // 繰り返し実行したい関数
// const callback_ = async (): Promise<subtitle_piece[]> => {
//     // returns promise
//     return [
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//         { subtitle: 'this is subtitle' },
//     ];
// };

// // 繰り返し実行したい関数の戻り値を検査して判定結果をbooleanで返す関数
// const condition_ = (operand: subtitle_piece[]): boolean => {
//     // condition check
//     // return result as boolean;
//     return Math.floor(Math.random() * 9) ? true : false;
// };

// (async function () {
//     try {
//         const repeactCaptureSubtitlesTenTimes = repeatPromiseGenerator<subtitle_piece[]>(
//             INTERVAL_TIME,
//             callback_,
//             condition_,
//             10
//         );
//         const result: subtitle_piece[] = await repeactCaptureSubtitlesTenTimes();
//
//     } catch (e) {
//         console.error(e);
//     }
// })();
