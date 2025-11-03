import React from "react";

const QuestionCard = ({
  data,
  onAnswer,
  showFeedBack,
  selectedAnswer,
  current,
  total,
}) => {
  const { question, options, answer } = data;

  // Màu cơ bản cho 4 nút
  const colors = [
    "bg-purple-600 hover:bg-purple-700",
    "bg-blue-600 hover:bg-blue-700",
    "bg-pink-600 hover:bg-pink-700",
    "bg-orange-600 hover:bg-orange-700",
  ];

  // Hàm xác định màu phản hồi
  const getButtonStyle = (option, index) => {
    if (!showFeedBack) return colors[index % colors.length];
    if (option === answer) return "bg-green-600"; // đúng
    if (option === selectedAnswer && selectedAnswer !== answer)
      return "bg-red-600"; // sai
    return "bg-gray-600"; // các nút khác khi feedback
  };

  // Tính phần trăm hoàn thành
  const percent = Math.round(((current) / total) * 100);

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-xl border border-gray-700">
      {/* Header: question progress + % complete */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-300">
          Question {current + 1} of {total}
        </h3>
        <span className="bg-gray-700 text-gray-200 text-sm px-3 py-1 rounded-full">
          {percent}% complete
        </span>
      </div>

      {/* Question text */}
      <p className="text-white text-xl font-semibold mb-4">{question}</p>

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(option)}
            disabled={showFeedBack}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${getButtonStyle(
              option,
              index
            )} ${showFeedBack ? "cursor-not-allowed opacity-80" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
