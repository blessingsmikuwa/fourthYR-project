import React, { useState, useEffect } from "react";

// TODO: Replace static books array with API call to get books from database
// Backend Integration Structure:
// 1. Books uploaded by admin will be stored in database
// 2. API endpoint: GET /api/books (with optional query params for filtering)
// 3. Response format: { books: [...], totalCount: number, currentPage: number, totalPages: number }
// 4. Admin dashboard will have upload functionality that saves to database
// 5. This component will fetch and display books dynamically

// Temporary static data - replace with API call
const staticBooks = [
  {
    title: "Biology Form 3 Textbook",
    author: "Ministry of Education",
    subject: "Biology",
    level: "Form 3",
    offline: true,
    color: "from-green-600 to-green-900",
  },
  {
    title: "Advanced Mathematics: Calculus",
    author: "Dr. James Phiri",
    subject: "Mathematics",
    level: "Form 4",
    offline: false,
    color: "from-orange-500 to-orange-800",
  },
  {
    title: "Chemistry: Organic Compounds",
    author: "Prof. Grace Banda",
    subject: "Chemistry",
    level: "Form 3",
    offline: true,
    color: "from-purple-600 to-purple-900",
  },
  {
    title: "English Literature Anthology",
    author: "Various Authors",
    subject: "English",
    level: "Form 2",
    offline: true,
    color: "from-yellow-400 to-yellow-700",
  },
  {
    title: "Physics: Mechanics and Waves",
    author: "Dr. Peter Mwale",
    subject: "Physics",
    level: "Form 4",
    offline: true,
    color: "from-blue-600 to-blue-900",
  },
  {
    title: "Geography: Human and Physical",
    author: "Mrs. Mary Banda",
    subject: "Geography",
    level: "Form 2",
    offline: false,
    color: "from-teal-500 to-teal-800",
  },
  {
    title: "History: Malawi and Africa",
    author: "Prof. John Chisi",
    subject: "History",
    level: "Form 3",
    offline: true,
    color: "from-red-600 to-red-900",
  },
  {
    title: "Civic Education: Rights and Duties",
    author: "Ministry of Education",
    subject: "Civic Education",
    level: "Form 1",
    offline: true,
    color: "from-indigo-600 to-indigo-900",
  },
  {
    title: "Computer Studies: Programming Basics",
    author: "Mr. Thomas Zulu",
    subject: "Computer Studies",
    level: "Form 2",
    offline: false,
    color: "from-cyan-500 to-cyan-800",
  },
  {
    title: "Agriculture: Crop Production",
    author: "Dr. Grace Nkhoma",
    subject: "Agriculture",
    level: "Form 3",
    offline: true,
    color: "from-lime-600 to-lime-900",
  },
  {
    title: "Business Studies: Entrepreneurship",
    author: "Mrs. Patricia Gondwe",
    subject: "Business Studies",
    level: "Form 4",
    offline: true,
    color: "from-amber-500 to-amber-800",
  },
  {
    title: "Home Economics: Food and Nutrition",
    author: "Ms. Elizabeth Phiri",
    subject: "Home Economics",
    level: "Form 2",
    offline: false,
    color: "from-rose-500 to-rose-800",
  },
  {
    title: " Chichewa: Literature and Grammar",
    author: "Mr. Wisdom Kamanga",
    subject: "Chichewa",
    level: "Form 1",
    offline: true,
    color: "from-emerald-600 to-emerald-900",
  },
  {
    title: "French: Basic Conversation",
    author: "Madame Sophie Dubois",
    subject: "French",
    level: "Form 3",
    offline: true,
    color: "from-violet-500 to-violet-800",
  },
  {
    title: "Music: Theory and Practice",
    author: "Mr. David Singano",
    subject: "Music",
    level: "Form 2",
    offline: false,
    color: "from-fuchsia-500 to-fuchsia-800",
  },
  {
    title: "Art and Design: Drawing Techniques",
    author: "Ms. Martha Mhone",
    subject: "Art",
    level: "Form 1",
    offline: true,
    color: "from-sky-500 to-sky-800",
  },
];

