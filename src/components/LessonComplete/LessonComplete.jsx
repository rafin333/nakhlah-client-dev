import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import Image from "next/image";
import lottie from "lottie-web";
import {
  useAddExamsMutation,
} from "@/redux/features/exam/examAPI";
import {
  useAddLearnerJourneyMutation,
} from "@/redux/features/learningJourney/learningJourneyApi";
import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { TRANSACTION_NAMES } from "@/constants/transactionNames";

const LessonComplete = ({
  percentage,
  correctAnsw,
  timeCount,
  lesson,
  isExamLesson,
  examLevelId,
  numberOfQuestions,
  noOfCorrectAns,
}) => {
  const { t: buttonT } = useTranslation(TRANSLATION_NAMESPACES.button);
  const { t: completeT } = useTranslation(TRANSLATION_NAMESPACES.complete);
  const [learnerJourney] = useAddLearnerJourneyMutation();
  const [addExam] = useAddExamsMutation();

  const router = useRouter();

  const accuracyContainer = useRef(null);
  const timeContainer = useRef(null);
  const xpContainer = useRef(null);
  const animStarted = useRef(false);

  const handleLearnerGamification = useHandleLearnerGamification();
  const { data: gamificationTxData } = useGetGamificationTxesQuery({});

  const CorrectPercent = Math.floor(percentage + 0.5);

  const [message, setMessage] = useState("");
  const [messageStyle, setMessageStyle] = useState({ color: "#4CAF50" });

  const lessonNoMistake = () =>
    giftUser(TRANSACTION_NAMES.Complete_A_Lesson_With_No_Mistakes);

  const exam80Percent = () =>
    giftUser(TRANSACTION_NAMES.Score_80_Points_Or_Higher_On_An_Exam);

  async function giftUser(txName) {
    try {
      await handleLearnerGamification(gamificationTxData, txName);
    } catch (error) {
      console.error("Error handling learner gamification:", error);
    }
  }

  useEffect(() => {
    // choose message + rewards
    if (percentage > 90 && percentage < 98) {
      setMessage(completeT("outstanding"));
      exam80Percent();
    } else if (percentage > 80 && percentage < 90) {
      setMessage(completeT("Great Job, Keep it up"));
      exam80Percent();
    } else if (percentage > 98) {
      setMessage(completeT("Extraordinary"));
      lessonNoMistake();
      exam80Percent();
    } else {
      setMessage(completeT("Good Effort, Keep Practising"));
      setMessageStyle({ color: "#FFA500" });
    }
  }, [percentage]);

  useEffect(() => {
    if (!animStarted.current) {
      animStarted.current = true;
      lottie.loadAnimation({
        container: xpContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/icons/All Icon/Result page/XP.json",
      });
      lottie.loadAnimation({
        container: timeContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/icons/All Icon/Result page/Time.json",
      });
      lottie.loadAnimation({
        container: accuracyContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/icons/All Icon/Result page/Accuracy.json",
      });
    }
  }, []);

  const handleContinueClick = async () => {
    if (isExamLesson) {
      try {
        await addExam({
          examDetails: "",
          learning_journey_level: { connect: [examLevelId] },
          numberOfQuestions,
          correctAnswer: noOfCorrectAns,
        });
      } catch (error) {
        console.error("Error saving exam:", error);
      }
    } else {
      try {
        await learnerJourney({
          learning_journey_lesson: { connect: [Number(lesson)] },
        }).unwrap();
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }

    router.push(`/learn`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <div style={{ fontSize: "24px", marginTop: "-50px", ...messageStyle }}>
        {message}
      </div>

      {percentage > 80 ? (
        <Image
          src="/animations/happy_girl.gif"
          alt="Happy Girl"
          width={350}
          height={350}
          style={{ margin: "0 auto", marginTop: "-145px", marginBottom: "-91px" }}
        />
      ) : (
        <Image
          src="/animations/sad_boy.gif"
          alt="Sad Boy"
          width={350}
          height={350}
          style={{ margin: "0 auto", marginTop: "-145px", marginBottom: "-91px" }}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
          <div className="w-full p-2 sm:w-1/3">
            <Card style={{ borderRadius: "10px", backgroundColor: "#cb8f15", color: "white" }}>
              <CardBody style={{ textAlign: "center" }}>
                <div ref={xpContainer}></div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {CorrectPercent >= 100
                    ? "30"
                    : CorrectPercent >= 80
                    ? "25"
                    : CorrectPercent >= 50
                    ? "20"
                    : "15"}{" "}
                  XP
                </Typography>
              </CardBody>
            </Card>
          </div>

          <div className="w-full  p-2 sm:w-1/3">
            <Card style={{ borderRadius: "10px", backgroundColor: "#cb8f15", color: "white" }}>
              <CardBody style={{ textAlign: "center" }}>
                <div ref={accuracyContainer}></div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {CorrectPercent}% Accuracy
                </Typography>
              </CardBody>
            </Card>
          </div>

          <div className="w-full  p-2 sm:w-1/3">
            <Card style={{ borderRadius: "10px", backgroundColor: "#cb8f15", color: "white" }}>
              <CardBody style={{ textAlign: "center" }}>
                <div ref={timeContainer}></div>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                  {timeCount} Min
                </Typography>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <button className="popbuttonPrimary" onClick={handleContinueClick}>
        {buttonT("continue")}
      </button>
    </div>
  );
};

export default LessonComplete;





//  ---------------version 0.0.4-------------------

// /* eslint-disable @next/next/no-img-element */
// import React, { useEffect, useRef } from "react";
// import { MDBBtn } from "mdb-react-ui-kit";
// import styles from "./LessonComplete.module.css"; // Import the CSS module
// import { useRouter } from "next/router";
// import { useTranslation } from "next-i18next";
// import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Typography,
// } from "@material-tailwind/react";
// import { FaClock, FaIcons, FaStar, FaTrophy } from "react-icons/fa";
// import Image from "next/image";
// import {
//   useGetLearnerProgressQuery,
//   useUpdateLearnerProgressMutation,
// } from "@/redux/features/learnerProgress/learnerProgress";
// import { useAddExamsMutation } from "@/redux/features/exam/examAPI";
// import { useAddLearnerJourneyMutation } from "@/redux/features/learningJourney/learningJourneyApi";

// import lottie from "lottie-web";
// import useHandleLearnerGamification from "@/utils/learnerGamifications";
// import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
// import { TRANSACTION_NAMES } from "@/constants/transactionNames";

// const LessonComplete = ({
//   percentage,
//   correctAnsw,
//   timeCount,
//   lesson,
//   isExamLesson,
//   examLevelId,
//   numberOfQuestions,
//   noOfCorrectAns,
// }) => {
//   const { t: buttonT } = useTranslation(TRANSLATION_NAMESPACES.button);
//   const { t: completeT } = useTranslation(TRANSLATION_NAMESPACES.complete);
//   const [learnerJourney] = useAddLearnerJourneyMutation();
//   const [addExam] = useAddExamsMutation();

//   const lessonNoMistake = () =>
//     giftUser(TRANSACTION_NAMES.Complete_A_Lesson_With_No_Mistakes);

//   const exam80Percent = () =>
//     giftUser(TRANSACTION_NAMES.Score_80_Points_Or_Higher_On_An_Exam);

//   async function giftUser(txName) {
//     try {
//       const res = await handleLearnerGamification(gamificationTxData, txName);

//       // alert(JSON.stringify(res));
//     } catch (error) {
//       console.error("Error handling learner gamification:", error);
//     }
//   }

//   async function giftUser(txName) {
//     console.log("TX Name: ", txName);
//     try {
//       const res = await handleLearnerGamification(gamificationTxData, txName);

//       // alert(JSON.stringify(res));
//     } catch (error) {
//       console.error("Error handling learner gamification:", error);
//     }
//   }

//   let counterAnimation = 0;

//   const accuracyContainer = useRef(null);
//   const timeContainer = useRef(null);
//   const xpContainer = useRef(null);
//   const handleLearnerGamification = useHandleLearnerGamification();
//   const { data: gamificationTxData } = useGetGamificationTxesQuery({});


//   useEffect(() => {
//     if (counterAnimation === 0) {
//       animationJSON();
//     }
//   }, []);

//   function animationJSON() {
//     counterAnimation = 1;
//     lottie.loadAnimation({
//       container: xpContainer.current,
//       renderer: "svg",
//       loop: true,
//       autoplay: true,
//       path: "/icons/All Icon/Result page/XP.json",
//     });
//     lottie.loadAnimation({
//       container: timeContainer.current,
//       renderer: "svg",
//       loop: true,
//       autoplay: true,
//       path: "/icons/All Icon/Result page/Time.json",
//     });

//     lottie.loadAnimation({
//       container: accuracyContainer.current,
//       renderer: "svg",
//       loop: true,
//       autoplay: true,
//       path: "/icons/All Icon/Result page/Accuracy.json",
//     });
//   }

//   // const { data: learnerProgressInfo } = useGetLearnerProgressQuery({});
//   console.log(lesson);
//   console.log(
//     "percentage, correctAnsw, timeCount",
//     percentage,
//     correctAnsw,
//     timeCount
//   );
//   const router = useRouter();
//   let message;
//   let messageStyle = { color: "#4CAF50" }; // Default style

//   const CorrectPercent = Math.floor(percentage + 0.5);

//   useEffect(() => {
//     if (percentage > 90 && percentage < 98) {
//       message = completeT("outstanding");
//       exam80Percent();
//     } else if (percentage > 80 && percentage < 90) {
//       message = completeT("Great Job, Keep it up");
//       exam80Percent();
//     } else if (percentage > 98) {
//       message = completeT("Extraordinary");
//       lessonNoMistake();
//       exam80Percent();
//     } else {
//       message = completeT("Good Effort, Keep Practising");
//       messageStyle = { color: "#FFA500" }; // Change color for encouragement
//     }
    
//   }, [percentage])  
  


//   const handleContinueClick = () => {
//     fetch();

//     router.push(`/learn?complete=${lesson}`).then(() => {
//       window.location.reload();
//     });
//   };

//   // useEffect(() => {
//   const fetch = async () => {
//     console.log("Called");
//     if (isExamLesson) {
//       try {
//         const examPayload = {
//           examDetails: "",
//           learning_journey_level: {
//             connect: [examLevelId],
//           },
//           numberOfQuestions: numberOfQuestions,
//           correctAnswer: noOfCorrectAns,
//         };
//         const response = await addExam({ ...examPayload });
//         console.log(response);
//       } catch (error) {
//         console.error("Error in learner progress:", error);
//       }
//     } else {
//       console.log("called");
//       try {
//         // const learnerProgressId = learnerProgressInfo[0]?.id;
//         // const leanerProgressData = {
//         //   id: learnerProgressId,
//         //   progressId: Number(lesson),
//         // };
//         // console.log(leanerProgressData);
//         const response = await learnerJourney({
//           learning_journey_lesson: {
//             connect: [Number(lesson)],
//           },
//         }).unwrap();
//         console.log(response);
//       } catch (error) {
//         console.error("Error in learner progress:", error);
//       }
//     }
//   };
//   //   fetch();
//   // }, [lesson]);

//   return (
//     <div style={{ textAlign: "center", marginTop: "50px" }}>
//       {/* <div style={{ fontSize: "48px", ...messageStyle, marginBottom: "20px" }}>
//         {percentage > 80
//           ? `${completeT("congratulations")}`
//           : `${completeT("keepgoing")}`}
//       </div> */}
//       <div style={{ fontSize: "24px", marginTop: "-50px" }}>{message}</div>
//       {percentage > 80 && (
//         <Image
//           src="/animations/happy_girl.gif"
//           alt="Happy Girl"
//           width={350}
//           height={350}
//           style={{
//             margin: "0 auto",
//             marginTop: "-145px",
//             marginBottom: "-91px",
//           }}
//         />
//       )}
//       {percentage < 80 && (
//         <Image
//           src="/animations/sad_boy.gif"
//           alt="Sad Boy"
//           width={350}
//           height={350}
//           style={{
//             margin: "0 auto",
//             marginTop: "-145px",
//             marginBottom: "-91px",
//           }}
//         />
//       )}

//       <div ref={accuracyContainer}></div>

//       <div style={{ display: "flex", flexDirection: "column" }}>
//         <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
//           <div className="w-full p-2 sm:w-1/3">
//             <Card
//               style={{
//                 borderRadius: "10px",
//                 backgroundColor: "#cb8f15",
//                 color: "white",
//               }}
//             >
//               <CardBody style={{ textAlign: "center" }}>
//                 {/* <img style={{height: "150px", paddingLeft:'15px'}} src="https://images.vexels.com/media/users/3/134132/isolated/preview/c4eee38f812795aaf55a555a98c305e9-star-cartoon-12.png" /> */}
//                 <div ref={xpContainer}></div>

//                 <Typography variant="h5" color="blue-gray" className="mb-2">
//                   {CorrectPercent >= 100
//                     ? "30"
//                     : CorrectPercent >= 80
//                     ? "25"
//                     : CorrectPercent >= 50
//                     ? "20"
//                     : "15"}
//                   XP
//                 </Typography>
//               </CardBody>
//             </Card>
//           </div>
//           <div className="w-full  p-2 sm:w-1/3 justify-center">
//             <Card
//               style={{
//                 borderRadius: "10px",
//                 backgroundColor: "#cb8f15",
//                 color: "white",
//               }}
//             >
//               <CardBody>
//                 {/* <img  style={{height: "150px", paddingLeft:'15px'}}  src="https://img.freepik.com/premium-vector/trophy-cup-icon-comic-style-goblet-prize-cartoon-vector-illustration-isolated-background-award-splash-effect-sign-business-concept_157943-7902.jpg?w=740" /> */}
//                 <div ref={accuracyContainer}></div>

//                 <Typography variant="h5" color="blue-gray" className="mb-2">
//                   {CorrectPercent} % Accurecy
//                 </Typography>
//               </CardBody>
//             </Card>
//           </div>
//           <div className="w-full  p-2 sm:w-1/3 justify-end">
//             <Card
//               style={{
//                 borderRadius: "10px",
//                 backgroundColor: "#cb8f15",
//                 color: "white",
//               }}
//             >
//               <CardBody>
//                 <div ref={timeContainer}></div>

//                 <Typography variant="h5" color="blue-gray" className="mb-2">
//                   {timeCount} Min
//                 </Typography>
//                 {/* <Typography variant="p"> 
//                   Total Time
//                 </Typography> */}
//               </CardBody>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <button className="popbuttonPrimary" onClick={handleContinueClick}>
//         {buttonT("continue")}
//       </button>
//     </div>
//   );
// };

// export default LessonComplete;
