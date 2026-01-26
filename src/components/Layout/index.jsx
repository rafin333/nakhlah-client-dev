/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import BottomNav from "../BottomNav/BottomNav";
import LeftSidebar from "../LeftSideBar/LeftSideBar";
import RightSidebar from "../RightSideBar";
import { useGetLearnerGamificationStockQuery } from "@/redux/features/gamification/gamificationAPI";
import { useGetSubscriptionsQuery } from "@/redux/features/subscriptions/subscriptions";
import { useDispatch } from "react-redux";
import {
  dates,
  injaz,
  loading,
  palm,
  dailyQuests,
} from "@/redux/state/gemificationSlice";
import { subPlan } from "@/redux/state/subscriptionSlice";
import { streaks } from "@/redux/state/streakSlice";
import { useGetLearnerStreaksQuery } from "@/redux/features/learnerStreaks/learnerStreaks";
import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import {
  useGetGamificationTxesQuery,
  useGetDailyQuestsQuery,
} from "@/redux/features/gamificationTxes/gamificationTxes";
import { useGetUserRegInfoQuery } from "@/redux/features/auth/authApi";
import { regUser } from "@/redux/state/userSlice";
import { useGetLearnerInfosQuery } from "@/redux/features/learnerInfos/learnerInfosApi";
import Loader from "../Loader";

const Layout = ({ children }) => {
  const { route } = useRouter();
  const router = useRouter();

  const dispatch = useDispatch();

  const handleLearnerGamification = useHandleLearnerGamification();
  const { data: gamificationTxData } = useGetGamificationTxesQuery({});
  const { data: dailyQuestData } = useGetDailyQuestsQuery({});
  const LGSquery = {
    populate: "*",
  };
  const { data: learnerInfoData, isLoading } = useGetLearnerInfosQuery({
    ...LGSquery,
  });

  useEffect(() => {
    if (!isLoading && (!learnerInfoData || learnerInfoData?.length === 0 || learnerInfoData === undefined)) {
      console.log(router.pathname);
      if (router.pathname === '/learn') { router.push("/query") }
      console.log(learnerInfoData);
    }
  }, [learnerInfoData, isLoading])

  const { data: LGameInfo, isLoading: GameLoading } =
    useGetLearnerGamificationStockQuery({ ...LGSquery }); /// Check Palm, Dates, Injaz
  const { data: subscriptionData } = useGetSubscriptionsQuery({ ...LGSquery }); /// Get Subscription Data
  const { data: learnerStreak } = useGetLearnerStreaksQuery({ ...LGSquery }); /// Get Streak Status
  const { data: regiUserInfo } = useGetUserRegInfoQuery({ ...LGSquery }); /// Get Registered User Profile Info
  // console.log(learnerStreak);
  // console.log(regiUserInfo);

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////---------------- After a certain time quest complete -------------- /////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////

  const MinSpendTime = 1; // Minimum time user need to spend
  const [timeSpent, setTimeSpent] = useState(0); // Track time in seconds
  console.log(timeSpent);

  async function giftUser(txName) {
    try {
      const res = await handleLearnerGamification(gamificationTxData, txName);

      // alert(JSON.stringify(res));
    } catch (error) {
      console.error("Error handling learner gamification:", error);
    }
  }

  useEffect(() => {
    // Timer to track min spend time
    if (timeSpent <= 60) {
      const SpendMinTime = setInterval(() => {
        setTimeSpent((prev) => {
          if (prev + 1 === MinSpendTime * 60) {
            // 15 minutes in seconds
            giftUser(TRANSACTION_NAMES.Spend_15_Minutes_Learning_Today);
            giftUser(TRANSACTION_NAMES.Meet_Your_Learning_Goal);
            clearInterval(SpendMinTime); // Stop the timer after the gift is awarded
          }
          return prev + 1;
        });
      }, 1000); // Increment every second

      return () => {
        clearInterval(SpendMinTime); // Cleanup on component unmount
      };
    }
  }, []);

  useEffect(() => {
    const txItems = [
      TRANSACTION_NAMES.Complete_Two_Lessons_Today,
      TRANSACTION_NAMES.Earn_50_XP_Today,
      TRANSACTION_NAMES.Practice_One_Lesson_You_Have_Learned,
      TRANSACTION_NAMES.Complete_A_Task,
      TRANSACTION_NAMES.Attend_An_Exam,
      TRANSACTION_NAMES.Spend_Some_Amount_Of_Dates_To_Purchase_Lives,
    ];

    txItems.forEach((x) => giftUser(x));
  }, [LGameInfo]);

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
    dispatch(loading(GameLoading));
    dispatch(palm(num_palm));
    dispatch(dates(num_dates));
    dispatch(injaz(num_injaz));
  }, [LGameInfo]);

  useEffect(() => {
    console.log(dailyQuestData);
    dispatch(dailyQuests(dailyQuestData));
  }, [dailyQuestData]);

  useEffect(() => {
    dispatch(streaks(learnerStreak));
  }, [learnerStreak]);

  useEffect(() => {
    dispatch(subPlan(subscriptionData));
  }, [subscriptionData]);

  useEffect(() => {
    dispatch(regUser(regiUserInfo));
  }, [regiUserInfo]);

  if (route === "/lesson" || route === "/auth/register" || route === "/query") {
    return (
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {children}
      </div>
    );
  } else {
    return (
      <>
        {(isLoading || GameLoading) && (
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        )}
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-1 sm:flex-row">
            <div className="hidden sm:block sm:w-1/6">
              <LeftSidebar />
            </div>
            <div className="flex-1">{children}</div>
            <div className="hidden sm:block sm:w-1/6">
              <RightSidebar />
            </div>
          </div>
          <div className="block sm:hidden">
            <BottomNav />
          </div>
        </div>
      </>
    );
  }
};

export default Layout;