const Books = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedAvailability, setSelectedAvailability] = useState('Availability');
  const [selectedType, setSelectedType] = useState('All Types');
  const [books, setBooks] = useState(staticBooks); // Initialize with static data
  const [loading, setLoading] = useState(false); // Set to false since we have static data
  const [error, setError] = useState(null);
  const itemsPerPage = 12;

  // TODO: Implement API call to fetch books from database
  // This will replace the static books array above
  const fetchBooks = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters for filtering
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        level: selectedLevel !== 'All Levels' ? selectedLevel : '',
        subject: selectedSubject !== 'All Subjects' ? selectedSubject : '',
        availability: selectedAvailability !== 'Availability' ? selectedAvailability.toLowerCase() : '',
        type: selectedType !== 'All Types' ? selectedType : '',
        ...filters
      });

      // API call to get books from database
      // const response = await fetch(`/api/books?${queryParams}`);
      // const data = await response.json();

      // For now, using static data - replace with:
      // setBooks(data.books);
      // setTotalItems(data.totalCount);

      // Simulate API delay and set static data
      setTimeout(() => {
        setBooks(staticBooks); // Use static data for now
        setLoading(false);
      }, 500);

    } catch (err) {
      setError('Failed to load books. Please try again.');
      setLoading(false);
      console.error('Error fetching books:', err);
    }
  };

  // Fetch books when component mounts or filters change
  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchTerm, selectedLevel, selectedSubject, selectedAvailability, selectedType]);

  // Filter books based on current filters
  // TODO: Move filtering to backend API for better performance
  // Example: fetch(`/api/books?search=${searchTerm}&level=${selectedLevel}&subject=${selectedSubject}...`)
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'All Levels' || book.level === selectedLevel;
    const matchesSubject = selectedSubject === 'All Subjects' || book.subject === selectedSubject;
    const matchesAvailability = selectedAvailability === 'Availability' ||
                               (selectedAvailability === 'Offline' && book.offline) ||
                               (selectedAvailability === 'Online' && !book.offline);
    const matchesType = selectedType === 'All Types' ||
                       (selectedType === 'Textbooks' && book.subject !== 'English') ||
                       (selectedType === 'Novels' && book.subject === 'English');

    return matchesSearch && matchesLevel && matchesSubject && matchesAvailability && matchesType;
  });

  // Calculate pagination
  const totalItems = filteredBooks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownload = (book) => {
    // This will be connected to backend API
    console.log('Downloading:', book.title);
    // Example: fetch(`/api/books/${book.id}/download`)
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedSubject, selectedAvailability, selectedType]);
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">

      <div className="max-w-6xl mx-auto p-4">
        
        {/* SEARCH SECTION */}
        <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mt-6">
          
          {/* Search Bar */}
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

          {/* Filters */}
          <div className="grid md:grid-cols-4 gap-4">
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
              <option>All Subjects</option>
              <option>Biology</option>
              <option>Chemistry</option>
              <option>Physics</option>
              <option>Mathematics</option>
              <option>English</option>
              <option>Geography</option>
              <option>History</option>
              <option>Civic Education</option>
              <option>Computer Studies</option>
              <option>Agriculture</option>
              <option>Business Studies</option>
              <option>Home Economics</option>
              <option>Chichewa</option>
              <option>French</option>
              <option>Music</option>
              <option>Art</option>
            </select>

            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md"
            >
              <option>Availability</option>
              <option>Offline</option>
              <option>Online</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md"
            >
              <option>All Types</option>
              <option>Textbooks</option>
              <option>Novels</option>
            </select>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold text-[#e6edf3]">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} books
          </h2>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-[#e6edf3]">Loading books...</div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mt-4">
            {error}
          </div>
        )}

        {/* BOOK DISPLAY */}
        {!loading && !error && (
          <div className="space-y-4 mt-4">
            {currentBooks.map((book, index) => (
              <div
                key={index}
                className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 hover:border-[#2ea043] transition"
              >
                <div className="flex items-center gap-4">
                  {/* Cover */}
                  <div
                    className={`w-20 h-24 bg-gradient-to-br ${book.color} flex items-center justify-center rounded relative flex-shrink-0`}
                  >
                    <span className="text-2xl opacity-30">📖</span>
                    <span className={`absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded font-semibold ${
                      book.offline
                        ? "bg-[#2ea043] text-white"
                        : "bg-[#161b22] text-[#e6edf3]"
                    }`}>
                      {book.offline ? "📥" : "○"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#e6edf3] text-lg">
                      {book.title}
                    </h3>
                    <p className="text-sm text-[#6e7681] mb-1">
                      by {book.author}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#2ea043] font-semibold">
                        {book.subject}
                      </span>
                      <span className="text-[#6e7681]">
                        {book.level}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        book.offline ? "bg-[#2ea043] text-white" : "bg-[#161b22] border border-[#21262d] text-[#e6edf3]"
                      }`}>
                        {book.offline ? "Offline" : "Online"}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button className="bg-[#2ea043] text-white px-3 py-2 rounded text-sm hover:bg-[#238636]">
                      📖 Read
                    </button>
                    <button
                      onClick={() => handleDownload(book)}
                      className="bg-[#1f6feb] text-white px-3 py-2 rounded text-sm hover:bg-[#388bfd]"
                    >
                      ⬇️ Download
                    </button>
                    <button className="border border-[#21262d] px-3 py-2 rounded text-[#e6edf3] hover:border-[#2ea043]">
                      ⭐
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`border border-[#21262d] px-3 py-1 rounded ${
                currentPage === 1
                  ? 'text-[#6e7681] cursor-not-allowed'
                  : 'text-[#e6edf3] hover:border-[#2ea043]'
              }`}
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  currentPage === page
                    ? 'bg-[#2ea043] text-white'
                    : 'border border-[#21262d] text-[#e6edf3] hover:border-[#2ea043]'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`border border-[#21262d] px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'text-[#6e7681] cursor-not-allowed'
                  : 'text-[#e6edf3] hover:border-[#2ea043]'
              }`}
            >
              »
            </button>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-[#161b22] text-[#6e7681] text-center py-6 mt-10">
        © 2026 Malawi School Library System
      </footer>
    </div>
  );
};

export default Books;