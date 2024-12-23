import type { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { Root } from '@/components/Root/Root';
import { I18nProvider } from '@/core/i18n/provider';
import AuthProvider from '@/components/Providers/AuthProvider';

import '@telegram-apps/telegram-ui/dist/styles.css';
import 'normalize.css/normalize.css';
import './_assets/globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'FanSphere',
  description: 'A telegram mini app for fans',
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <I18nProvider>
          <Providers>
            <AuthProvider>
            <Root>
              {children}
            </Root>
            </AuthProvider>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
