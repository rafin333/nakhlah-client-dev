import { useUserLoginMutation } from "@/redux/features/auth/authApi";
import { removeUserInfo, storeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import ThemeContext from "../context/themeContext";
import { useTranslation } from "next-i18next";
import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import Link from "next/link";
import { TagTypes } from "@/constants/tagTypes";
import { set } from "lodash";

const Login = ({ goBack }) => {
  const { t: loginT } = useTranslation(TRANSLATION_NAMESPACES.login);
  const [userLogin] = useUserLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const [passShow, setPassShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    removeUserInfo();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const formData = new FormData(event.target);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    const userData = {
      identifier: formDataObject.username,
      password: formDataObject.password,
    };
    console.log("userData->", userData);
    try {
      const response = await userLogin({ ...userData }).unwrap();

      console.log("LOGIN DATA ==> ", response);
      storeUserInfo({
        accessToken: response?.jwt,
        userInfo: JSON.stringify(response?.user),
        rememberMe
      });
      if (response?.jwt) {
        router.push("/learn").then(() =>
        {
          setSuccessMessage("Login Successfull");
          window.location.reload();
          // setSubmitting(false);
        }
      );
      }
    } catch (error) {
      console.log(error);
      setErrorMessage(error?.errorMessage);
      setSubmitting(false);
    }
  };

  /* const context = useContext(ThemeContext);
  const { token } = context;

  console.log("token", token);
  useEffect(() => {
    if (token) {
      router.replace("/");
    }
  }, [token]); */

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* <h1 className="mt-6 text-center text-3xl font-extrabold text-[#00a852]">
            NAKHLAH
          </h1> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
            {loginT("login")}
          </h2>
        </div>

        <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md  -space-y-px  ">
            <div className="flex flex-col items-center">
              <div className="mb-4 ">
                <label htmlFor="username" className="sr-only">
                  {loginT("username")}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder={loginT("username")}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  {loginT("password")}
                </label>
                <input
                  id="password"
                  name="password"
                  type={passShow ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder={loginT("password")}
                />
              </div>
            </div>
          <small
            className={
              passShow
                ? "text-purple-800 text-[13px] flex items-right justify-end pr-12 pt-2 cursor-pointer"
                : " text-[13px] text-black-800 flex items-right justify-end pr-12 pt-2 cursor-pointer"
            }
            onClick={() => setPassShow(passShow ? false : true)}
          >
            {passShow ? "Hide" : "Show" } Password
          </small>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                {loginT("rememberMe")}
              </label>
            </div>
            <div className="flex items-center">
              <a
                href="#"
                className="font-medium text-sm  text-indigo-800 hover:text-indigo-400"
              >
                {loginT("forgotPassword")}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-center popbuttonsContainer">
            <button
              type="submit"
              className={submitting?"popbuttonDisable":"popbuttonSuccess"}
              disabled={submitting}
            >
              {loginT("signIn")}
            </button>
          </div>

          {errorMessage && (
            <div
              className="bg-red-100 text-sm border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">{loginT("error")}!</strong>
              <span className="block sm:inline"> {errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div
              className="bg-green-100  text-sm border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">{loginT("success")}!</strong>
              <span className="block sm:inline"> {successMessage}</span>
            </div>
          )}
          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link href="/query">
                <span className="font-medium text-orange-600 hover:text-orange-500">
                  {TagTypes.New_User}
                </span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
