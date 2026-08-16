import React, { useState } from "react";
import { Check } from "lucide-react"; // Sesuaikan pustaka ikon yang Anda gunakan

function WorkspaceProgress({ novel, chapters }) {
  const doneCount = chapters.filter((c) => c.status === "done").length;
  const draftCount = chapters.filter((c) => c.status === "draft").length;
  const totalCount = chapters.length;
  const wordPct = novel.targetWords
    ? Math.min(100, Math.round((novel.words / novel.targetWords) * 100))
    : 0;
  const chapPct = novel.totalChapters
    ? Math.min(100, Math.round((novel.chapters / novel.totalChapters) * 100))
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card padding={20}>
          <div style={{ fontSize: 12, color: "#9691B0", marginBottom: 4 }}>
            Target Kata
          </div>
          <div
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
            }}
          >
            {novel.words.toLocaleString("id-ID")} /{" "}
            {novel.targetWords.toLocaleString("id-ID")}
          </div>
          <ProgressBar value={wordPct} />
          <div
            style={{
              fontSize: 11.5,
              color: "#9691B0",
              marginTop: 6,
              textAlign: "right",
            }}
          >
            {wordPct}% tercapai
          </div>
        </Card>

        <Card padding={20}>
          <div style={{ fontSize: 12, color: "#9691B0", marginBottom: 4 }}>
            Target Chapter
          </div>
          <div
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
            }}
          >
            {novel.chapters} / {novel.totalChapters} Chapter
          </div>
          <ProgressBar color="#22C55E" value={chapPct} />
          <div
            style={{
              fontSize: 11.5,
              color: "#9691B0",
              marginTop: 6,
              textAlign: "right",
            }}
          >
            {chapPct}% tercapai
          </div>
        </Card>
      </div>

      <Card padding={20}>
        <SectionHeader title="Rincian Status Chapter" />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 8,
          }}
        >
          <div
            style={{
              background: "#E9F9EC",
              padding: 14,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#1F9D4A",
              }}
            >
              {doneCount}
            </div>
            <div style={{ fontSize: 12, color: "#1F9D4A", fontWeight: 600 }}>
              Selesai
            </div>
          </div>
          <div
            style={{
              background: "#F1F1F5",
              padding: 14,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#6B7280",
              }}
            >
              {draftCount}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>
              Draft
            </div>
          </div>
          <div
            style={{
              background: "#F1EBFF",
              padding: 14,
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#6D28D9",
              }}
            >
              {totalCount}
            </div>
            <div style={{ fontSize: 12, color: "#6D28D9", fontWeight: 600 }}>
              Total Dibuat
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function WorkspaceSettings({ novel, updateNovel }) {
  const [title, setTitle] = useState(novel.title || "");
  const [genre, setGenre] = useState(novel.genre || "");
  const [targetWords, setTargetWords] = useState(novel.targetWords || 60000);
  const [totalChapters, setTotalChapters] = useState(novel.totalChapters || 20);
  const [coverImage, setCoverImage] = useState(novel.coverImage || null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    updateNovel(novel.id, {
      title: title.trim() || novel.title,
      genre: genre.trim() || novel.genre,
      targetWords: Number(targetWords) || novel.targetWords,
      totalChapters: Number(totalChapters) || novel.totalChapters,
      coverImage,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card padding={22}>
      <SectionHeader title="Pengaturan Novel" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <NovelCover novel={novel} coverImage={coverImage} w={80} h={110} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600 }}>Cover Novel</div>
            <ImagePickerButton label="Ganti Cover" onPick={setCoverImage} />
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: 12,
              color: "#9691B0",
              display: "block",
              marginBottom: 4,
            }}
          >
            Judul Novel
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid #ECE8F8",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 13,
            }}
          />
        </div>

        <div>
          <label
            style={{
              fontSize: 12,
              color: "#9691B0",
              display: "block",
              marginBottom: 4,
            }}
          >
            Genre
          </label>
          <input
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            style={{
              width: "100%",
              border: "1px solid #ECE8F8",
              borderRadius: 8,
              padding: "9px 12px",
              fontSize: 13,
            }}
          />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#9691B0",
                display: "block",
                marginBottom: 4,
              }}
            >
              Target Total Kata
            </label>
            <input
              type="number"
              value={targetWords}
              onChange={(e) => setTargetWords(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #ECE8F8",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 13,
              }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: 12,
                color: "#9691B0",
                display: "block",
                marginBottom: 4,
              }}
            >
              Target Total Chapter
            </label>
            <input
              type="number"
              value={totalChapters}
              onChange={(e) => setTotalChapters(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid #ECE8F8",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 13,
              }}
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: 8,
            background: "#5B21B6",
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "10px 0",
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          {saved ? "✓ Perubahan Tersimpan" : "Simpan Pengaturan Novel"}
        </button>
      </div>
    </Card>
  );
}

