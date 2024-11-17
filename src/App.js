import React, { useState, useEffect } from "react";
import "./App.css";  // Make sure this CSS file is imported

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

  const startQuestion = () => {
    const questionRange = Array.from(
      { length: endRange - startRange + 1 },
      (_, index) => startRange + index
    );
    setCurrentQuestion(questionRange[0]);
    setTimer(timePerQuestion);
    setIsRunning(true);
    setIsFinished(false);
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

  return (
    <div className="App">
      <h1>Question Timer App</h1>

      {!isRunning && !isFinished && (
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

      {isFinished && (
        <div>
          <h2>Test Finished!</h2>
          <div>
            <h3>Stats:</h3>
            <ul>
              {questionStats.map((stat, index) => (
                <li key={index}>
                  Question {stat.question}: Answer {stat.selectedAnswer}, Time Taken: {stat.timeTaken}s
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
