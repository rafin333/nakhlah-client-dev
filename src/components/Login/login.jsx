import {
  useUserLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/redux/features/auth/authApi";
import { removeUserInfo, storeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import Link from "next/link";
import { TagTypes } from "@/constants/tagTypes";

const AuthForm = () => {
  const { t: loginT } = useTranslation(TRANSLATION_NAMESPACES.login);
  const [formType, setFormType] = useState("login"); // login | forgot | reset
  const [passShow, setPassShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();
  const { code } = router.query;

  const [userLogin] = useUserLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    removeUserInfo();
  }, []);

  useEffect(() => {
    if (code) setFormType("reset");
  }, [code]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const formData = new FormData(e.target);

    try {
      const res = await userLogin({
        identifier: formData.get("username"),
        password: formData.get("password"),
      }).unwrap();

      storeUserInfo({
        accessToken: res?.jwt,
        userInfo: JSON.stringify(res?.user),
        rememberMe,
      });

      if (res?.jwt) {
        router.push("/learn").then(() => window.location.reload());
      }
    } catch (err) {
      setErrorMessage(err?.data?.error?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    const formData = new FormData(e.target);

    try {
      await forgotPassword({ email: formData.get("email") }).unwrap();
      setSuccessMessage("Reset link sent to your email");
    } catch (err) {
      setErrorMessage(err?.data?.error?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    const formData = new FormData(e.target);

    try {
      await resetPassword({
        code: code || formData.get("code"),
        password: formData.get("password"),
        passwordConfirmation: formData.get("passwordConfirmation"),
      }).unwrap();
      setSuccessMessage("Password reset successful");
      setFormType("login");
      router.replace("/login");
    } catch (err) {
      setErrorMessage(err?.data?.error?.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
            {formType === "login" && loginT("login")}
            {formType === "forgot" && loginT("forgotPassword")}
            {formType === "reset" && "Reset Password"}
          </h2>
        </div>

        {/* LOGIN FORM */}
        {formType === "login" && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md -space-y-px">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-t-md sm:text-sm"
                    placeholder={loginT("username")}
                  />
                </div>
                <div>
                  <input
                    id="password"
                    name="password"
                    type={passShow ? "text" : "password"}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-b-md sm:text-sm"
                    placeholder={loginT("password")}
                  />
                </div>
              </div>
              <small
                className={`${
                  passShow
                    ? "text-purple-800"
                    : "text-black-800"
                } text-[13px] flex justify-end pr-2 pt-2 cursor-pointer`}
                onClick={() => setPassShow(!passShow)}
              >
                {passShow ? "Hide" : "Show"} Password
              </small>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-900">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="ml-2">{loginT("rememberMe")}</span>
              </label>
              <button
                type="button"
                onClick={() => setFormType("forgot")}
                className="font-medium text-sm text-indigo-800 hover:text-indigo-400"
              >
                {loginT("forgotPassword")}
              </button>
            </div>

            <div className="flex items-center justify-center popbuttonsContainer">
              <button
                type="submit"
                className={submitting ? "popbuttonDisable" : "popbuttonSuccess"}
                disabled={submitting}
              >
                {loginT("signIn")}
              </button>
            </div>
          </form>
        )}

        {/* FORGOT FORM */}
        {formType === "forgot" && (
          <form className="mt-8 space-y-6" onSubmit={handleForgot}>
            <div className="rounded-md">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm"
                placeholder={loginT("email")}
              />
            </div>
            <div className="flex items-center justify-center popbuttonsContainer">
              <button
                type="submit"
                className={submitting ? "popbuttonDisable" : "popbuttonSuccess"}
                disabled={submitting}
              >
                Send Reset Link
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setFormType("login")}
                className="text-sm text-indigo-800 hover:text-indigo-400"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* RESET FORM */}
        {formType === "reset" && (
          <form className="mt-8 space-y-6" onSubmit={handleReset}>
            {!code && (
              <input
                name="code"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-md sm:text-sm"
                placeholder="Reset code"
              />
            )}
            <input
              name="password"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-t-md sm:text-sm"
              placeholder="New password"
            />
            <input
              name="passwordConfirmation"
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 text-gray-900 rounded-b-md sm:text-sm"
              placeholder="Confirm new password"
            />
            <div className="flex items-center justify-center popbuttonsContainer">
              <button
                type="submit"
                className={submitting ? "popbuttonDisable" : "popbuttonSuccess"}
                disabled={submitting}
              >
                Reset Password
              </button>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setFormType("login")}
                className="text-sm text-indigo-800 hover:text-indigo-400"
              >
                Back to Login
              </button>
            </div>
          </form>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-sm border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">{loginT("error")}!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 text-sm border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">{loginT("success")}!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        {formType === "login" && (
          <div className="flex items-center justify-center">
            <div className="text-sm">
              <Link href="/query">
                <span className="font-medium text-orange-600 hover:text-orange-500">
                  {TagTypes.New_User}
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
