import React from 'react';
import Button from '@mui/material/Button';

interface iProps {
    built: boolean;
    building: boolean;
    enableRebuildButton: boolean;
    handleToggle: () => void;
}

/****
 * status:
 *  - 実行可能な状態 build:    enableRebuildButton && !built && !building
 *  - 生成中の状態 building  enableRebuildButttpn && !built && building
 *  - 実行中の状態 disable   built && !building
 *
 * ***/
const BuildButton = ({
    built,
    building,
    enableRebuildButton,
    handleToggle,
}: iProps) => {
    const renderDisabledButton = () => {
        return (
            <Button
                sx={{
                    width: '90%',
                    mt: '16px',
                }}
                variant="contained"
                // color="primary"
                disabled
            >
                {'rebuild'}
            </Button>
        );
    };

    const renderBuildButton = () => {
        return (
            <Button
                sx={{
                    width: '90%',
                    mt: '16px',
                }}
                variant="contained"
                onClick={handleToggle}
                color="primary"
            >
                {'rebuild'}
            </Button>
        );
    };

    const renderBuildingButton = () => {
        return (
            <Button
                sx={{
                    width: '90%',
                    mt: '16px',
                }}
                variant="contained"
                // color="secondary"
                disabled
            >
                {'building...'}
            </Button>
        );
    };

    const renderTurnOffButton = () => {
        return (
            <Button
                sx={{
                    width: '90%',
                    mt: '16px',
                }}
                variant="contained"
                onClick={handleToggle}
                color="error"
                // color="secondary"
            >
                {'Turn Off'}
            </Button>
        );
    };

    const isBuildButton = enableRebuildButton && !built && !building;
    const isBuildingButton = enableRebuildButton && !built && building;
    const isTurnOffButton = built && !building;
    // const isTurnOffButton = enableRebuildButton && built && !building;

    if (isBuildButton) {
        return renderBuildButton();
    } else if (isBuildingButton) {
        return renderBuildingButton();
    } else if (isTurnOffButton) {
        return renderTurnOffButton();
    } else {
        return renderDisabledButton();
    }
};

export default BuildButton;
