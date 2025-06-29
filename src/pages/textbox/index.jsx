import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

const SoundCatch = () => {
    const people = [
        {
            "id": 1,
            "name": "I",


        },
        {
            "id": 2,
            "name": "good",


        },
        {
            "id": 3,
            "name": "good",


        },
        {
            "id": 4,
            "name": "very",


        },
        {
            "id": 5,
            "name": "boy",


        },

    ];
    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleClick = (personId) => {
        setSelectedPerson(personId === selectedPerson ? null : personId);
    };

    const peopleWithImages = people.filter(person => person.picture);
    const peopleWithoutImages = people.filter(person => !person.picture); 

    return (
        <div className="max-w-3xl mx-auto px-4 py-4">
            <p className="text-xl font-bold text-center mb-4">Select Similar Word</p>


            <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">


                <div className="w-full sm:w-1/3">
                    <img src='https://thumbs.dreamstime.com/b/cute-boy-show-confused-expression-question-mark-210287403.jpg' className="w-full h-auto" />

                </div>
                <div className="w-full sm:w-2/3">
                    <div className="grid grid-cols-1 gap-2 mb-6">
                        <div className="flex items-center">
                            <FontAwesomeIcon icon={faVolumeHigh} style={{ color: 'orange', fontSize: '2em' }} />
                            <div className='bg-purple-600 flex items-center justify-center h-5 md:h-12 w-40 rounded-lg hover:bg-red-300 ml-2 text-white font-bold'>Boy</div>
                        </div>

                    </div>
                    <textarea className="w-full h-24 border border-black bg-gray-200 rounded-lg p-2 resize-none" />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {people.map(person => (
                            <div key={person.id} className='bg-purple-600 flex items-center justify-center h-5 md:h-12 rounded-lg hover:bg-red-300 text-white font-bold'>{person.name}</div>
                        ))}
                    </div>




                </div>
            </div>

        </div>
    );
};

export default SoundCatch;
