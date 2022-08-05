// Bootstrap core CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Styles
import "../public/assets/fontawesome/css/fontawesome.min.css";
import "../public/assets/fontawesome/css/solid.min.css";
import "../public/assets/fontawesome/css/regular.min.css";
import "../public/assets/fontawesome/css/brands.min.css";

import "../public/assets/css/style.css";

import "../public/assets/css/bootstrap-datepicker.min.css";
import "../public/assets/css/jquery.datetimepicker.min.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/router";
import Header from "../components/Header";

const noAuthRequired = ["/", "/login", "/signup"];

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <script src="/assets/js/jquery.min.js"></script>
        <script src="/assets/js/jquery.datetimepicker.full.min.js"></script>
        <script src="/assets/js/bootstrap-datepicker.min.js"></script>

        <script src="/assets/js/custome.js"></script>
      </Head>
      <AuthProvider>
        <SessionProvider
          // Provider options are not required but can be useful in situations where
          // you have a short session maxAge time. Shown here with default values.
          session={pageProps.session}
        >
          {noAuthRequired.includes(router.pathname) ? (
            <Component {...pageProps} />
          ) : (
            <ProtectedRoute>
              <Header />
              <Component {...pageProps} />
            </ProtectedRoute>
          )}
        </SessionProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;
