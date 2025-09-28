import React, { useState } from "react";
import Lessons from "../Lessons/Lessons";
import { useRouter } from "next/router";
import { useAddLearnerJourneyMutation } from "@/redux/features/learningJourney/learningJourneyApi";
import { useAddExamsMutation } from "@/redux/features/exam/examAPI";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const Level = ({ unitTitle, level, lessons, mysteryBox }) => {
  const router = useRouter();
  const [learnerJourney] = useAddLearnerJourneyMutation();
  const [addExam] = useAddExamsMutation();
  const { palmData } = useSelector((state) => state.gamificationStore);
  const num_palm = palmData?.stock;

  const LessonSort = lessons.sort((a, b) => a.lessonSequence - b.lessonSequence);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleContinueClick = async () => {
    if (!mysteryBox) return;

    try {
      await learnerJourney({ learning_journey_lesson: { connect: [Number(LessonSort[0].id)] } }).unwrap();
      await addExam({
        examDetails: "",
        learning_journey_level: { connect: [LessonSort[0].learning_journey_level.data.id] },
        numberOfQuestions: 5,
        correctAnswer: 5,
      });

      // Trigger reward animation
      setRewardClaimed(true);

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Navigate smoothly after animation
      setTimeout(() => {
        router.replace(`/learn?complete=${LessonSort[0].learning_journey_level.data.id}`, undefined, { shallow: true });
        
      }, 1500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mb-8 p-4 rounded-lg">
      <div className="flex justify-between items-center bg-lavender-600 text-white rounded-lg p-2 mb-4">
        <h2 className="font-bold">Lessons of {level}</h2>
      </div>

      <AnimatePresence>
        {!rewardClaimed ? (
          <motion.div
            key="lessons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-row justify-center gap-4"
          >
            {LessonSort[0].mysteryBox === false ? (
              num_palm > 0 ? (
                LessonSort.map((lesson, index) => (
                  <Lessons
                    key={index}
                    unitTitle={unitTitle}
                    lessonIndex={index}
                    level={level}
                    {...lesson}
                    allLessonData={LessonSort}
                    mysteryBox={mysteryBox}
                  />
                ))
              ) : (
                <b>{"You don't have enough palm. Please refill your palm."}</b>
              )
            ) : (
              <div className="flex flex-col items-center gap-2">
                <button
                  style={{
                    backgroundColor: "orange",
                    color: "white",
                    borderRadius: "10px",
                    padding: "12px 24px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={handleContinueClick}
                >
                  Claim Reward
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reward"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-green-600 font-bold text-xl"
          >
            Reward Claimed!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Level;




//  ---------------version 0.0.4-------------------

// import React from "react";
// import Lessons from "../Lessons/Lessons";
// import { useRouter } from "next/router";
// import { useAddLearnerJourneyMutation } from "@/redux/features/learningJourney/learningJourneyApi";
// import { useAddExamsMutation } from "@/redux/features/exam/examAPI";
// import { useSelector } from "react-redux";

// const Level = ({ unitTitle, level, title, lessons, mysteryBox }) => {
//   const router = useRouter();
//   const [learnerJourney] = useAddLearnerJourneyMutation();
//   const [addExam] = useAddExamsMutation();

//   const { palmData } = useSelector((state) => state.gamificationStore);
//   const num_palm = palmData?.stock
//   // console.log(num_palm)
//   const LessonSort = lessons.sort(
//     (a, b) => a.lessonSequence - b.lessonSequence
//   );
//   console.log("Lesson ID: ",LessonSort.map(x => x.id));
//   // console.log("Data of LEVEL ===> ", level, title, LessonSort);

//   const handleContinueClick = () => {
//     if (mysteryBox) {
//       fetch();
//     }

//     // router.push(`/learn?complete=${LessonSort[0].id}`).then(() => {
//     //   window.location.reload();
//     // });
//   };

//   const fetch = async () => {
//     console.log("Called");
//     try {
//       const response = await learnerJourney({
//         learning_journey_lesson: {
//           connect: [Number(LessonSort[0].id)],
//         },
//       }).unwrap();
//       console.log("Mystry Lesson: ", response);
//     } catch (error) {
//       console.error("Error in learner progress:", error);
//     }

//     // if (isExamLesson) {
//     try {
//       const examPayload = {
//         examDetails: "",
//         learning_journey_level: {
//           connect: [LessonSort[0].learning_journey_level.data.id],
//         },
//         numberOfQuestions: 5,
//         correctAnswer: 5,
//       };
//       const response = await addExam({ ...examPayload });
//       console.log("Mystry Exam: ", response);
//       // alert("Mystry Exam: ");

//       router
//         .push(`/learn?complete=${LessonSort[0].learning_journey_level.data.id}`)
//         .then(() => {
//           window.location.reload();
//         });
//     } catch (error) {
//       console.error("Error in learner progress:", error);
//     }
//     // }
//   };

//   return (
//     <div className="mb-8 p-4  rounded-lg z-9999 ">
//       <div className="flex justify-between items-center bg-lavender-600 text-white rounded-lg p-2 mb-4">
//         <h2 className="font-bold">Lessons of {level}</h2>
//         {/* <button className="flex items-center bg-green-700 hover:bg-green-800 text-white font-bold py-1 px-3 rounded-lg">
//             <span className="material-icons mr-2">book</span> GUIDEBOOK
//           </button> */}
//         {/* <small className="mb-4">{description}</small> */}
//       </div>
//       <div className="flex flex-row  justify-center gap-4 ">
        

//         {LessonSort[0].mysteryBox == false ? (

//           (num_palm > 0 ) ? 
//           LessonSort?.map((lesson, index) => (
//             <Lessons
//               key={index}
//               unitTitle={unitTitle}
//               lessonIndex={index}
//               level={level}
//               {...lesson}
//               allLessonData={LessonSort}
//               mysteryBox={mysteryBox}
//             />
//           ))
//           :
//           <b>
//             {"You don't have enough palm. Please refill your palm."}
//           </b>

//         ) : (
//           <>
//             <>
//               <button
//                 style={{
//                   backgroundColor: "orange",
//                   color: "white",
//                   borderRadius: "10px",
//                   padding: "12px 24px",
//                   border: "none", // Removed border
//                   cursor: "pointer", // Added cursor pointer
//                 }}
//                 onClick={handleContinueClick}
//               >
//                 Claim Reward
//               </button>
//             </>
//           </>
//         )}


//       </div>
//     </div>
//   );
// };

// export default Level;




// ---------------version 0.0.3-------------------

// import React, { useState, useEffect } from "react";
// import Lessons from "../Lessons/Lessons";
// import { useRouter } from "next/router";
// import { useAddLearnerJourneyMutation } from "@/redux/features/learningJourney/learningJourneyApi";
// import { useAddExamsMutation } from "@/redux/features/exam/examAPI";
// import { useSelector } from "react-redux";

// const Level = ({ unitTitle, level, title, lessons, mysteryBox }) => {
//   const router = useRouter();
//   const [learnerJourney] = useAddLearnerJourneyMutation();
//   const [addExam] = useAddExamsMutation();

//   const { palmData, username } = useSelector((state) => state.gamificationStore);
//   const num_palm = palmData?.stock;

//   const [isPopupVisible, setIsPopupVisible] = useState(false);

//   useEffect(() => {
//     // Show popup only when entering the home screen
//     if (router.pathname === "/learn" || router.pathname === "/") {
//       setIsPopupVisible(true);
//     }
//   }, [router.pathname]);

//   const handleContinueClick = () => {
//     if (mysteryBox) {
//       fetch();
//     }
//   };

//   const fetch = async () => {
//     console.log("Called");
//     try {
//       const response = await learnerJourney({
//         learning_journey_lesson: {
//           connect: [Number(LessonSort[0].id)],
//         },
//       }).unwrap();
//       console.log("Mystry Lesson: ", response);
//     } catch (error) {
//       console.error("Error in learner progress:", error);
//     }

//     try {
//       const examPayload = {
//         examDetails: "",
//         learning_journey_level: {
//           connect: [LessonSort[0].learning_journey_level.data.id],
//         },
//         numberOfQuestions: 5,
//         correctAnswer: 5,
//       };
//       const response = await addExam({ ...examPayload });
//       console.log("Mystry Exam: ", response);

//       router
//         .push(`/learn?complete=${LessonSort[0].learning_journey_level.data.id}`)
//         .then(() => {
//           window.location.reload();
//         });
//     } catch (error) {
//       console.error("Error in learner progress:", error);
//     }
//   };

//   const LessonSort = lessons.sort((a, b) => a.lessonSequence - b.lessonSequence);

//   return (
//     <div className="mb-8 p-4 rounded-lg z-9999">
//       {/* Popup */}
//       {isPopupVisible && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center">
//             <h2 className="text-2xl font-bold mb-4">Welcome to Nakhlah</h2>
//             <p className="text-lg mb-6">{`Hello, ${username}!`}</p>
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//               onClick={() => setIsPopupVisible(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center bg-lavender-600 text-white rounded-lg p-2 mb-4">
//         <h2 className="font-bold">Lessons of {level}</h2>
//       </div>
//       <div className="flex flex-row justify-center gap-4">
//         {LessonSort[0].mysteryBox == false ? (
//           num_palm > 0 ? (
//             LessonSort?.map((lesson, index) => (
//               <Lessons
//                 key={index}
//                 unitTitle={unitTitle}
//                 lessonIndex={index}
//                 level={level}
//                 {...lesson}
//                 allLessonData={LessonSort}
//                 mysteryBox={mysteryBox}
//               />
//             ))
//           ) : (
//             <b>{"You don't have enough palm. Please refill your palm."}</b>
//           )
//         ) : (
//           <button
//             style={{
//               backgroundColor: "orange",
//               color: "white",
//               borderRadius: "10px",
//               padding: "12px 24px",
//               border: "none",
//               cursor: "pointer",
//             }}
//             onClick={handleContinueClick}
//           >
//             Claim Reward
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Level;