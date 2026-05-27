<<<<<<< Updated upstream
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
=======
import React, { useState, useEffect, useRef } from "react";
import api from "../api/api";
import { 
  FiBook, 
  FiUpload, 
  FiSearch, 
  FiEye, 
  FiTrash2, 
  FiX, 
  FiCheck, 
  FiAlertCircle,
  FiFile,
  FiDownload,
  FiPlus,
  FiFolder,
  FiLayers,
  FiUsers,
  FiBookOpen
} from "react-icons/fi";
import { 
  MdOutlineLibraryBooks, 
  MdOutlineCategory, 
  MdOutlineSchool,
  MdCloudUpload,
  MdDescription,
  MdTitle,
  MdVisibility,
  MdPublic,
  MdLock,
  MdDeleteForever
} from "react-icons/md";
import { 
  FaFilePdf, 
  FaFileWord, 
  FaVideo, 
  FaImage, 
  FaBookReader,
  FaChalkboardTeacher
} from "react-icons/fa";
import { IoDocumentText, IoCloudUploadOutline } from "react-icons/io5";
import { TbFileDescription } from "react-icons/tb";
import { HiOutlineDocumentDownload } from "react-icons/hi";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const SUBJECT_COLORS = {
  Biology: { bg: "#1a3a2a", color: "#2ea043" },
  Mathematics: { bg: "#1a2a3a", color: "#58a6ff" },
  English: { bg: "#3a2a1a", color: "#e3a525" },
  Physics: { bg: "#2a1a3a", color: "#a371f7" },
  Chemistry: { bg: "#3a1a1a", color: "#f85149" },
  History: { bg: "#2a3a1a", color: "#56d364" },
  Other: { bg: "#21262d", color: "#8b949e" },
};

<<<<<<< Updated upstream
=======
const RESOURCE_TYPE_MAP = [
  { label: "PDF Document",  type: "PDF",   form: "DOCUMENT", icon: <FaFilePdf /> },
  { label: "Word Document", type: "PDF",   form: "DOCUMENT", icon: <FaFileWord /> },
  { label: "Past Paper",    type: "PDF",   form: "OTHER",    icon: <IoDocumentText /> },
  { label: "Video",         type: "VIDEO", form: "VIDEO",    icon: <FaVideo /> },
  { label: "Image",         type: "IMAGE", form: "OTHER",    icon: <FaImage /> },
];

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  const handleDelete = () => {
    setBooks((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("Book removed successfully.");
=======
  const handleRequestDelete = async () => {
    try {
      await api.post("/request", {
        requestName: `Delete Resource: ${deleteTarget.title}`,
        fromUser:    "Teacher",
        type:        "DELETE_RESOURCE",
        description: JSON.stringify({
          resourceId: deleteTarget.id,
          filePath:   deleteTarget.fileUrl,
          bucket:     "online-library",
        }),
      });

      showToast("Delete request sent to admin.");
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message ?? err.message, "error");
    }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <div
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all"
=======
          <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg flex items-center gap-2"
>>>>>>> Stashed changes
=======
          <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg flex items-center gap-2"
>>>>>>> Stashed changes
            style={{
              backgroundColor: toast.type === "error" ? "#3d1a1a" : "#1a3a2a",
              color: toast.type === "error" ? "#f85149" : "#2ea043",
              border: `1px solid ${toast.type === "error" ? "#f85149" : "#2ea043"}`,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            }}
          >
            {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
=======
            }}>
            {toast.type === "error" ? <FiAlertCircle /> : <FiCheck />} {toast.msg}
>>>>>>> Stashed changes
=======
            }}>
            {toast.type === "error" ? <FiAlertCircle /> : <FiCheck />} {toast.msg}
