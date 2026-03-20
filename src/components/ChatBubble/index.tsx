import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ChatBubbleProps {
  message: string;
  type: 'incoming' | 'outgoing';
}

export default function ChatBubble({ message, type }: ChatBubbleProps) {
  const isOutgoing = type === 'outgoing';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          px: 2,
          py: 1.5,
          borderRadius: isOutgoing ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          backgroundColor: isOutgoing ? '#007AFF' : '#E5E5EA',
          color: isOutgoing ? '#FFFFFF' : '#000000',
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontSize: '16px',
            lineHeight: 1.4,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}
