/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Units from "@/components/LearningPath/Unit/Units";
import withAuth from "@/components/withAuth";
import {
  useGetLearningJourneyLessonsQuery,
  useGetLearningJourneyLevelsQuery,
  useGetLearningJourneyUnitsQuery,
} from "@/redux/features/learningJourney/learningJourneyApi";

import Loader from "@/components/Loader";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
import { useGetLearnerProgressQuery } from "@/redux/features/learnerProgress/learnerProgress";
import { useGetLearnerInfosQuery, useGetLearningJourneyPointerQuery } from "@/redux/features/learnerInfos/learnerInfosApi";
import { useRouter } from "next/router";
import lesson from "../lesson";
import { useGetExamsQuery } from "@/redux/features/exam/examAPI";
import { storeLearnerInfo } from "@/services/learnerInfo.service";
import StreakTracker from "@/components/StreakTracker/StreakTracker";
// import { 
//   useGetLearnerStreaksQuery,
// } from "@/redux/features/learnerStreaks/learnerStreaks";
import { authKey } from "@/constants/storageKey";
import { getFromLocalStorage } from "@/utils/local-storage";

import Modal from "@/components/Modals/Modal";

import Pointers from "@/components/LearningPath/Pointer/Pointers";
import WelcomeModal from "@/components/WelcomeModal/WelcomeModel";
const LearningPathPage = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(true);
  // const accessToken = getFromLocalStorage(authKey);

  // console.log(accessToken);
  // useEffect(() => {
  // if (!accessToken) {
  //     router.push("/?login");
  //   }
  // }, []);
  const { t, i18n } = useTranslation("common");
  const query = {
    populate: "*",
    "sort[0]": "id:asc",
  };
  const lessonQuery = {
    "sort[0]": "id:asc",
    "populate[learning_journey_level][populate][learning_journey_unit][populate][0]":
      "learning_journey",
    populate: "*",
  };
  const { data: learnerInfoData, isLoading } = useGetLearnerInfosQuery({
    ...query,
  });
  const { data: examInfo } = useGetExamsQuery({ ...query });
  const { data: pointerData, isLoading: pointerLoading } = useGetLearningJourneyPointerQuery({...query})
  const { data: unitData, isLoading: unitLoading } =
    useGetLearningJourneyUnitsQuery({ ...query });
  const { data: levelData, isLoading: levelLoading } =
    useGetLearningJourneyLevelsQuery({ ...query });
  const { data: lessonData, isLoading: lessonLoading } =
    useGetLearningJourneyLessonsQuery({ ...lessonQuery });
  const { data: learnerProgress } = useGetLearnerProgressQuery({ ...query });
  // const { data: learnerStreak } = useGetLearnerStreaksQuery({ ...query });
  const [unitsData, setUnitsData] = useState([]);
  const [currentLessonInfos, setCurrentProgressInfos] = useState({});
  const [isShowSteak, setIsShowSteak] = useState(true);
  const [days, setDays] = useState([]);
  console.log("exam info", examInfo);
  console.log("units data", unitsData);
  console.log("learner info data", learnerInfoData);
  console.log("learnerProgress data", learnerProgress); 
  console.log("lessonData data", lessonData);
  console.log("lessonLoading data", lessonLoading);
  const [loading, setLoading] = useState(true);
  const [currentProgressInfo, setCurrentProgressInfo] = useState(0);
  const allLessonInfo = [];
  let firstLessonInfo = [];

  console.log(lessonData, learnerProgress);
  /*   useEffect(() => {
      
    }, []) */

  console.log(currentLessonInfos);
  console.log(examInfo);
  const progressId =
    learnerProgress?.[learnerProgress.length - 1]?.progressId || 41;
  useEffect(() => {
    console.log(progressId);
    const currentLesson = lessonData?.find(
      (lesson) => lesson?.id == progressId
    );
    console.log(currentLesson);
    setCurrentProgressInfo(
      Number(
        currentLesson?.attributes?.learning_journey_level?.data?.attributes
          ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
          ?.attributes?.sequence +
          "" +
          currentLesson?.attributes?.learning_journey_level?.data?.attributes
            ?.learning_journey_unit?.data?.attributes?.unitSequence +
          "" +
          currentLesson?.attributes?.learning_journey_level?.data?.attributes
            ?.taskSequence +
          "" +
          currentLesson?.attributes?.lessonSequence
      )
    );
    console.log(
      currentLesson?.attributes?.learning_journey_level?.data?.attributes
        ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
        ?.attributes
    );
    setCurrentProgressInfos({
      levelSequence:
        currentLesson?.attributes?.learning_journey_level?.data?.attributes
          ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
          ?.attributes?.sequence,
      unitSequence:
        currentLesson?.attributes?.learning_journey_level?.data?.attributes
          ?.learning_journey_unit?.data?.attributes?.unitSequence,
      taskSequence:
        currentLesson?.attributes?.learning_journey_level?.data?.attributes
          ?.taskSequence,
      lessonSequence: currentLesson?.attributes?.lessonSequence,
    });
    lessonData?.map((lessonInfo) => {
      const lol = Number(
        lessonInfo?.attributes?.learning_journey_level?.data?.attributes
          ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
          ?.attributes?.sequence +
          "" +
          lessonInfo?.attributes?.learning_journey_level?.data?.attributes
            ?.learning_journey_unit?.data?.attributes?.unitSequence +
          "" +
          lessonInfo?.attributes?.learning_journey_level?.data?.attributes
            ?.taskSequence +
          "" +
          lessonInfo?.attributes?.lessonSequence
      );
      allLessonInfo.push(lol);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    firstLessonInfo = Math.min(...allLessonInfo);
    console.log(" firstLessonInfo => ", firstLessonInfo, allLessonInfo);
  }, [lessonData, learnerProgress]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(isLoading);
      if (!isLoading && (!learnerInfoData || learnerInfoData?.length === 0)) {
        // router.push("/query");
        console.log(learnerInfoData);
      } else {
        console.log(learnerInfoData);
        let learner =
          learnerInfoData &&
          learnerInfoData.length > 0 &&
          learnerInfoData[learnerInfoData.length - 1];
        console.log(learner);
        if (learner) {
          let learnerInfo = {
            language: learner?.language?.name,
          };
          console.log(learnerInfo);
          storeLearnerInfo(JSON.stringify(learnerInfo));
        }
      }

      
      const pointerArr = [];
      console.log(pointerData)
      for ( let p = 0; p < pointerData?.length; p++){
        const pointer = pointerData[p]
        console.log(pointer)
        const unitsDataArr = [];
        for (let i = 0; i < unitData?.length; i++) {
          let backgroundImageIndex = i % 5;
          const unit = unitData[i];
          console.log(unit)
          if (unit?.attributes?.learning_journey?.data?.id === pointer?.id) {
          console.log(i, backgroundImageIndex); 
          console.log("LEVEL DATA _++ > ", levelData);
  
          const levels = [];
          for (let j = 0; j < levelData?.length; j++) {
            const level = levelData[j];
            if (level?.attributes?.learning_journey_unit?.data?.id === unit?.id) {
              console.log("Level Data --> ", level);
              console.log("LESSON DATA => ", lessonData);
  
              const lessons = [];
              for (let k = 0; k < lessonData?.length; k++) {
                const lesson = lessonData[k];
                console.log(lesson)
                console.log(
                  "aaaa",currentProgressInfo,
                  Number(
                    lesson.attributes?.learning_journey_level?.data?.attributes
                      ?.learning_journey_unit?.data?.attributes?.learning_journey
                      ?.data?.attributes?.sequence +
                      "" +
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.learning_journey_unit?.data?.attributes?.unitSequence +
                      "" +
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.taskSequence +
                      "" +
                      lesson.attributes?.lessonSequence
                  ) 
                );
                if (
                  lesson?.attributes?.learning_journey_level?.data?.id ===
                  level?.id
                ) {
                  console.log(
                    lesson?.id,
                    Number(
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.learning_journey_unit?.data?.attributes
                        ?.learning_journey?.data?.attributes?.sequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.unitSequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.taskSequence +
                        "" +
                        lesson.attributes?.lessonSequence
                    ),
                    currentProgressInfo,
                    Number(
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.learning_journey_unit?.data?.attributes
                        ?.learning_journey?.data?.attributes?.sequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.unitSequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.taskSequence +
                        "" +
                        lesson.attributes?.lessonSequence
                    ) <= currentProgressInfo
                  );
                  console.log(
                    lesson?.id,
                    Number(
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.learning_journey_unit?.data?.attributes
                        ?.learning_journey?.data?.attributes?.sequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.unitSequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.taskSequence +
                        "" +
                        lesson.attributes?.lessonSequence
                    ),
                    currentProgressInfo
                  );
                  console.log(
                    level?.id,
                    lesson?.id,
                    Number(
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.learning_journey_unit?.data?.attributes
                        ?.learning_journey?.data?.attributes?.sequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.unitSequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.taskSequence +
                        "" +
                        lesson.attributes?.lessonSequence
                    ) <= currentProgressInfo
                  );
                  console.log(
                    level?.id,
                    lesson?.id,
                    Number(
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.learning_journey_unit?.data?.attributes
                        ?.learning_journey?.data?.attributes?.sequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.unitSequence +
                        "" +
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.taskSequence +
                        "" +
                        lesson.attributes?.lessonSequence
                    )
                  );
                  lessons.push({
                    id: lesson?.id,
                    icon: "🌟",
                    isCompleted:
                      Number(
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.learning_journey?.data?.attributes?.sequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.learning_journey_unit?.data?.attributes
                            ?.unitSequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.taskSequence +
                          "" +
                          lesson.attributes?.lessonSequence
                      ) < currentProgressInfo,
                    isCurrent:
                      Number(
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.learning_journey?.data?.attributes?.sequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.learning_journey_unit?.data?.attributes
                            ?.unitSequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.taskSequence +
                          "" +
                          lesson.attributes?.lessonSequence
                      ) == currentProgressInfo,
                    title: lesson?.attributes?.title,
                    lessonSequence: lesson?.attributes?.lessonSequence,
                    learning_journey_level:
                      lesson?.attributes?.learning_journey_level,
                    mysteryBox:
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.mysteryBox,
                    currentLesson: progressId,
                  });
                } else if (level?.mysteryBox === true) {
                  lessons.push({
                    id: lesson?.id,
                    icon: "🌟",
                    isCompleted:
                      Number(
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.learning_journey?.data?.attributes?.sequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.learning_journey_unit?.data?.attributes
                            ?.unitSequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.taskSequence +
                          "" +
                          lesson.attributes?.lessonSequence
                      ) < currentProgressInfo,
                    isCurrent:
                      Number(
                        lesson.attributes?.learning_journey_level?.data
                          ?.attributes?.learning_journey_unit?.data?.attributes
                          ?.learning_journey?.data?.attributes?.sequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.learning_journey_unit?.data?.attributes
                            ?.unitSequence +
                          "" +
                          lesson.attributes?.learning_journey_level?.data
                            ?.attributes?.taskSequence +
                          "" +
                          lesson.attributes?.lessonSequence
                      ) == currentProgressInfo,
                    title: lesson?.attributes?.title,
                    lessonSequence: lesson?.attributes?.lessonSequence,
                    learning_journey_level:
                      lesson?.attributes?.learning_journey_level,
                    mysteryBox:
                      lesson.attributes?.learning_journey_level?.data?.attributes
                        ?.mysteryBox,
                    currentLesson: progressId,
                  });
                }
              }
  
              console.log(
                "LESSONS OF A LEVEL == > ",
                lessons,
                lessons.length,
                lessons[0]?.title
              );
  
              const allLessonsCompleted =
                lessons.length > 0
                  ? lessons.every((lesson) => lesson.isCompleted)
                  : false;
              console.log(level?.id, allLessonsCompleted);
              const examLesson = {
                id: `exam-${level?.id}`,
                icon: "📝",
                isCompleted: allLessonsCompleted,
                title: `Quiz`,
                lessonSequence: lessons.length + 2,
                currentLesson: progressId,
              };
              console.log(level?.attributes?.taskSequence - 1);
              let isExamComplete = false;
              let previousLessonId = levels[levels.length - 1]?.id;
              console.log(previousLessonId, level?.id);
              if (examInfo && examInfo.length > 0) {
                console.log("exam info");
                console.log(examInfo);
                isExamComplete = examInfo.some(
                  (exam) => exam?.learning_journey_level?.id == previousLessonId
                );
                console.log(isExamComplete);
              }
              if (examInfo && examInfo.length == 0 && !previousLessonId) {
                isExamComplete = true;
              }
              if (levels.length == 0) {
                isExamComplete = true;
              }
              console.log(level.id, isExamComplete);
              // console.log(Number(unit?.attributes?.learning_journey?.data?.attributes?.sequence + "" + unit?.attributes?.unitSequence + "" + level?.attributes?.taskSequence) <= Number(currentLessonInfos?.levelSequence + "" + currentLessonInfos?.unitSequence + "" + currentLessonInfos?.taskSequence));
              levels.push({
                id: level?.id,
                isCompleted:
                  Number(
                    unit?.attributes?.learning_journey?.data?.attributes
                      ?.sequence +
                      "" +
                      unit?.attributes?.unitSequence +
                      "" +
                      level?.attributes?.taskSequence
                  ) <=
                  Number(
                    currentLessonInfos?.levelSequence +
                      "" +
                      currentLessonInfos?.unitSequence +
                      "" +
                      currentLessonInfos?.taskSequence
                  ),
                isExamComplete: isExamComplete,
                level: level?.attributes?.title || "",
                taskSequence: level?.attributes?.taskSequence,
                levelDescription: "", // Assuming you have a description attribute to fill this
                lessons: [...lessons, examLesson],
                mysteryBox: level?.attributes?.mysteryBox,
                currentLesson: progressId,
              });
            }
          }
  
          unitsDataArr.push({
            unitTitle: unit.attributes.title,
            unitSequence: unit.attributes.unitSequence,
  
            backgroundImageUrl: `/image/bg-Update-0${
              backgroundImageIndex + 1
            }.jpg`,
  
            levels: levels,
            backgroundImageNumber: backgroundImageIndex + 1,
            currentLesson: progressId,
          });

        }
        }
  
        pointerArr.push({
          pointerTitle: pointer?.attributes?.title,
          pointerSequence: pointer?.attributes?.sequence,
          units: unitsDataArr
        })
      }


      setUnitsData(pointerArr.sort((a,b) => a.pointerSequence - b.pointerSequence)); 
      console.log("POINTER DATA ==> ",pointerArr.sort((a,b) => a.pointerSequence - b.pointerSequence));
      setLoading(false);
    };

    fetchData();
  }, [
    unitData,
    levelData,
    lessonData,
    currentProgressInfo,
    learnerInfoData,
    router,
    isLoading,
    progressId,
    examInfo,
    currentLessonInfos?.levelSequence,
    currentLessonInfos?.unitSequence,
    currentLessonInfos?.taskSequence,
  ]);
 

  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <div>
      {loading || pointerLoading || unitLoading || levelLoading || lessonLoading ? (
        <Loader />
      ) : (
        // Render Units component once data is fetched
        <>
          {/* {!isShowSteak && (
            <Units units={unitsData} CurrentProgress={currentProgressInfo} />
          )}
          {isShowSteak && (
            <StreakTracker streak={7} days={days} handleContinue={handleContinue} />
          )} */}

          {/* {showModal && (
            <Modal onClose={() => setShowModal(false)}>
            
               <WelcomeModal/> 
            </Modal>
          )}  */}

          <Pointers pointers={unitsData} CurrentProgress={currentProgressInfo} />
        </>
      )}
    </div>
  );
};
export async function getStaticProps({ locale }) {
  console.log(locale);

  return {
    props: {
      ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
      // Will be passed to the page component as props
    },
  };
}
export default withAuth(LearningPathPage);



