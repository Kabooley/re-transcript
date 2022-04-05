/*******************************************************
 *  POPUP
 * _____________________________________________________
 *
 * NOTE:  state never retain its value!!
 *
 *******************************************************/

/*
TODO: 
    - Errorメッセージの表示
    - 後回しでいい LoadingButtonのLoadingの色を薄くしない


*/
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  iResponse,
  extensionNames,
  orderNames,
  urlPattern,
} from "../utils/constants";
import { sendMessagePromise } from "../utils/helpers";
import "./popup.css";
import MainContent from "./MainContent";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    // purple base
    primary: {
      main: "#6f006f",
      light: "#a200a2",
      dark: "#5e005e",
    },
    // Udemy theme color
    secondary: {
      main: "#5624d0",
      light: "#6939dd",
      dark: "#4a1fb3",
    },
  },
});

const Popup = (): JSX.Element => {
  // popupが開かれたときのURLが、拡張機能が有効になるべきURLなのか
  const [correctUrl, setCorrectUrl] = useState<boolean>(false);
  // RUNボタンが押されて、結果待ちの状態ならばtrue それ以外はfalse
  const [building, setBuilding] = useState<boolean>(false);
  // 正常に拡張機能が実行されたらtrue
  const [built, setBuilt] = useState<boolean>(false);
  // Saves Tab いらないかも...
  const [tabInfo, setTabInfo] = useState<chrome.tabs.Tab>(null);
  // toggleボタンがonならtrue
  const [turningOn, setTurningOn] = useState<boolean>(false);

  useEffect(() => {
    // NOTE: DON'T USE AWAIT inside of useEffect().
    console.log("[popup] OPENED");
    verifyValidPage();
  }, []);

  // Get current state from background script.
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

  //   const messageHandler = (): void => {};

  /***********************
   *
   *
   * NOTE: DO NOT use windowId.
   * Use {active:true, currentWindow: true, lastFocusedWindow: true}
   * for tabs.query instead.
   * */
  const verifyValidPage = (): void => {
    chrome.tabs
      .query({
        active: true,
        currentWindow: true,
        lastFocusedWindow: true,
      })
      .then((tabs: chrome.tabs.Tab[]) => {
        console.log(tabs);
        const r: RegExpMatchArray = tabs[0].url.match(urlPattern);
        console.log(`Is this page valid?: ${r && r.length ? true : false}`);
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
    if (!tabInfo) throw new Error("Error: tabInfo is null");
    setBuilding(true);
    console.log("[popup] Rebuilding...");

    sendMessagePromise({
      from: extensionNames.popup,
      to: extensionNames.background,
      order: [orderNames.run],
      tabInfo: tabInfo,
    })
      // NOTE: !res.successはRUNするためのページ環境になっていないことを示し、実行不可能のエラーではない
      .then((res) => {
        const { success } = res;
        console.log("[popup] Rebuilding Successfully Complete!");
        setBuilt(success);
        setBuilding(false);
      })
      .catch((e) => {
        setBuilt(false);
        setBuilding(false);
        setTurningOn(false);
        console.error(e.message);
        // TODO: 実行不可能であることをViewで示す
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
        // TODO: 実行不可能であることをViewで示す
        console.error(e);
      });
  };

  const handlerOfToggle = (): void => {
    turningOn
      ? (function () {
          console.log("[popup] Turning off...");
          setTurningOn(false);
          handlerOfTurnOff();
        })()
      : (function () {
          console.log("[popup] Turning on...");
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

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<Popup />, root);

// legacy code -------------
