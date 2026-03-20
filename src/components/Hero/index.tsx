import Box from '@mui/material/Box';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ThreeScene from './components/ThreeScene';
import mustangImage from '@/../public/mustang_not_booted.jpg';
import bootForMustang from '@/../public/boot_for_mustang.png';

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'block',
        width: {
          xs: '100%',
          md: '80%',
          lg: '60%',
          xl: '50%',
        },
        aspectRatio: '1920 / 823.109',
        overflow: 'visible',
        maxWidth: '100%',
        maxHeight: {
          xs: 'calc(100vh - 350px)',
          sm: 'calc(100vh - 100px)',
        },
        img: {
          width: {
            xs: '100%',
            md: '50%',
          }
        },
        '.bootForMustang': {
          position: 'absolute',
          zIndex: 1,
        },
      }}
    >
      <motion.div
        className='bootForMustang'
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 10,
          mass: 0.8
        }}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <Image
          alt="parking enforcement boot for mustang"
          fill
          priority
          src={bootForMustang}
          style={{ objectFit: 'cover' }}
        />
      </motion.div>
      <Image
        alt="Hero Background"
        fill
        priority
        src={mustangImage}
        style={{ objectFit: 'cover' }}
      />
    </Box>
  );
}
