import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faClock, faGlobeAmericas, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const LearningInfoDetails = ({ learnerInfos }) => {
  return (
    <div className="space-y-8">
      {learnerInfos.map(info => (
        <div key={info.id} className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
            Learning Purpose: {info?.learning_purpose?.purpose}
          </h2>
          <p className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            <strong>Goal Time: </strong> {info?.learning_goal?.time} days
          </p>
          <p className="mb-2 flex items-center">
            <FontAwesomeIcon icon={faGlobeAmericas} className="mr-2" />
            <strong>Language: </strong> {info?.language?.name} ({info?.language?.country})
          </p>
          <p className="mb-4 flex items-center">
            <strong>Registered: </strong> {info?.registered ? 'Yes' : 'No'}
          </p>
          <div className="text-gray-500">
            <p className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Created At: {new Date(info?.createdAt).toLocaleDateString()}
            </p>
            <p className="flex items-center">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
              Updated At: {new Date(info?.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearningInfoDetails;
