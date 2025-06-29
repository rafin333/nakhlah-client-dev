import ThemeContext from "@/components/context/themeContext";
import Login from "@/components/Login/login";
import { getUserInfo, isAuthenticateUser } from "@/services/auth.service";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
const Auth = () => {
  const isAuthenticated = isAuthenticateUser();
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticateUser) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  /* const context = useContext(ThemeContext);
  const { token } = context;

  console.log("token", token);
  useEffect(() => {
    if (token) {
      router.replace("/learn");
    }
  }, [token]); */

  return (
    <div>
      <Login />
    </div>
  );
};
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
      // Will be passed to the page component as props
    },
  };
}

export default Auth;
