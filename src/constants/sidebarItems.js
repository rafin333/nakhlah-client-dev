import {
  FaHome,
  FaSignOutAlt,
  FaUser
} from "react-icons/fa";
import {
  MdLeaderboard,
  MdMore
} from "react-icons/md";
import {
  FaToolbox,
  FaBagShopping
} from "react-icons/fa6";

import homeIcon from '../../public/icons/Home-Icon.svg' 
import leaderboardIcon from '../../public/icons/LEADERBOARD.svg'
import profileIcon from '../../public/icons/Profile.svg'
import questIcon from '../../public/icons/QUEST.svg'
import storeIcon from '../../public/icons/STORE.svg'
import logoutIcon from '../../public/logout.svg'
// import searchIcon from '../../public/icons/More.svg'
import Image from "next/image";

function HomeIconCustom() {return (<Image src={homeIcon} alt="Home icon" width={45} height={30} />);}
function LeaderboardIconCustom() {return (<Image src={leaderboardIcon} alt="Leaderboard icon" width={45} height={30} />);}
function ProfileIconCustom() {return (<Image src={profileIcon} alt="Profile icon" width={45} height={30} />);}
function QuestIconCustom() {return (<Image src={questIcon} alt="Quest icon" width={45} height={30} />);}
function StoreIconCustom() {return (<Image src={storeIcon} alt="Store icon" width={45} height={30} />);}
function logoutIconCustom() {return (<Image src={logoutIcon} alt="logout icon" width={40} height={30} />);}
// function SearchIconCustom() {return (<Image src={searchIcon} alt="Store icon" width={45} height={30} />);}

const sidebarItems = [{
    href: '/',
    label: 'home',
    Icon: HomeIconCustom,
    color: "#46a672"
  },
  {
    href: '/leaderboard',
    label: 'leaderboard',
    Icon: LeaderboardIconCustom,
    color: "##cb941c"
  },
  // {
  //   href: '/quests',
  //   label: 'quests',
  //   Icon: QuestIconCustom,
  //   color: "#d20e15",
  //  // chipValue: '3'
  // },
  {
    href: '/store',
    label: 'STORE',
    Icon: StoreIconCustom,
    color: "#279b5a"
  },
  {
    href: '/profile',
    label: 'profile',
    Icon: ProfileIconCustom,
    color: "#7e68a9"
  },
  {
    href: '/logout',
    label: 'logout',
    Icon: logoutIconCustom,
    color: "#333333"
  },
  // {
  //   label: 'more',
  //   Icon: SearchIconCustom,
  //   color: "#6e6d6e"
  // }
];

export default sidebarItems;