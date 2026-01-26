// import Link from "next/link";

// import React, { useContext, useEffect, useRef, useState } from "react";

// import {
//   Card,
//   CardBody,
//   CardFooter,
//   Typography,
//   Button,
// } from "@material-tailwind/react";
// // import {
// //   PresentationChartBarIcon,
// //   ShoppingBagIcon,
// //   UserCircleIcon,
// //   Cog6ToothIcon,
// //   InboxIcon,
// //   PowerIcon,
// // } from "@heroicons/react/24/solid";
// // import { MdLeaderboard, MdMore } from "react-icons/md";
// // import { FaToolbox, FaBagShopping } from "react-icons/fa6";
// // import { FaUser } from "react-icons/fa";
// import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
// import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
// import { useTranslation } from "next-i18next";
// import PalmCount from "../PalmCount/PalmCount";
// import { useRouter } from "next/router";

// // import { Checkbox } from "@/components/ui/checkbox"
// // import { Label } from "@/components/ui/label"
// import {
//   BookOpenText,
//   Circle,
//   CircleAlert,
//   CircleCheck,
//   Flame,
//   LockKeyhole,
//   Rows2,
//   Rows4,
//   Trophy,
// } from "lucide-react";
// import { CircleCheckBig } from "lucide-react";
// import { useGetLearnerProgressQuery } from "@/redux/features/learnerProgress/learnerProgress";
// import { useGetLearningJourneyLessonsQuery } from "@/redux/features/learningJourney/learningJourneyApi";
// import { useGetExamsQuery } from "@/redux/features/exam/examAPI";
// import { useGetUserLeaderboardPositionQuery } from "@/redux/features/larnerGamification/larnerGamificationAPI";
// import leaderBoardEligibility from "@/utils/leaderBoardEnable";
// import { useGetLearnerGamificationStockQuery } from "@/redux/features/gamification/gamificationAPI";
// import Modal from "../Modals/Modal";
// import SubscriptionModal from "../SubscriptionModal/SubscriptionModal";
// import PalmStockModal from "../PalmStockModal/PalmStockModal";
// import { useDispatch, useSelector } from "react-redux";
// import { login, logout } from "@/redux/state/userSlice";
// import {
//   loading,
//   palm,
//   dates,
//   injaz,
//   leaderboard,
// } from "@/redux/state/gemificationSlice";
// import { subPlan } from "@/redux/state/subscriptionSlice";
// import { useGetSubscriptionsQuery } from "@/redux/features/subscriptions/subscriptions";
// import Image from "next/image";
// import Lottie from "lottie-web";
// import useHandleLearnerGamification from "@/utils/learnerGamifications";
// import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
// import { TRANSACTION_NAMES } from "@/constants/transactionNames";
// import ThemeContext from "../context/themeContext";

// const RightSidebar = () => {
//   const dispatch = useDispatch();

//   const { isLoading, palmData, questData } = useSelector(
//     (state) => state.gamificationStore
//   );

//   const query = {
//     populate: "*",
//     "sort[0]": "id:asc",
//   };

//   const { data: learnerProgress } = useGetLearnerProgressQuery({ ...query });

//   const { planData } = useSelector((state) => state.subscriptionStore);
//   const { streakData } = useSelector((state) => state.streakStore);
//   console.log(streakData, questData);
//   const streakDates =
//     !!streakData && streakData.length > 0 && streakData[0]?.dates;
//   console.log(streakDates);
//   const hasMissedStatus =
//     streakDates && streakDates?.some((item) => item.status === "missed");
//   const missedCount =
//     streakDates &&
//     streakDates?.filter((item) => item.status === "missed").length;
//   console.log(hasMissedStatus, missedCount);
//   const hasSubscription =
//     planData && planData?.subscription_plan?.planName != "Free";

//   let counterAnimation = 0;

//   const streakContainer = useRef(null);

//   useEffect(() => {
//     if (counterAnimation === 0) {
//       animationJSON();
//     }
//   }, []);

