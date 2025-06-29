// src/utils/getQuestionDetails.js

import { getLearnerInfo } from "@/services/learnerInfo.service";

export const getQuestionDetails = async (question, fetchTranslatedTitle) => {
  const questionContent = question?.attributes?.question_content?.data.attributes;
  console.log(question?.attributes?.question_content?.data?.id);
  // const questionContentId = question?.attributes?.question_content?.data?.id;
    const language = questionContent?.language?.data?.attributes?.language;
    let title = questionContent?.questions?.data[0]?.attributes?.question;
    console.log(title);
    let audio = questionContent?.questions?.data[0]?.attributes?.audio;
    let learnerInfo = await getLearnerInfo();
    learnerInfo = JSON.parse(learnerInfo);
    console.log(learnerInfo == {});
    if (learnerInfo?.language && learnerInfo?.language !== 'English') {
      const questionLanguageData = await fetchTranslatedTitle(questionContent?.questions?.data[0]?.id, learnerInfo?.language);
      title = questionLanguageData ? questionLanguageData?.attributes?.title : title ;
      audio = questionLanguageData ? questionLanguageData?.attributes?.audio : audio;
    }
    console.log(title);
  
    return {
      id: question?.attributes?.question_content?.data?.id,
      title,
      toolTip: questionContent?.questions?.data[0]?.attributes?.toolTip || undefined,
      mediaTypes: {
        text: questionContent?.questionText,
        image: questionContent?.questionImage,
        audio: questionContent?.questionAudio,
      },
      contentMediaTypes: {
        text: questionContent?.contentText,
        image: questionContent?.contentImage,
        audio: questionContent?.contentAudio,
      },
      language,
      audio: audio,
      arabic_tx_type: questionContent?.arabic_tx_type?.data?.attributes?.title,
      image: questionContent?.questions?.data[0]?.attributes?.image?.data?.attributes,
      questionContentOptions: questionContent?.question_content_option?.data?.attributes?.contents?.data,
      content: questionContent?.contents?.data[0]
    };
  };
  