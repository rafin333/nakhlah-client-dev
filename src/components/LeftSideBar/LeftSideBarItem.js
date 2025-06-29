// import React from "react";
// import Link from "next/link";
// import {
//   ListItem,
//   ListItemPrefix,
//   ListItemSuffix,
//   Chip,
// } from "@material-tailwind/react";
// import { useTranslation } from "next-i18next";
// import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";

// const LeftSideBarItem = ({ href, label, Icon, color, chipValue }) => {
//   const { t } = useTranslation(TRANSLATION_NAMESPACES.leftSideBar);

//   console.log("t(label)", t(label));
//   console.log("href", href);

//   return (
//     <ListItem className="bg-[#ffffff59]">
//       {/* {href=== undefined  ? (
//         <Link
//           href= "/"
//           className="flex items-center p-2 text-gray-900 font-bold rounded-lg ext-sm text-l"
//         >
//           <ListItemPrefix>
//             <Icon className="h-5 w-5" style={{ color }} />
//           </ListItemPrefix>
//           &nbsp;
//           {t(label)}
//         </Link>
//       ) : 
//       href  ? ( */}
//       <Link
//         href={href}
//         className="flex items-center p-2 text-l text-gray-900 font-bold rounded-lg 3xl:py-3 4xl:py-4 "
//       >
//         <ListItemPrefix style={{width:'2rem'}}>
//           <Icon className="h-5 w-5" style={{ color }} />
//         </ListItemPrefix>
//         &nbsp;
//         <div className="text-[1vw]">{t(label)}</div>
//       </Link>
//       {/* ) :

//       (
//         <div className="flex items-center p-2 text-gray-900 font-bold rounded-lg text-l">
//           <ListItemPrefix>
//             <Icon className="h-5 w-5" style={{ color }} />
//           </ListItemPrefix>
//           &nbsp;
//           {t(label)}
//           {chipValue && (
//             <ListItemSuffix>
//               <Chip
//                 value={chipValue}
//                 size="sm"
//                 variant="ghost"
//                 color="blue-gray"
//                 className="text-xs md:text-sm rounded-full "
//               />
//             </ListItemSuffix>
//           )}
//         </div>
//       )} */}
//     </ListItem>
//   );

//   //   return(
//   // <div>
//   // <ListItem>
//   // <Link
//   //           href="/"
//   //           className="flex items-center p-2 text-gray-900 font-bold rounded-lg"
//   //         >
//   //           <ListItemPrefix>
//   //             <Icon className="h-5 w-5" style={{ color }} />
//   //           </ListItemPrefix>
//   //           {t(label)}
//   //         </Link>

//   // </ListItem>

//   // </div>

//   //   );
// };

// export default LeftSideBarItem;






import React from "react";
import Link from "next/link";
import {
  ListItem,
  ListItemPrefix,
  Chip,
} from "@material-tailwind/react";
import { useTranslation } from "next-i18next";
import { TRANSLATION_NAMESPACES } from "@/constants/translationNamespaces";

const LeftSideBarItem = ({
  href,
  label,
  Icon,
  color,
  chipValue,
  selectedItem,
  setSelectedItem,
}) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.leftSideBar);
  const isSelected = selectedItem === href;

  return (
    <ListItem
      className={`w-full flex items-center rounded-lg transition-transform duration-300 transform ${
        isSelected
          ? "bg-[rgb(203,143,21)] text-white"
          : "bg-[#ffffff59] hover:bg-[rgb(251,214,135)] text-gray-900 hover:scale-105"
      }`}
      onClick={() => setSelectedItem(href)}
    >
      <Link
        href={href}
        className="w-full flex items-center p-1 text-lg font-bold"
      >
        <ListItemPrefix className="flex-shrink-0 mr-3">
          <Icon className="h-6 w-6" style={{ color }} />
        </ListItemPrefix>

        <div className="flex-grow">{t(label)}</div>

        {chipValue && (
          <Chip
            value={chipValue}
            className="text-xs font-semibold bg-gray-100 text-gray-700"
          />
        )}
      </Link>
    </ListItem>
  );
};

export default LeftSideBarItem;


