'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { springUpAnimation } from '@/theme/animations';
import { tokens } from '@/theme/tokens';

export default function ReadyToBegin() {
  const router = useRouter();
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pt: {
          xs: 0,
          sm: '10vh',
        },
        pb: 8,
      }}
    >
      <motion.div
        initial={springUpAnimation.initial}
        whileInView={springUpAnimation.animate}
        viewport={{ amount: 0.8 }}
        transition={springUpAnimation.transition}
      >
        <Button
          variant="contained"
          size="medium"
          onClick={() => router.push('/webcam')}
          sx={{
            backgroundColor: tokens.colors.ripeLemon,
            color: tokens.colors.renoSand,
            border: `4px solid ${tokens.colors.ripeLemon}`,
            borderRadius: 10,
            px: 4,
            pt: {
              xs: 1.6,
            },
          }}
        >
          <Typography
            variant="h5"
            color="text.primary"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Ready To Begin?
          </Typography>
        </Button>
      </motion.div>
    </Box>
  );
}
