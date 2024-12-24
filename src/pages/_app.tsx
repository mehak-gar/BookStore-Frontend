'use client';
import type { AppProps } from 'next/app';


import '../app/globals.css';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ProductDrawerProvider } from '@/context/ProductDrawerContext';
import theme from '@/theme/theme';
import { ThemeProvider } from '@mui/material';
import AuthProvider from '@/context/AuthProvider';
import Confirmdialog from '@/components/confirmdialog/ConfirmDialog';
import Head from 'next/head';



export default function App({ Component, pageProps }: AppProps) {






  return (
    <>
    <Head>
    <title>KHariid-o-faroKHt</title>
    <meta name="description" content="Your custom description goes here." />
    <link rel="icon" href="/logo.png" />
    <meta property="og:image" content="/path-to-your-image.jpg" />
    <meta property="og:title" content="Your Custom Title" />
    <meta property="og:description" content="Your custom description goes here." />
  </Head>


    <Provider store={store}>
      <AuthProvider>
         <ThemeProvider theme={theme}>
          <ProductDrawerProvider>
      <Component {...pageProps} />
            <Confirmdialog/>
      <ToastContainer />
      </ProductDrawerProvider>
      </ThemeProvider>
      </AuthProvider>
    </Provider>
    </>
  );
}
