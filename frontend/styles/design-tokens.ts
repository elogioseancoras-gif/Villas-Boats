/**
 * Villas Boats - Unified Design Tokens
 * Maritime-inspired design system with OKLCH color space
 *
 * Reference: Frontend-Architect Theme Analysis
 */

export const designTokens = {
  colors: {
    // Background - Soft maritime white
    background: 'oklch(0.9900 0.0050 240)',
    foreground: 'oklch(0.1450 0 0)',

    // Cards & Popovers
    card: 'oklch(0.9900 0.0050 240)',
    cardForeground: 'oklch(0.1450 0 0)',
    popover: 'oklch(0.9900 0.0050 240)',
    popoverForeground: 'oklch(0.1450 0 0)',

    // Primary - Deep ocean blue
    primary: {
      DEFAULT: 'oklch(0.4800 0.1600 240)',
      light: 'oklch(0.6500 0.1200 240)',
      dark: 'oklch(0.4200 0.1800 240)',
      foreground: 'oklch(0.9900 0.0050 240)',
    },

    // Secondary - Warm golden sunset
    secondary: {
      DEFAULT: 'oklch(0.8500 0.1200 65)',
      light: 'oklch(0.9000 0.1000 65)',
      dark: 'oklch(0.7500 0.1400 65)',
      foreground: 'oklch(0.1450 0 0)',
    },

    // Accent - Turquoise wave
    accent: {
      DEFAULT: 'oklch(0.6500 0.1400 200)',
      light: 'oklch(0.7500 0.1200 200)',
      dark: 'oklch(0.5500 0.1600 200)',
      foreground: 'oklch(0.9900 0.0050 240)',
    },

    // Muted - Soft gray
    muted: {
      DEFAULT: 'oklch(0.9550 0 0)',
      foreground: 'oklch(0.5500 0 0)',
    },

    // Destructive - Error red
    destructive: {
      DEFAULT: 'oklch(0.5770 0.2450 27.3250)',
      foreground: 'oklch(0.9900 0.0050 240)',
    },

    // Border & Input
    border: 'oklch(0.9220 0 0)',
    input: 'oklch(0.9220 0 0)',
    ring: 'oklch(0.4800 0.1600 240)',

    // Chart colors
    chart: {
      1: 'oklch(0.4800 0.1600 240)', // Deep ocean blue
      2: 'oklch(0.8500 0.1200 65)',  // Warm golden
      3: 'oklch(0.6500 0.1400 200)', // Turquoise
      4: 'oklch(0.7000 0.1000 150)', // Sea green
      5: 'oklch(0.6000 0.1500 280)', // Deep purple
    },

    // Sidebar
    sidebar: {
      DEFAULT: 'oklch(0.9850 0 0)',
      foreground: 'oklch(0.1450 0 0)',
      primary: 'oklch(0.4800 0.1600 240)',
      primaryForeground: 'oklch(0.9900 0.0050 240)',
      accent: 'oklch(0.6500 0.1400 200)',
      accentForeground: 'oklch(0.1450 0 0)',
      border: 'oklch(0.9220 0 0)',
      ring: 'oklch(0.4800 0.1600 240)',
    },
  },

  typography: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      heading: ['Outfit', 'Inter', 'sans-serif'],
      serif: ['Playfair Display', 'Georgia', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },

  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  borderRadius: {
    none: '0',
    sm: 'calc(0.5rem - 4px)',
    DEFAULT: '0.5rem',
    md: 'calc(0.5rem - 2px)',
    lg: '0.5rem',
    xl: 'calc(0.5rem + 4px)',
    full: '9999px',
  },

  shadows: {
    DEFAULT: '0 4px 12px -2px hsl(240 60% 20% / 0.10)',
    sm: '0 2px 8px -1px hsl(240 60% 20% / 0.08)',
    md: '0 6px 16px -3px hsl(240 60% 20% / 0.12)',
    lg: '0 8px 24px -4px hsl(240 60% 20% / 0.15)',
    xl: '0 12px 32px -6px hsl(240 60% 20% / 0.18)',
    '2xl': '0 16px 48px -8px hsl(240 60% 20% / 0.22)',
    glow: '0 0 20px hsl(240 80% 60% / 0.3)',
    glowGolden: '0 0 20px hsl(65 70% 60% / 0.4)',
    glowTurquoise: '0 0 20px hsl(200 70% 60% / 0.4)',
  },

  animation: {
    duration: {
      fast: '200ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof designTokens;
