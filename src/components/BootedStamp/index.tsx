import Box from '@mui/material/Box';
import Image from 'next/image';
import { motion } from 'framer-motion';
import wordmark from '@/../public/BOOTED_yellow.png';

interface BootedStampProps {
    delay?: number;
}

export default function BootedStamp({ delay = 0.5 }: BootedStampProps) {

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                img: {
                    width: {
                        xs: '80%',
                        md: '100%',
                    },
                    height: {
                        xs: '80%',
                        md: '100%',
                    },
                    maxWidth: '500px',
                }
            }}
        >
            <motion.div
                initial={{
                    scale: 0,
                    rotate: 4,
                    y: -100,
                }}
                animate={{
                    scale: 0.9,
                    rotate: 5,
                    y: 0,
                    x: 0,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    mass: 1,
                    delay,
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
                    src={wordmark}
                    alt="BOOTED Stamp"
                    width={500}
                    priority
                />
            </motion.div>
        </Box>
    );
}