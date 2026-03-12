import type { Meta, StoryObj } from '@storybook/react';
import Button from './index';
import { ThemeProvider } from '../../../theme/ThemeProvider';

// Example icons (you can replace with your icon library)
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 3v8m0 0l3-3m-3 3L5 8m8 5H3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const meta = {
  title: 'Components/Shared/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '2rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'primary', 'secondary', 'outlined'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Solid: Story = {
  args: {
    label: 'Solid Button',
    variant: 'solid',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Outlined: Story = {
  args: {
    label: 'Outlined Button',
    variant: 'outlined',
  },
};

// Sizes
export const Small: Story = {
  args: {
    label: 'Small Button',
    size: 'small',
    variant: 'primary',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Button',
    size: 'medium',
    variant: 'primary',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    size: 'large',
    variant: 'primary',
  },
};

// States
export const Loading: Story = {
  args: {
    label: 'Loading...',
    loading: true,
    variant: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
    variant: 'primary',
  },
};

// With Icons
export const WithIconLeft: Story = {
  args: {
    label: 'Download',
    variant: 'primary',
    iconLeft: <DownloadIcon />,
  },
};

export const WithIconRight: Story = {
  args: {
    label: 'Next',
    variant: 'primary',
    iconRight: <ChevronRightIcon />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Add New',
    variant: 'primary',
    iconLeft: <PlusIcon />,
    iconRight: <ChevronRightIcon />,
  },
};

export const IconOnly: Story = {
  args: {
    iconLeft: <PlusIcon />,
    variant: 'primary',
    'aria-label': 'Add item',
  },
};

// Custom Colors
export const CustomColor: Story = {
  args: {
    label: 'Custom Color',
    variant: 'solid',
    color: '#ff6b6b',
  },
};

export const ThemeOverride: Story = {
  args: {
    label: 'Theme Override',
    variant: 'solid',
    themeColor: {
      background: '#10b981',
      text: 'white',
    },
  },
};

// Full Width
export const FullWidth: Story = {
  args: {
    label: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button label="Solid" variant="solid" />
        <Button label="Primary" variant="primary" />
        <Button label="Secondary" variant="secondary" />
        <Button label="Outlined" variant="outlined" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button label="Small" variant="primary" size="small" />
        <Button label="Medium" variant="primary" size="medium" />
        <Button label="Large" variant="primary" size="large" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Button label="With Icon" variant="primary" iconLeft={<PlusIcon />} />
        <Button label="Loading" variant="primary" loading />
        <Button label="Disabled" variant="primary" disabled />
      </div>
    </div>
  ),
};
