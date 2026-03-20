import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import iphoneImage from '@/../public/iphone_lowres.png';
import { tokens } from '@/theme/tokens';

export default function CameraDemo() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        gap: { xs: 4, md: 8 },
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 4, md: 8 },
        px: { xs: 2, md: 4 },
      }}
    >
      {/* Left Column - Image */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: { xs: '100%', md: '50%' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            aspectRatio: '1',
          }}
        >
          <Image
            src={iphoneImage}
            alt="iPhone Camera Demo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </Box>
      </Box>

      {/* Right Column - Text */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: { xs: '100%', md: '50%' },
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: tokens.colors.primary,
            mb: 2,
          }}
        >
          Camera Demo
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: tokens.colors.text,
            lineHeight: 1.6,
            mb: 2,
          }}
        >
          Experience the power of real-time edge detection directly from your camera.
          Our advanced technology processes your video feed instantly, highlighting
          edges and contours in real-time.
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: tokens.colors.text,
            lineHeight: 1.6,
          }}
        >
          Perfect for developers, designers, and anyone interested in computer vision.
          Try it now and see the magic happen right in your browser.
        </Typography>
      </Box>
    </Box>
  );
}
