import { QUESTION_TYPES } from "@/constants/questionTypes";
import MCQQuestion from "../MCQQuestion/MCQQuestion";
import SentenceMaking from "../SentenceMaking/SentenceMaking";
import TrueFalseQuestion from "../TrueFalseQuestion/TrueFalseQuestion";
import MCQWithImage from "../MCQWithImage/MCQWithImage";
import LearnQuestion from "../LearnQuestion/LearnQuestion";
import WordMaking from "../WordMaking/WordMaking";
import FITBQuestion from "../FITBQuestion/FITBQuestion";
import { useEffect, useState } from "react";
import { getQuestionDetails } from "@/utils/questionDeatils";
import Loader from "@/components/Loader";
import MatchingQuestion from "../MatchingQuestion/MatchingQuestion";

export const QuestionRenderer = ({
  question,
  options,
  languageDetails,
  contentDetails,
  setCorrectAns,
  setIsCorrectAns,
  isClickedCheck,
  setNoOfCorrectAns,
  correctAns,
  setIsSelected,
  setIncorrectQuestions,
  setQuestions,
  isRepeatedQuestion,
  fetchTranslatedTitle,
  gamificationTxData,
  isExamLesson,
  setIsClickedCheck
}) => {
  // Determine the type of question and render the appropriate component
  console.log("question", question);
  console.log("options", options);
  console.log(question?.attributes?.question_content?.data?.attributes?.question_type
    ?.data?.attributes?.title);
  const questionId = question?.attributes.question_content.data.id;
  let questionOptions = options[questionId];
  let contentDetailsData = contentDetails[questionId];
  const questionTitle = question?.attributes.question_content.data?.attributes?.questions?.data[0]?.attributes?.question;
  const [questionDetails, setQuestionDetails] = useState(null);

  console.log(questionDetails);
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      const details = await getQuestionDetails(question, fetchTranslatedTitle);
      setQuestionDetails(details);
    };

    fetchQuestionDetails();
  }, [fetchTranslatedTitle, question]);
  if (!questionDetails) {
    return <div><Loader/></div>;
  }
  switch (
  question?.attributes?.question_content?.data?.attributes?.question_type
    ?.data?.attributes?.title
  ) {
    case QUESTION_TYPES.MCQ:
      return (
        <MCQQuestion
          options={questionOptions}
          setIsSelected={setIsSelected}
          contentDetailsData={contentDetailsData}
          setIsCorrectAns={setIsCorrectAns}
          isClickedCheck={isClickedCheck}
          setNoOfCorrectAns={setNoOfCorrectAns}
          setCorrectAns={setCorrectAns}
          setIncorrectQuestions={setIncorrectQuestions}
          setQuestions={setQuestions}
          question={question}
          isRepeatedQuestion={isRepeatedQuestion}
          questionDetails={questionDetails}
          gamificationTxData = {gamificationTxData}
          isExamLesson= {isExamLesson}
          isFillInTheBlank = {false}
        />
      );
    case QUESTION_TYPES.FILL_IN_THE_BLANK:
      return (
        <MCQQuestion
        options={questionOptions}
        setIsSelected={setIsSelected}
        contentDetailsData={contentDetailsData}
        setIsCorrectAns={setIsCorrectAns}
        isClickedCheck={isClickedCheck}
        setNoOfCorrectAns={setNoOfCorrectAns}
        setCorrectAns={setCorrectAns}
        setIncorrectQuestions={setIncorrectQuestions}
        setQuestions={setQuestions}
        question={question}
        isRepeatedQuestion={isRepeatedQuestion}
        questionDetails={questionDetails}
        gamificationTxData = {gamificationTxData}
        isExamLesson= {isExamLesson}
        isFillInTheBlank = {true}
      />
        // <FITBQuestion
        //   options={questionOptions}
        //   setIsSelected={setIsSelected}
        //   contentDetailsData={contentDetailsData}
        //   setIsCorrectAns={setIsCorrectAns}
        //   isClickedCheck={isClickedCheck}
        //   setNoOfCorrectAns={setNoOfCorrectAns}
        //   setCorrectAns={setCorrectAns}
        //   setIncorrectQuestions={setIncorrectQuestions}
        //   setQuestions={setQuestions}
        //   question={question}
        //   audioEnable={true}
        //   isRepeatedQuestion={isRepeatedQuestion}
        //   questionDetails={questionDetails}
        //   gamificationTxData = {gamificationTxData}
        //   isExamLesson= {isExamLesson}
        // />
      );
    case (QUESTION_TYPES.PAIR_MATCHING):
      return (
        <MatchingQuestion
          setIsSelected={setIsSelected}
          setIsCorrectAns={setIsCorrectAns}
          isClickedCheck={isClickedCheck}
          setNoOfCorrectAns={setNoOfCorrectAns}
          isRepeatedQuestion={isRepeatedQuestion}
          questionDetails={questionDetails}
          gamificationTxData = {gamificationTxData}
          isExamLesson= {isExamLesson}
        />
      );
    case QUESTION_TYPES.SENTENCE_MAKING:
      return (
        <SentenceMaking
          questionTitle={questionTitle}
          questionContentId={questionId}
          setIsSelected={setIsSelected}
          contentDetails={contentDetailsData}
          setIsCorrectAns={setIsCorrectAns}
          isClickedCheck={isClickedCheck}
          setNoOfCorrectAns={setNoOfCorrectAns}
          setCorrectAns={setCorrectAns}
          setIncorrectQuestions={setIncorrectQuestions}
          setQuestions={setQuestions}
          question={question}
          isRepeatedQuestion={isRepeatedQuestion}
          questionDetails={questionDetails}
          gamificationTxData = {gamificationTxData}
          isExamLesson= {isExamLesson}
        />
      );
    case QUESTION_TYPES.WORD_MAKING:
      return (
        <WordMaking
          questionTitle={questionTitle}
          questionContentId={questionId}
          setIsSelected={setIsSelected}
          contentDetails={contentDetailsData}
          setIsCorrectAns={setIsCorrectAns}
          isClickedCheck={isClickedCheck}
          setNoOfCorrectAns={setNoOfCorrectAns}
          setCorrectAns={setCorrectAns}
          setIncorrectQuestions={setIncorrectQuestions}
          setQuestions={setQuestions}
          question={question}
          isRepeatedQuestion={isRepeatedQuestion}
          questionDetails={questionDetails}
          gamificationTxData = {gamificationTxData}
          isExamLesson= {isExamLesson}
        />
      );
    case QUESTION_TYPES.TRUE_OR_FALSE:
      return (
        <TrueFalseQuestion
          questionTitle={questionTitle}
          setIsSelected={setIsSelected}
          setIsCorrectAns={setIsCorrectAns}
          isClickedCheck={isClickedCheck}
          setNoOfCorrectAns={setNoOfCorrectAns}
          setCorrectAns={setCorrectAns}
          setIncorrectQuestions={setIncorrectQuestions}
          setQuestions={setQuestions}
          question={question}
          isRepeatedQuestion={isRepeatedQuestion}
          questionDetails={questionDetails}
          gamificationTxData={gamificationTxData}
          isExamLesson={isExamLesson}
        />
      );
    case QUESTION_TYPES.LEARN:
      let learnContentLanguageData = languageDetails[questionId];
      return (
        <LearnQuestion
          questionTitle={questionTitle}
          setIsSelected={setIsSelected}
          contentDetailsData={contentDetailsData}
          setIsCorrectAns={setIsCorrectAns}
          isClickedCheck={isClickedCheck}
          setNoOfCorrectAns={setNoOfCorrectAns}
          setCorrectAns={setCorrectAns}
          contentLanguageData={learnContentLanguageData}
          isRepeatedQuestion={isRepeatedQuestion}
          questionDetails={questionDetails}
          setIsClickedCheck = {setIsClickedCheck}
        />
      );
    default:
      return <div>Question type not supported</div>;
  }
};