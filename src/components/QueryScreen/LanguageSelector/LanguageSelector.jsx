import { useGetCountryQuery } from "@/redux/features/languages/languagesApi";
import Image from "next/image";
import React, { useState, useEffect } from "react";

const LanguageSelector = ({ onContinue }) => {
  // Accept onContinue as a prop
  const [selectedLanguageId, setSelectedLanguageId] = useState(0);
  const query = {
    populate: "*",
  };
  const { data } = useGetCountryQuery({ ...query });

  console.log(data);

  const handleLanguageSelect = (id) => {
    setSelectedLanguageId(id);
  };

  const handleContinue = () => {
    // Call the onContinue prop with the selectedLanguageId
    console.log(
      selectedLanguageId ? selectedLanguageId : !!data && data[0]?.id
    );
    onContinue(selectedLanguageId ? selectedLanguageId : !!data && data[0]?.id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-rgb(248 241 219 / var(--tw-bg-opacity, 1)) p-4">
      <h2 className="text-2xl font-semibold mb-8">Where are you from?</h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {data?.map((language) => (
          <div
            key={language.id}
            className={` shadowCustom flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer relative transition duration-300 ease-in-out transform focus:outline-none${
              selectedLanguageId === language.id &&
              "bg-indigo-900 shadow-lg shadowCustom activeBorder"
            } `}
            style={{
              transform:
              selectedLanguageId === language.id ? "translateY(-10px)" : "none",
            }}
            onClick={() => handleLanguageSelect(language?.id)}
          >
            {/* Display both the language name and the country name */}
            <div className="w-24 h-20 pt-2">
              <Image
                src={
                  language.attributes?.icon?.data?.attributes?.url.startsWith(
                    "http"
                  )
                    ? language.attributes?.icon?.data?.attributes?.url
                    : process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA+`${language.attributes?.icon?.data?.attributes?.url}`
                }
                alt={`language Media: ${language?.attributes?.country}`}
                width={100}
                height={100}
                objectFit="contain"
                priority={true}
                style={{height:"95% !important"}}
              />
            </div>
            <span className=" mt-4 font-bold">
              {language?.attributes?.country}
            </span>
            <span className="text-sm ">
              Language :{" "}
              {language?.attributes?.language?.data?.attributes?.language}
            </span>
          </div>
        ))}
      </div>
      <button onClick={handleContinue} className="popbuttonPrimary">
        Continue
      </button>
    </div>
  );
};

export default LanguageSelector;
