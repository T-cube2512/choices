import React, { useState, useEffect } from "react";
import "./App.css";  

function App() {
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");
  const [timePerQuestion, setTimePerQuestion] = useState("");
  const [numChoices, setNumChoices] = useState(4);  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionStats, setQuestionStats] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewStats, setReviewStats] = useState([]);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);  

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
      handleAnswer(null); 
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
    const correctAnswers = reviewStats.filter(stat => stat.isCorrect).length;
    const totalQuestions = reviewStats.length;
    const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
    setScore(percentage);
  };

  useEffect(() => {
    if (isReviewing && currentQuestion > endRange) {
      calculateScore();
    }
  }, [currentQuestion, isReviewing, reviewStats]);

  const generateChoices = () => {
    
    const choices = [];
    const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");  
    for (let i = 0; i < numChoices; i++) {
      choices.push(labels[i]);
    }
    return choices;
  };

  
  if (!isStarted) {
    return (
      <div className="App start-screen">
        <h1>Welcome to Choices</h1>
        <p>
          Choices is an app designed to help users who are currently using a test-based book or PDF. 
          Instead of navigating back and forth between the questions and answer key, 
          you can use this app to simulate the question answering experience in a more efficient and focused way.
        </p>
        <button onClick={() => setIsStarted(true)}>Start</button>
      </div>
    );
  }

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
          <label>
            Number of Choices:
            <input
              type="number"
              value={numChoices}
              onChange={(e) => setNumChoices(Math.min(Math.max(Number(e.target.value), 2), 20))}
              placeholder="Choices per Question"
            />
          </label>
          <button onClick={startQuestion}>Start Quiz</button>
        </div>
      )}

      {isRunning && currentQuestion !== null && (
        <div>
          <h2>Question: {currentQuestion}</h2>
          <div>Time Left: {timer}s</div>
          <div>
            {generateChoices().map((choice, index) => (
              <button key={index} onClick={() => handleAnswer(choice)}>
                {choice}
              </button>
            ))}
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