//   function animationJSON() {
//     counterAnimation = 1;

//     Lottie.loadAnimation({
//       container: streakContainer.current,
//       renderer: "svg",
//       loop: true,
//       autoplay: true,
//       path: "/icons/All Icon/Streak/7 Day Streak Complete.json",
//     });
//   }

//   const { data: lessonData, isLoading: lessonLoading } =
//     useGetLearningJourneyLessonsQuery({ ...query });
//   const { data: examInfo } = useGetExamsQuery({ ...query });
//   const { data: UserPosition } = useGetUserLeaderboardPositionQuery({
//     ...query,
//   });
//   const [leaderboardEnable, setLeaderboardEnable] = useState(false);

//   console.log(learnerProgress);
//   const { t: rightSideBarT } = useTranslation(
//     TRANSLATION_NAMESPACES.rightSidebar
//   );
//   const { t: buttonT } = useTranslation(TRANSLATION_NAMESPACES.button);

//   const router = useRouter();
//   const progressId = learnerProgress?.[learnerProgress.length - 1]?.progressId;
//   console.log(progressId, palmData?.stock);

//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     // Check if there's already a stored progressId
//     const storedProgressId = localStorage.getItem("progressId");

//     // If there's no stored value, set the initial value
//     if (!storedProgressId && progressId) {
//       localStorage.setItem("progressId", progressId);
//     }
//   }, [progressId]);

//   console.log("progressid111", progressId);
//   const handleSubscribeClick = () => {
//     router.push("/store"); // Redirect to the store page
//   };

//   const handleQuestViewAllClick = () => {
//     router.push("/quests"); // Redirect to the store page
//   };


//   const context = useContext(ThemeContext);
//   const { token } = context;
//   const handleStreakSeeAllClick = () => {

//     if (!token) {
//       console.log("No token found. User might not be logged in.");
//       return;
//     }

//     const raw = { missedDaysToRestore: missedCount };

//     const requestOptions = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(raw),
//       redirect: "follow",
//     };

//     fetch(
//       process.env.NEXT_PUBLIC_API_BASE_URL + "restore-streak?populate=*",
//       requestOptions
//     )
//       .then((response) => {
//         if (!response.ok) throw new Error("Unauthorized or other error");
//         return response.json();
//       })
//       .then((result) => console.log(result))
//       .catch((error) => console.log("error", error));
//   };

//   const [quests, setQuests] = useState([
//     { id: 1, task: "Complete a lesson", completed: false, xp: 50 },
//     { id: 2, task: "Take a short quiz", completed: false, xp: 30 },
//   ]);

//   const handleQuestToggle = (questId) => {
//     setQuests(
//       quests.map((quest) =>
//         quest.id === questId ? { ...quest, completed: !quest.completed } : quest
//       )
//     );
//   };
//   const totalXP = quests.reduce(
//     (sum, quest) => (quest.completed ? sum + quest.xp : sum),
//     0
//   );
//   useEffect(() => {
//     const le = leaderBoardEligibility(progressId, lessonData, examInfo); // Check Eligibility of Leader board
//     console.log(le);
//     setLeaderboardEnable(le);
//   }, [progressId, lessonData, examInfo]);

//   const { isLoggedIn, user } = useSelector((state) => state.userStore);

//   console.log(user);

//   const handleLogin = () => {
//     // ... logic to fetch user data
//     dispatch(login(LGameInfo));
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   const arrayOfSeven = [1, 2, 3, 4, 5, 6, 7];
//   const remainingDays = arrayOfSeven.length - streakDates?.length;
//   const trimmedAOS = arrayOfSeven.slice(0, remainingDays);
//   console.log(trimmedAOS);

//   const handleLearnerGamification = useHandleLearnerGamification();
//   const { data: gamificationTxData } = useGetGamificationTxesQuery({});

//   async function giftUser(txName) {
//     try {
//       const res = await handleLearnerGamification(gamificationTxData, txName);

