import React, { useState, useMemo } from "react";
import {
  Home, BookOpen, FileText, Map, Users, MessageSquare, Lightbulb,
  BarChart2, Settings, Search, Bell, ChevronLeft, ChevronRight, Plus,
  Pencil, Flame, Target, Clock, Star, ArrowRight, Check, X, Trash2,
  StickyNote, CalendarDays, AlertTriangle, ChevronDown
} from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";

/* ---------------------------------------------------------------
   MASCOT — reusable purple monster, the signature visual element
---------------------------------------------------------------- */
function Mascot({ size = 64, mood = "happy", className = "" }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="50" cy="58" rx="34" ry="30" fill="#7C4DFF" />
      <path d="M28 32 L34 14 L40 30 Z" fill="#5B21B6" />
      <path d="M72 32 L66 14 L60 30 Z" fill="#5B21B6" />
      <circle cx="38" cy="56" r="9" fill="white" />
      <circle cx="62" cy="56" r="9" fill="white" />
      <circle cx="39" cy="57" r="4.5" fill="#1F1147" />
      <circle cx="63" cy="57" r="4.5" fill="#1F1147" />
      {mood === "happy" ? (
        <path d="M38 74 Q50 84 62 74" stroke="#1F1147" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx="50" cy="76" rx="7" ry="5" fill="#1F1147" />
      )}
      <circle cx="30" cy="70" r="4" fill="#B794F6" opacity="0.7" />
      <circle cx="70" cy="70" r="4" fill="#B794F6" opacity="0.7" />
    </svg>
  );
}

/* ---------------------------------------------------------------
   INITIAL DATA
---------------------------------------------------------------- */
const initialNovels = [
  {
    id: "n1", title: "Madona", genre: "Romance • Thriller",
    coverFrom: "#3B1F6B", coverTo: "#0F0620",
    chapters: 12, totalChapters: 30, words: 42500, targetWords: 80000,
    nextTarget: "Selesaikan Chapter 13",
    nextNote: "Konflik utama dan motif karakter diperjelas.",
  },
  {
    id: "n2", title: "The Last Winter", genre: "Drama • Romantis",
    coverFrom: "#1E3A5F", coverTo: "#0A1526",
    chapters: 8, totalChapters: 25, words: 21000, targetWords: 65000,
    nextTarget: "Selesaikan Chapter 9",
    nextNote: "Perjelas latar musim dingin dan konflik batin tokoh utama.",
  },
  {
    id: "n3", title: "Beneath The Lies", genre: "Mystery • Thriller",
    coverFrom: "#4B1E2F", coverTo: "#1A0A10",
    chapters: 5, totalChapters: 20, words: 12500, targetWords: 55000,
    nextTarget: "Selesaikan Chapter 6",
    nextNote: "Tambahkan petunjuk (clue) baru sebelum plot twist.",
  },
];

const initialChapters = [
  { id: "c1", novelId: "n1", number: 13, title: "Judul Chapter", words: 1245, status: "draft", target: 2000,
    content: "Konflik semakin memuncak ketika Madona mengetahui kebenaran yang disembunyikan oleh Junghwan.\n\nIa tidak tahu harus percaya atau tidak, tetapi satu hal yang pasti, semuanya tidak akan pernah sama lagi..." },
  { id: "c2", novelId: "n1", number: 12, title: "Bayangan di Balik Pintu", words: 3200, status: "done", target: 3000, content: "Junghwan berdiri di ambang pintu, ragu untuk melangkah masuk." },
  { id: "c3", novelId: "n1", number: 11, title: "Janji yang Terlupakan", words: 3600, status: "done", target: 3000, content: "" },
  { id: "c4", novelId: "n1", number: 10, title: "Hujan Pertama", words: 2950, status: "done", target: 3000, content: "" },
  { id: "c5", novelId: "n1", number: 9, title: "Kota Lama", words: 2800, status: "done", target: 3000, content: "" },
  { id: "c6", novelId: "n1", number: 8, title: "Percakapan Tengah Malam", words: 3100, status: "done", target: 3000, content: "" },
  { id: "c7", novelId: "n1", number: 7, title: "Rahasia Keluarga", words: 2900, status: "done", target: 3000, content: "" },
  { id: "c8", novelId: "n1", number: 6, title: "Pertemuan Tak Terduga", words: 3050, status: "done", target: 3000, content: "" },
  { id: "c9", novelId: "n1", number: 5, title: "Jejak Masa Lalu", words: 2700, status: "done", target: 3000, content: "" },
  { id: "c10", novelId: "n1", number: 4, title: "Surat Tanpa Nama", words: 3300, status: "done", target: 3000, content: "" },
  { id: "c11", novelId: "n1", number: 3, title: "Kabut Pagi", words: 2600, status: "done", target: 3000, content: "" },
  { id: "c12", novelId: "n1", number: 2, title: "Awal yang Kelam", words: 3000, status: "done", target: 3000, content: "" },
  { id: "c13", novelId: "n1", number: 1, title: "Pembukaan", words: 2500, status: "done", target: 3000, content: "" },
  { id: "c14", novelId: "n2", number: 8, title: "Salju Turun Lagi", words: 2700, status: "review", target: 3000, content: "" },
  { id: "c15", novelId: "n2", number: 7, title: "Surat yang Tak Terkirim", words: 3100, status: "done", target: 3000, content: "" },
  { id: "c16", novelId: "n3", number: 5, title: "Jejak Kaki di Lorong", words: 2400, status: "draft", target: 3000, content: "" },
];

const initialCharacters = [
  { id: "ch1", novelId: "n1", name: "Junghwan", role: "Main Character", desc: "Detektif dengan masa lalu kelam, motif utama cerita.",
    usia: "25", kepribadian: "Dingin, protektif, cerdas", latar: "Tumbuh di panti asuhan sejak usia 8 tahun.",
    relationship: "Mantan rekan kerja Madona; menyimpan rasa bersalah atas kasus lama.",
    arc: "Dari sinis dan tertutup menjadi berani menghadapi masa lalunya.",
    notes: "Selalu membawa jam saku peninggalan ayahnya." },
  { id: "ch2", novelId: "n1", name: "Madona", role: "Main Character", desc: "Wanita misterius yang menyimpan rahasia keluarga.",
    usia: "27", kepribadian: "Tenang, penuh perhitungan, sulit dipercaya", latar: "Anak sulung dari keluarga konglomerat yang bangkrut.",
    relationship: "Terikat masa lalu dengan Junghwan lewat sebuah kasus.",
    arc: "Belajar mempercayai orang lain setelah bertahun-tahun sendirian.",
    notes: "Selalu memakai kalung peninggalan ibunya." },
  { id: "ch3", novelId: "n2", name: "Sora", role: "Main Character", desc: "Penulis muda yang kembali ke kota kelahirannya saat musim dingin.",
    usia: "24", kepribadian: "Hangat namun ragu-ragu", latar: "Meninggalkan kota kecilnya 10 tahun lalu.",
    relationship: "Bertemu kembali dengan cinta masa kecilnya.", arc: "Menemukan keberanian untuk pulang.", notes: "" },
];

const initialIdeas = [
  { id: "i1", novelId: "n1", category: "Plot Twist", title: "Ide plot twist untuk bagian tengah cerita", desc: "Madona sebenarnya mengetahui Junghwan sejak awal, tapi ia memilih diam.", time: "16 Agustus 2026" },
  { id: "i2", novelId: "n1", category: "Dialog", title: "Dialog emosional antara Junghwan & Madona", desc: "\"Aku bukan pria baik-baik saja. Tapi aku akan berusaha menjadi lebih baik... untukmu.\"", time: "15 Agustus 2026" },
  { id: "i3", novelId: "n1", category: "Scene", title: "Adegan hujan di atap gedung tua", desc: "Momen katarsis emosional sebelum konflik memuncak.", time: "2 hari lalu" },
  { id: "i4", novelId: "n1", category: "Karakter", title: "Ide karakter sampingan yang menarik", desc: "Detektif senior yang skeptis pada teori Junghwan.", time: "3 hari lalu" },
];

const initialConsultations = [
  { id: "k1", novelId: "n1", chapter: 12, title: "Perbaiki motivasi karakter", note: "Konflik terlalu cepat selesai. Perlu ketegangan dan transisi yang lebih kuat.", status: "urgent", time: "16/08/26" },
  { id: "k2", novelId: "n1", chapter: 8, title: "Dialog terlalu panjang", note: "Persingkat dialog agar ritme baca lebih cepat dan natural.", status: "revisi", time: "15/08/26" },
  { id: "k3", novelId: "n1", chapter: 1, title: "Opening terlalu cepat", note: "Bagian pembuka sudah bagus dan sudah diperbaiki sesuai masukan.", status: "selesai", time: "14/08/26" },
  { id: "k4", novelId: "n1", chapter: 5, title: "Tambahkan konflik batin tokoh", note: "Perlu porsi lebih untuk menunjukkan pergolakan batin karakter utama.", status: "info", time: "13/08/26" },
  { id: "k5", novelId: "n2", chapter: 8, title: "Tambahkan deskripsi latar", note: "Suasana musim dingin bisa digali lebih dalam agar lebih imersif.", status: "urgent", time: "1 hari lalu" },
];

const initialReminders = [
  { id: "r1", text: "Selesaikan Chapter 13", deadline: "25 Mei 2026", done: false },
  { id: "r2", text: "Revisi Chapter 10", deadline: "28 Mei 2026", done: false },
  { id: "r3", text: "Konsultasi Alur Ending", deadline: "1 Jun 2026", done: false },
];

