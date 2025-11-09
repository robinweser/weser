import { PropsWithChildren } from 'react'
import { Viewport } from 'next'
import Script from 'next/script'
import { Inter } from 'next/font/google'
import { LayerProvider } from '@weser/layers'

import ScrollBlockingLayer from '@/components/ScrollBlockingLayer'
import ModeProvider from '@/components/ModeProvider'

import { styleSheet } from '@/utils/system'
import { colorVariables, tokenVariables } from '@/utils/theme'

import './reset.css'
import './global.css'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  viewportFit: 'cover',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={'light ' + inter.className}>
        <style dangerouslySetInnerHTML={{ __html: colorVariables }} />
        <style dangerouslySetInnerHTML={{ __html: tokenVariables }} />
        <style dangerouslySetInnerHTML={{ __html: styleSheet }} />
        <Script
          id="simple-analytics"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.sa_event=window.sa_event||function(){var a=[].slice.call(arguments);window.sa_event.q?window.sa_event.q.push(a):window.sa_event.q=[a]}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.__onThemeChange = function() {};
                function setTheme(newTheme) {
                  const current = window.__theme || "light";
                  window.__theme = newTheme;
                  preferredTheme = newTheme;
                  document.body.classList.replace(current, newTheme);
                  window.__onThemeChange(newTheme);
                }
                var preferredTheme;
                try {
                  preferredTheme = localStorage.getItem('theme');
                } catch (err) {}

                window.__setPreferredTheme = function(newTheme) {
                  setTheme(newTheme);
                  try {
                    localStorage.setItem('theme', newTheme);
                  } catch (err) {}
                }
                var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
                darkQuery.addListener(function(e) {
                  window.__setPreferredTheme(e.matches ? 'dark' : 'light')
                });
                setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
              })();
            `,
          }}
        />
        <LayerProvider>
          <ScrollBlockingLayer>
            <ModeProvider>{children}</ModeProvider>
          </ScrollBlockingLayer>
        </LayerProvider>
        <Script src="https://sa.weser.io/latest.js" />
      </body>
    </html>
  )
}
