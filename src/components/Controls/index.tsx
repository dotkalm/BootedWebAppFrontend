import { Fragment } from 'react';

import Slider from '@mui/material/Slider';
import Zoom from '@/components/Zoom';
import { type TControlsProps } from '@/types';
import { styles } from '@/styles';

export default function Controls({
    captureError,
    detections,
    handleClick,
    handleSliderChange,
    handleSliderChangeCommitted,
    isLandscape,
    isUploading,
    maxZoom,
    orientation,
    totalCars,
    zoomLevel,
}: TControlsProps) {
    return (
        <Fragment>
            <Slider
                max={maxZoom}
                min={1}
                onChange={handleSliderChange}
                onChangeCommitted={handleSliderChangeCommitted}
                orientation={isLandscape ? 'vertical' : 'horizontal'}
                step={0.1}
                sx={isLandscape ? styles.sliderVertical : styles.sliderHorizontal}
                value={zoomLevel}
            />
            <Zoom
                orientation={orientation}
                zoomLevel={zoomLevel}
                totalCars={totalCars}
                detections={detections}
                isUploading={isUploading}
                captureError={captureError}
                handleClick={handleClick}
            />
        </Fragment>
    )
}