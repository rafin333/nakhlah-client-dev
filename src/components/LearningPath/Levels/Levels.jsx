import React, { useState, useEffect, useMemo, useCallback } from "react";
import LevelButton from "@/components/LevelButton/LevelButton";
import Modal from "@/components/Modals/Modal";
import Level from "../Level/Level";
import ToastMessage from "@/components/Toast";

const Levels = ({ unitTitle, levels, unitNumber, backgroundImageNumber, CurrentProgress, currentLesson }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isMystryBox, setIsMystryBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // console.log(currentLesson)
  console.log(" CURRENT PROGRESS => ", CurrentProgress)
  const lol = Array.from(String(CurrentProgress), Number);
  const CurrentProgressOfLevel = Number(lol[0] + "" + lol[1] + "" + lol[2]) ///// Level > unit > task
  // console.log(" Current Progress Of Level > ",CurrentProgressOfLevel)

  // console.log(backgroundImageNumber);
  // console.log(windowWidth);
  const LevelSort = levels?.sort((a, b) => a.taskSequence - b.taskSequence)
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleOpenModal = (level, isLevelOpen) => {
    // console.log(" Level in Levels.jsx => ",level)
    if (level.isCompleted || isLevelOpen || level.mysteryBox) {
      setSelectedLevel(level);
      setShowModal(true);
      setIsMystryBox(level.mysteryBox)
    } else {
      notify("error", "Please solve previous task first");
    }
  };

  const reversedLevels = useMemo(
    () => (Array.isArray(LevelSort) ? [...LevelSort].reverse() : []),
    [LevelSort]
  );
  // console.log("reversedLevels : ",reversedLevels)
  const notify = useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);
  const calculateOffset1 = (index, totalLevels, maxHorizontalOffset, maxVerticalStep) => {
    let offsetX = maxHorizontalOffset;
    // let offsetY = maxVerticalStep;
    let offsetY = '0%';
    // console.log(offsetY)
    let mobileScreenSize = 500;
    if (index == totalLevels - 1) {
      // console.log(offsetX);
      // offsetX = offsetX;
      offsetX = '0%';
    }
    else if (index == totalLevels - 2) {
      // console.log( windowWidth * 0.13948);
      // offsetX =  windowWidth * 0.13948;
      // console.log(windowWidth, windowWidth * 0.0594);
      // offsetX = windowWidth > mobileScreenSize ? windowWidth * 0.0594 : windowWidth * 0.13948;
      offsetX = windowWidth > mobileScreenSize ? '60%' : windowWidth * 0.13948;
    }
    else if (index == totalLevels - 3 || index == totalLevels - 4) {
      // console.log(offsetX + 200);
      // offsetX = offsetX + 200;
      // console.log(windowWidth * 0.9148432942);
      // offsetX = windowWidth > mobileScreenSize ? windowWidth * 0.09148432942 : windowWidth * 0.23349822222;
      offsetX = windowWidth > mobileScreenSize ? '110%' : windowWidth * 0.23349822222;
    }
    else if (index == totalLevels - 5) {
      // console.log( windowWidth * 0.13948);
      // offsetX =  windowWidth * 0.13948;
      // console.log(windowWidth, windowWidth * 0.0594);
      // offsetX = windowWidth > mobileScreenSize ? windowWidth * 0.0594 : windowWidth * 0.13948;
      offsetX = windowWidth > mobileScreenSize ? '40%' : windowWidth * 0.13948;
    }
    else if (index == totalLevels - 6 || index == totalLevels - 7) {
      // console.log(offsetX + 200);
      // offsetX = offsetX + 200;
      // console.log(windowWidth * 0.9148432942);
      // offsetX = windowWidth > mobileScreenSize ? windowWidth * 0.09148432942 : windowWidth * 0.23349822222;
      offsetX = windowWidth > mobileScreenSize ? '-45%' : windowWidth * 0.23349822222;
    }


    return {
      x: offsetX,
      y: offsetY,
    }
  }

  const calculateOffset = (index, totalLevels) => {
    let maxHorizontalOffset = 0;
    let maxVerticalStep = 0;
    // if (backgroundImageNumber == 3) {
    //   maxHorizontalOffset = -0.12 * windowWidth;
    //   return calculateOffset3(index, totalLevels, maxHorizontalOffset, maxVerticalStep)
    // }
    // if (backgroundImageNumber == 2) {
    //   maxHorizontalOffset = -0.28 * windowWidth;
    //   return calculateOffset2(index, totalLevels, maxHorizontalOffset, maxVerticalStep)
    // }
    // if (backgroundImageNumber == 1) {
    maxHorizontalOffset = 0.011276 * windowWidth;
    maxVerticalStep = 0.00325520833 * windowWidth;
    return calculateOffset1(index, totalLevels, maxHorizontalOffset, maxVerticalStep)
    // }
    // else {
    //   return {
    //     x: 0,
    //     y: 0,
    //   }
    // }
  }

  return (
    <div className="flex flex-col items-center relative">
      {reversedLevels.map((level, index) => {
        // const offset = calculateOffset(index, reversedLevels.length);
        // console.log(level)
        // console.log(reversedLevels[index]?.id,reversedLevels[index+1]?.id,reversedLevels[index+1]?.isExamComplete)
        // console.log("Data inside Level +> ",level)
        // console.log("level in Learning path > levels > levels.jsx ===> ", level?.lessons[0]?.learning_journey_level?.data?.attributes?.learning_journey_unit?.data?.attributes?.learning_journey?.data?.attributes?.sequence+""+level?.lessons[0]?.learning_journey_level?.data?.attributes?.learning_journey_unit?.data?.attributes?.unitSequence+""+level?.lessons[0]?.learning_journey_level?.data?.attributes?.taskSequence)
        const totalLevels = levels.length;
        const { x: offsetX, y: offsetY } = calculateOffset(index, totalLevels);
        const levelSeq = (level.lessons[0]?.title == "Exam") ? 0 : Number(level?.lessons[0]?.learning_journey_level?.data?.attributes?.learning_journey_unit?.data?.attributes?.learning_journey?.data?.attributes?.sequence + "" + level?.lessons[0]?.learning_journey_level?.data?.attributes?.learning_journey_unit?.data?.attributes?.unitSequence + "" + level?.lessons[0]?.learning_journey_level?.data?.attributes?.taskSequence)
        // console.log("LEVELs  LEVEL SEQ ==> ", levelSeq, CurrentProgressOfLevel, (CurrentProgressOfLevel >= levelSeq && levelSeq != 0)) 
        const isLevelOpen = CurrentProgressOfLevel >= levelSeq && levelSeq != 0
        const style = {
          transform: `translate(${offsetX}, ${offsetY})`, zIndex: "200",
        };
        // console.log(style)
        return (
          <div
            key={level.id}
            style={style}
            className="flex justify-center my-2"
          >
            {/* {level.taskSequence}  */}
            {/* {
              level.lessons.map( (x) => x.id+' - ')
            } */}
            <LevelButton
              level={level}
              prevLevel={reversedLevels[index + 1]}
              index={index}
              progress={level.progress || 0}
              onClick={() => handleOpenModal(level, isLevelOpen)}
              CurrentProgress={CurrentProgress}
              buttonStatus={levelSeq}
              mysteryBox={level.mysteryBox}
              currentLesson={currentLesson}
            />
          </div>
        );
      })}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {/* {"boom : "+JSON.stringify(reversedLevels)} */}
          <Level unitTitle={unitTitle} {...selectedLevel} mysteryBox={isMystryBox} />
        </Modal>
      )}
    </div>
  );
};

export default Levels;