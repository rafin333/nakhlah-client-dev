import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { Typography } from "@material-tailwind/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState, useRef } from "react";
import ToastMessage from "../Toast";
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

  const { palmData, datesData } = useSelector((state) => state.gamificationStore);

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
  const { data: gamificationTxAmountsData } =
    useGetLearnerGamificationsTXAmountQuery({ ...queryTXAmount });

  const { data: getLearnerGamificationData } = useGetLearnerGamificationsQuery({
    ...LGquery,
  });

  const { data: subscriptionPlanData } = useGetSubscriptionPlanQuery({
    ...subscriptionQuery,
  });

  const handleLearnerGamification = useHandleLearnerGamification();

  const [RefillEnable, setRefillEnable] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);

  const [refilled, setRefilled] = useState(false);
  const intervalRef = useRef(null);

  const notify = useCallback((type, message) => {
    ToastMessage({ type, message });
  }, []);

  const calculateTimeLeft = () => {
    if (refilled) return;

    if (getLearnerGamificationData && getLearnerGamificationData.length > 0) {
      const lastRefillTime = dayjs(getLearnerGamificationData[0]?.createdAt);
      const nextRefillTime = lastRefillTime.add(1, "hour");
      const now = dayjs();
      const diff = nextRefillTime.diff(now, "second");

      if (diff <= 0) {
        setTimeLeft("00 M 00 S");

        clearInterval(intervalRef.current);
        intervalRef.current = null;

        autoRefill(); // auto refill without dates
        return;
      }

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;

      setTimeLeft(
        `${String(minutes).padStart(2, "0")} M : ${String(seconds).padStart(2, "0")} S`
      );

    }
  };

  useEffect(() => {
    if (refilled) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(intervalRef.current);
  }, [getLearnerGamificationData, refilled]);

  async function autoRefill() {
    try {
      await handleLearnerGamification(
        gamificationTxData,
        TRANSACTION_NAMES.PALM_REFILL_BY_DATES_LOSS
      );

      setRefilled(true);
      clearInterval(intervalRef.current);

      // CLOSE MODAL after successful refill
      setShowModal(false);

      notify("success", "Palms refilled successfully!");
    } catch (error) {
      notify("error", error?.data?.error?.message);
    }
  }

  async function refill() {
    if (datesData?.stock < 500) {
      notify("error", "Not enough dates to refill palms");
      return;
    }

    try {
      await handleLearnerGamification(
        gamificationTxData,
        TRANSACTION_NAMES.PALM_REFILL_BY_DATES_LOSS
      );

      setRefilled(true);
      clearInterval(intervalRef.current);

      setShowModal(false);
    } catch (error) {
      notify("error", error?.data?.error?.message);
    }
  }

  const handleClick = () => {
    setShowModal(false);
    if (router.pathname == "/lesson") {
      router.push("/learn");
    }
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
        className="mb-4 p-4 border border-lavender-300 rounded-lg flex items-center justify-between cursor-pointer bg-lavender-600 text-white"
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
        className="mb-4 p-4 border border-lavender-300 rounded-lg flex items-center justify-between cursor-pointer bg-lavender-600 text-white"
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
        <div className="flex items-center">
          {datesData?.stock < 500 ? (
            <>
              <p>
                You have {datesData?.stock} DATES to refill PALM, please buy
                some DATES or wait for another PALM.
              </p>
              <button
                className="popbuttonWarning"
                onClick={() => router.push("/store")}
              >
                Buy Some Dates
              </button>
            </>
          ) : (
            <>
              <p>
                You have {datesData?.stock} DATES. After refill you will have{" "}
                {datesData?.stock - 500} DATES.
                <br />
                Do you want to proceed?
              </p>
              <button className="popbuttonWarning" onClick={() => refill()}>
                Confirm
              </button>
            </>
          )}
        </div>
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
