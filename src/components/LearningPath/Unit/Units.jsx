import React, { useMemo, useRef, useEffect } from "react";
// import { useTranslation } from "next-i18next";
import Levels from "../Levels/Levels";
// import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import FloatingBanner from "./Banner";

const Units = ({ units, CurrentProgress }) => {
  // const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const containerRef = useRef(null);
  const unitSort = units?.sort((a, b) => a.unitSequence - b.unitSequence);
  console.log(unitSort);
  console.log(
    "CurrentProgress from  src/components/LearningPath/Unit/Units.jsx ==> ",
    CurrentProgress
  );

  console.log("Units Sort =? ", units);

  const reversedUnits = useMemo(() => {
    return Array.isArray(unitSort) ? [...unitSort].reverse() : [];
  }, [unitSort]);

  // // Update scroll position on component mount and whenever the units change
  useEffect(() => {
    if (containerRef.current) {
      const element = containerRef.current;
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }, [reversedUnits]); // Notice the dependency on `reversedUnits` here

  return (
    <div ref={containerRef} className="overflow" style={{ maxHeight: "350vh" }}>
      {reversedUnits?.map((unit, index) => (
        <>
          <div
            key={index}
            className="flex flex-col justify-between unitBackground"
            style={{
              backgroundImage: `url(${unit.backgroundImageUrl})`,
              top: `${index}00vh`,
            }}
          >
            {/* <div className="flex justify-between items-center text-white rounded-lg p-2 mb-4 border">

            <h1 className="font-bold text-white p-6">{unit.unitTitle}</h1>
             
          </div> */}
            <div className="p-6 mt-auto">
              {/* <h1>HELLO!!</h1> */}
              <Levels
                currentLesson={unit.currentLesson}
                unitTitle={unit.unitTitle}
                levels={unit.levels}
                backgroundImageNumber={unit?.backgroundImageNumber}
                unitNumber={index}
                CurrentProgress={CurrentProgress}
              />
              <div
                style={{
                  maxWidth: "130vh",
                  position: "fixed",
                  top: "100vh",
                  left: "25vh",
                  zIndex: "100",
                }}
              >
                <FloatingBanner
                  text={unit.unitTitle}
                  icon={"/image/X.svg"}
                  index={index}
                />
              </div>
            </div>
          </div>
          {/* <div style={{backgroundImage: "url(/image/X.svg)"}}> */}
          {/* <div className="flex justify-between items-center rounded-lg border ">
             
          </div> */}
        </>
      ))}
    </div>
  );
};

export default Units;
