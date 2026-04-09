import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const SUBJECT_TOPICS = {
  Biology: [
    "Cell Structure and Function",
    "Cell Division (Mitosis and Meiosis)",
    "Photosynthesis",
    "Respiration",
    "Transport in Plants",
    "Transport in Animals (Circulatory System)",
    "Nutrition in Plants",
    "Nutrition in Animals (Human Digestive System)",
    "Excretion in Humans",
    "Nervous System",
    "Endocrine System",
    "Reproduction in Plants",
    "Reproduction in Humans",
    "Genetics and Heredity",
    "Evolution and Natural Selection",
    "Ecology and Ecosystems",
    "Classification of Living Things",
    "Disease and Immunity",
    "Biotechnology",
    "Environmental Issues in Malawi",
  ],
  Mathematics: [
    "Number and Numeration",
    "Fractions, Decimals and Percentages",
    "Ratio and Proportion",
    "Algebra: Simplification and Expansion",
    "Linear Equations",
    "Simultaneous Equations",
    "Quadratic Equations",
    "Inequalities",
    "Functions and Graphs",
    "Sequences and Series",
    "Geometry: Lines and Angles",
    "Triangles and Congruence",
    "Circle Theorems",
    "Mensuration: Area and Perimeter",
    "Mensuration: Volume and Surface Area",
    "Trigonometry",
    "Vectors",
    "Matrices",
    "Statistics: Mean, Median and Mode",
    "Probability",
  ],
  Chemistry: [
    "Atomic Structure",
    "The Periodic Table",
    "Chemical Bonding (Ionic and Covalent)",
    "States of Matter",
    "Chemical Reactions and Equations",
    "Acids, Bases and Salts",
    "Oxidation and Reduction (Redox)",
    "Electrochemistry",
    "Rates of Reaction",
    "Energy Changes in Reactions",
    "The Mole Concept",
    "Gases and Gas Laws",
    "Water and Solutions",
    "Metals and Non-Metals",
    "Carbon and Its Compounds",
    "Organic Chemistry: Alkanes and Alkenes",
    "Organic Chemistry: Alcohols and Acids",
    "Polymers and Plastics",
    "Environmental Chemistry",
    "Industrial Chemistry in Malawi",
  ],
  Physics: [
    "Measurements and Units",
    "Motion: Speed, Velocity and Acceleration",
    "Newton's Laws of Motion",
    "Forces and Equilibrium",
    "Work, Energy and Power",
    "Momentum and Collisions",
    "Pressure in Solids, Liquids and Gases",
    "Heat and Temperature",
    "Thermal Expansion",
    "Transfer of Heat",
    "Waves: Properties and Types",
    "Sound Waves",
    "Light: Reflection",
    "Light: Refraction and Lenses",
    "Electricity: Current and Circuits",
    "Ohm's Law and Resistance",
    "Magnetism and Electromagnetism",
    "Electromagnetic Induction",
    "Radioactivity",
    "Electronics and Logic Gates",
  ],
  English: [
    "Reading Comprehension",
    "Summary Writing",
    "Essay Writing: Argumentative",
    "Essay Writing: Descriptive",
    "Essay Writing: Narrative",
    "Letter Writing: Formal",
    "Letter Writing: Informal",
    "Report Writing",
    "Grammar: Parts of Speech",
    "Grammar: Tenses",
    "Grammar: Active and Passive Voice",
    "Grammar: Direct and Indirect Speech",
    "Vocabulary and Word Formation",
    "Punctuation and Spelling",
    "Poetry: Analysis and Appreciation",
    "Prose: Novel Study",
    "Drama: Play Study",
    "Oral Communication Skills",
    "Debate and Discussion",
    "Literature in Malawian Context",
  ],
  Geography: [
    "Map Reading and Interpretation",
    "Weather and Climate",
    "Climate Regions of Malawi",
    "Malawi: Physical Features",
    "Malawi: Lake Malawi",
    "Malawi: Rivers and Water Resources",
    "Population Distribution in Malawi",
    "Rural and Urban Settlements",
    "Agriculture in Malawi",
    "Cash Crops: Tobacco, Tea and Sugar",
    "Fishing Industry in Malawi",
    "Mining and Natural Resources",
    "Transport and Communication in Malawi",
    "Trade and Economic Development",
    "Africa: Physical Geography",
    "Africa: Political Geography",
    "Plate Tectonics and Earthquakes",
    "Volcanoes",
    "Soil Types and Erosion",
    "Environmental Conservation in Malawi",
  ],
  History: [
    "Early Peoples of Malawi",
    "Migration and Settlement of Bantu People",
    "Maravi Kingdom",
    "Ngoni Migration and Settlement",
    "Yao and Arab Slave Trade",
    "European Exploration of Africa",
    "Livingstone and Missionaries in Malawi",
    "British Central Africa Protectorate",
    "Colonial Administration in Nyasaland",
    "Resistance to Colonial Rule",
    "John Chilembwe Rising 1915",
    "Nyasaland African Congress",
    "Federation of Rhodesia and Nyasaland",
    "Malawi Congress Party and Independence",
    "Dr Hastings Kamuzu Banda and Independence 1964",
    "One Party State in Malawi",
    "Multiparty Democracy 1993",
    "Post-Independence Development in Malawi",
    "Africa: Colonisation and Independence",
    "World War I and World War II",
  ],
  "Civic Education": [
    "Citizenship and Responsibilities",
    "Human Rights",
    "Children's Rights in Malawi",
    "The Constitution of Malawi",
    "Branches of Government",
    "The Executive: President and Cabinet",
    "The Legislature: Parliament of Malawi",
    "The Judiciary and Rule of Law",
    "Local Government in Malawi",
    "Elections and Democracy",
    "Political Parties in Malawi",
    "Gender Equality and Equity",
    "HIV and AIDS Awareness",
    "Drug and Substance Abuse",
    "Environmental Rights and Duties",
    "Community Development",
    "Conflict Resolution",
    "National Symbols of Malawi",
    "Regional and International Organisations (AU, SADC, UN)",
    "Corruption and Good Governance",
  ],
  "Computer Studies": [
    "Introduction to Computers",
    "Computer Hardware Components",
    "Computer Software: System and Application",
    "Operating Systems",
    "File Management",
    "Word Processing (Microsoft Word)",
    "Spreadsheets (Microsoft Excel)",
    "Presentation Software (Microsoft PowerPoint)",
    "Database Concepts",
    "Internet and Email",
    "World Wide Web and Browsers",
    "Computer Networks and Types",
    "Network Security and Cyber Safety",
    "Introduction to Programming",
    "Algorithms and Flowcharts",
    "Basic Programming in Python",
    "HTML and Web Design Basics",
    "Data Representation (Binary and Hexadecimal)",
    "ICT in Society and Development",
    "ICT in Malawi: E-government and Mobile Money",
  ],
  Agriculture: [
    "Importance of Agriculture in Malawi",
    "Types of Farming",
    "Soil Formation and Composition",
    "Soil Fertility and Improvement",
    "Soil Conservation and Erosion Control",
    "Crop Production: Land Preparation",
    "Crop Production: Planting and Spacing",
    "Fertilisers and Manure",
    "Crop Pests and Diseases",
    "Weed Control",
    "Irrigation in Malawi",
    "Harvesting and Post-Harvest Handling",
    "Cash Crops: Tobacco Production",
    "Food Crops: Maize Production",
    "Horticulture",
    "Animal Husbandry: Cattle",
    "Animal Husbandry: Poultry",
    "Animal Diseases and Vaccination",
    "Farm Machinery and Tools",
    "Agricultural Marketing in Malawi",
  ],
  "Business Studies": [
    "Introduction to Business",
    "Types of Business Organisations",
    "Sole Trader and Partnership",
    "Limited Companies",
    "Co-operatives in Malawi",
    "Entrepreneurship",
    "Starting a Business",
    "Business Finance and Capital",
    "Banking Services in Malawi",
    "Insurance",
    "Marketing and the Marketing Mix",
    "Advertising and Promotion",
    "Production and Manufacturing",
    "Human Resources Management",
    "Accounting: Basic Concepts",
    "Ledger Accounts and Trial Balance",
    "Profit and Loss Account",
    "Balance Sheet",
    "Trade and Commerce",
    "International Trade and Malawi's Economy",
  ],
  "Home Economics": [
    "Nutrition and Balanced Diet",
    "Food Groups and Functions",
    "Malnutrition in Malawi",
    "Food Preparation and Cooking Methods",
    "Kitchen Hygiene and Safety",
    "Preservation and Storage of Food",
    "Infant Feeding and Weaning",
    "Personal Hygiene",
    "Clothing and Textile Fibres",
    "Sewing and Garment Construction",
    "Laundry and Care of Clothes",
    "Home Management",
    "Consumer Education",
    "Family and Child Development",
    "Health: Communicable Diseases",
    "HIV and AIDS in the Family",
    "Family Planning",
    "Housing and Home Environment",
    "Water Sanitation and Hygiene",
    "Budget and Financial Planning",
  ],
  Chichewa: [
    "Kusoma ndi Kumvetsa (Reading Comprehension)",
    "Kulemba Ndime (Paragraph Writing)",
    "Kulemba Kalata (Letter Writing)",
    "Kulemba Nkhani (Story Writing)",
    "Mau Ogwirizana (Synonyms)",
    "Mau Ofanana Kutchula (Homonyms)",
    "Ntchito ya Mau m'Ziganizo (Parts of Speech)",
    "Ziganizo (Sentences and Grammar)",
    "Nthano ndi Miyambo (Folktales and Culture)",
    "Ndakatulo (Poetry)",
    "Zisonyezo (Proverbs and Idioms)",
    "Mfundo Zachichewa (Chichewa Phonology)",
    "Kulemba Buku la Tsiku (Diary Writing)",
    "Mau Osinthana (Antonyms)",
    "Kayendedwe ka Mau (Word Formation)",
    "Kulemba Lipoti (Report Writing)",
    "Mawu Olembedwa Bwino (Spelling)",
    "Kucheza ndi Anthu (Oral Communication)",
    "Nkhani za Malawi (Malawian Literature)",
    "Vokali ndi Konsonanti (Vowels and Consonants)",
  ],
  French: [
    "Greetings and Introductions",
    "Numbers and Counting",
    "Days, Months and Seasons",
    "Family and Relationships",
    "Food and Drink",
    "School and Education",
    "Colours and Descriptions",
    "The Body and Health",
    "Transport and Travel",
    "Shopping and Money",
    "Present Tense Verbs (Présent)",
    "Past Tense (Passé Composé)",
    "Future Tense (Futur Simple)",
    "Nouns and Articles",
    "Adjectives and Agreement",
    "Pronouns",
    "Prepositions",
    "Question Formation",
    "Negation",
    "Reading and Writing in French",
  ],
};

