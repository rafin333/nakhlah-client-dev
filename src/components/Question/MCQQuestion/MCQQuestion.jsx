import { TextToSpeech } from "@/utils/textToSpeech";
import React, { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import Image from "next/image";
import { FaInfoCircle, FaPlay, FaVolumeUp } from "react-icons/fa";
import { shuffleArray } from "@/utils/shuffle";
import { FaRepeat } from "react-icons/fa6";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import styles from "./MCQQuestion.module.css";
import { addTooltipsToTitle } from "@/utils/tooltipUtils";
import { getBaseURL } from "@/helpers/config/envConfig";
import { useSelector } from "react-redux";
const MCQQuestion = ({
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
  questionDetails,
  gamificationTxData,
  isExamLesson,
  isFillInTheBlank,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [shuffleOptions, setShuffleOptions] = useState([]);
  const [shuffleContentDetailsData, setShuffleContentDetailsData] = useState(
    []
  );
  const [shuffleContentOptionData, setShuffleContentOptionData] = useState([]);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [animationClass, setAnimationClass] = useState("");
  const hasFetched = useRef(false);
  const handleLearnerGamification = useHandleLearnerGamification();
  console.log(updatedTitle);
  console.log(animationClass);
  console.log(questionDetails);
  console.log(shuffleContentOptionData);
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

  const handleClick = (optionId, index) => {
    if (isClickedCheck) {
      return; // Do nothing if check has been clicked
    }
    console.log("optionId =--> ", optionId);
    // contentDetailsData[0].attributes.content.data.id
    const audio = shuffleContentOptionData.find((data) => data.id === optionId);

    console.log(questionDetails?.contentMediaTypes?.audio);
    if (questionDetails?.contentMediaTypes?.audio && audio?.audio) {
      TextToSpeech(audio?.audio, questionDetails?.language);
    }
    setSelectedOptionId(optionId);
    setIsSelected(true);
    setSelectedOption(selectedOption === optionId ? null : optionId);
    if (isFillInTheBlank) {
      console.log(selectedOption);
      // const updatedTitle = questionDetails?.title.replace(/_+/, options.find(op => op.id === optionId)?.attributes?.title);
      // setUpdatedTitle(updatedTitle);
      let newTitle = questionDetails?.title.replace(
        /_+/,
        `<span class="${styles.replacedText}">${
          options.find((op) => op.id === optionId)?.attributes?.title
        }</span>`
      );
      console.log(questionDetails?.toolTip);
      if (questionDetails?.toolTip) {
        let titleWithToolTip = addTooltipsToTitle(
          newTitle,
          questionDetails?.toolTip
        );
        setUpdatedTitle(titleWithToolTip);
      } else {
        setUpdatedTitle(newTitle);
      }
      console.log(styles.replacedText);
      setAnimationClass(styles.replacedText);
    }
    hasFetched.current = false; // Reset fetch status on new selection
  };

  useEffect(() => {
    const fetch = async () => {
      if (selectedOption && !hasFetched.current) {
        const filterSelectedOption = options.filter(
          (op) => op.id == selectedOptionId
        );
        if (isClickedCheck && filterSelectedOption.length > 0) {
          hasFetched.current = true; // Mark as fetched
          if (filterSelectedOption[0].attributes.isRightAns) {
            setIsCorrectAns(true);
            setNoOfCorrectAns((prev) => prev + 1);
          } else {
            setIsCorrectAns(false);
            const rightAnswer = shuffleContentOptionData.find(
              (option) => option?.id == questionDetails?.content?.id
            );
            console.log(rightAnswer);
            setCorrectAns(rightAnswer.title);
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
    if (contentDetailsData && contentDetailsData.length > 0) {
      setShuffleContentDetailsData(shuffleArray(contentDetailsData));
    }
  }, [contentDetailsData]);
  // useEffect(() => {
  //   if (options && options.length > 0) {
  //     setShuffleOptions(shuffleArray(options));
  //     setSelectedOption(null);
  //   }
  // }, [options]);
  useEffect(() => {
    if (questionDetails?.content && questionDetails?.questionContentOptions) {
      console.log(
        questionDetails?.content?.attributes?.image?.data?.attributes?.url
      );
      console.log(questionDetails?.questionContentOptions);
      let allContentOptions = [
        questionDetails?.content,
        ...questionDetails?.questionContentOptions,
      ];
      console.log(allContentOptions);
      console.log(questionDetails?.arabic_tx_type);
      if (questionDetails?.language != "Arabic") {
        console.log(allContentOptions);
        allContentOptions = allContentOptions.map((contentOption) => {
          console.log(contentOption?.attributes?.content_details);
          let filteredLanguage =
            contentOption?.attributes?.content_details?.data?.find(
              (contentDetail) =>
                contentDetail?.attributes?.language?.data?.attributes
                  ?.language == questionDetails?.language
            );
          console.log(filteredLanguage);
          return {
            id: contentOption?.id,
            title: filteredLanguage?.attributes?.title,
            audio: filteredLanguage?.attributes?.audio,
            image: contentOption?.attributes?.image,
          };
        });
      } else if (questionDetails?.arabic_tx_type == "Arabic To") {
        allContentOptions = allContentOptions.map((contentOption) => {
          console.log(contentOption?.attributes?.content_details);
          let filteredLanguage =
            contentOption?.attributes?.content_details?.data?.find(
              (contentDetail) =>
                contentDetail?.attributes?.language?.data?.attributes
                  ?.language == questionDetails?.language
            );
          console.log(filteredLanguage);
          return {
            id: contentOption?.id,
            title: filteredLanguage?.attributes?.title,
            audio: filteredLanguage?.attributes?.audio,
            image: contentOption?.attributes?.image,
          };
        });
      } else {
        allContentOptions = allContentOptions.map((contentOption) => {
          return {
            id: contentOption?.id,
            title: contentOption?.attributes?.title,
            audio: contentOption?.attributes?.audio,
            image: contentOption?.attributes?.image,
          };
        });
      }
      console.log(allContentOptions);
      console.log(questionDetails?.toolTip);
      setShuffleContentOptionData(shuffleArray(allContentOptions));
      setSelectedOption(null);
      if (questionDetails?.toolTip) {
        let titleWithToolTip = addTooltipsToTitle(
          questionDetails?.title,
          questionDetails?.toolTip
        );
        setUpdatedTitle(titleWithToolTip);
      } else {
        setUpdatedTitle(questionDetails?.title);
      }
      setAnimationClass("");
    }
  }, [questionDetails?.id]);
  // const handleAudioPlay = () => {
  //   if (questionDetails.mediaTypes.audio && questionDetails.audio) {
  //     TextToSpeech(questionDetails.audio);
  //   }
  // };

  //////////////////////////////////////////////////////// AUDIO FUNCTIONALITIES //////////////////////////////////////
  console.log(questionDetails?.audio?.data?.attributes?.url);
  const audioRef = useRef(null);
  const audioURL =
    getBaseURL().replace("/api/", "") +
    questionDetails?.audio?.data?.attributes?.url;

  const handleAudioPlay = (speed) => {
    console.log(audioURL);
    if (audioRef.current && !!questionDetails?.audio?.data?.attributes?.url) {
      const audioElement = audioRef.current;

      // Set the desired playback rate (values between 0.5 and 2.0 are common)
      audioElement.playbackRate = speed; // Slow down to half speed (0.5)

      audioElement.play();
    }
  };

  //////////////////////////////////////////////////////// AUDIO FUNCTIONALITIES //////////////////////////////////////

  const renderTitleWithHighlights = (title) => {
    // Assuming the replaced part is surrounded by underscores
    return title.split(/(_+)/).map((part, index) =>
      part.match(/^_+$/) ? (
        <span
          key={index}
          className={animationClass}
          onAnimationEnd={() => setAnimationClass("")}
        >
          {part}
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };
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
            />
            &nbsp; Previous mistake questions
          </div>
        )}
      </div>
      {questionDetails?.audio?.data?.attributes?.url && (
        <div className="flex flex-row justify-center items-center mb-4">
          <audio ref={audioRef} src={audioURL} />
          <Image
            className="p-3"
            src={"/image/Slow_Audio_1.svg"}
            alt="slow audio"
            width={70}
            height={70}
            onClick={() => handleAudioPlay(0.55)}
          />
          <Image
            className="p-3"
            src={"/image/Normal_Audio.svg"}
            alt="Fast audio"
            width={80}
            height={80}
            onClick={() => handleAudioPlay(0.95)}
          />
          {/* <FaPlay
            className="text-lavender-600 text-4xl cursor-pointer mb-2"
            onClick={() => handleAudioPlay(0.55)}
          />

          <FaPlay
            className="text-lavender-600 text-5xl cursor-pointer mb-2"
            onClick={() => handleAudioPlay(0.95)}
          /> */}
          {/* <span className="text-center text-l">{questionDetails?.title}</span> */}
        </div>
      )}
      <div className="flex justify-center items-center mb-4">
        <div className=" text-lg font-semibold text-gray-700 mb-4">
          {/* {questionDetails?.mediaTypes?.text && questionDetails?.title} */}
          {questionDetails?.mediaTypes?.text && (
            <div dangerouslySetInnerHTML={{ __html: updatedTitle }} />
          )}
        </div>
      </div>
      <div className="mb-5.5 flex flex-col gap-5.5 md:flex-row justify-center">
        {(questionDetails?.mediaTypes?.image ||
          questionDetails?.mediaTypes?.audio) && (
          <div className="w-full md:w-1/2 flex justify-center items-center mb-5 md:mb-0">
            <div
              className="relative max-w-xs border-0 border-lavender-100"
              style={{ height: "200px", width: "90%" }}
            >
              {questionDetails?.image && questionDetails?.mediaTypes?.image && (
                <Image
                  src={process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${questionDetails?.image?.url}`}
                  alt="Thumbnail"
                  layout="fill"
                  objectFit="contain"
                />
              )}
              {/* {questionDetails?.mediaTypes?.audio && (
                <button
                  className="absolute top-1 right-0 mt-1 mr-1 cursor-pointer text-white bg-lavender-600 p-2 rounded-full border-2 border-lavender-400"
                  onClick={handleAudioPlay}
                >
                  <audio ref={audioRef} src={audioURL} />

                  <FaVolumeUp
                    size={
                      questionDetails?.mediaTypes?.image &&
                      questionDetails?.image
                        ? 18
                        : 50
                    }
                  />
                </button>
              )} */}
            </div>
          </div>
        )}
        <div className="w-full md:w-1/2">
          {!questionDetails?.contentMediaTypes?.image && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shuffleContentOptionData.map((option, i) => (
                <div
                  className={`relative cursor-pointer flex items-center justify-center px-2 py-2 rounded-lg border-4 border-lavender-300 ${
                    selectedOption === option.id
                      ? "bg-lavender-100 border-lavender-600"
                      : ""
                  }`}
                  key={option.id}
                  onClick={() => handleClick(option.id, i)}
                >
                  <button className={`font-bold`}>{option?.title}</button>
                  {/* Info Icon with Tooltip in Top-Right Corner */}
                  {option?.pronunciation && (
                    <div className={styles.tooltipContainer}>
                      <FaInfoCircle
                        size={10}
                        color="lavender"
                        className="cursor-pointer"
                      />
                      <span className={styles.tooltipText}>
                        {option?.pronunciation ? option?.pronunciation : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {questionDetails?.contentMediaTypes?.image && (
            <div className="grid grid-cols-2 gap-8 justify-center">
              {shuffleContentOptionData?.slice(0, 4).map((option, index) => (
                <div className="relative" key={index}>
                  <div
                    className={` ${
                      selectedOption === option?.id
                        ? "border-4 border-lavender-600 text-white"
                        : "border"
                    } border-lavender-300 p-4 flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-md`} // Use the styled card class here
                    onClick={() => handleClick(option?.id, index)}
                  >
                    {option?.image?.data?.attributes?.url && (
                      <div className="w-24 h-24 mb-2 relative">
                        <Image
                          src={process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${option?.image?.data?.attributes?.url}`}
                          alt={option?.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}

                    {/* No Title under image  */}
                    {/* <span className="text-center text-lg font-medium">
                    {questionDetails?.contentMediaTypes?.text
                      ? option?.title
                      : ""}
                  </span> */}
                  </div>
                  {option?.pronunciation && (
                    <div className={styles.tooltipContainer}>
                      <FaInfoCircle
                        size={12}
                        color="lavender"
                        className="cursor-pointer"
                      />
                      <span className={styles.tooltipText}>
                        {option?.pronunciation ? option?.pronunciation : ""}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MCQQuestion;
