import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
const CenterA = () => {
    const people = [
        {
            "id": 1,
            "name": "John Doe",
            "picture": "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
            "id": 2,
            "name": "Jane Doe",
            "picture": "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            "id": 3,
            "name": "Bob Johnson",
            "picture": "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
            "id": 4,
            "name": "Emily Wilson",
            "picture": "https://randomuser.me/api/portraits/men/4.jpg",
        },
    ];

    const animal = [
        {
            "id": 1,
            "name": "Alice Smith",
        },
    ];

    const correctCount = 7;
    const totalCount = 10;
    const correctPercentage = (correctCount / totalCount) * 100;
    // Assuming 70% correct
    return (
        <div className="max-w-3xl mx-auto px-4 py-4">


            <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="col-span-6">
                    <div className="rounded-full bg-gray-400 text-xs leading-none h-5 w-100 flex items-center justify-center text-white mt-2">
                        <div className="bg-green-500 h-full rounded-l-full" style={{ width: `${correctPercentage}%` }}></div>
                        <div className="bg-gray-400 h-full rounded-r-full" style={{ width: `${100 - correctPercentage}%` }}></div>
                    </div>
                </div>
                <div><FontAwesomeIcon icon={faHeart} style={{ color: 'red', fontSize: '24px' }} /> <span style={{ fontSize: '24px' }} >06 </span> </div>
                {/* <div>06</div> */}
            </div>



            <p className="text-xl font-bold mb-8 text-center">Select Similar Word</p>

            <div className="grid grid-cols-6 gap-4">
                <div className="col-start-1 col-span-1  border border-gray-300 p-2 flex flex-col items-center">
                    {people.length > 0 && (
                        <>
                            {/* {people[0].name} */}
                            {people[0].picture && (
                                <img
                                    src={people[0].picture}
                                    alt={people[0].name}
                                    style={{ width: '100px', height: 'auto' }}
                                />
                            )}
                        </>
                    )}
                </div>


                <div className="col-end-7 col-span-1 border border-gray-300 p-2 flex flex-col items-center">
                    {people.length > 1 && (
                        <>
                            {/* {people[1].name} */}
                            {people[1].picture && <img src={people[1].picture} alt={people[1].name} style={{ width: '100px', height: 'auto' }} />}
                        </>
                    )}
                </div>
                <div className="col-start-3 col-span-2 bg-red-100 flex justify-center items-center h-5 md:h-10 rounded-lg border border-gray-600">
                    {animal.length > 0 && (
                        <p className="text-center">{animal[0].name}</p>
                    )}
                </div>


                <div className="col-start-1 col-span-1 border border-gray-300 p-2 flex flex-col items-center">
                    {people.length > 2 && (
                        <>
                            {/* {people[2].name} */}
                            {people[2].picture && <img src={people[2].picture} alt={people[2].name} style={{ width: '100px', height: 'auto' }} />}
                        </>
                    )}
                </div>
                <div className="col-end-7 col-span-1 border border-gray-300 p-2 flex flex-col items-center">
                    {people.length > 3 && (
                        <>
                            {/* {people[3].name} */}
                            {people[3].picture && <img src={people[3].picture} alt={people[3].name} style={{ width: '100px', height: 'auto' }} />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CenterA;
