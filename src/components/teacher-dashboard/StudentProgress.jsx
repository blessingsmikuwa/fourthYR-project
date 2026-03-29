import React, { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────
const STUDENTS = [
  {
    id: 1, name: "Chisomo Banda", form: "Form 3", class: "3A", avatar: "CB",
    quizzes: [
      { subject: "Cell Biology",    score: 18, total: 20, date: "Feb 5, 2026" },
      { subject: "Photosynthesis",  score: 16, total: 20, date: "Jan 20, 2026" },
      { subject: "Ecology",         score: 19, total: 20, date: "Jan 10, 2026" },
    ],
    booksRead: 5, papersAccessed: 8,
  },
  {
    id: 2, name: "Mphatso Chirwa", form: "Form 3", class: "3A", avatar: "MC",
    quizzes: [
      { subject: "Cell Biology",    score: 14, total: 20, date: "Feb 5, 2026" },
      { subject: "Photosynthesis",  score: 11, total: 20, date: "Jan 20, 2026" },
      { subject: "Ecology",         score: 13, total: 20, date: "Jan 10, 2026" },
    ],
    booksRead: 3, papersAccessed: 5,
  },
  {
    id: 3, name: "Thandiwe Mwale", form: "Form 2", class: "2A", avatar: "TM",
    quizzes: [
      { subject: "Photosynthesis",  score: 19, total: 20, date: "Feb 4, 2026" },
      { subject: "Cell Biology",    score: 17, total: 20, date: "Jan 18, 2026" },
    ],
    booksRead: 7, papersAccessed: 10,
  },
  {
    id: 4, name: "Kondwani Phiri", form: "Form 3", class: "3B", avatar: "KP",
    quizzes: [
      { subject: "Cell Biology",    score: 10, total: 20, date: "Feb 5, 2026" },
      { subject: "Photosynthesis",  score: 9,  total: 20, date: "Jan 20, 2026" },
    ],
    booksRead: 2, papersAccessed: 3,
  },
  {
    id: 5, name: "Grace Mkandawire", form: "Form 2", class: "2A", avatar: "GM",
    quizzes: [
      { subject: "Photosynthesis",  score: 17, total: 20, date: "Feb 4, 2026" },
      { subject: "Cell Biology",    score: 15, total: 20, date: "Jan 18, 2026" },
      { subject: "Ecology",         score: 18, total: 20, date: "Jan 8,  2026" },
    ],
    booksRead: 6, papersAccessed: 9,
  },
  {
    id: 6, name: "Tawonga Nyirenda", form: "Form 4", class: "4B", avatar: "TN",
    quizzes: [
      { subject: "Cell Biology",    score: 20, total: 20, date: "Feb 3, 2026" },
      { subject: "Ecology",         score: 19, total: 20, date: "Jan 15, 2026" },
    ],
    booksRead: 9, papersAccessed: 14,
  },
  {
    id: 7, name: "Limbani Banda", form: "Form 4", class: "4B", avatar: "LB",
    quizzes: [
      { subject: "Cell Biology",    score: 12, total: 20, date: "Feb 3, 2026" },
    ],
    booksRead: 4, papersAccessed: 6,
  },
  {
    id: 8, name: "Suzgo Tembo", form: "Form 3", class: "3B", avatar: "ST",
    quizzes: [
      { subject: "Cell Biology",    score: 16, total: 20, date: "Feb 5, 2026" },
      { subject: "Photosynthesis",  score: 14, total: 20, date: "Jan 20, 2026" },
    ],
    booksRead: 5, papersAccessed: 7,
  },
];

const FORMS   = ["All Forms", "Form 2", "Form 3", "Form 4"];
const CLASSES = ["All Classes", "2A", "3A", "3B", "4B"];

// ── helpers ───────────────────────────────────────────────────────────────────
const avg = (arr) =>
  arr.length === 0 ? 0 : Math.round(arr.reduce((s, v) => s + v, 0) / arr.length);

const studentAvg = (s) =>
  avg(s.quizzes.map((q) => Math.round((q.score / q.total) * 100)));

const scoreColor = (pct) => {
  if (pct >= 80) return { bg: "#1a3a2a", color: "#2ea043" };
  if (pct >= 60) return { bg: "#3d2f0a", color: "#e3a525" };
  return { bg: "#3d1a1a", color: "#f85149" };
};

// ── sub-components ────────────────────────────────────────────────────────────
const MiniBar = ({ pct }) => {
  const s = scoreColor(pct);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#21262d] rounded-full h-1.5">
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: s.color }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color: s.color }}>
        {pct}%
      </span>
    </div>
  );
};

