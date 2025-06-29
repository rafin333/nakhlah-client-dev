import { TextToSpeech } from "@/utils/textToSpeech";
import { addTooltipsToTitle } from "@/utils/tooltipUtils";
import { Volume2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPlayCircle, FaVolumeUp } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { getBaseURL } from "@/helpers/config/envConfig";

const LearnQuestion = ({
  setIsSelected,
  contentDetailsData,
  setIsCorrectAns,
  isClickedCheck,
  setNoOfCorrectAns,
  setCorrectAns,
  contentLanguageData,
  questionTitle,
  isRepeatedQuestion,
  questionDetails,
  setIsClickedCheck,
}) => {
  // const audio = contentDetailsData[0]?.attributes?.audio;
  // const title = contentDetailsData[0]?.attributes?.content?.data?.attributes?.title;
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [qImage, setQImage] = useState("");
  const languageTitle =
    contentLanguageData && contentLanguageData[0]?.attributes?.title;

  //////////////////////////////////////////////////////// AUDIO FUNCTIONALITIES //////////////////////////////////////
  console.log(questionDetails?.audio?.data?.attributes?.url);
  const audioRef = useRef(null);
  const audioURL =
    getBaseURL().replace("/api/", "") +
    questionDetails?.audio?.data?.attributes?.url;

  const handleAudioPlay = (speed) => {
    console.log(audioURL);
    if (audioRef.current && questionDetails?.audio?.data?.attributes?.url) {
      const audioElement = audioRef.current;

      // Set the desired playback rate (values between 0.5 and 2.0 are common)
      audioElement.playbackRate = speed; // Slow down to half speed (0.5)

      audioElement.play();
    }
  };

  //////////////////////////////////////////////////////// AUDIO FUNCTIONALITIES //////////////////////////////////////

  useEffect(() => {
    console.log("Called");
    setQImage(getBaseURL() + questionDetails?.image?.url);
    setIsSelected(true);
    setIsClickedCheck(true);
    if (questionDetails?.toolTip) {
      let titleWithToolTip = addTooltipsToTitle(
        questionDetails?.title,
        questionDetails?.toolTip
      );
      setUpdatedTitle(titleWithToolTip);
    } else {
      setUpdatedTitle(questionDetails?.title);
    }
  }, [questionDetails.id, setIsSelected]);

  useEffect(() => {
    console.log("Called", isClickedCheck);
    if (isClickedCheck) {
      setIsCorrectAns(true);
      setNoOfCorrectAns((pre) => pre + 1);
    }
  }, [isClickedCheck, setIsCorrectAns, setNoOfCorrectAns]);
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className=" mb-4">
        {isRepeatedQuestion && (
          <div className=" flex text-sm items-center font-bold text-gray-700 mb-4">
            {/* <Image
              alt="previousQuestion"
              height={1}
              width={38}
              src={"/icons/All Icon/Lesson page/Previous mistake question.svg"}
            /> */}
            <Image
              alt="previousQuestion"
              height={1}
              width={1}
              src={"/icons/All Icon/Lesson page/Previous mistake question.svg"}
            />
            &nbsp; Previous mistake questions
          </div>
        )}
      </div>
      <h1 className="flex justify-center items-center mb-4 font-bold text-lg">
        {" "}
        Learn{" "}
      </h1>
      {questionDetails?.audio?.data?.attributes?.url && (
        <div className="flex flex-row justify-center items-center mb-4">
          <audio ref={audioRef} src={audioURL} />
          <Image className="p-3" src={'/image/Slow_Audio_1.svg'} alt="slow audio" width={70} height={70} onClick={() => handleAudioPlay(0.55)} />
          <Image  className="p-3" src={'/image/Normal_Audio.svg'} alt="Fast audio" width={80} height={80} onClick={() => handleAudioPlay(0.95)} />
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

      <div className="flex flex-row justify-center items-center mb-4">
        <div
          className="text-center text-lg font-semibold"
          dangerouslySetInnerHTML={{ __html: updatedTitle }}
        />
      </div>

      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row justify-center items-center">
        {questionDetails?.mediaTypes?.image && (
          <div className="w-full sm:w-1/2 flex justify-center items-center ">
            <div className="relative max-w-120 max-h-250">
              {/* {(qImage.replace("api//",""))} */}
              {questionDetails?.image && questionDetails?.mediaTypes?.image && (
                <Image
                  src={qImage.replace("api//", "")}
                  alt="Thumbnail"
                  width={150}
                  height={150}
                  objectFit="contain"
                />
              )}
            </div>
          </div>
        )}
        <div className="w-full sm:w-1/2 flex items-center justify-start">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-center">
              <h1 className="text-center text-3xl font-bold">
                {questionDetails?.content?.attributes?.title}
              </h1>
            </div>
            <div className="flex items-center justify-center">
              <h1 className="text-center text-3xl font-bold">
                {languageTitle}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnQuestion;
