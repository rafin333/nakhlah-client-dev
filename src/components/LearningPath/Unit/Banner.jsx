import React from "react";

function FloatingBanner({ text, icon, index }) {
  return (
    <div
      // className="absolute bottom-0 left-0 right-0"

      style={{ transform: "translate(25%, -50%)" }}
    >
      <div
        // style={{
        //   // position: "absolute",
        //   bottom: `-${index * 115 + 5}vh`,
        //   left: "10vh",
        // }} 
      >
        <img
          src={icon}
          alt="Unit Icon" 
          width={"22%"}
        />
        <p
          className="text-white text-center font-bold"
          style={{
            position: "absolute",
            top: "33%",
            left: "6%",
            fontSize: "calc(6px + .5vw)"
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

export default FloatingBanner;
