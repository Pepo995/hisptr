// ** Redux Imports
import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";

// ** Intl & ThemeColors Context
import { ToastContainer } from "react-toastify";
import { ThemeContext } from "@utils/context/ThemeColors";

// ** React Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

// ** React Toastify
import "@styles/scss/react/libs/toastify/toastify.scss";
import "react-toastify/dist/ReactToastify.css";

// ** Inner styles
import "@styles/scss/react/pages/page-authentication.scss";

import { type AppProps } from "next/app";

import { PersistGate } from "redux-persist/integration/react";
import { type ReactElement, type ReactNode, Suspense, useState } from "react";

import Spinner from "@components/spinner/Fallback-spinner";

import { api } from "@utils/api";

import { type NextPage } from "next";
import ChartContext from "@utils/context/ChartContext";

import "bootstrap/dist/css/bootstrap.min.css";

import "@styles/css/iconfont.css";
import "@styles/globals.scss";

import MixpanelPageListener from "@components/MixpanelPageListener";
import type { AnyAction, Store } from "@reduxjs/toolkit";
import { env } from "~/env.mjs";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [chartLoad, setChartLoad] = useState(false);

  return (
    <>
      <MixpanelPageListener />

      <Provider store={store as Store<unknown, AnyAction>}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={<Spinner />}>
            <ThemeContext>
              <ChartContext.Provider value={{ chartLoad, setChartLoad }}>
                {/* // TODO: Use the Fonts as Next suggests */}
                {/* <style jsx global>{`
                  html {
                    font-family: ${montserrat.style.fontFamily};
                  }
                `}</style> */}
                {getLayout(<Component {...pageProps} />)}
                <ToastContainer newestOnTop />
              </ChartContext.Provider>
            </ThemeContext>
          </Suspense>
        </PersistGate>
      </Provider>

      <GoogleTagManager gtmId={env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID} />
      <GoogleAnalytics gaId={env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
    </>
  );
};

export default api.withTRPC(MyApp);
