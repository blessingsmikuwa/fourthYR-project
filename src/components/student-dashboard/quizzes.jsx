import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// ── AI Quiz Topics ────────────────────────────────────────────────────────────
const SUBJECT_TOPICS = {
  Biology:           ["Cell Structure and Function","Cell Division (Mitosis and Meiosis)","Photosynthesis","Respiration","Transport in Plants","Transport in Animals (Circulatory System)","Nutrition in Plants","Nutrition in Animals (Human Digestive System)","Excretion in Humans","Nervous System","Endocrine System","Reproduction in Plants","Reproduction in Humans","Genetics and Heredity","Evolution and Natural Selection","Ecology and Ecosystems","Classification of Living Things","Disease and Immunity","Biotechnology","Environmental Issues in Malawi"],
  Mathematics:       ["Number and Numeration","Fractions, Decimals and Percentages","Ratio and Proportion","Algebra: Simplification and Expansion","Linear Equations","Simultaneous Equations","Quadratic Equations","Inequalities","Functions and Graphs","Sequences and Series","Geometry: Lines and Angles","Triangles and Congruence","Circle Theorems","Mensuration: Area and Perimeter","Mensuration: Volume and Surface Area","Trigonometry","Vectors","Matrices","Statistics: Mean, Median and Mode","Probability"],
  Chemistry:         ["Atomic Structure","The Periodic Table","Chemical Bonding (Ionic and Covalent)","States of Matter","Chemical Reactions and Equations","Acids, Bases and Salts","Oxidation and Reduction (Redox)","Electrochemistry","Rates of Reaction","Energy Changes in Reactions","The Mole Concept","Gases and Gas Laws","Water and Solutions","Metals and Non-Metals","Carbon and Its Compounds","Organic Chemistry: Alkanes and Alkenes","Organic Chemistry: Alcohols and Acids","Polymers and Plastics","Environmental Chemistry","Industrial Chemistry in Malawi"],
  Physics:           ["Measurements and Units","Motion: Speed, Velocity and Acceleration","Newton's Laws of Motion","Forces and Equilibrium","Work, Energy and Power","Momentum and Collisions","Pressure in Solids, Liquids and Gases","Heat and Temperature","Thermal Expansion","Transfer of Heat","Waves: Properties and Types","Sound Waves","Light: Reflection","Light: Refraction and Lenses","Electricity: Current and Circuits","Ohm's Law and Resistance","Magnetism and Electromagnetism","Electromagnetic Induction","Radioactivity","Electronics and Logic Gates"],
  English:           ["Reading Comprehension","Summary Writing","Essay Writing: Argumentative","Essay Writing: Descriptive","Essay Writing: Narrative","Letter Writing: Formal","Letter Writing: Informal","Report Writing","Grammar: Parts of Speech","Grammar: Tenses","Grammar: Active and Passive Voice","Grammar: Direct and Indirect Speech","Vocabulary and Word Formation","Punctuation and Spelling","Poetry: Analysis and Appreciation","Prose: Novel Study","Drama: Play Study","Oral Communication Skills","Debate and Discussion","Literature in Malawian Context"],
  Geography:         ["Map Reading and Interpretation","Weather and Climate","Climate Regions of Malawi","Malawi: Physical Features","Malawi: Lake Malawi","Malawi: Rivers and Water Resources","Population Distribution in Malawi","Rural and Urban Settlements","Agriculture in Malawi","Cash Crops: Tobacco, Tea and Sugar","Fishing Industry in Malawi","Mining and Natural Resources","Transport and Communication in Malawi","Trade and Economic Development","Africa: Physical Geography","Africa: Political Geography","Plate Tectonics and Earthquakes","Volcanoes","Soil Types and Erosion","Environmental Conservation in Malawi"],
  History:           ["Early Peoples of Malawi","Migration and Settlement of Bantu People","Maravi Kingdom","Ngoni Migration and Settlement","Yao and Arab Slave Trade","European Exploration of Africa","Livingstone and Missionaries in Malawi","British Central Africa Protectorate","Colonial Administration in Nyasaland","Resistance to Colonial Rule","John Chilembwe Rising 1915","Nyasaland African Congress","Federation of Rhodesia and Nyasaland","Malawi Congress Party and Independence","Dr Hastings Kamuzu Banda and Independence 1964","One Party State in Malawi","Multiparty Democracy 1993","Post-Independence Development in Malawi","Africa: Colonisation and Independence","World War I and World War II"],
  "Civic Education": ["Citizenship and Responsibilities","Human Rights","Children's Rights in Malawi","The Constitution of Malawi","Branches of Government","The Executive: President and Cabinet","The Legislature: Parliament of Malawi","The Judiciary and Rule of Law","Local Government in Malawi","Elections and Democracy","Political Parties in Malawi","Gender Equality and Equity","HIV and AIDS Awareness","Drug and Substance Abuse","Environmental Rights and Duties","Community Development","Conflict Resolution","National Symbols of Malawi","Regional and International Organisations (AU, SADC, UN)","Corruption and Good Governance"],
  "Computer Studies": ["Introduction to Computers","Computer Hardware Components","Computer Software: System and Application","Operating Systems","File Management","Word Processing (Microsoft Word)","Spreadsheets (Microsoft Excel)","Presentation Software (Microsoft PowerPoint)","Database Concepts","Internet and Email","World Wide Web and Browsers","Computer Networks and Types","Network Security and Cyber Safety","Introduction to Programming","Algorithms and Flowcharts","Basic Programming in Python","HTML and Web Design Basics","Data Representation (Binary and Hexadecimal)","ICT in Society and Development","ICT in Malawi: E-government and Mobile Money"],
};
const LEVELS = ["Form 1","Form 2","Form 3","Form 4"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const token   = () => localStorage.getItem("accessToken");
const authHdr = () => ({ "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) });

async function logAttempt(payload) {
  try {
    await fetch(`${API_BASE}/quizzes/attempts`, {
      method: "POST",
      headers: authHdr(),
      body: JSON.stringify(payload),
    });
  } catch {}
}

// ── Shared quiz runner ────────────────────────────────────────────────────────
function QuizRunner({ questions, meta, onDone, source, quizId }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore]     = useState(null);
  const [error, setError]     = useState(null);

  const select = (qi, oi) => { if (score !== null) return; setAnswers((a) => ({ ...a, [qi]: oi })); };

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions before submitting."); return;
    }
    setError(null);
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === (q.correct ?? q.answer)) correct++; });
    setScore(correct);
    const pct = Math.round((correct / questions.length) * 100);
    await logAttempt({
      source,
      quizId:    quizId ?? null,
      subject:   meta.subject,
      topic:     meta.topic ?? meta.title,
      level:     meta.level ?? meta.form,
      score:     correct,
      total:     questions.length,
      percentage: pct,
      answers:   Object.values(answers),
      questions,
    });
  };

  const optionStyle = (qi, oi) => {
    if (score === null)
      return answers[qi] === oi ? "border-[#2ea043] bg-[#2ea04320]" : "border-[#21262d] hover:bg-[#21262d]";
    const correct  = questions[qi].correct ?? questions[qi].answer;
    const selected = answers[qi] === oi;
    if (correct === oi)  return "border-[#2ea043] bg-[#2ea04320]";
    if (selected)        return "border-[#da3633] bg-[#da363320]";
    return "border-[#21262d] opacity-50";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-[#8b949e] mb-2">
        <span>{meta.subject} · {meta.level ?? meta.form} · {meta.topic ?? meta.title}</span>
        <span>{Object.keys(answers).length} / {questions.length} answered</span>
      </div>

      {error && <div className="px-3 py-2 rounded-lg text-xs" style={{ backgroundColor:"#3d1f1f", border:"1px solid #f85149", color:"#f85149" }}>{error}</div>}

      {questions.map((q, i) => (
        <div key={i} className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
          <p className="font-semibold mb-4 text-lg">{i+1}. {q.question ?? q.text}</p>
          <div className="space-y-3">
            {q.options.map((opt, j) => (
              <label key={j} onClick={() => select(i, j)}
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-md border transition ${optionStyle(i,j)}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[i]===j?"border-[#2ea043] bg-[#2ea043]":"border-[#6e7681]"}`}>
                  {answers[i]===j && <div className="w-2 h-2 bg-white rounded-full"/>}
                </div>
                <span>{opt}</span>
                {score !== null && <span className="ml-auto">{(q.correct??q.answer)===j?"✅":answers[i]===j?"❌":""}</span>}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 justify-center mt-6">
        {score === null ? (
          <button onClick={submit} className="bg-[#1f6feb] text-white px-8 py-3 rounded-lg hover:bg-[#388bfd] font-semibold">Submit Quiz</button>
        ) : (
          <>
            <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg w-full text-center">
              <div className="text-2xl font-bold text-[#2ea043] mb-1">Quiz Complete! 🎉</div>
              <div className="text-xl">Score: <span className="font-bold text-[#2ea043]">{score}</span> / {questions.length} ({Math.round((score/questions.length)*100)}%)</div>
              <div className="text-sm text-[#6e7681] mt-2">
                {score===questions.length?"Perfect! Excellent work!":score>=questions.length*0.7?"Great job! Keep it up!":"Good effort! Try again to improve."}
              </div>
              <button onClick={onDone} className="mt-4 bg-[#2ea043] text-white px-6 py-2 rounded-lg hover:bg-[#238636] font-semibold">
                🔄 Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── AI Tab ────────────────────────────────────────────────────────────────────
function AITab() {
  const [subject, setSubject] = useState("");
  const [level, setLevel]     = useState("");
  const [topic, setTopic]     = useState("");
  const [questions, setQ]     = useState([]);
  const [meta, setMeta]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const topics = subject ? (SUBJECT_TOPICS[subject] ?? []) : [];

  const generate = async () => {
    if (!subject || !level || !topic) { setError("Please select subject, level and topic."); return; }
    setLoading(true); setError(null); setQ([]); setMeta(null);
    try {
      const res = await fetch(`${API_BASE}/quizzes/generate`, {
        method:"POST", headers: authHdr(),
        body: JSON.stringify({ subject, level, topic }),
      });
      if (!res.ok) { const d = await res.json().catch(()=>({})); throw new Error(d?.message ?? "Failed"); }
      const data = await res.json();
      setQ(data.questions);
      setMeta({ subject: data.subject, level: data.level, topic: data.topic });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (meta && questions.length > 0) {
    return <QuizRunner questions={questions} meta={meta} source="AI" onDone={() => { setQ([]); setMeta(null); }} />;
  }

  return (
    <div>
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select value={subject} onChange={(e) => { setSubject(e.target.value); setTopic(""); setError(null); }} disabled={loading}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50">
            <option value="">Select Subject</option>
            {Object.keys(SUBJECT_TOPICS).map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={level} onChange={(e) => { setLevel(e.target.value); setError(null); }} disabled={loading}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50">
            <option value="">Select Level</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select value={topic} onChange={(e) => { setTopic(e.target.value); setError(null); }} disabled={loading || !subject}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50 lg:col-span-2">
            <option value="">{subject ? "Select Topic" : "Select a subject first"}</option>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        {error && <div className="mb-4 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor:"#3d1f1f", border:"1px solid #f85149", color:"#f85149" }}>{error}</div>}
        <button onClick={generate} disabled={loading}
          className="bg-[#2ea043] text-white px-6 py-3 rounded-lg hover:bg-[#238636] font-semibold disabled:opacity-50">
          {loading ? "⏳ Generating..." : "🤖 Generate Quiz"}
        </button>
      </div>
      {loading && (
        <div className="text-center py-12">
          <div className="text-[#8b949e] text-sm">Generating your quiz, please wait...</div>
          <div className="mt-3 w-8 h-8 border-2 border-[#2ea043] border-t-transparent rounded-full animate-spin mx-auto"/>
        </div>
      )}
    </div>
  );
}

// ── Teacher Quizzes Tab ───────────────────────────────────────────────────────
function TeacherQuizzesTab() {
  const [quizzes, setQuizzes]       = useState([]);
  const [offline, setOffline]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [subTab, setSubTab]         = useState("online"); // 'online' | 'offline'
  const [search, setSearch]         = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [onRes, offRes] = await Promise.all([
          fetch(`${API_BASE}/quizzes/available`,         { headers: authHdr() }),
          fetch(`${API_BASE}/quizzes/available/offline`, { headers: authHdr() }),
        ]);
        if (onRes.ok)  setQuizzes(await onRes.json());
        if (offRes.ok) setOffline(await offRes.json());
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (activeQuiz) {
    return (
      <QuizRunner
        questions={activeQuiz.questions ?? []}
        meta={{ subject: activeQuiz.subject, level: activeQuiz.form, topic: activeQuiz.title }}
        source="TEACHER"
        quizId={activeQuiz.id}
        onDone={() => setActiveQuiz(null)}
      />
    );
  }

  const onlineFiltered  = quizzes.filter((q) => q.title?.toLowerCase().includes(search.toLowerCase()) || q.subject?.toLowerCase().includes(search.toLowerCase()));
  const offlineFiltered = offline.filter((q) => q.title?.toLowerCase().includes(search.toLowerCase()) || q.subject?.toLowerCase().includes(search.toLowerCase()));

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "—";

  const QuizCard = ({ quiz, isOffline }) => (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 hover:border-[#2ea043] transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1a3a2a] text-[#2ea043]">{quiz.subject}</span>
          <span className="text-xs px-2 py-0.5 rounded border border-[#21262d] text-[#6e7681]">{quiz.form}</span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: quiz.visibility==="PUBLIC"?"#1a2a3a":"#2a1a3a", color: quiz.visibility==="PUBLIC"?"#58a6ff":"#a371f7" }}>
            {quiz.visibility==="PUBLIC"?"🌐 Public":"🔒 School"}
          </span>
        </div>
        <span className="text-xs text-[#6e7681]">{quiz.duration}</span>
      </div>
      <h3 className="font-semibold text-[#e6edf3] mb-1">{quiz.title}</h3>
      {quiz.description && <p className="text-xs text-[#6e7681] mb-3 line-clamp-2">{quiz.description}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6e7681]">❓ {quiz.questions?.length ?? 0} questions · 📅 {formatDate(quiz.createdAt)}</span>
        {isOffline ? (
          <button onClick={() => window.print()}
            className="bg-[#1a2a3a] border border-[#58a6ff] text-[#58a6ff] text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#2a3a4a] transition">
            ⬇️ Print / Download
          </button>
        ) : (
          <button onClick={() => setActiveQuiz(quiz)}
            className="bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition">
            ▶ Take Quiz
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {/* Search */}
      <input type="text" placeholder="Search quizzes..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 border-2 border-[#21262d] bg-[#161b22] text-[#e6edf3] rounded-lg px-4 py-2 focus:border-[#2ea043] outline-none" />

      {/* Sub tabs */}
      <div className="flex gap-2 mb-6">
        {[["online","🌐 Online Quizzes"], ["offline","📄 Offline / Print"]].map(([key, label]) => (
          <button key={key} onClick={() => setSubTab(key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition"
            style={{ backgroundColor: subTab===key?"#2ea043":"#161b22", color: subTab===key?"#fff":"#8b949e", border:`1px solid ${subTab===key?"#2ea043":"#21262d"}` }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#8b949e]">Loading quizzes...</div>
      ) : subTab === "online" ? (
        onlineFiltered.length === 0 ? (
          <div className="text-center py-12 text-[#6e7681]">No online quizzes available.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {onlineFiltered.map((q) => <QuizCard key={q.id} quiz={q} isOffline={false} />)}
          </div>
        )
      ) : (
        offlineFiltered.length === 0 ? (
          <div className="text-center py-12 text-[#6e7681]">No offline quizzes available.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {offlineFiltered.map((q) => <QuizCard key={q.id} quiz={q} isOffline={true} />)}
          </div>
        )
      )}
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────────────────
function HistoryTab() {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/quizzes/attempts/mine`,  { headers: authHdr() }),
          fetch(`${API_BASE}/quizzes/attempts/stats`, { headers: authHdr() }),
        ]);
        if (aRes.ok) setAttempts(await aRes.json());
        if (sRes.ok) setStats(await sRes.json());
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const formatDate = (d) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short" }) + " " +
           new Date(d).toLocaleTimeString("en-GB", { hour:"2-digit", minute:"2-digit" });
  };

  if (loading) return <div className="text-center py-12 text-[#8b949e]">Loading history...</div>;

  return (
    <div>
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Quizzes",   value: stats.total },
            { label: "Average Score",   value: `${stats.avgScore}%` },
            { label: "AI Quizzes",      value: stats.aiCount },
            { label: "Teacher Quizzes", value: stats.teacherCount },
          ].map((s, i) => (
            <div key={i} className="bg-[#161b22] border border-[#21262d] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#2ea043]">{s.value}</div>
              <div className="text-xs text-[#6e7681] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {attempts.length === 0 ? (
        <div className="text-center py-12 text-[#6e7681]">No quiz history yet. Take a quiz to see results here.</div>
      ) : (
        <div className="space-y-3">
          {attempts.map((a) => (
            <div key={a.id} className="bg-[#161b22] border border-[#21262d] p-4 rounded-lg flex justify-between items-start hover:border-[#2ea043] transition">
              <div>
                <div className="font-semibold text-[#e6edf3]">
                  {a.subject}{a.topic ? ` — ${a.topic}` : ""}
                </div>
                <div className="text-sm text-[#6e7681]">
                  {a.level} · {a.source === "AI" ? "🤖 AI Generated" : "👩‍🏫 Teacher Quiz"}
                </div>
                <div className="text-xs text-[#6e7681] mt-1">{formatDate(a.completedAt)}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#2ea043]">{a.score}/{a.total}</div>
                <div className="text-sm text-[#6e7681]">{a.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Quiz Page ────────────────────────────────────────────────────────────
const Quiz = () => {
  const [tab, setTab] = useState("ai"); // 'ai' | 'teacher' | 'history'

  const tabs = [
    { key: "ai",      label: "🤖 AI Quiz" },
    { key: "teacher", label: "👩‍🏫 Teacher Quizzes" },
    { key: "history", label: "📊 My History" },
  ];

  return (
    <div className="bg-[#0d1117] min-h-screen p-6 text-[#e6edf3]">
      <h1 className="text-2xl font-bold text-[#2ea043] mb-6">🧠 Quizzes</h1>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b border-[#21262d] pb-0">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-4 py-2 text-sm font-semibold rounded-t-lg transition -mb-px border border-b-0"
            style={{
              backgroundColor: tab===key ? "#161b22" : "transparent",
              color:           tab===key ? "#e6edf3" : "#8b949e",
              borderColor:     tab===key ? "#21262d" : "transparent",
            }}>
            {label}
          </button>
        ))}
      </div>

      {tab === "ai"      && <AITab />}
      {tab === "teacher" && <TeacherQuizzesTab />}
      {tab === "history" && <HistoryTab />}
    </div>
  );
};

export default Quiz;