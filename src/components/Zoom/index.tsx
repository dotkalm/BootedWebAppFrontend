import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styles } from '@/styles';
import {
  Orientation, 
  type CarDetection, 
  type ShutterProps,
} from '@/types';

export default function Shutter({
    detections,
    handleClick,
    isUploading,
    orientation,
    totalCars,
    zoomLevel,
}: ShutterProps) {
    return (
        <Box sx={styles.zoomInfoContainer}>
          <Box sx={styles.shutterContainer}>
            {totalCars > 0 && `Total Cars Detected: ${totalCars}`}
            {detections.map(({ wheel_count }: CarDetection, index: number) => {
                return (wheel_count > 0) ? (
                  <Box key={index}>
                    {`car ${index + 1}: ${wheel_count} wheel(s) detected`}
                  </Box>
                ) : null;
            })}
          </Box>
          <Box sx={{
            ...styles.shutterContainer,
          }}>
            {/* Shutter button with click event to send current frame to api */}
            <Box
              sx={{
                ...styles.shutter,
                cursor: 'pointer',
                opacity: isUploading ? 0.5 : 1,
                transition: 'transform 0.1s ease',
                '&:active': {
                  transform: 'scale(0.95)',
                }
              }}
              onClick={handleClick}
            >
              <Box sx={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'white',
              }} />
            </Box>
            {/* Upload status indicator */}
          </Box>
          <Box sx={styles.shutterContainer}>
            {orientation === Orientation.LANDSCAPE && (
              <Typography sx={styles.zoomInfo}>
                Camera Zoom: {zoomLevel.toFixed(1)}x
              </Typography>
            )}
            {isUploading && (
              <Typography sx={{
                color: 'white',
                textAlign: 'center',
                mt: 1,
                fontSize: '0.8rem'
              }}>
                Uploading...
              </Typography>
            )}
          </Box>
        </Box>
    );
};