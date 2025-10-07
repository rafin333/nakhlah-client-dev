import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { shuffleArray } from "@/utils/shuffle";
import { TextToSpeech } from "@/utils/textToSpeech";
import { addTooltipsToTitle } from "@/utils/tooltipUtils";
import { useCallback, useEffect, useState } from "react";
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import styles from "./MatchingQuestion.module.css";
import { useSelector } from "react-redux";
import Image from "next/image";
const MatchingQuestion = ({
  setIsSelected,
  setIsCorrectAns,
  isClickedCheck,
  setNoOfCorrectAns,
  isRepeatedQuestion,
  questionDetails,
  gamificationTxData,
  isExamLesson,
}) => {
  const [selectedContentOption, setSelectedContentOption] = useState(null);
  const [selectedLanguageOption, setSelectedLanguageOption] = useState(null);
  const [languageTitles, setLanguageTitles] = useState([]);
  const [matchedOptions, setMatchedOptions] = useState([]);
  const [questionContentOptions, setQuestionContentOptions] = useState([]);
  const [isAlreadyDateDeducted, setIsAlreadyDateDeducted] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [showCrossIcon, setShowCrossIcon] = useState(false);

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

  console.log(questionDetails?.id);
  useEffect(() => {
    const isSelectedAllOption =
      matchedOptions.length === questionContentOptions.length &&
      matchedOptions.length > 0;
    console.log(isSelectedAllOption);
    if (isSelectedAllOption) {
      setIsSelected(true);
      setIsCorrectAns(true);
    }
  }, [
    matchedOptions,
    questionContentOptions.length,
    setIsSelected,
    setIsCorrectAns,
  ]);

  useEffect(() => {
    console.log(isClickedCheck);
    if (isClickedCheck) {
      setIsCorrectAns(true);
      setNoOfCorrectAns((pre) => pre + 1);
    }
  }, [isClickedCheck, setIsCorrectAns, setNoOfCorrectAns]);
  const handleLearnerGamification = useHandleLearnerGamification();
  const handleContentOptionClick = async (optionId) => {
    if (!matchedOptions.includes(optionId)) {
      setSelectedContentOption(optionId);
      setShowCrossIcon(false);
      console.log(
        optionId,
        selectedLanguageOption,
        optionId === selectedLanguageOption
      );
      if (optionId === selectedLanguageOption) {
        setMatchedOptions([...matchedOptions, optionId]);
        setSelectedLanguageOption(null);
        setSelectedContentOption(null);
      } else {
        console.log(selectedLanguageOption != null);
        if (selectedLanguageOption != null) {
          setShowCrossIcon(true);
        }
        if (
          !isAlreadyDateDeducted &&
          selectedLanguageOption != null &&
          !isExamLesson
        ) {
          palmLossAPI();
        }
      }
    }
  };

  const handleLanguageOptionClick = async (optionId) => {
    if (!matchedOptions.includes(optionId)) {
      setSelectedLanguageOption(optionId);
      setShowCrossIcon(false);
      let languageContent = languageTitles.find((lt) => lt?.id == optionId);
      console.log(
        languageContent?.audio,
        questionDetails?.contentMediaTypes?.audio
      );
      if (languageContent?.audio && questionDetails?.contentMediaTypes?.audio) {
        TextToSpeech(languageContent?.audio);
      }
      const content = questionContentOptions.find(
        (option) => option.id === selectedContentOption
      );
      console.log(content);
      if (content && content.id === languageContent?.id) {
        setMatchedOptions([...matchedOptions, selectedContentOption]);
        setSelectedLanguageOption(null);
        setSelectedContentOption(null);
      } else {
        if (selectedContentOption !== null) {
          setShowCrossIcon(true); // Show cross icon only when it's incorrect
        }
        if (
          !isAlreadyDateDeducted &&
          selectedContentOption != null &&
          !isExamLesson
        ) {
          palmLossAPI();
        }
      }
    }
  };

  const allOptionsMatched =
    matchedOptions.length === questionContentOptions.length;

  useEffect(() => {
    if (questionDetails?.content && questionDetails?.questionContentOptions) {
      if (questionDetails?.toolTip) {
        let titleWithToolTip = addTooltipsToTitle(
          questionDetails?.title,
          questionDetails?.toolTip
        );
        setUpdatedTitle(titleWithToolTip);
      } else {
        setUpdatedTitle(questionDetails?.title);
      }
      console.log(
        questionDetails?.content?.attributes?.image?.data?.attributes?.url
      );
      console.log(questionDetails?.questionContentOptions);
      let allContentOptions = [
        questionDetails?.content,
        ...questionDetails?.questionContentOptions,
      ];

      let languageTitlesArr = [];
      for (let i = 0; i < allContentOptions.length; i++) {
        const contentOption = allContentOptions[i];
        console.log(contentOption?.attributes?.content_details?.data);
        let contentDetails = contentOption?.attributes?.content_details?.data;
        console.log(
          contentDetails[0]?.attributes?.language?.data?.attributes?.language
        );
        let languageContent = contentDetails.find(
          (contentDetail) =>
            contentDetail?.attributes?.language?.data?.attributes?.language ==
            questionDetails?.language
        );
        console.log(languageContent);
        let rightSideContentOptions = {
          id: languageContent?.attributes?.content?.data?.id,
          title: languageContent?.attributes?.title,
          audio: languageContent?.attributes?.audio,
          pronunciation: languageContent?.attributes?.pronunciation,
        };
        console.log(rightSideContentOptions);
        languageTitlesArr.push(rightSideContentOptions);
      }
      console.log(allContentOptions);
      allContentOptions = allContentOptions.map((contentOption) => {
        return {
          id: contentOption?.id,
          title: contentOption?.attributes?.title,
          audio: contentOption?.attributes?.audio,
        };
      });
      console.log(questionDetails?.arabic_tx_type);
      console.log(allContentOptions);
      if (questionDetails?.arabic_tx_type == "Arabic From") {
        setQuestionContentOptions(allContentOptions);
        setLanguageTitles(shuffleArray(languageTitlesArr));
      } else {
        setQuestionContentOptions(languageTitlesArr);
        setLanguageTitles(shuffleArray(allContentOptions));
      }
      setIsAlreadyDateDeducted(false);
      // console.log(allContentOptions[0]?.attributes?.content_details?.data);
    }
  }, [questionDetails?.id]);

  // return (
  //   <div className="max-w-3xl mx-auto px-4 py-4">
  //     <div className=" mb-4">
  //       {isRepeatedQuestion && (
  //         <div className=" flex text-sm items-center font-bold text-gray-700 mb-4">
  //           <Image
  //             alt="previousQuestion"
  //             height={1}
  //             width={38}
  //             src={"/icons/All Icon/Lesson page/Previous mistake question.svg"}
  //           />&nbsp; Previous mistake questions
  //         </div>
  //       )}
  //     </div>
  //     <div className="flex justify-center items-center mb-4">
  //       <div className="text-xl font-bold text-gray-700 mb-4">
  //         <div dangerouslySetInnerHTML={{ __html: updatedTitle }} />
  //       </div>
  //     </div>
  //     <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
  //       <div>
  //         {questionContentOptions.map((option) => (
  //           <div className="relative" key={option.id}>
  //             <div
  //               className={`p-4 mb-2 rounded-lg font-bold border-4 border-lavender-300 flex items-center ${
  //                 matchedOptions.includes(option.id)
  //                   ? "bg-lavender-100"
  //                   : selectedContentOption === option.id
  //                   ? "bg-lavender-600 text-white"
  //                   : "bg-white"
  //               }`}
  //               onClick={() => handleContentOptionClick(option.id)}
  //               style={{
  //                 boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
  //                 cursor:
  //                   matchedOptions.includes(option.id) || allOptionsMatched
  //                     ? "default"
  //                     : "pointer",
  //               }}
  //             >
  //               <div className="flex-1 text-center">{option?.title}</div>
  //               {matchedOptions.includes(option.id) && (
  //                 <FaCheckCircle className="text-green-500 ml-2" />
  //               )}
  //               {/* {selectedContentOption === option.id &&
  //                 !matchedOptions.includes(option.id) && (
  //                   <FaTimesCircle className="text-red-500 ml-2" />
  //                 )} */}
  //               {selectedContentOption === option.id &&
  //                 !matchedOptions.includes(option.id) &&
  //                 showCrossIcon && ( // Show cross icon only on mismatch
  //                   <FaTimesCircle className="text-red-500 ml-2" />
  //                 )}
  //             </div>
  //             {option?.pronunciation && (
  //               <div className={styles.tooltipContainer}>
  //                 <FaInfoCircle
  //                   size={12}
  //                   color="lavender"
  //                   className="cursor-pointer"
  //                 />
  //                 <span className={styles.tooltipText}>
  //                   {option?.pronunciation ? option?.pronunciation : ""}
  //                 </span>
  //               </div>
  //             )}
  //           </div>
  //         ))}
  //       </div>
  //       <div>
  //         {languageTitles.map((languageOption, index) => (
  //           <div className="relative" key={languageOption?.id}>
  //             <div
  //               className={`p-4 mb-2 rounded-lg text-center border-4 border-lavender-300 flex items-center ${
  //                 matchedOptions.includes(languageOption?.id)
  //                   ? "bg-lavender-100"
  //                   : selectedLanguageOption === languageOption?.id
  //                   ? "bg-lavender-600 text-white"
  //                   : "bg-white"
  //               }`}
  //               onClick={() => handleLanguageOptionClick(languageOption?.id)}
  //               style={{
  //                 boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
  //                 cursor:
  //                   matchedOptions.includes(languageOption?.id) ||
  //                   allOptionsMatched
  //                     ? "default"
  //                     : "pointer",
  //               }}
  //             >
  //               <div className="flex-1 text-center">
  //                 {languageOption ? languageOption.title : "Not found"}
  //               </div>
  //               {matchedOptions.includes(languageOption?.id) && (
  //                 <FaCheckCircle className="text-green-500 ml-2" />
  //               )}
  //               {/* {selectedLanguageOption === languageOption?.id &&
  //                 !matchedOptions.includes(languageOption?.id) && (
  //                   <FaTimesCircle className="text-red-500 ml-2" />
  //                 )} */}
  //               {selectedLanguageOption === languageOption.id &&
  //                 !matchedOptions.includes(languageOption.id) &&
  //                 showCrossIcon && ( // Show cross icon only on mismatch
  //                   <FaTimesCircle className="text-red-500 ml-2" />
  //                 )}
  //             </div>
  //             {languageTitles?.pronunciation && (
  //               <div className={styles.tooltipContainer}>
  //                 <FaInfoCircle
  //                   size={12}
  //                   color="lavender"
  //                   className="cursor-pointer"
  //                 />
  //                 <span className={styles.tooltipText}>
  //                   {languageTitles?.pronunciation
  //                     ? languageTitles?.pronunciation
  //                     : ""}
  //                 </span>
  //               </div>
  //             )}
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //     {/*<div className="mt-4">
  //       {allOptionsMatched && (
  //         <p className="text-green-500">All matches are correct!</p>
  //       )}
  //       </div>*/}
  //   </div>
  // );

  return (
  <div className="max-w-4xl mx-auto px-6 py-6">
    {/* Repeat Question Banner */}
    {isRepeatedQuestion && (
      <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-6">
        <Image
          alt="previousQuestion"
          height={20}
          width={20}
          src="/icons/All Icon/Lesson page/Previous mistake question.svg"
        />
        <span>Previous mistake questions</span>
      </div>
    )}

    {/* Title */}
    <div className="text-center mb-8">
      <div
        className="text-3xl font-bold leading-snug"
        dangerouslySetInnerHTML={{ __html: updatedTitle }}
      />
    </div>

    {/* Two-column matching area */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Content Options */}
      <div className="">
        {questionContentOptions.map((option) => (
          <div key={option.id} className="relative mb-3">
            <div
              className={`p-4 rounded-lg font-bold border-4 border-lavender-300 flex items-center justify-between transition-transform ${
                matchedOptions.includes(option.id)
                  ? "bg-lavender-100"
                  : selectedContentOption === option.id
                  ? "bg-lavender-600 text-white scale-[1.02]"
                  : "bg-white hover:scale-[1.02]"
              }`}
              onClick={() => handleContentOptionClick(option.id)}
              style={{
                cursor:
                  matchedOptions.includes(option.id) || allOptionsMatched
                    ? "default"
                    : "pointer",
              }}
            >
              <div className="flex-1 text-center text-2xl font-medium">{option?.title}</div>
              {matchedOptions.includes(option.id) && (
                <FaCheckCircle className="text-green-500 ml-2" />
              )}
              {selectedContentOption === option.id &&
                !matchedOptions.includes(option.id) &&
                showCrossIcon && (
                  <FaTimesCircle className="text-red-500 ml-2" />
                )}
            </div>
            {option?.pronunciation && (
              <div className={styles.tooltipContainer}>
                <FaInfoCircle size={12} color="lavender" />
                <span className={styles.tooltipText}>
                  {option?.pronunciation}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right: Language Options */}
      <div className="">
        {languageTitles.map((languageOption) => (
          <div key={languageOption?.id} className="relative mb-3">
            <div
              className={`p-4 rounded-lg border-4 border-lavender-300 flex items-center justify-between transition-transform ${
                matchedOptions.includes(languageOption?.id)
                  ? "bg-lavender-100"
                  : selectedLanguageOption === languageOption?.id
                  ? "bg-lavender-600 text-white scale-[1.02]"
                  : "bg-white hover:scale-[1.02]"
              }`}
              onClick={() => handleLanguageOptionClick(languageOption?.id)}
              style={{
                cursor:
                  matchedOptions.includes(languageOption?.id) ||
                  allOptionsMatched
                    ? "default"
                    : "pointer",
              }}
            >
              <div className="flex-1 text-center text-2xl font-bold">
                {languageOption ? languageOption.title : "Not found"}
              </div>
              {matchedOptions.includes(languageOption?.id) && (
                <FaCheckCircle className="text-green-500 ml-2" />
              )}
              {selectedLanguageOption === languageOption.id &&
                !matchedOptions.includes(languageOption.id) &&
                showCrossIcon && (
                  <FaTimesCircle className="text-red-500 ml-2" />
                )}
            </div>
            {languageOption?.pronunciation && (
              <div className={styles.tooltipContainer}>
                <FaInfoCircle size={12} color="lavender" />
                <span className={styles.tooltipText}>
                  {languageOption?.pronunciation}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default MatchingQuestion;