const plotPoints = [
  { id: "p1", novelId: "n1", type: "Konflik", act: "Act 1", text: "Madona & Junghwan bertemu kembali secara tak terduga." },
  { id: "p2", novelId: "n1", type: "Plot", act: "Act 1", text: "Kehidupan mereka sebelum konflik dimulai." },
  { id: "p3", novelId: "n1", type: "Konflik", act: "Act 2", text: "Rahasia mulai terungkap sedikit demi sedikit." },
  { id: "p4", novelId: "n1", type: "Motif", act: "Act 2", text: "Hubungan mereka retak, pilihan sulit harus diambil." },
  { id: "p5", novelId: "n1", type: "Plot", act: "Act 3", text: "Konfrontasi terakhir antara Junghwan dan masa lalunya." },
  { id: "p6", novelId: "n1", type: "Motif", act: "Act 3", text: "Kebenaran akhirnya terungkap sepenuhnya." },
];

const CONSULT_STATUS = {
  urgent: { label: "Urgent", tone: "red" },
  revisi: { label: "Revisi", tone: "orange" },
  selesai: { label: "Selesai", tone: "green" },
  info: { label: "Info", tone: "gray" },
};
const CONSULT_CYCLE = ["urgent", "revisi", "selesai", "info"];

const NAV_ITEMS = [
  { key: "beranda", label: "Beranda", icon: Home },
  { key: "novelku", label: "Novelku", icon: BookOpen },
  { key: "chapters", label: "Chapter Manager", icon: FileText },
  { key: "planner", label: "Story Planner", icon: Map },
  { key: "characters", label: "Character Database", icon: Users },
  { key: "consult", label: "Catatan Konsultasi", icon: MessageSquare },
  { key: "ideas", label: "Idea Vault", icon: Lightbulb },
  { key: "progress", label: "Writing Progress", icon: BarChart2 },
  { key: "settings", label: "Pengaturan", icon: Settings },
];

const CATEGORY_COLORS = {
  "Plot Twist": "#F59E0B",
  "Dialog": "#3B82F6",
  "Scene": "#EF4444",
  "Karakter": "#8B5CF6",
};

/* ---------------------------------------------------------------
   SMALL UI PRIMITIVES
---------------------------------------------------------------- */
function Card({ children, className = "", style = {}, onClick }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 18,
        border: "1px solid #ECE8F8",
        boxShadow: "0 1px 3px rgba(31,17,71,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ value, color = "#7C4DFF", trackColor = "#EDE9FB", height = 8 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: 99, background: trackColor, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          borderRadius: 99,
          background: color,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}

function Pill({ children, tone = "violet" }) {
  const tones = {
    violet: { bg: "#F1EBFF", color: "#6D28D9" },
    green: { bg: "#E9F9EC", color: "#1F9D4A" },
    orange: { bg: "#FFF3E0", color: "#B7791F" },
    gray: { bg: "#F1F1F5", color: "#6B7280" },
    red: { bg: "#FDECEC", color: "#DC2626" },
  };
  const t = tones[tone] || tones.violet;
  return (
    <span style={{
      background: t.bg, color: t.color, fontSize: 12, fontWeight: 600,
      padding: "4px 10px", borderRadius: 99, display: "inline-block",
    }}>
      {children}
    </span>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, fontSize: 16, color: "#1F1147", margin: 0 }}>
        {title}
      </h3>
      {action && (
        <button onClick={onAction} style={{
          background: "none", border: "none", color: "#7C4DFF", fontWeight: 600,
          fontSize: 13, cursor: "pointer",
        }}>
          {action}
        </button>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "32px 12px", color: "#9691B0" }}>
      <Mascot size={56} mood="neutral" />
      <p style={{ margin: 0, fontSize: 13, textAlign: "center" }}>{text}</p>
    </div>
  );
}

