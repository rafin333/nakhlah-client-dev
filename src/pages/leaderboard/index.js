import React, { useEffect, useState } from "react";
// import { FaExclamationTriangle } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { TRANSLATION_NAMESPACES_LIST } from "@/constants/translationNamespaces";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Header from "./Header";
import LeaderBoard from "./Leaderboard";
import { useGetLearnerProgressQuery } from "@/redux/features/learnerProgress/learnerProgress";
import { useGetLearningJourneyLessonsQuery } from "@/redux/features/learningJourney/learningJourneyApi";
import Loader from "@/components/Loader";
import { useGetExamsQuery } from "@/redux/features/exam/examAPI";
import LeaderBoardEligibility from "@/utils/leaderBoardEnable";
import {
  useGetTopTenUserQuery,
  useGetUserLeaderboardPositionQuery,
} from "@/redux/features/larnerGamification/larnerGamificationAPI";

const LeaderboardDisabled = () => {
  return (
    <div 
        className="flex flex-row items-center justify-center h-64 text-white rounded-lg shadow-lg p-6 w-full bg-opacity-80 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(203, 143, 21, 0.8)" }}
    >
        <FaLock className="text-yellow-400 text-6xl mr-4" />
        <div className="flex flex-col text-gray-700">
            <h2 className="block antialiased font-sans text-inherit font-extrabold text-4xl mb-2">
                Leaderboard Locked!!!
            </h2>
            <p className="text-gray-700 text-xl">
                The leaderboard feature is currently not enabled. Complete more tasks to unlock.
            </p>
        </div>
    </div>
);



};

function LeaderBoardUser() {
    const [users, setUsers] = useState([]);
    const [leaderboardEnable, setLeaderboardEnable] = useState(false);
    const [currentUserPosition, setCurrentUserPosition] = useState([]);

    const userInfo = JSON.parse(
        sessionStorage.getItem("userInfo")
            ? sessionStorage.getItem("userInfo")
            : localStorage.getItem("userInfo")
    );

    const query = {
        populate: "*",
        "sort[0]": "id:asc",
    };

    const { data: learnerProgress } = useGetLearnerProgressQuery({ ...query });
    const { data: lessonData, isLoading: lessonLoading } =
        useGetLearningJourneyLessonsQuery({ ...query });
    const { data: examInfo } = useGetExamsQuery({ ...query });
    const { data: TopTen } = useGetTopTenUserQuery({ ...query });
    const { data: UserPosition } = useGetUserLeaderboardPositionQuery({
        ...query,
    });

    const progressId = learnerProgress?.[learnerProgress.length - 1]?.progressId;

    useEffect(() => {
        const le = LeaderBoardEligibility(progressId, lessonData, examInfo);
        setLeaderboardEnable(le);
        setUsers(TopTen);
        setCurrentUserPosition([UserPosition]);
    }, [progressId, lessonData, examInfo, TopTen, UserPosition]);

    return (
        <div className="appLB">
            {lessonLoading ? (
                <Loader />
            ) : leaderboardEnable ? (
                <>
                    <Header currentUserPosition={currentUserPosition} />
                    <LeaderBoard users={users} currentUserPosition={currentUserPosition} userInfo={userInfo} />
                </>
            ) : (
              <>
                <LeaderboardDisabled />
                </>
            )}
        </div>
    );
}

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, TRANSLATION_NAMESPACES_LIST)),
        },
    };
}

export default LeaderBoardUser;
