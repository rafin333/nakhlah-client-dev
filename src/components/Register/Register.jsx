// ................
//  ....v2.0....
// ...............


import { TagTypes } from "@/constants/tagTypes";
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
import { Lock } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { decodeJWT } from "@/utils/jwtDecode";
import axios from "axios";

const RegisterForm = ({ onContinue, comesFrom }) => {
  const { t: loginT } = useTranslation(TRANSLATION_NAMESPACES.login);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [SuccessMessage, setSuccessMessage] = useState("");
  const [tcppCheck, setTcppCheck] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [userRegister] = useUserRegisterMutation();
  const [userSocaialLogin] = useUserSocialLoginMutation();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  function confirmPassHandler(pass) {
    setPasswordC(pass);
    if (pass !== password && pass.length >= 6) {
      setErrorMessage("Confirm password didn't match");
    } else if (pass === password) {
      setErrorMessage("");
      setSuccessMessage("Confirm Password matched");
    } else {
      setErrorMessage("");
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    const registerInfo = { email, username, password };
    
    if (tcppCheck && password === passwordC) {
      try {
        const response = await userRegister({ ...registerInfo }).unwrap();
        storeUserInfo({
          accessToken: response?.jwt,
          userInfo: JSON.stringify(response?.user),
        });
        if (response?.jwt) {
          comesFrom === "LearnerInfo" && onContinue(response?.jwt);
        }
      } catch (error) {
        if (error?.data?.error?.message === "Email already exist") {
          setErrorMessage("Email already exists. Please use a different email address.");
        } else {
          setErrorMessage(error?.data?.error?.message || "An unexpected error occurred.");
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
    console.log("Google Login Success:", credentialResponse);
    const decodedToken = decodeJWT(credentialResponse?.credential);
    console.log("Decoded Token:", decodedToken);

    if (credentialResponse?.credential) {
      const response = await userSocaialLogin({ ...googleData }).unwrap();
      if (response) {
        comesFrom === "LearnerInfo" && onContinue(response?.jwt);
      }
    }
  };

  const handleGoogleFailure = () => {
    console.log("Google Login Failed");
    toast.error("Google Login Failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider clientId="802793018966-n25ue3risp6t94o7njfh5tqvl5jhvjuu.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-center">
            <Image src={LogoSVG} width={70} height={220} alt="Logo" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
            {loginT("register")}
          </h2>
          
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          
          {SuccessMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{SuccessMessage}</span>
            </div>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  {loginT("emailAddress")}
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-t-md block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
                  placeholder={loginT("emailAddress")}
                />
              </div>

              <div>
                <label htmlFor="username" className="sr-only">
                  {loginT("username")}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
                  placeholder={loginT("password")}
                  minLength={6}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  {loginT("confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={passShow ? "text" : "password"}
                  required
                  value={passwordC}
                  onChange={(e) => confirmPassHandler(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
                  placeholder={loginT("confirmPassword")}
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agreePrivacyAndTerms"
                name="agreePrivacyAndTerms"
                type="checkbox"
                checked={tcppCheck}
                onChange={() => setTcppCheck(!tcppCheck)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="agreePrivacyAndTerms"
                className="ml-2 text-sm font-bold text-gray-900"
              >
                I agree to the{" "}
                <Link
                  href="/privacyterms"
                  className="text-purple-600 hover:text-purple-900"
                  target="_blank"
                >
                  Privacy Policy and Terms
                </Link>
              </label>
            </div>

            <div className="flex items-center">
              <label
                htmlFor="agreePrivacyAndTerms"
                className="ml-2 text-sm font-bold text-gray-900"
              >
                <Link
                  href="/?login"
                  className="text-purple-600 hover:text-purple-900"
                >
                  Already have an account? Login...
                </Link>
              </label>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={
                  !email ||
                  !username ||
                  !password ||
                  !passwordC ||
                  !tcppCheck ||
                  password !== passwordC ||
                  submitting
                }
                className={
                  !email ||
                  !username ||
                  !password ||
                  !passwordC ||
                  !tcppCheck ||
                  password !== passwordC ||
                  submitting
                    ? "popbuttonDisable"
                    : "popbuttonSuccess"
                }
              >
                {submitting ? "Registering..." : loginT("register")}
              </button>
            </div>

            <div className="flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                text="continue_with"
                size="large"
                type="standard"
                theme="filled_blue"
                width={20}
              />
            </div>
          </form>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default RegisterForm;



// ................
//  ....v1.0....
// ...............

// import { TagTypes } from "@/constants/tagTypes";
// import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
// import {
//   useUserRegisterMutation,
//   useUserSocialLoginMutation,
// } from "@/redux/features/auth/authApi";
// import { storeUserInfo } from "@/services/auth.service";
// import { useTranslation } from "next-i18next";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useState } from "react";
// import LogoSVG from "../../../public/logosvg.svg";
// import { toast } from "react-toastify";
// import { Lock } from "lucide-react";
// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"; // Import Google Login
// import { decodeJWT } from "@/utils/jwtDecode";
// import axios from "axios";

// const RegisterForm = ({ onContinue, comesFrom }) => {
//   const { t: loginT } = useTranslation(TRANSLATION_NAMESPACES.login);
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [passwordC, setPasswordC] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [SuccessMessage, setSuccessMessage] = useState("");
//   const [tcppCheck, setTcppCheck] = useState(false);
//   const [passShow, setPassShow] = useState(false);
//   const [userRegister] = useUserRegisterMutation();
//   const [userSocaialLogin] = useUserSocialLoginMutation();
//   const [submitting, setSubmitting] = useState(false);
//   const router = useRouter();

//   function confirmPassHandler(pass) {
//     setPasswordC(pass);
//     if (pass !== password && pass.length >= 6) {
//       setErrorMessage("Confirm password didn't match");
//     } else if (pass === password) {
//       setErrorMessage("");
//       setSuccessMessage("Confirm Password matched");
//     } else {
//       setErrorMessage("");
//     }
//   }

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     const registerInfo = { email, username, password };
//     if (tcppCheck && password === passwordC) {
//       try {
//         const response = await userRegister({ ...registerInfo }).unwrap();
//         storeUserInfo({
//           accessToken: response?.jwt,
//           userInfo: JSON.stringify(response?.user),
//         });
//         if (response?.jwt) {
//           comesFrom === "LearnerInfo" && onContinue(response?.jwt);

//           // : router.push("/learn").then(() => window.location.reload());
//         }
//       } catch (error) {
//         const errorMessage =
//           error?.data?.error?.message || "An unexpected error occurred.";
//         setErrorMessage(errorMessage);
//       }
//     } else {
//       if (!tcppCheck) setErrorMessage("Agree to the terms and privacy policy.");
//       if (password !== passwordC) setErrorMessage("Passwords do not match.");
//     }
//   };

//   const handleGoogleSuccess = async (credentialResponse) => {
//     console.log("Google Login Success:", credentialResponse);
//     const decodedToken = decodeJWT(credentialResponse?.credential);
//     console.log("Decoded Token:", decodedToken);

//     // const googleData = {
//     //   email: decodedToken.email,
//     //   sid: decodedToken.sub,
//     //   provider: "google",
//     //   token: credentialResponse.credential,
//     // };

//     /* Example of decodedToken:
//     {
//       iss: 'https://accounts.google.com',
//       azp: '802793018966-n25ue3risp6t94o7njfh5tqvl5jhvjuu.apps.googleusercontent.com',
//       aud: '802793018966-n25ue3risp6t94o7njfh5tqvl5jhvjuu.apps.googleusercontent.com',
//       sub: '115074539354599974456',
//       email: 'blackcaiman123@gmail.com',
//       email_verified: true,
//       nbf: 1737886210,
//       name: 'Black Caiman',
//       picture: 
//         'https://lh3.googleusercontent.com/a/ACg8ocIIGF3vF2kEiYNHvhoZL08Hg9quTRtNZDGkO_DNbK5KIEMhaA=s96-c',
//       given_name: 'Black',
//       family_name: 'Caiman',
//       iat: 1737886510,
//       exp: 1737890110,
//       jti: 'c1aa1a91d3140f780ed6578d6aaafa5eb558cd9e'
//     } 
        
//     */

//     if (credentialResponse?.credential) {
//       const response = await userSocaialLogin({ ...googleData }).unwrap();
//       // storeUserInfo({
//       //   accessToken: response?.jwt,
//       //   userInfo: JSON.stringify(response?.user),
//       // });
//       if (response) {
//         comesFrom === "LearnerInfo" && onContinue(response?.jwt);
//         // : router.push("/learn").then(() => window.location.reload());
//       }
//     }

//     // Handle login logic here
//   };

//   const handleGoogleFailure = () => {
//     console.log("Google Login Failed");
//     toast.error("Google Login Failed. Please try again.");
//   };

//   return (


//     <GoogleOAuthProvider clientId="802793018966-n25ue3risp6t94o7njfh5tqvl5jhvjuu.apps.googleusercontent.com">

//     <div className="min-h-screen flex items-center justify-center bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4 py-12 px-4 sm:px-6 lg:px-8">

//       <div className="max-w-md w-full space-y-8">
//         <div className="flex justify-center">
//           <Image src={LogoSVG} width={70} height={220} alt="Logo" />
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-[#642c75]">
//           {loginT("register")}
//         </h2>
//         <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
//           {/* Registration Forms */}
//           <div className="rounded-md shadow-sm space-y-4">
//             {/* Email Input */}
//             <div>
//               <label htmlFor="email-address" className="sr-only">
//                 {loginT("emailAddress")}
//               </label>
//               <input
//                 id="email-address"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="appearance-none rounded-t-md block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
//                 placeholder={loginT("emailAddress")}
//               />
//             </div>

//             {/* Username Input */}
//             <div>
//               <label htmlFor="username" className="sr-only">
//                 {loginT("username")}
//               </label>
//               <input
//                 id="username"
//                 name="username"
//                 type="text"
//                 autoComplete="username"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
//                 placeholder={loginT("username")}
//               />
//             </div>

//             {/* Password Input */}
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 {loginT("password")}
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type={passShow ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
//                 placeholder={loginT("password")}
//                 minLength={6}
//               />
//             </div>

//             {/* Confirm Password Input */}
//             <div>
//               <label htmlFor="confirmPassword" className="sr-only">
//                 {loginT("confirmPassword")}
//               </label>
//               <input
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 type={passShow ? "text" : "password"}
//                 required
//                 value={passwordC}
//                 onChange={(e) => confirmPassHandler(e.target.value)}
//                 className="appearance-none block w-full px-3 py-2 border border-purple-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-purple-500 sm:text-sm"
//                 placeholder={loginT("confirmPassword")}
//                 minLength={6}
//               />
//             </div>
//           </div>

//           {/* Terms and Privacy Policy */}
//           <div className="flex items-center">
//             <input
//               id="agreePrivacyAndTerms"
//               name="agreePrivacyAndTerms"
//               type="checkbox"
//               checked={tcppCheck}
//               onChange={() => setTcppCheck(!tcppCheck)}
//               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//             />
//             <label
//               htmlFor="agreePrivacyAndTerms"
//               className="ml-2 text-sm font-bold text-gray-900"
//             >
//               I agree to the{" "}
//               <Link
//                 href="/privacyterms"
//                 className="text-purple-600 hover:text-purple-900"
//                 target="_blank"
//               >
//                 Privacy Policy and Terms
//               </Link>
//             </label>
            
//           </div>
//           <div className="flex items-center">
            
//             <label
//               htmlFor="agreePrivacyAndTerms"
//               className="ml-2 text-sm font-bold text-gray-900"
//             >
              
//               <Link
//                 href="/?login"
//                 className="text-purple-600 hover:text-purple-900" 
//               >
//                 Already have an account? Login...
//               </Link>
//             </label>
            
//           </div>
//           {/* Submit Button */}
//           <div className="flex items-center justify-center">
//             <button
//               type="submit"
//               disabled={
//                 !email ||
//                 !username ||
//                 !password ||
//                 !passwordC ||
//                 !tcppCheck ||
//                 password !== passwordC ||
//                 submitting
//               }
//               className={
//                 !email ||
//                 !username ||
//                 !password ||
//                 !passwordC ||
//                 !tcppCheck ||
//                 password !== passwordC ||
//                 submitting
//                   ? "popbuttonDisable"
//                   : "popbuttonSuccess"
//               }
//             >
//               {loginT("register")}
//             </button>
//           </div>

//           {/* Google Login */}
//           <div className="flex justify-center mt-4">
//             <GoogleLogin
//               onSuccess={handleGoogleSuccess}
//               onError={handleGoogleFailure}
//               text="continue_with"
//               size="large"
//               type="standard"
//               theme="filled_blue"
//               width={20}
//             />
//           </div>
//         </form>
//       </div>
//     </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default RegisterForm;