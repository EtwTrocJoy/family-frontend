// === Block 0: Basis-URL für das Backend (z. B. Render) ===
// Update this URL when deploying to a different environment
const API_BASE = "https://family-backend-1fat.onrender.com";
let currentGroupId = null; // merken, in welcher Gruppe sich der Nutzer befindet
// Globale Map von Personen-IDs auf Person-Objekte für schnelle Lookup
let personMap = {};
// === Block 1: Sprachumschaltung ===
const translations = {
  de: {
    title: "👨‍👩‍👧‍👦 Familienplattform",
    join: "Gruppe beitreten oder erstellen",
    name: "Dein Name*:",
    group: "Gruppe wählen:",
    languageLabel: "Sprache wählen:",
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
    languageLabel: "Select language:",
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
    languageLabel: "Choisir la langue:",
    joinBtn: "Rejoindre",
    profileHeadline: "Tous les profils de votre groupe",
    filter: "Appliquer le filtre",
    export: "⬇️ Export CSV",
    detail: "👤 Détail du profil"
  }
};

function applyLanguage(lang) {
  const t = translations[lang];
  document.getElementById('app-title').textContent = t.title;
  document.querySelector('h2').textContent = t.join;
  document.querySelector('label[for="languageSelect"]').textContent = "🌐 " + t.languageLabel;
  document.querySelector('label input[name="name"]').previousSibling.textContent = t.name;
  document.querySelector('button[type="submit"]').textContent = t.joinBtn;
  document.querySelector('#profileOverview h2').textContent = t.profileHeadline;
  document.querySelector('#profileTools h3').textContent = "🔎 " + t.filter + " & " + t.export;
}

document.getElementById('languageSelect').addEventListener('change', e => {
  applyLanguage(e.target.value);
});
// === Block 2: Navigation zwischen den Bereichen ===
function showPage(sectionId) {
  document.querySelectorAll("section").forEach(sec => {
    sec.style.display = "none";
  });
  document.getElementById(sectionId).style.display = "block";
  if (sectionId === "treeView") {
    loadTree();
  } else if (sectionId === "groupDashboard") {
    loadMemberRequests();
    loadMemberList();
  } else if (sectionId === "settings") {
    loadSettings();

  }
}

function showMessage(msg) {
  const el = document.getElementById("groupMessage");
  if (el) el.textContent = msg;
}
// === Block 3: Gruppen aus Backend laden ===
async function loadGroups() {
  try {
    const res = await fetch(`${API_BASE}/api/groups`);
    if (!res.ok) throw new Error();
    const groups = await res.json();
    const groupSelect = document.getElementById("groupSelect");
    groupSelect.innerHTML = "";
    groups.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.name;
      groupSelect.appendChild(opt);
    });
  } catch (err) {
    showMessage("❌ Gruppen konnten nicht geladen werden.");
  }
}
// === Block 4: Beitrittsformular absenden ===
document.getElementById("joinGroupForm").addEventListener("submit", async e => {
  e.preventDefault();
  const name = e.target.name.value;
  const groupId = e.target.groupId.value;

  try {
    // Dummy-Person erzeugen
    const id = Math.floor(Math.random() * 10000);
    const birthYear = 1990;
    const resPerson = await fetch(`${API_BASE}/api/persons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, birthYear })
    });
    if (!resPerson.ok) {
      showMessage("❌ Person existiert oder ungültig.");
      return;
    }

    // Beitrittsanfrage stellen
    const resJoin = await fetch(`${API_BASE}/api/groups/${groupId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ personId: id })
    });

    if (resJoin.ok) {
      currentGroupId = groupId;
      showMessage("✅ Beitrittsanfrage gesendet!");
      loadProfiles();
    } else {
      showMessage("❌ Beitritt fehlgeschlagen!");
    }
  } catch (err) {
    showMessage("❌ Beitritt fehlgeschlagen!");
  }
});
// === Block 5: Profile aus API anzeigen ===
async function loadProfiles() {
  const list = document.getElementById("profileList");
  list.innerHTML = "";

  let data = [];
  try {
    const res = await fetch(`${API_BASE}/api/persons`);
    if (!res.ok) throw new Error();
    data = await res.json();

  } catch (err) {
    if (window.genealogyData) {
      data = window.genealogyData;
    } else {
      showMessage("❌ Profile konnten nicht geladen werden.");
      return;
    }
  }

  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} (${p.birthYear || ''})`;
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

  try {
    const res = await fetch(`${API_BASE}/api/persons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, birthYear })
    });
    if (res.ok) {
      alert("✅ Profil geändert");
      loadProfiles();
    } else {
      showMessage("❌ Profil konnte nicht gespeichert werden.");
    }
  } catch (err) {
    showMessage("❌ Profil konnte nicht gespeichert werden.");
  }
});

