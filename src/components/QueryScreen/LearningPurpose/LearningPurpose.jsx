import React, { useState } from "react";
import Image from "next/image";
import { useGetLearningPurposeQuery } from "@/redux/features/learnerInfos/learnerInfosApi";

const LearningPurpose = ({ onContinue }) => {
  // Accept onContinue as a prop
  const query = {
    populate: "icon",
  };
  const { data } = useGetLearningPurposeQuery({ ...query });
  console.log(data);
  const [selectedOptionId, setSelectedOptionId] = useState(0);

  const handleOptionClick = (id, i) => {
    console.log(id, i);
    setSelectedOptionId(id);
  };

  const handleContinue = () => {
    // Instead of logging, call the onContinue prop with the selectedOptionId
    console.log(selectedOptionId ? selectedOptionId : !!data && data[0]?.id);
    onContinue(selectedOptionId ? selectedOptionId : !!data && data[0]?.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4">
      <h2 className="text-2xl font-semibold mb-8">
        What is your learning purpose?
      </h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {data?.map((option, i) => (
          <div
            key={option.id}
            className={` shadowCustom flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer relative transition duration-300 ease-in-out transform focus:outline-none${
              selectedOptionId === option.id
                && "bg-indigo-900 shadow-lg shadowCustom activeBorder"
            } `}
            style={{
              transform:
              selectedOptionId === option.id ? "translateY(-10px)" : "none",
            }}
            onClick={() => handleOptionClick(option.id, i)}
          >
            <div className="w-24 h-24 mb-4">
              <Image
                src={
                  option.attributes.icon?.data?.attributes?.url
                    ? process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${option.attributes.icon?.data?.attributes?.url}`
                    : "/placeholder.jpg"
                }
                alt={option.attributes.purpose}
                width={100}
                height={100}
                objectFit="contain"
                priority={true}
              />
            </div>
            <span className="mt-4">{option?.attributes?.title}</span>
          </div>
        ))}
      </div>
      <button onClick={handleContinue} className="popbuttonPrimary">
        Continue
      </button>
    </div>
  );
};

export default LearningPurpose;
