import Box from '@mui/material/Box';
import Image from 'next/image';
import { motion } from 'framer-motion';
import bootedStamp from '@/../public/BOOTED.png';

export default function BootedStamp() {

    return (
        <Box
            sx={{
                position: 'absolute',
                zIndex: 1,
                display: 'flex',
                width: '100%',
                aspectRatio: '1920 / 823.109',
                overflow: 'visible',
                maxWidth: '100%',
                maxHeight: {
                    xs: 'calc(100vh - 350px)',
                    sm: 'calc(100vh - 100px)',
                },
                alignItems: {
                    xs: 'flex-start',
                    sm: 'center',
                },
                justifyContent: 'center',
                alignContent: 'center',
                pointerEvents: 'none',
            }}
        >
            <motion.div
                initial={{
                    scale: 0,
                    rotate: -15,
                    y: -100,
                }}
                animate={{
                    scale: 0.9,
                    rotate: -15,
                    y: 0,
                    x: 0,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    mass: 1,
                }}
                style={{
                    width: '60%',
                    maxWidth: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Image
                    src={bootedStamp}
                    alt="BOOTED Stamp"
                    width={500}
                    height={335}
                    style={{ width: '100%', height: 'auto' }}
                    priority
                />
            </motion.div>
        </Box>
    );
}