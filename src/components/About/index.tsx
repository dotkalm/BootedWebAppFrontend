import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function About() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: {
          xs: 'center',
          sm: 'flex-start',
        },
        alignItems: 'flex-start',
        py: 4,
        px: {
          xs: 2,
          sm: 4,
          md: 8,
          lg: 12,
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          textAlign: 'left',
          color: 'text.secondary',
          paddingLeft: {
            xs: 0,
            sm: 2,
          },
        }}
      >
        2026 -{' '}
        <Link
          href="https://joelholmberg.com"
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
          Joel Holmberg
        </Link>
      </Typography>
    </Box>
  );
}
