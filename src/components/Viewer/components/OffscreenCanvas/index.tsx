import type { OffscreenCanvasProps } from "@/types";

const OffScreenCanvas = ({ base2dCanvasRef }: OffscreenCanvasProps) => (
      <canvas
        ref={base2dCanvasRef}
        style={{ display: 'none' }}
      />
);

export default OffScreenCanvas;