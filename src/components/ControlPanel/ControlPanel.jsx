import { QUESTION_TYPES } from "@/constants/questionTypes";
import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import { useTranslation } from "next-i18next";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Image from "next/image";
const ControlPanel = ({
  step,
  totalSteps,
  isCorrectAns,
  isClickedCheck,
  isSelected,
  correctAns,
  handleSkipStep,
  handleCheck,
  handleContinue,
  question,
}) => {
  const questionType =
    question?.attributes?.question_content?.data?.attributes?.question_type
      ?.data?.attributes?.title;
  console.log(questionType, isClickedCheck, isSelected);
  const { t: buttonT } = useTranslation(TRANSLATION_NAMESPACES.button);
  const { t: completeT } = useTranslation(TRANSLATION_NAMESPACES.complete);
  return (
    <div
      className={`fixed bottom-0 left-0 w-full ${isClickedCheck ? `bg-${isCorrectAns ? "green" : "red"}-100` : "bg-white"
        } border-t border-gray-300 p-8 flex justify-center items-center gap-10`}
    >
      {!isClickedCheck && (
        <button
          onClick={handleSkipStep}
          className="bg-orange-500 text-white rounded-lg px-14 py-2 lg:mr-80 hover:bg-orange-600" // Increased padding and added hover effect
        >
          {buttonT("skip")}
        </button>
      )}

      {!isClickedCheck && (
        <button
          onClick={handleCheck}
          disabled={!isSelected}
          className={`bg-${!isSelected && questionType != QUESTION_TYPES.LEARN
            ? "gray-400"
            : "orange-500"
            } text-white rounded-lg px-14 py-2  opacity-${!isSelected && questionType != QUESTION_TYPES.LEARN ? "70" : "100"
            } cursor-${!isSelected && questionType != QUESTION_TYPES.LEARN
              ? "not-allowed"
              : "pointer"
            } hover:bg-${!isSelected && questionType != QUESTION_TYPES.LEARN
              ? "gray-500"
              : "orange-600"
            }`}
        >
          {/* {step === questions.length ? "Finish" : "Check"} */}
          {buttonT("check")}
        </button>
      )}
      {isClickedCheck && (
        <>
          <div
            className={`text-2xl text-${isCorrectAns ? "green" : "red"
              }-500 rounded-lg px-14 py-4 lg:mr-80 flex items-center`} // Increased padding and added hover effect
          >
            {questionType != QUESTION_TYPES.LEARN && isCorrectAns && (
              <>
                {/* <FaCheckCircle
                className="inline mr-2 text-green-500"
                style={{ fontSize: "4rem" }}
              /> */}
                <span className="inline mr-2" style={{ fontSize: "4rem" }}>
                  <div className="top-0 left-0 w-[100px] h-[7rem] ">
                    <Image
                      src="/icons/All Icon/Lesson page/Correct answer.svg"
                      alt="logo"
                      //  layout="fill"
                      objectFit="contain"
                      style={{ width: "100% !important" }}
                      width={100}
                      height={100}
                    />
                  </div>
                </span>
                <span>{completeT("nice")}!</span>
              </>
            )}
            {questionType != QUESTION_TYPES.LEARN && !isCorrectAns && (
              <>

                <span className="inline mr-2" style={{ fontSize: "4rem" }}>
                  <div className="top-0 left-0 w-[100px] h-[7rem] ">
                    <Image
                      src="/icons/All Icon/Lesson page/Wrong answer.svg"
                      alt="logo"
                      //  layout="fill"
                      objectFit="contain"
                      style={{ width: "100% !important" }}
                      width={100}
                      height={100}
                    />
                  </div>
                </span>
                {/* <span> Wrong! Correct Answer: {correctAns} </span> */}
                <span>
                  Wrong! Correct Answer:
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#f8d7da",
                      color: "#721c24",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      marginLeft: "5px",
                    }}
                  >
                    {correctAns}
                  </span>
                </span>

              </>
            )}
          </div>
          <button
            onClick={handleContinue}
            className={`bg-${isCorrectAns ? "green" : "red"
              }-500 text-white bg-gray-500 rounded-lg px-14 py-4 opacity-100 cursor-pointer hover:bg-red-500`}
          >
            {step === totalSteps
              ? `${buttonT("finish")}`
              : `${buttonT("continue")}`}
          </button>
        </>
      )}
    </div>
  );
};

export default ControlPanel;