//       // alert(JSON.stringify(res));
//     } catch (error) {
//       console.error("Error handling learner gamification:", error);
//     }
//   }

//   const handleShare = () => {
//     const currentUrl = window.location.href; // Get the current URL
//     const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
//       currentUrl
//     )}`;
//     window.open(facebookShareUrl, "_blank", "noopener,noreferrer"); // Open the share link in a new tab
//   };

//   return (
//     <>
//       <div
//         className="sideBarBG h-full px-3 py-4 overflow-y-auto  "
//         style={{ right: "0px", width: "inherit" }}
//       >
//         {/* //////////////////////////////////// Gamification ////////////////////////////////  */}

//         <div
//           className="my-4"
//           style={{
//             borderRadius: "5px",
//             backgroundColor: "rgb(77 54 6)",
//             color: "white",
//             padding: "1rem",
//           }}
//         >
//           <PalmCount />
//         </div>

//         {/* //////////////////////////////////// Language ////////////////////////////////  */}

//         <div className="my-4">
//           <LanguageSwitcher />
//         </div>

//         {/* //////////////////////////////////// Refill Now Button ////////////////////////////////  */}
//         {palmData?.stock < 5 && !hasSubscription && (
//           <Card
//             className="mb-4"
//             style={{
//               borderRadius: "10px",
//               backgroundColor: "#cb8f15",
//               color: "white",
//             }}
//           >
//             <CardBody style={{ margin: "-10px" }}>
//               <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
//                 {rightSideBarT("Refill your full life")}
//               </Typography>
//               <div className="mt-4 text-center">
//                 {isLoading ? (
//                   <>...</>
//                 ) : (
//                   <button
//                     class="animate-blink-slow"
//                     style={{ color: "black", fontWeight: "normal" }}
//                     onClick={() => setShowModal(true)}
//                   >
//                     Refill Now
//                   </button>
//                 )}
//               </div>
//             </CardBody>
//           </Card>
//         )}

//         {/* //////////////////////////////////// subscribe button ////////////////////////////////  */}
//         {!hasSubscription && (
//           <Card
//             className="mb-4"
//             style={{
//               borderRadius: "10px",
//               backgroundColor: "#cb8f15",
//               color: "white",
//             }}
//           >
//             <CardBody style={{ margin: "-10px" }}>
//               {/* <Typography
//               variant="h5"
//               className="mb-2"
//               style={{ color: "#fefaef" }}
//             >
//               {rightSideBarT("subscribeNow")}
//             </Typography> */}
//               <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
//                 {rightSideBarT("getUnlimitedAccess")}
//               </Typography>
//               <div className="mt-4 text-center">
//                 <Button
//                   className="popbuttonWarning"
//                   onClick={handleSubscribeClick}
//                 >
//                   {buttonT("subscribe")}
//                 </Button>
//               </div>
//             </CardBody>
//           </Card>
//         )}

