import React, { useState } from "react";
import { useQuizHistory } from "../../hooks/useQuizHistory";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);

  const { quizHistory, addQuizRecord } = useQuizHistory();

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
    setAnswers({});
    setCurrentQuiz({
      subject: "Biology", // This would come from the selected subject
      level: "Form 3",    // This would come from the selected level
      topic: "Basic Science", // This would come from the entered topic
      totalQuestions: sample.length,
      generatedAt: new Date().toISOString()
    });
  };

  const handleSelect = (qIndex, optionIndex) => {
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const submitQuiz = async () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    setScore(correct);

    // Save quiz completion record
    if (currentQuiz) {
      const quizRecord = {
        id: Date.now().toString(), // Unique ID for the quiz attempt
        ...currentQuiz,
        score: correct,
        completedAt: new Date().toISOString(),
        percentage: Math.round((correct / questions.length) * 100),
        answers: answers, // Store user's answers for review
        questions: questions // Store questions for review
      };

      try {
        await addQuizRecord(quizRecord);
      } catch (error) {
        console.error('Failed to save quiz record:', error);
        // Still show the score even if saving fails
      }
    }
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
      {score !== null && currentQuiz && (
        <div className="mt-8 bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-[#2ea043] mb-2">
              Quiz Complete! 🎉
            </div>
            <div className="text-xl text-[#e6edf3]">
              Your Score: <span className="font-semibold text-[#2ea043]">{score}</span> / {questions.length}
              <span className="text-sm text-[#6e7681] ml-2">
                ({Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
            <div className="text-sm text-[#6e7681] mt-2">
              {score === questions.length ? "Perfect! Excellent work!" :
               score >= questions.length * 0.7 ? "Great job! Keep it up!" :
               "Good effort! Try again to improve your score."}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#0d1117] p-3 rounded">
              <div className="text-sm text-[#6e7681]">Subject</div>
              <div className="font-semibold text-[#e6edf3]">{currentQuiz.subject}</div>
            </div>
            <div className="bg-[#0d1117] p-3 rounded">
              <div className="text-sm text-[#6e7681]">Level</div>
              <div className="font-semibold text-[#e6edf3]">{currentQuiz.level}</div>
            </div>
            <div className="bg-[#0d1117] p-3 rounded">
              <div className="text-sm text-[#6e7681]">Completed</div>
              <div className="font-semibold text-[#e6edf3]">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ HISTORY */}
      {quizHistory.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#e6edf3] mb-4">Recent Quiz History</h2>
          <div className="space-y-3">
            {quizHistory.slice(0, 5).map((quiz) => (
              <div key={quiz.id} className="bg-[#161b22] border border-[#21262d] p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-[#e6edf3]">{quiz.subject} - {quiz.topic}</div>
                    <div className="text-sm text-[#6e7681]">{quiz.level} • {quiz.totalQuestions} questions</div>
                    <div className="text-xs text-[#6e7681] mt-1">
                      {new Date(quiz.completedAt).toLocaleDateString()} at {new Date(quiz.completedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#2ea043]">{quiz.score}/{quiz.totalQuestions}</div>
                    <div className="text-sm text-[#6e7681]">{quiz.percentage}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Quiz;