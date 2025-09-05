import { alpha, createTheme, createThemes } from '@weser/theming'

const base = {
  baselineGrid: 4,
  zIndex: {
    OVERLAY_3: 22,
    OVERLAY_2: 21,
    OVERLAY_1: 20,
    HEADER: 15,
  },
  shadows: {
    small: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
    medium:
      'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px',
    large:
      'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px',
  },
  focusRing: {
    transition: 'outline-offset 200ms ease-out',
    outline: `1.5px solid ${alpha('var(--colors-primary)', 0.8)}`,
    outlineOffset: 2,
  },
}

export const rawColors = {
  // grayscale
  white: 'hsl(0, 0%, 100%)',
  gray50: 'hsl(0, 0%, 98%)',
  gray100: 'hsl(0, 0%, 94%)',
  gray200: 'hsl(0, 0%, 86%)',
  gray300: 'hsl(0, 0%, 78%)',
  gray400: 'hsl(0, 0%, 70%)',
  gray500: 'hsl(0, 0%, 62%)',
  gray600: 'hsl(0, 0%, 47%)',
  gray700: 'hsl(0, 0%, 31%)',
  gray800: 'hsl(0, 0%, 20%)',
  gray900: 'hsl(0, 0%, 12%)',
  gray950: 'hsl(0, 0%, 6%)',
  black: 'hsl(0, 0%, 0%)',

  // brand color
  brand50: 'hsl(255, 100%, 97%)',
  brand100: 'hsl(255, 90%, 92%)',
  brand200: 'hsl(255, 85%, 85%)',
  brand300: 'hsl(255, 80%, 75%)',
  brand400: 'hsl(255, 75%, 65%)',
  brand500: 'hsl(255, 70%, 55%)', // base color
  brand600: 'hsl(255, 65%, 45%)',
  brand700: 'hsl(255, 60%, 35%)',
  brand800: 'hsl(255, 55%, 25%)',
  brand900: 'hsl(255, 50%, 15%)',
  brand950: 'hsl(255, 45%, 8%)',

  // intents
  blue50: 'hsl(216, 100%, 98%)',
  blue100: 'hsl(214,  95%, 93%)',
  blue200: 'hsl(215,  95%, 85%)',
  blue300: 'hsl(216,  93%, 76%)',
  blue400: 'hsl(217,  93%, 68%)',
  blue500: 'hsl(217,  91%, 60%)',
  blue600: 'hsl(219,  84%, 53%)',
  blue700: 'hsl(221,  78%, 46%)',
  blue800: 'hsl(222,  71%, 40%)',
  blue900: 'hsl(224,  64%, 33%)',

  green50: 'hsl(142, 60%, 98%)',
  green100: 'hsl(142, 60%, 94%)',
  green200: 'hsl(142, 60%, 82%)',
  green300: 'hsl(142, 60%, 69%)',
  green400: 'hsl(142, 60%, 57%)',
  green500: 'hsl(142, 60%, 44%)',
  green600: 'hsl(142, 60%, 37%)',
  green700: 'hsl(142, 60%, 29%)',
  green800: 'hsl(142, 60%, 22%)',
  green900: 'hsl(142, 60%, 14%)',

  red50: 'hsl(0, 70%, 98%)',
  red100: 'hsl(0, 70%, 94%)',
  red200: 'hsl(0, 70%, 82%)',
  red300: 'hsl(0, 70%, 69%)',
  red400: 'hsl(0, 70%, 57%)',
  red500: 'hsl(0, 70%, 44%)',
  red600: 'hsl(0, 70%, 37%)',
  red700: 'hsl(0, 70%, 29%)',
  red800: 'hsl(0, 70%, 22%)',
  red900: 'hsl(0, 70%, 14%)',

  yellow50: 'hsl(38, 85%, 98%)',
  yellow100: 'hsl(38, 85%, 94%)',
  yellow200: 'hsl(38, 85%, 82%)',
  yellow300: 'hsl(38, 85%, 69%)',
  yellow400: 'hsl(38, 85%, 57%)',
  yellow500: 'hsl(38, 85%, 44%)',
  yellow600: 'hsl(38, 85%, 39%)',
  yellow700: 'hsl(38, 85%, 34%)',
  yellow800: 'hsl(38, 85%, 29%)',
  yellow900: 'hsl(38, 85%, 24%)',

  // accents
  pink100: 'hsl(0, 79%, 91%)',
  pink300: 'hsl(0, 76%, 77%)',
  pink500: 'hsl(0, 69%, 67%)',
  pink700: 'hsl(0, 65%, 51%)',

  peach100: 'hsl(34, 100%, 92%)',
  peach300: 'hsl(14, 100%, 78%)',
  peach500: 'hsl(14, 100%, 70%)',
  peach700: 'hsl(14,  80%, 50%)',

  lemon100: 'hsl(48,  94%, 93%)',
  lemon300: 'hsl(45, 100%, 75%)',
  lemon500: 'hsl(46, 100%, 65%)',
  lemon700: 'hsl(45,  78%, 38%)',

  lime100: 'hsl( 88, 79%, 91%)',
  lime300: 'hsl( 88, 50%, 76%)',
  lime500: 'hsl( 88, 50%, 67%)',
  lime700: 'hsl( 92, 48%, 42%)',

  aqua100: 'hsl(193, 73%, 93%)',
  aqua300: 'hsl(199, 92%, 74%)',
  aqua500: 'hsl(199, 91%, 64%)',
  aqua700: 'hsl(201, 98%, 41%)',

  lavender100: 'hsl(232, 69%, 94%)',
  lavender300: 'hsl(261, 46%, 74%)',
  lavender500: 'hsl(262, 47%, 63%)',
  lavender700: 'hsl(258, 58%, 42%)',

  rose100: 'hsl(304, 74%, 92%)',
  rose300: 'hsl(340, 82%, 76%)',
  rose500: 'hsl(340, 83%, 66%)',
  rose700: 'hsl(336, 78%, 43%)',

  vanilla100: 'hsl(0, 0%, 98%)',
  vanilla300: 'hsl(0, 0%, 94%)',
  vanilla500: 'hsl(0, 0%, 96%)',
  vanilla700: 'hsl(0, 0%, 88%)',

  mint100: 'hsl(169, 79%, 91%)',
  mint300: 'hsl(174, 42%, 65%)',
  mint500: 'hsl(174, 42%, 51%)',
  mint700: 'hsl(173,100%, 24%)',

  turquoise100: 'hsl(163, 64%, 95%)',
  turquoise300: 'hsl(187, 72%, 71%)',
  turquoise500: 'hsl(187, 71%, 59%)',
  turquoise700: 'hsl(185,100%, 28%)',

  lilac100: 'hsl(267, 64%, 95%)',
  lilac300: 'hsl(291, 47%, 71%)',
  lilac500: 'hsl(261, 46%, 74%)',
  lilac700: 'hsl(258, 58%, 42%)',

  blush100: 'hsl(336, 75%, 92%)',
  blush300: 'hsl(339, 81%, 85%)',
  blush500: 'hsl(340, 82%, 76%)',
  blush700: 'hsl(336, 78%, 43%)',
}

