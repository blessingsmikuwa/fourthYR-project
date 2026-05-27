<<<<<<< Updated upstream
import React, { useState } from "react";
=======
import { useState, useEffect } from "react";
import { 
  FiBook, 
  FiUsers, 
  FiCheck, 
  FiAlertCircle, 
  FiX,
  FiPlus,
  FiFolder,
  FiGrid
} from "react-icons/fi";
import { 
  MdOutlineLibraryBooks, 
  MdOutlineSchool,
  MdOutlineClass,
  MdAssignment,
  MdOutlineAssignment
} from "react-icons/md";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";
import { BiBookOpen } from "react-icons/bi";
import { FiArrowLeft } from "react-icons/fi";
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

const INITIAL_CLASSES = [
  {
    id: 1,
    name: "Form 3A",
    subject: "Biology",
    students: 42,
    time: "Mon & Wed • 8:00 AM",
    room: "Lab 2",
    resources: [
      { id: 1, title: "Cell Structure and Function", type: "Lesson Plan" },
      { id: 2, title: "Photosynthesis Practice", type: "Worksheet" },
    ],
  },
  {
    id: 2,
    name: "Form 3B",
    subject: "Biology",
    students: 38,
    time: "Tue & Thu • 10:00 AM",
    room: "Room 5",
    resources: [
      { id: 1, title: "Cell Structure and Function", type: "Lesson Plan" },
    ],
  },
  {
    id: 3,
    name: "Form 2A",
    subject: "Biology",
    students: 45,
    time: "Mon & Fri • 1:00 PM",
    room: "Room 3",
    resources: [],
  },
  {
    id: 4,
    name: "Form 4B",
    subject: "Biology",
    students: 35,
    time: "Wed & Fri • 11:00 AM",
    room: "Lab 1",
    resources: [
      { id: 3, title: "Human Digestive System", type: "Presentation" },
    ],
  },
];

const ALL_RESOURCES = [
  { id: 1, title: "Cell Structure and Function", type: "Lesson Plan" },
  { id: 2, title: "Photosynthesis Practice", type: "Worksheet" },
  { id: 3, title: "Human Digestive System", type: "Presentation" },
  { id: 4, title: "Biology Form 3 Textbook", type: "Book" },
  { id: 5, title: "Cell Biology Quiz", type: "Quiz" },
  { id: 6, title: "Photosynthesis Quiz", type: "Quiz" },
];

const TYPE_STYLE = {
  "Lesson Plan":  { bg: "#3d2f0a", color: "#e3a525" },
  "Worksheet":    { bg: "#1a3a2a", color: "#2ea043" },
  "Presentation": { bg: "#2a1a3a", color: "#a371f7" },
  "Book":         { bg: "#1a2a3a", color: "#58a6ff" },
  "Quiz":         { bg: "#3a1a1a", color: "#f85149" },
};

const getTypeStyle = (type) => TYPE_STYLE[type] || { bg: "#21262d", color: "#8b949e" };

