import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { AiTwotoneCloseCircle } from "react-icons/ai";
import ToastMessage from "../Toast";
import { useGetGamificationTxAmountsQuery } from "@/redux/features/gamificationTxAmount/gamificationTxAmount";
import {
  useGetLearnerGamificationsQuery,
  useGetLearnerGamificationsTXAmountQuery,
} from "@/redux/features/larnerGamification/larnerGamificationAPI";
import dayjs from "dayjs";
import Modal from "../Modals/Modal";
import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
import { useGetSubscriptionPlanQuery } from "@/redux/features/subscriptionPlans/subscriptionPlans";
import { useSelector } from "react-redux";

const PalmStockModal = ({ setShowModal }) => {

  const router = useRouter();

  const { isLoading, palmData, datesData, injazData } = useSelector(
    (state) => state.gamificationStore
  );
  const query = {
    populate: "*",
    "filters[gamification_tx][transactionName][$eq]":
      TRANSACTION_NAMES.PALM_REFILL_BY_DATES_LOSS,
  };
  const queryTXAmount = {
    populate: "*",
    gamification_tx: TRANSACTION_NAMES.PALM_REFILL_BY_DATES_LOSS,
  };
  const LGquery = {
    populate: "*",
    "sort[0]": "createdAt:desc",
  };
  const subscriptionQuery = {
    populate: "*",
  }; 
  const { data: gamificationTxData } = useGetGamificationTxesQuery({});
  // const { data: gamificationTxAmountsData } = useGetGamificationTxAmountsQuery({ ...query });
  const { data: gamificationTxAmountsData } =
    useGetLearnerGamificationsTXAmountQuery({ ...queryTXAmount });
  const { data: getLearnerGamificationData } = useGetLearnerGamificationsQuery({
    ...LGquery,
  });
  const { data: subscriptionPlanData } = useGetSubscriptionPlanQuery({
    ...subscriptionQuery,
  });
  const handleLearnerGamification = useHandleLearnerGamification();
  const [selectedOption, setSelectedOption] = useState(null);
  const [RefillEnable, setRefillEnable] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  console.log(gamificationTxAmountsData, datesData?.stock);
  const notify = useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);
  //  const route = useRouter()
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (getLearnerGamificationData && getLearnerGamificationData.length > 0) {
        console.log(getLearnerGamificationData[0]?.createdAt);
        const lastRefillTime = dayjs(getLearnerGamificationData[0]?.createdAt);
        const nextRefillTime = lastRefillTime.add(1, "hour");
        const now = dayjs();
        const diff = nextRefillTime.diff(now, "second");
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setTimeLeft(
          hours > 0
            ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
                2,
                "0"
              )}:${String(seconds).padStart(2, "0")}`
            : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
                2,
                "0"
              )}`
        );
      }
    };

    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [getLearnerGamificationData]);

  async function refill() {
    try {
      let response = await handleLearnerGamification(
        gamificationTxData,
        TRANSACTION_NAMES.PALM_REFILL_BY_DATES_LOSS
      );
      setShowModal(false);
    } catch (error) {
      notify("error", error?.data?.error?.message);
    }
  }

  const handleSelect = async (option) => {
    setSelectedOption(option);
  };
console.log(router.pathname)
  const handleClick = () => {
    setShowModal(false);
    if(router.pathname == '/lesson'){
      router.push("/learn");
    }
  };
  const handleCloseModal = () => {
    setIsSubscriptionModalVisible(false);
  };

  return (
    <div className="relative p-6 rounded-xl max-w-md w-full mx-auto">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold">
          You need palms to start new lessons!
        </h2>
        <p className="text-red-500">
          Next palms in <span className="font-bold">{timeLeft}</span>
        </p>
      </div>
      <div
        className={`mb-4 p-4 border border-lavender-300 rounded-lg flex items-center justify-between cursor-pointer ${
          selectedOption === "unlimited"
            ? "bg-lavender-800 text-white"
            : "bg-lavender-600 text-white"
        }`}
        onClick={() => router.push("/store")}
      >
        <div className="flex items-center">
          <Typography color="blue-gray" className="font-medium">
            <Image
              src={"/image/palm-tree.png"}
              width={25}
              height={25}
              alt="palm"
            />
          </Typography>
          <span className="ml-2 font-bold">Unlimited Palms</span>
        </div>
        <button className="text-blue-400 font-bold">GET SUPER</button>
      </div>
      <div
        className={`mb-4 p-4 border border-lavender-300 rounded-lg flex items-center justify-between cursor-pointer ${
          selectedOption === "refill"
            ? "bg-lavender-800 text-white"
            : "bg-lavender-600 text-white"
        }`}
        onClick={() => setRefillEnable(true)}
      >
        <div className="flex items-center">
          <Typography color="blue-gray" className="font-medium">
            <Image
              src={"/image/palm-tree.png"}
              width={25}
              height={25}
              alt="palm"
            />
          </Typography>
          <span className="ml-2">Refill</span>
        </div>
        <Typography color="blue-gray" className="flex gap-2 font-medium">
          <Image src={"/dates.svg"} width={25} height={25} alt="dates" />
          <span>{gamificationTxAmountsData && gamificationTxAmountsData}</span>
        </Typography>
      </div>
      {RefillEnable && (
        <>
          <div className="flex items-center">
            {/* <p>
            You have {datesData?.stock} dates. After refill you will have {datesData?.stock-500} dates. 
            <br/>Do you want to proceed?
          </p> */}

            {datesData?.stock < 500 ? (
              <>
                <p>
                  You have {datesData?.stock} DATES to refill PALM, please buy some
                  DATES or wait for another PALM.
                </p>
                <button className="popbuttonWarning" onClick={() => router.push("/store")}>
                  Buy Some Dates
                </button>
              </>
            ) : (
              <>
                <p>
                  You have {datesData?.stock} DATES. After refill you will have {datesData?.stock - 500} DATES.
                  <br />
                  Do you want to proceed?
                </p>
                <button className="popbuttonWarning" onClick={() => refill()}>
                  Confirm
                </button>
              </>
            )}
          </div>
        </>
      )}

      <div className="text-center">
        <button
          onClick={() => handleClick()}
          className="text-lavender-600 font-bold"
        >
          NO THANKS
        </button>
      </div>
      {isSubscriptionModalVisible && (
        <Modal>
          <SubscriptionModal subscriptionPlans={subscriptionPlanData} />
        </Modal>
      )}
    </div>
  );
};

export default PalmStockModal;
