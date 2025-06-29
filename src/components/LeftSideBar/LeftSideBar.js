// // Import the sidebar items constant
// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import {
//   Typography,
//   List,
//   ListItem,
//   ListItemPrefix,
//   ListItemSuffix,
//   Chip,
// } from "@material-tailwind/react";
// import sidebarItems from "@/constants/sidebarItems";
// import LeftSideBarItem from "./LeftSideBarItem";
// import { useGetUserInfoQuery } from "@/redux/features/auth/authApi";
// // LeftSidebar Component
// const LeftSidebar = () => {
//   const { data } = useGetUserInfoQuery({});
//   const [profile, setProfile] = useState({
//     username: "",
//     email: "",
//     createdAt: "",
//   });

//   const updatedMenuItems = sidebarItems.map((item) => {
//     if (item.label === "profile") {
//       // return { ...item, label: data?.username }; // Spread existing properties and update label
//       return item; // Keep other items unchanged

//     } else {
//       return item; // Keep other items unchanged
//     }
//   });

//   return (
//     <>
//       <div className="sideBarBG h-full px-3 py-4 z-10">
//         <div
//           className="mb-2 p-3"
//           style={{ position: "relative", top: "-40px" }}
//         >
//           <div
//             className="relative"
//             style={{
//               width: "100%",
//               height: "0",
//               paddingBottom: "100%",
//               transform: "scale(1.5)",
//             }}
//           >
//             <Image
//               src="/image/Nakhlah_Logo.svg"
//               alt="logo"
//               layout="fill"
//               objectFit="contain"
//             />
//           </div>
//           {/* <img src="image/Nakhlah_Logo.svg" alt="logo" style={{transform : "scale(1.5)"}} /> */}
//           {/* <Typography variant="h5" className="text-center" style={{ top: "-23px", fontSize: "28px", color: "#935a38", position: "relative" }}>
//               Nakhlah
//             </Typography> */}

//           {/* {window.innerWidth} */}
//         </div>
//         <List className="sideList">
//           {updatedMenuItems.map((item, index) => (
//             <React.Fragment key={index}>
//               <LeftSideBarItem {...item} />
//               <hr className="my-2 border-blue-gray-50" />
//             </React.Fragment>
//           ))}
//         </List>
//       </div>
//     </>
//   );
// };

// export default LeftSidebar;


import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import sidebarItems from "@/constants/sidebarItems";
import LeftSideBarItem from "./LeftSideBarItem";
import { useGetUserInfoQuery } from "@/redux/features/auth/authApi";


const LeftSidebar = () => {
  const { data } = useGetUserInfoQuery({});
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    createdAt: "",
  });

  const [selectedItem, setSelectedItem] = useState(""); 

  // const updatedMenuItems = sidebarItems.map((item) => {
  //   if (item.label === "profile") {
  //     return { ...item, label: data?.username || item.label }; 
  //   } else {
  //     return item; 
  //   }
  // });

    const updatedMenuItems = sidebarItems.map((item) => {
    if (item.label === "profile") {      
      return item; 
    } else {
      return item; 
    }
  });

  return (
    <div className="sideBarBG h-full px-3 py-4 z-10">
     
      <div className="mb-2 p-3" style={{ position: "relative", top: "-40px" }}>
        <div
          className="relative"
          style={{
            width: "100%",
            height: "0",
            paddingBottom: "100%",
            transform: "scale(1.5)",
          }}
        >
          <Image
            src="/image/Nakhlah_Logo.svg"
            alt="logo"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>

      
      <List className="sideList">
        {updatedMenuItems.map((item, index) => (
          <React.Fragment key={index}>
            <LeftSideBarItem
              {...item}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
            <hr className="my-2 border-blue-gray-50" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default LeftSidebar;
