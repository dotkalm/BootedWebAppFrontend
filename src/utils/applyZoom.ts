import type { TApplyZoomToCamera  } from '@/types';

export const applyZoomToCamera: TApplyZoomToCamera = async ({
    newZoom,
    videoRef,
    isApplyingZoomRef,
    setMaxZoom,
}) => {
    if (!videoRef.current?.srcObject || isApplyingZoomRef.current) return;

    const stream = videoRef.current.srcObject as MediaStream;
    const videoTrack = stream.getVideoTracks()[0];

    if (!videoTrack) return;

    isApplyingZoomRef.current = true;

    try {
      const capabilities = videoTrack.getCapabilities();
      if (capabilities.zoom) {
        setMaxZoom(capabilities.zoom.max || 3);

        // Apply zoom constraint
        await videoTrack.applyConstraints({
          advanced: [{ zoom: newZoom }] as any
        });

        console.log('Zoom applied successfully:', newZoom);
      }
    } catch (err) {
      console.error('Error applying zoom:', err);
    } finally {
      isApplyingZoomRef.current = false;
    }
  };