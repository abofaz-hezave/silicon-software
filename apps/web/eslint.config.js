import sharedConfig from '@repo/config/eslint';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const config = [...sharedConfig, ...nextVitals, ...nextTypeScript];

export default config;
