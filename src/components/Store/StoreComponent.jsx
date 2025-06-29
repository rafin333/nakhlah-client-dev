// Note: StoreComponent is a functional component which is used to display the subscription plans and package plans. It uses the useGetPackagePlanQuery and useGetSubscriptionPlanQuery hooks to fetch the data from the API. It also uses the PaymentModal and SubscriptionModal components to display the payment and subscription modals respectively. The handleBuyNowClick and handleSubscribeNowClick functions are used to handle the click events on the Buy Now and Subscribe Now buttons. The handleCloseModal function is used to close the modals when the close button is clicked. The isSubscriptionSectionVisible and isSubscriptionModalVisible states are used to control the visibility of the subscription section and subscription modal respectively. The selectedPlan state is used to store the selected package plan for payment. The StoreComponent is then rendered inside the StorePage component. The StorePage component also checks if the subscription plan is bought and displays the PaymentSuccess component inside a modal if the subscription plan is bought. The setsubscriptionSuccess state is used to control the visibility of the PaymentSuccess modal.


"use client"

import { useState, useEffect, useContext } from "react"
import Image from "next/image"
import { useGetPackagePlanQuery } from "@/redux/features/packagePlan/packagePlanApi"
import { useGetSubscriptionPlanQuery } from "@/redux/features/subscriptionPlans/subscriptionPlans"

import SubscriptionModal from "../SubscriptionModal/SubscriptionModal"
import axios from "axios"
import Modal from "../Modals/Modal"
import PaymentModal from "../PaymentModal/PaymentModal"
import ThemeContext from "../context/themeContext"


export default function StoreComponent() {
  const query = {
    populate: "*",
    "sort[0]": "planName:asc",
  }
  const subscriptionQuery = {
    populate: "*",
  }

  const { data: packagePlanData } = useGetPackagePlanQuery({ ...query })
  const { data: subscriptionPlanData } = useGetSubscriptionPlanQuery({ ...subscriptionQuery })
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isSubscriptionSectionVisible, setIsSubscriptionSectionVisible] = useState(true)
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] = useState(false)
  const [userSubscription, setUserSubscription] = useState({ planName: "", price: 0 });
  const context = useContext(ThemeContext);
  const { token } = context;



  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const response = await axios.get(
          "https://devapi.nakhlah.xyz/api/subscriptions?populate=*",
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
          }
        );
  
        if (response.data?.data) {
          const subscriptionPlan = response.data.data.subscription_plan;
          setUserSubscription({
            planName: subscriptionPlan.planName,
            price: subscriptionPlan.price,
          });
        }
      } catch (error) {
        console.error("Error fetching user subscription:", error);
      }
    };
  
    fetchUserSubscription();
  }, []);
  
  
  

  const handleBuyNowClick = (packagePlan) => {
    setSelectedPlan(packagePlan)
  }

  const handleSubscribeNowClick = () => {
    setIsSubscriptionModalVisible(true)
  }

  const handleCloseModal = () => {
    setSelectedPlan(null)
    setIsSubscriptionModalVisible(false)
  }
  console.log(userSubscription?.price)

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <h1 className="text-4xl font-bold text-center">Subscription</h1>

      {isSubscriptionSectionVisible && (
        <div className="bg-[#663399] rounded-lg p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/image/palm-tree.png"
                alt="Unlimited Palms"
                width={60}
                height={60}
                className="object-contain"
              />
              <div className="text-white">
                <h3 className="text-2xl font-bold">Unlimited Palms</h3>
                <p className="text-white/90">Never run out of palms with Super!</p>
              </div>
            </div>
            <button
              onClick={handleSubscribeNowClick}
              className="popbuttonWarning"
            >
              Explore Subscription Plans
            </button>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-4xl font-bold text-center mb-12">Our Dates Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packagePlanData?.map((packagePlan) => (
            <div
              key={packagePlan?.id}
              className="bg-[#663399] rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <Image
                  src="/dates.svg"
                  alt={packagePlan?.attributes?.planName}
                  width={120}
                  height={120}
                  className="object-contain"
                />
                <h3 className="text-2xl font-bold">{packagePlan.attributes?.planName}</h3>
                <p className="text-white/90">{packagePlan.attributes?.planDescription}</p>

                <button
                  onClick={() => handleBuyNowClick(packagePlan)}
                  className={userSubscription?.price > 0 ? "buttonInactive" : "popbuttonWarning"}
                  disabled={userSubscription?.price > 0}
                >
                  Buy Now
                </button>

                {userSubscription?.price > 0 && (
                  <div className="mb-4 p-4 rounded-lg text-gray-700 "
                  style={{background: "rgb(251, 214, 135)",borderLeft: "4px solid #FFD700"}}>
                    <strong>Tip:</strong> Users with an active subscription do not need to purchase date packages separately.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <Modal isShowCloseButton onClose={handleCloseModal}>
          <PaymentModal plan={selectedPlan} />
        </Modal>
      )}

      {isSubscriptionModalVisible && (
        <Modal>
          <SubscriptionModal subscriptionPlans={subscriptionPlanData} onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  )
}