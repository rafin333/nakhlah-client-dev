import "@/styles/globals.css";
import Script from "next/script";
import { useEffect, useState } from "react";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeContext from "@/components/context/themeContext";
import Loader from "@/components/Loader";
import Login from "@/components/Login/login";
import Layout from "@/components/Layout";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { getUserInfo } from "@/services/auth.service";
import { appWithTranslation } from "next-i18next";
import { useRouter } from "next/router";
import RegisterForm from "@/components/Register/Register";
import Query from "./query";
import Landing from "@/components/Landing/landing";
import PrivacyTerms from "./privacyterms";
import Learn from "./learn";
import { getFromLocalStorage } from "@/utils/local-storage";
import { authKey } from "@/constants/storageKey";
import { UndoIcon } from "lucide-react";

import { GoogleOAuthProvider } from "@react-oauth/google";

const App = ({ Component, pageProps }) => {
  // const { route } = useRouter();
  const router = useRouter();
  const route = router.pathname;
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);
  console.log(router.pathname);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  // const [isResponsiveVoiceLoaded, setIsResponsiveVoiceLoaded] = useState(false);
  // useEffect(() => {
  //   window.localStorage.setItem("RV", isResponsiveVoiceLoaded);
  // }, [isResponsiveVoiceLoaded]);

  const accessToken = getFromLocalStorage(authKey);

  // console.log(Object.keys(accessToken));

  useEffect(() => {
    const tokenString = getUserInfo();
    setToken(tokenString);
  }, []);
  const providerValues = { token };

  if (typeof window !== undefined) {
    if (!token) {
      console.log(accessToken, token);
      return (
        <>
          {/* <Script
            src="https://code.responsivevoice.org/responsivevoice.js?key=MsWPQFPp"
            strategy="afterInteractive"
            onLoad={() => setIsResponsiveVoiceLoaded(true)}
          /> */}
          {loading ? (
            <Loader />
          ) : (
            <GoogleOAuthProvider clientId="802793018966-n25ue3risp6t94o7njfh5tqvl5jhvjuu.apps.googleusercontent.com">
              <Provider store={store}>
                {/* {
                route === '/auth/register' &&(
                  <RegisterForm/>
                )
              } */}
                {route === "/privacyterms" && <PrivacyTerms />}
                {route === "/query" && <Query />}
                {route === "/" && <Landing />}

                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  draggable={false}
                  closeOnClick
                  pauseOnHover
                  transition={Slide}
                />
              </Provider>
            </GoogleOAuthProvider>
          )}
        </>
      );
    }
  }

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={providerValues}>
        {/* <Script
          src="https://code.responsivevoice.org/responsivevoice.js?key=MsWPQFPp"
          strategy="afterInteractive"
          onLoad={() => setIsResponsiveVoiceLoaded(true)}
        /> */}
        <Layout>
          <div style={{ flex: 1 }}>
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              draggable={false}
              closeOnClick
              pauseOnHover
              transition={Slide}
            />
          </div>
        </Layout>
      </ThemeContext.Provider>
    </Provider>
  );
};
export default appWithTranslation(App);
