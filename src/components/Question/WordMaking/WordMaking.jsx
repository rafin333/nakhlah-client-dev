import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { shuffleArray } from "@/utils/shuffle";
import ToastMessage from "@/components/Toast";
import { Volume2 } from "lucide-react";
import { Button } from "@material-tailwind/react";
import { TextToSpeech } from "@/utils/textToSpeech";
import { useGetContentDetailsBySyllablesQuery } from "@/redux/features/contentDetails/contentDetailsApi";
import { useGetQuestionContentByIdQuery } from "@/redux/features/questionContentOptions/questionContentOptionsApi";
import { FaVolumeUp } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { addTooltipsToTitle } from "@/utils/tooltipUtils";
import { useSelector } from "react-redux";
import Image from "next/image";

const WordMaking = ({
  questionContentId,
  setIsSelected,
  isClickedCheck,
  setIsCorrectAns,
  setCorrectAns,
  setNoOfCorrectAns,
  contentDetails,
  questionTitle,
  setIncorrectQuestions,
  setQuestions,
  question,
  isRepeatedQuestion,
  questionDetails,
  gamificationTxData,
  isExamLesson,
}) => {
  const query = {
    populate: "*",
    "pagination[pageSize]":"500"
  };
  const [sentenceData, setSentenceData] = useState([]);
  const [selectedClauses, setSelectedClauses] = useState([]);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const { data: clauseContentDetailsData } =
    useGetContentDetailsBySyllablesQuery({ ...query });
  const handleLearnerGamification = useHandleLearnerGamification();
  // const {data: contentDetailsByClauses} = useGetQuestionContentByIdQuery({contentId: questionContentId, ...query});
  // console.log(contentDetailsByClauses);
  const notify = useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);



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



  useEffect(() => {
    const fetchData = async () => {
      let contentDetailsByClauses = await getContentDetailsByClauses(
        questionDetails?.content?.id
      );

      console.log("bunga bunga ==> ", contentDetailsByClauses);

      contentDetailsByClauses = shuffleArray(contentDetailsByClauses);
      setSentenceData(contentDetailsByClauses);
    };
    fetchData();
  }, [questionDetails?.content?.id, clauseContentDetailsData]);

  const getContentDetailsByClauses = async (contentId) => {
    const contentDetailsData = clauseContentDetailsData?.filter(
      (clauseContentDetails) =>
        clauseContentDetails?.attributes?.content?.data?.id === contentId
    );
    if (Array.isArray(contentDetailsData)) {
      return contentDetailsData.map((contentData) => ({
        id: contentData.id,
        title: contentData.attributes.title,
        sequence: contentData.attributes.sequence,
      }));
    } else {
      return [];
    }
  };

  const handleClick = (clauseId, clauseTitle, sequence) => {
    if (isClickedCheck) {
      return; // Do nothing if check has been clicked
    }
    setIsSelected(true);
    if (selectedClauses.some((clause) => clause.id === clauseId)) {
      // If the option is already selected, remove it
      setSelectedClauses(
        selectedClauses.filter((clause) => clause.id !== clauseId)
      );
    } else {
      // If the option is not selected, add it
      setSelectedClauses([
        ...selectedClauses,
        { id: clauseId, title: clauseTitle, sequence: sequence },
      ]);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (isClickedCheck && selectedClauses.length > 0) {
        let clauseData = clauseContentDetailsData.filter((clauseContentDetail) => clauseContentDetail?.attributes?.content?.data?.id == questionDetails?.content?.id)
        clauseData = clauseData.sort((a,b) => a.attributes?.sequence - b.attributes?.sequence);
        let contentWithSequence = clauseData.map((clause) => clause?.attributes?.title).join(" ");
        const selectedClauseSentence = selectedClauses
          .map((selectedClause) => selectedClause?.title)
          .join(" ");
        let isRightAns = contentWithSequence.toLowerCase() == selectedClauseSentence.toLowerCase();
        if (isRightAns) {
          setIsCorrectAns(true);
          setNoOfCorrectAns((pre) => pre + 1);
        } else {
          // const sortedWords = selectedClauses.sort(
          //   (a, b) => a.sequence - b.sequence
          // );
          // const sentence = sortedWords.map((word) => word.title).join(" ");
          setIsCorrectAns(false);
          setCorrectAns(contentWithSequence);
          if (!isExamLesson) {
            palmLossAPI();
            setIncorrectQuestions((prev) => [...prev, question]);
            setQuestions((prev) => [...prev, question]);
          }
        }
      }
    };
    fetch();
  }, [isClickedCheck]);

  const handleAudioPlay = () => {
    if (contentDetails[0]?.attributes?.audio) {
      TextToSpeech(contentDetails[0]?.attributes?.audio);
    }
  };
  useEffect(() => {
    if(questionDetails?.toolTip){
      let titleWithToolTip = addTooltipsToTitle(questionDetails?.title, questionDetails?.toolTip);
      setUpdatedTitle(titleWithToolTip)
    }
    else{
      setUpdatedTitle(questionDetails?.title)
    }
  }, [questionDetails?.title, questionDetails?.toolTip])
  return (
    <div className={`max-w-3xl mx-auto px-4 py-4`}>
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
        <div className=" text-lg font-semibold text-gray-700 mb-4">
          {questionDetails?.mediaTypes?.text && <div dangerouslySetInnerHTML={{ __html: updatedTitle }} />}
        </div>
      </div>
      {questionDetails?.mediaTypes?.audio && (
        <div className="mb-5">
          <Button variant="outlined" className="bg-lavender-600 p-4">
            <FaVolumeUp
              className="text-white cursor-pointer"
              size={18}
              onClick={handleAudioPlay}
            />
          </Button>
        </div>
      )}
      {/* Display selected clauses */}
      <div
        className={`bg-lavender-100 rounded-lg p-3 mb-4 flex flex-wrap gap-2 ${
          selectedClauses.length ? "" : "min-h-[4rem]"
        }`}
        dir={questionDetails?.language === "Arabic" ? "rtl" : "ltr"}
      >
        {selectedClauses.map((selectedClause) => (
          <span
            key={selectedClause.id}
            className="bg-lavender-600 text-white font-bold px-5 py-2 border-4 border-lavender-300 rounded-lg cursor-pointer"
            onClick={() =>
              handleClick(
                selectedClause.id,
                selectedClause.title,
                selectedClause.sequence
              )
            }
          >
            {selectedClause.title}
          </span>
        ))}
        {/* If no clauses are selected, this space will maintain the minimum height */}
        {selectedClauses.length === 0 && (
          <div className="text-center w-full text-gray-500"></div>
        )}
      </div>
      {/* Grid for selectable clauses */}
      <div
        className="grid grid-cols-3 gap-2"
        dir={questionDetails?.language === "Arabic" ? "rtl" : "ltr"}
      >
        {sentenceData.map((data) => (
          <div
            key={data.id}
            onClick={() => handleClick(data.id, data.title, data.sequence)}
            className={`flex items-center justify-center h-12 rounded-lg cursor-pointer ${
              selectedClauses.some((clause) => clause.id === data.id)
                ? "bg-lavender-300 border-none text-transparent hover:bg-lavender-600"
                : "bg-lavender-600 text-white"
            }`}
          >
            {selectedClauses.some((clause) => clause.id === data.id)
              ? null
              : data.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordMaking;
