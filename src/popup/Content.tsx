/*********************************************************
 * Content
 *
 *
 * 仕様：
 * alertがtrueだとAlertMessageコンポーネントを表示する
 * alertは一旦trueになると指定時間(TIMERS.alertLifeTimer)後自動的にfalseに戻る
 * alertはpros.built && previousBuildingの時にtrueになる
 *
 * ********************************************************/
import * as React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import AlertMessage from "./AlertMessage";

// NOTE: alertTimer MUST BE OVER slideTimer + Slide timeout time
const TIMERS = {
  alertLifeTimer: 2800,
  slideTimer: 1600,
} as const;

/*********************************************************************
 * @param props
 * @param props.built: 拡張機能が実行中ならばtrue
 * @param props.building: 拡張機能がRUNされて構築中ならばtrue
 * @param props.correctUrl: Popupが開かれたときのURLが許可URLなのかどうか
 * @param props.handlerOfToggle: 実行/OFFボタンが押されたときに発火する関数
 *
 * */
export default function Content(props): JSX.Element {
  // True as displaying Alert
  const [alert, setAlert] = React.useState<boolean>(false);
  //   Ref is required by Slide component in AlertMessage.
  const _ref = React.useRef(null);
  // Save previous props.building value
  const previousBuilding: boolean = usePrevious(props.building);

  // もしもREBUILDINGが終わった瞬間ならばアラートをかける
  React.useEffect(function () {
    if (props.built && previousBuilding) {
      setAlert(true);
    }
  });

  // alertがtrueなら指定時間後にfalseに戻す
  React.useEffect(
    function () {
      let timer = null;
      if (alert) {
        timer = setTimeout(function () {
          setAlert(false);
        }, TIMERS.alertLifeTimer);
        return () => {
          clearTimeout(timer);
        };
      }
    },
    [alert]
  );

  /*****************************
   * 以前のpropsの状態を保持して返す関数
   *
   * 参考:
   * https://stackoverflow.com/questions/53446020/how-to-compare-oldvalues-and-newvalues-on-react-hooks-useeffect
   * https://blog.logrocket.com/accessing-previous-props-state-react-hooks/
   * */
  function usePrevious(value) {
    const ref = React.useRef();
    React.useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const generateRunButton = (): JSX.Element => {
    return (
      <Button
        sx={{
          // backgroundColor: 'purple',
          width: "80%",
        }}
        variant="contained"
        onClick={props.handlerOfToggle}
        color="primary"
      >
        REBUILD
      </Button>
    );
  };

  const generateLoadingButton = (): JSX.Element => {
    return (
      <LoadingButton
        sx={{
          width: "80%",
        }}
        color="secondary"
        loading={props.building}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="text"
        disabled={true}
      >
        REBUILDING...
      </LoadingButton>
    );
  };

  const generateSuccess = (): JSX.Element => {
    return (
      <AlertMessage timer={TIMERS.slideTimer} _ref={_ref} show={props.built}>
        <Alert
          sx={{
            width: "80%",
            "& 	.MuiAlert-message": {
              padding: 0,
            },
            "& .MuiAlert-icon": {
              padding: 0,
            },
          }}
          variant="filled"
          severity="success"
        >
          COMPLETE!
        </Alert>
      </AlertMessage>
    );
  };

  const generateTurnOffButton = (): JSX.Element => {
    return (
      <Grow in={true}>
        <Button
          sx={{
            // backgroundColor: 'blueviolet',
            width: "80%",
          }}
          variant="contained"
          onClick={props.handlerOfToggle}
          color="secondary"
        >
          TURN OFF
        </Button>
      </Grow>
    );
  };

  const content = (): JSX.Element => {
    let generated: JSX.Element = null;
    if (alert && props.built) {
      generated = null;
    } else if (props.built) {
      generated = generateTurnOffButton();
    } else if (props.building) {
      generated = generateLoadingButton();
    } else if (!props.building && !props.built) {
      generated = generateRunButton();
    }
    return generated;
  };

  const generateNotice = (): JSX.Element => {
    return (
      <Alert variant="outlined" severity="info" sx={{ width: "300px" }}>
        Extension is available on the Udemy lecture page
      </Alert>
    );
  };

  return (
    <Box
      sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
      ref={_ref}
    >
      {alert ? generateSuccess() : null}
      {props.correctUrl ? content() : generateNotice()}
    </Box>
  );
}

// const generateRunning = (): JSX.Element => {
//     return (
//       <Button
//         sx={{ backgroundColor: "purple", width: "80%" }}
//         variant="contained"
//         onClick={props.handlerOfToggle}
//         disabled={true}
//       >
//         Running...
//       </Button>
//     );
//   };
