import type { Meta, StoryObj } from '@storybook/react';
import Hero from './index';

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

export const Desktop: Story = {};

export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileSmall: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
};
