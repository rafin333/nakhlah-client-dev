import {
  useAddPaymentsInitiateMutation,
  useAddUnsubscribeInitiateMutation,
} from "@/redux/features/payments/paymentsApi";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function SubscriptionModal({ subscriptionPlans, onClose }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentsInitiate] = useAddPaymentsInitiateMutation();
  const [unsubscribeInitiate] = useAddUnsubscribeInitiateMutation();
  const { planData } = useSelector((state) => state.subscriptionStore);

  const currentPlanName = planData?.subscription_plan?.planName; 

  const handleSelectPlan = (plan) => {
    if (plan?.attributes?.planName === currentPlanName) return;
    setSelectedPlan(plan);
    setError(null);
    setSuccess(false);
  };

  const [countdown, setCountdown] = useState(30);
  const [redirecting, setRedirecting] = useState(false);

  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);

  useEffect(() => {
    if (redirecting) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            window.location.replace("/store");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [redirecting]);
  
  const handlePayment = async () => {
    if (!selectedPlan) {
      setError("Please select a plan before proceeding.");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    try {
      if (selectedPlan?.attributes?.planName === "Free") {
        const response = await unsubscribeInitiate().unwrap();
        console.log("Unsubscribed successfully:", response);
        setSuccess(true);
        setRedirecting(true);
        return;
      }
  
      const requestBody = {
        data: {
          purchase: "Buy_Subscription",
          subscription_plan: selectedPlan?.id,
        },
      };
  
      const response = await paymentsInitiate(requestBody).unwrap();
      setSuccess(true);
      console.log("Payment successful:", response);
  
      if (response.success && response.url) {
        setTimeout(() => {
          window.location.href = response.url;
        }, 1000);
      } else {
        setError("Payment initiation failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Payment/Unsubscription error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Choose Your Plan</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>
      
      <div className="mb-4 p-4 rounded-lg text-gray-700 "
      style={{background: "rgb(251, 214, 135)",borderLeft: "4px solid #FFD700"}}>
        <strong>Tip:</strong> To switch to a different plan, first select the free plan and unsubscribe from your current plan.
      </div>

      <div className="mb-6 text-center">
        <p className="text-lg text-gray-600 bg-indigo-50 px-4 py-2 rounded-full inline-block">
          {currentPlanName === "Free" ? (
            <>Your current plan: <span className="font-semibold text-indigo-600">Free</span></>
          ) : (
            <>Active Plan: <span className="font-semibold text-green-600">{currentPlanName}</span></>
          )}
        </p>
      </div>


      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}

      {/* {redirecting && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          Redirecting in<span> </span> <span className="font-bold"> {countdown}</span> seconds...
        </div>
      )} */}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
           </svg>

          {selectedPlan?.attributes?.planName === "Free"
            ? `Redirecting to store in ${countdown} seconds...`
            : "Redirecting to payment..."}
         </div>
      )}
      
      {/* card inside modal */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {subscriptionPlans?.map((plan, index) => {
          const isCurrentPlan = plan?.attributes?.planName === currentPlanName;
          const isPaidPlan = plan?.attributes?.planName !== "Free";
          const isCurrentPaid = currentPlanName !== "Free";
          const isOtherPaid = isCurrentPaid && isPaidPlan && !isCurrentPlan;
          const isDisabled = isCurrentPlan || isOtherPaid;
          const isSelected = selectedPlan?.id === plan.id;

          return (
            <div
              key={index}
              className={`relative p-6 rounded-xl transition-all transform border-2 border-transparent
                          ${isDisabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] hover:border-2 hover:border-[#462288] hover:shadow-lg hover:shadow-[#462288]'}
                          ${isSelected ? 'bg-gradient-to-br from-lavender-800 to-purple-700 text-white shadow-lg border-[#462288] shadow-[#462288]' : 'bg-gray-50 hover:shadow-md'}`}
              onClick={() => !isDisabled && handleSelectPlan(plan)}
            >
              {isCurrentPlan && (
                <div className="absolute top-0 right-6 bg-white text-purple-900 px-3 py-1 rounded-full text-l font-bold shadow-sm">
                  Current Plan
                </div>
              )}
              
              {isOtherPaid && (
                <div className="absolute top-0 right-6 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-l font-bold shadow-sm">
                  Not Available
                </div>
              )}

              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 mb-4 bg-white/20 p-3 rounded-full shadow-inner">
                  <img
                    src={plan?.attributes?.planName === "Free" ? "/image/Free.svg" : "/image/Pro.svg"}
                    alt={plan?.attributes?.planName}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <h3 className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                  {plan?.attributes?.planName}
                </h3>
                
                <div className="mt-2">
                  <span className={`text-4xl font-extrabold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    ${plan?.attributes?.price}
                  </span>
                  <span className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    /month
                  </span>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className={`text-sm font-semibold uppercase mb-4 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                  Features
                </h4>
                <ul className="space-y-3">
                  {plan?.attributes?.subscription_plan_features?.data?.map((feature) => (
                    <li key={feature.id} className="flex items-start">
                      <svg
                        className={`flex-shrink-0 w-5 h-5 mr-2 ${isSelected ? 'text-white' : 'text-purple-600'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      <div>
                        <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {feature?.attributes?.featureName}
                        </span>
                        <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          {feature?.attributes?.featureDetails}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        {selectedPlan && !loading && (
          <button
            className="w-full bg-gradient-to-r from-lavender-800 to-purple-700 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
            onClick={handlePayment}
          >
            Continue with {selectedPlan.attributes.planName}
          </button>
        )}

        <button
          className="w-full border-2 border-gray-200 hover:border-gray-300 py-3 px-6 mb-1 rounded-lg transition-colors bg-gray-500 hover:bg-gray-700 text-white font-bold"
          onClick={onClose}
          disabled={loading}
        >
          Close
        </button>
      </div>

      {showUnsubscribeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Unsubscribed Successfully</h2>
            <p className="text-gray-600 mt-2">You have been moved to the Free plan.</p>
            <p className="text-gray-500 mt-2">Redirecting in <span className="font-bold text-indigo-600">{countdown}</span> seconds...</p>
            <button
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
              onClick={() => {
                setShowUnsubscribeModal(false);
                window.location.replace("/store");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionModal;