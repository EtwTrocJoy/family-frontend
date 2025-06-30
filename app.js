// === Block 0: Basis-URL für das Backend (z. B. Render) ===
const API_BASE = "https://family-backend-1fat.onrender.com";
// === Block 1: Sprachumschaltung ===
const translations = {
  de: {
    title: "👨‍👩‍👧‍👦 Familienplattform",
    join: "Gruppe beitreten oder erstellen",
    name: "Dein Name*:",
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
    name: "Your Name*:",
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
    name: "Ton nom*:",
    group: "Choisir un groupe:",
    joinBtn: "Rejoindre",
    profileHeadline: "Tous les profils de votre groupe",
    filter: "Appliquer le filtre",
    export: "⬇️ Export CSV",
    detail: "👤 Détail du profil"
  }
};

document.getElementById('languageSelect').addEventListener('change', e => {
  const lang = e.target.value;
  const t = translations[lang];
  document.getElementById('app-title').textContent = t.title;
  document.querySelector('h2').textContent = t.join;
  document.querySelector('label[for="languageSelect"]').textContent = "🌐 " + t.group;
  document.querySelector('label input[name="name"]').previousSibling.textContent = t.name;
  document.querySelector('button[type="submit"]').textContent = t.joinBtn;
  document.querySelector('#profileOverview h2').textContent = t.profileHeadline;
  document.querySelector('#profileTools h3').textContent = "🔎 " + t.filter + " & " + t.export;
});
// === Block 2: Navigation zwischen den Bereichen ===
function showPage(sectionId) {
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
}
// === Block 3: Gruppen aus Backend laden ===
async function loadGroups() {
  const res = await fetch(`${API_BASE}/api/groups`);
  const groups = await res.json();
  const groupSelect = document.getElementById("groupSelect");
  groupSelect.innerHTML = "";
  groups.forEach(g => {
    const opt = document.createElement("option");
    opt.value = g.id;
    opt.textContent = g.name;
    groupSelect.appendChild(opt);
  });
}
// === Block 4: Beitrittsformular absenden ===
document.getElementById("joinGroupForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = e.target.name.value;
  const groupId = e.target.groupId.value;

  // Dummy-Person erzeugen
  const id = Math.floor(Math.random() * 10000);
  const birthYear = 1990;
  const resPerson = await fetch(`${API_BASE}/api/persons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, name, birthYear })
  });
  if (!resPerson.ok) {
    document.getElementById("groupMessage").textContent = "❌ Person existiert oder ungültig.";
    return;
  }

  // Beitrittsanfrage stellen
  const resJoin = await fetch(`${API_BASE}/api/groups/${groupId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personId: id })
  });

  document.getElementById("groupMessage").textContent = resJoin.ok
    ? "✅ Beitrittsanfrage gesendet!"
    : "❌ Beitritt fehlgeschlagen!";
});
// === Block 5: Profile aus API anzeigen ===
async function loadProfiles() {
  const res = await fetch(`${API_BASE}/api/groups`);
  const data = await res.json();
  const list = document.getElementById("profileList");
  list.innerHTML = "";
  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} (${p.birthYear})`;
    li.addEventListener("click", () => showProfile(p));
    list.appendChild(li);
  });
  showPage("profileOverview");
}
// === Block 6.1: Einzelprofil anzeigen ===
function showProfile(p) {
  document.getElementById("profileData").textContent = JSON.stringify(p, null, 2);
  const form = document.getElementById("editProfileForm");
  form.name.value = p.name;
  form.birthYear.value = p.birthYear;
  form.id.value = p.id;
  showPage("profileDetail");
}

// === Block 6.2: Bearbeiten speichern ===
document.getElementById("editProfileForm").addEventListener("submit", async e => {
  e.preventDefault();
  const id = e.target.id.value;
  const name = e.target.name.value;
  const birthYear = e.target.birthYear.value;

  const res = await fetch(`${API_BASE}/api/persons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, birthYear })
  });
  if (res.ok) {
    alert("✅ Profil geändert");
    loadProfiles();
  }
});

// === Block 6.3: Profil löschen ===
async function deleteProfile() {
  const id = document.querySelector("#editProfileForm input[name='id']").value;
  const res = await fetch(`${API_BASE}/api/persons/${id}`, { method: "DELETE" });
  if (res.ok) {
    alert("✅ Profil gelöscht");
    loadProfiles();
  }
}
// === Block 7: Filter & CSV Export ===
function applyFilters() {
  const name = document.getElementById("filterName").value.toLowerCase();
  const year = document.getElementById("filterYear").value;
  document.querySelectorAll("#profileList li").forEach(li => {
    const txt = li.textContent.toLowerCase();
    const match = (!name || txt.includes(name)) && (!year || txt.includes(year));
    li.style.display = match ? "" : "none";
  });
}
function exportProfiles() {
  const lines = ["ID,Name,Geburtsjahr"];
  fetch(`${API_BASE}/api/persons`)
    .then(res => res.json())
    .then(data => {
      data.forEach(p => lines.push(`${p.id},${p.name},${p.birthYear}`));
      const blob = new Blob([lines.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "profiles.csv";
      a.click();
    });
}
// === Block 8: Initialer Aufruf nach Laden der Seite ===
window.addEventListener("DOMContentLoaded", () => {
  loadGroups();
  loadProfiles();
});
