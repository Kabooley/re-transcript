import { iMessage, iResponse } from "../utils/constants";
import { DomManipulationError } from "../Error/Error";


export const deepCopier = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

export const sendMessageToTabsPromise = async (
  tabId: number,
  message: iMessage
): Promise<iResponse> => {
  return new Promise(async (resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, async (response: iResponse) => {
      const { complete, ...rest } = response;
      complete
        ? resolve(rest)
        : reject("Send message to tabs went something wrong");
    });
  });
};

export const sendMessagePromise = async (
  message: iMessage
): Promise<iResponse> => {
  return new Promise(async (resolve, reject) => {
    chrome.runtime.sendMessage(message, async (response: iResponse) => {
      const { complete, ...rest } = response;
      if (complete) resolve(rest);
      else reject();
    });
  });
};

export const tabsQuery = async (): Promise<chrome.tabs.Tab> => {
  try {
    const w: chrome.windows.Window = await chrome.windows.getCurrent();
    const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({
      active: true,
      windowId: w.id,
    });

    return tabs[0];
  } catch (err) {
    console.error(err.message);
  }
};

// # mark以下を切除した文字列を返す
// なければそのまま引数のurlを返す
export const exciseBelowHash = (url: string): string => {
  return url.indexOf("#") < 0 ? url : url.slice(0, url.indexOf("#"));
};

/*********************
 * Repeat given async callback function.
 *
 * @param {action} Function:
 * the function that will be executed repeatedly.
 * NOTE: Function must returns boolean.
 * @param {timesoutResolve} boolean: true to allow this function to return false.
 * @param {times} number: Number that how many times repeat.
 * Default to 10.
 * @param {interval} number: Microseconds that repeat interval.
 * Default to 200.
 * @return {Promise} Promise objects represents boolean. True as matched, false as no-matched.
 * @throws
 *
 * 参考：https://stackoverflow.com/questions/61908676/convert-setinterval-to-promise
 *
 * 参考：https://levelup.gitconnected.com/how-to-turn-settimeout-and-setinterval-into-promises-6a4977f0ace3
 * */
export const repeatActionPromise = async (
  action: () => boolean,
  timeoutAsResolve: boolean = false,
  interval: number = 200,
  times: number = 10
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    let intervalId: NodeJS.Timer;
    let triesLeft: number = times;

    intervalId = setInterval(async function () {
      console.log(`loop tries left...${triesLeft}`);
      if (await action()) {
        clearInterval(intervalId);
        // 正常な終了としてtrueを返す
        resolve(true);
      } else if (triesLeft <= 1 && timeoutAsResolve) {
        clearInterval(intervalId);
        // 正常な終了でfalseを返す
        resolve(false);
      } else if (triesLeft <= 1 && !timeoutAsResolve) {
        clearInterval(intervalId);
        // 例外エラーとしてcatchされる
        reject();
      }
      triesLeft--;
    }, interval);
  });
};

// --- USAGE EXAMPLE --------------------------------------
// const randomMath = (): boolean => {
//   return Math.random() * 0.8 > 400 ? true : false;
// }

// const repeatQuerySelector = async (): Promise<boolean> => {
//   try {
//     // 第二引数をfalseにすると、ループで一度もマッチしなかった場合、例外エラーになる
//     // なので例外エラーにしたくなくて、falseも受け取りたいときは
//     // 第二引数をtrueにすること
//       const r: boolean = await repeatActionPromise(
//           function(): boolean {return randomMath()}, true
//       );
//       return r;
//   }
//   catch(err) {
//     console.log("caught error");
//       // console.error(`Error: Could not query dom. ${err.message}`)
//       throw err;
//   }
// }

// (async function() {

//   const res = await repeatQuerySelector();
//   console.log("RESULT:");
//   console.log(res);
// })();

/****************
 * Wrapper of setTimeout with given function.
 *
 *
 * */
export const delay = (action: () => any, timer: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      const r = action();
      resolve(r);
    }, timer);
  });
};
