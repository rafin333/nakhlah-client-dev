import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { getUserInfo } from "@/services/auth.service";
import { useGetLearnerInfosQuery } from "@/redux/features/learnerInfos/learnerInfosApi";
import Login from "@/components/Login/login";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
import Loader from "@/components/Loader";
export default function Home() {
  const query = {
    populate:'*'
  }
  const router = useRouter();
  const {learnerInfoData} = useGetLearnerInfosQuery({...query})
  
  useEffect(() => {
    console.log(learnerInfoData);

    const fetchLearnerInfo = async () => {
      const token = getUserInfo();
      // If there's no token, redirect to login
      if (!token) {
        router.push('/');
        return;
      }
      // If there is a token, check for learner info
      try {
        // If learner info is empty, redirect to query
        if (!learnerInfoData || learnerInfoData === undefined) {
          router.push('/query');
        } else {
          // If learner info exists, redirect to learn
          router.push('/learn');
        }
      } catch (error) {
        console.error('Failed to fetch learner info:', error);
        // Handle failure (e.g., by showing an error message or redirecting to an error page)
      }
    };

    fetchLearnerInfo();
  }, [learnerInfoData, router]);

  // This will be shown briefly before redirection
  return (
    <>
      <div>
        <Loader/>
        <p>
          Loading...
        </p>
      </div>
      {/* <Login /> */}
    </>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
      // Will be passed to the page component as props
    },
  };
}
