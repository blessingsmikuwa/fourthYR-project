import React, { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const SUBJECT_TOPICS = {
  Biology:           ["Cell Structure","Cell Division","Photosynthesis","Respiration","Transport in Plants","Circulatory System","Nutrition","Excretion","Nervous System","Genetics","Ecology","Disease and Immunity"],
  Mathematics:       ["Algebra","Linear Equations","Quadratic Equations","Functions and Graphs","Trigonometry","Vectors","Matrices","Statistics","Probability","Mensuration"],
  Chemistry:         ["Atomic Structure","Periodic Table","Chemical Bonding","Acids and Bases","Redox Reactions","Electrochemistry","Rates of Reaction","Organic Chemistry"],
  Physics:           ["Motion","Newton's Laws","Work, Energy, Power","Waves","Light","Electricity","Magnetism","Radioactivity"],
  English:           ["Comprehension","Essay Writing","Grammar","Literature","Report Writing","Letter Writing"],
  Geography:         ["Map Reading","Climate","Physical Features of Malawi","Agriculture","Population","Environmental Conservation"],
  History:           ["Pre-colonial Malawi","Colonial Rule","Independence","Post-Independence"],
  "Civic Education": ["Human Rights","Constitution","Government","Democracy","Gender Equality"],
  "Computer Studies":["Hardware","Software","Networking","Programming","Web Design","Data Representation"],
};

const token   = () => localStorage.getItem("accessToken");
const authHdr = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${token()}` });

const userFromStorage = () => {
  try { return JSON.parse(localStorage.getItem("user")) ?? {}; } catch { return {}; }
};

// ── Small reusable components ─────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "3rem 0" }}>
      <div style={{
        width: 32, height: 32, border: "3px solid #2ea04340",
        borderTop: "3px solid #2ea043", borderRadius: "50%",
        animation: "spin 0.8s linear infinite", margin: "0 auto 0.75rem",
      }} />
      <p style={{ color: "#8b949e", fontSize: 14 }}>Loading...</p>
    </div>
  );
}

function Badge({ children, color = "#2ea043", bg = "#1a3a2a" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 99,
      fontSize: 12, fontWeight: 600, color, backgroundColor: bg, border: `1px solid ${color}40`,
    }}>
      {children}
    </span>
  );
}

function Alert({ type = "info", children }) {
  const map = {
    info:    { bg: "#0d2a3d", border: "#1f6feb", color: "#58a6ff" },
    success: { bg: "#1a3a2a", border: "#2ea043", color: "#3fb950" },
    warning: { bg: "#3d2e0a", border: "#e3b341", color: "#e3b341" },
    error:   { bg: "#3d1a1a", border: "#f85149", color: "#f85149" },
  };
  const s = map[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      color: s.color, borderRadius: 8, padding: "10px 14px",
      fontSize: 13, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#161b22", border: "1px solid #21262d",
      borderRadius: 10, padding: "1.25rem", ...style,
    }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, small = false, style = {} }) {
  const variants = {
    primary:  { bg: "#2ea043", color: "#fff", border: "#2ea043" },
    secondary:{ bg: "#21262d", color: "#e6edf3", border: "#30363d" },
    danger:   { bg: "#3d1a1a", color: "#f85149", border: "#f85149" },
    ghost:    { bg: "transparent", color: "#8b949e", border: "#21262d" },
    info:     { bg: "#0d2a3d", color: "#58a6ff", border: "#1f6feb" },
  };
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: v.bg, color: v.color, border: `1px solid ${v.border}`,
        borderRadius: 7, padding: small ? "4px 10px" : "7px 16px",
        fontSize: small ? 12 : 13, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, transition: "opacity 0.15s", ...style,
      }}
    >
      {children}
    </button>
  );
}

// ── TEACHER: Generate & Edit Questions ────────────────────────────────────────

function QuestionEditor({ questions, onChange }) {
  const update = (i, field, value) => {
    const updated = questions.map((q, idx) =>
      idx === i ? { ...q, [field]: field === "marks" ? Number(value) : value } : q
    );
    onChange(updated);
  };

  const remove = (i) => onChange(questions.filter((_, idx) => idx !== i));

  const addBlank = () =>
    onChange([
      ...questions,
      { id: `q${Date.now()}`, text: "", marks: 2, type: "short", markingGuidance: "" },
    ]);

  return (
    <div>
      {questions.map((q, i) => (
        <Card key={q.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10 }}>
            <span style={{ color: "#2ea043", fontWeight: 700, fontSize: 14, paddingTop: 3 }}>Q{i + 1}</span>
            <textarea
              value={q.text}
              onChange={e => update(i, "text", e.target.value)}
              placeholder="Question text..."
              rows={2}
              style={{
                flex: 1, background: "#0d1117", border: "1px solid #30363d",
                borderRadius: 6, color: "#e6edf3", padding: "7px 10px", fontSize: 13, resize: "vertical",
              }}
            />
            <Btn variant="danger" small onClick={() => remove(i)}>✕</Btn>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
            <div>
              <label style={{ fontSize: 11, color: "#8b949e", display: "block", marginBottom: 3 }}>Type</label>
              <select
                value={q.type}
                onChange={e => update(i, "type", e.target.value)}
                style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, color: "#e6edf3", padding: "6px 8px", fontSize: 12 }}
              >
                <option value="short">Short answer</option>
                <option value="structured">Structured</option>
                <option value="long">Long answer</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#8b949e", display: "block", marginBottom: 3 }}>Marks</label>
              <input
                type="number" min={1} max={20}
                value={q.marks}
                onChange={e => update(i, "marks", e.target.value)}
                style={{ width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 6, color: "#e6edf3", padding: "6px 8px", fontSize: 12 }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: "#8b949e", display: "block", marginBottom: 3 }}>Total so far</label>
              <div style={{ color: "#2ea043", fontWeight: 700, paddingTop: 8, fontSize: 13 }}>
                {questions.reduce((s, q) => s + (q.marks || 0), 0)} marks
              </div>
            </div>
          </div>

          <div>
            <label style={{ fontSize: 11, color: "#8b949e", display: "block", marginBottom: 3 }}>
              Marking guidance (private — shown to AI and teacher only)
            </label>
            <textarea
              value={q.markingGuidance || ""}
              onChange={e => update(i, "markingGuidance", e.target.value)}
              rows={2}
              placeholder="Key points the answer must include..."
              style={{
                width: "100%", background: "#0d1117", border: "1px solid #30363d",
                borderRadius: 6, color: "#8b949e", padding: "6px 10px", fontSize: 12, resize: "vertical",
              }}
            />
          </div>
        </Card>
      ))}
      <Btn variant="secondary" onClick={addBlank}>+ Add question manually</Btn>
    </div>
  );
}

// ── TEACHER: Create Test Page ─────────────────────────────────────────────────

function CreateTestPage({ onBack, editingTest = null }) {
  const [step, setStep]           = useState(editingTest ? 2 : 1);
  const [genForm, setGenForm]     = useState({ subject: "", form: "", topic: "", count: 5 });
  const [generating, setGen]      = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");

  const [meta, setMeta] = useState({
    title: editingTest?.title ?? "",
    subject: editingTest?.subject ?? "",
    form: editingTest?.form ?? "",
    duration: editingTest?.duration ?? "60 minutes",
    instructions: editingTest?.instructions ?? "Answer all questions. Show your working where appropriate.",
  });

  const [questions, setQuestions] = useState(editingTest?.questions ?? []);
  const [status, setStatus]       = useState(editingTest?.status ?? "DRAFT");

  const subjects = Object.keys(SUBJECT_TOPICS);
  const topics   = genForm.subject ? SUBJECT_TOPICS[genForm.subject] ?? [] : [];

  const generate = async () => {
    if (!genForm.subject || !genForm.form || !genForm.topic) {
      setError("Please fill in subject, form, and topic."); return;
    }
    setGen(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/structured-tests/generate-questions`, {
        method: "POST", headers: authHdr(),
        body: JSON.stringify({ ...genForm }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.message ?? "Failed"); }
      const data = await res.json();
      setQuestions(data.questions);
      setMeta(m => ({
        ...m,
        subject: genForm.subject,
        form: genForm.form,
        title: m.title || `${genForm.subject} — ${genForm.topic} (${genForm.form})`,
      }));
      setStep(2);
    } catch (e) {
      setError(e.message);
    } finally { setGen(false); }
  };

  const save = async (publishStatus) => {
    if (!meta.title || questions.length === 0) {
      setError("Title and at least one question are required."); return;
    }
    setSaving(true); setError("");
    try {
      const url    = editingTest ? `${API_BASE}/structured-tests/${editingTest.id}` : `${API_BASE}/structured-tests`;
      const method = editingTest ? "PATCH" : "POST";
      const res = await fetch(url, {
        method, headers: authHdr(),
        body: JSON.stringify({ ...meta, questions, status: publishStatus }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.message ?? "Failed to save"); }
      onBack(true);
    } catch (e) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Btn variant="ghost" onClick={() => onBack(false)}>← Back</Btn>
        <h2 style={{ color: "#e6edf3", fontSize: 18, fontWeight: 600, margin: 0 }}>
          {editingTest ? "Edit Test" : "Create New Test"}
        </h2>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* Step 1: AI generation */}
      {step === 1 && (
        <Card>
          <h3 style={{ color: "#2ea043", fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 16 }}>
            🤖 Generate questions with AI
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={lbl}>Subject</label>
              <select value={genForm.subject} onChange={e => setGenForm(f => ({ ...f, subject: e.target.value, topic: "" }))}
                style={sel}>
                <option value="">Select subject</option>
                {subjects.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Form / Level</label>
              <select value={genForm.form} onChange={e => setGenForm(f => ({ ...f, form: e.target.value }))} style={sel}>
                <option value="">Select form</option>
                {["Form 1","Form 2","Form 3","Form 4"].map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Topic</label>
              <select value={genForm.topic} onChange={e => setGenForm(f => ({ ...f, topic: e.target.value }))}
                disabled={!genForm.subject} style={sel}>
                <option value="">Select topic</option>
                {topics.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Number of questions</label>
              <input type="number" min={2} max={10} value={genForm.count}
                onChange={e => setGenForm(f => ({ ...f, count: Number(e.target.value) }))} style={inp} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={generate} disabled={generating}>
              {generating ? "⏳ Generating..." : "🤖 Generate questions"}
            </Btn>
            <Btn variant="secondary" onClick={() => setStep(2)}>
              Skip — add manually
            </Btn>
          </div>
        </Card>
      )}

      {/* Step 2: Edit questions + meta */}
      {step === 2 && (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <h3 style={{ color: "#2ea043", fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 14 }}>
              Test details
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Test title *</label>
                <input value={meta.title} onChange={e => setMeta(m => ({ ...m, title: e.target.value }))} style={inp} placeholder="e.g. Biology End of Term Test" />
              </div>
              <div>
                <label style={lbl}>Subject</label>
                <input value={meta.subject} onChange={e => setMeta(m => ({ ...m, subject: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Form</label>
                <input value={meta.form} onChange={e => setMeta(m => ({ ...m, form: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Duration</label>
                <input value={meta.duration} onChange={e => setMeta(m => ({ ...m, duration: e.target.value }))} style={inp} placeholder="60 minutes" />
              </div>
              <div>
                <label style={lbl}>Total marks</label>
                <div style={{ color: "#2ea043", fontWeight: 700, paddingTop: 10, fontSize: 15 }}>
                  {questions.reduce((s, q) => s + (q.marks || 0), 0)}
                </div>
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lbl}>Instructions to students</label>
                <textarea value={meta.instructions} onChange={e => setMeta(m => ({ ...m, instructions: e.target.value }))}
                  rows={2} style={{ ...inp, resize: "vertical" }} />
              </div>
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <h3 style={{ color: "#e6edf3", fontSize: 15, fontWeight: 600, margin: 0 }}>
                Questions ({questions.length})
              </h3>
              {step === 2 && (
                <Btn variant="ghost" small onClick={() => setStep(1)}>🤖 Re-generate</Btn>
              )}
            </div>
            <QuestionEditor questions={questions} onChange={setQuestions} />
          </Card>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn onClick={() => save("DRAFT")} disabled={saving} variant="secondary">
              💾 Save as draft
            </Btn>
            <Btn onClick={() => save("PUBLISHED")} disabled={saving}>
              🚀 {editingTest?.status === "PUBLISHED" ? "Save & keep published" : "Publish to students"}
            </Btn>
            {editingTest?.status === "PUBLISHED" && (
              <Btn onClick={() => save("CLOSED")} disabled={saving} variant="danger">
                🔒 Close test
              </Btn>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TEACHER: Mark a Submission ────────────────────────────────────────────────

function MarkSubmission({ submission, test, onBack }) {
  const [marks, setMarks]     = useState(() =>
    (test.questions ?? []).map(q => {
      const existing = submission.finalMarks?.find(m => m.questionId === q.id);
      const ai       = submission.aiMarking?.find(m => m.questionId === q.id);
      return {
        questionId: q.id,
        mark: existing?.mark ?? ai?.suggestedMark ?? 0,
        feedback: existing?.feedback ?? ai?.feedback ?? "",
      };
    })
  );
  const [comment, setComment] = useState(submission.teacherComment ?? "");
  const [saving, setSaving]   = useState(false);
  const [aiLoading, setAiLoad]= useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const runAI = async () => {
    setAiLoad(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/structured-tests/submissions/${submission.id}/ai-mark`, {
        method: "POST", headers: authHdr(),
      });
      if (!res.ok) throw new Error("AI marking failed");
      const data = await res.json();
      // Merge AI suggestions into local marks state
      setMarks(prev => prev.map(m => {
        const ai = data.aiMarking?.find(a => a.questionId === m.questionId);
        return ai ? { ...m, mark: ai.suggestedMark, feedback: ai.feedback } : m;
      }));
      setSuccess("AI suggestions loaded — review and adjust before saving.");
    } catch (e) {
      setError(e.message);
    } finally { setAiLoad(false); }
  };

  const updateMark = (i, field, value) => {
    setMarks(prev => prev.map((m, idx) =>
      idx === i ? { ...m, [field]: field === "mark" ? Number(value) : value } : m
    ));
  };

  const save = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/structured-tests/submissions/${submission.id}/final-marks`, {
        method: "PATCH", headers: authHdr(),
        body: JSON.stringify({ finalMarks: marks, teacherComment: comment }),
      });
      if (!res.ok) throw new Error("Failed to save marks");
      setSuccess("Marks saved and sent to student!");
      setTimeout(() => onBack(true), 1500);
    } catch (e) {
      setError(e.message);
    } finally { setSaving(false); }
  };

  const totalAwarded = marks.reduce((s, m) => s + (m.mark || 0), 0);
  const pct          = test.totalMarks ? Math.round((totalAwarded / test.totalMarks) * 100) : 0;
  const studentName  = submission.student
    ? `${submission.student.firstName} ${submission.student.lastName}`
    : `Student #${submission.studentId}`;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Btn variant="ghost" onClick={() => onBack(false)}>← Back</Btn>
        <div>
          <h2 style={{ color: "#e6edf3", fontSize: 17, fontWeight: 600, margin: 0 }}>
            Marking: {studentName}
          </h2>
          <p style={{ color: "#8b949e", fontSize: 12, margin: 0 }}>
            {test.title} · Submitted {new Date(submission.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {error   && <Alert type="error">{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
        <Btn variant="info" onClick={runAI} disabled={aiLoading}>
          {aiLoading ? "⏳ AI is marking..." : "🤖 Get AI suggestions"}
        </Btn>
        <span style={{ color: "#8b949e", fontSize: 13 }}>
          or mark manually below
        </span>
        <span style={{ marginLeft: "auto", color: "#2ea043", fontWeight: 700, fontSize: 16 }}>
          {totalAwarded} / {test.totalMarks ?? "?"} marks ({pct}%)
        </span>
      </div>

      {test.questions?.map((q, i) => {
        const answer  = submission.answers?.find(a => a.questionId === q.id)?.answer ?? "(no answer)";
        const ai      = submission.aiMarking?.find(a => a.questionId === q.id);
        const m       = marks[i];

        return (
          <Card key={q.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <p style={{ color: "#e6edf3", fontWeight: 600, fontSize: 14, margin: 0, flex: 1, paddingRight: 16 }}>
                Q{i + 1}. {q.text}
              </p>
              <Badge>{q.marks} marks</Badge>
            </div>

            {/* Student answer */}
            <div style={{ background: "#0d1117", borderRadius: 6, padding: "10px 12px", marginBottom: 10, border: "1px solid #21262d" }}>
              <p style={{ color: "#8b949e", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>Student answer</p>
              <p style={{ color: "#e6edf3", fontSize: 13, margin: 0, whiteSpace: "pre-wrap" }}>{answer}</p>
            </div>

            {/* Marking guidance */}
            {q.markingGuidance && (
              <div style={{ background: "#1a3a2a", borderRadius: 6, padding: "8px 12px", marginBottom: 10, border: "1px solid #2ea04340" }}>
                <p style={{ color: "#8b949e", fontSize: 11, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 0.5 }}>Marking guidance</p>
                <p style={{ color: "#3fb950", fontSize: 12, margin: 0 }}>{q.markingGuidance}</p>
              </div>
            )}

            {/* AI suggestion badge */}
            {ai && (
              <div style={{ background: "#0d2a3d", borderRadius: 6, padding: "8px 12px", marginBottom: 10, border: "1px solid #1f6feb40" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ color: "#58a6ff", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>
                    🤖 AI suggests
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge color="#58a6ff" bg="#0d2a3d">{ai.suggestedMark}/{ai.maxMark}</Badge>
                    <Badge
                      color={ai.confidence==="high"?"#3fb950":ai.confidence==="medium"?"#e3b341":"#f85149"}
                      bg="#0d1117"
                    >
                      {ai.confidence} confidence
                    </Badge>
                  </div>
                </div>
                <p style={{ color: "#8b949e", fontSize: 12, margin: 0 }}>{ai.feedback}</p>
              </div>
            )}

            {/* Teacher override */}
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 10 }}>
              <div>
                <label style={lbl}>Mark awarded</label>
                <input type="number" min={0} max={q.marks}
                  value={m?.mark ?? 0}
                  onChange={e => updateMark(i, "mark", e.target.value)}
                  style={{ ...inp, width: "100%" }}
                />
              </div>
              <div>
                <label style={lbl}>Feedback to student</label>
                <input
                  value={m?.feedback ?? ""}
                  onChange={e => updateMark(i, "feedback", e.target.value)}
                  placeholder="Write feedback..."
                  style={{ ...inp, width: "100%" }}
                />
              </div>
            </div>
          </Card>
        );
      })}

      <Card style={{ marginBottom: 16 }}>
        <label style={{ ...lbl, display: "block", marginBottom: 6 }}>Overall teacher comment</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
          placeholder="Overall comments on student performance..."
          style={{ ...inp, width: "100%", resize: "vertical" }} />
      </Card>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <Btn onClick={save} disabled={saving}>
          {saving ? "Saving..." : `✅ Save marks (${totalAwarded}/${test.totalMarks})`}
        </Btn>
        <span style={{ color: "#8b949e", fontSize: 13 }}>
          Student will see results once saved.
        </span>
      </div>
    </div>
  );
}

// ── TEACHER: Test Submissions List ────────────────────────────────────────────

function SubmissionsView({ test, onBack }) {
  const [subs, setSubs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/structured-tests/${test.id}/submissions`, { headers: authHdr() });
      if (res.ok) setSubs(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (marking) {
    return <MarkSubmission submission={marking} test={test} onBack={(refresh) => { setMarking(null); if (refresh) load(); }} />;
  }

  const marked   = subs.filter(s => s.status === "MARKED").length;
  const pending  = subs.length - marked;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <div>
          <h2 style={{ color: "#e6edf3", fontSize: 17, fontWeight: 600, margin: 0 }}>{test.title}</h2>
          <p style={{ color: "#8b949e", fontSize: 12, margin: 0 }}>
            {subs.length} submissions · {marked} marked · {pending} pending
          </p>
        </div>
      </div>

      {loading ? <Spinner /> : subs.length === 0 ? (
        <Card>
          <p style={{ color: "#8b949e", textAlign: "center", padding: "2rem 0", margin: 0 }}>
            No submissions yet.
          </p>
        </Card>
      ) : (
        <div>
          {subs.map(s => {
            const name = s.student ? `${s.student.firstName} ${s.student.lastName}` : `Student #${s.studentId}`;
            return (
              <Card key={s.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <p style={{ color: "#e6edf3", fontWeight: 600, margin: "0 0 4px", fontSize: 14 }}>{name}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      {s.status === "MARKED" ? (
                        <>
                          <Badge color="#3fb950" bg="#1a3a2a">Marked</Badge>
                          <Badge color="#58a6ff" bg="#0d2a3d">{s.totalScore}/{test.totalMarks} — {s.percentage}%</Badge>
                        </>
                      ) : (
                        <Badge color="#e3b341" bg="#3d2e0a">Awaiting marking</Badge>
                      )}
                      <span style={{ color: "#6e7681", fontSize: 12 }}>
                        Submitted {new Date(s.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Btn small onClick={() => setMarking(s)}>
                    {s.status === "MARKED" ? "✏️ Review / Edit marks" : "✏️ Mark"}
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── TEACHER: Dashboard ────────────────────────────────────────────────────────

function TeacherTestsView() {
  const [tests, setTests]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState("list"); // list | create | edit | submissions
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/structured-tests/mine`, { headers: authHdr() });
      if (res.ok) setTests(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (view === "create") return <CreateTestPage onBack={(refresh) => { setView("list"); if (refresh) load(); }} />;
  if (view === "edit" && selected) return <CreateTestPage editingTest={selected} onBack={(refresh) => { setView("list"); setSelected(null); if (refresh) load(); }} />;
  if (view === "submissions" && selected) return <SubmissionsView test={selected} onBack={() => { setView("list"); setSelected(null); load(); }} />;

  const statusColor = { DRAFT: "#8b949e", PUBLISHED: "#2ea043", CLOSED: "#f85149" };
  const statusBg    = { DRAFT: "#21262d", PUBLISHED: "#1a3a2a", CLOSED: "#3d1a1a" };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ color: "#e6edf3", fontSize: 18, fontWeight: 600, margin: 0 }}>My Tests</h2>
        <Btn onClick={() => setView("create")}>+ Create test</Btn>
      </div>

      {loading ? <Spinner /> : tests.length === 0 ? (
        <Card>
          <p style={{ color: "#8b949e", textAlign: "center", padding: "3rem 0", margin: 0 }}>
            No tests yet. Create one to get started.
          </p>
        </Card>
      ) : tests.map(t => (
        <Card key={t.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ color: "#e6edf3", fontWeight: 600, fontSize: 15 }}>{t.title}</span>
                <Badge color={statusColor[t.status]} bg={statusBg[t.status]}>{t.status}</Badge>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#8b949e", flexWrap: "wrap" }}>
                <span>📚 {t.subject}</span>
                <span>🎓 {t.form}</span>
                <span>⏱ {t.duration}</span>
                <span>❓ {t.questions?.length} questions</span>
                <span>📊 {t.totalMarks} marks</span>
                <span>📅 {new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Btn small variant="info" onClick={() => { setSelected(t); setView("submissions"); }}>
                📋 Submissions
              </Btn>
              <Btn small variant="secondary" onClick={() => { setSelected(t); setView("edit"); }}>
                ✏️ Edit
              </Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── STUDENT: Take Test ────────────────────────────────────────────────────────

function TakeTest({ test, onBack }) {
  const [answers, setAnswers] = useState(() =>
    (test.questions ?? []).reduce((acc, q) => ({ ...acc, [q.id]: "" }), {})
  );
  const [submitting, setSubmit] = useState(false);
  const [error, setError]       = useState("");
  const [done, setDone]         = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => {
    const m = parseInt(test.duration) || 60;
    return m * 60;
  });

  // Timer
  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTimeLeft(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [done]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timerColor = timeLeft < 300 ? "#f85149" : timeLeft < 600 ? "#e3b341" : "#2ea043";

  const submit = async () => {
    const blank = test.questions?.filter(q => !answers[q.id]?.trim());
    if (blank?.length > 0) {
      setError(`Please answer all questions. ${blank.length} unanswered.`); return;
    }
    setSubmit(true); setError("");
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const res = await fetch(`${API_BASE}/structured-tests/${test.id}/submit`, {
        method: "POST", headers: authHdr(),
        body: JSON.stringify({ answers: payload }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d?.message ?? "Submission failed"); }
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally { setSubmit(false); }
  };

  const answered = Object.values(answers).filter(v => v.trim()).length;
  const total    = test.questions?.length ?? 0;

  if (done) {
    return (
      <Card style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
        <h2 style={{ color: "#2ea043", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Test submitted!</h2>
        <p style={{ color: "#8b949e", marginBottom: 20 }}>
          Your answers have been sent to your teacher for marking. You will be notified when results are ready.
        </p>
        <Btn onClick={onBack}>← Back to tests</Btn>
      </Card>
    );
  }

  return (
    <div>
      {/* Header bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        background: "#0d1117", borderBottom: "1px solid #21262d",
        padding: "10px 0", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ color: "#e6edf3", fontWeight: 600, margin: 0, fontSize: 15 }}>{test.title}</p>
          <p style={{ color: "#8b949e", fontSize: 12, margin: 0 }}>{test.subject} · {test.form} · {test.totalMarks} marks</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: timerColor, fontWeight: 700, fontSize: 20, fontVariantNumeric: "tabular-nums" }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ color: "#6e7681", fontSize: 11 }}>remaining</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#2ea043", fontWeight: 700, fontSize: 18 }}>{answered}/{total}</div>
            <div style={{ color: "#6e7681", fontSize: 11 }}>answered</div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {test.instructions && (
        <Alert type="info">
          <strong>Instructions: </strong>{test.instructions}
        </Alert>
      )}

      {error && <Alert type="error">{error}</Alert>}

      {/* Questions */}
      {test.questions?.map((q, i) => {
        const rowHeight = q.type === "long" ? 6 : q.type === "structured" ? 4 : 2;
        return (
          <Card key={q.id} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#2ea043", fontWeight: 700, fontSize: 13 }}>Question {i + 1}</span>
              <Badge>{q.marks} {q.marks === 1 ? "mark" : "marks"}</Badge>
            </div>
            <p style={{ color: "#e6edf3", fontSize: 14, marginBottom: 12, lineHeight: 1.6 }}>{q.text}</p>
            <textarea
              value={answers[q.id] || ""}
              onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
              rows={rowHeight}
              placeholder="Write your answer here..."
              style={{
                width: "100%", background: "#0d1117", border: answers[q.id]?.trim() ? "1px solid #2ea04380" : "1px solid #30363d",
                borderRadius: 7, color: "#e6edf3", padding: "10px 12px", fontSize: 13,
                resize: "vertical", transition: "border-color 0.15s",
              }}
            />
            {answers[q.id]?.trim() && (
              <p style={{ color: "#2ea04380", fontSize: 11, marginTop: 4, marginBottom: 0 }}>✓ answered</p>
            )}
          </Card>
        );
      })}

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, paddingBottom: 32 }}>
        <Btn onClick={submit} disabled={submitting}>
          {submitting ? "Submitting..." : `📤 Submit test (${answered}/${total} answered)`}
        </Btn>
        <Btn variant="ghost" onClick={onBack}>Cancel</Btn>
      </div>
    </div>
  );
}

// ── STUDENT: View Result ──────────────────────────────────────────────────────

function ViewResult({ test, studentId, onBack }) {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/structured-tests/${test.id}/my-result`, { headers: authHdr() });
        if (!res.ok) throw new Error("Result not available yet");
        setResult(await res.json());
      } catch (e) {
        setError(e.message);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner />;
  if (error)   return <><Alert type="error">{error}</Alert><Btn onClick={onBack} variant="ghost">← Back</Btn></>;

  const isMarked = result.status === "MARKED";

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <Btn variant="ghost" onClick={onBack}>← Back</Btn>
        <h2 style={{ color: "#e6edf3", fontSize: 17, fontWeight: 600, margin: 0 }}>{test.title} — My Result</h2>
      </div>

      {isMarked ? (
        <>
          <Card style={{ textAlign: "center", marginBottom: 20, padding: "2rem" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>
              {result.percentage >= 75 ? "🌟" : result.percentage >= 50 ? "👍" : "💪"}
            </div>
            <div style={{ color: "#2ea043", fontWeight: 700, fontSize: 32 }}>{result.percentage}%</div>
            <div style={{ color: "#8b949e", fontSize: 14 }}>{result.totalScore} / {test.totalMarks} marks</div>
            {result.teacherComment && (
              <div style={{ marginTop: 16, background: "#1a3a2a", borderRadius: 8, padding: "12px 16px", textAlign: "left", border: "1px solid #2ea04340" }}>
                <p style={{ color: "#8b949e", fontSize: 11, margin: "0 0 4px", textTransform: "uppercase" }}>Teacher comment</p>
                <p style={{ color: "#3fb950", fontSize: 13, margin: 0 }}>{result.teacherComment}</p>
              </div>
            )}
          </Card>

          {test.questions?.map((q, i) => {
            const answer    = result.answers?.find(a => a.questionId === q.id)?.answer ?? "(no answer)";
            const marked    = result.finalMarks?.find(m => m.questionId === q.id);
            return (
              <Card key={q.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#e6edf3", fontWeight: 600, fontSize: 14 }}>Q{i + 1}. {q.text}</span>
                  {marked && (
                    <Badge
                      color={marked.mark >= q.marks * 0.7 ? "#3fb950" : marked.mark >= q.marks * 0.4 ? "#e3b341" : "#f85149"}
                      bg="#0d1117"
                    >
                      {marked.mark} / {q.marks}
                    </Badge>
                  )}
                </div>
                <div style={{ background: "#0d1117", borderRadius: 6, padding: "8px 12px", marginBottom: 8, border: "1px solid #21262d" }}>
                  <p style={{ color: "#8b949e", fontSize: 11, margin: "0 0 3px" }}>Your answer</p>
                  <p style={{ color: "#e6edf3", fontSize: 13, margin: 0, whiteSpace: "pre-wrap" }}>{answer}</p>
                </div>
                {marked?.feedback && (
                  <div style={{ background: "#0d2a3d", borderRadius: 6, padding: "8px 12px", border: "1px solid #1f6feb40" }}>
                    <p style={{ color: "#58a6ff", fontSize: 11, margin: "0 0 3px" }}>Teacher feedback</p>
                    <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>{marked.feedback}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </>
      ) : (
        <Card style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
          <p style={{ color: "#e6edf3", fontWeight: 600, marginBottom: 6 }}>Test submitted — awaiting marking</p>
          <p style={{ color: "#8b949e", fontSize: 13 }}>Your teacher will mark your test and you'll see your results here.</p>
        </Card>
      )}
    </div>
  );
}

// ── STUDENT: Tests List ───────────────────────────────────────────────────────

function StudentTestsView() {
  const [tests, setTests]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState("list");
  const [selected, setSelected] = useState(null);
  const user = userFromStorage();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/structured-tests/available`, { headers: authHdr() });
        if (res.ok) setTests(await res.json());
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (view === "take"   && selected) return <TakeTest test={selected} onBack={() => { setView("list"); setSelected(null); }} />;
  if (view === "result" && selected) return <ViewResult test={selected} studentId={user.id} onBack={() => { setView("list"); setSelected(null); }} />;

  return (
    <div>
      <h2 style={{ color: "#e6edf3", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Available Tests</h2>
      {loading ? <Spinner /> : tests.length === 0 ? (
        <Card><p style={{ color: "#8b949e", textAlign: "center", padding: "3rem 0", margin: 0 }}>No tests available yet.</p></Card>
      ) : tests.map(t => (
        <Card key={t.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div>
              <p style={{ color: "#e6edf3", fontWeight: 600, fontSize: 15, margin: "0 0 6px" }}>{t.title}</p>
              <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#8b949e", flexWrap: "wrap" }}>
                <span>📚 {t.subject}</span>
                <span>🎓 {t.form}</span>
                <span>⏱ {t.duration}</span>
                <span>📊 {t.totalMarks} marks</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn small variant="info" onClick={() => { setSelected(t); setView("result"); }}>
                📋 View result
              </Btn>
              <Btn small onClick={() => { setSelected(t); setView("take"); }}>
                ▶ Take test
              </Btn>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ── Shared style helpers ──────────────────────────────────────────────────────

const lbl = { fontSize: 11, color: "#8b949e", display: "block", marginBottom: 4 };
const inp = {
  background: "#0d1117", border: "1px solid #30363d", borderRadius: 6,
  color: "#e6edf3", padding: "7px 10px", fontSize: 13, width: "100%",
};
const sel = { ...inp };

// ── Main Page ─────────────────────────────────────────────────────────────────

const StructuredTests = () => {
  const user = userFromStorage();
  const isTeacher = user?.role === "TEACHER" || user?.role === "ADMIN";

  return (
    <div style={{ background: "#0d1117", minHeight: "100vh", color: "#e6edf3" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input, textarea, select { box-sizing: border-box; }
        textarea { font-family: inherit; }
      `}</style>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: "#2ea043", fontSize: 22, fontWeight: 600, margin: "0 0 4px" }}>
            📝 Structured Tests
          </h1>
          <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>
            {isTeacher
              ? "Create AI-generated written tests, review student submissions, and mark with AI assistance."
              : "Take written tests set by your teacher and view your marked results."}
          </p>
        </div>
        {isTeacher ? <TeacherTestsView /> : <StudentTestsView />}
      </div>
    </div>
  );
};

export default StructuredTests;