import { useResetPasswordMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthResetForm = () => {
  const router = useRouter();
  const { code } = router.query;

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [resetPassword] = useResetPasswordMutation();
  const [resetCode, setResetCode] = useState("");

  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [passwordShow, setPasswordShow] = useState(false);

  useEffect(() => {
    if (router.isReady && code) setResetCode(code);
  }, [router.isReady, code]);

  const handleReset = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.target);

    try {
      await resetPassword({
        code: resetCode || formData.get("code"),
        password: formData.get("password"),
        passwordConfirmation: formData.get("passwordConfirmation"),
      }).unwrap();

      setSuccessMessage("Password reset successful");
      router.replace("/?login");
    } catch (err) {
      setErrorMessage(err?.data?.error?.message || "Reset failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleReset}>
          {!resetCode && (
            <input
              name="code"
              type="text"
              required
              className="appearance-none block w-full px-4 py-3 border border-purple-800 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Reset code"
            />
          )}

          <div className="space-y-4">
            {/* New Password */}
            <div className="relative">
              <input
                name="password"
                type={passwordShow ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-purple-800 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="New password"
                minLength={6}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setPasswordShow(!passwordShow)}
              >
                {passwordShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                name="passwordConfirmation"
                type={passwordShow ? "text" : "password"}
                required
                value={passwordC}
                onChange={(e) => setPasswordC(e.target.value)}
                className="block w-full px-4 py-3 border border-purple-800 rounded-md placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Confirm new password"
                minLength={6}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setPasswordShow(!passwordShow)}
              >
                {passwordShow ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 mt-4 text-white font-semibold rounded-md shadow-md transition-all duration-200 ${submitting
              ? "bg-purple-200 cursor-not-allowed"
              : "bg-[#642c75] hover:bg-purple-700"
              }`}
          >
            {submitting ? "Resetting..." : "Reset Password"}
          </button>

          <div className="flex items-center justify-center mt-3">
            <button
              type="button"
              onClick={() => router.replace("/?login")}
              className="text-sm text-indigo-800 hover:text-indigo-400"
            >
              Back to Login
            </button>
          </div>
        </form>

        {errorMessage && (
          <div className="bg-red-50 text-red-700 border border-red-300 px-4 py-3 rounded-md text-sm">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-700 border border-green-300 px-4 py-3 rounded-md text-sm">
            <strong>Success:</strong> {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthResetForm;
