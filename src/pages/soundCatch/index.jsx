import React, { useState } from 'react';

const SoundCatch = () => {
    const people = [
        {
            "id": 1,
            "name": "John Doe",
            "picture": "https://randomuser.me/api/portraits/men/1.jpg",
           
        },
        {
            "id": 2,
            "name": "Jane Doe",
            "picture": "https://randomuser.me/api/portraits/men/1.jpg",
            
        },
        {
            "id": 3,
            "name": "Alice Smith",
            

        },
        {
            "id": 4,
            "name": "Bob Johnson",
            "picture": "https://randomuser.me/api/portraits/men/1.jpg",

        },
        {
            "id": 5,
            "name": "Emily Wilson",
            "picture": "https://randomuser.me/api/portraits/men/1.jpg",

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


                <div className="w-full sm:w-1/2">
                    <img src='https://thumbs.dreamstime.com/b/cute-boy-show-confused-expression-question-mark-210287403.jpg' className="w-full h-auto" />

                </div>
                <div className="w-full sm:w-1/2">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        {peopleWithImages.map(person => (
                            <div className='bg-yellow-100 flex items-center justify-center h-5 md:h-10 rounded-lg border border-gray-600' key={person.id}>
                                <p className="text-center">{person.name}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {peopleWithoutImages.map(person => (
                            <div
                                key={person.id}
                                className={`bg-red-100 flex items-center justify-center h-5 md:h-12 rounded-lg ${selectedPerson === person.id ? 'hover:bg-red-300' : 'hover:bg-red-200'}`}
                                onClick={() => handleClick(person.id)}
                            >
                                <p className="text-center text-l font-bold">{person.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SoundCatch;