// import React, { useEffect, useState } from "react";
// import Units from "@/components/LearningPath/Unit/Units";
// import withAuth from "@/components/withAuth";
// import {
//   useGetLearningJourneyLessonsQuery,
//   useGetLearningJourneyLevelsQuery,
//   useGetLearningJourneyUnitsQuery,
// } from "@/redux/features/learningJourney/learningJourneyApi";

// import Loader from "@/components/Loader";
// import { useTranslation } from "next-i18next";
// import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
// import { useGetLearnerProgressQuery } from "@/redux/features/learnerProgress/learnerProgress";
// import { useGetLearnerInfosQuery, useGetLearningJourneyPointerQuery } from "@/redux/features/learnerInfos/learnerInfosApi";
// import { useRouter } from "next/router";
// import lesson from "../lesson";
// import { useGetExamsQuery } from "@/redux/features/exam/examAPI";
// import { storeLearnerInfo } from "@/services/learnerInfo.service";
// import StreakTracker from "@/components/StreakTracker/StreakTracker";
// import { authKey } from "@/constants/storageKey";
// import { getFromLocalStorage } from "@/utils/local-storage";

// import Modal from "@/components/Modals/Modal";
// import WelcomeModel from "@/components/WelcomeModal/WelcomeModel";
// import Pointers from "@/components/LearningPath/Pointer/Pointers";
// const LearningPathPage = () => {
//   const router = useRouter();
//   const [showModal, setShowModal] = useState(true);
//   const { t, i18n } = useTranslation("common");
//   const query = {
//     populate: "*",
//     "sort[0]": "id:asc",
//   };
//   const lessonQuery = {
//     "sort[0]": "id:asc",
//     "populate[learning_journey_level][populate][learning_journey_unit][populate][0]":
//       "learning_journey",
//     populate: "*",
//   };
//   const { data: learnerInfoData, isLoading } = useGetLearnerInfosQuery({
//     ...query,
//   });
//   const { data: examInfo } = useGetExamsQuery({ ...query });
//   const { data: pointerData, isLoading: pointerLoading } = useGetLearningJourneyPointerQuery({...query})
//   const { data: unitData, isLoading: unitLoading } =
//     useGetLearningJourneyUnitsQuery({ ...query });
//   const { data: levelData, isLoading: levelLoading } =
//     useGetLearningJourneyLevelsQuery({ ...query });
//   const { data: lessonData, isLoading: lessonLoading } =
//     useGetLearningJourneyLessonsQuery({ ...lessonQuery });
//   const { data: learnerProgress } = useGetLearnerProgressQuery({ ...query });
//   const [unitsData, setUnitsData] = useState([]);
//   const [currentLessonInfos, setCurrentProgressInfos] = useState({});
//   const [isShowSteak, setIsShowSteak] = useState(true);
//   const [days, setDays] = useState([]);
//   console.log("exam info", examInfo);
//   console.log("units data", unitsData);
//   console.log("learner info data", learnerInfoData);
//   console.log("learnerProgress data", learnerProgress); 
//   console.log("lessonData data", lessonData);
//   console.log("lessonLoading data", lessonLoading);
//   const [loading, setLoading] = useState(true);
//   const [currentProgressInfo, setCurrentProgressInfo] = useState(0);
//   const allLessonInfo = [];
//   let firstLessonInfo = [];
//   console.log(lessonData, learnerProgress);
//   console.log(currentLessonInfos);
//   console.log(examInfo);
//   const progressId =
//     learnerProgress?.[learnerProgress.length - 1]?.progressId || 41;
//   useEffect(() => {
//     console.log(progressId);
//     const currentLesson = lessonData?.find(
//       (lesson) => lesson?.id == progressId
//     );
//     console.log(currentLesson);
//     setCurrentProgressInfo(
//       Number(
//         currentLesson?.attributes?.learning_journey_level?.data?.attributes
//           ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
//           ?.attributes?.sequence +
//           "" +
//           currentLesson?.attributes?.learning_journey_level?.data?.attributes
//             ?.learning_journey_unit?.data?.attributes?.unitSequence +
//           "" +
//           currentLesson?.attributes?.learning_journey_level?.data?.attributes
//             ?.taskSequence +
//           "" +
//           currentLesson?.attributes?.lessonSequence
//       )
//     );
//     console.log(
//       currentLesson?.attributes?.learning_journey_level?.data?.attributes
//         ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
//         ?.attributes
//     );
//     setCurrentProgressInfos({
//       levelSequence:
//         currentLesson?.attributes?.learning_journey_level?.data?.attributes
//           ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
//           ?.attributes?.sequence,
//       unitSequence:
//         currentLesson?.attributes?.learning_journey_level?.data?.attributes
//           ?.learning_journey_unit?.data?.attributes?.unitSequence,
//       taskSequence:
//         currentLesson?.attributes?.learning_journey_level?.data?.attributes
//           ?.taskSequence,
//       lessonSequence: currentLesson?.attributes?.lessonSequence,
//     });
//     lessonData?.map((lessonInfo) => {
//       const lol = Number(
//         lessonInfo?.attributes?.learning_journey_level?.data?.attributes
//           ?.learning_journey_unit?.data?.attributes?.learning_journey?.data
//           ?.attributes?.sequence +
//           "" +
//           lessonInfo?.attributes?.learning_journey_level?.data?.attributes
//             ?.learning_journey_unit?.data?.attributes?.unitSequence +
//           "" +
//           lessonInfo?.attributes?.learning_journey_level?.data?.attributes
//             ?.taskSequence +
//           "" +
//           lessonInfo?.attributes?.lessonSequence
//       );
//       allLessonInfo.push(lol);
//     });
//     firstLessonInfo = Math.min(...allLessonInfo);
//     console.log(" firstLessonInfo => ", firstLessonInfo, allLessonInfo);
//   }, [lessonData, learnerProgress]);

