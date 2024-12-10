import React from "react";

const PiDetailModal = ({ selectedData, onClose }) => {
  const steps = [
    {
      id: 1,
      title: "Assigned",
      description: "We have assigned the task. Please check.",
      active: true,
    },
    {
      id: 2,
      title: "Allocated",
      description: "The task is allocated to the person.",
      active: true,
    },
    {
      id: 3,
      title: "Waiting for Parts",
      description: "Please wait for the parts to arrive.",
      active: true,
    },
    {
      id: 4,
      title: "Done",
      description: "Successful inspection is complete.",
      active: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center backdrop-blur-sm justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[24rem]">
        <h2 className="text-2xl font-bold mb-6 text-center">Task Tracking</h2>
        <div>
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start mb-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                    step.active
                      ? "bg-green-500 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className="h-10 border-l-2 border-gray-300"></div>
                )}
              </div>
              <div className="ml-4">
                <h3
                  className={`text-lg font-semibold ${
                    step.active ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PiDetailModal;
