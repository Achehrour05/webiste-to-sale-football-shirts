const {heroui} = require('@heroui/theme');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|radio|slider|ripple|spinner|form|popover).js"
  ],
  theme: {
    extend: {},
  },
  plugins: [heroui()],
};
