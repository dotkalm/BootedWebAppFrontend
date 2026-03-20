import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useMediaQuery, useTheme } from '@mui/material';
import { springUpAnimation } from '@/theme/animations';
import iphoneImage from '@/../public/iphone_lowres.png';
import iphoneFlashImage from '@/../public/iphone_lowres_flash.png';
import corollaImage from '@/../public/corolla.webp';
import bootForCorollaImage from '@/../public/boot_for_corolla.png';
import { tokens } from '@/theme/tokens';
import BootedStamp from '@/components/BootedStamp';
import ChatBubble from '@/components/ChatBubble';
import TypingIndicator from '@/components/TypingIndicator';

export default function CameraDemo() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const slideDistance = isMobile ? 20 : 54.5;
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { 
          xs: 4, 
          sm: 4,
          md: 0,
          lg: 0,
        },
        alignItems: 'center',
        justifyContent: 'center',
        mx: {
          xs: 0,
          sm: 4,
        },
        paddingBottom: {
          xs: 4,
          sm: 0,
        },
        paddingTop: {
          xs: 4,
          sm: 0,
        },
        px: { 
          xs: 2, 
          md: 0 
        },
        paddingLeft: {
          xs: 2,
          sm: 6,
          md: 0,
        },
                /*
                background: `linear-gradient(
                   180deg,
                 #f0f0f0 0%,
                 #f0f0f0 20%,
                  ${tokens.colors.renoSand} 100%
                  )`,
                  */
      }}
    >
      {/* Left Column - Images */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: {
            xs: '100%', 
            sm: '35%',
            md: '50%',
          },
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
            <motion.div
              initial={{ scale: 1, x: 0, y: 0, rotateY: 0, rotateX: 0, rotateZ: 0 }}
              animate={[
                // @ts-expect-error - Framer Motion supports animation arrays but types don't reflect this
                {
                  scale: 0.5,
                  x: -80 - slideDistance,
                  y: 5,
                  rotateY: -12,
                  rotateX: 5,
                  rotateZ: 2,
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    delay: 1.5,
                  }
                },
                // @ts-expect-error - Framer Motion supports animation arrays but types don't reflect this
                {
                  rotateY: 0,
                  rotateX: 0,
                  rotateZ: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    delay: 2.5,
                  }
                }
              ]}
              style={{
                width: '100%',
                height: '100%',
                transformStyle: 'preserve-3d',
              }}
            >
              <Image
                src={corollaImage}
                alt="Corolla"
                width={140}
                height={283}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
              <motion.div
                initial={{ ...springUpAnimation.initial, opacity: 0 }}
                animate={{ ...springUpAnimation.animate, opacity: 1 }}
                transition={{
                  ...springUpAnimation.transition,
                  delay: 2.85,
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              >
                <Image
                  src={bootForCorollaImage}
                  alt="Boot on Corolla"
                  width={140}
                  height={283}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* iPhone - in front */}
          <motion.div
            initial={{
              y: 20,
              opacity: 0,
              rotateY: -12,
              rotateX: 5,
              rotateZ: 2,
            }}
            animate={[
              {
                y: 0,
                opacity: 1,
                rotateY: -12,
                rotateX: 5,
                rotateZ: 2,
                transition: springUpAnimation.transition,
              },
              {
                rotateY: 0,
                rotateX: 0,
                rotateZ: 0,
                transition: {
                  type: 'spring',
                  stiffness: 100,
                  damping: 20,
                  delay: 2.5,
                }
              }
            ] as any}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              translateY: '-50%',
              transformStyle: 'preserve-3d',
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                transition: {
                  duration: 0.15,
                  times: [0, 0.5, 1],
                  delay: 2.5,
                  ease: "linear"
                }
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              }}
            >
              <Image
                src={iphoneFlashImage}
                alt="iPhone Camera Demo Flash"
                fill
                style={{ objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>
        </Box>
      </Box>

      {/* Right Column - Chat Bubbles */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          gap: 2,
          width: {
            xs: '100%',
            md: '50%'
          },
          paddingRight: {
            xs: 0,
            sm: 3,
            md: 6,
            lg: 8,
            xl: 25,
          },
          transform: {
            xs: 'translateX(0)',
            sm: 'translateX(0)',
            md: 'translateX(-15%)',
            lg: 'translateX(-29%)',
            xl: 'translateX(-10dvw)',
          }
        }}
      >
        <motion.div
          initial={{ ...springUpAnimation.initial, y: 70 }}
          animate={[
            { ...springUpAnimation.animate, y: 70, transition: { ...springUpAnimation.transition, delay: 3.5 } },
            { y: 0, transition: { type: 'spring', stiffness: 200, damping: 30, delay: 4.5 } }
          ]}
        >
          <ChatBubble message="Hey... Is this your car?" type="outgoing" />
        </motion.div>
        <motion.div
          initial={springUpAnimation.initial}
          animate={springUpAnimation.animate}
          transition={{
            ...springUpAnimation.transition,
            delay: 4.5,
          }}
        >
          <TypingIndicator type="incoming" />
        </motion.div>
      </Box>
    </Box>
  );
}
