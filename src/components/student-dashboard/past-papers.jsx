import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const COLORS = [
  "from-blue-600 to-blue-900",   "from-green-600 to-green-900",
  "from-purple-600 to-purple-900", "from-orange-500 to-orange-800",
  "from-yellow-400 to-yellow-700", "from-teal-500 to-teal-800",
  "from-red-600 to-red-900",     "from-indigo-600 to-indigo-900",
  "from-cyan-500 to-cyan-800",   "from-lime-600 to-lime-900",
  "from-amber-500 to-amber-800", "from-rose-500 to-rose-800",
]

const PastPapers = () => {
  const [papers, setPapers]             = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [searchTerm, setSearchTerm]     = useState('')
  const [selectedLevel, setSelectedLevel]   = useState('All Levels')
  const [selectedSubject, setSelectedSubject] = useState('All Subjects')
  const [currentPage, setCurrentPage]   = useState(1)
  const itemsPerPage = 12

  const token = localStorage.getItem("accessToken")
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/resources`, { headers })
        if (!res.ok) throw new Error(`Failed to fetch resources: ${res.status}`)
        const data = await res.json()
        const all = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        // Past papers are resources uploaded with form === 'OTHER' (e.g. Past Paper type in upload form)
        const filtered = all.filter((r) => r.form === 'OTHER')
        setPapers(filtered)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPapers()
  }, [])

  const logActivity = async (action, title, metadata = {}) => {
    try {
      await fetch(`${API_BASE}/activity`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, resourceTitle: title, metadata }),
      })
    } catch {}
  }

  const handleDownload = async (paper) => {
    try {
      await fetch(`${API_BASE}/resources/${paper.id}/download`, {
        method: 'POST', headers,
      })
    } catch {}
    await logActivity('DOWNLOAD', paper.title)
    if (paper.fileUrl) window.open(paper.fileUrl, '_blank')
  }

  const handlePreview = async (paper) => {
    await logActivity('RESOURCE_VIEWED', paper.title)
    if (paper.fileUrl) window.open(paper.fileUrl, '_blank')
  }

  const subjects = ['All Subjects', ...new Set(papers.map((p) => p.category?.name).filter(Boolean))]

  const filtered = papers.filter((paper) => {
    const matchesSearch  = paper.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           paper.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel   = selectedLevel === 'All Levels' || paper.targetClass?.name === selectedLevel
    const matchesSubject = selectedSubject === 'All Subjects' || paper.category?.name === selectedSubject
    return matchesSearch && matchesLevel && matchesSubject
  })

  const totalItems   = filtered.length
  const totalPages   = Math.ceil(totalItems / itemsPerPage)
  const startIndex   = (currentPage - 1) * itemsPerPage
  const currentPapers = filtered.slice(startIndex, startIndex + itemsPerPage)

  useEffect(() => { setCurrentPage(1) }, [searchTerm, selectedLevel, selectedSubject])

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <div className="max-w-6xl mx-auto p-4">

        {/* Search & Filters */}
        <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mt-6">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input type="text" placeholder="Search past papers..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] rounded-lg px-4 py-2 focus:border-[#2ea043] outline-none" />
            <button className="bg-[#2ea043] text-white px-6 py-2 rounded-lg hover:bg-[#238636]">
              🔍 Search
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md">
              <option>All Levels</option>
              <option>Form 1</option><option>Form 2</option>
              <option>Form 3</option><option>Form 4</option>
            </select>
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md">
              {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold">
            Showing {Math.min(startIndex + 1, totalItems)}–{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} past papers
          </h2>
        </div>

        {loading && <div className="text-center py-8 text-[#e6edf3]">Loading past papers...</div>}
        {error && <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mt-4">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4 mt-4">
            {currentPapers.length === 0 ? (
              <div className="text-center py-12 text-[#6e7681]">No past papers found.</div>
            ) : currentPapers.map((paper, index) => (
              <div key={paper.id ?? index}
                className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 hover:border-[#2ea043] transition">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`w-20 h-24 bg-gradient-to-br ${COLORS[index % COLORS.length]} flex items-center justify-center rounded relative flex-shrink-0`}>
                    <span className="text-2xl opacity-30">📄</span>
                    <span className="absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded font-semibold bg-[#2ea043] text-white">📥</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#e6edf3] text-lg">{paper.title}</h3>
                    {paper.uploader && (
                      <p className="text-sm text-[#6e7681] mb-1">
                        Uploaded by {paper.uploader.firstName} {paper.uploader.lastName} · {formatDate(paper.createdAt)}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      {paper.category?.name && (
                        <span className="text-[#2ea043] font-semibold">{paper.category.name}</span>
                      )}
                      {paper.targetClass?.name && (
                        <span className="text-[#6e7681]">{paper.targetClass.name}</span>
                      )}
                      {paper.targetAudience && (
                        <span className="text-[#6e7681]">{paper.targetAudience}</span>
                      )}
                    </div>
                    {paper.description && (
                      <p className="text-xs text-[#6e7681] mt-1 line-clamp-1">{paper.description}</p>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handlePreview(paper)}
                      className="bg-[#2ea043] text-white px-3 py-2 rounded text-sm hover:bg-[#238636]">
                      👁️ Preview
                    </button>
                    <button onClick={() => handleDownload(paper)}
                      className="bg-[#1f6feb] text-white px-3 py-2 rounded text-sm hover:bg-[#388bfd]">
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}
              className={`border border-[#21262d] px-3 py-1 rounded ${currentPage === 1 ? 'text-[#6e7681] cursor-not-allowed' : 'text-[#e6edf3] hover:border-[#2ea043]'}`}>«</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${currentPage === page ? 'bg-[#2ea043] text-white' : 'border border-[#21262d] text-[#e6edf3] hover:border-[#2ea043]'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}
              className={`border border-[#21262d] px-3 py-1 rounded ${currentPage === totalPages ? 'text-[#6e7681] cursor-not-allowed' : 'text-[#e6edf3] hover:border-[#2ea043]'}`}>»</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PastPapers