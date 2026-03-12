import type { Meta, StoryObj } from '@storybook/react';
import LandingPage from './index';
import { ThemeProvider } from '../../theme/ThemeProvider';

const meta = {
  title: 'Components/LandingPage',
  component: LandingPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onStartClick: () => console.log('Start button clicked'),
  },
};
