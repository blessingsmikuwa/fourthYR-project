import React, { useState, useRef } from "react";

const initialBooks = [
  {
    id: 1,
    title: "Biology Form 3 Textbook",
    author: "Malawi Institute of Education",
    subject: "Biology",
    form: "Form 3",
    size: "4.2 MB",
    type: "PDF",
    uploadedAt: "Feb 1, 2026",
    downloads: 89,
  },
  {
    id: 2,
    title: "Mathematics Past Papers Collection",
    author: "MANEB",
    subject: "Mathematics",
    form: "Form 4",
    size: "7.8 MB",
    type: "PDF",
    uploadedAt: "Jan 28, 2026",
    downloads: 134,
  },
  {
    id: 3,
    title: "English Language & Literature",
    author: "Cambridge University Press",
    subject: "English",
    form: "Form 2",
    size: "3.1 MB",
    type: "PDF",
    uploadedAt: "Jan 15, 2026",
    downloads: 61,
  },
  {
    id: 4,
    title: "Physics: Waves & Electricity",
    author: "Malawi Institute of Education",
    subject: "Physics",
    form: "Form 3",
    size: "5.5 MB",
    type: "PDF",
    uploadedAt: "Dec 20, 2025",
    downloads: 47,
  },
];

const SUBJECT_COLORS = {
  Biology: { bg: "#1a3a2a", color: "#2ea043" },
  Mathematics: { bg: "#1a2a3a", color: "#58a6ff" },
  English: { bg: "#3a2a1a", color: "#e3a525" },
  Physics: { bg: "#2a1a3a", color: "#a371f7" },
  Chemistry: { bg: "#3a1a1a", color: "#f85149" },
  History: { bg: "#2a3a1a", color: "#56d364" },
  Other: { bg: "#21262d", color: "#8b949e" },
};

const getSubjectStyle = (subject) =>
  SUBJECT_COLORS[subject] || SUBJECT_COLORS["Other"];

const FORMS = ["All Forms", "Form 1", "Form 2", "Form 3", "Form 4"];
const SUBJECTS = ["All Subjects", "Biology", "Mathematics", "English", "Physics", "Chemistry", "History", "Other"];