//         {/* //////////////////////////////////// Streak ////////////////////////////////  */}
//         {streakData?.length > 0 && (
//           <Card
//             className="mb-4 "
//             style={{
//               borderRadius: "10px",
//               backgroundColor: "#cb8f15",
//               color: "white",
//             }}
//           >
//             <CardBody>
//               {/* <Typography
//               variant="h5"
//               className="mb-2"
//               style={{ color: "#fefaef" }}
//             > */}
//               {/* <button
//               className="absolute top-2 right-2 text-sm  hover:underline text-white-500"
//               onClick={handleStreakSeeAllClick}
//             >
//               See More
//             </button> */}
//               <div
//                 className="grid grid-cols-3 gap-2 cursor-pointer"
//               // onClick={handleStreakSeeAllClick}
//               >
//                 <div className="col-span-1 ">
//                   <Image
//                     height={10}
//                     width={90}
//                     alt="streak"
//                     src={"/icons/All Icon/Streak/7 Day Streak Complete.svg"}
//                   />
//                   {/* <div ref={streakContainer}></div> */}
//                 </div>
//                 <div className="col-span-2 ">
//                   <Typography
//                     className="pb-1 mt-2"
//                     style={{ fontSize: "14px" }}
//                   >
//                     {rightSideBarT("dailyStreak")}
//                   </Typography>
//                 </div>
//               </div>
//               <div
//                 style={{
//                   position: "relative",
//                   display: "flex",
//                   gap: "4px",
//                   marginBottom: "-10px",
//                 }}
//               >
//                 {/* <Flame size={32} color="#1d1b1b" strokeWidth={2.25} absoluteStrokeWidth /> */}
//                 {streakDates?.map((data) =>
//                   data?.status === "completed" ||
//                     data?.status === "restored" ? (
//                     <>
//                       {/* <Flame
//                         size={40}
//                         strokeWidth={2.5}
//                         absoluteStrokeWidth
//                         color="yellow"
//                       /> */}
//                       <Image
//                         src={"/icons/All Icon/Streak/1.svg"}
//                         alt=""
//                         height={30}
//                         width={30}
//                       />
//                     </>
//                   ) : (
//                     data?.status === "missed" && (
//                       <>
//                         {/* <Flame
//                           size={30}
//                           strokeWidth={2.5}
//                           absoluteStrokeWidth
//                           color="red"
//                         /> */}

//                         <Image
//                           src={"/icons/All Icon/Streak/2.svg"}
//                           alt=""
//                           height={30}
//                           width={30}
//                         />
//                       </>
//                     )
//                   )
//                 )}

//                 {trimmedAOS.map((x) => (
//                   <>
//                     {/* <Flame
//                       size={30}
//                       strokeWidth={2.5}
//                       absoluteStrokeWidth
//                       color="black"
//                     /> */}
//                     <Image
//                       src={"/icons/All Icon/Streak/3.svg"}
//                       alt=""
//                       height={30}
//                       width={30}
//                     />
//                   </>
//                 ))}
//               </div>
//               {/* </Typography> */}
//               {hasMissedStatus && (
//                 <div className="mt-4 text-center">
//                   <Button
//                     className="popbuttonWarning"
//                     onClick={handleStreakSeeAllClick}
//                   >
//                     Restore
//                   </Button>
//                 </div>
//               )}
//             </CardBody>
//           </Card>
//         )}

//         {/* //////////////////////////////////// Daily Quest ////////////////////////////////  */}

//         <Card
//           className="mb-4"
//           style={{ borderRadius: "10px", backgroundColor: "#fbd687" }}
//         >
//           <CardBody>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
//               <Typography className="font-extrabold text-lg">
//                 {rightSideBarT("dailyQuests")}
//               </Typography>
//               {/* <Typography
//                 className="font-extrabold text-lg"
//                 style={{ color: "#cb8f15" }}
//               > 
//                 <button
//                   className="absolute top-2 right-2 text-sm  hover:underline text-white-500"
//                   onClick={handleQuestViewAllClick}
//                 >
//                   See Details
//                 </button>
//               </Typography> */}
//             </div>
//             <Typography style={{ fontSize: "14px" }}>
//               {rightSideBarT("participateInDailyQuests")}
//             </Typography>
//             <Typography style={{ fontSize: "12px" }}>
//               <div>
//                 {questData?.tasks.map((quest, k) => (
//                   <div className="flex space-x-4" key={k}>
//                     {quest.status == false ? <Circle /> : <CircleCheck />}
//                     <span>{quest.task}</span>
//                   </div>
//                 ))}
//               </div>
//             </Typography>
//           </CardBody>
//         </Card>


//         {/* <Card
//           className="mb-4"
//           style={{ borderRadius: "10px", backgroundColor: "#fbd687" }}
//         >
//           <CardBody>
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
//               <Typography className="font-extrabold text-lg text-brown-800">
//                 {rightSideBarT("dailyQuests")}
//               </Typography>

//           <button
//             className="text-sm text-white bg-brown-600 px-3 py-1 rounded hover:underline"
//             onClick={handleQuestViewAllClick}
//           >
//             {rightSideBarT("seeDetails")}
//           </button>  