>>>>>>> Stashed changes
          </div>
        )}

        {/* HEADER */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] text-white p-8 rounded-lg mb-6 flex items-center justify-between">
          <div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
            <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <MdOutlineLibraryBooks /> Resources Library
            </h1>
            <p className="opacity-80 text-sm">Manage and upload books, textbooks, and study materials.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="bg-[#2ea043] text-white font-semibold px-5 py-2 rounded-md hover:bg-[#3fb950] transition text-sm flex items-center gap-2">
            <FiPlus /> Add New Resource
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          </button>
        </section>

        {/* STATS ROW */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
            { number: books.length, label: "Total Resources", icon: <MdOutlineLibraryBooks /> },
            { number: [...new Set(books.map((b) => b.category?.name).filter(Boolean))].length, label: "Subjects Covered", icon: <MdOutlineCategory /> },
            { number: books.reduce((s, b) => s + (b.downloadCount ?? 0), 0), label: "Total Downloads", icon: <HiOutlineDocumentDownload /> },
            { number: [...new Set(books.map((b) => b.targetClass?.name).filter(Boolean))].length, label: "Form Levels", icon: <MdOutlineSchool /> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition">
              <div className="text-2xl font-bold text-[#2ea043] flex items-center gap-2">
                {stat.icon} {stat.number}
              </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              <div className="text-sm text-[#6e7681]">{stat.label}</div>
            </div>
          ))}
        </section>

        {/* FILTERS & SEARCH */}
        <section className="flex flex-wrap gap-3 mb-6 items-center">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
          <div className="relative flex-1 min-w-[200px]">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6e7681]" size={16} />
            <input type="text" placeholder="Search resources..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681]" />
          </div>
          <select value={filterForm} onChange={(e) => setFilterForm(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]">
>>>>>>> Stashed changes
            {FORMS.map((f) => <option key={f}>{f}</option>)}
          </select>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-[#161b22] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]"
          >
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <span className="text-[#6e7681] text-sm ml-auto">
            {filtered.length} book{filtered.length !== 1 ? "s" : ""} found
=======
          <span className="text-[#6e7681] text-sm ml-auto flex items-center gap-1">
            <FiBook size={14} /> {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
>>>>>>> Stashed changes
=======
          <span className="text-[#6e7681] text-sm ml-auto flex items-center gap-1">
            <FiBook size={14} /> {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
>>>>>>> Stashed changes
          </span>
        </section>

        {/* BOOK GRID */}
        {filtered.length === 0 ? (
          <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-16 text-center text-[#6e7681]">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">No books match your filters.</p>
=======
=======
>>>>>>> Stashed changes
            <div className="text-4xl mb-3 flex justify-center">
              <MdOutlineLibraryBooks size={48} className="text-[#6e7681]" />
            </div>
            <p className="text-sm">No resources match your filters.</p>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
                      <span className="text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1"
                        style={{ backgroundColor: subjectStyle.bg, color: subjectStyle.color }}>
                        <MdOutlineCategory size={12} /> {book.category?.name ?? "Other"}
                      </span>
                      <span className="text-xs text-[#6e7681] flex items-center gap-1">
                        <MdOutlineSchool size={12} /> {book.targetClass?.name ?? "—"}
                      </span>
                    </div>
=======
                      <span className="text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1"
                        style={{ backgroundColor: subjectStyle.bg, color: subjectStyle.color }}>
                        <MdOutlineCategory size={12} /> {book.category?.name ?? "Other"}
                      </span>
                      <span className="text-xs text-[#6e7681] flex items-center gap-1">
                        <MdOutlineSchool size={12} /> {book.targetClass?.name ?? "—"}
                      </span>
                    </div>
>>>>>>> Stashed changes
                    <h3 className="font-semibold text-[#e6edf3] mb-1 leading-snug flex items-start gap-2">
                      <FiBook className="mt-0.5 flex-shrink-0" size={14} />
                      {book.title}
                    </h3>
                    {book.description && (
                      <p className="text-xs text-[#6e7681] mb-3 line-clamp-2 flex items-start gap-1">
                        <TbFileDescription className="mt-0.5 flex-shrink-0" size={12} />
                        {book.description}
                      </p>
                    )}
                    <div className="flex gap-3 text-xs text-[#6e7681] mb-4 flex-wrap">
                      <span className="flex items-center gap-1">
                        {book.type === "PDF" ? <FaFilePdf size={12} /> : 
                         book.type === "VIDEO" ? <FaVideo size={12} /> : 
                         book.type === "IMAGE" ? <FaImage size={12} /> : <FiFile size={12} />}
                        {book.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlineDocumentDownload size={12} /> {book.downloadCount ?? 0}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${book.status === "PUBLISHED" ? "bg-[#2ea04320] text-[#2ea043]" : "bg-[#6e768120] text-[#8b949e]"}`}>
                        <FiCheck size={10} /> {book.status}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded flex items-center gap-1 ${book.visibility === "PUBLIC" ? "bg-[#388bfd20] text-[#388bfd]" : "bg-[#f0883e20] text-[#f0883e]"}`}>
                        {book.visibility === "PUBLIC" ? <MdPublic size={10} /> : <MdLock size={10} />}
                        {book.visibility}
                      </span>
>>>>>>> Stashed changes
                    </div>

                    <p className="text-xs text-[#6e7681] mb-4">Uploaded {book.uploadedAt}</p>

                    {/* Actions */}
                    <div className="flex gap-2">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                      <button className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs font-semibold py-1.5 rounded hover:border-[#2ea043] transition">
                        👁 View
=======
                      <button onClick={() => book.fileUrl && window.open(book.fileUrl, "_blank")}
                        className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs font-semibold py-1.5 rounded hover:border-[#2ea043] transition flex items-center justify-center gap-1">
                        <FiEye size={12} /> View
>>>>>>> Stashed changes
                      </button>
                      <button
                        onClick={() => setDeleteTarget(book)}
                        className="flex-1 bg-[#3d1a1a] border border-[#f85149] text-[#f85149] text-xs font-semibold py-1.5 rounded hover:bg-[#5a1e1e] transition"
                      >
                        🗑 Remove
=======
                      <button onClick={() => book.fileUrl && window.open(book.fileUrl, "_blank")}
                        className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] text-xs font-semibold py-1.5 rounded hover:border-[#2ea043] transition flex items-center justify-center gap-1">
                        <FiEye size={12} /> View
                      </button>
                      <button onClick={() => setDeleteTarget(book)}
                        className="flex-1 bg-[#3d1a1a] border border-[#f85149] text-[#f85149] text-xs font-semibold py-1.5 rounded hover:bg-[#5a1e1e] transition flex items-center justify-center gap-1">
                        <FiTrash2 size={12} /> Request Removal
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <h2 className="text-lg font-bold text-[#e6edf3]">📤 Upload New Book</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6e7681] hover:text-[#e6edf3] text-xl transition"
              >
                ✕
=======
=======
>>>>>>> Stashed changes
              <h2 className="text-lg font-bold text-[#e6edf3] flex items-center gap-2">
                <FiUpload /> Upload New Resource
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[#6e7681] hover:text-[#e6edf3] text-xl transition">
                <FiX />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
                  <div className="text-3xl mb-2 flex justify-center">
                    <FiFile size={36} className="text-[#2ea043]" />
                  </div>
                  <p className="text-sm text-[#2ea043] font-semibold">{form.file.name}</p>
                  <p className="text-xs text-[#6e7681] mt-1">
                    {(form.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="text-sm text-[#8b949e]">Drag & drop a PDF here, or click to browse</p>
                  <p className="text-xs text-[#6e7681] mt-1">PDF files only</p>
=======
=======
>>>>>>> Stashed changes
                  <div className="text-3xl mb-2 flex justify-center">
                    <IoCloudUploadOutline size={36} className="text-[#8b949e]" />
                  </div>
                  <p className="text-sm text-[#8b949e]">Drag & drop a file here, or click to browse</p>
                  <p className="text-xs text-[#6e7681] mt-1">PDF, DOCX, MP4, Images</p>
>>>>>>> Stashed changes
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="space-y-3 mb-5">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
              <div className="relative">
                <MdTitle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6e7681]" size={16} />
                <input type="text" placeholder="Resource Title *" value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681]" />
              </div>

              <div className="relative">
                <MdDescription className="absolute left-3 top-3 text-[#6e7681]" size={16} />
                <textarea placeholder="Description" value={form.description} rows={2}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2ea043] placeholder-[#6e7681] resize-none" />
              </div>

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======

              <div className="grid grid-cols-2 gap-3">
                <select value={form.selectedTypeLabel}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]">
                  {RESOURCE_TYPE_MAP.map((t) => (
                    <option key={t.label} value={t.label}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
                <select value={form.targetAudience}
                  onChange={(e) => setForm((f) => ({ ...f, targetAudience: e.target.value }))}
                  className="bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]">
                  <option><FiUsers className="inline" /> Students</option>
                  <option><FaChalkboardTeacher className="inline" /> Teachers</option>
                  <option><FaBookReader className="inline" /> Both</option>
                </select>
              </div>

              <select value={form.visibility}
                onChange={(e) => setForm((f) => ({ ...f, visibility: e.target.value }))}
                className="w-full bg-[#0d1117] border border-[#21262d] text-[#e6edf3] rounded-md px-4 py-2 text-sm focus:outline-none focus:border-[#2ea043]">
                <option value="PUBLIC"><MdPublic className="inline" /> Public</option>
                <option value="PRIVATE"><MdLock className="inline" /> Private (School Only)</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold py-2 rounded-md hover:border-[#6e7681] transition text-sm flex items-center justify-center gap-1">
                <FiX size={14} /> Cancel
              </button>
              <button onClick={handleSubmit} disabled={uploading}
                className="flex-1 bg-[#2ea043] text-white font-semibold py-2 rounded-md hover:bg-[#3fb950] transition text-sm disabled:opacity-50 flex items-center justify-center gap-1">
                {uploading ? <><FiUpload className="animate-pulse" /> Uploading...</> : <><FiUpload /> Upload Resource</>}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40 p-4">
          <div className="bg-[#161b22] border border-[#f85149] rounded-xl w-full max-w-sm p-6 shadow-2xl">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h2 className="text-lg font-bold text-[#e6edf3] text-center mb-2">Remove Book?</h2>
=======
=======
>>>>>>> Stashed changes
            <div className="text-3xl mb-3 text-center flex justify-center">
              <MdDeleteForever size={40} className="text-[#f85149]" />
            </div>
            <h2 className="text-lg font-bold text-[#e6edf3] text-center mb-2">Request Resource Deletion?</h2>
>>>>>>> Stashed changes
            <p className="text-sm text-[#8b949e] text-center mb-6">
              Are you sure you want to remove{" "}
              <span className="text-[#e6edf3] font-semibold">"{deleteTarget.title}"</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold py-2 rounded-md hover:border-[#6e7681] transition text-sm"
              >
                Cancel
=======
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold py-2 rounded-md hover:border-[#6e7681] transition text-sm flex items-center justify-center gap-1">
                <FiX size={14} /> Cancel
>>>>>>> Stashed changes
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-[#f85149] text-white font-semibold py-2 rounded-md hover:bg-[#da3633] transition text-sm"
              >
                Yes, Remove
=======
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-[#21262d] border border-[#30363d] text-[#e6edf3] font-semibold py-2 rounded-md hover:border-[#6e7681] transition text-sm flex items-center justify-center gap-1">
                <FiX size={14} /> Cancel
              </button>
              <button onClick={handleRequestDelete}
                className="flex-1 bg-[#f85149] text-white font-semibold py-2 rounded-md hover:bg-[#da3633] transition text-sm flex items-center justify-center gap-1">
                <FiTrash2 size={14} /> Send Request
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}