export default function MyClasses() {
  const [classes, setClasses]       = useState(INITIAL_CLASSES);
  const [selected, setSelected]     = useState(null); // class being viewed
  const [showAssign, setShowAssign] = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const assignResource = (resource) => {
    const alreadyAssigned = selected.resources.some((r) => r.id === resource.id);
    if (alreadyAssigned) {
      showToast("This resource is already assigned to this class.", "error");
      return;
    }
    const updated = classes.map((c) =>
      c.id === selected.id
        ? { ...c, resources: [...c.resources, resource] }
        : c
    );
    setClasses(updated);
    setSelected(updated.find((c) => c.id === selected.id));
    showToast(`"${resource.title}" assigned to ${selected.name}.`);
    setShowAssign(false);
  };

  const removeResource = (resourceId) => {
    const updated = classes.map((c) =>
      c.id === selected.id
        ? { ...c, resources: c.resources.filter((r) => r.id !== resourceId) }
        : c
    );
    setClasses(updated);
    setSelected(updated.find((c) => c.id === selected.id));
    showToast("Resource removed from class.");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">

      {/* Toast */}
      {toast && (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg"
          style={{
            backgroundColor: toast.type === "error" ? "#3d1a1a" : "#1a3a2a",
            color: toast.type === "error" ? "#f85149" : "#2ea043",
            border: `1px solid ${toast.type === "error" ? "#f85149" : "#2ea043"}`,
          }}
        >
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
=======
=======
>>>>>>> Stashed changes
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg flex items-center gap-2"
          style={{
            backgroundColor: toast.type === "error" ? "#3d1a1a" : "#1a3a2a",
            color:           toast.type === "error" ? "#f85149" : "#2ea043",
            border:          `1px solid ${toast.type === "error" ? "#f85149" : "#2ea043"}`,
          }}>
          {toast.type === "error" ? <IoWarningOutline /> : <FiCheck />} {toast.msg}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4">

        {/* HEADER */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] p-8 rounded-lg mb-6">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          <h1 className="text-2xl font-bold mb-1">🏫 My Classes</h1>
          <p className="opacity-80 text-sm">
            View your classes and manage the resources assigned to each one.
          </p>
=======
=======
>>>>>>> Stashed changes
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <MdOutlineSchool /> My Classes
          </h1>
          <p className="opacity-80 text-sm">View your classes and manage assigned resources.</p>
>>>>>>> Stashed changes
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            { number: classes.length, label: "Total Classes" },
            { number: classes.reduce((s, c) => s + c.students, 0), label: "Total Students" },
            { number: classes.filter((c) => c.resources.length > 0).length, label: "Classes with Resources" },
            { number: classes.filter((c) => c.resources.length === 0).length, label: "Awaiting Resources" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition"
            >
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
=======
=======
>>>>>>> Stashed changes
            { number: classes.length, label: "Total Classes", icon: <MdOutlineClass /> },
            { number: classes.reduce((s, c) => s + (c.students ?? 0), 0), label: "Total Students", icon: <FaUserGraduate /> },
            { number: allResources.length, label: "Available Resources", icon: <MdOutlineLibraryBooks /> },
            { number: classes.length, label: "Active Classes", icon: <FiGrid /> },
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

        <div className="grid md:grid-cols-2 gap-6">

          {/* CLASS LIST */}
          <div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            <h2 className="text-base font-bold text-[#e6edf3] mb-3">📋 Classes</h2>
            <div className="space-y-3">
              {classes.map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => { setSelected(cls); setShowAssign(false); }}
                  className="w-full text-left bg-[#161b22] border rounded-lg p-4 transition hover:-translate-y-0.5"
                  style={{
                    borderColor: selected?.id === cls.id ? "#2ea043" : "#21262d",
                    backgroundColor: selected?.id === cls.id ? "#1a3a2a" : "#161b22",
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#e6edf3]">{cls.name}</span>
                    {cls.resources.length === 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#3d1a1a] text-[#f85149]">
                        No resources
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-[#1a3a2a] text-[#2ea043]">
                        {cls.resources.length} resource{cls.resources.length !== 1 ? "s" : ""}
                      </span>
=======
=======
>>>>>>> Stashed changes
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <MdOutlineClass /> Classes
            </h2>
            {classes.length === 0 ? (
              <div className="text-center py-12 text-[#6e7681] text-sm">
                <BiBookOpen className="mx-auto mb-2" size={36} />
                No classes found.
              </div>
            ) : (
              <div className="space-y-3">
                {classes.map((cls) => (
                  <button key={cls.id} onClick={() => { setSelected(cls); setShowAssign(false); }}
                    className="w-full text-left bg-[#161b22] border rounded-lg p-4 transition hover:-translate-y-0.5"
                    style={{
                      borderColor: selected?.id === cls.id ? "#2ea043" : "#21262d",
                      backgroundColor: selected?.id === cls.id ? "#1a3a2a" : "#161b22",
                    }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold flex items-center gap-2">
                        <MdOutlineClass size={16} /> {cls.name}
                      </span>
                    </div>
                    {cls.school?.name && (
                      <div className="text-xs text-[#6e7681] flex items-center gap-1">
                        <MdOutlineSchool size={12} /> {cls.school.name}
                      </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                    )}
                  </div>
                  <div className="text-xs text-[#6e7681] flex gap-3 flex-wrap">
                    <span>📚 {cls.subject}</span>
                    <span>👥 {cls.students} students</span>
                    <span>📍 {cls.room}</span>
                  </div>
                  <div className="text-xs text-[#6e7681] mt-1">🕐 {cls.time}</div>
                </button>
              ))}
            </div>
          </div>

          {/* RESOURCE PANEL */}
          <div>
            {!selected ? (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-12 text-center text-[#6e7681] h-full flex flex-col items-center justify-center">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                <div className="text-4xl mb-3">👈</div>
                <p className="text-sm">Select a class to view and manage its resources.</p>
=======
=======
>>>>>>> Stashed changes
                <div className="text-4xl mb-3">
                  <FiArrowLeft className="mx-auto" size={36} />
                </div>
                <p className="text-sm">Select a class to manage its resources.</p>
>>>>>>> Stashed changes
              </div>
            ) : (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden">

                {/* Panel header */}
                <div className="bg-[#1a3a2a] border-b border-[#21262d] px-5 py-4 flex items-center justify-between">
                  <div>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                    <h3 className="font-bold text-[#e6edf3]">{selected.name}</h3>
                    <p className="text-xs text-[#6e7681]">{selected.subject} · {selected.students} students</p>
                  </div>
                  <button
                    onClick={() => setShowAssign((v) => !v)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#2ea043] text-white hover:bg-[#3fb950] transition"
                  >
                    + Assign Resource
=======
=======
>>>>>>> Stashed changes
                    <h3 className="font-bold flex items-center gap-2">
                      <MdOutlineClass /> {selected.name}
                    </h3>
                    {selected.school?.name && (
                      <p className="text-xs text-[#6e7681] flex items-center gap-1 mt-1">
                        <MdOutlineSchool size={12} /> {selected.school.name}
                      </p>
                    )}
                  </div>
                  <button onClick={() => setShowAssign((v) => !v)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#2ea043] text-white hover:bg-[#3fb950] transition flex items-center gap-1">
                    <FiPlus size={12} /> Assign Resource
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                  </button>
                </div>

                {/* Assign picker */}
                {showAssign && (
                  <div className="border-b border-[#21262d] bg-[#0d1117] px-5 py-4">
                    <p className="text-xs text-[#6e7681] mb-3">Choose a resource to assign:</p>
<<<<<<< Updated upstream
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {ALL_RESOURCES.map((res) => {
                        const style = getTypeStyle(res.type);
                        const assigned = selected.resources.some((r) => r.id === res.id);
                        return (
                          <button
                            key={res.id}
                            onClick={() => assignResource(res)}
                            disabled={assigned}
                            className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md border transition"
                            style={{
                              borderColor: assigned ? "#21262d" : "#30363d",
                              backgroundColor: assigned ? "#0d1117" : "#161b22",
                              opacity: assigned ? 0.5 : 1,
                              cursor: assigned ? "not-allowed" : "pointer",
                            }}
                          >
                            <span className="text-sm text-[#e6edf3]">{res.title}</span>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0"
                              style={{ backgroundColor: style.bg, color: style.color }}
                            >
                              {assigned ? "✓ Added" : res.type}
                            </span>
                          </button>
                        );
                      })}
                    </div>
=======
                    {allResources.length === 0 ? (
                      <p className="text-xs text-[#6e7681]">No resources available.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {allResources.map((res) => {
                          const style    = getTypeStyle(res.type);
                          const assigned = classResources.some((r) => r.id === res.id);
                          return (
                            <button key={res.id} onClick={() => assignResource(res)} disabled={assigned}
                              className="w-full text-left flex items-center justify-between px-3 py-2 rounded-md border transition"
                              style={{
                                borderColor:     assigned ? "#21262d" : "#30363d",
                                backgroundColor: assigned ? "#0d1117" : "#161b22",
                                opacity:         assigned ? 0.5 : 1,
                                cursor:          assigned ? "not-allowed" : "pointer",
                              }}>
                              <span className="text-sm text-[#e6edf3] truncate flex items-center gap-2">
                                <FiBook size={12} /> {res.title}
                              </span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0"
                                style={{ backgroundColor: style.bg, color: style.color }}>
                                {assigned ? <><FiCheck size={10} /> Added</> : res.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
>>>>>>> Stashed changes
                  </div>
                )}

                {/* Assigned resources */}
                <div className="p-5">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                  <p className="text-xs text-[#6e7681] mb-3">
                    Assigned Resources ({selected.resources.length})
=======
                  <p className="text-xs text-[#6e7681] mb-3 flex items-center gap-1">
                    <MdAssignment size={12} /> Assigned Resources ({classResources.length})
>>>>>>> Stashed changes
=======
                  <p className="text-xs text-[#6e7681] mb-3 flex items-center gap-1">
                    <MdAssignment size={12} /> Assigned Resources ({classResources.length})
>>>>>>> Stashed changes
                  </p>

                  {selected.resources.length === 0 ? (
                    <div className="text-center py-8 text-[#6e7681]">
                      <div className="text-3xl mb-2 flex justify-center">
                        <MdOutlineLibraryBooks size={36} className="text-[#6e7681]" />
                      </div>
                      <p className="text-xs">No resources assigned yet.</p>
                      <p className="text-xs mt-1">Click "+ Assign Resource" above to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selected.resources.map((res) => {
                        const style = getTypeStyle(res.type);
                        return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                          <div
                            key={res.id}
                            className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded-md px-4 py-3 hover:border-[#2ea043] transition"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                                style={{ backgroundColor: style.bg, color: style.color }}
                              >
                                {res.type}
                              </span>
                              <span className="text-sm text-[#e6edf3]">{res.title}</span>
                            </div>
                            <button
                              onClick={() => removeResource(res.id)}
                              className="text-xs text-[#f85149] hover:text-[#da3633] transition ml-3 flex-shrink-0"
                            >
                              ✕
=======
=======
>>>>>>> Stashed changes
                          <div key={res.id}
                            className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded-md px-4 py-3 hover:border-[#2ea043] transition group">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                                style={{ backgroundColor: style.bg, color: style.color }}>
                                {res.type}
                              </span>
                              <span className="text-sm truncate flex items-center gap-2">
                                <FiBook size={12} className="flex-shrink-0" /> {res.title}
                              </span>
                            </div>
                            <button onClick={() => removeResource(res.id)}
                              className="text-xs text-[#f85149] hover:text-[#da3633] ml-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
                              <FiX size={14} />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


