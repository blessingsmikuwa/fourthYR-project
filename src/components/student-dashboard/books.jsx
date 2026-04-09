import React, { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const COLORS = [
  "from-green-600 to-green-900", "from-orange-500 to-orange-800",
  "from-purple-600 to-purple-900", "from-yellow-400 to-yellow-700",
  "from-blue-600 to-blue-900", "from-teal-500 to-teal-800",
  "from-red-600 to-red-900", "from-indigo-600 to-indigo-900",
  "from-cyan-500 to-cyan-800", "from-lime-600 to-lime-900",
  "from-amber-500 to-amber-800", "from-rose-500 to-rose-800",
]

const Books = () => {
  const [books, setBooks]               = useState([])
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
    const fetchBooks = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE}/resources`, { headers })
        if (!res.ok) throw new Error(`Failed to fetch resources: ${res.status}`)
        const data = await res.json()
        // Resources are books — filter by PDF/DOCUMENT type
        const all = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
        const filtered = all.filter((r) => r.type === 'PDF' || r.form === 'DOCUMENT')
        setBooks(filtered)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
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

  const handleDownload = async (book) => {
    try {
      await fetch(`${API_BASE}/resources/${book.id}/download`, {
        method: 'POST', headers,
      })
    } catch {}
    await logActivity('DOWNLOAD', book.title)
    if (book.fileUrl) window.open(book.fileUrl, '_blank')
  }

  const handleView = async (book) => {
    await logActivity('RESOURCE_VIEWED', book.title)
    if (book.fileUrl) window.open(book.fileUrl, '_blank')
  }

  // Derive subjects from loaded data
  const subjects = ['All Subjects', ...new Set(books.map((b) => b.category?.name).filter(Boolean))]

  const filtered = books.filter((book) => {
    const matchesSearch  = book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel   = selectedLevel === 'All Levels' || book.targetClass?.name === selectedLevel
    const matchesSubject = selectedSubject === 'All Subjects' || book.category?.name === selectedSubject
    return matchesSearch && matchesLevel && matchesSubject
  })

  const totalItems  = filtered.length
  const totalPages  = Math.ceil(totalItems / itemsPerPage)
  const startIndex  = (currentPage - 1) * itemsPerPage
  const currentBooks = filtered.slice(startIndex, startIndex + itemsPerPage)

  // Reset page on filter change
  useEffect(() => { setCurrentPage(1) }, [searchTerm, selectedLevel, selectedSubject])

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <div className="max-w-6xl mx-auto p-4">

        {/* Search & Filters */}
        <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mt-6">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input type="text" placeholder="Search books..."
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
            Showing {Math.min(startIndex + 1, totalItems)}–{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} books
          </h2>
        </div>

        {loading && <div className="text-center py-8 text-[#e6edf3]">Loading books...</div>}
        {error && <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mt-4">{error}</div>}

        {!loading && !error && (
          <div className="space-y-4 mt-4">
            {currentBooks.length === 0 ? (
              <div className="text-center py-12 text-[#6e7681]">No books found.</div>
            ) : currentBooks.map((book, index) => (
              <div key={book.id ?? index}
                className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 hover:border-[#2ea043] transition">
                <div className="flex items-center gap-4">
                  {/* Cover */}
                  <div className={`w-20 h-24 bg-gradient-to-br ${COLORS[index % COLORS.length]} flex items-center justify-center rounded relative flex-shrink-0`}>
                    <span className="text-2xl opacity-30">📖</span>
                  </div>
                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#e6edf3] text-lg">{book.title}</h3>
                    {book.description && (
                      <p className="text-sm text-[#6e7681] mb-1 line-clamp-1">{book.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm">
                      {book.category?.name && (
                        <span className="text-[#2ea043] font-semibold">{book.category.name}</span>
                      )}
                      {book.targetClass?.name && (
                        <span className="text-[#6e7681]">{book.targetClass.name}</span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded bg-[#2ea043] text-white">
                        {book.visibility === 'PUBLIC' ? 'Public' : 'School'}
                      </span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handleView(book)}
                      className="bg-[#2ea043] text-white px-3 py-2 rounded text-sm hover:bg-[#238636]">
                      📖 Read
                    </button>
                    <button onClick={() => handleDownload(book)}
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

export default Books