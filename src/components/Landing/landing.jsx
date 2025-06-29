import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import LogoSVG from "../../../public/logosvg.svg";
import styles from "./landing.module.css";
import { useRouter } from "next/router";
import Auth from "@/pages/auth/login";
import Login from "../Login/login";
import { removeUserInfo } from "@/services/auth.service";
import { signIn, signOut, useSession } from "next-auth/react";
import Lottie from "lottie-web";
function Landing() {
  const router = useRouter();
  //   const  asPath = useRouter();
  const [loginPanel, setLoginPanel] = useState(false);

  console.log(router.asPath, "router");

  let counterAnimation = 0;

  const logoNakhlah = useRef(null);

  useEffect(() => {
    if (counterAnimation === 0) {
      animationJSON();
    }
  }, []);

  function animationJSON() {
    counterAnimation = 1;
    Lottie.loadAnimation({
      container: logoNakhlah.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/animations/Nakhlah Logo Animation2.json",
    });
  }

  const handleLogout = () => {
    removeUserInfo();
    // setIsAuthenticated(false);
    // router.push("/"); // Redirect to login page after logout
  };

  useEffect(() => {
    handleLogout();
    if (router.asPath == "/?login") {
      setLoginPanel(true);
    }
  }, []);

  async function googleLoginHandler() {
    // const x = await signIn("google")
    const myCustomData = { customKey: "customValue" };
    signIn("google", {
      redirect: false,
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.firstHalf}>
        <div className={styles.svgContainer}>
          {/* SVG placed here */}
          {/* <Image src={LogoSVG} width={200} height={220} alt="naklah logo" /> */}
          <div style={{ width: "35%" }} ref={logoNakhlah}></div>
          
        </div>
      </div>
      <div className={styles.secondHalf}>
        <div className={styles.buttonsContainer}>
          {!loginPanel ? (
            <>
              <div className={styles.textAboveButtons}>
                <p style={{ color: "#229B59", fontWeight: "bolder" }}>
                  Welcome to NAKHLAH!
                </p>
                <h4
                  style={{
                    fontSize: " 14px",
                    paddingTop: "8px",
                    color: "#CB8F15",
                  }}
                >
                  The Arabic Learning App
                </h4>
              </div>
              <button
                className={styles.button}
                onClick={() => setLoginPanel(true)}
              >
                Already have an account
              </button>
              {/* <button className={styles.button} onClick={() => router.push('/auth/login')}>Already have an account</button> */}
              <button
                className={styles.button}
                onClick={() => router.push("/query")}
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <div className={styles.textAboveButtons}>
                <Login goBack={() => setLoginPanel()} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
