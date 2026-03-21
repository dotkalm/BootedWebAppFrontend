import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { springUpAnimation } from '@/theme/animations';
import { tokens } from '@/theme/tokens';

export default function Features() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pt: 2,
        pb: 6,
        px: 4,
        flexDirection: 'column',
        letterSpacing: '0.08em',
      }}
    >
      <motion.div
        initial={springUpAnimation.initial}
        whileInView={springUpAnimation.animate}
        viewport={{ amount: 0.8 }}
        transition={springUpAnimation.transition}
      >
        <Typography
          variant="h4"
          color="text.primary"
          sx={{
            fontWeight: 600,
            textAlign: 'justify',
            textAlignLast: 'center',
            lineHeight: 1.4,
            textShadow: `4px 4px 8px ${tokens.colors.renoSand}`,
          }}
        >
          Take a photo of a car, we provide the boot.
        </Typography>
      </motion.div>
      <motion.div
        initial={springUpAnimation.initial}
        whileInView={springUpAnimation.animate}
        viewport={{ amount: 0.8 }}
        transition={springUpAnimation.transition}
      >
          <Typography
          variant='h3'
          sx={{
            pt: 5,
          }}
          >
            🚗 👢
          </Typography>
      </motion.div>

    </Box>
  );
}
