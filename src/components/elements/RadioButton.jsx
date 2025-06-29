// RadioCardOptions.js

import React from 'react';

const RadioCardOptions = ({ options }) => {
    return (
        <div className="flex flex-wrap justify-center">
            {options.map((option) => (
                <label key={option.id} className="block border border-gray-300 rounded-lg p-4 m-2 text-center cursor-pointer transition duration-300 ease-in-out hover:border-gray-500">
                    <input type="radio" id={`option${option.id}`} name="options" value={`option${option.id}`} className="hidden" />
                    <span className="block font-bold mb-2">{option.attributes.title}</span>
                    <img src={`https://via.placeholder.com/150?text=${encodeURIComponent(option.attributes.title)}`} alt={`${option.attributes.title} Image`} className="mx-auto" />
                </label>
            ))}
        </div>
    );
};

export default RadioCardOptions;
