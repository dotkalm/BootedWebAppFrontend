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
        pb: 6,
        px: 2,
        flexDirection: 'column',
      }}
    >
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
