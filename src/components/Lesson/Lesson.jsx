import React, { useState, useEffect } from "react";
import LessonComplete from "../LessonComplete/LessonComplete";
import { useRouter } from "next/router";
import Loader from "../Loader";
import { useGetJourneyMapQuestionContentsQuery } from "@/redux/features/journeyMapQuestionContents/journeyMapQuestionContentsApi";
import { useGetQuestionContentOptionsQuery } from "@/redux/features/questionContentOptions/questionContentOptionsApi";
import {
  useGetContentDetailsByLanguagesQuery,
  useGetContentDetailsQuery,
} from "@/redux/features/contentDetails/contentDetailsApi";
import ProgressBar from "../ProgressBar/ProgressBar";
import ControlPanel from "../ControlPanel/ControlPanel";
import { QuestionRenderer } from "../Question/QuestionRenderer/QuestionRenderer";
import { useGetQuestionDetailsQuery } from "@/redux/features/questionDeatils/questionDetailsApi";
import _ from "lodash";
import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
import { QUESTION_TYPES } from "@/constants/questionTypes";
import Modal from "../Modals/Modal";
import PalmStockModal from "../PalmStockModal/PalmStockModal";
import { useGetLearnerGamificationStockQuery } from "@/redux/features/gamification/gamificationAPI";
import { useDispatch } from "react-redux";
import { useSoundEffects } from "@/hooks/useSoundEffects";

import { dates, injaz, palm } from "@/redux/state/gemificationSlice";
import { getBaseURL } from "@/helpers/config/envConfig";

