import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="text-2xl font-bold text-primary">
              PDF Tools
            </Link>
            
            <div className="flex gap-4 items-center">
              <Link href="/" className="text-gray-700 hover:text-primary">
                {t('nav.home')}
              </Link>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => changeLanguage('de')}
                  className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                    router.locale === 'de'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-1.5 rounded-md font-medium transition-all ${
                    router.locale === 'en'
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-8">
        {children}
      </main>

      <footer className="bg-gray-100 border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2025 PDF Tools - Free and easy to use</p>
        </div>
      </footer>
    </div>
  );
}
