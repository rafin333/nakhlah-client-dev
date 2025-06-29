import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  useGetPPoliciesQuery,
  useGetTnConditionsQuery,
} from "@/redux/features/generalSetup/generalSetupApi";
import { Checkbox, Typography } from "@material-tailwind/react";

const PrivacyPolicyCheck = ({ onContinue }) => {
  // Accept onContinue as a prop
  const query = {
    populate: "*",
  };
  const { data } = useGetPPoliciesQuery({ ...query });
  const { data: termsData } = useGetTnConditionsQuery({ ...query });
  console.log(termsData);
  const [PPTC, setPPTC] = useState(false);

  const handlePPTCCheck = () => {
    if (!PPTC) {
      setPPTC(true);
    } else {
      setPPTC(false);
    }
    console.log(PPTC);
  };

  // const handleContinue = () => {
  //     // Call the onContinue prop with the PPTC
  //     console.log(PPTC)
  //     onContinue(PPTC)
  // };

  return (
    <div className="">
      <h2 className="text-2xl font-semibold mb-8">Privacy Policy</h2>
      {data?.map((PPTC) => (
        <>
          <div className="justify-content-center px-[250px]">
            <div
              dangerouslySetInnerHTML={{ __html: PPTC?.attributes?.details }}
            />
            {/* {PPTC?.attributes?.details} */}
          </div>

          {/* <div className={`flex items-center mt-8 ${PPTC === PPTC ? "bg-green-100 border-green-800" : "border-gray-300"}`}>
                        <input id="checkbox" type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500" onClick={() => handlePPTCCheck()} />
                        <label htmlFor="checkbox" className="ml-2 text-gray-700">I agree to the PRIVACY POLICY</label>
                    </div> */}
        </>
      ))}

      <h2 className="text-2xl font-semibold mb-8">Terms and Condition</h2>

      {termsData?.map((TC) => (
        <>
          <div className="justify-content-center px-[250px]">
            <div
              dangerouslySetInnerHTML={{ __html: TC?.attributes?.details }}
            />
            {/* {PPTC?.attributes?.details} */}
          </div>

          {/* <div className={`flex items-center mt-8 ${PPTC === PPTC ? "bg-green-100 border-green-800" : "border-gray-300"}`}>
                        <input id="checkbox" type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500" onClick={() => handlePPTCCheck()} />
                        <label htmlFor="checkbox" className="ml-2 text-gray-700">I agree to the PRIVACY POLICY</label>
                    </div> */}
        </>
      ))}
    </div>
  );
};

export default PrivacyPolicyCheck;
