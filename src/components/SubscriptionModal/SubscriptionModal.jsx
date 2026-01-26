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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
          <p className="text-xs text-gray-500">Upgrade for full access</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          ✕
        </button>
      </div>

      {/* Tip */}
      <div className="mb-4 p-2.5 px-4 rounded-md text-sm text-gray-800 bg-amber-100 border-l-4 border-amber-400">
        <strong>Note:</strong> To switch plans, please select Free Plan first to unsubscribe.
      </div>

      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-m font-medium text-gray-700">
          {currentPlanName === "Free" ? (
            <>Your current plan: <span className="ml-1 font-bold text-indigo-600">Free</span></>
          ) : (
            <>Active Plan: <span className="ml-1 font-bold text-green-600">{currentPlanName}</span></>
          )}
        </div>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center text-sm text-green-600">
          {selectedPlan?.attributes?.planName === "Free"
            ? `Redirecting to store in ${countdown}s...`
            : "Redirecting to payment..."}
        </div>
      )}

      {/* card inside modal */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer
                ${isDisabled ? 'opacity-60 grayscale cursor-not-allowed border-gray-100' : 'hover:scale-[1.01]'}
                ${isSelected
                  ? 'bg-gradient-to-br from-lavender-800 to-purple-700 text-white border-purple-800 shadow-md'
                  : 'bg-white border-gray-100 hover:border-purple-200 hover:shadow-sm'
                }`}
              onClick={() => !isDisabled && handleSelectPlan(plan)}
            >
              {isCurrentPlan && (
                <div className="absolute top-0 right-6 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-l font-bold shadow-sm">
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
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <div>
                        {/* <span className={`font-medium ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {feature?.attributes?.featureName}
                        </span> */}
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

      {/* Footer Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {selectedPlan && !loading && (
          <button
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg shadow transition-all text-sm"
            onClick={handlePayment}
          >
            Continue with {selectedPlan.attributes.planName}
          </button>
        )}
        <button
          className={`flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm ${!selectedPlan ? 'w-full' : ''}`}
          onClick={onClose}
          disabled={loading}
        >
          Cancel
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