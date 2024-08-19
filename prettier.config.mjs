import { fileURLToPath } from 'url';

/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */

/** @type { PrettierConfig | TailwindConfig } */
export default {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
  singleQuote: true,
  plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-packagejson'],
  tailwindConfig: fileURLToPath(
    new URL('./apps/qualia/tailwind.config.js', import.meta.url),
  ),
  tailwindFunctions: ['cn', 'cva'],
};