const ScoreBadge = ({ score, total }) => {
  const pct = Math.round((score / total) * 100);
  const s = scoreColor(pct);
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {score}/{total}
    </span>
  );
};

// ── main ──────────────────────────────────────────────────────────────────────
export default function StudentProgress() {
  const [selected,     setSelected]     = useState(null);
  const [filterForm,   setFilterForm]   = useState("All Forms");
  const [filterClass,  setFilterClass]  = useState("All Classes");
  const [searchVal,    setSearchVal]    = useState("");

  const filtered = STUDENTS.filter((s) => {
    const matchForm   = filterForm  === "All Forms"   || s.form  === filterForm;
    const matchClass  = filterClass === "All Classes" || s.class === filterClass;
    const matchSearch = s.name.toLowerCase().includes(searchVal.toLowerCase());
    return matchForm && matchClass && matchSearch;
  });

  const classAvg   = avg(filtered.map(studentAvg));
  const topStudent = [...filtered].sort((a, b) => studentAvg(b) - studentAvg(a))[0];
  const needsHelp  = filtered.filter((s) => studentAvg(s) < 60);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <main className="max-w-6xl mx-auto p-4">

        {/* HEADER */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] p-8 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-1">📊 Student Progress</h1>
          <p className="opacity-80 text-sm">
            Track quiz performance, activity, and progress for all your students.
          </p>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { number: filtered.length,                          label: "Students" },
            { number: `${classAvg}%`,                          label: "Class Average" },
            { number: topStudent?.name.split(" ")[0] || "—",   label: "Top Performer" },
            { number: needsHelp.length,                        label: "Need Attention" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl font-bold text-[#2ea043] truncate">{stat.number}</div>
              <div className="text-sm text-[#6e7681]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* FILTERS */}
        <section className="flex flex-wrap gap-3 mb-5 items-center">
          <input
            type="text"
            placeholder="🔍 Search students..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681] flex-1 min-w-[180px]"
          />
          <select
            value={filterForm}
            onChange={(e) => setFilterForm(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
          >
            {FORMS.map((f) => <option key={f}>{f}</option>)}
          </select>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
          >
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="text-[#6e7681] text-sm ml-auto">
            {filtered.length} student{filtered.length !== 1 ? "s" : ""}
          </span>
        </section>

        {/* SPLIT LAYOUT */}
        <div className="grid md:grid-cols-5 gap-6">

          {/* STUDENT LIST */}
          <div className="md:col-span-2">
            <h2 className="text-sm font-bold text-[#e6edf3] mb-3">👥 Students</h2>

            {filtered.length === 0 ? (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-10 text-center text-[#6e7681] text-sm">
                No students match filters.
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map((s) => {
                  const pct = studentAvg(s);
                  const sc  = scoreColor(pct);
                  const isSel = selected?.id === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelected(s)}
                      className="w-full text-left rounded-lg p-4 border transition hover:-translate-y-0.5"
                      style={{
                        backgroundColor: isSel ? "#1a3a2a" : "#161b22",
                        borderColor:     isSel ? "#2ea043" : "#21262d",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: sc.bg, color: sc.color }}
                        >
                          {s.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-semibold text-[#e6edf3] truncate">
                              {s.name}
                            </span>
                            <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: sc.color }}>
                              {pct}%
                            </span>
                          </div>
                          <MiniBar pct={pct} />
                          <div className="text-xs text-[#6e7681] mt-1">
                            {s.form} · Class {s.class}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAIL PANEL */}
          <div className="md:col-span-3">
            {!selected ? (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-16 text-center text-[#6e7681] h-full flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">👈</div>
                <p className="text-sm">Select a student to view their progress.</p>
              </div>
            ) : (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden">

                {/* Profile header */}
                {(() => {
                  const pct = studentAvg(selected);
                  const sc  = scoreColor(pct);
                  return (
                    <>
                      <div className="bg-[#1a3a2a] border-b border-[#21262d] px-6 py-5 flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ backgroundColor: sc.bg, color: sc.color, border: `2px solid ${sc.color}` }}
                        >
                          {selected.avatar}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-[#e6edf3] text-lg">{selected.name}</h3>
                          <p className="text-xs text-[#6e7681]">
                            {selected.form} · Class {selected.class}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: sc.color }}>{pct}%</div>
                          <div className="text-xs text-[#6e7681]">Overall avg</div>
                        </div>
                      </div>

                      <div className="p-5">

                        {/* Activity mini-stats */}
                        <div className="grid grid-cols-3 gap-3 mb-5">
                          {[
                            { number: selected.quizzes.length, label: "Quizzes Done" },
                            { number: selected.booksRead,      label: "Books Read" },
                            { number: selected.papersAccessed, label: "Papers Accessed" },
                          ].map((st, i) => (
                            <div key={i} className="bg-[#0d1117] border border-[#21262d] rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-[#2ea043]">{st.number}</div>
                              <div className="text-xs text-[#6e7681]">{st.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Status banner */}
                        <div
                          className="mb-5 px-4 py-3 rounded-md border text-sm font-semibold"
                          style={{ backgroundColor: sc.bg, borderColor: sc.color, color: sc.color }}
                        >
                          {pct >= 80 && "🌟 Excellent performance — keep it up!"}
                          {pct >= 60 && pct < 80 && "📈 Good progress — a bit more effort and they'll excel."}
                          {pct < 60 && "⚠️ Needs attention — consider extra support or resources."}
                        </div>

                        {/* Quiz history */}
                        <h4 className="text-xs font-bold text-[#6e7681] uppercase tracking-wider mb-3">
                          Quiz History
                        </h4>
                        <div className="space-y-2">
                          {selected.quizzes.map((q, i) => {
                            const qPct = Math.round((q.score / q.total) * 100);
                            return (
                              <div
                                key={i}
                                className="bg-[#0d1117] border border-[#21262d] rounded-md px-4 py-3 flex items-center justify-between hover:border-[#2ea043] transition"
                              >
                                <div>
                                  <p className="text-sm text-[#e6edf3] font-medium">{q.subject} Quiz</p>
                                  <p className="text-xs text-[#6e7681]">{q.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="w-24 hidden sm:block">
                                    <MiniBar pct={qPct} />
                                  </div>
                                  <ScoreBadge score={q.score} total={q.total} />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* NEEDS ATTENTION TABLE */}
        {needsHelp.length > 0 && (
          <section className="mt-8">
            <h2 className="text-base font-bold text-[#e6edf3] mb-3">
              ⚠️ Students Needing Attention
              <span className="ml-2 text-xs font-normal text-[#f85149]">below 60% average</span>
            </h2>
            <div className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-[#1a3a2a] px-5 py-3 text-xs font-bold text-[#e6edf3]">
                <span>Student</span>
                <span>Class</span>
                <span>Average</span>
                <span>Quizzes</span>
              </div>
              {needsHelp.map((s) => {
                const pct = studentAvg(s);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="w-full grid grid-cols-4 px-5 py-3 border-b border-[#21262d] last:border-none hover:bg-[#0d1117] transition text-left"
                  >
                    <span className="text-sm text-[#e6edf3]">{s.name}</span>
                    <span className="text-sm text-[#6e7681]">{s.form} · {s.class}</span>
                    <span className="text-sm font-bold text-[#f85149]">{pct}%</span>
                    <span className="text-sm text-[#6e7681]">{s.quizzes.length} done</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}