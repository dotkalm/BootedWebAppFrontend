import type { HiddenImageProps } from "@/types";

const HiddenImage = ({
    canvasRef,
    imgRef,
    src,
}: HiddenImageProps) => {
    return (
        <img
            ref={imgRef}
            src={src}
            alt="Detection"
            onLoad={() => {
                const canvas = canvasRef.current;
                const img = imgRef.current;
                if (canvas && img) {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                }
            }}
            style={{ display: 'none' }}
        />
    );
}

export default HiddenImage;