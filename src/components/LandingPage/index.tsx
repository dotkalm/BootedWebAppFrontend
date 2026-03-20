import Box from '@mui/material/Box';
// import AppBar from '@/components/AppBar';
import Hero from '@/components/Hero';
import BootedStamp from '@/components/BootedStamp';
import { tokens } from '@/theme/tokens';
import AppBar from '../AppBar';
import CameraDemo from '@/components/CameraDemo';

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
                gap: 4,
                background: `linear-gradient(180deg, #f0f0f0 0%, #f0f0f0 70%, ${tokens.colors.renoSand} 100%)`,
            }}
        >
            {/*<AppBar />*/}
            <AppBar />
            <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Hero />
                <BootedStamp delay={0.8} />
            </Box>
            <CameraDemo />
        </Box>
    )
}
// <BootedStamp />