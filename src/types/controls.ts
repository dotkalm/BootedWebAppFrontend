import type { ShutterProps } from '@/types';

export interface TControlsProps extends ShutterProps {
    isLandscape: boolean;
    maxZoom: number;
    handleSliderChange: (event: Event, value: unknown) => void;
    handleSliderChangeCommitted: (event: Event | React.SyntheticEvent, value: unknown) => void;
}