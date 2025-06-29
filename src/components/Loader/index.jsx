// import Image from "next/image";

import Lottie from "lottie-web";
import { useEffect, useRef } from "react";

const Loader = () => {
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
  return (
    <div className="flex h-screen items-center justify-center bg-[rgb(248 241 219 / var(--tw-bg-opacity, 1))]">
      <div className="h-auto w-50% flex items-center justify-center text-3xl font-bold  bg-[rgb(248 241 219 / var(--tw-bg-opacity, 1))]">
        <div style={{ width: "35%" }} ref={logoNakhlah}></div>
        <div className="text-center">
          {/* <p style={{ color: "#229B59", fontWeight: "bolder" }}>
            Loading...
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Loader;
