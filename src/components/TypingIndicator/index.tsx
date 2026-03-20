import Box from '@mui/material/Box';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  type: 'incoming' | 'outgoing';
}

export default function TypingIndicator({ type }: TypingIndicatorProps) {
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
          px: 2,
          py: 1.5,
          borderRadius: isOutgoing ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          backgroundColor: isOutgoing ? '#007AFF' : '#E5E5EA',
          display: 'flex',
          gap: 0.5,
          alignItems: 'center',
          minHeight: '40px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: isOutgoing ? '#FFFFFF' : '#8E8E93',
              }}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
}
