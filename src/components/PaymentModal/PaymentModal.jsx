

import React, { useState } from "react";
import { useAddPaymentsInitiateMutation } from "@/redux/features/payments/paymentsApi";

const PaymentModal = ({ plan, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [paymentsInitiate] = useAddPaymentsInitiateMutation();

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    const requestBody = {
      data: {
        purchase: "Buy_Dates",
        package_plan: plan.id,
      },
    };

    try {
      const response = await paymentsInitiate({ ...requestBody }).unwrap();
      setSuccess(true);
      console.log("Payment successful:", response);
      setTimeout(() => {
        if (response.success && response.url) {
          window.location.href = response.url; // Redirect to the provided URL
        } else {
          setError("Payment initiation failed. Please try again.");
        } // Redirect to a thank-you page or another route
      }, 1000); // 2 seconds delay
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Confirm Purchase for {plan.attributes.planName}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success ? (
        <p className="text-green-500 mb-4">
          Redirecting...
        </p>
      ) : (
        <>
          <p className="mb-4">
            You are about to purchase this package. Click the button below to
            proceed.
          </p>
          <button
            type="button"
            className="w-full bg-lavender-800 hover:bg-lavender-600 text-white font-bold py-2 px-4 rounded"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : `Pay $${plan.attributes.package_plan_detail.data.attributes.planPrice}`}
          </button>
        </>
      )}
      <button
        className="mt-4 w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={onClose}
        disabled={loading}
      >
        Close
      </button>
    </div>
  );
};

export default PaymentModal;
