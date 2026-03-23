import Box from '@mui/material/Box';
import { styles } from '@/styles';

interface FinalImageProps {
  src: string;
}

export default function FinalImage({ src }: FinalImageProps) {
  return (
    <Box
      component="img"
      src={src}
      sx={{
        ...styles.video,
      }}
    />
  );
}
