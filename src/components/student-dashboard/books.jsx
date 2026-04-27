import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const SUBJECT_ICONS = {
  Mathematics: "🧮",
  Biology: "🧬",
  Chemistry: "⚗️",
  Physics: "⚛️",
  English: "📝",
  History: "📜",
  Geography: "🌍",
  Other: "📚",
};

const Books = () => {
  const [books, setBooks]                   = useState([]);
  const [purchasedIds, setPurchasedIds]     = useState(new Set()); // ← real data
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [searchTerm, setSearchTerm]         = useState("");
  const [selectedLevel, setSelectedLevel]   = useState("All Levels");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [currentPage, setCurrentPage]       = useState(1);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const itemsPerPage = 12;
  const location = useLocation();
  const showPremium = location.pathname === "/books/premium";

  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // ── Helpers ──────────────────────────────────────────────────────
  const parsePrice = (book) => {
    const raw = book.price ?? book.amount ?? book.cost ?? book.payment?.amount;
    if (typeof raw === "number") return raw;
    if (typeof raw === "string") return parseFloat(raw) || 0;
    return 0;
  };

  const isPaidBook   = (book) => parsePrice(book) > 0 || book.isPaid === true;
  const hasAccess    = (book) =>
    purchasedIds.has(book.id) ||        // ← checked against real DB data
    book.purchased === true ||
    book.isPurchased === true ||
    book.hasAccess === true;
  const canAccessBook = (book) => !isPaidBook(book) || hasAccess(book);

  const formatPrice = (book) => {
    const price = parsePrice(book);
    if (!price) return "Free";
    const currency = book.currency ?? "MWK";
    return `${currency} ${price.toFixed(2)}`;
  };

  // ── Data fetching ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch resources
        const resRes = await fetch(`${API_BASE}/resources`, { headers });
        if (!resRes.ok) throw new Error(`Failed to fetch resources: ${resRes.status}`);
        const resData = await resRes.json();
        const all = Array.isArray(resData?.data)
          ? resData.data
          : Array.isArray(resData)
          ? resData
          : [];
        const filtered = all.filter((r) => r.form === "DOCUMENT");
        setBooks(filtered);

        // 2. Fetch the user's purchased resource IDs (only if logged in)
        if (token) {
          try {
            const purchRes = await fetch(`${API_BASE}/payment/my-purchases`, { headers });
            if (purchRes.ok) {
              const purchData = await purchRes.json();
              // purchData = { purchased: ["uuid1", "uuid2", ...] }
              setPurchasedIds(new Set(purchData.purchased ?? []));
            }
          } catch {
            // If the call fails we just show no purchases – not a fatal error
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Activity logging ──────────────────────────────────────────────
  const logActivity = async (action, title, metadata = {}) => {
    try {
      await fetch(`${API_BASE}/activity`, {
        method: "POST",
        headers,
        body: JSON.stringify({ action, resourceTitle: title, metadata }),
      });
    } catch {}
  };

  // ── Actions ───────────────────────────────────────────────────────
  const handleDownload = async (book) => {
    try {
      await fetch(`${API_BASE}/resources/${book.id}/download`, {
        method: "POST",
        headers,
      });
    } catch {}
    await logActivity("DOWNLOAD", book.title);
    if (book.fileUrl) window.open(book.fileUrl, "_blank");
  };

  const handlePurchase = async (book) => {
    const price = parsePrice(book);
    if (!price) return;

    if (!token) {
      setError("Please log in to purchase books.");
      return;
    }

    setPurchaseLoading(true);
    setError(null);
    try {
      // POST /payment/create-checkout-session
      const res = await fetch(`${API_BASE}/payment/create-checkout-session`, {
        method: "POST",
        headers,
        body: JSON.stringify({ resourceId: book.id, amount: price }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? "Unable to start payment");
      }

      const data = await res.json();
      // PaymentService returns { checkoutUrl: "..." }
      const url = data?.checkoutUrl ?? data?.url;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned from server");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleView = async (book) => {
    await logActivity("RESOURCE_VIEWED", book.title);
    if (book.fileUrl) window.open(book.fileUrl, "_blank");
  };

  // ── Filter / paginate ─────────────────────────────────────────────
  const subjects = [
    "All Subjects",
    ...new Set(books.map((b) => b.category?.name).filter(Boolean)),
  ];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "All Levels" || book.targetClass?.name === selectedLevel;
    const matchesSubject =
      selectedSubject === "All Subjects" || book.category?.name === selectedSubject;
    const matchesType = showPremium ? isPaidBook(book) : !isPaidBook(book);
    return matchesSearch && matchesLevel && matchesSubject && matchesType;
  });

  const totalItems   = filteredBooks.length;
  const totalPages   = Math.ceil(totalItems / itemsPerPage);
  const startIndex   = (currentPage - 1) * itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedSubject]);

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <div className="max-w-6xl mx-auto p-4">

        {/* Search & Filters */}
        <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mt-6">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] rounded-lg px-4 py-2 focus:border-[#2ea043] outline-none"
            />
            <button className="bg-[#2ea043] text-white px-6 py-2 rounded-lg hover:bg-[#238636]">
              🔍 Search
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md"
            >
              <option>All Levels</option>
              <option>Form 1</option>
              <option>Form 2</option>
              <option>Form 3</option>
              <option>Form 4</option>
            </select>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md"
            >
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6">
          <h2 className="text-xl font-semibold">
            {showPremium ? "Premium Books" : "Free Books"}
          </h2>
          <p className="text-sm text-[#8b949e]">
            Showing {Math.min(startIndex + 1, totalItems)}–
            {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} books
          </p>
        </div>

        {loading && (
          <div className="text-center py-8 text-[#e6edf3]">Loading books...</div>
        )}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mt-4">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-4 mt-4">
            {currentBooks.length === 0 ? (
              <div className="text-center py-12 text-[#6e7681]">
                No books found.
              </div>
            ) : (
              currentBooks.map((book, index) => (
                <div
                  key={book.id ?? index}
                  className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 hover:border-[#2ea043] transition"
                >
                  <div className="flex items-center gap-4">
                    {/* Cover */}
                    <div className="w-20 h-24 bg-[#21262d] border border-[#30363d] flex items-center justify-center rounded relative flex-shrink-0">
                      <span className="text-3xl">
                        {SUBJECT_ICONS[book.category?.name] || SUBJECT_ICONS["Other"]}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#e6edf3] text-lg">
                        {book.title}
                      </h3>
                      {book.description && (
                        <p className="text-sm text-[#6e7681] mb-1 line-clamp-1">
                          {book.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm mb-2 flex-wrap">
                        {book.category?.name && (
                          <span className="text-[#2ea043] font-semibold">
                            {book.category.name}
                          </span>
                        )}
                        {book.targetClass?.name && (
                          <span className="text-[#6e7681]">
                            {book.targetClass.name}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            isPaidBook(book)
                              ? "bg-[#2563eb] text-white"
                              : "bg-[#2ea043] text-white"
                          }`}
                        >
                          {isPaidBook(book)
                            ? `Paid • ${formatPrice(book)}`
                            : "Free"}
                        </span>
                        {hasAccess(book) && isPaidBook(book) && (
                          <span className="text-xs px-2 py-0.5 rounded bg-[#16a34a] text-white">
                            ✓ Purchased
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {canAccessBook(book) ? (
                        <>
                          <button
                            onClick={() => handleView(book)}
                            className="bg-[#2ea043] text-white px-3 py-2 rounded text-sm hover:bg-[#238636]"
                          >
                            📖 Read
                          </button>
                          <button
                            onClick={() => handleDownload(book)}
                            className="bg-[#1f6feb] text-white px-3 py-2 rounded text-sm hover:bg-[#388bfd]"
                          >
                            ⬇️ Download
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handlePurchase(book)}
                          disabled={purchaseLoading}
                          className="bg-[#2563eb] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#1d4ed8] disabled:opacity-60 whitespace-nowrap"
                        >
                          {purchaseLoading
                            ? "Processing…"
                            : `Buy • ${formatPrice(book)}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className={`border border-[#21262d] px-3 py-1 rounded ${
                currentPage === 1
                  ? "text-[#6e7681] cursor-not-allowed"
                  : "text-[#e6edf3] hover:border-[#2ea043]"
              }`}
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? "bg-[#2ea043] text-white"
                    : "border border-[#21262d] text-[#e6edf3] hover:border-[#2ea043]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className={`border border-[#21262d] px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "text-[#6e7681] cursor-not-allowed"
                  : "text-[#e6edf3] hover:border-[#2ea043]"
              }`}
            >
              »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Books;