import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import {
  useUserRegisterMutation,
  useUserSocialLoginMutation,
} from "@/redux/features/auth/authApi";
import { storeUserInfo } from "@/services/auth.service";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LogoSVG from "../../../public/logosvg.svg";
import { toast } from "react-toastify";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { decodeJWT } from "@/utils/jwtDecode";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterForm = ({ onContinue, comesFrom }) => {
  const { t: loginT } = useTranslation(TRANSLATION_NAMESPACES.login);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [tcppCheck, setTcppCheck] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [userRegister] = useUserRegisterMutation();
  const [userSocialLogin] = useUserSocialLoginMutation();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function confirmPassHandler(pass) {
    setPasswordC(pass);
    if (pass !== password && pass.length >= 6) {
      setErrorMessage("Confirm password didn't match");
      setSuccessMessage("");
    } else if (pass === password) {
      setErrorMessage("");
      setSuccessMessage("Confirm Password matched");
    } else {
      setErrorMessage("");
      setSuccessMessage("");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const registerInfo = { email, username, password };

    if (tcppCheck && password === passwordC) {
      try {
        const response = await userRegister(registerInfo).unwrap();
        storeUserInfo({
          accessToken: response?.jwt,
          userInfo: JSON.stringify(response?.user),
        });

        if (response?.jwt) {
          if (comesFrom === "LearnerInfo") {
            onContinue(response?.jwt);
          } else {
            router.push("/learn");
          }
        }
      } catch (error) {
        if (error?.data?.error?.message === "Email already exist") {
          setErrorMessage(
            "Email already exists. Please use a different email address."
          );
        } else {
          setErrorMessage(
            error?.data?.error?.message || "An unexpected error occurred."
          );
        }
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!tcppCheck) setErrorMessage("Agree to the terms and privacy policy.");
      if (password !== passwordC) setErrorMessage("Passwords do not match.");
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
          {/* Logo */}
          <div className="flex justify-center">
            <Image src={LogoSVG} width={70} height={220} alt="Logo" />
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
            {loginT("register")}
          </h2>

          {/* Alerts */}
          {errorMessage && (
            <div className="bg-red-100 text-sm font-semibold border border-red-400 text-red-700 px-4 py-2 rounded">
              <strong className="font-semibold">{loginT("error")}!</strong>
              <span className="ml-1">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 text-sm font-semibold border border-green-400 text-green-700 px-4 py-2 rounded">
              <strong className="font-semibold">{loginT("success")}!</strong>
              <span className="ml-1">{successMessage}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Inputs */}
            <div className="space-y-3">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-purple-800 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={loginT("emailAddress")}
              />

              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-purple-800 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={loginT("username")}
              />

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passShow ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-800 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={loginT("password")}
                  minLength={6}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setPassShow(!passShow)}
                >
                  {passShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={passShow ? "text" : "password"}
                  required
                  value={passwordC}
                  onChange={(e) => confirmPassHandler(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-800 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={loginT("confirmPassword")}
                  minLength={6}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={() => setPassShow(!passShow)}
                >
                  {passShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </span>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                id="agreePrivacyAndTerms"
                name="agreePrivacyAndTerms"
                type="checkbox"
                checked={tcppCheck}
                onChange={() => setTcppCheck(!tcppCheck)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="agreePrivacyAndTerms"
                className="text-sm font-medium text-gray-700"
              >
                I agree to the{" "}
                <Link
                  href="/privacyterms"
                  className="text-purple-600 hover:underline font-semibold"
                  target="_blank"
                >
                  Privacy Policy and Terms
                </Link>
              </label>
            </div>

            {/* Login redirect */}
            <p className="text-sm text-gray-600">
              <Link
                href="/?login"
                className="text-purple-600 hover:underline font-semibold"
              >
                Already have an account? Login
              </Link>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={
                submitting
                  ? "w-full py-2 rounded-lg bg-purple-300 text-white font-medium cursor-not-allowed text-sm"
                  : "w-full py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-medium transition text-sm"
              }
            >
              {submitting ? "Registering..." : loginT("register")}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-gray-300" />
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-grow h-px bg-gray-300" />
            </div>

            {/* Google */}
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
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.18 2.73 29.97.5 24 .5 14.62.5 6.51 5.89 2.55 13.61l7.98 6.21C12.49 13.67 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.1 24.5c0-1.58-.14-3.09-.39-4.55H24v9.11h12.46c-.54 2.88-2.15 5.33-4.57 6.97l7.2 5.59c4.2-3.89 6.61-9.63 6.61-16.12z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.82c-1.01-2.88-1.01-6.02 0-8.9l-7.98-6.21C.73 17.57 0 20.68 0 24c0 3.32.73 6.43 2.55 9.29l7.98-6.21z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.59c-2.01 1.35-4.59 2.14-8.7 2.14-6.26 0-11.51-4.17-13.47-9.91l-7.98 6.21C6.51 42.11 14.62 48 24 48z"
                      />
                    </svg>
                    <span className="text-gray-700 font-medium">
                      Continue with Google
                    </span>
                  </button>
                )}
              />
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterForm;
