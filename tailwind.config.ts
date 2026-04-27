import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,tsx}',
  ],
  corePlugins: {
    // Disable Tailwind's CSS reset — project uses its own SCSS reboot
    preflight: false,
  },
} satisfies Config
