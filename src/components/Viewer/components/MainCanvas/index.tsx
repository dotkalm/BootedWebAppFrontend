import type { MainCanvasProps } from "@/types";

const MainCanvas = ({ canvasRef }: MainCanvasProps) => (
    <canvas
        ref={canvasRef}
        style={{
            display: 'block',
            maxWidth: '100%',
            width: '100%',
            height: 'auto',
        }}
    />
);

export default MainCanvas;