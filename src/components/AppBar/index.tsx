import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { tokens } from '@/theme/tokens';
import { springUpAnimation } from '@/theme/animations';
import bootedLogo from '@/../public/BOOTED_Brown.png';

export default function AppBar() {
  return (
    <motion.div
      {...springUpAnimation}
      style={{ width: '100%' }}
    >
      <MuiAppBar
        position="static"
        sx={{
          background: 'transparent',
          boxShadow: 'none',
          color: 'text.primary',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          alignContent: 'center',
          py: 2,
        }}
      >
      <Toolbar sx={{
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        alignContent: 'center',
        width: '90%',
        bgcolor: tokens.colors.ripeLemon,
        border: `4px solid ${tokens.colors.renoSand}`,
        borderRadius: 10,
        px: 4,
      }}>
          <Box sx={{ px:4, position: 'relative', height: { xs: 40, md: 50 }, width: { xs: 120, md: 150 } }}>
            <Image
              src={bootedLogo}
              alt="BOOTED"
              fill
              style={{ objectFit: 'contain', objectPosition: 'left' }}
              priority
            />
          </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            color="inherit"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Features
          </Button>
          <Button
            color="inherit"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            About
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </MuiAppBar>
    </motion.div>
  );
}
