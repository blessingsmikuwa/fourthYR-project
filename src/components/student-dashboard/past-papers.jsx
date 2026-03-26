import React, { useState, useEffect } from "react";

// TODO: Replace static pastPapers array with API call to get past papers from database
// Backend Integration Structure:
// 1. Past papers uploaded by teachers/admins will be stored in database
// 2. API endpoint: GET /api/past-papers (with optional query params for filtering)
// 3. Response format: { pastPapers: [...], totalCount: number, currentPage: number, totalPages: number }
// 4. Teacher/Admin dashboard will have upload functionality that saves to database
// 5. This component will fetch and display past papers dynamically

// Temporary static data - replace with API call
const staticPastPapers = [
  {
    title: "Mathematics Form 3 Final Exam 2023",
    subject: "Mathematics",
    level: "Form 3",
    examType: "Final Exam",
    year: "2023",
    marks: 100,
    time: "2 hours",
    uploadedBy: "Mr. Thomas Zulu",
    uploadDate: "2023-12-15",
    color: "from-blue-600 to-blue-900",
  },
  {
    title: "Biology Form 4 Mid-term Test 2023",
    subject: "Biology",
    level: "Form 4",
    examType: "Mid-term",
    year: "2023",
    marks: 50,
    time: "1.5 hours",
    uploadedBy: "Dr. Grace Banda",
    uploadDate: "2023-10-20",
    color: "from-green-600 to-green-900",
  },
  {
    title: "Chemistry Form 2 Final Exam 2022",
    subject: "Chemistry",
    level: "Form 2",
    examType: "Final Exam",
    year: "2022",
    marks: 80,
    time: "2 hours",
    uploadedBy: "Prof. Grace Banda",
    uploadDate: "2022-12-10",
    color: "from-purple-600 to-purple-900",
  },
  {
    title: "Physics Form 4 Mock Exam 2023",
    subject: "Physics",
    level: "Form 4",
    examType: "Mock Exam",
    year: "2023",
    marks: 120,
    time: "2.5 hours",
    uploadedBy: "Dr. Peter Mwale",
    uploadDate: "2023-11-05",
    color: "from-orange-500 to-orange-800",
  },
  {
    title: "English Form 1 Mid-term Test 2023",
    subject: "English",
    level: "Form 1",
    examType: "Mid-term",
    year: "2023",
    marks: 60,
    time: "1 hour",
    uploadedBy: "Mrs. Mary Banda",
    uploadDate: "2023-09-15",
    color: "from-yellow-400 to-yellow-700",
  },
  {
    title: "Geography Form 3 Final Exam 2022",
    subject: "Geography",
    level: "Form 3",
    examType: "Final Exam",
    year: "2022",
    marks: 90,
    time: "2 hours",
    uploadedBy: "Mrs. Mary Banda",
    uploadDate: "2022-12-08",
    color: "from-teal-500 to-teal-800",
  },
  {
    title: "History Form 2 Mock Exam 2023",
    subject: "History",
    level: "Form 2",
    examType: "Mock Exam",
    year: "2023",
    marks: 70,
    time: "1.5 hours",
    uploadedBy: "Prof. John Chisi",
    uploadDate: "2023-10-30",
    color: "from-red-600 to-red-900",
  },
  {
    title: "Civic Education Form 4 Final Exam 2023",
    subject: "Civic Education",
    level: "Form 4",
    examType: "Final Exam",
    year: "2023",
    marks: 75,
    time: "1.5 hours",
    uploadedBy: "Ministry of Education",
    uploadDate: "2023-12-12",
    color: "from-indigo-600 to-indigo-900",
  },
  {
    title: "Computer Studies Form 3 Mid-term Test 2023",
    subject: "Computer Studies",
    level: "Form 3",
    examType: "Mid-term",
    year: "2023",
    marks: 55,
    time: "1 hour",
    uploadedBy: "Mr. Thomas Zulu",
    uploadDate: "2023-09-25",
    color: "from-cyan-500 to-cyan-800",
  },
  {
    title: "Agriculture Form 2 Final Exam 2022",
    subject: "Agriculture",
    level: "Form 2",
    examType: "Final Exam",
    year: "2022",
    marks: 85,
    time: "2 hours",
    uploadedBy: "Dr. Grace Nkhoma",
    uploadDate: "2022-12-05",
    color: "from-lime-600 to-lime-900",
  },
  {
    title: "Business Studies Form 4 Mock Exam 2023",
    subject: "Business Studies",
    level: "Form 4",
    examType: "Mock Exam",
    year: "2023",
    marks: 95,
    time: "2 hours",
    uploadedBy: "Mrs. Patricia Gondwe",
    uploadDate: "2023-11-15",
    color: "from-amber-500 to-amber-800",
  },
  {
    title: "Home Economics Form 1 Mid-term Test 2023",
    subject: "Home Economics",
    level: "Form 1",
    examType: "Mid-term",
    year: "2023",
    marks: 45,
    time: "1 hour",
    uploadedBy: "Ms. Elizabeth Phiri",
    uploadDate: "2023-08-20",
    color: "from-rose-500 to-rose-800",
  },
];

