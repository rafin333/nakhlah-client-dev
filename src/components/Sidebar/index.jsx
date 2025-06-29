import Link from 'next/link'
import React from 'react'

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  
} from "@heroicons/react/24/solid";
import { MdLeaderboard, MdMore } from "react-icons/md";
import { FaToolbox , FaBagShopping} from "react-icons/fa6";
import { FaUser, FaHome } from "react-icons/fa";
const Sidebar = () => {
  return (
    <>
  {/* <button
    data-drawer-target="default-sidebar"
    data-drawer-toggle="default-sidebar"
    aria-controls="default-sidebar"
    type="button"
    className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
  >
    <span className="sr-only">Open sidebar</span>
    <svg
      className="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      />
    </svg>
  </button> */}
  <aside
    id="default-sidebar"
    className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >

    <div    style={{backgroundColor: "#fefaef",  overflow: "hidden"}} className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      {/* <ul className="space-y-2 font-medium">
         <li>
          <Link
            href="/learn"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 22 21"
            >
              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
            </svg>
            <span className="ms-3">Dashboard</span>
          </Link>
        </li> 
        <li>
          <Link
            href="/profile"
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
          >
            <svg
              className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
            <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
              Pro
            </span>
          </Link>
        </li> 

      </ul> */}
{/* 
       <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
     
      */}

    
      <div className="mb-2 p-3" style={{position: "relative", top: "-40px"}}>
      <img src="image/Nakhlah_Logo.svg" alt="logo" style={{transform : "scale(1.5)"}} />
      {/* C:\Users\acer\Desktop\nakhlah user\NakhlahSaudi-UserUI\public\image\Nakhlah Logo SVG.svg */}
        {/* <Typography variant="h5" color="#935a38" style={{textAlign: "center", position: "relative", top: "-23px", fontSize: "28px", color: "#935a38" }}>
          Nakhlah
        </Typography> */}
      </div>
      <List  style={{position: "relative", top: "-90px", transform : "scale(0.9)", lineHeight: "0.5px"}} >
     
        <ListItem >
        <Link
            href="/learn"
            className="flex items-center p-2 text-gray-900 rounded-lg"
          >
          <ListItemPrefix>
            <FaHome className="h-5 w-5"  style={{color:" #46a672"}}/>
            
          </ListItemPrefix>
         HOME
          </Link>
        </ListItem>
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
         
          <ListItemPrefix>
            <MdLeaderboard   style={{color:" ##cb941c"}} className="h-5 w-5" />
          </ListItemPrefix>
         LEADERBOARD
        </ListItem>
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
        <Link
            href="/quests"
            className="flex items-center p-2 text-gray-900 rounded-lg"
          >
          <ListItemPrefix>
            <FaToolbox   style={{color:" #d20e15"}} className="h-5 w-5" />
          </ListItemPrefix>
          QUESTS
          </Link>
          <ListItemSuffix>
            <Chip value="3" size="sm" variant="ghost" color="blue-gray" className="rounded-full" />
          </ListItemSuffix>
        </ListItem>
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
          <ListItemPrefix>
            <FaBagShopping   style={{color:" #279b5a"}}className="h-5 w-5" />
          </ListItemPrefix>
          SHOP
        </ListItem>
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
        <Link
            href="/profile"
            className="flex items-center p-2 text-gray-900 rounded-lg"
          >
          <ListItemPrefix>
            <FaUser   style={{color:" #7e68a9"}} className="h-5 w-5" />
          </ListItemPrefix>
          PROFILE
          </Link>
        </ListItem>
        <hr className="my-2 border-blue-gray-50" />
        <ListItem>
          <ListItemPrefix>
            <MdMore style={{color: "#6e6d6e"}} className="h-5 w-5" />
          </ListItemPrefix>
          MORE 
        </ListItem>
      </List>
    {/* </Card>  */}
    </div>
    
  </aside>
 
</>

  )
}

export default Sidebar




