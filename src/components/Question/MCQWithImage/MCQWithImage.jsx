import React, { useEffect, useState } from "react";
import Image from "next/image";
import { TextToSpeech } from "@/utils/textToSpeech";
import { shuffleArray } from "@/utils/shuffle";
import { FaRepeat } from "react-icons/fa6";
const MCQWithImage = ({
  options,
  setIsSelected,
  contentDetailsData,
  setIsCorrectAns,
  isClickedCheck,
  setCorrectAns,
  questionTitle,
  setNoOfCorrectAns,
  setIncorrectQuestions,
  setQuestions,
  question,
  isRepeatedQuestion,
}) => {
  console.log(contentDetailsData);
  console.log(isClickedCheck);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [shuffleContentDetailsData, setShuffleContentDetailsData] = useState(
    []
  );
  const handleClick = (optionId, index) => {
    if (isClickedCheck) {
      return; // Do nothing if check has been clicked
    }
    let audio = contentDetailsData.find(
      (contentsDetail) =>
        contentsDetail?.attributes?.content?.data?.id === optionId
    );
    if (audio?.attributes?.audio) {
      TextToSpeech(audio?.attributes?.audio);
    }
    setSelectedOptionId(optionId);
    setIsSelected(true);
    setSelectedOption(selectedOption === optionId ? null : optionId);
  };

  useEffect(() => {
    if (selectedOption) {
      const filterSelectedOption = options.filter(
        (op) => op.id == selectedOptionId
      );
      if (isClickedCheck && filterSelectedOption.length > 0) {
        if (filterSelectedOption[0].attributes.isRightAns) {
          console.log("called");
          setIsCorrectAns(true);
          setNoOfCorrectAns((prev) => prev + 1);
        } else {
          setIsCorrectAns(false);
          const rightAnswer = options.find(
            (option) => option?.attributes?.isRightAns
          );
          console.log(rightAnswer);
          setIncorrectQuestions((prev) => [...prev, question]);
          setQuestions((prev) => [...prev, question]);
          setCorrectAns(rightAnswer?.attributes.title);
        }
      }
    }
  }, [
    isClickedCheck,
    options,
    question,
    selectedOption,
    selectedOptionId,
    setCorrectAns,
    setIncorrectQuestions,
    setIsCorrectAns,
    setNoOfCorrectAns,
    setQuestions,
  ]);
  useEffect(() => {
    if (contentDetailsData && contentDetailsData.length > 0) {
      setShuffleContentDetailsData(shuffleArray(contentDetailsData));
    }
  }, [contentDetailsData]);
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
        <div className="text-xl font-bold text-gray-700 mb-4">
          {questionTitle}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 justify-center">
        {shuffleContentDetailsData?.slice(0, 4).map((option, index) => (
          <div
            key={index}
            className={`border ${
              selectedOption === option?.attributes?.content?.data?.id
                ? "bg-lavender-600 text-white"
                : ""
            } border-lavender-300 p-4 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-md`} // Use the styled card class here
            onClick={() =>
              handleClick(option?.attributes?.content?.data?.id, index)
            }
          >
            {option?.attributes?.image?.data?.attributes?.formats?.thumbnail
              ?.url && (
              <div className="w-24 h-24 mb-2 relative">
                <Image
                  src={`https://api.nakhlah.xyz${option?.attributes?.image?.data?.attributes?.formats?.thumbnail?.url}`}
                  alt={option?.attributes?.content?.data?.attributes?.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            )}
            <span className="text-center text-lg font-medium">
              {option?.attributes?.content?.data?.attributes?.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MCQWithImage;
