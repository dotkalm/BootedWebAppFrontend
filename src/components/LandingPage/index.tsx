'use client';

import Box from '@mui/material/Box';
// import AppBar from '@/components/AppBar';
import Hero from '@/components/Hero';
import BootedStamp from '@/components/BootedStamp';
import { tokens } from '@/theme/tokens';
import AppBar from '../AppBar';
import CameraDemo from '@/components/CameraDemo';
import ReadyToBegin from '@/components/ReadyToBegin';
import Features from '@/components/Features';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function LandingPage() {
    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                background: `linear-gradient(
                   180deg,
                 #f0f0f0 0%,
                 #f0f0f0 40%,
                  ${tokens.colors.renoSand} 100%
                  )`,
            }}
        >
            {/*<AppBar />*/}
            <AppBar />
            <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Hero />
            <BootedStamp delay={.5} styleOverride={{
              transform: {
                xs: 'translateY(-5px)',
              },
              img: {
                width: {
                  xs: '90dvw',
                  sm: '60dvw',
                  xl: '30dvw',
                },
                height: {
                  xs: 'auto',
                  sm: 'auto',
                }
              }
            }}/>
            </Box>
            <CameraDemo />
            <ReadyToBegin />
            <Box id="features">
                <Features />
            </Box>
            <Box id="about" sx={{ width: '100%', alignSelf: 'stretch' }}>
                <About />
            </Box>
            <Footer />
        </Box>
    )
}
// <BootedStamp />