// MyComponent.js

import React, { useState } from 'react';

const MyComponent = () => {
    const people = [
        {
            "id": 1,
            "name": "John Doe",
            "picture": "https://randomuser.me/api/portraits/men/1.jpg"
        },
        {
            "id": 2,
            "name": "Jane Doe",
            "picture": "https://randomuser.me/api/portraits/women/2.jpg"
        },
        {
            "id": 3,
            "name": "Alice Smith",
            "picture": "https://randomuser.me/api/portraits/women/3.jpg"
        },
        {
            "id": 4,
            "name": "Bob Johnson",
            "picture": "https://randomuser.me/api/portraits/men/4.jpg"
        },
        {
            "id": 5,
            "name": "Emily Wilson",
            "picture": "https://randomuser.me/api/portraits/women/5.jpg"
        },
        {
            "id": 6,
            "name": "Michael Brown",
            "picture": "https://randomuser.me/api/portraits/men/6.jpg"
        },
        {
            "id": 7,
            "name": "Jessica Lee",
            "picture": "https://randomuser.me/api/portraits/women/7.jpg"
        },
        {
            "id": 8,
            "name": "David Clark",
            "picture": "https://randomuser.me/api/portraits/men/8.jpg"
        }
    ];

    const [selectedPerson, setSelectedPerson] = useState(null);

    const handleClick = (personId) => {
        setSelectedPerson(personId === selectedPerson ? null : personId);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-4">
            <p className="text-xl font-bold mb-8">Select Similar Word</p>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8">
                {people.map(person => (
                    <div
                        key={person.id}
                        className={`bg-red-100 flex items-center justify-center h-15 md:h-20 rounded-lg ${selectedPerson === person.id ? 'hover:bg-red-300' : 'hover:bg-red-200'}`}
                        onClick={() => handleClick(person.id)}
                    >
                        <p className="text-center text-l font-bold">{person.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyComponent;
