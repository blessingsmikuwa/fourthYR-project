import React, { useState } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────
const SUBJECTS = ["Biology", "Mathematics", "English", "Physics", "Chemistry", "History", "Other"];
const FORMS    = ["Form 1", "Form 2", "Form 3", "Form 4"];
const DURATIONS = ["15 min", "30 min", "45 min", "60 min", "90 min", "120 min"];

const blankQuestion = () => ({
  id: Date.now() + Math.random(),
  text: "",
  options: ["", "", "", ""],
  answer: 0,
});

const blankQuiz = () => ({
  title: "",
  subject: "Biology",
  form: "Form 1",
  duration: "30 min",
  description: "",
  questions: [blankQuestion()],
});

// ── sub-components ────────────────────────────────────────────────────────────
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-3 text-sm font-semibold rounded-md transition"
      style={{
        backgroundColor: active ? "#2ea043" : "#161b22",
        color: active ? "#fff" : "#8b949e",
        border: `1px solid ${active ? "#2ea043" : "#21262d"}`,
      }}
    >
      {children}
    </button>
  );
}

function InputField({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      {label && <label className="block text-xs text-[#6e7681] mb-1">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681]"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      {label && <label className="block text-xs text-[#6e7681] mb-1">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function QuestionCard({ q, index, onChange, onRemove, canRemove }) {
  const updateOption = (i, val) => {
    const opts = [...q.options];
    opts[i] = val;
    onChange({ ...q, options: opts });
  };

  return (
    <div className="bg-[#0d1117] border border-[#21262d] rounded-lg p-5 mb-4 hover:border-[#2ea043] transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-[#2ea043] bg-[#1a3a2a] px-2 py-0.5 rounded">
          Q{index + 1}
        </span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="text-xs text-[#f85149] hover:text-[#da3633] transition"
          >
            ✕ Remove
          </button>
        )}
      </div>

      <textarea
        value={q.text}
        onChange={(e) => onChange({ ...q, text: e.target.value })}
        placeholder="Enter your question here..."
        rows={2}
        className="w-full bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681] resize-none mb-4"
      />

      <p className="text-xs text-[#6e7681] mb-2">Answer Options — click the circle to mark correct answer</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {q.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => onChange({ ...q, answer: i })}
              className="flex-shrink-0 w-5 h-5 rounded-full border-2 transition flex items-center justify-center"
              style={{
                borderColor: q.answer === i ? "#2ea043" : "#30363d",
                backgroundColor: q.answer === i ? "#2ea043" : "transparent",
              }}
            >
              {q.answer === i && <span className="text-white text-xs">✓</span>}
            </button>
            <input
              type="text"
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="flex-1 bg-[#161b22] border text-[#e6edf3] rounded-md px-3 py-1.5 text-sm focus:outline-none placeholder-[#6e7681] transition"
              style={{ borderColor: q.answer === i ? "#2ea043" : "#21262d" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg"
      style={{
        backgroundColor: toast.type === "error" ? "#3d1a1a" : "#1a3a2a",
        color: toast.type === "error" ? "#f85149" : "#2ea043",
        border: `1px solid ${toast.type === "error" ? "#f85149" : "#2ea043"}`,
      }}
    >
      {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
    </div>
  );
}

// ── Saved Quiz Card ───────────────────────────────────────────────────────────
function SavedQuizCard({ quiz, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const modeColor = quiz.mode === "online"
    ? { bg: "#1a2a3a", color: "#58a6ff" }
    : { bg: "#2a1a3a", color: "#a371f7" };

  return (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2ea043] transition mb-4">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded capitalize"
              style={{ backgroundColor: modeColor.bg, color: modeColor.color }}
            >
              {quiz.mode === "online" ? "🌐 Online" : "📄 Offline"}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1a3a2a] text-[#2ea043]">
              {quiz.subject}
            </span>
            <span className="text-xs text-[#6e7681] px-2 py-0.5 rounded border border-[#21262d]">
              {quiz.form}
            </span>
          </div>
          <button
            onClick={() => onDelete(quiz.id)}
            className="text-xs text-[#f85149] hover:text-[#da3633] transition ml-2 flex-shrink-0"
          >
            🗑 Delete
          </button>
        </div>

        <h3 className="font-semibold text-[#e6edf3] mb-1">{quiz.title}</h3>
        {quiz.description && (
          <p className="text-xs text-[#6e7681] mb-3">{quiz.description}</p>
        )}

        <div className="flex gap-4 text-xs text-[#6e7681] mb-4">
          <span>❓ {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}</span>
          <span>⏱ {quiz.duration}</span>
          <span>📅 {quiz.createdAt}</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs font-semibold px-3 py-1.5 rounded hover:border-[#2ea043] transition"
          >
            {expanded ? "▲ Hide" : "▼ Preview"}
          </button>
          {quiz.mode === "offline" && (
            <button className="bg-[#1a2a3a] border border-[#58a6ff] text-[#58a6ff] text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#2a3a4a] transition">
              ⬇️ Download PDF
            </button>
          )}
          {quiz.mode === "online" && (
            <button className="bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition">
              🔗 Share Link
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#21262d] px-5 py-4 bg-[#0d1117]">
          {quiz.questions.map((q, i) => (
            <div key={q.id} className="mb-4">
              <p className="text-sm text-[#e6edf3] font-semibold mb-2">
                Q{i + 1}. {q.text || <span className="text-[#6e7681] italic">No question text</span>}
              </p>
              <div className="grid grid-cols-2 gap-1 pl-3">
                {q.options.map((opt, oi) => (
                  <p
                    key={oi}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      color: q.answer === oi ? "#2ea043" : "#6e7681",
                      backgroundColor: q.answer === oi ? "#1a3a2a" : "transparent",
                      fontWeight: q.answer === oi ? 700 : 400,
                    }}
                  >
                    {String.fromCharCode(65 + oi)}. {opt || "—"}
                    {q.answer === oi && " ✓"}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function CreateQuiz() {
  const [mode, setMode]         = useState("online"); // "online" | "offline"
  const [quiz, setQuiz]         = useState(blankQuiz());
  const [savedQuizzes, setSaved] = useState([]);
  const [toast, setToast]       = useState(null);
  const [view, setView]         = useState("create"); // "create" | "saved"

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // question helpers
  const updateQuestion = (id, updated) => {
    setQuiz((q) => ({
      ...q,
      questions: q.questions.map((qq) => (qq.id === id ? updated : qq)),
    }));
  };

  const addQuestion = () => {
    setQuiz((q) => ({ ...q, questions: [...q.questions, blankQuestion()] }));
  };

  const removeQuestion = (id) => {
    setQuiz((q) => ({ ...q, questions: q.questions.filter((qq) => qq.id !== id) }));
  };

  // save quiz
  const handleSave = () => {
    if (!quiz.title.trim()) {
      showToast("Please enter a quiz title.", "error"); return;
    }
    if (quiz.questions.some((q) => !q.text.trim())) {
      showToast("All questions must have text.", "error"); return;
    }
    if (quiz.questions.some((q) => q.options.some((o) => !o.trim()))) {
      showToast("Please fill in all answer options.", "error"); return;
    }

    const newQuiz = {
      ...quiz,
      id: Date.now(),
      mode,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setSaved((prev) => [newQuiz, ...prev]);
    setQuiz(blankQuiz());
    showToast(`Quiz "${newQuiz.title}" saved successfully!`);
    setView("saved");
  };

  const deleteQuiz = (id) => {
    setSaved((prev) => prev.filter((q) => q.id !== id));
    showToast("Quiz deleted.");
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <Toast toast={toast} />

      <main className="max-w-4xl mx-auto p-4">

        {/* HEADER */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] p-8 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">✏️ Create Quiz</h1>
            <p className="opacity-80 text-sm">
              Build online or offline quizzes for your students.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView("create")}
              className="text-sm font-semibold px-4 py-2 rounded-md transition"
              style={{
                backgroundColor: view === "create" ? "#2ea043" : "#21262d",
                color: view === "create" ? "#fff" : "#8b949e",
                border: `1px solid ${view === "create" ? "#2ea043" : "#30363d"}`,
              }}
            >
              ✏️ Create
            </button>
            <button
              onClick={() => setView("saved")}
              className="text-sm font-semibold px-4 py-2 rounded-md transition relative"
              style={{
                backgroundColor: view === "saved" ? "#2ea043" : "#21262d",
                color: view === "saved" ? "#fff" : "#8b949e",
                border: `1px solid ${view === "saved" ? "#2ea043" : "#30363d"}`,
              }}
            >
              📋 My Quizzes
              {savedQuizzes.length > 0 && (
                <span className="ml-2 bg-[#f85149] text-white text-xs rounded-full px-1.5 py-0.5">
                  {savedQuizzes.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* ── CREATE VIEW ── */}
        {view === "create" && (
          <>
            {/* Mode toggle */}
            <div className="flex gap-3 mb-6">
              <TabBtn active={mode === "online"}  onClick={() => setMode("online")}>
                🌐 Online Quiz
              </TabBtn>
              <TabBtn active={mode === "offline"} onClick={() => setMode("offline")}>
                📄 Offline / Printable Quiz
              </TabBtn>
            </div>

            {/* Mode info banner */}
            <div
              className="text-xs px-4 py-3 rounded-md mb-6 border"
              style={{
                backgroundColor: mode === "online" ? "#1a2a3a" : "#2a1a3a",
                borderColor:     mode === "online" ? "#58a6ff" : "#a371f7",
                color:           mode === "online" ? "#58a6ff" : "#a371f7",
              }}
            >
              {mode === "online"
                ? "🌐 Online quizzes are taken digitally — students access them via a shared link and submit answers online."
                : "📄 Offline quizzes can be downloaded as a PDF, printed, and distributed physically to students in class."}
            </div>

            {/* Quiz details */}
            <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 mb-5">
              <h2 className="text-sm font-bold text-[#e6edf3] mb-4">📝 Quiz Details</h2>
              <div className="space-y-4">
                <InputField
                  label="Quiz Title *"
                  value={quiz.title}
                  onChange={(e) => setQuiz((q) => ({ ...q, title: e.target.value }))}
                  placeholder="e.g. Cell Biology Quiz — Week 3"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <SelectField
                    label="Subject"
                    value={quiz.subject}
                    onChange={(e) => setQuiz((q) => ({ ...q, subject: e.target.value }))}
                    options={SUBJECTS}
                  />
                  <SelectField
                    label="Form / Class"
                    value={quiz.form}
                    onChange={(e) => setQuiz((q) => ({ ...q, form: e.target.value }))}
                    options={FORMS}
                  />
                  <SelectField
                    label="Duration"
                    value={quiz.duration}
                    onChange={(e) => setQuiz((q) => ({ ...q, duration: e.target.value }))}
                    options={DURATIONS}
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#6e7681] mb-1">Description (optional)</label>
                  <textarea
                    value={quiz.description}
                    onChange={(e) => setQuiz((q) => ({ ...q, description: e.target.value }))}
                    placeholder="Brief instructions or topic overview for students..."
                    rows={2}
                    className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[#e6edf3]">
                  ❓ Questions ({quiz.questions.length})
                </h2>
                <button
                  onClick={addQuestion}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#21262d] border border-[#30363d] text-[#e6edf3] hover:border-[#2ea043] transition"
                >
                  + Add Question
                </button>
              </div>

              {quiz.questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  q={q}
                  index={i}
                  onChange={(updated) => updateQuestion(q.id, updated)}
                  onRemove={() => removeQuestion(q.id)}
                  canRemove={quiz.questions.length > 1}
                />
              ))}

              <button
                onClick={addQuestion}
                className="w-full border-2 border-dashed border-[#21262d] text-[#6e7681] hover:border-[#2ea043] hover:text-[#2ea043] rounded-lg py-4 text-sm font-semibold transition"
              >
                + Add Another Question
              </button>
            </div>

            {/* Summary + Save */}
            <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 flex items-center justify-between">
              <div className="text-sm text-[#6e7681]">
                <span className="text-[#e6edf3] font-semibold">{quiz.questions.length}</span> question{quiz.questions.length !== 1 ? "s" : ""} ·{" "}
                <span className="text-[#e6edf3] font-semibold">{quiz.duration}</span> ·{" "}
                <span
                  className="font-semibold"
                  style={{ color: mode === "online" ? "#58a6ff" : "#a371f7" }}
                >
                  {mode === "online" ? "🌐 Online" : "📄 Offline"}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setQuiz(blankQuiz())}
                  className="text-sm font-semibold px-4 py-2 rounded-md bg-[#21262d] border border-[#30363d] text-[#8b949e] hover:border-[#6e7681] transition"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="text-sm font-semibold px-6 py-2 rounded-md bg-[#2ea043] text-white hover:bg-[#3fb950] transition"
                >
                  {mode === "online" ? "💾 Save & Publish" : "💾 Save & Export"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── SAVED QUIZZES VIEW ── */}
        {view === "saved" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#e6edf3]">
                📋 My Quizzes
                <span className="ml-2 text-sm text-[#6e7681] font-normal">
                  ({savedQuizzes.length} total)
                </span>
              </h2>
              <button
                onClick={() => setView("create")}
                className="text-sm font-semibold px-4 py-2 rounded-md bg-[#2ea043] text-white hover:bg-[#3fb950] transition"
              >
                + New Quiz
              </button>
            </div>

            {savedQuizzes.length === 0 ? (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-16 text-center text-[#6e7681]">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm mb-4">No quizzes created yet.</p>
                <button
                  onClick={() => setView("create")}
                  className="text-sm font-semibold px-5 py-2 rounded-md bg-[#2ea043] text-white hover:bg-[#3fb950] transition"
                >
                  Create Your First Quiz
                </button>
              </div>
            ) : (
              savedQuizzes.map((q) => (
                <SavedQuizCard key={q.id} quiz={q} onDelete={deleteQuiz} />
              ))
            )}
          </>
        )}
      </main>
    </div>
  );
}