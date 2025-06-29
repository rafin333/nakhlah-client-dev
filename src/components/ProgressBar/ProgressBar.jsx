import { GAMIFICATION_TYPE } from "@/constants/gamificationType";
import { useGetLearnerGamificationStockQuery } from "@/redux/features/gamification/gamificationAPI";
import { Typography } from "@material-tailwind/react";
import { data } from "autoprefixer";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { GiPalmTree } from "react-icons/gi";
import { useSelector } from "react-redux";

const ProgressBar = ({
  step,
  correctAns,
  totalSteps,
  handleCrossClick,
  timeCount,
  totalInitialSteps,
  setShowModal,
  isClickedCheck
}) => {

  console.log(step, totalSteps, totalInitialSteps,isClickedCheck);
  const [time, setTime] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [palm, setPalm] = useState(0);
  // console.log(progressPercentage);
  const timeRef = useRef(null);

    const { palmData } = useSelector((state) => state.gamificationStore);
    const { planData } = useSelector((state) => state.subscriptionStore);
    console.log(palmData)
  const hasSubscription =
    planData && planData?.subscription_plan?.planName != "Free";

  useEffect(() => {
    if (step !== "complete") {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [step]);


  useEffect(() => {
    setProgressPercentage(((correctAns / totalInitialSteps) * 100).toFixed(0));
    const num_palm = palmData
    setPalm(palmData);
    console.log(num_palm?.stock);
    if (num_palm?.stock == 0) {
      setShowModal(true);
    }
  }, [step, totalSteps,palmData]);


  useEffect(() => {
    if (timeRef.current && step !== "complete") {
      timeRef.current.textContent =
        ("0" + Math.trunc(time / 60)).slice(-2) +
        ":" +
        ("0" + (time % 60)).slice(-2);
    } else {
      timeCount(timeRef.current.textContent);
    }
    // console.log('T I M E +==== >', timeRef.current.textContent)
  }, [step, time, timeCount,isClickedCheck,palmData]);


  const [num_palm, setNum_palm] = useState(0);

  useEffect(() => {
    setNum_palm(palm?.stock);
  }, [palm,isClickedCheck,palmData]);


  const palmTotal = 5;
  const palmLost = Number(palmTotal - num_palm);
  console.log(num_palm);
  console.log(palmLost);
  return (
    <div className="flex items-center mb-4">
      <button
        onClick={handleCrossClick}
        className="text-gray-700 p-2 rounded-full leading-none flex items-center justify-center w-12 h-12" // Tailwind classes for the button
      >
        <AiOutlineCloseCircle className="text-3xl" />
        {/* <AiOutlineClose className="text-3xl"/> */}
      </button>
      <div className="flex-1 relative">
        <div className="rounded-full bg-gray-400 h-6  flex items-center text-white">
          <div
            className="bg-orange-500 h-full rounded-full pl-2 "
            style={{ width: `${progressPercentage}%` }}
          >
            {correctAns}
            {/* {step === "complete" ? "" : `(${progressPercentage || 0} %)`} */}
          </div>
        </div>
      </div>
      <div className="flex items-center ml-4">
        {/* <span className="text-lg">{totalInitialSteps}&nbsp;</span> */}
        <Typography className="font-large">
          
          {totalInitialSteps} &nbsp;
        </Typography>
        {/* <GiPalmTree className="text-2xl ml-2" /> */}
        {hasSubscription ? (
          <div >
            {/* unlimited life for subscribed user. we just keep it blank */}
          </div>
        ) : (
          <>
            {Array(num_palm)
              .fill(null)
              .map((_, index) => (
                <Image
                  key={index}
                  src={"/image/Palm_Tree.svg"}
                  width={35}
                  height={35}
                  alt="palm tree"
                />
              ))}

            {palmLost >= 0 &&
              Array(palmLost)
                .fill(null)
                .map((_, index) => (
                  <>
                    <Image
                      key={index}
                      src="/image/Palm_Tree_without_life_1.svg"
                      style={{ position: "relative" }}
                      width={35}
                      height={35}
                      alt="palm tree"
                    />
                  </>
                ))}
          </>
        )}

        {/* <span className="text-2xl ml-1">{num_palm?.stock}</span> */}
        {/* <Typography className="font-large"> &nbsp; {palmLost}</Typography> */}
        <div
          ref={timeRef}
          style={{ textAlign: "center", fontSize: "1.3em", marginLeft: "15px" }}
        >
          00:00
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
