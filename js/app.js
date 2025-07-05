// === Block 1: Basis-Konfiguration und globale Variablen ===

// Basis-URL des Backends (z. B. Render-Link)
const API_BASE = "https://family-backend-1fat.onrender.com";

// Globale Zustände
let currentGroupId = null;           // Aktuelle Gruppen-ID (für Join & Filter)
let personMap = {};                  // Personen nach ID
let groupMap = {};                   // Gruppen nach ID
let selectedPersonId = null;         // Aktuell ausgewählte Person im Baum

// Tooltip für Hover-Infos bei Personen
const tooltip = document.createElement("div");
tooltip.className = "tooltip hidden";
document.body.appendChild(tooltip);

// === Sprachpakete ===
const translations = {
  de: {
    title: "👨‍👩‍👧‍👦 Familienplattform",
    join: "Gruppe beitreten oder erstellen",
    name: "Dein Name*: ",
    group: "Gruppe wählen:",
    joinBtn: "Beitreten",
    profileHeadline: "Alle Profile in deiner Gruppe",
    filter: "Filter anwenden",
    export: "⬇️ Export CSV",
    detail: "👤 Profil-Detail"
  },
  en: {
    title: "👨‍👩‍👧‍👦 Family Platform",
    join: "Join or Create Group",
    name: "Your Name*: ",
    group: "Select Group:",
    joinBtn: "Join",
    profileHeadline: "All profiles in your group",
    filter: "Apply filter",
    export: "⬇️ Export CSV",
    detail: "👤 Profile Detail"
  },
  fr: {
    title: "👨‍👩‍👧‍👦 Plateforme Familiale",
    join: "Rejoindre ou créer un groupe",
    name: "Ton nom*: ",
    group: "Choisir un groupe:",
    joinBtn: "Rejoindre",
    profileHeadline: "Tous les profils de votre groupe",
    filter: "Appliquer le filtre",
    export: "⬇️ Export CSV",
    detail: "👤 Détail du profil"
  }
};
// === Block 2: Sprachumschaltung & Navigation ===

// Wendet die Sprache im UI an
function applyLanguage(lang) {
  const t = translations[lang];
  document.getElementById('app-title').textContent = t.title;
  document.querySelector("#groupLogin h2").textContent = t.join;
  document.querySelector("label[for='languageSelect']").textContent = "🌐 Sprache wählen:";
  document.querySelector("label input[name='name']").previousSibling.textContent = t.name;
  document.querySelector("button[type='submit']").textContent = t.joinBtn;
  document.querySelector("#profileOverview h2").textContent = t.profileHeadline;
  document.querySelector("#profileTools h3").textContent = "🔎 " + t.filter + " & " + t.export;
  document.querySelector("#profileDetail h2").textContent = t.detail;
}

// Listener für Sprachauswahl
document.getElementById("languageSelect").addEventListener("change", e => {
  applyLanguage(e.target.value);
});

// Blendet alle Bereiche aus und zeigt nur den gewählten Bereich
function showPage(sectionId) {
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";

  // Zusätzliche Logik beim Wechseln in bestimmte Seiten
  if (sectionId === "treeView") {
    loadTree();
  } else if (sectionId === "profileOverview") {
    loadProfiles();
  }
}
// === Block 3: Gruppen aus dem Backend laden ===

// Ruft alle verfügbaren Gruppen vom Backend ab und befüllt das <select>-Dropdown
async function loadGroups() {
  try {
    const res = await fetch(`${API_BASE}/api/groups`);
    if (!res.ok) throw new Error("Fehler beim Abrufen der Gruppen");
    const groups = await res.json();
    const groupSelect = document.getElementById("groupSelect");
    groupSelect.innerHTML = "";

    // Für jede Gruppe eine Option einfügen
    groups.forEach(group => {
      const opt = document.createElement("option");
      opt.value = group.id;
      opt.textContent = group.name;
      groupSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Fehler beim Laden der Gruppen:", err);
    document.getElementById("groupMessage").textContent = "⚠️ Fehler beim Laden der Gruppen";
  }
}

// Funktion, um eine Erfolg- oder Fehlermeldung unterhalb des Gruppenformulars anzuzeigen
function showMessage(msg) {
  const el = document.getElementById("groupMessage");
  if (el) el.textContent = msg;
}
// === Block 4: Beitrittsformular absenden und neue Person registrieren ===

document.getElementById("joinGroupForm").addEventListener("submit", async e => {
  e.preventDefault();

  const name = e.target.name.value;
  const groupId = e.target.groupId.value;

  if (!name || !groupId) {
    showMessage("⚠️ Name und Gruppe sind erforderlich.");
    return;
  }

  // Dummy-ID generieren (später evtl. Backend übernimmt das)
  const id = Math.floor(Math.random() * 1000000);
  const birthYear = 1990;

  // Neue Person anlegen
  const resPerson = await fetch(`${API_BASE}/api/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, birthYear })
  });

  if (!resPerson.ok) {
    showMessage("❌ Person existiert bereits oder ungültige Eingabe.");
    return;
  }

  // Anfrage zum Beitritt zur Gruppe senden
  const resJoin = await fetch(`${API_BASE}/api/groups/${groupId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personId: id })
  });

  if (resJoin.ok) {
    showMessage("✅ Beitrittsanfrage gesendet.");
    currentGroupId = groupId; // merken
    loadProfiles(); // alle Profile dieser Gruppe laden
    showPage("profileOverview");
  } else {
    showMessage("❌ Beitritt zur Gruppe fehlgeschlagen.");
  }
});
// === Block 5: Profile anzeigen & Detailansicht ===

