import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetSocialTrafficQuery } from "@/redux/features/learnerInfos/learnerInfosApi";

const SocialTrafficSelector = ({ onContinue }) => {
  // Accept onContinue as a prop
  const query = {
    populate: "*",
  };
  const { data } = useGetSocialTrafficQuery({ ...query });
  console.log(data);
  const [selectedSocaialTrafficId, setSelectedSocaialTrafficId] = useState(null);

  const handleSocaialTrafficSelect = (id) => {
    setSelectedSocaialTrafficId(id);
  };

  const handleContinue = () => {
    // Call the onContinue prop with the selectedSocaialTrafficId
    console.log((selectedSocaialTrafficId)?selectedSocaialTrafficId:(!!data)&&data[0]?.id);
    onContinue((selectedSocaialTrafficId)?selectedSocaialTrafficId:(!!data)&&data[0]?.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4 p-4">
      <h2 className="text-2xl font-semibold mb-8">Please tell us where did you find us?</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {data?.map((social) => (
          <div
            key={social.id}
            className={` shadowCustom flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer relative transition duration-300 ease-in-out transform focus:outline-none${
              selectedSocaialTrafficId === social.id &&
              "bg-indigo-900 shadow-lg shadowCustom activeBorder"
            } `}
            style={{
              transform:
              selectedSocaialTrafficId === social.id ? "translateY(-10px)" : "none",
            }}
            onClick={() => handleSocaialTrafficSelect(social.id)}
          >
            <div className="w-24 h-24 mb-4">
              <Image
                src={
                  social.attributes.icon.data.attributes.url.startsWith("http")
                    ? social.attributes.icon.data.attributes.url
                    : process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${social.attributes.icon.data.attributes.url}`
                }
                alt={`Social Media: ${social.attributes.trafficName}`}
                width={100}
                height={100}
                objectFit="contain"
                priority={true}
              />
            </div>
            <span>{`${social.attributes.trafficName}`}</span>
          </div>
        ))}
      </div>
      <button
        onClick={handleContinue}
        className="popbuttonPrimary"
      >
        Continue
      </button>
    </div>
  );
};

export default SocialTrafficSelector;