function NovelCover({ novel, w = 110, h = 150 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 12, flexShrink: 0,
      background: `linear-gradient(160deg, ${novel.coverFrom}, ${novel.coverTo})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      boxShadow: "0 6px 16px rgba(31,17,71,0.25)",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 60%)" }} />
      <span style={{
        fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#fff",
        fontSize: w < 90 ? 12 : 17, textAlign: "center", padding: "0 8px",
        letterSpacing: 1, textTransform: "uppercase",
      }}>
        {novel.title}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------
   APP
---------------------------------------------------------------- */
export default function App() {
  const [activeTab, setActiveTab] = useState("beranda");
  const [novels, setNovels] = useState(initialNovels);
  const [activeNovelId, setActiveNovelId] = useState(initialNovels[0].id);
  const [chapters, setChapters] = useState(initialChapters);
  const [characters, setCharacters] = useState(initialCharacters);
  const [ideas, setIdeas] = useState(initialIdeas);
  const [consultations, setConsultations] = useState(initialConsultations);
  const [reminders, setReminders] = useState(initialReminders);
  const [plots, setPlots] = useState(plotPoints);
  const [quickNote, setQuickNote] = useState(
    "Jangan lupa perkuat motif Junghwan di Chapter 13.\n\nCari referensi tentang psikologi trauma.\n\nDan... tetap semangat! 💜"
  );
  const [showNotif, setShowNotif] = useState(false);
  const [search, setSearch] = useState("");
  const [workspace, setWorkspace] = useState({ novelId: null, section: "overview", editingChapterId: null });

  const activeNovel = novels.find(n => n.id === activeNovelId) || novels[0];

  function openWorkspace(novelId, section = "overview") {
    setActiveNovelId(novelId);
    setWorkspace({ novelId, section, editingChapterId: null });
    setActiveTab("workspace");
  }

  function saveChapterContent(chapterId, content) {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;
    const diff = words - chapter.words;
    setChapters(chapters.map(c => c.id === chapterId ? { ...c, content, words } : c));
    setNovels(novels.map(n => n.id === chapter.novelId ? { ...n, words: Math.max(0, n.words + diff) } : n));
  }

  function cycleConsultStatus(id) {
    setConsultations(consultations.map(c => {
      if (c.id !== id) return c;
      const idx = CONSULT_CYCLE.indexOf(c.status);
      return { ...c, status: CONSULT_CYCLE[(idx + 1) % CONSULT_CYCLE.length] };
    }));
  }

  const totalWords = novels.reduce((s, n) => s + n.words, 0);
  const totalTarget = novels.reduce((s, n) => s + n.targetWords, 0);
  const overallPct = Math.round((totalWords / totalTarget) * 100);

  function addNovel(title, genre) {
    const id = "n" + (novels.length + 1) + "_" + Date.now();
    const palette = [["#3B1F6B", "#0F0620"], ["#1E3A5F", "#0A1526"], ["#4B1E2F", "#1A0A10"], ["#1F4B3F", "#0A1A14"]];
    const [from, to] = palette[novels.length % palette.length];
    setNovels([...novels, {
      id, title, genre: genre || "Genre Baru",
      coverFrom: from, coverTo: to,
      chapters: 0, totalChapters: 20, words: 0, targetWords: 60000,
      nextTarget: "Mulai Chapter 1", nextNote: "Tentukan pembukaan cerita.",
    }]);
    setActiveNovelId(id);
  }

  function addIdea(category, title, desc, novelId) {
    setIdeas([{ id: "idea_" + Date.now(), novelId, category, title, desc, time: "Baru saja" }, ...ideas]);
  }

  function addReminder(text, deadline) {
    setReminders([...reminders, { id: "rem_" + Date.now(), text, deadline: deadline || "Belum ditentukan", done: false }]);
  }

  function toggleReminder(id) {
    setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  }

  function addChapter(novelId, title) {
    const novelChaps = chapters.filter(c => c.novelId === novelId);
    const nextNum = novelChaps.length ? Math.max(...novelChaps.map(c => c.number)) + 1 : 1;
    setChapters([{ id: "chap_" + Date.now(), novelId, number: nextNum, title: title || `Chapter ${nextNum}`, words: 0, status: "draft" }, ...chapters]);
    setNovels(novels.map(n => n.id === novelId ? { ...n, chapters: n.chapters + 1 } : n));
  }

  function markChapterDone(id) {
    setChapters(chapters.map(c => c.id === id ? { ...c, status: c.status === "done" ? "draft" : "done" } : c));
  }

  function addCharacter(novelId, name, role, desc) {
    setCharacters([...characters, { id: "char_" + Date.now(), novelId, name, role: role || "Karakter Pendukung", desc: desc || "" }]);
  }

  function addPlot(novelId, type, text, act) {
    setPlots([...plots, { id: "plot_" + Date.now(), novelId, type, act: act || "Act 1", text }]);
  }

  return (
    <div style={{
      fontFamily: "Inter, sans-serif", display: "flex", minHeight: "100vh",
      background: "#F6F4FC", color: "#1F1147",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        input, textarea, select { font-family: inherit; outline: none; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: #D9D2F0; border-radius: 8px; }
        .nc-navbtn:hover { background: rgba(255,255,255,0.08) !important; }
        .nc-clickable { cursor: pointer; transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .nc-clickable:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(31,17,71,0.08); }
      `}</style>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar
          search={search} setSearch={setSearch}
          reminders={reminders} showNotif={showNotif} setShowNotif={setShowNotif}
          toggleReminder={toggleReminder}
        />

        <div style={{ padding: "24px 28px 60px", flex: 1, overflowY: "auto" }}>
          {activeTab === "beranda" && (
            <Beranda
              novels={novels} activeNovel={activeNovel} setActiveNovelId={setActiveNovelId}
              setActiveTab={setActiveTab} totalWords={totalWords} totalTarget={totalTarget}
              overallPct={overallPct} consultations={consultations} cycleConsultStatus={cycleConsultStatus}
              ideas={ideas} quickNote={quickNote} setQuickNote={setQuickNote}
              reminders={reminders} toggleReminder={toggleReminder} addReminder={addReminder}
              addNovel={addNovel} openWorkspace={openWorkspace}
            />
          )}
          {activeTab === "novelku" && (
            <NovelkuPage novels={novels} openWorkspace={openWorkspace} addNovel={addNovel} />
          )}
          {activeTab === "workspace" && workspace.novelId && (
            <WorkspaceNovel
              novel={novels.find(n => n.id === workspace.novelId)}
              novels={novels} setNovels={setNovels}
              workspace={workspace} setWorkspace={setWorkspace}
              chapters={chapters} addChapter={addChapter} markChapterDone={markChapterDone}
              saveChapterContent={saveChapterContent}
              characters={characters} addCharacter={addCharacter}
              plots={plots} addPlot={addPlot}
              ideas={ideas} addIdea={addIdea}
              consultations={consultations} cycleConsultStatus={cycleConsultStatus}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "chapters" && (
            <ChapterManagerPage
              novels={novels} activeNovelId={activeNovelId} setActiveNovelId={setActiveNovelId}
              chapters={chapters} addChapter={addChapter} markChapterDone={markChapterDone}
              openWorkspace={openWorkspace}
            />
          )}
          {activeTab === "planner" && (
            <StoryPlannerPage novels={novels} activeNovelId={activeNovelId} setActiveNovelId={setActiveNovelId} plots={plots} addPlot={addPlot} />
          )}
          {activeTab === "characters" && (
            <CharacterPage novels={novels} activeNovelId={activeNovelId} setActiveNovelId={setActiveNovelId} characters={characters} addCharacter={addCharacter} />
          )}
          {activeTab === "consult" && (
            <ConsultPage novels={novels} consultations={consultations} cycleConsultStatus={cycleConsultStatus} />
          )}
          {activeTab === "ideas" && (
            <IdeaVaultPage ideas={ideas} addIdea={addIdea} novels={novels} />
          )}
          {activeTab === "progress" && (
            <ProgressPage novels={novels} chapters={chapters} />
          )}
          {activeTab === "settings" && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SIDEBAR
---------------------------------------------------------------- */
function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div style={{
      width: 250, background: "linear-gradient(180deg,#2A1B5C,#1B1140)", flexShrink: 0,
      display: "flex", flexDirection: "column", padding: "24px 16px", color: "#fff",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 4px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins,sans-serif", fontWeight: 700,
        }}>N</div>
        <div>
          <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1.1 }}>NOVEL<br />CONSULT</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#A99CD9", padding: "10px 8px 20px" }}>Workspace Pribadiku</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.key || (activeTab === "workspace" && item.key === "novelku");
          return (
            <button
              key={item.key}
              className="nc-navbtn"
              onClick={() => setActiveTab(item.key)}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                background: active ? "#fff" : "transparent",
                color: active ? "#5B21B6" : "#D7CFEF",
                fontWeight: active ? 600 : 500, fontSize: 13.5,
              }}
            >
              <Icon size={17} /> {item.label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "auto", paddingTop: 20 }}>
        <div style={{
          background: "#4ADE80", color: "#0B3B1E", fontSize: 12, fontWeight: 600,
          padding: "8px 12px", borderRadius: 14, borderBottomLeftRadius: 4, marginBottom: 10,
          display: "inline-block",
        }}>
          Teruslah menulis, ceritamu luar biasa!
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}>
          <Mascot size={100} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: 10, marginTop: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#7C4DFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13 }}>N</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Nazari</div>
            <div style={{ fontSize: 11, color: "#A99CD9" }}>Penulis • Dreamer</div>
          </div>
          <ChevronDown size={14} color="#A99CD9" />
        </div>
        <button style={{
          width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
          background: "transparent", color: "#fff", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
        }}>
          Lihat Profil
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   TOP BAR
---------------------------------------------------------------- */
function TopBar({ search, setSearch, reminders, showNotif, setShowNotif, toggleReminder }) {
  const pending = reminders.filter(r => !r.done).length;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 28px", background: "#F6F4FC", position: "sticky", top: 0, zIndex: 20,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 12,
        padding: "10px 14px", width: 340, border: "1px solid #ECE8F8",
      }}>
        <Search size={16} color="#9691B0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari di Novel Consult..."
          style={{ border: "none", background: "transparent", fontSize: 13.5, width: "100%", color: "#1F1147" }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
        <button onClick={() => setShowNotif(!showNotif)} style={{
          position: "relative", background: "#fff", border: "1px solid #ECE8F8", width: 40, height: 40,
          borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Bell size={17} color="#4B3A7A" />
          {pending > 0 && (
            <span style={{
              position: "absolute", top: -4, right: -4, background: "#EF4444", color: "#fff",
              fontSize: 10, fontWeight: 700, borderRadius: 99, width: 17, height: 17,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{pending}</span>
          )}
        </button>
        {showNotif && (
          <Card style={{ position: "absolute", top: 48, right: 90, width: 280, padding: 14, zIndex: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Pengingat</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
              {reminders.map(r => (
                <div key={r.id} onClick={() => toggleReminder(r.id)} style={{
                  display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer",
                  padding: 6, borderRadius: 8,
                }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 5, border: "2px solid #7C4DFF", marginTop: 2,
                    background: r.done ? "#7C4DFF" : "transparent", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {r.done && <Check size={11} color="#fff" />}
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, textDecoration: r.done ? "line-through" : "none", color: r.done ? "#9691B0" : "#1F1147" }}>{r.text}</div>
                    <div style={{ fontSize: 11, color: "#9691B0" }}>Batas: {r.deadline}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        <div style={{
          width: 40, height: 40, borderRadius: "50%", background: "#7C4DFF",
          display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700,
        }}>
          <Mascot size={30} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   BERANDA
---------------------------------------------------------------- */
function Beranda({
  novels, activeNovel, setActiveNovelId, setActiveTab, totalWords, totalTarget, overallPct,
  consultations, cycleConsultStatus, ideas, quickNote, setQuickNote, reminders, toggleReminder,
  addReminder, addNovel, openWorkspace,
}) {
  const [newReminderText, setNewReminderText] = useState("");
  const [month, setMonth] = useState(4); // Mei = index 4 (0=Jan)
  const latestConsult = consultations[0];
  const chapterPct = Math.round((activeNovel.chapters / activeNovel.totalChapters) * 100);
  const wordPct = Math.round((activeNovel.words / activeNovel.targetWords) * 100);

  const quickAccessItems = [
    { section: "chapter", icon: Pencil, title: "Tulis Novel", sub: "Mulai menulis chapter baru", color: "#7C4DFF" },
    { section: "planner", icon: Map, title: "Story Planner", sub: "Atur alur, konflik, dan plot cerita", color: "#3B82F6" },
    { section: "characters", icon: Users, title: "Character Database", sub: "Kelola karakter dan hubungan mereka", color: "#7C4DFF" },
    { section: "chapter", icon: FileText, title: "Chapter Manager", sub: "Kelola semua chapter novelmu", color: "#3B82F6" },
    { section: "consult", icon: MessageSquare, title: "Catatan Konsultasi", sub: "Lihat semua masukan dan revisi", color: "#22C55E" },
    { section: "ideas", icon: Lightbulb, title: "Idea Vault", sub: "Simpan semua ide cemerlangmu", color: "#F59E0B" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        {/* Hero */}
        <Card style={{
          padding: 28, background: "linear-gradient(120deg,#EDE7FB,#F6F4FC)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ maxWidth: 380, position: "relative", zIndex: 2 }}>
            <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: 26, margin: "0 0 6px", color: "#1F1147" }}>Halo, Nazari! 👋</h2>
            <p style={{ margin: "0 0 16px", color: "#5B4E7D", fontSize: 14 }}>Mari kembangkan ceritamu hari ini.</p>
            <div style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", fontSize: 13, color: "#4B3A7A", boxShadow: "0 4px 14px rgba(31,17,71,0.08)" }}>
              "Setiap kata yang kamu tulis adalah langkah menuju novel yang luar biasa." 💜
            </div>
          </div>
          <div style={{ position: "absolute", right: 20, bottom: -10 }}>
            <Mascot size={140} />
          </div>
        </Card>

        {/* Novel Aktif */}
        <Card style={{ padding: 22 }}>
          <SectionHeader title="Novel Aktif" action="Lihat Semua Novel" onAction={() => setActiveTab("novelku")} />
          <div style={{ display: "flex", gap: 18 }}>
            <NovelCover novel={activeNovel} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <select
                    value={activeNovel.id}
                    onChange={e => setActiveNovelId(e.target.value)}
                    style={{
                      fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 18, border: "none",
                      background: "transparent", color: "#1F1147", cursor: "pointer", marginBottom: 2,
                    }}
                  >
                    {novels.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
                  </select>
                  <div style={{ fontSize: 12.5, color: "#9691B0" }}>{activeNovel.genre}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 18, margin: "14px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4B3A7A" }}>
                  <BookOpen size={14} color="#7C4DFF" /> {activeNovel.chapters} / {activeNovel.totalChapters} Chapter
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#4B3A7A" }}>
                  <Clock size={14} color="#7C4DFF" /> {activeNovel.words.toLocaleString("id-ID")} / {activeNovel.targetWords.toLocaleString("id-ID")} kata
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}><ProgressBar value={wordPct} /></div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#7C4DFF" }}>{wordPct}%</span>
              </div>
            </div>
            <div style={{ width: 220, background: "#F1EBFF", borderRadius: 14, padding: 16, flexShrink: 0 }}>
              <div style={{ fontSize: 11, color: "#7C4DFF", fontWeight: 700, marginBottom: 4 }}>TARGET BERIKUTNYA</div>
              <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4 }}>{activeNovel.nextTarget}</div>
              <div style={{ fontSize: 12, color: "#5B4E7D", marginBottom: 12 }}>{activeNovel.nextNote}</div>
              <button
                onClick={() => openWorkspace(activeNovel.id, "chapter")}
                style={{
                  width: "100%", background: "#5B21B6", color: "#fff", border: "none", borderRadius: 10,
                  padding: "9px 0", fontWeight: 600, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                Lanjut Menulis <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Access */}
        <Card style={{ padding: 22 }}>
          <SectionHeader title="Quick Access" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {quickAccessItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="nc-clickable"
                  onClick={() => openWorkspace(activeNovel.id, item.section)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, border: "1px solid #ECE8F8",
                    borderRadius: 12, padding: "12px 14px",
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, background: item.color + "22",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={16} color={item.color} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: "#9691B0" }}>{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Daftar Novelku + Idea Vault */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <Card style={{ padding: 22 }}>
            <SectionHeader title="Daftar Novelku" action="Lihat Semua" onAction={() => setActiveTab("novelku")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {novels.map(n => {
                const pct = Math.round((n.chapters / n.totalChapters) * 100);
                return (
                  <div key={n.id} className="nc-clickable" onClick={() => openWorkspace(n.id, "chapter")} style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, borderRadius: 10 }}>
                    <NovelCover novel={n} w={46} h={62} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{n.title}</div>
                      <div style={{ fontSize: 11.5, color: "#9691B0", marginBottom: 6 }}>{n.genre}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1 }}><ProgressBar value={pct} height={6} /></div>
                        <span style={{ fontSize: 11, color: "#9691B0" }}>{n.chapters} / {n.totalChapters} Chapter</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#7C4DFF" }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
            <AddNovelInline addNovel={addNovel} />
          </Card>

          <Card style={{ padding: 22 }}>
            <SectionHeader title="Idea Vault Terbaru" action="Lihat Semua" onAction={() => setActiveTab("ideas")} />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {ideas.slice(0, 4).map(idea => (
                <div key={idea.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLORS[idea.category] || "#7C4DFF", marginTop: 6, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{idea.category}</span>
                      <span style={{ fontSize: 11, color: "#9691B0", whiteSpace: "nowrap" }}>{idea.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#5B4E7D" }}>{idea.title}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setActiveTab("ideas")}
              style={{
                marginTop: 16, width: "100%", background: "#22C55E", color: "#fff", border: "none",
                borderRadius: 10, padding: "9px 0", fontWeight: 600, fontSize: 13, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <Plus size={14} /> Tambah Ide Baru
            </button>
          </Card>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        <Card style={{ padding: 20 }}>
          <SectionHeader title="Ringkasan Hari Ini" action="Lihat Semua" onAction={() => setActiveTab("progress")} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <StatMini icon={Pencil} label="Kata ditulis Hari ini" value="1.250" />
            <StatMini icon={Clock} label="Menit menulis Fokus" value="45" />
            <StatMini icon={Target} label="Chapter Bulan ini" value={`${activeNovel.chapters}/${activeNovel.totalChapters}`} />
            <StatMini icon={Star} label="Target Bulan Ini" value={`${overallPct}%`} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9691B0", marginBottom: 6 }}>
            <span>Target Kata Bulan Ini</span>
            <span>{Math.round(totalWords / 1000)}00 / {Math.round(totalTarget / 1000)}00 kata</span>
          </div>
          <ProgressBar value={(totalWords / totalTarget) * 100} color="#22C55E" />
        </Card>

        <Card style={{ padding: 20 }}>
          <SectionHeader title="Konsultasi Terakhir" action="Lihat Semua" onAction={() => setActiveTab("consult")} />
          {latestConsult ? (
            <div>
              <div style={{ fontSize: 12, color: "#9691B0", marginBottom: 8 }}>Chapter {latestConsult.chapter}</div>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>{latestConsult.title}</div>
                  <div style={{ fontSize: 12, color: "#6B6485" }}>{latestConsult.note}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <Pill tone={CONSULT_STATUS[latestConsult.status].tone}>{CONSULT_STATUS[latestConsult.status].label}</Pill>
                <button onClick={() => openWorkspace(latestConsult.novelId, "consult")} style={{
                  display: "flex", alignItems: "center", gap: 6, background: "none",
                  border: "1px solid #ECE8F8", borderRadius: 9, padding: "7px 12px",
                  fontSize: 12, fontWeight: 600, color: "#4B3A7A", cursor: "pointer",
                }}>
                  <Pencil size={12} /> Buka Catatan
                </button>
              </div>
            </div>
          ) : <EmptyState text="Belum ada konsultasi." />}
        </Card>

        <Card style={{ padding: 20 }}>
          <SectionHeader title="Writing Progress" action="Lihat Detail" onAction={() => setActiveTab("progress")} />
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <DonutMini pct={overallPct} />
            <div>
              <div style={{ fontSize: 11, color: "#7C4DFF", fontWeight: 700 }}>TOTAL NOVEL</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{totalWords.toLocaleString("id-ID")} / {totalTarget.toLocaleString("id-ID")} kata</div>
              <div style={{ fontSize: 12, color: "#9691B0" }}>{novels.reduce((s, n) => s + n.chapters, 0)} / {novels.reduce((s, n) => s + n.totalChapters, 0)} Chapter</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
            <MiniStatBox icon={Flame} color="#F59E0B" label="Streak Menulis" value="7 hari" />
            <MiniStatBox icon={FileText} color="#22C55E" label="Chapter Bulan Ini" value={`${activeNovel.chapters}/${activeNovel.totalChapters > 12 ? 5 : activeNovel.totalChapters}`} />
            <MiniStatBox icon={Pencil} color="#7C4DFF" label="Revisi Bulan Ini" value="3/4" />
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: 15, margin: 0 }}>Kalender Menulis</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setMonth(m => (m + 11) % 12)} style={{ background: "#F6F4FC", border: "none", borderRadius: 8, width: 24, height: 24, cursor: "pointer" }}><ChevronLeft size={13} /></button>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][month]} 2026</span>
              <button onClick={() => setMonth(m => (m + 1) % 12)} style={{ background: "#F6F4FC", border: "none", borderRadius: 8, width: 24, height: 24, cursor: "pointer" }}><ChevronRight size={13} /></button>
            </div>
          </div>
          <MiniCalendar month={month} />
        </Card>

        <Card style={{ padding: 20 }}>
          <SectionHeader title="Catatan Cepat" />
          <div style={{ background: "#FFF6D6", borderRadius: 12, padding: 14, position: "relative" }}>
            <StickyNote size={14} color="#B7791F" style={{ position: "absolute", top: 12, right: 12 }} />
            <textarea
              value={quickNote}
              onChange={e => setQuickNote(e.target.value)}
              style={{
                width: "100%", minHeight: 90, border: "none", background: "transparent",
                fontSize: 12.5, color: "#5B4E7D", resize: "vertical", lineHeight: 1.6,
              }}
            />
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <SectionHeader title="Pengingat" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            {reminders.map(r => (
              <div key={r.id} onClick={() => toggleReminder(r.id)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 5, border: "2px solid #7C4DFF", flexShrink: 0,
                  background: r.done ? "#7C4DFF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {r.done && <Check size={11} color="#fff" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, textDecoration: r.done ? "line-through" : "none", color: r.done ? "#9691B0" : "#1F1147" }}>{r.text}</div>
                  <div style={{ fontSize: 11, color: "#9691B0" }}>Batas: {r.deadline}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={newReminderText}
              onChange={e => setNewReminderText(e.target.value)}
              placeholder="Pengingat baru..."
              style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12 }}
              onKeyDown={e => {
                if (e.key === "Enter" && newReminderText.trim()) {
                  addReminder(newReminderText.trim(), "");
                  setNewReminderText("");
                }
              }}
            />
            <button
              onClick={() => { if (newReminderText.trim()) { addReminder(newReminderText.trim(), ""); setNewReminderText(""); } }}
              style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 8, padding: "0 12px", cursor: "pointer" }}
            >
              <Plus size={14} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AddNovelInline({ addNovel }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        marginTop: 14, width: "100%", background: "#5B21B6", color: "#fff", border: "none",
        borderRadius: 10, padding: "9px 0", fontWeight: 600, fontSize: 13, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <Plus size={14} /> Tambah Novel Baru
      </button>
    );
  }
  return (
    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul novel" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5 }} />
      <input value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre (mis. Fantasy • Adventure)" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { if (title.trim()) { addNovel(title.trim(), genre.trim()); setTitle(""); setGenre(""); setOpen(false); } }} style={{ flex: 1, background: "#5B21B6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>Simpan</button>
        <button onClick={() => setOpen(false)} style={{ flex: 1, background: "#F1EBFF", color: "#5B21B6", border: "none", borderRadius: 8, padding: "8px 0", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}>Batal</button>
      </div>
    </div>
  );
}

function StatMini({ icon: Icon, label, value }) {
  return (
    <div style={{ border: "1px solid #ECE8F8", borderRadius: 12, padding: "10px 12px" }}>
      <Icon size={15} color="#7C4DFF" />
      <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 17, margin: "6px 0 2px" }}>{value}</div>
      <div style={{ fontSize: 10.5, color: "#9691B0" }}>{label}</div>
    </div>
  );
}

function MiniStatBox({ icon: Icon, color, label, value }) {
  return (
    <div style={{ border: "1px solid #ECE8F8", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
      <Icon size={13} color={color} style={{ marginBottom: 4 }} />
      <div style={{ fontWeight: 700, fontSize: 12.5 }}>{value}</div>
      <div style={{ fontSize: 9.5, color: "#9691B0" }}>{label}</div>
    </div>
  );
}

function DonutMini({ pct }) {
  const data = [{ value: pct }, { value: 100 - pct }];
  return (
    <div style={{ position: "relative", width: 80, height: 80 }}>
      <PieChart width={80} height={80}>
        <Pie data={data} dataKey="value" innerRadius={28} outerRadius={38} startAngle={90} endAngle={-270} stroke="none">
          <Cell fill="#7C4DFF" />
          <Cell fill="#EDE9FB" />
        </Pie>
      </PieChart>
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15,
      }}>{pct}%</div>
    </div>
  );
}

function MiniCalendar({ month }) {
  const daysInMonth = new Date(2026, month + 1, 0).getDate();
  const firstDay = (new Date(2026, month, 1).getDay() + 6) % 7; // Mon=0
  const writingDays = [3, 4, 6, 7, 9, 12, 13, 15, 18, 20, 22, 25];
  const today = 20;
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
        {["Min","Sen","Sel","Rab","Kam","Jum","Sab"].map(d => (
          <div key={d} style={{ fontSize: 10, color: "#9691B0", textAlign: "center" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isToday = d === today;
          const wrote = writingDays.includes(d);
          return (
            <div key={i} style={{
              width: "100%", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10.5, borderRadius: 7, cursor: "pointer",
              background: isToday ? "#5B21B6" : wrote ? "#F1EBFF" : "transparent",
              color: isToday ? "#fff" : wrote ? "#5B21B6" : "#6B6485",
              fontWeight: isToday || wrote ? 700 : 400,
            }}>{d}</div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   NOVELKU PAGE
---------------------------------------------------------------- */
function NovelkuPage({ novels, openWorkspace, addNovel }) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  return (
    <div>
      <PageTitle title="Novelku" sub="Semua novel yang sedang dan pernah kamu tulis." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
        {novels.map(n => {
          const pct = Math.round((n.chapters / n.totalChapters) * 100);
          const wpct = Math.round((n.words / n.targetWords) * 100);
          return (
            <Card key={n.id} className="nc-clickable" style={{ padding: 18 }} onClick={() => openWorkspace(n.id, "overview")}>
              <div style={{ display: "flex", gap: 14 }}>
                <NovelCover novel={n} w={80} h={110} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 15 }}>{n.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9691B0", marginBottom: 8 }}>{n.genre}</div>
                  <div style={{ fontSize: 11.5, color: "#4B3A7A", marginBottom: 4 }}>{n.chapters}/{n.totalChapters} Chapter</div>
                  <ProgressBar value={pct} height={6} />
                  <div style={{ fontSize: 11, color: "#9691B0", marginTop: 8 }}>{n.words.toLocaleString("id-ID")} / {n.targetWords.toLocaleString("id-ID")} kata ({wpct}%)</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openWorkspace(n.id, "chapter"); }}
                style={{
                  marginTop: 14, width: "100%", background: "#5B21B6", color: "#fff", border: "none",
                  borderRadius: 9, padding: "8px 0", fontWeight: 600, fontSize: 12.5, cursor: "pointer",
                }}
              >
                Buka Chapter Manager
              </button>
            </Card>
          );
        })}
        <Card style={{ padding: 18, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, border: "2px dashed #D9D2F0", background: "transparent" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, textAlign: "center" }}>Tambah Novel Baru</div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul novel" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5 }} />
          <input value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5 }} />
          <button
            onClick={() => { if (title.trim()) { addNovel(title.trim(), genre.trim()); setTitle(""); setGenre(""); } }}
            style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 9, padding: "9px 0", fontWeight: 600, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            <Plus size={14} /> Buat Novel
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   CHAPTER MANAGER
---------------------------------------------------------------- */
function ChapterManagerPage({ novels, activeNovelId, setActiveNovelId, chapters, addChapter, markChapterDone, openWorkspace }) {
  const [newTitle, setNewTitle] = useState("");
  const novelChapters = chapters.filter(c => c.novelId === activeNovelId).sort((a, b) => b.number - a.number);
  const statusTone = { draft: "gray", review: "orange", done: "green" };
  const statusLabel = { draft: "Draft", review: "Review", done: "Selesai" };

  return (
    <div>
      <PageTitle title="Chapter Manager" sub="Kelola semua chapter novelmu di satu tempat." />
      <NovelTabs novels={novels} activeNovelId={activeNovelId} setActiveNovelId={setActiveNovelId} />
      <Card style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input
            value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="Judul chapter baru..."
            style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }}
          />
          <button
            onClick={() => { addChapter(activeNovelId, newTitle.trim()); setNewTitle(""); }}
            style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={15} /> Tambah Chapter
          </button>
        </div>
        {novelChapters.length === 0 ? <EmptyState text="Belum ada chapter untuk novel ini." /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {novelChapters.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, border: "1px solid #ECE8F8", borderRadius: 12, padding: "12px 16px" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9, background: "#F1EBFF", display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12.5, color: "#5B21B6", flexShrink: 0,
                }}>{c.number}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.title}</div>
                  <div style={{ fontSize: 11.5, color: "#9691B0" }}>{c.words.toLocaleString("id-ID")} kata</div>
                </div>
                <Pill tone={statusTone[c.status]}>{statusLabel[c.status]}</Pill>
                <button onClick={() => openWorkspace(activeNovelId, "chapter")} style={{
                  background: "#F1EBFF", color: "#5B21B6", border: "none", borderRadius: 8,
                  padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>
                  Tulis
                </button>
                <button onClick={() => markChapterDone(c.id)} style={{
                  background: c.status === "done" ? "#F1EBFF" : "#22C55E",
                  color: c.status === "done" ? "#5B21B6" : "#fff",
                  border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}>
                  {c.status === "done" ? "Tandai Draft" : "Tandai Selesai"}
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function NovelTabs({ novels, activeNovelId, setActiveNovelId }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {novels.map(n => (
        <button
          key={n.id}
          onClick={() => setActiveNovelId(n.id)}
          style={{
            border: "none", borderRadius: 99, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            background: activeNovelId === n.id ? "#5B21B6" : "#fff",
            color: activeNovelId === n.id ? "#fff" : "#4B3A7A",
            border: activeNovelId === n.id ? "none" : "1px solid #ECE8F8",
          }}
        >
          {n.title}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   STORY PLANNER
---------------------------------------------------------------- */
function StoryPlannerPage({ novels, activeNovelId, setActiveNovelId, plots, addPlot }) {
  const [type, setType] = useState("Plot");
  const [text, setText] = useState("");
  const novelPlots = plots.filter(p => p.novelId === activeNovelId);
  const typeColor = { Plot: "#3B82F6", Konflik: "#EF4444", Motif: "#8B5CF6" };

  return (
    <div>
      <PageTitle title="Story Planner" sub="Atur alur, konflik, dan motif cerita per novel." />
      <NovelTabs novels={novels} activeNovelId={activeNovelId} setActiveNovelId={setActiveNovelId} />
      <Card style={{ padding: 20, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <select value={type} onChange={e => setType(e.target.value)} style={{ border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }}>
            <option>Plot</option><option>Konflik</option><option>Motif</option>
          </select>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Tulis poin alur/konflik/motif..." style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }} />
          <button
            onClick={() => { if (text.trim()) { addPlot(activeNovelId, type, text.trim()); setText(""); } }}
            style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={15} /> Tambah
          </button>
        </div>
        {novelPlots.length === 0 ? <EmptyState text="Belum ada poin cerita. Tambahkan alur, konflik, atau motif." /> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {novelPlots.map((p, i) => (
              <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", borderLeft: `3px solid ${typeColor[p.type]}`, paddingLeft: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: typeColor[p.type] + "22", color: typeColor[p.type], fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div>
                  <Pill tone="violet">{p.type}</Pill>
                  <div style={{ fontSize: 13, marginTop: 4, color: "#3D3163" }}>{p.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   CHARACTER DATABASE
---------------------------------------------------------------- */
function CharacterPage({ novels, activeNovelId, setActiveNovelId, characters, addCharacter }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [desc, setDesc] = useState("");
  const list = characters.filter(c => c.novelId === activeNovelId);

  return (
    <div>
      <PageTitle title="Character Database" sub="Kelola karakter dan hubungan mereka." />
      <NovelTabs novels={novels} activeNovelId={activeNovelId} setActiveNovelId={setActiveNovelId} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 16 }}>
        {list.map(c => (
          <Card key={c.id} style={{ padding: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#7C4DFF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontFamily: "Poppins,sans-serif", marginBottom: 10 }}>
              {c.name.charAt(0)}
            </div>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{c.name}</div>
            <Pill tone="violet">{c.role}</Pill>
            <div style={{ fontSize: 12.5, color: "#6B6485", marginTop: 8 }}>{c.desc}</div>
          </Card>
        ))}
        <Card style={{ padding: 18, border: "2px dashed #D9D2F0", background: "transparent" }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Tambah Karakter</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama karakter" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5 }} />
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Peran (mis. Tokoh Utama)" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5 }} />
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Deskripsi singkat" style={{ border: "1px solid #ECE8F8", borderRadius: 8, padding: "8px 10px", fontSize: 12.5, minHeight: 60 }} />
            <button
              onClick={() => { if (name.trim()) { addCharacter(activeNovelId, name.trim(), role.trim(), desc.trim()); setName(""); setRole(""); setDesc(""); } }}
              style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 9, padding: "9px 0", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
            >
              Simpan Karakter
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   CONSULTATIONS
---------------------------------------------------------------- */
function ConsultPage({ novels, consultations, cycleConsultStatus }) {
  const [filter, setFilter] = useState("Semua");
  const tabs = ["Semua", "urgent", "revisi", "selesai", "info"];
  const list = filter === "Semua" ? consultations : consultations.filter(c => c.status === filter);
  return (
    <div>
      <PageTitle title="Catatan Konsultasi" sub="Semua masukan dan revisi dari konsultasimu." />
      <FilterTabs tabs={tabs} labels={{ Semua: "Semua", urgent: "Urgent", revisi: "Revisi", selesai: "Selesai", info: "Info" }} active={filter} onChange={setFilter} />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        {list.length === 0 && <EmptyState text="Tidak ada catatan pada kategori ini." />}
        {list.map(c => {
          const novel = novels.find(n => n.id === c.novelId);
          return (
            <ConsultCard key={c.id} c={c} novelTitle={novel?.title} onCycle={() => cycleConsultStatus(c.id)} />
          );
        })}
      </div>
    </div>
  );
}

function ConsultCard({ c, novelTitle, onCycle }) {
  const dotColor = { urgent: "#EF4444", revisi: "#F59E0B", selesai: "#22C55E", info: "#3B82F6" };
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: dotColor[c.status], marginTop: 5, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11.5, color: "#9691B0" }}>{novelTitle ? novelTitle + " • " : ""}Chapter {c.chapter} • {c.time}</div>
            <div style={{ fontWeight: 700, fontSize: 14.5, margin: "2px 0" }}>{c.title}</div>
            <div style={{ fontSize: 13, color: "#6B6485" }}>{c.note}</div>
          </div>
        </div>
        <Pill tone={CONSULT_STATUS[c.status].tone}>{CONSULT_STATUS[c.status].label}</Pill>
      </div>
      <button onClick={onCycle} style={{
        marginTop: 12, background: "#F1EBFF", color: "#5B21B6",
        border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
      }}>
        Ubah Status →
      </button>
    </Card>
  );
}

function FilterTabs({ tabs, labels, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            border: "none", borderRadius: 99, padding: "7px 15px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            background: active === t ? "#5B21B6" : "#fff",
            color: active === t ? "#fff" : "#4B3A7A",
            border: active === t ? "none" : "1px solid #ECE8F8",
          }}
        >
          {labels ? labels[t] : t}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   IDEA VAULT
---------------------------------------------------------------- */
function IdeaVaultPage({ ideas, addIdea, novels }) {
  const [category, setCategory] = useState("Plot Twist");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [filter, setFilter] = useState("Semua");
  const categories = ["Plot Twist", "Dialog", "Scene", "Karakter"];
  const list = filter === "Semua" ? ideas : ideas.filter(i => i.category === filter);

  return (
    <div>
      <PageTitle title="Idea Vault" sub="Simpan semua ide cemerlangmu di sini." />
      <Card style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Judul ide" style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Detail ide..." style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13, minHeight: 44 }} />
          <button
            onClick={() => { if (title.trim()) { addIdea(category, title.trim(), desc.trim()); setTitle(""); setDesc(""); } }}
            style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
          >
            <Plus size={15} /> Tambah Ide
          </button>
        </div>
      </Card>
      <FilterTabs tabs={["Semua", ...categories]} active={filter} onChange={setFilter} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginTop: 16 }}>
        {list.length === 0 && <EmptyState text="Belum ada ide pada kategori ini." />}
        {list.map(idea => {
          const novel = novels?.find(n => n.id === idea.novelId);
          return (
            <Card key={idea.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <Pill tone="violet">{idea.category}</Pill>
                <span style={{ fontSize: 11, color: "#9691B0" }}>{idea.time}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{idea.title}</div>
              <div style={{ fontSize: 12.5, color: "#6B6485", marginTop: 4 }}>{idea.desc}</div>
              {novel && <div style={{ fontSize: 11, color: "#9691B0", marginTop: 8 }}>📖 {novel.title}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PROGRESS
---------------------------------------------------------------- */
function ProgressPage({ novels, chapters }) {
  const totalWords = novels.reduce((s, n) => s + n.words, 0);
  const totalTarget = novels.reduce((s, n) => s + n.targetWords, 0);
  const overallPct = Math.round((totalWords / totalTarget) * 100);
  const doneChapters = chapters.filter(c => c.status === "done").length;

  return (
    <div>
      <PageTitle title="Writing Progress" sub="Statistik menyeluruh progres menulismu." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        <Card style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <DonutMini pct={overallPct} />
          <div style={{ marginTop: 12, fontWeight: 700, fontSize: 14 }}>Progress Keseluruhan</div>
          <div style={{ fontSize: 12, color: "#9691B0" }}>{totalWords.toLocaleString("id-ID")} / {totalTarget.toLocaleString("id-ID")} kata</div>
        </Card>
        <Card style={{ padding: 24 }}>
          <SectionHeader title="Progress per Novel" />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {novels.map(n => {
              const pct = Math.round((n.words / n.targetWords) * 100);
              return (
                <div key={n.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>{n.title}</span>
                    <span style={{ color: "#9691B0" }}>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginTop: 20 }}>
        <StatBig icon={Flame} color="#F59E0B" label="Streak Menulis" value="7 hari" />
        <StatBig icon={FileText} color="#22C55E" label="Chapter Selesai" value={doneChapters} />
        <StatBig icon={BookOpen} color="#7C4DFF" label="Total Novel" value={novels.length} />
        <StatBig icon={Star} color="#3B82F6" label="Total Kata" value={totalWords.toLocaleString("id-ID")} />
      </div>
    </div>
  );
}

function StatBig({ icon: Icon, color, label, value }) {
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <Icon size={17} color={color} />
      </div>
      <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 20 }}>{value}</div>
      <div style={{ fontSize: 12, color: "#9691B0" }}>{label}</div>
    </Card>
  );
}

/* ---------------------------------------------------------------
   WORKSPACE NOVEL — immersive per-novel hub (Overview / Chapter /
   Story Planner / Character Database / Idea Vault / Konsultasi /
   Writing Progress / Pengaturan Novel)
---------------------------------------------------------------- */
const WORKSPACE_SECTIONS = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "chapter", label: "Chapter", icon: FileText },
  { key: "planner", label: "Story Planner", icon: Map },
  { key: "characters", label: "Character Database", icon: Users },
  { key: "ideas", label: "Ide & Notes", icon: Lightbulb },
  { key: "consult", label: "Catatan Konsultasi", icon: MessageSquare },
  { key: "progress", label: "Writing Progress", icon: BarChart2 },
  { key: "settings", label: "Pengaturan Novel", icon: Settings },
];

function WorkspaceNovel({
  novel, novels, setNovels, workspace, setWorkspace, chapters, addChapter, markChapterDone,
  saveChapterContent, characters, addCharacter, plots, addPlot, ideas, addIdea,
  consultations, cycleConsultStatus, setActiveTab,
}) {
  if (!novel) return null;
  const section = workspace.section;
  const setSection = (key) => setWorkspace(w => ({ ...w, section: key, editingChapterId: null }));
  const novelChapters = chapters.filter(c => c.novelId === novel.id).sort((a, b) => b.number - a.number);
  const chapterPct = Math.round((novel.chapters / novel.totalChapters) * 100);
  const editingChapter = chapters.find(c => c.id === workspace.editingChapterId);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <button onClick={() => setActiveTab("novelku")} style={{
          background: "#fff", border: "1px solid #ECE8F8", borderRadius: 10, width: 34, height: 34,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <ChevronLeft size={16} />
        </button>
        <NovelCover novel={novel} w={40} h={54} />
        <div>
          <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 16 }}>{novel.title}</div>
          <div style={{ fontSize: 12, color: "#9691B0" }}>{novel.chapters} / {novel.totalChapters} Chapter • {chapterPct}%</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 20, alignItems: "start" }}>
        <Card style={{ padding: 10 }}>
          {WORKSPACE_SECTIONS.map(s => {
            const Icon = s.icon;
            const active = section === s.key;
            return (
              <button key={s.key} onClick={() => setSection(s.key)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px",
                borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left", marginBottom: 2,
                background: active ? "#F1EBFF" : "transparent", color: active ? "#5B21B6" : "#4B3A7A",
                fontWeight: active ? 700 : 500, fontSize: 13,
              }}>
                <Icon size={15} /> {s.label} <ChevronRight size={13} style={{ marginLeft: "auto", opacity: active ? 1 : 0.3 }} />
              </button>
            );
          })}
        </Card>

        <div style={{ minWidth: 0 }}>
          {section === "overview" && <WorkspaceOverview novel={novel} chapters={novelChapters} setSection={setSection} />}
          {section === "chapter" && !editingChapter && (
            <WorkspaceChapterList
              novel={novel} chapters={novelChapters} addChapter={addChapter} markChapterDone={markChapterDone}
              onEdit={(id) => setWorkspace(w => ({ ...w, editingChapterId: id }))}
            />
          )}
          {section === "chapter" && editingChapter && (
            <ChapterEditor
              chapter={editingChapter} chapters={novelChapters}
              onBack={() => setWorkspace(w => ({ ...w, editingChapterId: null }))}
              onSave={saveChapterContent}
              onNavigate={(id) => setWorkspace(w => ({ ...w, editingChapterId: id }))}
            />
          )}
          {section === "planner" && <ActPlanner novel={novel} plots={plots.filter(p => p.novelId === novel.id)} addPlot={addPlot} />}
          {section === "characters" && (
            <WorkspaceCharacters novel={novel} characters={characters.filter(c => c.novelId === novel.id)} addCharacter={addCharacter} />
          )}
          {section === "ideas" && (
            <WorkspaceIdeas novel={novel} ideas={ideas.filter(i => i.novelId === novel.id)} addIdea={addIdea} />
          )}
          {section === "consult" && (
            <WorkspaceConsult novel={novel} consultations={consultations.filter(c => c.novelId === novel.id)} cycleConsultStatus={cycleConsultStatus} />
          )}
          {section === "progress" && <WorkspaceProgress novel={novel} chapters={novelChapters} />}
          {section === "settings" && <WorkspaceSettings novel={novel} novels={novels} setNovels={setNovels} />}
        </div>
      </div>
    </div>
  );
}

function WorkspaceOverview({ novel, chapters, setSection }) {
  const wpct = Math.round((novel.words / novel.targetWords) * 100);
  const cpct = Math.round((novel.chapters / novel.totalChapters) * 100);
  const draft = chapters.find(c => c.status === "draft") || chapters[0];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 20 }}>
        <div style={{ fontSize: 12, color: "#9691B0", marginBottom: 4 }}>{novel.genre}</div>
        <h3 style={{ fontFamily: "Poppins,sans-serif", margin: "0 0 14px" }}>{novel.title}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}><span>Progress Kata</span><span>{wpct}%</span></div>
            <ProgressBar value={wpct} />
            <div style={{ fontSize: 11, color: "#9691B0", marginTop: 4 }}>{novel.words.toLocaleString("id-ID")} / {novel.targetWords.toLocaleString("id-ID")} kata</div>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}><span>Progress Chapter</span><span>{cpct}%</span></div>
            <ProgressBar value={cpct} color="#22C55E" />
            <div style={{ fontSize: 11, color: "#9691B0", marginTop: 4 }}>{novel.chapters} / {novel.totalChapters} chapter</div>
          </div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card className="nc-clickable" onClick={() => setSection("chapter")} style={{ padding: 18 }}>
          <FileText size={18} color="#7C4DFF" />
          <div style={{ fontWeight: 700, marginTop: 8 }}>Lanjutkan Menulis</div>
          <div style={{ fontSize: 12, color: "#9691B0" }}>{draft ? `Chapter ${draft.number} • ${draft.title}` : "Mulai chapter pertama"}</div>
        </Card>
        <Card className="nc-clickable" onClick={() => setSection("consult")} style={{ padding: 18 }}>
          <MessageSquare size={18} color="#22C55E" />
          <div style={{ fontWeight: 700, marginTop: 8 }}>Cek Konsultasi</div>
          <div style={{ fontSize: 12, color: "#9691B0" }}>Lihat masukan terbaru untuk novel ini</div>
        </Card>
      </div>
      <div style={{ fontSize: 12, color: "#9691B0" }}>
        Catatan: Semua data tersimpan otomatis selama sesi ini • Fokus pada kenyamanan menulis tanpa gangguan.
      </div>
    </div>
  );
}

function WorkspaceChapterList({ novel, chapters, addChapter, markChapterDone, onEdit }) {
  const [newTitle, setNewTitle] = useState("");
  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Judul chapter baru..." style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }} />
        <button onClick={() => { addChapter(novel.id, newTitle.trim()); setNewTitle(""); }} style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={15} /> Tambah Chapter
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {chapters.length === 0 && <EmptyState text="Belum ada chapter. Tambahkan chapter pertamamu." />}
        {chapters.map(c => (
          <div key={c.id} onClick={() => onEdit(c.id)} className="nc-clickable" style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, cursor: "pointer",
          }}>
            <div onClick={(e) => { e.stopPropagation(); markChapterDone(c.id); }} style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              background: c.status === "done" ? "#22C55E" : "#F1EBFF",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {c.status === "done" && <Check size={12} color="#fff" />}
            </div>
            <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>Chapter {String(c.number).padStart(2, "0")}{c.title ? ` — ${c.title}` : ""}</div>
            {c.status === "draft" && <Pill tone="gray">Draft</Pill>}
            <ChevronRight size={14} color="#C9C2E3" />
          </div>
        ))}
      </div>
    </Card>
  );
}

function ChapterEditor({ chapter, chapters, onBack, onSave, onNavigate }) {
  const [content, setContent] = useState(chapter.content || "");
  const [title, setTitle] = useState(chapter.title || "");
  const [savedFlash, setSavedFlash] = useState(false);
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const idx = chapters.findIndex(c => c.id === chapter.id);
  const prevChapter = chapters[idx + 1];
  const nextChapter = chapters[idx - 1];
  const pct = chapter.target ? Math.min(100, Math.round((words / chapter.target) * 100)) : 0;

  function handleSave() {
    onSave(chapter.id, content);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid #ECE8F8" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "#4B3A7A", fontSize: 13, fontWeight: 600 }}>
          <ChevronLeft size={16} /> Chapter {chapter.number}
        </button>
        <Pill tone={chapter.status === "done" ? "green" : "gray"}>{chapter.status === "done" ? "Selesai" : "Draft"}</Pill>
      </div>
      <div style={{ padding: 20 }}>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Judul Chapter"
          style={{ border: "none", fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 18, width: "100%", marginBottom: 14, color: "#1F1147" }}
        />
        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          placeholder="Mulai menulis ceritamu di sini..."
          style={{
            width: "100%", minHeight: 280, border: "1px solid #ECE8F8", borderRadius: 12, padding: 16,
            fontSize: 14, lineHeight: 1.8, color: "#3D3163", resize: "vertical",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <div style={{ flex: 1 }}><ProgressBar value={pct} /></div>
          <span style={{ fontSize: 12, color: "#9691B0", whiteSpace: "nowrap" }}>{words.toLocaleString("id-ID")} kata{chapter.target ? ` • Target: ${chapter.target.toLocaleString("id-ID")} kata` : ""}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button disabled={!prevChapter} onClick={() => prevChapter && onNavigate(prevChapter.id)} style={{
              background: "#fff", border: "1px solid #ECE8F8", borderRadius: 9, padding: "8px 14px", fontSize: 12.5,
              fontWeight: 600, color: prevChapter ? "#4B3A7A" : "#C9C2E3", cursor: prevChapter ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <ChevronLeft size={13} /> Prev Chapter
            </button>
            <button disabled={!nextChapter} onClick={() => nextChapter && onNavigate(nextChapter.id)} style={{
              background: "#fff", border: "1px solid #ECE8F8", borderRadius: 9, padding: "8px 14px", fontSize: 12.5,
              fontWeight: 600, color: nextChapter ? "#4B3A7A" : "#C9C2E3", cursor: nextChapter ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              Next Chapter <ChevronRight size={13} />
            </button>
          </div>
          <button onClick={handleSave} style={{
            background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "9px 20px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
            {savedFlash ? "✓ Tersimpan" : "Simpan Chapter"}
          </button>
        </div>
      </div>
    </Card>
  );
}

function ActPlanner({ novel, plots, addPlot }) {
  const [act, setAct] = useState("Act 1");
  const [text, setText] = useState("");
  const acts = ["Act 1", "Act 2", "Act 3"];
  const actLabel = { "Act 1": "Introduction", "Act 2": "Conflict", "Act 3": "Resolution" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={act} onChange={e => setAct(e.target.value)} style={{ border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }}>
            {acts.map(a => <option key={a}>{a}</option>)}
          </select>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Tambahkan poin adegan..." style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13 }} />
          <button onClick={() => { if (text.trim()) { addPlot(novel.id, "Plot", text.trim(), act); setText(""); } }} style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "0 16px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Plus size={15} />
          </button>
        </div>
      </Card>
      {acts.map(a => {
        const points = plots.filter(p => (p.act || "Act 1") === a);
        return (
          <Card key={a} style={{ padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 14 }}>{a}</div>
              <span style={{ fontSize: 12, color: "#9691B0" }}>— {actLabel[a]}</span>
            </div>
            {points.length === 0 ? (
              <div style={{ fontSize: 12.5, color: "#C9C2E3" }}>Belum ada poin cerita di babak ini.</div>
            ) : (
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {points.map(p => <li key={p.id} style={{ fontSize: 13, color: "#3D3163" }}>{p.text}</li>)}
              </ul>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function WorkspaceCharacters({ novel, characters, addCharacter }) {
  const [selectedId, setSelectedId] = useState(characters[0]?.id || null);
  const [tab, setTab] = useState("Profile");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const selected = characters.find(c => c.id === selectedId) || characters[0];
  const tabs = ["Profile", "Relationship", "Arc", "Notes"];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
      <Card style={{ padding: 12 }}>
        {characters.map(c => (
          <div key={c.id} onClick={() => setSelectedId(c.id)} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 9, cursor: "pointer",
            background: selected?.id === c.id ? "#F1EBFF" : "transparent", marginBottom: 2,
          }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#7C4DFF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{c.name.charAt(0)}</div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: selected?.id === c.id ? "#5B21B6" : "#4B3A7A" }}>{c.name}</span>
          </div>
        ))}
        {!showAdd ? (
          <button onClick={() => setShowAdd(true)} style={{ marginTop: 8, width: "100%", background: "#F1EBFF", color: "#5B21B6", border: "none", borderRadius: 9, padding: "8px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Karakter</button>
        ) : (
          <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama" style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 8, padding: "7px 8px", fontSize: 11.5 }} />
            <button onClick={() => { if (name.trim()) { addCharacter(novel.id, name.trim(), "Karakter Pendukung", ""); setName(""); setShowAdd(false); } }} style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 8, padding: "0 10px", cursor: "pointer" }}><Plus size={13} /></button>
          </div>
        )}
      </Card>

      {selected ? (
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: 14, background: "#7C4DFF", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 22, flexShrink: 0 }}>{selected.name.charAt(0)}</div>
            <div>
              <div style={{ fontFamily: "Poppins,sans-serif", fontWeight: 700, fontSize: 17 }}>{selected.name}</div>
              <Pill tone="violet">{selected.role}</Pill>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 18, marginBottom: 16, borderBottom: "1px solid #ECE8F8" }}>
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: "none", border: "none", padding: "8px 4px", marginRight: 16, cursor: "pointer",
                fontSize: 13, fontWeight: 600, color: tab === t ? "#5B21B6" : "#9691B0",
                borderBottom: tab === t ? "2px solid #5B21B6" : "2px solid transparent",
              }}>{t}</button>
            ))}
          </div>
          {tab === "Profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <FieldRow label="Peran" value={selected.role} />
              <FieldRow label="Usia" value={selected.usia || "-"} />
              <FieldRow label="Kepribadian" value={selected.kepribadian || "-"} />
              <FieldRow label="Latar Belakang" value={selected.latar || selected.desc || "-"} />
            </div>
          )}
          {tab === "Relationship" && <p style={{ fontSize: 13, color: "#3D3163", lineHeight: 1.7 }}>{selected.relationship || "Belum ada catatan hubungan."}</p>}
          {tab === "Arc" && <p style={{ fontSize: 13, color: "#3D3163", lineHeight: 1.7 }}>{selected.arc || "Belum ada catatan character arc."}</p>}
          {tab === "Notes" && <p style={{ fontSize: 13, color: "#3D3163", lineHeight: 1.7 }}>{selected.notes || "Belum ada catatan tambahan."}</p>}
        </Card>
      ) : <Card style={{ padding: 20 }}><EmptyState text="Belum ada karakter untuk novel ini." /></Card>}
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9691B0", marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#3D3163" }}>{value}</div>
    </div>
  );
}

function WorkspaceIdeas({ novel, ideas, addIdea }) {
  const [filter, setFilter] = useState("Semua");
  const [category, setCategory] = useState("Plot Twist");
  const [title, setTitle] = useState("");
  const categories = ["Plot Twist", "Dialog", "Scene", "Karakter"];
  const list = filter === "Semua" ? ideas : ideas.filter(i => i.category === filter);

  return (
    <div>
      <Card style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ border: "1px solid #ECE8F8", borderRadius: 9, padding: "9px 10px", fontSize: 12.5 }}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tulis ide baru..." style={{ flex: 1, border: "1px solid #ECE8F8", borderRadius: 9, padding: "9px 10px", fontSize: 12.5 }} />
          <button onClick={() => { if (title.trim()) { addIdea(category, title.trim(), "", novel.id); setTitle(""); } }} style={{ background: "#22C55E", color: "#fff", border: "none", borderRadius: 9, padding: "0 14px", cursor: "pointer" }}><Plus size={14} /></button>
        </div>
      </Card>
      <FilterTabs tabs={["Semua", ...categories]} active={filter} onChange={setFilter} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {list.length === 0 && <EmptyState text="Belum ada ide untuk novel ini." />}
        {list.map(idea => (
          <Card key={idea.id} style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Pill tone="violet">{idea.category}</Pill>
              <span style={{ fontSize: 11, color: "#9691B0" }}>{idea.time}</span>
            </div>
            <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: 6 }}>{idea.title}</div>
            {idea.desc && <div style={{ fontSize: 12.5, color: "#6B6485", marginTop: 3 }}>{idea.desc}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function WorkspaceConsult({ novel, consultations, cycleConsultStatus }) {
  const [filter, setFilter] = useState("Semua");
  const tabs = ["Semua", "urgent", "revisi", "selesai", "info"];
  const list = filter === "Semua" ? consultations : consultations.filter(c => c.status === filter);
  return (
    <div>
      <FilterTabs tabs={tabs} labels={{ Semua: "Semua", urgent: "Urgent", revisi: "Revisi", selesai: "Selesai", info: "Info" }} active={filter} onChange={setFilter} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
        {list.length === 0 && <EmptyState text="Belum ada catatan konsultasi." />}
        {list.map(c => <ConsultCard key={c.id} c={c} onCycle={() => cycleConsultStatus(c.id)} />)}
      </div>
      <button style={{
        marginTop: 16, width: "100%", background: "#5B21B6", color: "#fff", border: "none", borderRadius: 10,
        padding: "10px 0", fontWeight: 600, fontSize: 13, cursor: "pointer",
      }}>
        + Catatan Baru
      </button>
    </div>
  );
}

function WorkspaceProgress({ novel, chapters }) {
  const doneChapters = chapters.filter(c => c.status === "done").length;
  const wpct = Math.round((novel.words / novel.targetWords) * 100);
  const weekly = [
    { d: "Sen", v: 500 }, { d: "Sel", v: 800 }, { d: "Rab", v: 0 }, { d: "Kam", v: 1200 },
    { d: "Jum", v: 1500 }, { d: "Sab", v: 0 }, { d: "Min", v: 0 },
  ];
  const maxV = Math.max(...weekly.map(w => w.v), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 20 }}>
        <SectionHeader title="Aktivitas Menulis Minggu Ini" />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 120 }}>
          {weekly.map(w => (
            <div key={w.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ fontSize: 10.5, color: "#9691B0" }}>{w.v}</div>
              <div style={{ width: "70%", height: Math.max(4, (w.v / maxV) * 80), background: w.v > 0 ? "#7C4DFF" : "#EDE9FB", borderRadius: 6 }} />
              <div style={{ fontSize: 11, color: "#9691B0" }}>{w.d}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        <StatBig icon={Flame} color="#F59E0B" label="Writing Streak" value="7 hari" />
        <StatBig icon={Clock} color="#3B82F6" label="Total Waktu Menulis" value="24j 30m" />
        <StatBig icon={FileText} color="#22C55E" label="Chapter Selesai" value={doneChapters} />
        <StatBig icon={Target} color="#7C4DFF" label="Target Bulan Ini" value={`${wpct}%`} />
      </div>
      <Card style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
          <span style={{ fontWeight: 600 }}>Total Kata Bulan Ini</span>
          <span style={{ color: "#9691B0" }}>{novel.words.toLocaleString("id-ID")} / {novel.targetWords.toLocaleString("id-ID")} kata</span>
        </div>
        <ProgressBar value={wpct} />
      </Card>
    </div>
  );
}

function WorkspaceSettings({ novel, novels, setNovels }) {
  const [title, setTitle] = useState(novel.title);
  const [genre, setGenre] = useState(novel.genre);
  const [target, setTarget] = useState(novel.targetWords);
  const [saved, setSaved] = useState(false);
  return (
    <Card style={{ padding: 22, maxWidth: 460 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#4B3A7A" }}>Judul Novel</label>
      <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: "100%", border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13, margin: "6px 0 14px" }} />
      <label style={{ fontSize: 12, fontWeight: 600, color: "#4B3A7A" }}>Genre</label>
      <input value={genre} onChange={e => setGenre(e.target.value)} style={{ width: "100%", border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13, margin: "6px 0 14px" }} />
      <label style={{ fontSize: 12, fontWeight: 600, color: "#4B3A7A" }}>Target Kata</label>
      <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} style={{ width: "100%", border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13, margin: "6px 0 20px" }} />
      <button
        onClick={() => { setNovels(novels.map(n => n.id === novel.id ? { ...n, title, genre, targetWords: target } : n)); setSaved(true); setTimeout(() => setSaved(false), 1800); }}
        style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
      >
        Simpan Pengaturan
      </button>
      {saved && <span style={{ marginLeft: 12, color: "#22C55E", fontSize: 12.5, fontWeight: 600 }}>✓ Tersimpan</span>}
    </Card>
  );
}

/* ---------------------------------------------------------------
   SETTINGS
---------------------------------------------------------------- */
function SettingsPage() {
  const [name, setName] = useState("Nazari");
  const [bio, setBio] = useState("Penulis • Dreamer");
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <PageTitle title="Pengaturan" sub="Kelola profil dan preferensi akunmu." />
      <Card style={{ padding: 24, maxWidth: 480 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#7C4DFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mascot size={44} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#9691B0" }}>{bio}</div>
          </div>
        </div>
        <label style={{ fontSize: 12, fontWeight: 600, color: "#4B3A7A" }}>Nama</label>
        <input value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13, margin: "6px 0 14px" }} />
        <label style={{ fontSize: 12, fontWeight: 600, color: "#4B3A7A" }}>Bio</label>
        <input value={bio} onChange={e => setBio(e.target.value)} style={{ width: "100%", border: "1px solid #ECE8F8", borderRadius: 9, padding: "10px 12px", fontSize: 13, margin: "6px 0 20px" }} />
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
          style={{ background: "#5B21B6", color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
        >
          Simpan Perubahan
        </button>
        {saved && <span style={{ marginLeft: 12, color: "#22C55E", fontSize: 12.5, fontWeight: 600 }}>✓ Tersimpan</span>}
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------
   SHARED
---------------------------------------------------------------- */
function PageTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: "Poppins,sans-serif", fontSize: 22, margin: "0 0 4px", color: "#1F1147" }}>{title}</h2>
      <p style={{ margin: 0, fontSize: 13, color: "#9691B0" }}>{sub}</p>
    </div>
  );
}
