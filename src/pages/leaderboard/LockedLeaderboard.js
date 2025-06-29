import React, { useEffect, useState } from "react";
import { getBaseURL } from "../../helpers/config/envConfig";
import { FaUser } from 'react-icons/fa';
import Image from "next/image";

function LeaderBoard({ users = [], currentUserPosition = [] }) {


    return (

        <ul
            className="users-list w-full max-w-3xl mx-auto flex flex-col items-center mt-20"
            style={{}}>
            {users?.length > 0 ? (
                users?.map((user, index) => {
                    const isCurrentUser =
                        user?.users_permissions_user?.username ===
                        currentUserPosition[0]?.users_permissions_user?.username;

                    return (
                        <li
                            key={index}
                            className={`user-card flex items-center justify-between px-6 py-4 my-2 w-full rounded-lg  text-white font-bold relative bg-cover bg-center`}

                            style={{
                                backgroundImage: `url(${isCurrentUser ? "/newOwnLevel.svg" : "/newLevel.svg"})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <span className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none popbuttonWarning"
                                style={{
                                    position: 'absolute',
                                    padding: '0.5rem 1.5rem',
                                    left: '5%',
                                }}>
                                {index + 1}</span>

                            {/* Flag Icon */}
                            <div style={{ position: 'absolute', left: '25%' }}>

                                {user?.country ? (
                                    <Image
                                        src={
                                            process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA +
                                            user?.country?.icon?.url
                                        }
                                        width={40}
                                        height={25}
                                        alt={user?.country?.country}
                                        className="rounded-md ml-[14%] mr-[-5%] border border-[#ffcf32] transition-transform duration-300 hover:scale-105 origin-center object-cover"
                                    />
                                ) : (
                                    <FaUser className="text-red-500 text-3xl bg-black p-1 rounded-full border border-white" />
                                )}
                            </div>

                            {/* Username */}
                            <span className="name text-lg flex-1 text-center">{user?.users_permissions_user?.username}</span>

                            {/* Stock Points */}
                            <span className="points text-xl font-semibold bg-green-500 px-3 py-1 rounded-md">
                                {user?.stock}
                            </span>
                        </li>
                    );
                })
            ) : (
                <li className="text-center text-black-500">No users found</li>
            )}

            {/* Display Current User Separately if Not in Top 10 */}
            {currentUserPosition[0]?.position == 0 && (
                <li
                    key="current-user"
                    className="user-card flex items-center justify-between px-6 py-4 my-2 w-full rounded-lg text-white font-bold relative bg-cover bg-center"
                    style={{ backgroundImage: `url("/newOwnLevel.svg")` }}
                >
                    <span className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none popbuttonWarning"
                        style={{
                            position: 'absolute',
                            padding: '0.5rem 1.5rem',
                            left: '5%',
                        }}
                    >{currentUserPosition[0]?.position} </span>

                    {/* Flag Icon */}
                    <div style={{ position: 'absolute', left: '25%' }}>
                        {currentUserPosition[0]?.country ? (
                            <Image
                                src={
                                    process.env.NEXT_PUBLIC_API_BASE_URL_MEDIA +
                                    currentUserPosition[0]?.country?.icon?.url
                                }
                                width={40}
                                height={25}
                                alt={currentUserPosition[0]?.country?.country}
                                className="rounded-md ml-[14%] mr-[-5%] border border-[#ffcf32] transition-transform duration-300 hover:scale-105 origin-center object-cover"
                            />
                        ) : (
                            <FaUser className="text-white text-3xl bg-black p-1 rounded-full border border-white" />
                        )}
                    </div>
                    {/* Username */}
                    <span className="name text-lg flex-1 text-center">
                        {currentUserPosition[0]?.users_permissions_user?.username}
                    </span>

                    {/* Stock Points */}
                    <span className="points text-xl font-semibold bg-green-500 px-3 py-1 rounded-md">
                        {currentUserPosition[0]?.stock}
                    </span>
                </li>
            )}
        </ul>
        // </section>
    );
}

export default LeaderBoard;
