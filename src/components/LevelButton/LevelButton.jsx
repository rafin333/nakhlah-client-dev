import React, { useState, useEffect } from "react";
import styles from "./LevelButton.module.css"; // Ensure the path is correct based on your project structure
import ProgressRing from "../ProgressRing/ProgressRing"; // Ensure this path is also correct
import { LockIcon } from "lucide-react";

const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
const LevelButton = ({
  level,
  prevLevel,
  index,
  progress,
  onClick,
  CurrentProgress,
  buttonStatus,
  currentLesson,
}) => {
  // console.log(
  //   "Level Button Level Data ==> ",
  //   prevLevel?.lessons.length,
  //   prevLevel?.isExamComplete,
  //   prevLevel?.lessons[prevLevel?.lessons.length - 1].isCompleted,
  //   prevLevel,
  //   currentLesson
  // );
  // console.log(level?.id, level?.isExamComplete, level?.isCompleted, index);
  const lol = Array.from(String(CurrentProgress), Number);
  const CurrentProgressOfLevel = Number(lol[0] + "" + lol[1] + "" + lol[2]);
  // console.log(
  //   "LEVEL BTN LEVEL SEQ ==> ",
  //   level?.id,
  //   buttonStatus,
  //   CurrentProgressOfLevel,
  //   CurrentProgressOfLevel >= buttonStatus && buttonStatus != 0
  // );
  // console.log(level?.id, level.isCompleted, level?.isExamComplete);
  const [size, setSize] = useState(() => {
    const vh = window.innerHeight * 0.0085;
    return { width: 15 * vh, height: 15 * vh }; // Starting size based on 15% of viewport height
  });
  useEffect(() => {
    const updateSize = debounce(() => {
      const vh = window.innerHeight * 0.01;
      setSize({ width: 15 * vh, height: 15 * vh });
    }, 100);

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className={styles.levelButton}>
      
      <ProgressRing progress={progress} size={size.width} />
      {/* level?.isExamComplete && (CurrentProgressOfLevel >= buttonStatus && buttonStatus != 0 ) */}
      {/* {level?.isCompleted ? ( */}
      <div style={{ paddingTop: "50px" }}>
        {/* {!!prevLevel
          ? "Prev " +
            prevLevel.id +
            " || is Comp: " +
            prevLevel.isCompleted +
            " || Exam: " +
            prevLevel.isExamComplete +
            " || Seq: " +
            prevLevel.taskSequence +
            " || Lessons Count: " +
            prevLevel.lessons.length +
            " || Mystrybox: " +
            prevLevel.mysteryBox +
            " == "
          : "Not Prev == "} */}
        {/* { (!!level)?"New "+level.id+" || is Comp: "+level.isCompleted+" || Exam: "+level.isExamComplete+" || Seq: "+level.taskSequence+" || Lessons Count: "+level.lessons.length+" || Mystrybox: "+level.mysteryBox:"Not Prev"} */}
        {/* {JSON.stringify(level)} */}
        {/* {" || Position:" + buttonStatus + " --- " + CurrentProgressOfLevel+" ||| C L : "+currentLesson} */}
      </div>
      {prevLevel == undefined && level?.isCompleted ? (
        <button
          onClick={onClick}
          className={styles.levelButtonInner}
          aria-label={`Open level ${level}`}
        >
          {/* {level?.level} {level?.id} - {buttonStatus} */}
          {/* {level?.mysteryBox ? "REWARD" : level?.level} */}
          {/* {level?.level} */}
        </button>
      ) : // (prevLevel?.lessons[prevLevel?.lessons.length-1].isCompleted && level?.isCompleted) ?
      //   ) : (prevLevel?.lessons[lessons.length - 1]?.isExamComplete && level?.isCompleted) ?
      // ) :
      CurrentProgressOfLevel >= buttonStatus &&
        buttonStatus > 0 &&
        prevLevel?.lessons[prevLevel?.lessons.length - 1].isCompleted &&
        level.isExamComplete ? (
        <button
          onClick={onClick}
          className={styles.levelButtonInner}
          aria-label={`Open level ${level}`}
        >
          {/* {level?.level} {level?.id} - {buttonStatus} */}
          {/* {level?.level}   */}
          {/* {level?.mysteryBox ? "REWARD" : level?.level} */}
        </button>
      ) : (
        <div 
        className={styles.lockButtonInner}
        >
          {/* // <button
         //   onClick={onClick}
        //   className={styles.levelButtonInner}
        //   aria-label={`Open level ${level}`}
        // > */}
          {/* {level?.id} - {level?.mysteryBox ? "REWARD" : level?.level} */}
          {/* <LockIcon /> {level?.id} - {buttonStatus} */}
          {/* {level?.mysteryBox ? "REWARD" : <LockIcon />} */}

          {/* // </button> */}
        </div>
      )}
    </div>
  );
};

export default LevelButton;