//   useEffect(() => {
//     const fetchData = async () => {
//       console.log(isLoading);
//       if ( !learnerInfoData || learnerInfoData?.length === 0 || learnerInfoData === undefined) {
//         router.push("/query");
//         console.log(learnerInfoData);
//       } else {
//         console.log(learnerInfoData);
//         let learner =
//           learnerInfoData &&
//           learnerInfoData.length > 0 &&
//           learnerInfoData[learnerInfoData.length - 1];
//         console.log(learner);
//         if (learner) {
//           let learnerInfo = {
//             language: learner?.language?.name,
//           };
//           console.log(learnerInfo);
//           storeLearnerInfo(JSON.stringify(learnerInfo));
//         }
//       }
//       const pointerArr = [];
//       console.log(pointerData)
//       for ( let p = 0; p < pointerData?.length; p++){
//         const pointer = pointerData[p]
//         console.log(pointer)
//         const unitsDataArr = [];
//         for (let i = 0; i < unitData?.length; i++) {
//           let backgroundImageIndex = i % 5;
//           const unit = unitData[i];
//           console.log(unit)
//           if (unit?.attributes?.learning_journey?.data?.id === pointer?.id) {
//           console.log(i, backgroundImageIndex); 
//           console.log("LEVEL DATA _++ > ", levelData);
  