//             </div>

//             <Typography className="text-sm text-gray-800 mt-2">
//               {rightSideBarT("participateInDailyQuests")}
//             </Typography>

//             <ul className="mt-3 space-y-2 text-xs text-gray-900">
//               {questData?.tasks.map((quest, index) => (
//                 <li key={index} className="flex items-center space-x-3">
//                   {quest.status ? (
//                     <CircleCheck className="text-green-600 w-4 h-4" />
//                   ) : (
//                     <Circle className="text-gray-400 w-4 h-4" />
//                   )}
//                   <span>{quest.task}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardBody>
//         </Card> */}

//         {/* //////////////////////////////////// Leaderboard Position ////////////////////////////////  */}

//         <Card
//           className="mb-4"
//           style={{
//             borderRadius: "10px",
//             backgroundColor: "#cb8f15",
//             color: "white",
//           }}
//         >
//           <CardBody>
//             <Typography
//               variant="h6"
//               className="mb-2"
//               style={{ color: "#fefaef" }}
//             >
//               {leaderboardEnable
//                 ? "Your position: " + UserPosition?.position
//                 : rightSideBarT("unlockLeaderboards")}
//             </Typography>
//             <Typography style={{ fontSize: "12px" }}>
//               {!leaderboardEnable &&
//                 rightSideBarT("completeLessons", { numLessons: 9 })}
//             </Typography>
//           </CardBody>
//         </Card>

//         {/* //////////////////////////////////// Share Button ////////////////////////////////  */}

//         <Card
//           className="mb-4"
//           style={{
//             borderRadius: "10px",
//             backgroundColor: "#cb8f15",
//             color: "white",
//           }}
//         >
//           <CardBody style={{ margin: "-10px" }}>
//             {/* <Typography
//               variant="h5"
//               className="mb-2"
//               style={{ color: "#fefaef" }}
//             >
//               {rightSideBarT("subscribeNow")}
//             </Typography> */}
//             <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
//               Please share this learning platform in you social media.
//             </Typography>
//             <div className="mt-4 text-center">
//               <Button
//                 className="popbuttonWarning"
//                 onClick={() => {
//                   handleShare();
//                   giftUser(TRANSACTION_NAMES.Share_The_App);
//                 }}
//               >
//                 Share
//               </Button>
//             </div>
//           </CardBody>
//         </Card>
//       </div>

//       {showModal && (
//         <Modal>
//           <PalmStockModal setShowModal={setShowModal} />
//         </Modal>
//       )}
//     </>
//   );
// };

// export default RightSidebar;












import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";
import { useTranslation } from "next-i18next";
import PalmCount from "../PalmCount/PalmCount";
import { useRouter } from "next/router";
import {
  Circle,
  CircleCheck,
  CircleHelp,
  Headset,
  Share2,
} from "lucide-react";
import { useGetLearnerProgressQuery } from "@/redux/features/learnerProgress/learnerProgress";
import { useGetLearningJourneyLessonsQuery } from "@/redux/features/learningJourney/learningJourneyApi";
import { useGetExamsQuery } from "@/redux/features/exam/examAPI";
import { useGetUserLeaderboardPositionQuery } from "@/redux/features/larnerGamification/larnerGamificationAPI";
import leaderBoardEligibility from "@/utils/leaderBoardEnable";
import Modal from "../Modals/Modal";
import PalmStockModal from "../PalmStockModal/PalmStockModal";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "@/redux/state/userSlice";
import Image from "next/image";
import Lottie from "lottie-web";
import useHandleLearnerGamification from "@/utils/learnerGamifications";
import { useGetGamificationTxesQuery } from "@/redux/features/gamificationTxes/gamificationTxes";
import { TRANSACTION_NAMES } from "@/constants/transactionNames";
import ThemeContext from "../context/themeContext";

