import React, { useState, useEffect } from "react";
import "./App.css";  // Ensure your CSS file is imported

function App() {
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionStats, setQuestionStats] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStats, setReviewStats] = useState([]);
  const [score, setScore] = useState(0);

  const startQuestion = () => {
    const questionRange = Array.from(
      { length: endRange - startRange + 1 },
      (_, index) => startRange + index
    );
    setCurrentQuestion(questionRange[0]);
    setTimer(timePerQuestion);
    setIsRunning(true);
    setIsFinished(false);
    setIsReviewing(false);
    setQuestionStats([]);
  };

  const handleAnswer = (answer) => {
    if (isRunning) {
      setSelectedAnswer(answer);
      setQuestionStats((prev) => [
        ...prev,
        { question: currentQuestion, selectedAnswer: answer, timeTaken: timePerQuestion - timer },
      ]);
      setCurrentQuestion((prev) => prev + 1);
      setTimer(timePerQuestion);
      setSelectedAnswer(null);
    }
  };

  useEffect(() => {
    let countdown;
    if (isRunning && timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && currentQuestion !== endRange + 1) {
      handleAnswer(null); // if time runs out
    }

    return () => clearInterval(countdown);
  }, [isRunning, timer, currentQuestion]);

  useEffect(() => {
    if (currentQuestion === endRange + 1) {
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [currentQuestion, endRange]);

  const handleReviewAnswer = (isCorrect) => {
    setReviewStats((prev) => [
      ...prev,
      { question: currentQuestion, isCorrect, selectedAnswer: questionStats[currentQuestion - startRange].selectedAnswer },
    ]);
    setCurrentQuestion((prev) => prev + 1);
  };

  const startReview = () => {
    setIsReviewing(true);
    setCurrentQuestion(startRange);
  };

  const calculateScore = () => {
    // Calculate the number of correct answers
    const correctAnswers = reviewStats.filter(stat => stat.isCorrect).length;
    const totalQuestions = reviewStats.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    setScore(percentage); // Update the score state
  };

  useEffect(() => {
    // If we've finished reviewing all questions, calculate the score
    if (isReviewing && currentQuestion > endRange) {
      calculateScore();
    }
  }, [currentQuestion, isReviewing, reviewStats]);

  return (
    <div className="App">
      <h1>Choices App</h1>

      {!isRunning && !isFinished && !isReviewing && (
        <div>
          <label>
            Start Question:
            <input
              type="number"
              value={startRange}
              onChange={(e) => setStartRange(Number(e.target.value))}
              placeholder="Start Range"
            />
          </label>
          <label>
            End Question:
            <input
              type="number"
              value={endRange}
              onChange={(e) => setEndRange(Number(e.target.value))}
              placeholder="End Range"
            />
          </label>
          <label>
            Time per Question (seconds):
            <input
              type="number"
              value={timePerQuestion}
              onChange={(e) => setTimePerQuestion(Number(e.target.value))}
              placeholder="Time in seconds"
            />
          </label>
          <button onClick={startQuestion}>Start</button>
        </div>
      )}

      {isRunning && currentQuestion !== null && (
        <div>
          <h2>Question: {currentQuestion}</h2>
          <div>Time Left: {timer}s</div>
          <div>
            <button onClick={() => handleAnswer("A")}>A</button>
            <button onClick={() => handleAnswer("B")}>B</button>
            <button onClick={() => handleAnswer("C")}>C</button>
            <button onClick={() => handleAnswer("D")}>D</button>
          </div>
        </div>
      )}

      {isFinished && !isReviewing && (
        <div>
          <h2>Test Finished! Ready to Review</h2>
          <button onClick={startReview}>Start Review</button>
        </div>
      )}

      {isReviewing && currentQuestion <= endRange && (
        <div>
          <h2>Review Question: {currentQuestion}</h2>
          <p>Selected Answer: {questionStats[currentQuestion - startRange].selectedAnswer}</p>
          <div>
            <button onClick={() => handleReviewAnswer(true)}>Right</button>
            <button onClick={() => handleReviewAnswer(false)}>Wrong</button>
          </div>
        </div>
      )}

      {isReviewing && currentQuestion === endRange + 1 && (
        <div>
          <h2>Review Complete!</h2>
          <div>
            <h3>Score: {score}%</h3>
            <h4>Correct Answers: {reviewStats.filter(stat => stat.isCorrect).length} / {reviewStats.length}</h4>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
