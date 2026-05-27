import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiTrendingUp,
  FiTrendingDown,
  FiTrash2,
  FiPlay,
  FiPrinter,
  FiArrowLeft,
  FiLoader,
  FiChevronRight,
  FiX,
  FiEye,
  FiAward,
  FiStar,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import {
  GiMicroscope,
  GiChemicalDrop,
  GiAtom,
  GiBrain,
  GiTeacher,
} from "react-icons/gi";
import {
  MdCalculate,
  MdMenuBook,
  MdHistoryEdu,
  MdPublic,
  MdQuiz,
  MdOutlineQuiz,
  MdSave,
  MdBarChart,
  MdHistory,
  MdSchool,
  MdScience,
} from "react-icons/md";
import {
  IoWarningOutline,
  IoFlash,
  IoPrintOutline,
  IoRocket,
} from "react-icons/io5";
import { FaRobot, FaSave, FaChartLine, FaHistory, FaBrain, FaTrophy, FaRegCheckCircle } from "react-icons/fa";
import { SiLevelsdotfyi } from "react-icons/si";
import { BiBookOpen, BiTrendingUp, BiTrendingDown, BiBrain } from "react-icons/bi";
import { TbProgressCheck } from "react-icons/tb";
import { VscDebugRestart } from "react-icons/vsc";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const SUBJECT_TOPICS = {
  Biology: ["Cell Structure and Function", "Cell Division (Mitosis and Meiosis)", "Photosynthesis", "Respiration", "Transport in Plants", "Transport in Animals (Circulatory System)", "Nutrition in Plants", "Nutrition in Animals (Human Digestive System)", "Excretion in Humans", "Nervous System", "Endocrine System", "Reproduction in Plants", "Reproduction in Humans", "Genetics and Heredity", "Evolution and Natural Selection", "Ecology and Ecosystems", "Classification of Living Things", "Disease and Immunity", "Biotechnology", "Environmental Issues in Malawi"],
  Mathematics: ["Number and Numeration", "Fractions, Decimals and Percentages", "Ratio and Proportion", "Algebra: Simplification and Expansion", "Linear Equations", "Simultaneous Equations", "Quadratic Equations", "Inequalities", "Functions and Graphs", "Sequences and Series", "Geometry: Lines and Angles", "Triangles and Congruence", "Circle Theorems", "Mensuration: Area and Perimeter", "Mensuration: Volume and Surface Area", "Trigonometry", "Vectors", "Matrices", "Statistics: Mean, Median and Mode", "Probability"],
  Chemistry: ["Atomic Structure", "The Periodic Table", "Chemical Bonding (Ionic and Covalent)", "States of Matter", "Chemical Reactions and Equations", "Acids, Bases and Salts", "Oxidation and Reduction (Redox)", "Electrochemistry", "Rates of Reaction", "Energy Changes in Reactions", "The Mole Concept", "Gases and Gas Laws", "Water and Solutions", "Metals and Non-Metals", "Carbon and Its Compounds", "Organic Chemistry: Alkanes and Alkenes", "Organic Chemistry: Alcohols and Acids", "Polymers and Plastics", "Environmental Chemistry", "Industrial Chemistry in Malawi"],
  Physics: ["Measurements and Units", "Motion: Speed, Velocity and Acceleration", "Newton's Laws of Motion", "Forces and Equilibrium", "Work, Energy and Power", "Momentum and Collisions", "Pressure in Solids, Liquids and Gases", "Heat and Temperature", "Thermal Expansion", "Transfer of Heat", "Waves: Properties and Types", "Sound Waves", "Light: Reflection", "Light: Refraction and Lenses", "Electricity: Current and Circuits", "Ohm's Law and Resistance", "Magnetism and Electromagnetism", "Electromagnetic Induction", "Radioactivity", "Electronics and Logic Gates"],
  English: ["Reading Comprehension", "Summary Writing", "Essay Writing: Argumentative", "Essay Writing: Descriptive", "Essay Writing: Narrative", "Letter Writing: Formal", "Letter Writing: Informal", "Report Writing", "Grammar: Parts of Speech", "Grammar: Tenses", "Grammar: Active and Passive Voice", "Grammar: Direct and Indirect Speech", "Vocabulary and Word Formation", "Punctuation and Spelling", "Poetry: Analysis and Appreciation", "Prose: Novel Study", "Drama: Play Study", "Oral Communication Skills", "Debate and Discussion", "Literature in Malawian Context"],
  Geography: ["Map Reading and Interpretation", "Weather and Climate", "Climate Regions of Malawi", "Malawi: Physical Features", "Malawi: Lake Malawi", "Malawi: Rivers and Water Resources", "Population Distribution in Malawi", "Rural and Urban Settlements", "Agriculture in Malawi", "Cash Crops: Tobacco, Tea and Sugar", "Fishing Industry in Malawi", "Mining and Natural Resources", "Transport and Communication in Malawi", "Trade and Economic Development", "Africa: Physical Geography", "Africa: Political Geography", "Plate Tectonics and Earthquakes", "Volcanoes", "Soil Types and Erosion", "Environmental Conservation in Malawi"],
  History: ["Early Peoples of Malawi", "Migration and Settlement of Bantu People", "Maravi Kingdom", "Ngoni Migration and Settlement", "Yao and Arab Slave Trade", "European Exploration of Africa", "Livingstone and Missionaries in Malawi", "British Central Africa Protectorate", "Colonial Administration in Nyasaland", "Resistance to Colonial Rule", "John Chilembwe Rising 1915", "Nyasaland African Congress", "Federation of Rhodesia and Nyasaland", "Malawi Congress Party and Independence", "Dr Hastings Kamuzu Banda and Independence 1964", "One Party State in Malawi", "Multiparty Democracy 1993", "Post-Independence Development in Malawi", "Africa: Colonisation and Independence", "World War I and World War II"],
  "Civic Education": ["Citizenship and Responsibilities", "Human Rights", "Children's Rights in Malawi", "The Constitution of Malawi", "Branches of Government", "The Executive: President and Cabinet", "The Legislature: Parliament of Malawi", "The Judiciary and Rule of Law", "Local Government in Malawi", "Elections and Democracy", "Political Parties in Malawi", "Gender Equality and Equity", "HIV and AIDS Awareness", "Drug and Substance Abuse", "Environmental Rights and Duties", "Community Development", "Conflict Resolution", "National Symbols of Malawi", "Regional and International Organisations (AU, SADC, UN)", "Corruption and Good Governance"],
  "Computer Studies": ["Introduction to Computers", "Computer Hardware Components", "Computer Software: System and Application", "Operating Systems", "File Management", "Word Processing (Microsoft Word)", "Spreadsheets (Microsoft Excel)", "Presentation Software (Microsoft PowerPoint)", "Database Concepts", "Internet and Email", "World Wide Web and Browsers", "Computer Networks and Types", "Network Security and Cyber Safety", "Introduction to Programming", "Algorithms and Flowcharts", "Basic Programming in Python", "HTML and Web Design Basics", "Data Representation (Binary and Hexadecimal)", "ICT in Society and Development", "ICT in Malawi: E-government and Mobile Money"],
};

const LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

const SUBJECT_ICON_MAP = {
  Mathematics: { Icon: MdCalculate, color: "#1f6feb" },
  Biology: { Icon: GiMicroscope, color: "#2ea043" },
  Chemistry: { Icon: GiChemicalDrop, color: "#a371f7" },
  Physics: { Icon: GiAtom, color: "#f0883e" },
  English: { Icon: MdMenuBook, color: "#e3b341" },
  History: { Icon: MdHistoryEdu, color: "#da3633" },
  Geography: { Icon: MdPublic, color: "#58a6ff" },
  "Civic Education": { Icon: MdSchool, color: "#56d364" },
  "Computer Studies": { Icon: MdScience, color: "#79c0ff" },
  Other: { Icon: BiBookOpen, color: "#6e7681" },
};

const SUBJECT_COLORS = {
  Biology: "#2ea043", Mathematics: "#1f6feb", Chemistry: "#a371f7",
  Physics: "#f0883e", English: "#e3b341", Geography: "#58a6ff",
  History: "#da3633", "Civic Education": "#56d364", "Computer Studies": "#79c0ff",
};

function SubjectIcon({ name, size = 20 }) {
  const entry = SUBJECT_ICON_MAP[name] ?? SUBJECT_ICON_MAP["Other"];
  return <entry.Icon size={size} style={{ color: entry.color }} />;
}

