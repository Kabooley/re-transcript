import React from 'react';
import Box from '@mui/material/Box';
import ReplaySharpIcon from '@mui/icons-material/ReplaySharp';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import HeaderPanel from './HeaderPanel';
import BuildButton from './BuildButton';
import MiddlePanel from './MiddlePanel';

interface iProps {
    isTranscriptEnabled: boolean;
    isSubtitleEnabled: boolean;
    building: boolean;
    built: boolean;
    turningOn: boolean;
    setBuilding: (flag: boolean) => void;
    setBuilt: (flag: boolean) => void;
    setTurningOn: (flag: boolean) => void;
    // correctUrl: boolean;
    // setTranscriptEnabled: (flag: boolean) => void;
    // setSubtitleEnabled: (flag: boolean) => void;
    // setCorrectUrl: (flag: boolean) => void;
}

const $PanelWidth = 330;

/*****
 * state管理：
 *
 * これまでcorrectUrlでありさえすれば、「ビルド中」「ビルド済」「展開中」の３つのstate管理で運用していたが
 * 今回から「トランスクリプトがONであるか否か」「字幕は英語であるか否か」もpopupに表示することになったので
 * transcript、subtitleの状態も取得する
 *
 * 各状態について：
 *    待機中でかつボタンを無効にする条件：   correctUrl && !isTranscriptEnabled || !isSubtitleEnabled
 *    待機中でかつボタンを有効にする条件：   correctUrl && isTanscriptEnabled && isSubtitleEnabled
 *    （ExTranscriptを）生成中にする条件：  correctUrl && isTanscriptEnabled && isSubtitleEnabled
 *                                        && building && !isBuilt && !turningOn
 *    展開中にする条件：                   correctUrl && isTanscriptEnabled && isSubtitleEnabled
 *                                        && !building && isBuilt && turningOn
 *    一時的に展開をオフにする条件：        correctUrl&& !building && !isBuilt && !turningOn
 *
 * TODO: ビルド後もtranscript enabledなど表示する + 実行中であることが分かるようにする
 * ****/
const ValidPanel = ({
    isTranscriptEnabled,
    isSubtitleEnabled,
    building,
    built,
    turningOn,
    setBuilding,
    setBuilt,
    setTurningOn,
}: iProps) => {
    const enableRebuildButton = isTranscriptEnabled && isSubtitleEnabled;

    // NOTE: stackblitzで動かすため本来の関数を簡略化している
    const handlerOfTurnOff = () => {
        setBuilt(false);
        setBuilding(false);
        setTurningOn(false);
    };

    // NOTE: stackblitzで動かすため本来の関数を簡略化している
    const handlerOfRun = () => {
        setBuilding(true);
    };

    /***
     * Toggles turningOn state.
     *
     * This would be invoked when REBUILD button or TURN OFF button clicked.
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
        <Box
            sx={{
                // my: 4,
                boxShadow: 3,
                width: `${$PanelWidth}px`,
                height: '230px',
            }}
        >
            <HeaderPanel height={'25%'}>
                <Tooltip title="Reload extension" color="secondary">
                    <IconButton>
                        <ReplaySharpIcon />
                    </IconButton>
                </Tooltip>
            </HeaderPanel>
            <Box
                sx={{
                    // my: 4,
                    width: '100%',
                    height: '45%',
                }}
            >
                <MiddlePanel
                    built={built}
                    building={building}
                    enableRebuildButton={enableRebuildButton}
                    isTranscriptEnabled={isTranscriptEnabled}
                    isSubtitleEnabled={isSubtitleEnabled}
                />
            </Box>
            <Box
                sx={{
                    // my: 4,
                    width: '100%',
                    height: '30%',
                    mx: 'auto',
                    my: 'auto',
                    paddingLeft: '14px',
                }}
            >
                <BuildButton
                    built={built}
                    building={building}
                    enableRebuildButton={enableRebuildButton}
                    handleToggle={handlerOfToggle}
                />
            </Box>
        </Box>
    );
};

export default ValidPanel;
