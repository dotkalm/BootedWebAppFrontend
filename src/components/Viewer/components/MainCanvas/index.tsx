import type { MainCanvasProps } from "@/types";

const MainCanvas = ({ canvasRef }: MainCanvasProps) => (
    <canvas
        ref={canvasRef}
        style={{
            display: 'block',
            height: 'auto',
            maxWidth: '100%',
            width: '100%',
        }}
    />
);

export default MainCanvas;