export default function Resources() {
  const [books, setBooks] = useState(initialBooks);
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterForm, setFilterForm] = useState("All Forms");
  const [filterSubject, setFilterSubject] = useState("All Subjects");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    subject: "Biology",
    form: "Form 1",
    file: null,
  });
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setForm((f) => ({ ...f, file }));
    } else {
      showToast("Only PDF files are supported.", "error");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleSubmit = () => {
    if (!form.title || !form.author || !form.file) {
      showToast("Please fill all fields and select a file.", "error");
      return;
    }
    const newBook = {
      id: Date.now(),
      title: form.title,
      author: form.author,
      subject: form.subject,
      form: form.form,
      size: `${(form.file.size / 1024 / 1024).toFixed(1)} MB`,
      type: "PDF",
      uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      downloads: 0,
    };
    setBooks((prev) => [newBook, ...prev]);
    setForm({ title: "", author: "", subject: "Biology", form: "Form 1", file: null });
    setShowModal(false);
    showToast(`"${newBook.title}" uploaded successfully!`);
  };

  const handleDelete = () => {
    setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("Book removed successfully.");
  };

  const filtered = books.filter((b) => {
    const matchForm = filterForm === "All Forms" || b.form === filterForm;
    const matchSubject = filterSubject === "All Subjects" || b.subject === filterSubject;
    const matchSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase());
    return matchForm && matchSubject && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <main className="max-w-6xl mx-auto p-4">

        {/* TOAST */}
        {toast && (
          <div
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all"
            style={{
              backgroundColor: toast.type === "error" ? "#3d1a1a" : "#1a3a2a",
              color: toast.type === "error" ? "#f85149" : "#2ea043",
              border: `1px solid ${toast.type === "error" ? "#f85149" : "#2ea043"}`,
            }}
          >
            {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
          </div>
        )}

        {/* HEADER */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] text-white p-8 rounded-lg mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">📚 Resources Library</h1>
            <p className="opacity-80 text-sm">
              Manage and upload books, textbooks, and study materials for students.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#2ea043] text-white font-semibold px-5 py-2 rounded-md hover:bg-[#3fb950] transition text-sm"
          >
            + Add New Book
          </button>
        </section>

        {/* STATS ROW */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { number: books.length, label: "Total Books" },
            { number: [...new Set(books.map((b) => b.subject))].length, label: "Subjects Covered" },
            { number: books.reduce((s, b) => s + b.downloads, 0), label: "Total Downloads" },
            { number: `${(books.reduce((s, b) => s + parseFloat(b.size), 0)).toFixed(1)} MB`, label: "Total Size" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-[#6e7681]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* FILTERS & SEARCH */}
        <section className="flex flex-wrap gap-3 mb-6 items-center">
          <input
            type="text"
            placeholder="🔍 Search books or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681] flex-1 min-w-[200px]"
          />
          <select
            value={filterForm}
            onChange={(e) => setFilterForm(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
          >
            {FORMS.map((f) => <option key={f}>{f}</option>)}
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
          >
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <span className="text-[#6e7681] text-sm ml-auto">
            {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
          </span>
        </section>

        {/* BOOK GRID */}
        {filtered.length === 0 ? (
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-16 text-center text-[#6e7681]">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">No books match your filters.</p>
          </div>
        ) : (
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {filtered.map((book) => {
              const subjectStyle = getSubjectStyle(book.subject);
              return (
                <div
                  key={book.id}
                  className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#2ea043] hover:-translate-y-1 transition group"
                >
                  {/* Book colour strip */}
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: subjectStyle.color }}
                  />
                  <div className="p-5">
                    {/* Subject badge + form */}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: subjectStyle.bg, color: subjectStyle.color }}
                      >
                        {book.subject}
                      </span>
                      <span className="text-xs text-[#6e7681]">{book.form}</span>
                    </div>

                    {/* Title & author */}
                    <h3 className="font-semibold text-[#e6edf3] mb-1 leading-snug">{book.title}</h3>
                    <p className="text-xs text-[#6e7681] mb-4">by {book.author}</p>

                    {/* Meta */}
                    <div className="flex gap-3 text-xs text-[#6e7681] mb-4">
                      <span>📄 {book.type}</span>
                      <span>💾 {book.size}</span>
                      <span>⬇️ {book.downloads}</span>
                    </div>

                    <p className="text-xs text-[#6e7681] mb-4">Uploaded {book.uploadedAt}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs font-semibold py-1.5 rounded hover:border-[#2ea043] transition">
                        👁 View
                      </button>
                      <button
                        onClick={() => setDeleteTarget(book)}
                        className="flex-1 bg-[#3d1a1a] border border-[#f85149] text-[#f85149] text-xs font-semibold py-1.5 rounded hover:bg-[#5a1e1e] transition"
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </main>

      {/* ── UPLOAD MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#e6edf3]">📤 Upload New Book</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6e7681] hover:text-[#e6edf3] text-xl transition"
              >
                ✕
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-5 transition"
              style={{
                borderColor: dragOver ? "#2ea043" : "#30363d",
                backgroundColor: dragOver ? "#1a3a2a" : "#0d1117",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
              />
              {form.file ? (
                <div>
                  <div className="text-3xl mb-2">📄</div>
                  <p className="text-sm text-[#2ea043] font-semibold">{form.file.name}</p>
                  <p className="text-xs text-[#6e7681] mt-1">
                    {(form.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="text-sm text-[#8b949e]">Drag & drop a PDF here, or click to browse</p>
                  <p className="text-xs text-[#6e7681] mt-1">PDF files only</p>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="space-y-3 mb-5">
              <input
                type="text"
                placeholder="Book Title *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681]"
              />
              <input
                type="text"
                placeholder="Author / Publisher *"
                value={form.author}
                onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681]"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                  className="bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
                >
                  {["Biology", "Mathematics", "English", "Physics", "Chemistry", "History", "Other"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={form.form}
                  onChange={(e) => setForm((f) => ({ ...f, form: e.target.value }))}
                  className="bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
                >
                  {["Form 1", "Form 2", "Form 3", "Form 4"].map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold py-2 rounded-md hover:border-[#6e7681] transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-[#2ea043] text-white font-semibold py-2 rounded-md hover:bg-[#3fb950] transition text-sm"
              >
                Upload Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#161b22] border border-[#f85149] rounded-xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h2 className="text-lg font-bold text-[#e6edf3] text-center mb-2">Remove Book?</h2>
            <p className="text-sm text-[#8b949e] text-center mb-6">
              Are you sure you want to remove{" "}
              <span className="text-[#e6edf3] font-semibold">"{deleteTarget.title}"</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold py-2 rounded-md hover:border-[#6e7681] transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-[#f85149] text-white font-semibold py-2 rounded-md hover:bg-[#da3633] transition text-sm"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}