const token = () => localStorage.getItem("accessToken");
const authHdr = () => ({ "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) });

async function logAttempt(payload) {
  try {
    await fetch(`${API_BASE}/quizzes/attempts`, {
      method: "POST", headers: authHdr(), body: JSON.stringify(payload),
    });
  } catch { }
}

// ── Toast System ──────────────────────────────────────────────────────────────
let _showToast = null;

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _showToast = (msg, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    };
    return () => { _showToast = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-semibold max-w-sm animate-fade-in"
          style={{
            backgroundColor: t.type === "error" ? "#3d1a1a"
              : t.type === "warning" ? "#3d2e0a"
                : t.type === "info" ? "#0d2a3d"
                  : "#1a3a2a",
            border: `1px solid ${t.type === "error" ? "#f85149"
                : t.type === "warning" ? "#e3b341"
                  : t.type === "info" ? "#58a6ff"
                    : "#2ea043"}`,
            color: t.type === "error" ? "#f85149"
              : t.type === "warning" ? "#e3b341"
                : t.type === "info" ? "#58a6ff"
                  : "#2ea043",
          }}>
          <span className="flex-shrink-0 text-base">
            {t.type === "error" ? <IoWarningOutline /> : t.type === "warning" ? <IoFlash /> : t.type === "info" ? <FiInfo /> : <FiCheck />}
          </span>
          <span className="leading-snug">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}

function showToast(msg, type = "success") {
  if (_showToast) _showToast(msg, type);
}

// ── AI Recommendations ────────────────────────────────────────────────────────
function AIRecommendations({ subject, topic, score, total }) {
  const [recs, setRecs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const go = async () => {
      try {
        const pct = Math.round((score / total) * 100);
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{
              role: "user",
              content: `A secondary school student in Malawi just completed a ${subject} quiz on "${topic}" and scored ${score}/${total} (${pct}%). Give 3 specific, actionable study recommendations to help them improve. Return ONLY a JSON array with exactly 3 objects, each with "tip" (short title, max 6 words) and "detail" (1-2 sentence explanation). No markdown, no extra text.`
            }]
          })
        });
        const data = await res.json();
        const text = data.content?.find(b => b.type === "text")?.text ?? "[]";
        const s = text.indexOf("["), e = text.lastIndexOf("]");
        if (s !== -1 && e !== -1) setRecs(JSON.parse(text.slice(s, e + 1)));
      } catch { setRecs(null); }
      finally { setLoading(false); }
    };
    go();
  }, []);

  if (loading) return (
    <div className="mt-4 bg-[#0d1117] border border-[#21262d] rounded-lg p-4 animate-pulse">
      <div className="h-3 bg-[#21262d] rounded w-48 mb-3" />
      <div className="space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-2 bg-[#21262d] rounded" />)}</div>
    </div>
  );
  if (!recs) return null;

  return (
    <div className="mt-4 bg-[#0d1117] border border-[#1f6feb] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <FaRobot className="text-[#58a6ff]" />
        <span className="text-sm font-bold text-[#58a6ff]">AI Study Recommendations</span>
      </div>
      <div className="space-y-3">
        {recs.map((r, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1f6feb] text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</div>
            <div>
              <p className="text-sm font-semibold text-[#e6edf3]">{r.tip}</p>
              <p className="text-xs text-[#8b949e] mt-0.5">{r.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value, color = "#2ea043" }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { const t = setTimeout(() => setWidth(value), 100); return () => clearTimeout(t); }, [value]);
  const getColor = p => p >= 75 ? color : p >= 50 ? "#e3b341" : "#da3633";
  return (
    <div className="w-full bg-[#21262d] rounded-full h-2.5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${width}%`, backgroundColor: getColor(value) }} />
    </div>
  );
}

// ── Subject Progress Card ─────────────────────────────────────────────────────
function SubjectProgressCard({ subject, attempts, onClick }) {
  const avg = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;
  const color = SUBJECT_COLORS[subject] || "#2ea043";
  const best = attempts.length > 0 ? Math.max(...attempts.map(a => a.percentage)) : 0;
  const trend = attempts.length >= 2 ? attempts[0].percentage - attempts[1].percentage : 0;

  return (
    <button onClick={onClick}
      className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 text-left hover:border-[#2ea043] transition w-full group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SubjectIcon name={subject} size={18} />
          <span className="text-sm font-bold" style={{ color }}>{subject}</span>
        </div>
        <div className="flex items-center gap-1">
          {trend !== 0 && (
            <span className={`text-xs flex items-center gap-0.5 ${trend > 0 ? "text-[#2ea043]" : "text-[#da3633]"}`}>
              {trend > 0 ? <BiTrendingUp /> : <BiTrendingDown />}{Math.abs(trend)}%
            </span>
          )}
          <span className="text-xs text-[#6e7681]">{attempts.length} quiz{attempts.length !== 1 ? "zes" : ""}</span>
        </div>
      </div>
      <div className="mb-2"><ProgressBar value={avg} color={color} /></div>
      <div className="flex justify-between text-xs text-[#6e7681]">
        <span>Avg: <span className="font-bold text-[#e6edf3]">{avg}%</span></span>
        <span>Best: <span className="font-bold text-[#e6edf3]">{best}%</span></span>
      </div>
      <div className="text-xs text-[#2ea043] mt-1 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
        View details <FiChevronRight className="text-xs" />
      </div>
    </button>
  );
}

// ── Subject Detail Modal ──────────────────────────────────────────────────────
function SubjectDetailModal({ subject, attempts, onClose }) {
  const color = SUBJECT_COLORS[subject] || "#2ea043";
  const sorted = [...attempts].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
  const byTopic = {};
  attempts.forEach(a => {
    if (!byTopic[a.topic]) byTopic[a.topic] = [];
    byTopic[a.topic].push(a);
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#21262d] flex items-center justify-between sticky top-0 bg-[#161b22]">
          <div>
            <div className="flex items-center gap-2">
              <SubjectIcon name={subject} size={24} />
              <h2 className="text-lg font-bold" style={{ color }}>{subject}</h2>
            </div>
            <p className="text-xs text-[#6e7681]">{attempts.length} attempts total</p>
          </div>
          <button onClick={onClose} className="text-[#6e7681] hover:text-[#e6edf3] text-xl">
            <FiX />
          </button>
        </div>
        <div className="p-6">
          {sorted.length > 1 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-[#8b949e]">Score History</h3>
              <div className="flex items-end gap-2 h-24">
                {sorted.slice(-10).map((a, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-sm" style={{ height: `${a.percentage * 0.8}%`, backgroundColor: color, minHeight: 4 }} />
                    <span className="text-[10px] text-[#6e7681]">{a.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <h3 className="text-sm font-semibold mb-3 text-[#8b949e]">Performance by Topic</h3>
          <div className="space-y-3">
            {Object.entries(byTopic).map(([topic, topicAttempts]) => {
              const avg = Math.round(topicAttempts.reduce((s, a) => s + a.percentage, 0) / topicAttempts.length);
              return (
                <div key={topic}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#e6edf3] truncate pr-2">{topic}</span>
                    <span className="text-[#8b949e] flex-shrink-0">{avg}% · {topicAttempts.length}x</span>
                  </div>
                  <ProgressBar value={avg} color={color} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Saved AI Quizzes Tab ──────────────────────────────────────────────────────
function SavedAIQuizzesTab({ onRetake }) {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attempts, setAttempts] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [savedRes, attRes] = await Promise.all([
        fetch(`${API_BASE}/quizzes/saved-ai`, { headers: authHdr() }),
        fetch(`${API_BASE}/quizzes/attempts/mine`, { headers: authHdr() }),
      ]);
      if (savedRes.ok) setSaved(await savedRes.json());
      if (attRes.ok) setAttempts(await attRes.json());
    } catch {
      showToast("Failed to load saved quizzes.", "error");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const lastScoreMap = {};
  attempts.forEach(a => {
    if (a.quizId && !(a.quizId in lastScoreMap)) {
      lastScoreMap[a.quizId] = a.percentage;
    }
  });

  const deleteQuiz = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/quizzes/${id}`, { method: "DELETE", headers: authHdr() });
      if (res.ok) {
        setSaved(prev => prev.filter(q => q.id !== id));
        showToast("Quiz deleted.");
      } else {
        showToast("Failed to delete quiz.", "error");
      }
    } catch {
      showToast("Failed to delete quiz.", "error");
    }
  };

  const filtered = saved.filter(q =>
    (q.subject ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (q.title ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="text-center py-12">
      <div className="w-6 h-6 border-2 border-[#2ea043] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
      <p className="text-sm text-[#8b949e]">Loading saved quizzes...</p>
    </div>
  );

  return (
    <div>
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6e7681]" size={16} />
        <input type="text" placeholder="Search saved quizzes..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border-2 border-[#21262d] bg-[#161b22] text-[#e6edf3] rounded-lg pl-10 pr-4 py-2 focus:border-[#2ea043] outline-none text-sm" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#6e7681]">
          <div className="text-4xl mb-3 flex justify-center"><BiBrain size={48} /></div>
          <p className="text-sm">No saved AI quizzes yet. Generate a quiz — it will be saved here automatically.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(q => {
            const lastScore = lastScoreMap[q.id] ?? null;
            const normalised = (q.questions ?? []).map(qu => ({
              question: qu.text ?? qu.question,
              options: qu.options,
              correct: qu.answer ?? qu.correct ?? 0,
            }));
            return (
              <div key={q.id} className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 hover:border-[#2ea043] transition">
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1a3a2a] text-[#2ea043] flex items-center gap-1">
                    <SubjectIcon name={q.subject} size={12} /> {q.subject}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded border border-[#21262d] text-[#6e7681] flex items-center gap-1">
                    <SiLevelsdotfyi /> {q.form}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[#1a2a3a] text-[#58a6ff] flex items-center gap-1">
                    <FaRobot /> AI Saved
                  </span>
                </div>
                <h3 className="font-semibold text-[#e6edf3] mb-1 text-sm">{q.title}</h3>
                <p className="text-xs text-[#6e7681] mb-3">
                  <MdQuiz className="inline mr-1" size={12} /> {q.questions?.length ?? 0} questions · Saved {new Date(q.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                {lastScore != null && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#6e7681]">Last score</span>
                      <span className="font-bold text-[#2ea043]">{lastScore}%</span>
                    </div>
                    <ProgressBar value={lastScore} />
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => onRetake({ ...q, questions: normalised, _dbId: q.id })}
                    className="flex-1 bg-[#2ea043] text-white text-xs font-semibold px-3 py-2 rounded hover:bg-[#238636] transition flex items-center justify-center gap-1">
                    <FiPlay size={12} /> {lastScore != null ? "Retake Quiz" : "Take Quiz"}
                  </button>
                  <button onClick={() => deleteQuiz(q.id)}
                    className="text-xs text-[#f85149] hover:text-[#da3633] px-2 py-2 transition">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Progress Tab ──────────────────────────────────────────────────────────────
function ProgressTab() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/quizzes/attempts/mine`, { headers: authHdr() });
        if (res.ok) setAttempts(await res.json());
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-[#161b22] rounded-lg animate-pulse" />)}</div>
  );

  const bySubject = {};
  attempts.forEach(a => {
    if (!bySubject[a.subject]) bySubject[a.subject] = [];
    bySubject[a.subject].push(a);
  });
  const subjects = Object.keys(bySubject);
  const overallAvg = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0;
  const recent = attempts.slice(0, 5);
  const prev = attempts.slice(5, 10);
  const recentAvg = recent.length ? Math.round(recent.reduce((s, a) => s + a.percentage, 0) / recent.length) : 0;
  const prevAvg = prev.length ? Math.round(prev.reduce((s, a) => s + a.percentage, 0) / prev.length) : 0;
  const overallTrend = recentAvg - prevAvg;

  return (
    <div>
      <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#e6edf3]">Overall Progress</h2>
            <p className="text-xs text-[#6e7681]">{attempts.length} quiz attempts · {subjects.length} subjects</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#2ea043]">{overallAvg}%</div>
            {overallTrend !== 0 && prev.length > 0 && (
              <div className={`text-xs flex items-center gap-0.5 justify-end ${overallTrend > 0 ? "text-[#2ea043]" : "text-[#da3633]"}`}>
                {overallTrend > 0 ? <BiTrendingUp /> : <BiTrendingDown />} {Math.abs(overallTrend)}% vs last period
              </div>
            )}
          </div>
        </div>
        <ProgressBar value={overallAvg} />
        <div className="mt-3 text-xs text-[#6e7681] flex items-center gap-1">
          {overallAvg >= 75 ? <FiAward className="text-[#e3b341]" /> : overallAvg >= 50 ? <FiTrendingUp /> : <GiBrain />}
          {overallAvg >= 75 ? " Excellent work! Keep it up!" :
            overallAvg >= 50 ? " Good progress! Push for 75%+" :
              " Keep practising — you'll get there!"}
        </div>
      </div>

      {subjects.length > 0 && (
        <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6 mb-6">
          <h3 className="text-sm font-bold mb-4 text-[#8b949e]">Subject Breakdown</h3>
          <div className="space-y-4">
            {subjects.map(sub => {
              const subAttempts = bySubject[sub];
              const avg = Math.round(subAttempts.reduce((s, a) => s + a.percentage, 0) / subAttempts.length);
              const color = SUBJECT_COLORS[sub] || "#2ea043";
              return (
                <button key={sub} onClick={() => setSelected(sub)} className="w-full text-left group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <SubjectIcon name={sub} size={16} />
                      <span className="text-sm font-semibold group-hover:underline" style={{ color }}>{sub}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#6e7681]">{subAttempts.length} attempts</span>
                      <span className="text-sm font-bold text-[#e6edf3]">{avg}%</span>
                    </div>
                  </div>
                  <ProgressBar value={avg} color={color} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="text-center py-16 text-[#6e7681]">
          <div className="text-4xl mb-3 flex justify-center"><MdBarChart size={48} /></div>
          <p className="text-sm">No quiz data yet. Take some quizzes to track your progress!</p>
        </div>
      ) : (
        <>
          <h3 className="text-sm font-bold mb-3 text-[#8b949e] flex items-center gap-1">
            <FiEye /> Subjects (click for details)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map(sub => (
              <SubjectProgressCard key={sub} subject={sub} attempts={bySubject[sub]} onClick={() => setSelected(sub)} />
            ))}
          </div>
        </>
      )}

      {selected && (
        <SubjectDetailModal subject={selected} attempts={bySubject[selected]} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

// ── Quiz Runner ───────────────────────────────────────────────────────────────
function QuizRunner({ questions, meta, onDone, source, quizId, isSaved }) {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [showRecs, setShowRecs] = useState(false);
  const autoSaveFired = useRef(false);

  const select = (qi, oi) => { if (score !== null) return; setAnswers(a => ({ ...a, [qi]: oi })); };

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const unanswered = questions.length - Object.keys(answers).length;
      showToast(
        `Please answer all questions. ${unanswered} question${unanswered > 1 ? "s" : ""} still unanswered.`,
        "warning"
      );
      return;
    }

    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === (q.correct ?? q.answer)) correct++; });
    setScore(correct);

    const pct = Math.round((correct / questions.length) * 100);

    await logAttempt({
      source, quizId: quizId ?? null,
      subject: meta.subject, topic: meta.topic ?? meta.title,
      level: meta.level ?? meta.form,
      score: correct, total: questions.length, percentage: pct,
      answers: Object.values(answers), questions,
    });

    if (source === "AI" && !isSaved && !autoSaveFired.current) {
      autoSaveFired.current = true;
      try {
        const res = await fetch(`${API_BASE}/quizzes/save-ai`, {
          method: "POST",
          headers: authHdr(),
          body: JSON.stringify({
            subject: meta.subject,
            level: meta.level,
            topic: meta.topic,
            questions,
          }),
        });
        if (res.ok) {
          showToast("Quiz saved to your library automatically! Find it in Saved AI.", "info");
        }
      } catch { }
    }
  };

  const answered = Object.keys(answers).length;
  const fillPct = Math.round((answered / questions.length) * 100);

  const optionStyle = (qi, oi) => {
    if (score === null)
      return answers[qi] === oi ? "border-[#2ea043] bg-[#2ea04320]" : "border-[#21262d] hover:bg-[#21262d]";
    const correct = questions[qi].correct ?? questions[qi].answer;
    if (correct === oi) return "border-[#2ea043] bg-[#2ea04320]";
    if (answers[qi] === oi) return "border-[#da3633] bg-[#da363320]";
    return "border-[#21262d] opacity-50";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-[#8b949e] mb-2">
        <div className="flex items-center gap-2">
          <SubjectIcon name={meta.subject} size={16} />
          <span>{meta.subject} · {meta.level ?? meta.form} · {meta.topic ?? meta.title}</span>
        </div>
        <span>{answered} / {questions.length} answered</span>
      </div>
      <div className="mb-4"><ProgressBar value={fillPct} /></div>

      {questions.map((q, i) => (
        <div key={i} className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
          <p className="font-semibold mb-4 text-lg">{i + 1}. {q.question ?? q.text}</p>
          <div className="space-y-3">
            {q.options.map((opt, j) => (
              <label key={j} onClick={() => select(i, j)}
                className={`flex items-center gap-3 cursor-pointer p-3 rounded-md border transition ${optionStyle(i, j)}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${answers[i] === j ? "border-[#2ea043] bg-[#2ea043]" : "border-[#6e7681]"}`}>
                  {answers[i] === j && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>{opt}</span>
                {score !== null && <span className="ml-auto">{(q.correct ?? q.answer) === j ? <FiCheck /> : answers[i] === j ? <FiX /> : ""}</span>}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 justify-center mt-6">
        {score === null ? (
          <button onClick={submit}
            className="bg-[#2ea043] text-white px-8 py-3 rounded-lg hover:bg-[#238636] font-semibold transition flex items-center gap-2">
            <FaRegCheckCircle /> Submit Quiz
          </button>
        ) : (
          <div className="w-full space-y-4">
            <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#2ea043] mb-1 flex items-center justify-center gap-2">
                <FaTrophy /> Quiz Complete! <FaTrophy />
              </div>
              <div className="text-xl">
                Score: <span className="font-bold text-[#2ea043]">{score}</span> / {questions.length} ({Math.round((score / questions.length) * 100)}%)
              </div>
              <div className="mb-4 mt-2 max-w-xs mx-auto">
                <ProgressBar value={Math.round((score / questions.length) * 100)} />
              </div>
              <div className="text-sm text-[#6e7681] flex items-center justify-center gap-1">
                {score === questions.length ? <FiStar className="text-[#e3b341]" /> : score >= questions.length * 0.7 ? <FiCheck className="text-[#2ea043]" /> : <GiBrain className="text-[#58a6ff]" />}
                {score === questions.length ? " Perfect! Excellent work!" : score >= questions.length * 0.7 ? " Great job! Keep it up!" : " Good effort! Try again to improve."}
              </div>
              <div className="flex gap-3 justify-center mt-4 flex-wrap">
                <button onClick={() => setShowRecs(r => !r)}
                  className="bg-[#21262d] border border-[#30363d] text-[#e6edf3] px-4 py-2 rounded-lg hover:border-[#58a6ff] font-semibold text-sm transition flex items-center gap-2">
                  <FaRobot /> {showRecs ? "Hide" : "View"} AI Tips
                </button>
                <button onClick={onDone}
                  className="bg-[#2ea043] text-white px-6 py-2 rounded-lg hover:bg-[#238636] font-semibold transition flex items-center gap-2">
                  <VscDebugRestart /> Back
                </button>
              </div>
            </div>
            {showRecs && (
              <AIRecommendations subject={meta.subject} topic={meta.topic ?? meta.title} score={score} total={questions.length} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── AI Tab ────────────────────────────────────────────────────────────────────
function AITab() {
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQ] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const topics = subject ? (SUBJECT_TOPICS[subject] ?? []) : [];

  const generate = async () => {
    if (!subject || !level || !topic) {
      showToast("Please select a subject, level, and topic before generating.", "warning");
      return;
    }
    setLoading(true); setQ([]); setMeta(null);
    try {
      const res = await fetch(`${API_BASE}/quizzes/generate`, {
        method: "POST", headers: authHdr(),
        body: JSON.stringify({ subject, level, topic }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        showToast(d?.message ?? "Failed to generate quiz. Please try again.", "error");
        return;
      }
      const data = await res.json();
      setQ(data.questions);
      setMeta({ subject: data.subject, level: data.level, topic: data.topic });
    } catch {
      showToast("Network error. Please check your connection and try again.", "error");
    } finally { setLoading(false); }
  };

  if (meta && questions.length > 0) {
    return <QuizRunner questions={questions} meta={meta} source="AI" onDone={() => { setQ([]); setMeta(null); }} />;
  }

  return (
    <div>
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <select value={subject} onChange={e => { setSubject(e.target.value); setTopic(""); }} disabled={loading}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50">
            <option value="">Select Subject</option>
            {Object.keys(SUBJECT_TOPICS).map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={level} onChange={e => setLevel(e.target.value)} disabled={loading}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50">
            <option value="">Select Level</option>
            {LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={topic} onChange={e => setTopic(e.target.value)} disabled={loading || !subject}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50 lg:col-span-2">
            <option value="">{subject ? "Select Topic" : "Select a subject first"}</option>
            {topics.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={generate} disabled={loading}
          className="bg-[#2ea043] text-white px-6 py-3 rounded-lg hover:bg-[#238636] font-semibold disabled:opacity-50 transition flex items-center gap-2">
          {loading ? <FiLoader className="animate-spin" /> : <FaRobot />}
          {loading ? " Generating..." : " Generate Quiz"}
        </button>
      </div>
      {loading && (
        <div className="text-center py-12">
          <div className="text-[#8b949e] text-sm">Generating your quiz, please wait...</div>
          <div className="mt-3 w-8 h-8 border-2 border-[#2ea043] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}

// ── Teacher Quizzes Tab ───────────────────────────────────────────────────────
function TeacherQuizzesTab() {
  const [quizzes, setQuizzes] = useState([]);
  const [offline, setOffline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [subTab, setSubTab] = useState("online");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [onRes, offRes] = await Promise.all([
          fetch(`${API_BASE}/quizzes/available`, { headers: authHdr() }),
          fetch(`${API_BASE}/quizzes/available/offline`, { headers: authHdr() }),
        ]);
        if (onRes.ok) setQuizzes(await onRes.json());
        if (offRes.ok) setOffline(await offRes.json());
      } catch {
        showToast("Failed to load quizzes.", "error");
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (activeQuiz) {
    return (
      <QuizRunner
        questions={activeQuiz.questions ?? []}
        meta={{ subject: activeQuiz.subject, level: activeQuiz.form, topic: activeQuiz.title }}
        source="TEACHER" quizId={activeQuiz.id}
        onDone={() => setActiveQuiz(null)}
      />
    );
  }

  const onlineFiltered = quizzes.filter(q => q.title?.toLowerCase().includes(search.toLowerCase()) || q.subject?.toLowerCase().includes(search.toLowerCase()));
  const offlineFiltered = offline.filter(q => q.title?.toLowerCase().includes(search.toLowerCase()) || q.subject?.toLowerCase().includes(search.toLowerCase()));
  const formatDate = d => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const QuizCard = ({ quiz, isOffline }) => (
    <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-5 hover:border-[#2ea043] transition">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#1a3a2a] text-[#2ea043] flex items-center gap-1">
            <SubjectIcon name={quiz.subject} size={12} /> {quiz.subject}
          </span>
          <span className="text-xs px-2 py-0.5 rounded border border-[#21262d] text-[#6e7681] flex items-center gap-1">
            <SiLevelsdotfyi /> {quiz.form}
          </span>
          <span className="text-xs px-2 py-0.5 rounded flex items-center gap-1" style={{ backgroundColor: quiz.visibility === "PUBLIC" ? "#1a2a3a" : "#2a1a3a", color: quiz.visibility === "PUBLIC" ? "#58a6ff" : "#a371f7" }}>
            {quiz.visibility === "PUBLIC" ? <MdQuiz /> : <MdOutlineQuiz />}
            {quiz.visibility === "PUBLIC" ? " Public" : " School"}
          </span>
        </div>
        <span className="text-xs text-[#6e7681]">{quiz.duration}</span>
      </div>
      <h3 className="font-semibold text-[#e6edf3] mb-1">{quiz.title}</h3>
      {quiz.description && <p className="text-xs text-[#6e7681] mb-3 line-clamp-2">{quiz.description}</p>}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6e7681] flex items-center gap-1">
          <MdQuiz /> {quiz.questions?.length ?? 0} questions · 📅 {formatDate(quiz.createdAt)}
        </span>
        {isOffline ? (
          <button onClick={() => window.print()}
            className="bg-[#1a2a3a] border border-[#58a6ff] text-[#58a6ff] text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#2a3a4a] transition flex items-center gap-1">
            <IoPrintOutline /> Print / Download
          </button>
        ) : (
          <button onClick={() => setActiveQuiz(quiz)}
            className="bg-[#2ea043] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#3fb950] transition flex items-center gap-1">
            <FiPlay size={12} /> Take Quiz
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6e7681]" size={16} />
        <input type="text" placeholder="Search quizzes..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border-2 border-[#21262d] bg-[#161b22] text-[#e6edf3] rounded-lg pl-10 pr-4 py-2 focus:border-[#2ea043] outline-none" />
      </div>
      <div className="flex gap-2 mb-6">
        {[["online", <MdQuiz key="online-icon" />, " Online Quizzes"], ["offline", <IoPrintOutline key="offline-icon" />, " Print / Offline"]].map(([key, icon, label]) => (
          <button key={key} onClick={() => setSubTab(key)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1"
            style={{ backgroundColor: subTab === key ? "#2ea043" : "#161b22", color: subTab === key ? "#fff" : "#8b949e", border: `1px solid ${subTab === key ? "#2ea043" : "#21262d"}` }}>
            {icon} {label}
          </button>
        ))}
      </div>
      {loading
        ? <div className="text-center py-12 text-[#8b949e]">Loading quizzes...</div>
        : subTab === "online"
          ? onlineFiltered.length === 0
            ? <div className="text-center py-12 text-[#6e7681]">No online quizzes available.</div>
            : <div className="grid md:grid-cols-2 gap-4">{onlineFiltered.map(q => <QuizCard key={q.id} quiz={q} isOffline={false} />)}</div>
          : offlineFiltered.length === 0
            ? <div className="text-center py-12 text-[#6e7681]">No offline quizzes available.</div>
            : <div className="grid md:grid-cols-2 gap-4">{offlineFiltered.map(q => <QuizCard key={q.id} quiz={q} isOffline={true} />)}</div>
      }
    </div>
  );
}

// ── History Tab ───────────────────────────────────────────────────────────────
function HistoryTab() {
  const [attempts, setAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          fetch(`${API_BASE}/quizzes/attempts/mine`, { headers: authHdr() }),
          fetch(`${API_BASE}/quizzes/attempts/stats`, { headers: authHdr() }),
        ]);
        if (aRes.ok) setAttempts(await aRes.json());
        if (sRes.ok) setStats(await sRes.json());
      } catch { }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const formatDate = d => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) + " " +
      new Date(d).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div className="text-center py-12 text-[#8b949e]">Loading history...</div>;

  return (
    <div>
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Quizzes", value: stats.total, icon: <MdQuiz /> },
            { label: "Average Score", value: `${stats.avgScore}%`, icon: <TbProgressCheck /> },
            { label: "AI Quizzes", value: stats.aiCount, icon: <FaRobot /> },
            { label: "Teacher Quizzes", value: stats.teacherCount, icon: <GiTeacher /> },
          ].map((s, i) => (
            <div key={i} className="bg-[#161b22] border border-[#21262d] p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-[#2ea043] flex items-center justify-center gap-2">{s.icon} {s.value}</div>
              <div className="text-xs text-[#6e7681] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {attempts.length === 0 ? (
        <div className="text-center py-12 text-[#6e7681]">No quiz history yet. Take a quiz to see results here.</div>
      ) : (
        <div className="space-y-3">
          {attempts.map(a => (
            <div key={a.id} className="bg-[#161b22] border border-[#21262d] p-4 rounded-lg flex justify-between items-start hover:border-[#2ea043] transition">
              <div>
                <div className="font-semibold text-[#e6edf3] flex items-center gap-2">
                  <SubjectIcon name={a.subject} size={16} />
                  {a.subject}{a.topic ? ` — ${a.topic}` : ""}
                </div>
                <div className="text-sm text-[#6e7681] flex items-center gap-1 mt-1">
                  <MdSchool /> {a.level} · {a.source === "AI" ? <><FaRobot className="inline" /> AI Generated</> : <><GiTeacher className="inline" /> Teacher Quiz</>}
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
  const [tab, setTab] = useState("ai");
  const [retakeQuiz, setRetake] = useState(null);

  const tabs = [
    { key: "ai", label: "AI Quiz", icon: <FaRobot /> },
    { key: "saved", label: "Saved AI", icon: <MdSave /> },
    { key: "teacher", label: "Teacher Quizzes", icon: <GiTeacher /> },
    { key: "progress", label: "My Progress", icon: <FaChartLine /> },
    { key: "history", label: "History", icon: <MdHistory /> },
  ];

  if (retakeQuiz) {
    return (
      <div className="bg-[#0d1117] min-h-screen p-6 text-[#e6edf3]">
        <ToastContainer />
        <button onClick={() => setRetake(null)} className="mb-4 text-sm text-[#58a6ff] hover:underline flex items-center gap-1">
          <FiArrowLeft /> Back to Saved Quizzes
        </button>
        <QuizRunner
          questions={retakeQuiz.questions}
          meta={{ subject: retakeQuiz.subject, level: retakeQuiz.form ?? retakeQuiz.level, topic: retakeQuiz.title ?? retakeQuiz.topic }}
          source="AI"
          quizId={retakeQuiz._dbId ?? retakeQuiz.id}
          isSaved={true}
          onDone={() => setRetake(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-[#0d1117] min-h-screen p-6 text-[#e6edf3]">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-[#2ea043] mb-6 flex items-center gap-2">
        <FaBrain /> Quizzes
      </h1>
      <div className="flex gap-1 mb-6 border-b border-[#21262d] pb-0 flex-wrap">
        {tabs.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className="px-4 py-2 text-sm font-semibold rounded-t-lg transition -mb-px border border-b-0 flex items-center gap-2"
            style={{
              backgroundColor: tab === key ? "#161b22" : "transparent",
              color: tab === key ? "#e6edf3" : "#8b949e",
              borderColor: tab === key ? "#21262d" : "transparent",
            }}>
            {icon} {label}
          </button>
        ))}
      </div>

      {tab === "ai" && <AITab />}
      {tab === "saved" && <SavedAIQuizzesTab onRetake={q => setRetake(q)} />}
      {tab === "teacher" && <TeacherQuizzesTab />}
      {tab === "progress" && <ProgressTab />}
      {tab === "history" && <HistoryTab />}
    </div>
  );
};

export default Quiz;