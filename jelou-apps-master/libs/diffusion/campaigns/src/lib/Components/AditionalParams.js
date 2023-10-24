import React from 'react';
import StoreParams from './StoreParams';

const AditionalParams = (props) => {
  const {
    arrayParams,
    storeParams,
    updateStoreParams,
    generateStoreParams,
    removeStoreParams,
  } = props;
  return (
    <div className="mb-6">
      {storeParams.map((storeParam) => (
        <StoreParams
          storeParam={storeParam}
          key={storeParam.id}
          removeStoreParams={removeStoreParams}
          updateStoreParams={updateStoreParams}
          arrayParams={arrayParams}
        />
      ))}

      <div className="flex justify-end flex-1 max-w-xl">
        <button
          className="w-10 h-10 flex items-center justify-center"
          onClick={generateStoreParams}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 hover:text-primary-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AditionalParams;