//           const levels = [];
//           for (let j = 0; j < levelData?.length; j++) {
//             const level = levelData[j];
//             if (level?.attributes?.learning_journey_unit?.data?.id === unit?.id) {
//               console.log("Level Data --> ", level);
//               console.log("LESSON DATA => ", lessonData);
  
//               const lessons = [];
//               for (let k = 0; k < lessonData?.length; k++) {
//                 const lesson = lessonData[k];
//                 console.log(lesson)
//                 console.log(
//                   "aaaa",currentProgressInfo,
//                   Number(
//                     lesson.attributes?.learning_journey_level?.data?.attributes
//                       ?.learning_journey_unit?.data?.attributes?.learning_journey
//                       ?.data?.attributes?.sequence +
//                       "" +
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.learning_journey_unit?.data?.attributes?.unitSequence +
//                       "" +
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.taskSequence +
//                       "" +
//                       lesson.attributes?.lessonSequence
//                   ) 
//                 );
//                 if (
//                   lesson?.attributes?.learning_journey_level?.data?.id ===
//                   level?.id
//                 ) {
//                   console.log(
//                     lesson?.id,
//                     Number(
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.learning_journey_unit?.data?.attributes
//                         ?.learning_journey?.data?.attributes?.sequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.unitSequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.taskSequence +
//                         "" +
//                         lesson.attributes?.lessonSequence
//                     ),
//                     currentProgressInfo,
//                     Number(
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.learning_journey_unit?.data?.attributes
//                         ?.learning_journey?.data?.attributes?.sequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.unitSequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.taskSequence +
//                         "" +
//                         lesson.attributes?.lessonSequence
//                     ) <= currentProgressInfo
//                   );
//                   console.log(
//                     lesson?.id,
//                     Number(
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.learning_journey_unit?.data?.attributes
//                         ?.learning_journey?.data?.attributes?.sequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.unitSequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.taskSequence +
//                         "" +
//                         lesson.attributes?.lessonSequence
//                     ),
//                     currentProgressInfo
//                   );
//                   console.log(
//                     level?.id,
//                     lesson?.id,
//                     Number(
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.learning_journey_unit?.data?.attributes
//                         ?.learning_journey?.data?.attributes?.sequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.unitSequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.taskSequence +
//                         "" +
//                         lesson.attributes?.lessonSequence
//                     ) <= currentProgressInfo
//                   );
//                   console.log(
//                     level?.id,
//                     lesson?.id,
//                     Number(
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.learning_journey_unit?.data?.attributes
//                         ?.learning_journey?.data?.attributes?.sequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.unitSequence +
//                         "" +
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.taskSequence +
//                         "" +
//                         lesson.attributes?.lessonSequence
//                     )
//                   );
//                   lessons.push({
//                     id: lesson?.id,
//                     icon: "🌟",
//                     isCompleted:
//                       Number(
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.learning_journey?.data?.attributes?.sequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.learning_journey_unit?.data?.attributes
//                             ?.unitSequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.taskSequence +
//                           "" +
//                           lesson.attributes?.lessonSequence
//                       ) < currentProgressInfo,
//                     isCurrent:
//                       Number(
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.learning_journey?.data?.attributes?.sequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.learning_journey_unit?.data?.attributes
//                             ?.unitSequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.taskSequence +
//                           "" +
//                           lesson.attributes?.lessonSequence
//                       ) == currentProgressInfo,
//                     title: lesson?.attributes?.title,
//                     lessonSequence: lesson?.attributes?.lessonSequence,
//                     learning_journey_level:
//                       lesson?.attributes?.learning_journey_level,
//                     mysteryBox:
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.mysteryBox,
//                     currentLesson: progressId,
//                   });
//                 } else if (level?.mysteryBox === true) {
//                   lessons.push({
//                     id: lesson?.id,
//                     icon: "🌟",
//                     isCompleted:
//                       Number(
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.learning_journey?.data?.attributes?.sequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.learning_journey_unit?.data?.attributes
//                             ?.unitSequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.taskSequence +
//                           "" +
//                           lesson.attributes?.lessonSequence
//                       ) < currentProgressInfo,
//                     isCurrent:
//                       Number(
//                         lesson.attributes?.learning_journey_level?.data
//                           ?.attributes?.learning_journey_unit?.data?.attributes
//                           ?.learning_journey?.data?.attributes?.sequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.learning_journey_unit?.data?.attributes
//                             ?.unitSequence +
//                           "" +
//                           lesson.attributes?.learning_journey_level?.data
//                             ?.attributes?.taskSequence +
//                           "" +
//                           lesson.attributes?.lessonSequence
//                       ) == currentProgressInfo,
//                     title: lesson?.attributes?.title,
//                     lessonSequence: lesson?.attributes?.lessonSequence,
//                     learning_journey_level:
//                       lesson?.attributes?.learning_journey_level,
//                     mysteryBox:
//                       lesson.attributes?.learning_journey_level?.data?.attributes
//                         ?.mysteryBox,
//                     currentLesson: progressId,
//                   });
//                 }
//               }
//               console.log(
//                 "LESSONS OF A LEVEL == > ",
//                 lessons,
//                 lessons.length,
//                 lessons[0]?.title
//               );
  