const LEVELS = ["Form 1", "Form 2", "Form 3", "Form 4"];

const Quiz = () => {
  const [subject, setSubject]     = useState("");
  const [level, setLevel]         = useState("");
  const [topic, setTopic]         = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers]     = useState({});
  const [score, setScore]         = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [quizMeta, setQuizMeta]   = useState(null);
  const [history, setHistory]     = useState([]);

  const topics = subject ? (SUBJECT_TOPICS[subject] ?? []) : [];

  const generateQuiz = async () => {
    if (!subject || !level || !topic) {
      setError("Please select a subject, level and topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setQuizMeta(null);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/quizzes/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ subject, level, topic }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message ?? `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setQuestions(data.questions);
      setQuizMeta({ subject: data.subject, level: data.level, topic: data.topic });
    } catch (err) {
      setError(err.message ?? "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, optionIndex) => {
    if (score !== null) return;
    setAnswers({ ...answers, [qIndex]: optionIndex });
  };

  const submitQuiz = () => {
    if (Object.keys(answers).length < questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);

    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    setScore(correct);

    if (quizMeta) {
      const record = {
        id: Date.now().toString(),
        ...quizMeta,
        score: correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100),
        completedAt: new Date().toISOString(),
      };
      setHistory((prev) => [record, ...prev].slice(0, 10));
    }
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setScore(null);
    setError(null);
    setQuizMeta(null);
  };

  const getOptionStyle = (qIndex, optIndex) => {
    if (score === null) {
      return answers[qIndex] === optIndex
        ? "border-[#2ea043] bg-[#2ea04320]"
        : "border-[#21262d] hover:bg-[#21262d]";
    }
    const isCorrect  = questions[qIndex].correct === optIndex;
    const isSelected = answers[qIndex] === optIndex;
    if (isCorrect) return "border-[#2ea043] bg-[#2ea04320]";
    if (isSelected && !isCorrect) return "border-[#da3633] bg-[#da363320]";
    return "border-[#21262d] opacity-50";
  };

  return (
    <div className="bg-[#0d1117] min-h-screen p-6 text-[#e6edf3]">

      <h1 className="text-2xl font-bold text-[#2ea043] mb-6">🧠 AI Quiz Generator</h1>

      {/* Generator */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg mb-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">

          {/* Subject */}
          <select
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setTopic(""); setError(null); }}
            disabled={loading}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50"
          >
            <option value="">Select Subject</option>
            {Object.keys(SUBJECT_TOPICS).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Level */}
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); setError(null); }}
            disabled={loading}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50"
          >
            <option value="">Select Level</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>

          {/* Topic */}
          <select
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(null); }}
            disabled={loading || !subject}
            className="border-2 border-[#21262d] bg-[#0d1117] text-[#e6edf3] p-3 rounded-md focus:border-[#2ea043] outline-none disabled:opacity-50 lg:col-span-2"
          >
            <option value="">{subject ? "Select Topic" : "Select a subject first"}</option>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>

        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: '#3d1f1f', border: '1px solid #f85149', color: '#f85149' }}>
            {error}
          </div>
        )}

        <button
          onClick={generateQuiz}
          disabled={loading}
          className="bg-[#2ea043] text-white px-6 py-3 rounded-lg hover:bg-[#238636] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "⏳ Generating..." : "🤖 Generate Quiz"}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="text-[#8b949e] text-sm">Generating your quiz, please wait...</div>
          <div className="mt-3 w-8 h-8 border-2 border-[#2ea043] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Questions */}
      {!loading && questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-[#8b949e]">
              {quizMeta?.subject} · {quizMeta?.level} · {quizMeta?.topic}
            </div>
            <div className="text-sm text-[#8b949e]">
              {Object.keys(answers).length} / {questions.length} answered
            </div>
          </div>

          {questions.map((q, i) => (
            <div key={i} className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
              <p className="font-semibold mb-4 text-lg text-[#e6edf3]">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-3">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    onClick={() => handleSelect(i, j)}
                    className={`flex items-center gap-3 cursor-pointer p-3 rounded-md border transition ${getOptionStyle(i, j)}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[i] === j ? 'border-[#2ea043] bg-[#2ea043]' : 'border-[#6e7681]'
                    }`}>
                      {answers[i] === j && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span className="text-[#e6edf3]">{opt}</span>
                    {score !== null && (
                      <span className="ml-auto">
                        {questions[i].correct === j ? '✅' : answers[i] === j ? '❌' : ''}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex gap-3 justify-center mt-6">
            {score === null ? (
              <button onClick={submitQuiz}
                className="bg-[#1f6feb] text-white px-8 py-3 rounded-lg hover:bg-[#388bfd] font-semibold">
                Submit Quiz
              </button>
            ) : (
              <button onClick={resetQuiz}
                className="bg-[#2ea043] text-white px-8 py-3 rounded-lg hover:bg-[#238636] font-semibold">
                🔄 New Quiz
              </button>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {score !== null && quizMeta && (
        <div className="mt-8 bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-[#2ea043] mb-2">Quiz Complete! 🎉</div>
            <div className="text-xl text-[#e6edf3]">
              Score: <span className="font-semibold text-[#2ea043]">{score}</span> / {questions.length}
              <span className="text-sm text-[#6e7681] ml-2">
                ({Math.round((score / questions.length) * 100)}%)
              </span>
            </div>
            <div className="text-sm text-[#6e7681] mt-2">
              {score === questions.length ? "Perfect! Excellent work!" :
               score >= questions.length * 0.7 ? "Great job! Keep it up!" :
               "Good effort! Try again to improve your score."}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-[#0d1117] p-3 rounded">
              <div className="text-sm text-[#6e7681]">Subject</div>
              <div className="font-semibold">{quizMeta.subject}</div>
            </div>
            <div className="bg-[#0d1117] p-3 rounded">
              <div className="text-sm text-[#6e7681]">Level</div>
              <div className="font-semibold">{quizMeta.level}</div>
            </div>
            <div className="bg-[#0d1117] p-3 rounded">
              <div className="text-sm text-[#6e7681]">Topic</div>
              <div className="font-semibold">{quizMeta.topic}</div>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#e6edf3] mb-4">Recent Quiz History</h2>
          <div className="space-y-3">
            {history.map((quiz) => (
              <div key={quiz.id} className="bg-[#161b22] border border-[#21262d] p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{quiz.subject} — {quiz.topic}</div>
                    <div className="text-sm text-[#6e7681]">{quiz.level} · {quiz.total} questions</div>
                    <div className="text-xs text-[#6e7681] mt-1">
                      {new Date(quiz.completedAt).toLocaleDateString()} at {new Date(quiz.completedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[#2ea043]">{quiz.score}/{quiz.total}</div>
                    <div className="text-sm text-[#6e7681]">{quiz.percentage}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;