import Lesson from "@/components/Lesson/Lesson";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentLesson } from "@/services/lesson.service";
import Loader from "@/components/Loader";
import withAuth from "@/components/withAuth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
const LessonPage = () => {
  const { t, i18n } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const [lesson, setLesson] = useState(null);
  useEffect(() => {
    const fetchLesson = async () => {
      // Fetch lesson data here, assuming getCurrentLesson() is an async function
      const lessonData = await getCurrentLesson();
      setLesson(lessonData);
      setLoading(false);
    };

    fetchLesson();
  }, []);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        // Render Lesson component once lesson data is fetched
        <Lesson lesson={lesson} />
      )}
    </div>
  );
};
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
      // Will be passed to the page component as props
    },
  };
}
export default withAuth(LessonPage);
