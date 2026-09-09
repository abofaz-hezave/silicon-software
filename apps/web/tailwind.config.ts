import sharedConfig from '@repo/config/tailwind';
import type { Config } from 'tailwindcss';

const config: Config = {
  ...sharedConfig,
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    ...sharedConfig.theme,
    extend: {
      ...sharedConfig.theme?.extend,
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
    },
  },
};

export default config;
