import type { MainCanvasProps } from "@/types";
import Box from '@mui/material/Box';

const MainCanvas = ({ canvasRef }: MainCanvasProps) => (
    <Box
        component="canvas"
        ref={canvasRef}
        sx={{
            display: 'block !important',
            height: 'auto !important',
            maxWidth: '100% !important',
            width: '100% !important',
            position: 'relative !important',
        }}
    />
);

export default MainCanvas;