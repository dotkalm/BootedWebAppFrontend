import Box from '@mui/material/Box';
import Image from 'next/image';
import ThreeScene from './components/ThreeScene';
import mustangImage from '@/../public/mustang.jpeg';

export default function Hero() {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        aspectRatio: '1920 / 823.109',
        overflow: 'visible',
        maxWidth: '100%',
        maxHeight: {
          xs: 'calc(100vh - 350px)',
          sm: 'calc(100vh - 100px)',
        },
        transform: 'rotate(-180deg)',
      }}
    >
      <Image
        src={mustangImage}
        alt="Hero Background"
        fill
        style={{ objectFit: 'cover' }}
        priority
      />
      <ThreeScene />
    </Box>
  );
}