//               const allLessonsCompleted =
//                 lessons.length > 0
//                   ? lessons.every((lesson) => lesson.isCompleted)
//                   : false;
//               console.log(level?.id, allLessonsCompleted);
//               const examLesson = {
//                 id: `exam-${level?.id}`,
//                 icon: "📝",
//                 isCompleted: allLessonsCompleted,
//                 title: `Quiz`,
//                 lessonSequence: lessons.length + 2,
//                 currentLesson: progressId,
//               };
//               console.log(level?.attributes?.taskSequence - 1);
//               let isExamComplete = false;
//               let previousLessonId = levels[levels.length - 1]?.id;
//               console.log(previousLessonId, level?.id);
//               if (examInfo && examInfo.length > 0) {
//                 console.log("exam info");
//                 console.log(examInfo);
//                 isExamComplete = examInfo.some(
//                   (exam) => exam?.learning_journey_level?.id == previousLessonId
//                 );
//                 console.log(isExamComplete);
//               }
//               if (examInfo && examInfo.length == 0 && !previousLessonId) {
//                 isExamComplete = true;
//               }
//               if (levels.length == 0) {
//                 isExamComplete = true;
//               }
//               console.log(level.id, isExamComplete);
//               levels.push({
//                 id: level?.id,
//                 isCompleted:
//                   Number(
//                     unit?.attributes?.learning_journey?.data?.attributes
//                       ?.sequence +
//                       "" +
//                       unit?.attributes?.unitSequence +
//                       "" +
//                       level?.attributes?.taskSequence
//                   ) <=
//                   Number(
//                     currentLessonInfos?.levelSequence +
//                       "" +
//                       currentLessonInfos?.unitSequence +
//                       "" +
//                       currentLessonInfos?.taskSequence
//                   ),
//                 isExamComplete: isExamComplete,
//                 level: level?.attributes?.title || "",
//                 taskSequence: level?.attributes?.taskSequence,
//                 levelDescription: "", 
//                 lessons: [...lessons, examLesson],
//                 mysteryBox: level?.attributes?.mysteryBox,
//                 currentLesson: progressId,
//               });
//             }
//           }
//           unitsDataArr.push({
//             unitTitle: unit.attributes.title,
//             unitSequence: unit.attributes.unitSequence,
//             backgroundImageUrl: `/image/bg-Update-0${
//               backgroundImageIndex + 1
//             }.jpg`, 
//             levels: levels,
//             backgroundImageNumber: backgroundImageIndex + 1,
//             currentLesson: progressId,
//           });
//         }
//         }
//         pointerArr.push({
//           pointerTitle: pointer?.attributes?.title,
//           pointerSequence: pointer?.attributes?.sequence,
//           units: unitsDataArr
//         })
//       }
//       setUnitsData(pointerArr.sort((a,b) => a.pointerSequence - b.pointerSequence)); 
//       console.log("POINTER DATA ==> ",pointerArr.sort((a,b) => a.pointerSequence - b.pointerSequence));
//       setLoading(false);
//     };
//     fetchData();
//   }, [
//     unitData,
//     levelData,
//     lessonData,
//     currentProgressInfo,
//     learnerInfoData,
//     router,
//     isLoading,
//     progressId,
//     examInfo,
//     currentLessonInfos?.levelSequence,
//     currentLessonInfos?.unitSequence,
//     currentLessonInfos?.taskSequence,
//   ]);
//   window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
//   const handleCloseModal = () => {
//     setShowModal(false);
//   };
//   return (
//     <div>
//       {loading || pointerLoading || unitLoading || levelLoading || lessonLoading ? (
//         <Loader />
//       ) : (
//         <>
//           {showModal && (
//             <div className="modal-overlay">
//             <div className="modal-content">
//               <button className="close-button" onClick={handleCloseModal}>
//                 &times;
//               </button>
//               <h1 className="p-2 font-bold text-4xl">Welcome to Nakhlah!</h1>
//               <p className="p-2 font-bold text-2xl">Enjoy your learning journey!</p>
//             </div>
//           </div>
//           )}
//           <Pointers pointers={unitsData} CurrentProgress={currentProgressInfo} />
//         </>
//       )}
//       <style jsx>{`
//        .modal-overlay {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background: rgba(0, 0, 0, 0.2.5);
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         z-index: 1000;
//       }
//       .modal-content {
//         backdrop-filter: blur(10px); /* Glass effect blur */
//         background: rgba(203, 143, 21, 0.2);  
//         padding: 30px;
//         border-radius: 12px;
//         text-align: center;
//         max-width: 600px;
//         width: 100%;
//         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
//       }
//       .close-button {
//         position: absolute;
//         top: 10px;
//         right: 10px;
//         background: none;
//         border: none;
//         font-size: 20px;
//         cursor: pointer;
//       }
//       .close-button:hover {
//         color: red;
//       }
//       `}</style>
//     </div>
//   );
// };
// export async function getStaticProps({ locale }) {
//   console.log(locale);

//   return {
//     props: {
//       ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
//     },
//   };
// }
// export default withAuth(LearningPathPage);