const PastPapers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedExamType, setSelectedExamType] = useState('All Types');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [pastPapers, setPastPapers] = useState(staticPastPapers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 12;

  // TODO: Implement API call to fetch past papers from database
  const fetchPastPapers = async (filters = {}) => {
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
        examType: selectedExamType !== 'All Types' ? selectedExamType : '',
        year: selectedYear !== 'All Years' ? selectedYear : '',
        ...filters
      });

      // API call to get past papers from database
      // const response = await fetch(`/api/past-papers?${queryParams}`);
      // const data = await response.json();

      // For now, using static data - replace with:
      // setPastPapers(data.pastPapers);
      // setTotalItems(data.totalCount);

      // Simulate API delay and set static data
      setTimeout(() => {
        setPastPapers(staticPastPapers);
        setLoading(false);
      }, 500);

    } catch (err) {
      setError('Failed to load past papers. Please try again.');
      setLoading(false);
      console.error('Error fetching past papers:', err);
    }
  };

  // Fetch past papers when component mounts or filters change
  useEffect(() => {
    fetchPastPapers();
  }, [currentPage, searchTerm, selectedLevel, selectedSubject, selectedExamType, selectedYear]);

  // Filter past papers based on current filters
  // TODO: Move filtering to backend API for better performance
  const filteredPastPapers = pastPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = selectedLevel === 'All Levels' || paper.level === selectedLevel;
    const matchesSubject = selectedSubject === 'All Subjects' || paper.subject === selectedSubject;
    const matchesExamType = selectedExamType === 'All Types' || paper.examType === selectedExamType;
    const matchesYear = selectedYear === 'All Years' || paper.year === selectedYear;

    return matchesSearch && matchesLevel && matchesSubject && matchesExamType && matchesYear;
  });

  // Calculate pagination
  const totalItems = filteredPastPapers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPastPapers = filteredPastPapers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownload = (paper) => {
    // This will be connected to backend API
    console.log('Downloading:', paper.title);
    // Example: fetch(`/api/past-papers/${paper.id}/download`)
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLevel, selectedSubject, selectedExamType, selectedYear]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <div className="max-w-6xl mx-auto p-4">

        {/* SEARCH SECTION */}
        <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mt-6">

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search past papers..."
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
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md"
            >
              <option>All Types</option>
              <option>Final Exam</option>
              <option>Mid-term</option>
              <option>Mock Exam</option>
              <option>Test</option>
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-2 rounded-md"
            >
              <option>All Years</option>
              <option>2023</option>
              <option>2022</option>
              <option>2021</option>
              <option>2020</option>
            </select>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-xl font-semibold text-[#e6edf3]">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} past papers
          </h2>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-[#e6edf3]">Loading past papers...</div>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mt-4">
            {error}
          </div>
        )}

        {/* PAST PAPERS DISPLAY */}
        {!loading && !error && (
          <div className="space-y-4 mt-4">
            {currentPastPapers.map((paper, index) => (
              <div
                key={index}
                className="bg-[#161b22] border border-[#21262d] rounded-lg p-4 hover:border-[#2ea043] transition"
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-20 h-24 bg-gradient-to-br ${paper.color} flex items-center justify-center rounded relative flex-shrink-0`}
                  >
                    <span className="text-2xl opacity-30">📄</span>
                    <span className="absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded font-semibold bg-[#2ea043] text-white">
                      📥
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#e6edf3] text-lg">
                      {paper.title}
                    </h3>
                    <p className="text-sm text-[#6e7681] mb-1">
                      Uploaded by {paper.uploadedBy} • {paper.uploadDate}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-[#2ea043] font-semibold">
                        {paper.subject}
                      </span>
                      <span className="text-[#6e7681]">
                        {paper.level}
                      </span>
                      <span className="text-[#6e7681]">
                        {paper.examType}
                      </span>
                      <span className="text-[#6e7681]">
                        {paper.year}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mt-1">
                      <span className="text-[#6e7681]">
                        📊 {paper.marks} marks
                      </span>
                      <span className="text-[#6e7681]">
                        ⏱️ {paper.time}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button className="bg-[#2ea043] text-white px-3 py-2 rounded text-sm hover:bg-[#238636]">
                      👁️ Preview
                    </button>
                    <button
                      onClick={() => handleDownload(paper)}
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
    </div>
  );
};

export default PastPapers;