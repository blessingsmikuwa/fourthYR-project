import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const TYPE_STYLE = {
  "Lesson Plan":  { bg: "#3d2f0a", color: "#e3a525" },
  "Worksheet":    { bg: "#1a3a2a", color: "#2ea043" },
  "Presentation": { bg: "#2a1a3a", color: "#a371f7" },
  "Book":         { bg: "#1a2a3a", color: "#58a6ff" },
  "Quiz":         { bg: "#3a1a1a", color: "#f85149" },
  "PDF":          { bg: "#1a2a3a", color: "#58a6ff" },
  "VIDEO":        { bg: "#3a1a2a", color: "#f0883e" },
};
const getTypeStyle = (type) => TYPE_STYLE[type] ?? { bg: "#21262d", color: "#8b949e" };

export default function MyClasses() {
  const [classes, setClasses]       = useState([]);
  const [allResources, setAll]      = useState([]);
  const [selected, setSelected]     = useState(null);
  const [classResources, setClassRes] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [toast, setToast]           = useState(null);

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load classes and all resources on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [clsRes, resRes] = await Promise.all([
          fetch(`${API_BASE}/classes`, { headers }),
          fetch(`${API_BASE}/resources`, { headers }),
        ]);
        if (clsRes.ok)  setClasses(await clsRes.json());
        if (resRes.ok) {
          const data = await resRes.json();
          const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
          setAll(arr);
        }
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  // Load resources for selected class
  useEffect(() => {
    if (!selected) return;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/classes/${selected.id}/resources`, { headers });
        if (res.ok) {
          const data = await res.json();
          setClassRes(data.map((cr) => cr.resource));
        }
      } catch {}
    };
    load();
  }, [selected]);

  const assignResource = async (resource) => {
    try {
      const res = await fetch(
        `${API_BASE}/classes/${selected.id}/resources/${resource.id}`,
        { method: "POST", headers }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "Failed to assign resource");
      }
      setClassRes((prev) => [...prev, resource]);
      showToast(`"${resource.title}" assigned to ${selected.name}.`);
      setShowAssign(false);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const removeResource = async (resourceId) => {
    try {
      const res = await fetch(
        `${API_BASE}/classes/${selected.id}/resources/${resourceId}`,
        { method: "DELETE", headers }
      );
      if (!res.ok) throw new Error("Failed to remove resource");
      setClassRes((prev) => prev.filter((r) => r.id !== resourceId));
      showToast("Resource removed from class.");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#8b949e]">
        Loading classes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-semibold shadow-lg"
          style={{
            backgroundColor: toast.type === "error" ? "#3d1a1a" : "#1a3a2a",
            color:           toast.type === "error" ? "#f85149" : "#2ea043",
            border:          `1px solid ${toast.type === "error" ? "#f85149" : "#2ea043"}`,
          }}>
          {toast.type === "error" ? "⚠️" : "✅"} {toast.msg}
        </div>
      )}

      <main className="max-w-5xl mx-auto p-4">

        {/* Header */}
        <section className="bg-[#1a3a2a] border border-[#2ea043] p-8 rounded-lg mb-6">
          <h1 className="text-2xl font-bold mb-1">🏫 My Classes</h1>
          <p className="opacity-80 text-sm">View your classes and manage assigned resources.</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { number: classes.length,                                    label: "Total Classes" },
            { number: classes.reduce((s, c) => s + (c.students ?? 0), 0), label: "Total Students" },
            { number: allResources.length,                               label: "Available Resources" },
            { number: classes.length,                                    label: "Active Classes" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#161b22] border border-[#21262d] p-5 rounded-lg hover:border-[#2ea043] hover:-translate-y-1 transition">
              <div className="text-2xl font-bold text-[#2ea043]">{stat.number}</div>
              <div className="text-sm text-[#6e7681]">{stat.label}</div>
            </div>
          ))}
        </section>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Class list */}
          <div>
            <h2 className="text-base font-bold mb-3">📋 Classes</h2>
            {classes.length === 0 ? (
              <div className="text-center py-12 text-[#6e7681] text-sm">No classes found.</div>
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
                      <span className="font-semibold">{cls.name}</span>
                    </div>
                    {cls.school?.name && (
                      <div className="text-xs text-[#6e7681]">🏫 {cls.school.name}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Resource panel */}
          <div>
            {!selected ? (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-12 text-center text-[#6e7681] h-full flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">👈</div>
                <p className="text-sm">Select a class to manage its resources.</p>
              </div>
            ) : (
              <div className="bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden">

                {/* Panel header */}
                <div className="bg-[#1a3a2a] border-b border-[#21262d] px-5 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">{selected.name}</h3>
                    {selected.school?.name && (
                      <p className="text-xs text-[#6e7681]">{selected.school.name}</p>
                    )}
                  </div>
                  <button onClick={() => setShowAssign((v) => !v)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-md bg-[#2ea043] text-white hover:bg-[#3fb950] transition">
                    + Assign Resource
                  </button>
                </div>

                {/* Assign picker */}
                {showAssign && (
                  <div className="border-b border-[#21262d] bg-[#0d1117] px-5 py-4">
                    <p className="text-xs text-[#6e7681] mb-3">Choose a resource to assign:</p>
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
                              <span className="text-sm text-[#e6edf3] truncate">{res.title}</span>
                              <span className="text-xs font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0"
                                style={{ backgroundColor: style.bg, color: style.color }}>
                                {assigned ? "✓ Added" : res.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Assigned resources */}
                <div className="p-5">
                  <p className="text-xs text-[#6e7681] mb-3">
                    Assigned Resources ({classResources.length})
                  </p>
                  {classResources.length === 0 ? (
                    <div className="text-center py-8 text-[#6e7681]">
                      <div className="text-3xl mb-2">📭</div>
                      <p className="text-xs">No resources assigned yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {classResources.map((res) => {
                        const style = getTypeStyle(res.type);
                        return (
                          <div key={res.id}
                            className="flex items-center justify-between bg-[#0d1117] border border-[#21262d] rounded-md px-4 py-3 hover:border-[#2ea043] transition">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0"
                                style={{ backgroundColor: style.bg, color: style.color }}>
                                {res.type}
                              </span>
                              <span className="text-sm truncate">{res.title}</span>
                            </div>
                            <button onClick={() => removeResource(res.id)}
                              className="text-xs text-[#f85149] hover:text-[#da3633] ml-3 flex-shrink-0">✕</button>
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