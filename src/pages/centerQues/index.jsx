import React from 'react';

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
            "picture": "https://randomuser.me/api/portraits/men/2.jpg",
        },
        {
            "id": 3,
            "name": "Alice Smith",
            "picture": "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
            "id": 4,
            "name": "Bob Johnson",
            "picture": "https://randomuser.me/api/portraits/men/4.jpg",
        },
        {
            "id": 5,
            "name": "Emily Wilson",
        },
    ];

    // Filter people with images and without images
    const peopleWithImages = people.filter(person => person.picture);
    const personWithoutImage = people.find(person => !person.picture);

    return (
        <div className="max-w-3xl mx-auto px-4 py-4 grid grid-cols-2 gap-4">
            {/* Render the divs for people with images */}
            {peopleWithImages.map((person, index) => (
                <div key={person.id} className={`bg-yellow-100 flex items-center justify-center h-24 rounded-lg border border-gray-400 ${index === 0 ? 'col-start-1 row-start-1' : index === 1 ? 'col-start-2 row-start-1' : index === 2 ? 'col-start-1 row-start-2' : 'col-start-2 row-start-2'}`}>
                    <img src={person.picture} alt={person.name} className="w-20 h-20 rounded-full" />
                    <p className="text-center">{person.name}</p>
                </div>
            ))}
            {/* Render the div for the person without an image in the center */}
            <div className="bg-yellow-100 flex items-center justify-center h-24 rounded-lg border border-gray-400 col-span-2 row-span-2">
                <p className="text-center">{personWithoutImage.name}</p>
            </div>
        </div>
    );
};

export default SoundCatch;
