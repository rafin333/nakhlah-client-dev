import PrivacyPolicyCheck from "@/components/QueryScreen/PrivacyPolicyTnC/PrivacyPolicyTnC";
import React from "react";

function PrivacyTerms() {
  return (
    <>
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <PrivacyPolicyCheck />
        <button className="popbuttonDanger" onClick={()=>window.close()}>Close</button>
      </div>
    </>
  );
}

export default PrivacyTerms;