// === Block 6.3: Profil löschen ===
async function deleteProfile() {
  const id = document.querySelector("#editProfileForm input[name='id']").value;
  try {
    const res = await fetch(`${API_BASE}/api/persons/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("✅ Profil gelöscht");
      loadProfiles();
    } else {
      showMessage("❌ Profil konnte nicht gelöscht werden.");
    }
  } catch (err) {
    showMessage("❌ Profil konnte nicht gelöscht werden.");
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
async function exportProfiles() {
  const lines = ["ID,Name,Geburtsjahr"];
  try {
    const res = await fetch(`${API_BASE}/api/persons`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    data.forEach(p => lines.push(`${p.id},${p.name},${p.birthYear}`));
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profiles.csv";
    a.click();
  } catch (err) {
    showMessage("❌ Export fehlgeschlagen.");
  }
}

// === Block 8.1: Stammbaum anzeigen ===
async function loadTree() {
  const container = document.getElementById("treeContainer");
  const select = document.getElementById("treeSelect");
  container.innerHTML = "";
  select.innerHTML = "";

  let persons = [];
  if (window.genealogyData) {
    // Use sample data when available
    persons = window.genealogyData;
  } else if (currentGroupId) {
    try {
      const res = await fetch(`${API_BASE}/api/persons`);
      if (!res.ok) throw new Error();
      persons = await res.json();
    } catch (err) {
      showMessage("❌ Stammbaum konnte nicht geladen werden.");
      return;
    }
  }


  // Map person id -> person object for quick lookup
  const byId = {};
  persons.forEach(p => {
    byId[p.id] = p;
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
  // Map global speichern für computeRelation
  personMap = byId;

  // Helper: build nested list items recursively
  function buildNode(person) {
    const li = document.createElement("li");
    li.textContent = `${person.name}${person.birthYear ? ` (${person.birthYear})` : ""}`;
    if (person.children && person.children.length) {
      const ul = document.createElement("ul");
      person.children.forEach(cid => {
        const child = byId[cid];
        if (child) ul.appendChild(buildNode(child));
      });
      li.appendChild(ul);
    }
    return li;
  }

  const roots = persons.filter(p => !p.parents || p.parents.length === 0);
  const tree = document.createElement("ul");
  roots.forEach(r => tree.appendChild(buildNode(r)));
  container.appendChild(tree);
}

document.getElementById("treeSelect").addEventListener("change", computeRelation);

function computeRelation() {
  const info = document.getElementById("relationInfo");

  const select = document.getElementById("treeSelect");
  const id = select.value;
  if (!id || !personMap[id]) {
    info.textContent = "";
    return;
  }

  const person = personMap[id];

  const resolveNames = ids =>
    ids
      .map(pid => personMap[pid])
      .filter(Boolean)
      .map(p => p.name);

  const parents = resolveNames(person.parents || []);
  const children = resolveNames(person.children || []);

  let spouseIds = [];
  if (Array.isArray(person.spouses)) {
    spouseIds = person.spouses;
  } else if (person.spouse) {
    spouseIds = [person.spouse];
  }
  const spouses = resolveNames(spouseIds);

  const fmt = arr => (arr.length ? arr.join(", ") : "keine");

  info.innerHTML =
    `<strong>Eltern:</strong> ${fmt(parents)}<br>` +
    `<strong>Kinder:</strong> ${fmt(children)}<br>` +
    `<strong>Partner:</strong> ${fmt(spouses)}`;
}

// === Block 8.2: Gruppen-Dashboard ===
async function loadMemberRequests() {
  if (!currentGroupId) return;
  try {
    const res = await fetch(`${API_BASE}/api/groups/${currentGroupId}/requests`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const list = document.getElementById("memberRequests");
    list.innerHTML = "";
    data.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r.name;
      const okBtn = document.createElement("button");
      okBtn.textContent = "✔️";
      okBtn.addEventListener("click", () => handleRequest(r.id, true));
      const noBtn = document.createElement("button");
      noBtn.textContent = "❌";
      noBtn.addEventListener("click", () => handleRequest(r.id, false));
      li.appendChild(okBtn);
      li.appendChild(noBtn);
      list.appendChild(li);
    });
  } catch (err) {
    showMessage("❌ Anfragen konnten nicht geladen werden.");
  }
}

async function handleRequest(id, accept) {
  const url = accept
    ? `${API_BASE}/api/groups/${currentGroupId}/requests/${id}/accept`
    : `${API_BASE}/api/groups/${currentGroupId}/requests/${id}/reject`;
  await fetch(url, { method: "POST" });
  loadMemberRequests();
  loadMemberList();
}

async function loadMemberList() {
  if (!currentGroupId) return;
  try {
    const res = await fetch(`${API_BASE}/api/groups/${currentGroupId}/members`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const list = document.getElementById("memberList");
    list.innerHTML = "";
    data.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m.name;
      list.appendChild(li);
    });
  } catch (err) {
    showMessage("❌ Mitglieder konnten nicht geladen werden.");
  }
}

// === Block 8.3: Einstellungen laden und speichern ===
async function loadSettings() {
  if (!currentGroupId) return;
  try {
    const res = await fetch(`${API_BASE}/api/groups/${currentGroupId}`);
    if (!res.ok) throw new Error();
    const g = await res.json();
    document.getElementById("publicGroup").checked = !!g.public;
    document.getElementById("onlyMembers").checked = !!g.onlyMembers;
  } catch (err) {
    showMessage("❌ Einstellungen konnten nicht geladen werden.");
  }
}

async function saveSettings() {
  if (!currentGroupId) return;
  const publicGroup = document.getElementById("publicGroup").checked;
  const onlyMembers = document.getElementById("onlyMembers").checked;
  await fetch(`${API_BASE}/api/groups/${currentGroupId}/settings`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ public: publicGroup, onlyMembers })
  });
}

document.getElementById("publicGroup").addEventListener("change", saveSettings);
document.getElementById("onlyMembers").addEventListener("change", saveSettings);
// === Block 8: Initialer Aufruf nach Laden der Seite ===
window.addEventListener("DOMContentLoaded", () => {
  loadGroups();
  loadProfiles();
  const select = document.getElementById("languageSelect");
  if (select) applyLanguage(select.value);
});
