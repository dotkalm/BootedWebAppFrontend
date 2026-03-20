import Box from '@mui/material/Box';
import Hero from '@/components/Hero';
import BootedStamp from '@/components/BootedStamp';

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
                background: 'linear-gradient(180deg, #f0f0f0 0%, #f0f0f0 30%, #ffffff 100%)',
            }}
        >
            <BootedStamp />
            <Hero />
        </Box>
    )
}