// Alle Profile aus dem Backend laden
async function loadProfiles() {
  try {
    const res = await fetch(`${API_BASE}/api/persons`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    // Map für schnelleren Zugriff (z. B. in Stammbaum)
    personMap = {};
    data.forEach(p => (personMap[p.id] = p));

    // Select-Feld für Baum füllen
    const select = document.getElementById("treeSelect");
    select.innerHTML = "";
    data.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.name;
      select.appendChild(opt);
    });

    // Profilübersicht anzeigen
    const list = document.getElementById("profileList");
    list.innerHTML = "";
    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} (${p.birthYear})`;
      li.addEventListener("click", () => showProfile(p));
      list.appendChild(li);
    });

    showPage("profileOverview");
  } catch (err) {
    showMessage("❌ Fehler beim Laden der Profile");
  }
}

// Detailanzeige eines Profils
function showProfile(person) {
  document.getElementById("profileData").textContent = JSON.stringify(person, null, 2);

  const form = document.getElementById("editProfileForm");
  form.name.value = person.name;
  form.birthYear.value = person.birthYear;
  form.id.value = person.id;

  showPage("profileDetail");
}
// === Block 6: Bearbeiten und Löschen von Profilen ===

// Bearbeitungsformular absenden
document.getElementById("editProfileForm").addEventListener("submit", async e => {
  e.preventDefault();

  const id = e.target.id.value;
  const name = e.target.name.value;
  const birthYear = e.target.birthYear.value;

  // PUT-Anfrage an API senden, um Profil zu aktualisieren
  const res = await fetch(`${API_BASE}/api/persons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, birthYear })
  });

  if (res.ok) {
    alert("✅ Profil gespeichert");
    loadProfiles(); // neu laden
  } else {
    alert("❌ Fehler beim Speichern");
  }
});

// Profil löschen
async function deleteProfile() {
  const id = document.querySelector("#editProfileForm input[name='id']").value;
  const res = await fetch(`${API_BASE}/api/persons/${id}`, {
    method: "DELETE"
  });

  if (res.ok) {
    alert("✅ Profil gelöscht");
    loadProfiles(); // neu laden
  } else {
    alert("❌ Fehler beim Löschen");
  }
}
// === Block 7: Filter und CSV-Export ===

// Filter anwenden auf die Profil-Liste
function applyFilters() {
  const name = document.getElementById("filterName").value.toLowerCase();
  const year = document.getElementById("filterYear").value;

  document.querySelectorAll("#profileList li").forEach(li => {
    const txt = li.textContent.toLowerCase();
    const match =
      (!name || txt.includes(name)) &&
      (!year || txt.includes(year));
    li.style.display = match ? "" : "none";
  });
}

// Profile als CSV-Datei exportieren
function exportProfiles() {
  const lines = ["ID,Name,Geburtsjahr"];
  fetch(`${API_BASE}/api/persons`)
    .then(res => res.json())
    .then(data => {
      data.forEach(p => {
        lines.push(`${p.id},${p.name},${p.birthYear}`);
      });

      // CSV-Datei generieren und herunterladen
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "profiles.csv";
      a.click();
    });
}
// === Block 8: Initialisierung bei Seitenstart ===
window.addEventListener("DOMContentLoaded", () => {
  // Gruppen vom Backend laden (z. B. zum Beitritt)
  loadGroups();

  // Profile laden, wenn vorhanden (z. B. für Detailansicht)
  loadProfiles();

  // Sprache anwenden, falls voreingestellt oder ausgewählt
  const select = document.getElementById("languageSelect");
  if (select) applyLanguage(select.value);

  // Ereignisbindung für Sprachumschaltung erneut setzen
  select.addEventListener("change", () => applyLanguage(select.value));
});