function SettingsPage({ profile, setProfile, lang, setLang, t }) {
  const [activeTab, setActiveTab] = useState("profil");
  const [name, setName] = useState(profile.name || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [saved, setSaved] = useState(false);

  function handleSaveProfile() {
    setProfile({
      ...profile,
      name: name.trim() || profile.name,
      bio: bio.trim() || profile.bio,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ maxWidth: 680 }}>
      <PageTitle title={t("settingsTitle")} sub={t("settingsSub")} />

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab("profil")}
          style={{
            border: activeTab === "profil" ? "none" : "1px solid #ECE8F8",
            borderRadius: 99,
            padding: "8px 18px",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            background: activeTab === "profil" ? "#5B21B6" : "#fff",
            color: activeTab === "profil" ? "#fff" : "#4B3A7A",
          }}
        >
          {t("tabProfil")}
        </button>
        <button
          onClick={() => setActiveTab("bahasa")}
          style={{
            border: activeTab === "bahasa" ? "none" : "1px solid #ECE8F8",
            borderRadius: 99,
            padding: "8px 18px",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            background: activeTab === "bahasa" ? "#5B21B6" : "#fff",
            color: activeTab === "bahasa" ? "#fff" : "#4B3A7A",
          }}
        >
          {t("tabBahasa")}
        </button>
      </div>

      {activeTab === "profil" && (
        <Card padding={24}>
          <SectionHeader title={t("tabProfil")} />
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#7C4DFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <ImagePickerButton
                onPick={(photo) => setProfile({ ...profile, photo })}
                label={t("gantiFoto")}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#9691B0",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t("namaLabel")}
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #ECE8F8",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: 12,
                  color: "#9691B0",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                {t("bioLabel")}
              </label>
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #ECE8F8",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                }}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              style={{
                marginTop: 6,
                background: "#5B21B6",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "10px 0",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {saved ? `✓ ${t("tersimpan")}` : t("simpanProfil")}
            </button>
          </div>
        </Card>
      )}

      {activeTab === "bahasa" && (
        <Card padding={24}>
          <SectionHeader title={t("tabBahasa")} />
          <p style={{ fontSize: 13, color: "#6B6485", marginBottom: 16 }}>
            {t("pilihBahasa")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={() => setLang("id")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 12,
                border:
                  lang === "id" ? "2px solid #5B21B6" : "1px solid #ECE8F8",
                background: lang === "id" ? "#F1EBFF" : "#fff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13.5,
                color: lang === "id" ? "#5B21B6" : "#1F1147",
              }}
            >
              <span>🇮🇩 {t("bahasaID")}</span>
              {lang === "id" && <Check color="#5B21B6" size={16} />}
            </button>
            <button
              onClick={() => setLang("en")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 12,
                border:
                  lang === "en" ? "2px solid #5B21B6" : "1px solid #ECE8F8",
                background: lang === "en" ? "#F1EBFF" : "#fff",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13.5,
                color: lang === "en" ? "#5B21B6" : "#1F1147",
              }}
            >
              <span>🇬🇧 {t("bahasaEN")}</span>
              {lang === "en" && <Check color="#5B21B6" size={16} />}
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
