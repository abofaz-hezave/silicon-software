import sharedConfig from '@repo/config/tailwind';
import type { Config } from 'tailwindcss';

const config = {
  ...sharedConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
} satisfies Config;

export default config;
