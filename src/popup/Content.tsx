/*********************************************************
 * Content
 *
 *
 * 仕様：
 * - alertがtrueだとAlertMessageコンポーネントを表示する
 * - alertは一旦trueになると指定時間(TIMERS.alertLifeTimer)後自動的にfalseに戻る
 * - alertはpros.built && previousBuildingの時にtrueになる
 *
 * ********************************************************/
// NOTE: React is required by Material UI.
import * as React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import Box from "@mui/material/Box";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Grow from "@mui/material/Grow";
import AlertMessage from "./AlertMessage";

/**
 * Slide timer for complete message.
 *
 * NOTE: alertTimer > (slideTimer + Slide timeout time)
 * */
const TIMERS = {
  alertLifeTimer: 2800,
  slideTimer: 1600,
} as const;

/**
 * Copies for POPUP display
 *
 * */
const copies = {
  complete: "COMPLETE!",
  rebuilding: "REBUILDING...",
  turnOff: "TURN OFF",
  rebuild: "REBUILD",
  invalidPage: "本機能はここではお使いいただけません",
} as const;

/**
 * @param props
 * @param { boolean} built - 拡張機能が実行中ならばtrue
 * @param { boolean} building - 拡張機能がRUNされて構築の最中ならばtrue
 * @param { boolean} correctUrl - Popupが開かれたときのURLが許可URLなのかどうか
 * @param { funciton } handlerOfToggle - 実行/OFFボタンが押されたときに発火する関数
 *
 * */
export default function Content(props): JSX.Element {
  // True as displaying Alert
  const [alert, setAlert] = React.useState<boolean>(false);
  // Ref is required by Slide component in AlertMessage.
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

  /***
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

  /***
   * Generate Rebuild button JSX
   *
   * */
  const generateRunButton = (): JSX.Element => {
    return (
      <Button
        sx={{
          width: "90%",
        }}
        variant="contained"
        onClick={props.handlerOfToggle}
        color="primary"
      >
        {copies.rebuild}
      </Button>
    );
  };

  /**
   * Generate loading button JSX
   *
   * */
  const generateLoadingButton = (): JSX.Element => {
    return (
      <LoadingButton
        sx={{
          width: "90%",
        }}
        color="secondary"
        loading={props.building}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="text"
        disabled={true}
      >
        {copies.rebuilding}
      </LoadingButton>
    );
  };

  /**
   * Generate Success message JSX
   *
   * NOTE: line-height must be 1.75 to unify popup height.
   * */
  const generateSuccess = (): JSX.Element => {
    return (
      <AlertMessage timer={TIMERS.slideTimer} _ref={_ref} show={props.built}>
        <Alert
          sx={{
            width: "90%",
            lineHeight: 1.75,
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
          {copies.complete}
        </Alert>
      </AlertMessage>
    );
  };

  /**
   * Generate turn off button JSX
   *
   * */
  const generateTurnOffButton = (): JSX.Element => {
    return (
      <Grow in={true}>
        <Button
          sx={{
            width: "90%",
          }}
          variant="contained"
          onClick={props.handlerOfToggle}
          color="secondary"
        >
          {copies.turnOff}
        </Button>
      </Grow>
    );
  };

  /****
   * Generater sort
   *
   * */
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
      <Alert
        variant="outlined"
        severity="info"
        sx={{ width: "90%", fontSize: "0.75rem" }}
      >
        {copies.invalidPage}
      </Alert>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pt: 1,
        pb: 1,
      }}
      ref={_ref}
    >
      {alert ? generateSuccess() : null}
      {props.correctUrl ? content() : generateNotice()}
    </Box>
  );
}
