import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { addTooltipsToTitle } from "@/utils/tooltipUtils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaRepeat } from "react-icons/fa6";
import { useSelector } from "react-redux";

const TrueFalseQuestion = ({
  questionTitle,
  setIsSelected,
  setIsCorrectAns,
  isClickedCheck,
  setNoOfCorrectAns,
  setCorrectAns,
  setIncorrectQuestions,
  setQuestions,
  question,
  isRepeatedQuestion,
  questionDetails,
  gamificationTxData,
  isExamLesson,
}) => {
  // console.log(question?.attributes?.question_content?.data?.attributes?.content?.data?.attributes?.title);
  console.log(isClickedCheck);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const hasFetched = useRef(false);
  const handleLearnerGamification = useHandleLearnerGamification();
  const [updatedTitle, setUpdatedTitle] = useState("");




  const { planData } = useSelector((state) => state.subscriptionStore);
  const hasSubscription =
    planData && planData?.subscription_plan?.planName != "Free";

  async function palmLossAPI() {
    console.log(planData?.subscription_plan?.planName);
    if (!hasSubscription) {
      try {
        await handleLearnerGamification(
          gamificationTxData,
          TRANSACTION_NAMES.PALM_LOSS_BY_WRONG_ANSWER
        );
      } catch (error) {
        console.error("Error handling learner gamification:", error);
      }
    }
  }




  const handleSubmit = (answer) => {
    if (isClickedCheck) {
      return; // Do nothing if check has been clicked
    }
    console.log(answer);
    console.log(questionDetails?.content?.attributes?.title);
    setIsSelected(true);
    setSelectedAnswer(answer);
    hasFetched.current = false;
  };
  useEffect(() => {
    const fetch = async () => {
      if (selectedAnswer && isClickedCheck && !hasFetched.current) {
        hasFetched.current = true;
        if (selectedAnswer == questionDetails?.content?.attributes?.title) {
          setIsCorrectAns(true);
          setNoOfCorrectAns((pre) => pre + 1);
        } else {
          setIsCorrectAns(false);
          setCorrectAns(questionDetails?.content?.attributes?.title);
          if (!isExamLesson) {
            palmLossAPI();
            setIncorrectQuestions((prev) => [...prev, question]);
            setQuestions((prev) => [...prev, question]);
          }
        }
      }
    };
    fetch();
  }, [
    isClickedCheck,
    question,
    questionDetails?.content?.attributes?.title,
    selectedAnswer,
    setCorrectAns,
    setIncorrectQuestions,
    setIsCorrectAns,
    setNoOfCorrectAns,
    setQuestions,
  ]);
  useEffect(() => {
    if (questionDetails?.toolTip) {
      let titleWithToolTip = addTooltipsToTitle(
        questionDetails?.title,
        questionDetails?.toolTip
      );
      setUpdatedTitle(titleWithToolTip);
    } else {
      setUpdatedTitle(questionDetails?.title);
    }
    setSelectedAnswer("");
  }, [questionDetails?.title, questionDetails?.toolTip]);
  // Assign color classes based on your application's color scheme
  const buttonBaseClass =
    "px-10 py-4 text-xl font-bold rounded-lg border-4 border-lavender-300";
  const trueButtonClass =
    selectedAnswer === "True" ? "bg-lavender-600 text-white" : "";
  const falseButtonClass =
    selectedAnswer === "False" ? "bg-lavender-600 text-white" : "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className=" mb-4">
        {isRepeatedQuestion && (
          <div className=" flex text-sm items-center font-bold text-gray-700 mb-4">
            <Image
              alt="previousQuestion"
              height={1}
              width={38}
              src={"/icons/All Icon/Lesson page/Previous mistake question.svg"}
            />&nbsp; Previous mistake questions
          </div>
        )}
      </div>
      <div className="flex justify-center items-center mb-4">
        <div className=" text-lg font-semibold text-gray-700 mb-4">
          <div dangerouslySetInnerHTML={{ __html: updatedTitle }} />
        </div>
      </div>
      {/* <div className="text-xl font-semibold mb-6">{question}</div> */}
      <div className="flex justify-center gap-10">
        <button
          className={`${buttonBaseClass} ${trueButtonClass}`}
          onClick={() => handleSubmit("True")}
        >
          True
        </button>
        <button
          className={`${buttonBaseClass} ${falseButtonClass}`}
          onClick={() => handleSubmit("False")}
        >
          False
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;
