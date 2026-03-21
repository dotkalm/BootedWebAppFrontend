import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Image from 'next/image';
import githubLogo from '@/../public/Octicons-mark-github.svg';

export default function About() {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: {
          xs: 'center',
          sm: 'flex-start',
        },
        alignItems: 'center',
        py: 4,
        px: {
          xs: 2,
          sm: 4,
          md: 8,
          lg: 12,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          paddingLeft: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        <Image
          src={githubLogo}
          alt="GitHub"
          width={20}
          height={20}
          style={{ opacity: 0.7 }}
        />
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.875rem',
            paddingTop: {
              xs: '3px',
            }
          }}
        >
          view the source:{' '}
          <Link
            href="https://github.com/dotkalm/BootedWebAppFrontend"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            front end
          </Link>
          {' · '}
          <Link
            href="https://github.com/dotkalm/booted-server"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            back end
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
