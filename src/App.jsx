import QuestionCard from "./components/QuestionCard";
import { questions } from "./data/questions";
import React, { useState, useEffect, useRef } from "react";
import Confetti from "react-confetti";
import BackgroundMusic from "./components/BackgroundMusic";
function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [scored, setScored] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showFeedBack, setShowFeedBack] = useState(false);

  const [confettiConfig, setConfettiConfig] = useState({
    active: false,
    pieces: 200,
    recycle: false,
  });
  const confettiTimeoutRef = useRef(null);

  // 🎵 audio refs
  const correctSound = useRef(new Audio("/sounds/correct.mp3"));
  const wrongSound = useRef(new Audio("/sounds/wrong.mp3"));
  const finishSound = useRef(new Audio("/sounds/finish.mp3"));

  function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
      const update = () =>
        setSize({ width: window.innerWidth, height: window.innerHeight });
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }, []);
    return size;
  }
  const { width, height } = useWindowSize();

  const triggerConfetti = (pieces = 300, duration = 1600) => {
    if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    setConfettiConfig({ active: true, pieces, recycle: false });
    confettiTimeoutRef.current = setTimeout(() => {
      setConfettiConfig((c) => ({ ...c, active: false }));
      confettiTimeoutRef.current = null;
    }, duration);
  };

  const handleAnswer = (option) => {
    if (showFeedBack) return;
    setSelectedOption(option);
    setShowFeedBack(true);

    if (option === questions[currentQuestion].answer) {
      setScored((prev) => prev + 1);
      triggerConfetti(250, 1400);
      correctSound.current.currentTime = 0;
      correctSound.current.play();
    } else {
      wrongSound.current.currentTime = 0;
      wrongSound.current.play();
    }
  };

  const goToNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowFeedBack(false);
    } else {
      setFinished(true);
      triggerConfetti(800, 3500);
      finishSound.current.currentTime = 0;
      finishSound.current.play();
    }
  };

  const restartQuizz = () => {
    if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScored(0);
    setFinished(false);
    setShowFeedBack(false);
    setConfettiConfig({ active: false, pieces: 200, recycle: false });
  };

  const calculateProgess = () => {
    if (finished) return 100;
    const barProgess = Math.round((currentQuestion / questions.length) * 100);
    const questionProgess = selectedOption
      ? Math.round((1 / questions.length) * 100)
      : 0;
    return barProgess + questionProgess;
  };

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-r from-gray-900 to-blue-900 text-white">
      <BackgroundMusic />
      {confettiConfig.active && (
        <Confetti
          width={width}
          height={height}
          numberOfPieces={confettiConfig.pieces}
          recycle={confettiConfig.recycle}
          gravity={0.35}
        />
      )}

      <div className="text-center space-y-4 p-4">
        <h1 className="text-4xl font-bold text-purple-500">Quizz App</h1>
        <p className="text-gray-400">
          Welcome to the Quizz App! Test your knowledge and have fun!
        </p>
      </div>

      <div className="w-full max-w-xl mb-6">
        <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${calculateProgess()}%` }}
          ></div>
        </div>
      </div>

      {!finished ? (
        <>
          <QuestionCard
            onAnswer={handleAnswer}
            data={questions[currentQuestion]}
            selectedAnswer={selectedOption}
            showFeedBack={showFeedBack}
            current={currentQuestion}
            total={questions.length}
          />

          <div className="mt-6 min-h-[120px]">
            {showFeedBack && (
              <div className="mt-4 text-center">
                {selectedOption === questions[currentQuestion].answer ? (
                  <p className="text-green-400 text-lg font-semibold">
                    Chính xác!!!
                  </p>
                ) : (
                  <p className="text-red-400 text-lg font-semibold">
                    Sai bét! Đáp án đúng là:{" "}
                    <span className="text-white font-bold">
                      {questions[currentQuestion].answer}
                    </span>
                  </p>
                )}

                <button
                  onClick={goToNext}
                  className="mt-3 bg-linear-to-r from-indigo-600 to-purple-600 py-3 px-6 rounded-lg font-medium shadow-1 cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition duration-200"
                >
                  {currentQuestion + 1 < questions.length
                    ? "Next Question"
                    : "Finish Quiz"}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-bold">Bạn đã hoàn thành bài kiểm tra!</h2>
          <p className="mt-2">
            Điểm của bạn là: {scored}/{questions.length}
          </p>
          <button
            onClick={restartQuizz}
            className="mt-6 bg-linear-to-r from-indigo-600 to-purple-600 py-3 px-6 rounded-lg font-medium shadow-1 cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition duration-200"
          >
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
