import React, { useState } from "react";
import {
  useGetPPoliciesQuery,
  useGetTnConditionsQuery,
} from "@/redux/features/generalSetup/generalSetupApi";

const PrivacyPolicyCheck = () => {
  const query = { populate: "*" };

  const { data: privacyData } = useGetPPoliciesQuery(query);
  const { data: termsData } = useGetTnConditionsQuery(query);

  const [accepted, setAccepted] = useState(false);

  return (
    <div className="w-full space-y-12 text-gray-700 leading-relaxed">

      {/* Privacy Policy */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Privacy Policy
        </h2>

        {privacyData?.map((item) => (
          <div
            key={item.id}
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: item?.attributes?.details,
            }}
          />
        ))}
      </section>

      {/* Terms & Conditions */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Terms & Conditions
        </h2>

        {termsData?.map((item) => (
          <div
            key={item.id}
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{
              __html: item?.attributes?.details,
            }}
          />
        ))}
      </section>

    </div>
  );
};

export default PrivacyPolicyCheck;
