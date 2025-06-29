import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useGetLearningGoalsQuery } from "@/redux/features/learnerInfos/learnerInfosApi";

const LearningGoalSelector = ({ onContinue }) => {
  // Accept onContinue as a prop
  const query = {
    populate: "*",
  };
  const { data } = useGetLearningGoalsQuery({ ...query });
  console.log(data);
  const [selectedGoalId, setSelectedGoalId] = useState(0);

  const handleGoalSelect = (id) => {
    setSelectedGoalId(id);
  };

  const handleContinue = () => {
    // Call the onContinue prop with the selectedGoalId
    console.log((selectedGoalId)?selectedGoalId:(!!data)&&data[0]?.id);
    onContinue((selectedGoalId)?selectedGoalId:(!!data)&&data[0]?.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4 p-4">
      <h2 className="text-2xl font-semibold mb-8">Select your learning goal</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {data?.map((goal) => (
          <div
            key={goal.id}
             
            className={` shadowCustom flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer relative transition duration-300 ease-in-out transform focus:outline-none${
              selectedGoalId === goal.id &&
              "bg-indigo-900 shadow-lg shadowCustom activeBorder"
            } `}
            style={{
              transform:
              selectedGoalId === goal.id ? "translateY(-10px)" : "none",
            }}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <div className="w-24 h-24 mb-4">
              <Image
                src={
                  goal.attributes.icon.data.attributes.url.startsWith("http")
                    ? goal.attributes.icon.data.attributes.url
                    : process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${goal.attributes.icon.data.attributes.url}`
                }
                alt={`Goal ${goal.attributes.time}`}
                width={100}
                height={100}
                objectFit="contain"
                priority={true}
              />
            </div>
            <span>{`${goal.attributes.time} minutes`}</span>
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

export default LearningGoalSelector;
