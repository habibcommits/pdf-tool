import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import PageLoader from '@/components/PageLoader'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PageLoader />
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(App)