const RightSidebar = () => {
  const dispatch = useDispatch();

  const { isLoading, palmData, questData } = useSelector(
    (state) => state.gamificationStore
  );

  const query = {
    populate: "*",
    "sort[0]": "id:asc",
  };

  const { data: learnerProgress } = useGetLearnerProgressQuery({ ...query });

  const { planData } = useSelector((state) => state.subscriptionStore);
  const { streakData } = useSelector((state) => state.streakStore);

  const streakDates =
    !!streakData && streakData.length > 0 && streakData[0]?.dates;

  const hasMissedStatus =
    streakDates && streakDates?.some((item) => item.status === "missed");
  const missedCount =
    streakDates &&
    streakDates?.filter((item) => item.status === "missed").length;

  const hasSubscription =
    planData && planData?.subscription_plan?.planName != "Free";

  let counterAnimation = 0;

  const streakContainer = useRef(null);

  useEffect(() => {
    if (counterAnimation === 0) {
      animationJSON();
    }
  }, []);

  function animationJSON() {
    counterAnimation = 1;
    // Ensure the container exists before loading animation
    if (streakContainer.current) {
      Lottie.loadAnimation({
        container: streakContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/icons/All Icon/Streak/7 Day Streak Complete.json",
      });
    }
  }

  const { data: lessonData, isLoading: lessonLoading } =
    useGetLearningJourneyLessonsQuery({ ...query });
  const { data: examInfo } = useGetExamsQuery({ ...query });
  const { data: UserPosition } = useGetUserLeaderboardPositionQuery({
    ...query,
  });
  const [leaderboardEnable, setLeaderboardEnable] = useState(false);

  const { t: rightSideBarT } = useTranslation(
    TRANSLATION_NAMESPACES.rightSidebar
  );
  const { t: buttonT } = useTranslation(TRANSLATION_NAMESPACES.button);

  const router = useRouter();
  const progressId = learnerProgress?.[learnerProgress.length - 1]?.progressId;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedProgressId = localStorage.getItem("progressId");
    if (!storedProgressId && progressId) {
      localStorage.setItem("progressId", progressId);
    }
  }, [progressId]);

  const handleSubscribeClick = () => {
    router.push("/store");
  };

  const handleQuestViewAllClick = () => {
    router.push("/quests");
  };

  const context = useContext(ThemeContext);
  const { token } = context;
  const handleStreakSeeAllClick = () => {
    if (!token) {
      console.log("No token found. User might not be logged in.");
      return;
    }

    const raw = { missedDaysToRestore: missedCount };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(raw),
      redirect: "follow",
    };

    fetch(
      process.env.NEXT_PUBLIC_API_BASE_URL + "restore-streak?populate=*",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) throw new Error("Unauthorized or other error");
        return response.json();
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    const le = leaderBoardEligibility(progressId, lessonData, examInfo);
    setLeaderboardEnable(le);
  }, [progressId, lessonData, examInfo]);

  const { isLoggedIn, user } = useSelector((state) => state.userStore);

  const handleLogin = () => {
    dispatch(login(LGameInfo));
  };

  const handleLogout = () => {
    // Standardized logout flow
    import("@/services/auth.service").then(({ removeUserInfo }) => {
      removeUserInfo();
      dispatch(logout());
      router.push("/");
    });
  };

  const arrayOfSeven = [1, 2, 3, 4, 5, 6, 7];
  const remainingDays = arrayOfSeven.length - (streakDates?.length || 0);
  const trimmedAOS = arrayOfSeven.slice(0, remainingDays < 0 ? 0 : remainingDays);

  const handleLearnerGamification = useHandleLearnerGamification();
  const { data: gamificationTxData } = useGetGamificationTxesQuery({});

  async function giftUser(txName) {
    try {
      const res = await handleLearnerGamification(gamificationTxData, txName);
    } catch (error) {
      console.error("Error handling learner gamification:", error);
    }
  }

  const handleShare = () => {
    const currentUrl = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
  };

  // Social Media Links Configuration
  const socialLinks = [
    { name: "Facebook", icon: "/icons/All Icon/Social Media/facebook.svg", url: "https://facebook.com" },
    { name: "Twitter", icon: "/icons/All Icon/Social Media/twitter.svg", url: "https://twitter.com" },
    { name: "LinkedIn", icon: "/icons/All Icon/Social Media/linkedin.svg", url: "https://linkedin.com" },
    { name: "TikTok", icon: "/icons/All Icon/Social Media/tik-tok.svg", url: "https://tiktok.com" },
  ];

  return (
    <>
      <div
        className="sideBarBG h-full px-3 py-4 overflow-y-auto flex flex-col"
        style={{ right: "0px", width: "inherit" }}
      >
        {/* ==================== Top Content ==================== */}

        {/* Gamification */}
        <div
          className="my-4"
          style={{
            borderRadius: "5px",
            backgroundColor: "rgb(77 54 6)",
            color: "white",
            padding: "1rem",
          }}
        >
          <PalmCount />
        </div>

        {/* Language */}
        <div className="my-4">
          <LanguageSwitcher />
        </div>

        {/* Refill Now Button */}
        {palmData?.stock < 5 && !hasSubscription && (
          <Card
            className="mb-4"
            style={{
              borderRadius: "10px",
              backgroundColor: "#cb8f15",
              color: "white",
            }}
          >
            <CardBody style={{ margin: "-10px" }}>
              <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                {rightSideBarT("Refill your full life")}
              </Typography>
              <div className="mt-4 text-center">
                {isLoading ? (
                  <>...</>
                ) : (
                  <button
                    className="animate-blink-slow"
                    style={{ color: "black", fontWeight: "normal" }}
                    onClick={() => setShowModal(true)}
                  >
                    Refill Now
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Subscribe button */}
        {!hasSubscription && (
          <Card
            className="mb-4"
            style={{
              borderRadius: "10px",
              backgroundColor: "#cb8f15",
              color: "white",
            }}
          >
            <CardBody style={{ margin: "-10px" }}>
              <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
                {rightSideBarT("getUnlimitedAccess")}
              </Typography>
              <div className="mt-4 text-center">
                <Button
                  className="popbuttonWarning"
                  onClick={handleSubscribeClick}
                >
                  {buttonT("subscribe")}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Streak */}
        {streakData?.length > 0 && (
          <Card
            className="mb-4 "
            style={{
              borderRadius: "10px",
              backgroundColor: "#cb8f15",
              color: "white",
            }}
          >
            <CardBody>
              <div
                className="grid grid-cols-3 gap-2 cursor-pointer"
              >
                <div className="col-span-1 ">
                  <Image
                    height={10}
                    width={90}
                    alt="streak"
                    src={"/icons/All Icon/Streak/7 Day Streak Complete.svg"}
                  />
                </div>
                <div className="col-span-2 ">
                  <Typography
                    className="pb-1 mt-2"
                    style={{ fontSize: "14px" }}
                  >
                    {rightSideBarT("dailyStreak")}
                  </Typography>
                </div>
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  gap: "4px",
                  marginBottom: "-10px",
                }}
              >
                {streakDates?.map((data, i) =>
                  data?.status === "completed" ||
                    data?.status === "restored" ? (
                    <Image
                      key={i}
                      src={"/icons/All Icon/Streak/1.svg"}
                      alt=""
                      height={30}
                      width={30}
                    />
                  ) : (
                    data?.status === "missed" && (
                      <Image
                        key={i}
                        src={"/icons/All Icon/Streak/2.svg"}
                        alt=""
                        height={30}
                        width={30}
                      />
                    )
                  )
                )}

                {trimmedAOS.map((x, i) => (
                  <Image
                    key={i}
                    src={"/icons/All Icon/Streak/3.svg"}
                    alt=""
                    height={30}
                    width={30}
                  />
                ))}
              </div>
              {hasMissedStatus && (
                <div className="mt-4 text-center">
                  <Button
                    className="popbuttonWarning"
                    onClick={handleStreakSeeAllClick}
                  >
                    Restore
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Daily Quest */}
        <Card
          className="mb-4"
          style={{ borderRadius: "10px", backgroundColor: "#fbd687" }}
        >
          <CardBody>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
              <Typography className="font-extrabold text-lg">
                {rightSideBarT("dailyQuests")}
              </Typography>
            </div>
            <Typography style={{ fontSize: "14px" }}>
              {rightSideBarT("participateInDailyQuests")}
            </Typography>
            <div className="text-xs mt-2">
              {questData?.tasks.map((quest, k) => (
                <div className="flex space-x-4 items-center mb-1" key={k}>
                  {quest.status == false ? <Circle size={16} /> : <CircleCheck size={16} color="green" />}
                  <span>{quest.task}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Leaderboard Position */}
        <Card
          className="mb-4"
          style={{
            borderRadius: "10px",
            backgroundColor: "#cb8f15",
            color: "white",
          }}
        >
          <CardBody>
            <Typography
              variant="h6"
              className="mb-2"
              style={{ color: "#fefaef" }}
            >
              {leaderboardEnable
                ? "Your position: " + UserPosition?.position
                : rightSideBarT("unlockLeaderboards")}
            </Typography>
            <Typography style={{ fontSize: "12px" }}>
              {!leaderboardEnable &&
                rightSideBarT("completeLessons", { numLessons: 9 })}
            </Typography>
          </CardBody>
        </Card>

        {/* Share Button
        <Card
          className="mb-4"
          style={{
            borderRadius: "10px",
            backgroundColor: "#cb8f15",
            color: "white",
          }}
        >
          <CardBody style={{ margin: "-10px" }}>
            <Typography style={{ fontSize: "14px", fontWeight: "bold" }}>
              Please share this learning platform in your social media.
            </Typography>
            <div className="mt-4 text-center">
              <Button
                className="popbuttonWarning"
                onClick={() => {
                  handleShare();
                  giftUser(TRANSACTION_NAMES.Share_The_App);
                }}
              >
                Share
              </Button>
            </div>
          </CardBody>
        </Card> */}

        {/* ==================== Footer Section (Restored Size) ==================== */}

        <div className="mt-auto pt-6 border-t border-white/20">

          {/* Socials & Share Integrated Row */}
          <div className="mb-6">
            <Typography variant="small" className="text-white/80 text-xs text-center mb-3 font-semibold tracking-wider">
              CONNECT & SHARE
            </Typography>
            <div className="flex justify-center items-center gap-3 flex-wrap">
              {/* Integrated Share Button - Standard Size */}
              <button
                onClick={() => {
                  handleShare();
                  giftUser(TRANSACTION_NAMES.Share_The_App);
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-full shadow-md transition-transform hover:scale-110 flex items-center justify-center"
                title="Share App"
              >
                <Share2 size={20} />
              </button>

              <div className="w-px h-6 bg-white/30 mx-2"></div>

              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/90 p-2 rounded-full hover:bg-white hover:scale-110 transition-all shadow-md flex items-center justify-center"
                  title={social.name}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Support & Legal - Standard Text Size */}
          <div className="text-center space-y-4">
            <Link
              href="/support"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-yellow-400 font-semibold bg-white/10 px-5 py-2 rounded-full transition-colors border border-white/10 hover:bg-white/20"
            >
              <Headset size={18} />
              <span>Customer Service</span>
            </Link>

            <div className="text-white/60 text-xs font-medium leading-relaxed pt-2">
              © {new Date().getFullYear()} Nakhlah. All Rights Reserved.<br />
              <div className="mt-1 space-x-3">
                <Link href="/privacyterms" className="hover:text-white underline decoration-white/30 transition-colors">Privacy Policy</Link>
                <span>•</span>
                <Link href="/privacyterms" className="hover:text-white underline decoration-white/30 transition-colors">Terms</Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {showModal && (
        <Modal>
          <PalmStockModal setShowModal={setShowModal} />
        </Modal>
      )}
    </>
  );
};

export default RightSidebar;