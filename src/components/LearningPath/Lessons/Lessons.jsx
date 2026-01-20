import ToastMessage from "@/components/Toast";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { storeCurrentLesson } from "@/services/lesson.service";
import { LockIcon } from "lucide-react";
import { useGetLearnerGamificationStockQuery } from "@/redux/features/gamification/gamificationAPI";
import Modal from "@/components/Modals/Modal";
import PalmStockModal from "@/components/PalmStockModal/PalmStockModal";
import lottie from "lottie-web";
import Image from "next/image";
const Lessons = ({
  level,
  unitTitle,
  icon,
  text,
  title,
  isCurrent,
  isCompleted,
  id,
  lessonSequence,
  lesson,
  lessonIndex,
  isExamComplete,
  allLessonData,
  mysteryBox,
}) => {
  const query = {
    populate: "*",
    "filters[gamification_type][typeName][$eq]": "Palm",
  };
  const { data: LGameInfo } = useGetLearnerGamificationStockQuery({ ...query });
  const [showModal, setShowModal] = useState(false);
  const notify = useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);
  const router = useRouter();

  let taskStyle = "bg-gray-200 text-gray-400 font-[600]";
  let taskText = "text-gray-500";

  if (isCompleted) {
    taskStyle = "bg-[#f7c570] text-black font-[600]";
    taskText = "text-black-400";
  }
  if (isCurrent) {
    taskStyle = "bg-white text-orange-400 ring-4 ring-[#f7c570] font-[600]";
  }

  const handleContinueClick = () => {
    if (mysteryBox) {
      fetch();
    }

    router.push(`/learn?complete=${lesson}`).then(() => {
      window.location.reload();
    });
  };
  // useref////////////////////////////////////
  // let counterAnimation = 0;
  // const lessonLock = useRef([]);
  // const lessonUnlocked = useRef([]);
  // const lessonComplete = useRef([]);
  // const quizLocked = useRef([]);
  // const quizUnLocked = useRef([]);
  // const quizComplete = useRef([]);
  // useEffect(() => {
  //   if (counterAnimation === 0) {
  //     animationJSON();
  //   }
  // }, []);
  // function animationJSON() {
  //   counterAnimation = 1;
  //   lottie.loadAnimation({
  //     container: lessonLock.current,
  //     renderer: "svg",
  //     loop: true,
  //     autoplay: true,
  //     path: "/icons/All Icon/Lesson List of a Task/Lesson locked.json",
  //   });
  //   lottie.loadAnimation({
  //     container: lessonUnlocked.current,
  //     renderer: "svg",
  //     loop: true,
  //     autoplay: true,
  //     path: "/icons/All Icon/Lesson List of a Task/Lesson Unlocked.json",
  //   });

  //   lottie.loadAnimation({
  //     container: lessonComplete.current,
  //     renderer: "svg",
  //     loop: true,
  //     autoplay: true,
  //     path: "/icons/All Icon/Lesson List of a Task/Lesson Complete.json",
  //   });
  //   lottie.loadAnimation({
  //     container: quizLocked.current,
  //     renderer: "svg",
  //     loop: true,
  //     autoplay: true,
  //     path: "/icons/All Icon/Lesson List of a Task/Quiz Locked.json",
  //   });
  //   lottie.loadAnimation({
  //     container: quizUnLocked.current,
  //     renderer: "svg",
  //     loop: true,
  //     autoplay: true,
  //     path: "/icons/All Icon/Lesson List of a Task/Quiz Unlocked.json",
  //   });
  //   lottie.loadAnimation({
  //     container: quizComplete.current,
  //     renderer: "svg",
  //     loop: true,
  //     autoplay: true,
  //     path: "/icons/All Icon/Lesson List of a Task/Quiz Completed.json",
  //   });
  // }

  //useref/////////////////////////////////////////
  // useEffect(() => {
  const fetch = async () => {
    console.log("Called");
    if (isExamLesson) {
      try {
        const examPayload = {
          examDetails: "",
          learning_journey_level: {
            connect: [examLevelId],
          },
          numberOfQuestions: numberOfQuestions,
          correctAnswer: noOfCorrectAns,
        };
        const response = await addExam({ ...examPayload });
        console.log(response);
      } catch (error) {
        console.error("Error in learner progress:", error);
      }
    } else {
      console.log("called");
      try {
        // const learnerProgressId = learnerProgressInfo[0]?.id;
        // const leanerProgressData = {
        //   id: learnerProgressId,
        //   progressId: Number(lesson),
        // };
        // console.log(leanerProgressData);
        const response = await learnerJourney({
          learning_journey_lesson: {
            connect: [Number(lesson)],
          },
        }).unwrap();
        console.log(response);
      } catch (error) {
        console.error("Error in learner progress:", error);
      }
    }
  };

  const handleClick = () => {
    let palmStock = LGameInfo && LGameInfo[0]?.stock;
    if (palmStock < 1) {
      setShowModal(true);
      return;
    } 

    if (isCompleted || isCurrent) {
      storeCurrentLesson({ lesson: id });
      router.push("/lesson");
    } else {
      notify("error", "Please solve previous lessons first");
    }
  };

  return (
    <>
      <div className="flex justify-center">
        {/* {" is Complete " + isCompleted}
        {" is current " + isCurrent}
        {" level : " + level} */}
        {/* {" mysteryBox : " + mysteryBox} */}
        {/* {"LEVEL -> "+JSON.stringify(allLessonData)} */}

        <div
          className={`rounded-full p-3 mx-auto mb-4 transform transition-transform `}
          style={{
            cursor: "pointer",
          }}
          onClick={handleClick}
        > 
        {/* {JSON.stringify(id)} */}
          <div className={`rounded-full p-2 `}>
            {!isCompleted && !isCurrent ? (
              // <LockIcon />
              // <div ref={lessonLock}></div>
              <Image src={"/icons/All Icon/Lesson List of a Task/Lesson Unlocked.svg"} alt="locked lesson / quiz" height={200} width={200} style={{maxWidth:"80px"}}   />

            ) : (
              <>
                {title.split(" ").pop() === "Quiz" ? (
                  // <div ref={quizUnLocked}></div>
                  <Image src={"/icons/All Icon/Quiz1.svg"} alt="quiz" height={200} width={200} style={{maxWidth:"80px"}}   />
                ) : (
                  // <div ref={lessonComplete}></div>
                  <Image src={"/icons/All Icon/Lesson.svg"} alt="quiz" height={200} width={200} style={{maxWidth:"80px"}} />

                )}
                {/* <div>{title.split(" ").pop()}</div> */}
              </>
            )}
          </div>
          <span className={`font-medium ${taskText}`}>{text}</span>
        </div>

        {/* <div ref={lessonLock}></div>
          <div ref={lessonUnlocked}></div>
          <div ref={lessonComplete}></div>
          <div ref={quizLocked}></div>
          <div ref={quizUnLocked}></div>
          <div ref={quizComplete}></div> */}
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <PalmStockModal setShowModal={setShowModal} />
        </Modal>
      )}
    </>
  );
};

export default Lessons;