import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const LanguageSwitcher = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const changeLanguage = (locale) => {
    setSelectedLanguage(locale);
    i18n.changeLanguage(locale);
    router.push(router.pathname, router.asPath, { locale });
  };

  return (
    <div className="flex items-center bg-golden-yellow text-white rounded-lg shadow-md p-4 w-full max-w-xs">
      <GlobeAltIcon className="h-6 w-6 text-white-600 mr-2" />
      {/* <p className="text-sm text-gray-700 font-medium mr-4">Select Language</p> */}

      {/* Custom dropdown */}
      <div className="relative flex-1">
        <select
          value={selectedLanguage}
          onChange={(e) => changeLanguage(e.target.value)}
          className="block w-full bg-white border border-gray-300 text-gray-600 py-2 px-3 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
          <option value="id">Indonesia</option>
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          {/* <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          > */}
            {/* <path
              fillRule="evenodd"
              d="M5.293 7.707a1 1 0 011.414 0L10 11.414l3.293-3.707a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg> */}
        </span>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
