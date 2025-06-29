import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaToolbox, FaUser } from 'react-icons/fa';
import { FaBagShopping } from 'react-icons/fa6';
import { MdLeaderboard, MdMore } from 'react-icons/md';

const BottomNav = () => {
  return (
    <nav className="bg-white shadow-lg fixed inset-x-0 bottom-0 z-10 px-1 py-2">
      <div className="flex justify-around text-center">
        <Link href="/learn">
          <div className="flex flex-col items-center cursor-pointer">
            <FaHome size={40} color="#46a672"/>
          </div>
        </Link>
        <Link href="/learn">
          <div className="flex flex-col items-center cursor-pointer">
            <MdLeaderboard size={40} color="##cb941c"/>
          </div>
        </Link>
        <Link href="/shop">
          <div className="flex flex-col items-center cursor-pointer">
            <FaBagShopping size={40} color="#279b5a"/>
          </div>
        </Link>
        <Link href="/quests">
          <div className="flex flex-col items-center cursor-pointer">
            <FaToolbox size={40} color="#d20e15"/>
          </div>
        </Link>
        <Link href="/profile">
          <div className="flex flex-col items-center cursor-pointer">
            <FaUser size={40} color="#7e68a9"/>
          </div>
        </Link>
        <Link href="/">
          <div className="flex flex-col items-center cursor-pointer">
            <MdMore size={40} color="#6e6d6e"/>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
