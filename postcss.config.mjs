/** @type {import('postcss-load-config').Config} */
const config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: {
    tailwindcss: {},
  },
};

export default config;
