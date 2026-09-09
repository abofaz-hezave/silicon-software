import base from '@repo/config/eslint';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const nextConfig = Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals];

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [...base, ...nextConfig];

export default eslintConfig;
