import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFiles: ['jest-canvas-mock'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx'],
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.(spec|test).[tj]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)',
  ],
  verbose: true,
};

export default config;