import { TextToSpeech } from "@/utils/textToSpeech";
import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import Image from "next/image";
import { FaVolumeUp } from "react-icons/fa";
import { shuffleArray } from "@/utils/shuffle";
import { FaRepeat } from "react-icons/fa6";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import { useSelector } from "react-redux";

const FITBQuestion = ({
  options,
  setIsSelected,
  contentDetailsData,
  setIsCorrectAns,
  isClickedCheck,
  setCorrectAns,
  setNoOfCorrectAns,
  setIncorrectQuestions,
  setQuestions,
  question,
  isRepeatedQuestion,
  audioEnable,
  languageData,
  questionDetails,
  gamificationTxData,
  isExamLesson,
}) => {
  console.log(contentDetailsData);
  console.log(languageData);
  console.log(" ALL OPTIONS => ", options);
  console.log(isRepeatedQuestion);


  const { planData } = useSelector((state) => state.subscriptionStore);
  const hasSubscription =
    planData && planData?.subscription_plan?.planName != "Free";

  async function palmLossAPI() {
    console.log(planData?.subscription_plan?.planName)
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

  const frameSize = window.innerWidth;

  /* console.log(
    " AUDIO ==> ",
    contentDetailsData[0][0]?.attributes.audio,
    contentDetailsData[1][0]?.attributes.audio,
    contentDetailsData[2][0]?.attributes.audio,
    contentDetailsData[3][0]?.attributes.audio
  ); */
  /* const thumbnailUrl = contentDetailsData
    ? contentDetailsData[contentDetailsData.length - 1]?.attributes?.image?.data
        ?.attributes?.formats?.thumbnail?.url
    : ""; */
  const audio = languageData
    ? languageData[languageData.length - 1]?.attributes?.title
    : "";
  // const audio1 = languageData
  //   ? languageData[languageData.length - 1]?.attributes?.title
  //   : "";
  // console.log(audio1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [shuffleOptions, setShuffleOptions] = useState([]);
  const [defaultUrl, setDefaultUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [smallImageUrl, setSmallImageUrl] = useState("");
  const [mediumUrl, setMediumUrl] = useState("");
  const [largeUrl, setLargeUrl] = useState("");
  const handleLearnerGamification = useHandleLearnerGamification();
  const hasFetched = useRef(false);
  console.log(thumbnailUrl);
  const handleClick = (optionId, index) => {
    if (isClickedCheck) {
      return; // Do nothing if check has been clicked
    }
    console.log("optionId =--> ", optionId);
    // contentDetailsData[0].attributes.content.data.id
    let audio = contentDetailsData.find(
      (contentsDetail) =>
        contentsDetail?.attributes?.content?.data?.id === optionId
    );
    if (audioEnable && audio?.attributes?.audio) {
      TextToSpeech(audio?.attributes?.audio);
    }
    setSelectedOptionId(optionId);
    setIsSelected(true);
    setSelectedOption(selectedOption === optionId ? null : optionId);
    hasFetched.current = false;
  };

  useEffect(() => {
    const fetch = async () => {
      if (selectedOption && !hasFetched.current) {
        const filterSelectedOption = options.filter(
          (op) => op.id == selectedOptionId
        );
        if (isClickedCheck && filterSelectedOption.length > 0) {
          hasFetched.current = true;
          if (filterSelectedOption[0].attributes.isRightAns) {
            setIsCorrectAns(true);
            setNoOfCorrectAns((prev) => prev + 1);
          } else {
            setIsCorrectAns(false);
            const rightAnswer = options.find(
              (option) => option?.attributes?.isRightAns
            );
            setCorrectAns(rightAnswer?.attributes.title);
            if (!isExamLesson) {
              palmLossAPI();
              setIncorrectQuestions((prev) => [...prev, question]);
              setQuestions((prev) => [...prev, question]);
            }
          }
        }
      }
    };
    fetch();
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
    if (options && options.length > 0) {
      setShuffleOptions(shuffleArray(options));
      setSelectedOption(null);
    }
  }, [options]);

  const handleAudioPlay = () => {
    console.log("audio ==> ", audio);
    if (audio) {
      TextToSpeech(audio);
    }
  };

  useEffect(() => {
    if (contentDetailsData && contentDetailsData.length > 0) {
      const lastDetail = contentDetailsData[contentDetailsData.length - 1];
      const defaultURL = lastDetail?.attributes?.image?.data?.attributes?.url;
      const imageUrlThumb =
        lastDetail?.attributes?.image?.data?.attributes?.formats?.thumbnail
          ?.url;
      const imageUrlSmall =
        lastDetail?.attributes?.image?.data?.attributes?.formats?.small?.url;
      const imageUrlMedium =
        lastDetail?.attributes?.image?.data?.attributes?.formats?.medium?.url;
      const imageUrlLarge =
        lastDetail?.attributes?.image?.data?.attributes?.formats?.large?.url;
      setDefaultUrl(defaultURL ? `https://api.nakhlah.xyz${defaultURL}` : "");
      setThumbnailUrl(
        imageUrlThumb ? `https://api.nakhlah.xyz${imageUrlThumb}` : ""
      );
      setSmallImageUrl(
        imageUrlSmall ? `https://api.nakhlah.xyz${imageUrlSmall}` : ""
      );
      setMediumUrl(
        imageUrlMedium ? `https://api.nakhlah.xyz${imageUrlMedium}` : ""
      );
      setLargeUrl(
        imageUrlLarge ? `https://api.nakhlah.xyz${imageUrlLarge}` : ""
      );
    }
  }, [contentDetailsData]);
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className=" mb-4">
        {!isExamLesson && isRepeatedQuestion && (
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
          {questionDetails?.mediaTypes?.text && questionDetails?.title}
        </div>
      </div>
      <div className="mb-5.5 flex flex-col gap-5.5 md:flex-row">
        <div className="w-full md:w-1/2 flex justify-center items-center mb-5 md:mb-0">
          <div
            className="relative max-w-xs border-0 border-lavender-100"
            style={{ height: "200px", width: "90%" }}
          >
            {questionDetails?.image && questionDetails?.mediaTypes?.image && (
              <Image
                src={`https://api.nakhlah.xyz${questionDetails?.image?.url}`}
                alt="Thumbnail"
                layout="fill"
                objectFit="contain"
              />
            )}
            {questionDetails?.mediaTypes?.audio && (
              <button
                className="absolute top-1 right-0 mt-1 mr-1 cursor-pointer text-white bg-lavender-600 p-2 rounded-full border-2 border-lavender-400"
                onClick={handleAudioPlay}
              >
                <FaVolumeUp
                  size={
                    questionDetails?.mediaTypes?.image && questionDetails?.image
                      ? 18
                      : 50
                  }
                />
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shuffleOptions.map((option, i) => (
              <>
                <button
                  key={option.id}
                  className={`flex items-center justify-center h-12 rounded-lg border-4 border-lavender-300 ${
                    selectedOption === option.id
                      ? "bg-lavender-600 text-white"
                      : "bg-white text-black"
                  } font-bold `}
                  onClick={() => handleClick(option.id, i)}
                >
                  {option?.attributes?.title}
                  &nbsp;
                  <FaVolumeUp size={12} />
                </button>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FITBQuestion;