const [colors, colorVariables] = createTheme(rawColors)

const light = {
  ...base,
  colors: {
    primary: colors.brand500,
    primaryHover: colors.brand600,
    border: 'rgba(60, 60, 60, 0.1)',
    borderInput: 'rgba(60, 60, 60, 0.2)',
    foreground: {
      primary: colors.black,
      secondary: colors.gray700,
      tertiary: alpha(colors.gray400, 0.75),
      info: colors.blue900,
      destructive: colors.red900,
      warning: colors.yellow900,
      success: colors.green900,
      link: colors.brand700,
    },
    background: {
      primary: colors.white,
      secondary: colors.gray50,
      alternate: colors.brand50,
      info: colors.blue500,
      destructive: colors.red500,
      warning: colors.yellow500,
      success: colors.green500,
      input: colors.white,
      sidebar: colors.gray50,
      sidebarActive: 'rgba(150, 150, 150, 0.15)',
      menu: colors.gray50,
      code: 'rgb(245, 245, 245)',
      inlineCode: 'rgb(245, 245, 245)',
      tableHeader: 'rgb(250, 250, 250)',
    },
  },
}

const dark = {
  ...base,
  colors: {
    primary: colors.brand200,
    primaryHover: colors.brand100,
    border: 'rgba(150, 150, 150, 0.1)',
    borderInput: 'rgba(150, 150, 150, 0.2)',

    foreground: {
      primary: 'rgb(230, 230, 230)',
      secondary: colors.gray200,
      tertiary: alpha(colors.gray300, 0.8),
      info: colors.blue100,
      destructive: colors.red100,
      warning: colors.yellow100,
      success: colors.green100,
      link: colors.brand100,
    },
    background: {
      primary: colors.gray950,
      secondary: alpha(colors.gray900, 0.3),
      alternate: alpha(colors.gray900, 0.4),
      info: colors.blue500,
      destructive: colors.red500,
      warning: colors.yellow500,
      success: colors.green500,
      input: colors.gray900,
      sidebar: alpha(colors.brand200, 0.05),
      sidebarActive: alpha(colors.brand200, 0.05),
      menu: colors.gray950,
      code: 'rgb(20, 20, 20)',
      inlineCode: 'rgb(30, 30, 30)',
      tableHeader: 'rgb(20, 20, 20)',
    },
  },
}

const themes = {
  light,
  dark,
}

export type T_Theme = keyof typeof themes

const [theme, tokenVariables] = createThemes(themes, {
  shouldTransformValue: (path) => path.startsWith('colors'),
})

const typography = {
  heading1: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.3,
    textWrap: 'balance',
  },
  heading2: {
    fontSize: 26,
    fontWeight: 600,
    lineHeight: 1.3,
    textWrap: 'balance',
  },
  heading3: {
    fontSize: 22,
    fontWeight: 600,
    lineHeight: 1.35,
    textWrap: 'balance',
  },
  heading4: {
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.35,
    textWrap: 'balance',
  },
  heading5: {
    fontSize: 16,
    fontWeight: 700,
    lineHeight: 1.35,
    textWrap: 'balance',
  },
  highlight: {
    fontSize: 18,
  },
  body: {
    fontSize: 16,
  },
  note: {
    fontSize: 14,
  },
  hint: {
    fontSize: 12,
  },
} as const

export default theme
export { tokenVariables, colorVariables, colors, typography }
