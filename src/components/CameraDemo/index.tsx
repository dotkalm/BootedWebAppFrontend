import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { springUpAnimation } from '@/theme/animations';
import iphoneImage from '@/../public/iphone_lowres.png';
import corollaImage from '@/../public/corolla.webp';
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
      {/* Left Column - Images */}
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
            height: { xs: '300px', sm: '400px' },
            aspectRatio: '1',
            perspective: '1000px',
          }}
        >
          {/* Corolla - slides in from behind */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 20,
              delay: 0.5,
            }}
            style={{
              position: 'absolute',
              right: '-25%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '85%',
              height: 'auto',
              zIndex: 0,
            }}
          >
            <Image
              src={corollaImage}
              alt="Corolla"
              width={140}
              height={283}
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </motion.div>

          {/* iPhone - in front */}
          <motion.div
            initial={{
              y: 20,
              opacity: 0,
              skewY: 8,
              rotateZ: 3,
            }}
            animate={{
              y: 0,
              opacity: 1,
              skewY: 8,
              rotateZ: 3,
            }}
            transition={springUpAnimation.transition}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              translateY: '-50%',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Image
              src={iphoneImage}
              alt="iPhone Camera Demo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </motion.div>
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
