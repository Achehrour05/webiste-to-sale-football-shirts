const {heroui} = require('@heroui/theme');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|radio|slider|ripple|spinner|form|popover).js"
  ],
 theme: {
    extend: {
      
      animation: {
        scrollTeamLogos: 'scrollTeamLogos var(--animation-duration, 40s) linear infinite',
      },
      keyframes: {
        scrollTeamLogos: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-200px * 7))' }, 
        },
      },
      transitionTimingFunction: {
        'custom-ease': 'cubic-bezier(0.62, 0.28, 0.23, 0.99)',
      },
    },
  },
  plugins: [heroui()],
};