const Lesson = ({ lesson }) => {
  const { playClick, playCorrect, playWrong } = useSoundEffects();
  const LGSquery = {
    populate: "*",
  };

  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [selectedOption, setSelectedOption] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [options, setOptions] = useState({});
  const [languageDetails, setLanguageDetails] = useState({});
  const [contentDetails, setContentDetails] = useState({});
  const [isCorrectAns, setIsCorrectAns] = useState(null);
  const [isClickedCheck, setIsClickedCheck] = useState(false);
  const [correctAns, setCorrectAns] = useState(null);
  const [noOfCorrectAns, setNoOfCorrectAns] = useState(0);
  const [timeCount, setTimeCount] = useState("");
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [initialTotalQuestions, setInitialTotalQuestions] = useState(0);
  const [isRepeatedQuestion, setIsRepeatedQuestion] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


  // Determine current question type safely
  const currentQuestion = questions?.[step - 1];
  const currentQuestionType = currentQuestion?.attributes?.question_content?.data?.attributes?.question_type?.data?.attributes?.title;

  console.log(isSelected);
  console.log(isCorrectAns);

  console.log(step, noOfCorrectAns);
  // console.log(incorrectQuestions.length);
  // console.log(initialTotalQuestions);
  const isExamLesson = lesson.startsWith("exam-");
  const examLevelId = isExamLesson ? lesson.split("-")[1] : null;

  // ... (keeping existing query definitions omitted for brevity if needed, but here replacing block so keeping them)
  const journeyMapQuestionContentsQuery = {
    "populate[learning_journey_lesson][populate][learning_journey_level][populate][learning_journey_unit][populate][0]":
      "learning_journey",
    "populate[question_content][populate][questions][populate]": "*",
    "populate[question_content][populate][contents][populate][image][populate][content_details][populate]":
      "*",
    "populate[question_content][populate][question_type][populate]": "*",
    "populate[question_content][populate][question_content_option][populate][contents][populate][content_details][populate]":
      "*",
    "populate[question_content][populate][arabic_tx_type][populate]": "*",
    "populate[question_content][populate][language][populate]": "*",
    "populate[question_content][populate][contents][populate][content_details][populate]":
      "*",
    "populate[question_content][populate][question_content_option][populate][contents][populate][image][populate][content_details][populate]":
      "*",
    "sort[0]": "sequence:asc",
  };

  if (isExamLesson) {
    journeyMapQuestionContentsQuery[
      "filters[learning_journey_lesson][learning_journey_level][id][$eq]"
    ] = examLevelId;
  } else {
    journeyMapQuestionContentsQuery[
      "filters[learning_journey_lesson][id][$eq]"
    ] = lesson;
  }
  const query = {
    populate: "*",
    "pagination[pageSize]": 999999,
  };
  const { data, isLoading, isError } = useGetJourneyMapQuestionContentsQuery({
    ...journeyMapQuestionContentsQuery,
  });
  const { data: questionContentOptionsData } =
    useGetQuestionContentOptionsQuery({ ...query });
  const { data: contentDetailsData } = useGetContentDetailsQuery({ ...query });
  const { data: questionDetailsData } = useGetQuestionDetailsQuery({
    ...query,
  });
  const { data: contentDetailsByLanguagesData } =
    useGetContentDetailsByLanguagesQuery({ ...query });
  const { data: gamificationTxData } = useGetGamificationTxesQuery({});
  const { data: LGameInfo, isLoading: GameLoading } =
    useGetLearnerGamificationStockQuery({ ...LGSquery }); /// Check Palm, Dates, Injaz
  console.log(isLoading, LGameInfo);

  ///////////---------------- After a certain time quest complete -------------- /////////////////////

  const num_palm = LGameInfo?.find(
    (x) => x?.gamification_type?.typeName === "Palm"
  );

  const num_dates = LGameInfo?.find(
    (x) => x?.gamification_type?.typeName === "Date"
  );

  const num_injaz = LGameInfo?.find(
    (x) => x?.gamification_type?.typeName === "Injaz"
  );

  useEffect(() => {
    // dispatch(loading(GameLoading));
    dispatch(palm(num_palm));
    dispatch(dates(num_dates));
    dispatch(injaz(num_injaz));
  }, [LGameInfo, isClickedCheck]);

  useEffect(() => {
    if (isClickedCheck && currentQuestionType !== QUESTION_TYPES.LEARN) {
      if (isCorrectAns === true) {
        playCorrect();
      } else if (isCorrectAns === false) {
        playWrong();
      }
    }
  }, [isClickedCheck, isCorrectAns, playCorrect, playWrong, currentQuestionType]);

  useEffect(() => {
    const preloadImage = (url) => {
      if (!url) return;

      const fullUrl = url.startsWith("http")
        ? url
        : `${getBaseURL()}${url}`;

      const img = new Image();
      img.src = fullUrl;
    };

    if (!loading && questions?.length > 0) {
      // Preload question images (Learn type)
      questions.forEach((q) => {
        const questionImage =
          q?.attributes?.question_content?.data?.attributes?.questions?.data[0]
            ?.attributes?.image?.data?.attributes?.url;
        if (questionImage) {
          preloadImage(questionImage);
        }
      });

      // Preload option images (MCQ, etc.)
      if (contentDetails) {
        Object.values(contentDetails).forEach((detailsArray) => {
          if (Array.isArray(detailsArray)) {
            detailsArray.forEach((detail) => {
              const thumbnailUrl =
                detail?.attributes?.image?.data?.attributes?.formats?.thumbnail
                  ?.url;
              const fullImageUrl =
                detail?.attributes?.image?.data?.attributes?.url;

              if (thumbnailUrl) preloadImage(thumbnailUrl);
              if (fullImageUrl) preloadImage(fullImageUrl);
            });
          }
        });
      }
    }
  }, [loading, questions, contentDetails]);

  useEffect(() => {
    const fetchData = () => {
      if (data && isExamLesson) {
        const numberOfQuestions =
          data[0]?.attributes?.learning_journey_lesson?.data?.attributes
            ?.learning_journey_level?.data?.attributes?.numberOfQuestions;
        const filterDataWithoutLearn = data.filter(
          (d) =>
            d?.attributes?.question_content?.data?.attributes?.question_type
              ?.data?.attributes?.title !== QUESTION_TYPES.LEARN
        );
        const randomSample = _.sampleSize(
          filterDataWithoutLearn,
          numberOfQuestions || 10
        );
        setQuestions(randomSample);
        setInitialTotalQuestions(randomSample?.length);
      } else {
        setQuestions(data);
        setInitialTotalQuestions(data?.length);
      }
      const fetchedOptions = {};
      const fetchedContentLanguages = {};
      const fetchedContentDetails = {};
      if (data?.length > 0) {
        data.forEach((questionContent) => {
          console.log(
            questionContent.attributes.question_content.data?.attributes
              ?.contents?.data[0]?.id
          );
          const questionContentId =
            questionContent?.attributes?.question_content?.data?.id;
          if (questionContentId) {
            const optionsData = questionContentOptionsData?.filter(
              (option) =>
                option?.attributes?.question_content?.data?.id ===
                questionContentId
            );
            if (optionsData) {
              const optionsInfo =
                optionsData[0]?.attributes?.contents?.data ?? [];
              const [contentLanguageDataArr, contentDetailsDataArr] =
                optionsInfo.reduce(
                  ([languagesAcc, detailsAcc], contentData) => {
                    // Ensure filteredLanguageDetails and filteredContentDetails are arrays
                    const filteredLanguageDetails =
                      contentDetailsByLanguagesData?.filter(
                        (languageDetail) =>
                          languageDetail?.attributes?.content?.data?.id ===
                          contentData?.id
                      ) || []; // Default to an empty array if filter results in falsy

                    const filteredContentDetails =
                      contentDetailsData?.filter(
                        (contentDetail) =>
                          contentDetail?.attributes?.content?.data?.id ===
                          contentData?.id
                      ) || []; // Default to an empty array if filter results in falsy

                    return [
                      [...languagesAcc, ...filteredLanguageDetails],
                      [...detailsAcc, ...filteredContentDetails],
                    ];
                  },
                  [[], []]
                );
              const questionContentIdDetails =
                questionContent.attributes.question_content.data?.attributes
                  ?.content?.data?.id;
              if (questionContentIdDetails) {
                const filteredLanguageDetailsDataForQuestionContent =
                  contentDetailsByLanguagesData
                    ? contentDetailsByLanguagesData.filter(
                      (languageDetail) =>
                        languageDetail?.attributes?.content?.data?.id ===
                        questionContentIdDetails
                    )
                    : [];
                const filteredContentDetailsDataForQuestionContent =
                  contentDetailsData
                    ? contentDetailsData.filter(
                      (contentDetail) =>
                        contentDetail?.attributes?.content?.data?.id ===
                        questionContentIdDetails
                    )
                    : [];
                contentLanguageDataArr.push(
                  ...filteredLanguageDetailsDataForQuestionContent
                );
                contentDetailsDataArr.push(
                  ...filteredContentDetailsDataForQuestionContent
                );
              }
              // Assign aggregated data to temporary objects
              fetchedOptions[questionContentId] =
                fetchedOptions[questionContentId] || [];
              fetchedOptions[questionContentId] = [
                ...fetchedOptions[questionContentId],
                ...optionsInfo,
                // Adding the questionContent's own details as a new entry in the options
                {
                  id: questionContent.attributes.question_content.data
                    ?.attributes?.contents?.data[0]?.id,
                  attributes: {
                    title:
                      questionContent.attributes?.question_content.data
                        ?.attributes?.contents?.data[0]?.attributes?.title,
                    createdAt:
                      questionContent.attributes.question_content.data
                        .attributes.contents?.data[0]?.attributes?.createdAt,
                    updatedAt:
                      questionContent.attributes.question_content.data
                        .attributes.contents?.data[0]?.attributes?.updatedAt,
                    isRightAns: true, // Ensure you adjust this based on your logic or data
                  },
                },
              ];

              fetchedContentLanguages[questionContentId] =
                contentLanguageDataArr;
              fetchedContentDetails[questionContentId] = contentDetailsDataArr;
            }
          }
        });

        // Update state with fetched data
        setOptions(fetchedOptions);
        setContentDetails(fetchedContentDetails);
        setLanguageDetails(fetchedContentLanguages);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    data,
    questionContentOptionsData,
    contentDetailsData,
    contentDetailsByLanguagesData,
    isExamLesson,
  ]);

  useEffect(() => {
    console.log(step, initialTotalQuestions, step > initialTotalQuestions);
    if (step > initialTotalQuestions) {
      setIsRepeatedQuestion(true);
    } else {
      setIsRepeatedQuestion(false);
    }
  }, [initialTotalQuestions, step]);

  const handleCheck = () => {
    if (!isSelected) {
      return;
    }
    setIsSelected(false); // Reset selected option for the next question
    setIsClickedCheck(true);
  };

  const handleContinue = () => {
    playClick();
    setIsSelected(false); // Reset selected option for the next question
    setIsClickedCheck(false);
    setCorrectAns(null);
    setIsCorrectAns(null);
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep("complete"); // Complete the lesson
    }
  };

  const fetchTranslatedTitle = async (questionId, language) => {
    // Call your API to get the translated title
    // Replace with actual API call
    const questionDetailsFilteredData = questionDetailsData.filter(
      (questionDetail) =>
        questionDetail?.attributes?.question?.data?.id == questionId
    );
    const questionDetailsWithLanguage = questionDetailsFilteredData.find(
      (questionDetail) =>
        questionDetail?.attributes?.language?.data?.attributes?.name == language
    );
    console.log(questionDetailsWithLanguage);
    return questionDetailsWithLanguage;
  };

  const handleSkipStep = () => {
    if (questions) {
      if (step < questions.length) {
        let questionType =
          questions[step - 1]?.attributes?.question_content?.data?.attributes
            ?.question_type?.data?.attributes?.title;
        if (!isExamLesson) {
          setIncorrectQuestions((prev) => [...prev, questions[step - 1]]);
          setQuestions((prev) => [...prev, questions[step - 1]]);
        }
        if (questionType === QUESTION_TYPES.LEARN) {
          setIsSelected(false);
        }
        setStep(step + 1);
      } else {
        setStep("complete");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your submission logic here
    // console.log("Selected option: ", selectedOption);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;
  const handleCrossClick = () => {
    router.push(`/learn`);
  };

  const handleTimeCount = (x) => {
    setTimeCount(x);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <ProgressBar
        step={step}
        correctAns={noOfCorrectAns}
        totalSteps={questions?.length}
        totalInitialSteps={initialTotalQuestions}
        handleCrossClick={handleCrossClick}
        timeCount={handleTimeCount}
        setShowModal={setShowModal}
        isClickedCheck={isClickedCheck}
      />
      {questions?.length > 0 ? (
        <>
          {step === "complete" ? (
            // Completion UI
            <LessonComplete
              percentage={(noOfCorrectAns / questions.length) * 100}
              correctAnsw={noOfCorrectAns}
              timeCount={timeCount}
              lesson={lesson}
              isExamLesson={isExamLesson}
              noOfCorrectAns={noOfCorrectAns}
              numberOfQuestions={questions.length}
              examLevelId={examLevelId}
            />
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <QuestionRenderer
                  question={questions[step - 1]}
                  options={options}
                  languageDetails={languageDetails}
                  contentDetails={contentDetails}
                  setCorrectAns={setCorrectAns}
                  setIsCorrectAns={setIsCorrectAns}
                  isClickedCheck={isClickedCheck}
                  setIsClickedCheck={setIsClickedCheck}
                  setNoOfCorrectAns={setNoOfCorrectAns}
                  correctAns={correctAns}
                  setIsSelected={setIsSelected}
                  setIncorrectQuestions={setIncorrectQuestions}
                  setQuestions={setQuestions}
                  isRepeatedQuestion={isRepeatedQuestion}
                  fetchTranslatedTitle={fetchTranslatedTitle}
                  gamificationTxData={gamificationTxData}
                  isExamLesson={isExamLesson}
                />
                <ControlPanel
                  step={step}
                  totalSteps={questions?.length}
                  isCorrectAns={isCorrectAns}
                  isClickedCheck={isClickedCheck}
                  isSelected={isSelected}
                  correctAns={correctAns}
                  handleSkipStep={handleSkipStep}
                  handleCheck={handleCheck}
                  handleContinue={handleContinue}
                  question={questions ? questions[step - 1] : null}
                  playClick={playClick}
                />
              </form>

              {showModal && (
                <Modal>
                  <PalmStockModal setShowModal={setShowModal} />
                </Modal>
              )}
            </>
          )}
        </>
      ) : (
        isLoading ?
          <>
            Loading...
          </>
          :
          <>
            {
              "Sorry! No question available for this lesson. Please comeback later."
            }
          </>
      )}
    </div>
  );
};

export default Lesson;
