import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetLearningJourneyPointerQuery } from "@/redux/features/learnerInfos/learnerInfosApi";
import { TagTypes } from "@/constants/tagTypes";

const CurrentCapacity = ({ onContinue }) => {
  const query = {
    populate: "*",
  };
  const { data } = useGetLearningJourneyPointerQuery({ ...query });
  console.log("LJ POINTER ==> ",data);
  const [selectedLJPointerId, setSelectedLJPointerId] = useState(null);

  const handleLJPointerSelect = (id) => {
    setSelectedLJPointerId(id);
  };

  const handleContinue = () => {
    // Call the onContinue prop with the selectedLJPointerId
    console.log((selectedLJPointerId)?selectedLJPointerId:(!!data)&&data[0]?.id);
    onContinue((selectedLJPointerId)?selectedLJPointerId:(!!data)&&data[0]?.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4 p-4">
      <h2 className="text-2xl font-semibold mb-8">{TagTypes.LEARNING_JOURNEY_POINTER}</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {data?.map((LJPointer) => (
          <div
            key={LJPointer.id}
            className={` shadowCustom flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer relative transition duration-300 ease-in-out transform focus:outline-none${
              selectedLJPointerId === LJPointer.id &&
              "bg-indigo-900 shadow-lg shadowCustom activeBorder"
            } `}
            style={{
              transform:
              selectedLJPointerId === LJPointer.id ? "translateY(-10px)" : "none",
            }}
            onClick={() => handleLJPointerSelect(LJPointer.id)}
          >
            <div className="w-24 h-24 mb-4">
              <Image
                src={
                  // LJPointer.attributes.icon.data.attributes.url.startsWith("http")
                  //   ? LJPointer.attributes.icon.data.attributes.url
                  //   : 
                    process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${LJPointer?.attributes?.icon?.data?.attributes?.url}`
                }
                alt={`LJPointer Media: ${LJPointer.attributes.title}`}
                width={100}
                height={100}
                objectFit="contain"
                priority={true}
              />
            </div>
            <span style={{paddingTop:'15px'}}>{`${LJPointer.attributes.title} `}</span>
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

export default CurrentCapacity;
