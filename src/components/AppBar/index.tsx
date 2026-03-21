'use client';

import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { tokens } from '@/theme/tokens';
import { springUpAnimation } from '@/theme/animations';

export default function AppBar() {
  const router = useRouter();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.div
      {...springUpAnimation}
      style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
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
          py: 2,
          height: 'auto',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            bgcolor: tokens.colors.ripeLemon,
            border: `4px solid ${tokens.colors.renoSand}`,
            borderRadius: 10,
            px: 4,
          }}
        >
                    <motion.div
            { ...springUpAnimation }
            transition={{
                  ...springUpAnimation.transition,
                  delay: 0.4,
              }
            }
          >
          <Typography
            variant='h5'
            color={tokens.colors.renoSand}
            sx={{
              pt: {
                xs: '8px',
                sm: '5px',
                textAlign: 'center',
              } 
            }}
          >
            "You got booted."<br/> 🚗 📸 😂 📲 😩 
          </Typography>
          </motion.div>

          <Box sx={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button
              color="inherit"
              variant='text'
              onClick={() => scrollToSection('features')}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                textTransform: 'none',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Typography
                variant='h6'
                color={tokens.colors.renoSand}
                sx={{
                  pt: '4px',
                }}
              >
                Features
              </Typography>
            </Button>
            <Button
              color="inherit"
              onClick={() => scrollToSection('about')}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                textTransform: 'none',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Typography
                variant='h6'
                color={tokens.colors.renoSand}
                sx={{
                  pt: '4px',
                }}
              >
                About
              </Typography>
            </Button>
            <Button
              variant="contained"
              size='small'
              onClick={() => router.push('/webcam')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                bgcolor: 'primary.main',
                minHeight: { xs: '32px', sm: '36px' },
                py: { xs: 0.5, sm: 1 },
                px: { xs: 2, sm: 3 },
                '&:hover': {
                  bgcolor: 'primary.dark'
                },
                border: `4px solid 'primary.main'`,
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              <Typography
                variant='body2'
                color={tokens.colors.ripeLemon}
                sx={{
                  pt: {
                    xs: '4px'
                  },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                }}
              >
                Get Started
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </motion.div>
  );
}
