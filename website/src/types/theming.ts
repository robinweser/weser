export type T_Theme = 'light' | 'dark'

declare global {
  interface Window {
    __theme: T_Theme
    __setPreferredTheme: (theme: T_Theme) => void
    __onThemeChange: () => void
  }
}
