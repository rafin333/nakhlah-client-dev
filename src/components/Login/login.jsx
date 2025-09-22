import {
  useUserLoginMutation,
  useUserSocialLoginMutation,
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
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { decodeJWT } from "@/utils/jwtDecode";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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
  const [userSocialLogin] = useUserSocialLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    removeUserInfo();
  }, []);

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

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decodedToken = decodeJWT(credentialResponse?.credential);

      const googleData = {
        email: decodedToken?.email,
        sid: decodedToken?.sub,
        provider: "google",
        token: credentialResponse?.credential,
      };

      try {
        const loginRes = await userSocialLogin(googleData).unwrap();

        if (loginRes?.jwt) {
          storeUserInfo({
            accessToken: loginRes?.jwt,
            userInfo: JSON.stringify(loginRes?.user),
          });
          router.push("/learn").then(() => window.location.reload());
          return;
        }
      } catch {
        console.log("Google account not found, falling back to register.");
      }

      if (comesFrom === "LearnerInfo") {
        onContinue(googleData.token);
      } else {
        router.push("/query");
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google Login Failed. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="849081741540-kpbhg2m2v4nocop4un022gchsogfsddl.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-[rgb(248,241,219)] px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-6">

          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
            {formType === "login" && loginT("login")}
            {formType === "forgot" && loginT("forgotPassword")}
          </h2>

          {/* LOGIN FORM */}
          {formType === "login" && (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-3">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-purple-800 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={loginT("username")}
                />
                
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={passShow ? "text" : "password"}
                    required
                    className="w-full px-3 py-2 border border-purple-800 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={loginT("password")}
                  />
                  <span
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setPassShow(!passShow)}
                  >
                    {passShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </span>
                </div>
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
                  className="text-sm font-semibold text-purple-600 hover:underline"
                >
                  {loginT("forgotPassword")}
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={
                  submitting
                    ? "w-full py-2 rounded-lg bg-purple-300 text-white font-medium cursor-not-allowed text-sm"
                    : "w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium transition text-sm"
                }
              >
                {loginT("Log in")}
              </button>


              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="text-xs text-gray-500">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                  useOneTap
                  render={({ onClick }) => (
                    <button
                      onClick={onClick}
                      className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2 bg-white hover:bg-gray-50 transition"
                    >
                      <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>
                  )}
                />
              </div>

              {/* Register redirect */}
              <p className="text-sm text-gray-600 text-center">
                <Link
                  href="/query"
                  className="text-purple-600 hover:underline font-semibold"
                >
                  Don’t have an account? Register
                </Link>
              </p>
            </form>
          )}

          {/* FORGOT FORM */}
          {formType === "forgot" && (
            <form className="mt-6 space-y-4" onSubmit={handleForgot}>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-purple-800 rounded-md placeholder-gray-500 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={loginT("email")}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={
                  submitting
                    ? "w-full py-2 rounded-lg bg-purple-300 text-white font-medium cursor-not-allowed text-sm"
                    : "w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium transition text-sm"
                }
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setFormType("login")}
                  className="text-sm font-medium text-purple-600 hover:underline"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {errorMessage && (
            <div className="bg-red-100 text-sm border border-red-400 text-red-700 px-4 py-2 rounded">
              <strong className="font-semibold">{loginT("error")}!</strong>
              <span className="ml-1">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 text-sm border border-green-400 text-green-700 px-4 py-2 rounded">
              <strong className="font-semibold">{loginT("success")}!</strong>
              <span className="ml-1">{successMessage}</span>
            </div>
          )}


        </div>
      </div>
    </GoogleOAuthProvider>

  );
};

export default AuthForm;

