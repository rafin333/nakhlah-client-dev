import React, { useEffect, useState } from "react"; // React
// Assuming the import paths are correct and components are implemented to accept props as needed
import CurrentCapacity from "@/components/QueryScreen/CurrentCapacity/CurrentCapacity"; // Current capacity component 
import LanguageSelector from "@/components/QueryScreen/LanguageSelector/LanguageSelector"; // Language selector component
import LearningGoalSelector from "@/components/QueryScreen/LearningGoalSelector/LearningGoalSelector"; // Learning goal component
import LearningPurpose from "@/components/QueryScreen/LearningPurpose/LearningPurpose"; // Learning purpose component
// import Sidebar from "@/components/Sidebar";
// import withAuth from "@/components/withAuth";
import { useRouter } from "next/router"; // Next.js router
// import LearningInfoDetails from "@/components/LearninginfoDetails/LearningInfoDetails";
import {
  useAddLearnerInfosMutation,
  useGetLearnerInfosQuery,
} from "@/redux/features/learnerInfos/learnerInfosApi"; // Learner info API
import { serverSideTranslations } from "next-i18next/serverSideTranslations"; // Server side translations
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces"; // List of translation namespaces
import RegisterForm from "@/components/Register/Register"; // Register form component
import { toast } from "react-toastify"; // Toast notification library
import SocialTrafficSelector from "@/components/QueryScreen/SocialTrafficSelector/SocialTrafficSelector"; // Social traffic selector component
// import PrivacyPolicyCheck from "@/components/QueryScreen/PrivacyPolicyTnC/PrivacyPolicyTnC";
import Loader from "@/components/Loader"; // Loader component to show loading state
import {
  getFromLocalStorage,
  getFromSessionStorage,
} from "@/utils/local-storage"; // Local storage utility functions
const QueryPage = () => {
  const query = {
    populate: "*",
  }; // Query object for fetching learner info

  const [localToken, setLocalToken] = useState(null); // Local token state

  const token = getFromLocalStorage("accessToken");   // Get token from local storage
  const sessionToken = getFromSessionStorage("accessToken"); // Get token from session storage

  const router = useRouter(); // Router object
  const [step, setStep] = useState(1); // Manage the step of the query process

  useEffect(() => {
    setLocalToken(
      token !== null
        ? getFromLocalStorage("accessToken")
        : sessionToken !== null
        ? getFromSessionStorage("accessToken")
        : null
    );
    setStep(
      Number((router?.query?.page || token !== null || sessionToken !== null) ? 2 : 1)
    );
  }, [token, sessionToken, router?.query?.page]); // Set the local token and step based on the token and query params

  useEffect(() => {
    console.log(
      router?.query?.page || token !== null || sessionToken !== null ? 2 : 1
    );

    console.log(localToken);
  }, [token, sessionToken, router?.query?.page, localToken]);

  const [selections, setSelections] = useState({
    learningPurpose: null,
    language: null,
    learningGoal: null,
    social_traffic: null,
    userJWT: localToken,
  });

  useEffect(() => {
    if (router?.query?.page || token !== null || sessionToken !== null) {
      // setStep(parseInt(router.query.page));
      setSelections((prev) => ({ ...prev, userJWT: localToken }));
    }
  }, [router.query.page, localToken]);

  // console.log(selections);
  const [hasLearnerInfo, setHasLearnerInfo] = useState(false);
  const [learnerInfos, setLearnerInfos] = useState([]);
  const { data } = useGetLearnerInfosQuery({ ...query });
  const [addLearnerInfos] = useAddLearnerInfosMutation();

  useEffect(() => {
    // Fetch learner info to determine the component to render
    const fetchLearnerInfo = async () => {
      if (data && data.length > 0) {
        setHasLearnerInfo(true);
        setLearnerInfos(data);
        router.push("/learn");
      }
    };

    fetchLearnerInfo();
  }, [data, router]);

  useEffect(() => {
    sessionStorage.setItem("userInfo", JSON.stringify(selections));
    localStorage.setItem("userInfo", JSON.stringify(selections));
    // saveData(selections)
  }, [selections]);

  // Function to move to the next step and optionally update selections
  const nextStep = (data) => {
    console.log(data);
    setSelections((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  useEffect(() => {
    if (step === 7) {
      submitData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  // Function to submit the final data
  const submitData = async () => {
    console.log(selections);
    const learnerInfoData = {
      learning_purpose: { connect: [selections.learningPurpose] },
      country: { connect: [selections.country] },
      // Other fields as necessary
      learning_goal: { connect: [selections.learningGoal] },
      social_traffic: { connect: [selections.social_traffic] },
      learning_journey: { connect: [selections.learning_journey] },
      termsAndConditions: true,
      // registered:
    };
    console.log("Callback Data ==> ", learnerInfoData, selections.userJWT);

    if (selections.userJWT) {
      try {
        const response = await addLearnerInfos({ ...learnerInfoData }).unwrap();
        console.log(response);

        router.push("/learn").then(() => window.location.reload());
      } catch (error) {
        console.error("Submission error", error);
        toast("Some error occured!");
      }
    }
  };

  return (
    <> 

    {/* {step} */}

      {hasLearnerInfo ? (
        <>
          {/* <LearningInfoDetails learnerInfos={learnerInfos} /> */}
          <Loader />
        </>
      ) : (
        <>
          {step === 1 && (
            <RegisterForm
              comesFrom={"LearnerInfo"}
              onContinue={(data) => nextStep({ userJWT: data })}
            />
          )}
          {step === 2 && (
            <LearningPurpose
              onContinue={(data) => nextStep({ learningPurpose: data })}
            />
          )}
          {step === 3 && (
            <LanguageSelector
              onContinue={(data) => nextStep({ country: data })}
            />
          )}
          {step === 4 && (
            <LearningGoalSelector
              onContinue={(data) => nextStep({ learningGoal: data })}
            />
          )}
          {step === 5 && (
            <CurrentCapacity
              onContinue={(data) => nextStep({ learning_journey: data })}
            />
          )}
          {/* {step === 6 && (
            <PrivacyPolicyCheck
            onContinue={(data) => nextStep({ privacy_policy : data })}
            />
            )} */}
          {step === 6 && (
            <SocialTrafficSelector
              onContinue={(data) => nextStep({ social_traffic: data })}
            />
          )}
          {step === 7 && <Loader />}
        </>
      )}
    </>
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
export default QueryPage;
