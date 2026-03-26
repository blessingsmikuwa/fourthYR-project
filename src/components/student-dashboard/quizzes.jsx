import React, { useState } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const generateQuiz = () => {
    // TEMP MOCK (replace with backend AI later)
    const sample = [
      {
        question: "What is photosynthesis?",
        options: [
          "Respiration process",
          "Plants making food",
          "Digestion",
          "None",
        ],
        correct: 1,
      },
      {
        question: "Water chemical formula?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correct: 0,
      },
    ];
    setQuestions(sample);
    setScore(null);
  };

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    setScore(correct);
  };

  return (
    <div className="bg-[#0d1117] min-h-screen p-6 text-[#e6edf3]">
      
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-[#2ea043] mb-6">
        🧠 AI Quiz Generator
      </h1>

      {/* GENERATOR */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mb-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <select className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none">
            <option>Subject</option>
            <option>Biology</option>
            <option>Math</option>
          </select>

          <select className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none">
            <option>Form</option>
            <option>Form 1</option>
            <option>Form 2</option>
          </select>

          <input
            type="text"
            placeholder="Enter topic..."
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none"
          />
        </div>

        <button
          onClick={generateQuiz}
          className="bg-[#2ea043] text-white px-6 py-3 rounded-lg hover:bg-[#238636] font-semibold"
        >
          🤖 Generate Quiz
        </button>
      </div>

      {/* QUESTIONS */}
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
              <p className="font-semibold mb-4 text-lg text-[#e6edf3]">
                {i + 1}. {q.question}
              </p>

              <div className="space-y-3">
                {q.options.map((opt, j) => (
                  <label key={j} className="flex items-center space-x-3 cursor-pointer hover:bg-[#21262d] p-3 rounded-md transition">
                    <input
                      type="radio"
                      name={`q-${i}`}
                      onChange={() => handleSelect(i, j)}
                      className="w-4 h-4 text-[#2ea043] bg-[#0d1117] border-[#21262d] focus:ring-[#2ea043] focus:ring-2"
                    />
                    <span className="text-[#e6edf3]">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              onClick={submitQuiz}
              className="bg-[#1f6feb] text-white px-8 py-3 rounded-lg hover:bg-[#388bfd] font-semibold"
            >
              Submit Quiz
            </button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {score !== null && (
        <div className="mt-8 bg-[#161b22] border border-[#21262d] p-6 rounded-lg text-center">
          <div className="text-2xl font-bold text-[#2ea043] mb-2">
            Quiz Complete! 🎉
          </div>
          <div className="text-xl text-[#e6edf3]">
            Your Score: <span className="font-semibold text-[#2ea043]">{score}</span> / {questions.length}
          </div>
          <div className="text-sm text-[#6e7681] mt-2">
            {score === questions.length ? "Perfect! Excellent work!" : 
             score >= questions.length * 0.7 ? "Great job! Keep it up!" : 
             "Good effort! Try again to improve your score."}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-[#161b22] text-[#6e7681] text-center py-6 mt-10 border-t border-[#21262d]">
        © 2026 Malawi School Library System
      </footer>
    </div>
  );
};

export default Quiz;