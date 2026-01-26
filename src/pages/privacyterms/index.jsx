import React from "react";
import Head from "next/head";
import Link from "next/link";
import PrivacyPolicyCheck from "@/components/QueryScreen/PrivacyPolicyTnC/PrivacyPolicyTnC";

function TermsAndConditionsPage() {
  return (
    <>
      <Head>
        <title>Nakhlah Terms & Conditions</title>
      </Head>

      <div className="flex flex-col items-center min-h-screen p-6 bg-[#f8f1db]">
        <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-white/50">

          <h1 className="text-3xl font-bold mb-6 text-center text-[#229B59]">
            Privacy Policy & Terms Conditions
          </h1>

          <div className="space-y-8 text-gray-700">
            <p className="text-center text-lg">
              Please read these terms carefully before using the Nakhlah app.
            </p>

            {/* Terms Content */}
            <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-100 shadow-sm">
              <div className="max-w-none text-left">
                <PrivacyPolicyCheck />
              </div>
            </div>

          </div>

          <div className="mt-10 text-center">
            <Link href="/">
              <button className="popbuttonPrimary">Back to Home</button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default TermsAndConditionsPage;
