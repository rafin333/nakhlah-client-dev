import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { Typography } from "@material-tailwind/react";
import { useGetSubscriptionsQuery } from "@/redux/features/subscriptions/subscriptions";
import { useSelector } from "react-redux";

const PalmCount = () => {
  const router = useRouter();
  const { i18n } = useTranslation();

  const { isLoading, palmData, datesData, injazData } = useSelector(
    (state) => state.gamificationStore
  );

  const { planData } = useSelector((state) => state.subscriptionStore);

  const hasSubscription =
    planData && planData?.subscription_plan?.planName != "Free";

  const changeLanguage = (e) => {
    const locale = e.target.value;
    i18n.changeLanguage(locale);
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <div className="mb-2 flex items-center justify-left">
      {isLoading ? (
        <div className="animate-blink-text">On the fly...</div>
      ) : (
        <>
          <Typography
            color="blue-gray"
            className="font-medium"
            style={{ width: "11%" }}
          >
            <Image
              src={"/image/Palm_Tree.svg"}
              width={30}
              height={30}
              alt="Palm Tree"
            />
          </Typography>
          <Typography className="font-medium">
            &nbsp; {hasSubscription ? "∞" : palmData?.stock}
          </Typography>
          &nbsp; &nbsp;
          <Typography
            color="blue-gray"
            className="font-medium"
            style={{ width: "10%" }}
          >
            <Image src={"/dates.svg"} width={25} height={25} alt="Dates" />
          </Typography>
          <Typography className="font-medium">
            &nbsp; {datesData?.stock}
            {/* &nbsp; {hasSubscription ? "∞" : datesData?.stock} */}
          </Typography>
          &nbsp; &nbsp;
          <Typography
            color="blue-gray"
            className="font-medium"
            style={{ width: "10%" }}
          >
            <Image src={"/star.svg"} width={25} height={25} alt="Injaz" />
          </Typography>
          <Typography className="font-medium">
            &nbsp; {injazData?.stock}
          </Typography>
        </>
      )}
    </div>
  );
};

export default PalmCount;
