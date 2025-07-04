// === Block 0: Basis-URL für das Backend (z. B. Render) ===
// Update this URL when deploying to a different environment
const API_BASE = "https://family-backend-1fat.onrender.com";
let currentGroupId = null; // merken, in welcher Gruppe sich der Nutzer befindet

// Globale Map von Personen-IDs auf Person-Objekte für schnelle Lookup
let personMap = {};
// Zusätzliche Referenz für alle Personen
let byId = {};

// === Block 1: Sprachumschaltung ===
const translations = {
  de: {
    title: "👨‍👩‍👧‍👦 Familienplattform",
    navProfiles: "🔍 Profile",
    navGroups: "👪 Gruppen",
    navTree: "🌳 Stammbaum",
    navSettings: "⚙️ Einstellungen",
    joinTitle: "Gruppe beitreten oder erstellen",
    nameLabel: "Dein Name*:",
    groupLabel: "Gruppe wählen:",
    languageLabel: "Sprache wählen:",
    joinBtn: "Beitreten",
    toolsTitle: "🔎 Filter & Export",
    filterNameLabel: "Nach Name filtern:",
    filterYearLabel: "Nach Jahr filtern:",
    applyFilter: "Filter anwenden",
    exportBtn: "⬇️ Export CSV",
    profileHeadline: "Alle Profile in deiner Gruppe",
    searchPlaceholder: "Suche nach Name, Ort...",
    detailTitle: "👤 Profil-Detail",
    editTitle: "Bearbeiten / Löschen",
    editNameLabel: "Name:",
    editYearLabel: "Geburtsjahr:",
    saveBtn: "Speichern",
    deleteBtn: "Löschen",
    printTitle: "🖨️ Drucken & Export",
    printBtn: "Profil drucken",
    gedcomBtn: "Export GEDCOM",
    treeTitle: "🌳 Dynamischer Stammbaum",
    treeSelectLabel: "Person auswählen:",
    dashboardTitle: "👪 Gruppen-Dashboard",
    settingsTitle: "⚙️ Einstellungen",
    publicLabel: "Gruppe öffentlich sichtbar",
    membersLabel: "Nur Mitglieder sehen Beiträge"
  },
  en: {
    title: "👨‍👩‍👧‍👦 Family Platform",
    navProfiles: "🔍 Profiles",
    navGroups: "👪 Groups",
    navTree: "🌳 Family Tree",
    navSettings: "⚙️ Settings",
    joinTitle: "Join or Create Group",
    nameLabel: "Your Name*:",
    groupLabel: "Select Group:",
    languageLabel: "Select language:",
    joinBtn: "Join",
    toolsTitle: "🔎 Filter & Export",
    filterNameLabel: "Filter by name:",
    filterYearLabel: "Filter by year:",
    applyFilter: "Apply filter",
    exportBtn: "⬇️ Export CSV",
    profileHeadline: "All profiles in your group",
    searchPlaceholder: "Search by name, place...",
    detailTitle: "👤 Profile Detail",
    editTitle: "Edit / Delete",
    editNameLabel: "Name:",
    editYearLabel: "Birth year:",
    saveBtn: "Save",
    deleteBtn: "Delete",
    printTitle: "🖨️ Print & Export",
    printBtn: "Print profile",
    gedcomBtn: "Export GEDCOM",
    treeTitle: "🌳 Family Tree",
    treeSelectLabel: "Select person:",
    dashboardTitle: "👪 Group Dashboard",
    settingsTitle: "⚙️ Settings",
    publicLabel: "Group publicly visible",
    membersLabel: "Only members see posts"
  },
  fr: {
    title: "👨‍👩‍👧‍👦 Plateforme Familiale",
    navProfiles: "🔍 Profils",
    navGroups: "👪 Groupes",
    navTree: "🌳 Arbre généalogique",
    navSettings: "⚙️ Paramètres",
    joinTitle: "Rejoindre ou créer un groupe",
    nameLabel: "Ton nom*:",
    groupLabel: "Choisir un groupe:",
    languageLabel: "Choisir la langue:",
    joinBtn: "Rejoindre",
    toolsTitle: "🔎 Filtrer & Exporter",
    filterNameLabel: "Filtrer par nom:",
    filterYearLabel: "Filtrer par année:",
    applyFilter: "Appliquer le filtre",
    exportBtn: "⬇️ Export CSV",
    profileHeadline: "Tous les profils de votre groupe",
    searchPlaceholder: "Rechercher par nom, lieu...",
    detailTitle: "👤 Détail du profil",
    editTitle: "Modifier / Supprimer",
    editNameLabel: "Nom:",
    editYearLabel: "Année de naissance:",
    saveBtn: "Enregistrer",
    deleteBtn: "Supprimer",
    printTitle: "🖨️ Imprimer & Exporter",
    printBtn: "Imprimer le profil",
    gedcomBtn: "Exporter GEDCOM",
    treeTitle: "🌳 Arbre généalogique",
    treeSelectLabel: "Sélectionner une personne:",
    dashboardTitle: "👪 Tableau de bord",
    settingsTitle: "⚙️ Paramètres",
    publicLabel: "Groupe visible publiquement",
    membersLabel: "Seuls les membres voient les posts"
  }
};

function applyLanguage(lang) {
  const t = translations[lang];
  const setText = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.textContent = txt;
  };
  const setPlaceholder = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.placeholder = txt;
  };

  setText('app-title', t.title);
  setText('nav-profiles', t.navProfiles);
  setText('nav-groups', t.navGroups);
  setText('nav-tree', t.navTree);
  setText('nav-settings', t.navSettings);

  setText('label-language', '🌐 ' + t.languageLabel);
  setText('join-title', t.joinTitle);
  setText('label-name', t.nameLabel);
  setText('label-group', t.groupLabel);
  setText('btn-join', t.joinBtn);

  setText('tools-title', t.toolsTitle);
  setText('label-filter-name', t.filterNameLabel);
  setText('label-filter-year', t.filterYearLabel);
  setText('btn-apply-filter', t.applyFilter);
  setText('btn-export', t.exportBtn);

  setText('overview-title', t.profileHeadline);
  setPlaceholder('searchBar', t.searchPlaceholder);

  setText('detail-title', t.detailTitle);
  setText('edit-title', t.editTitle);
  setText('edit-label-name', t.editNameLabel);
  setText('edit-label-year', t.editYearLabel);
  setText('btn-save', t.saveBtn);
  setText('btn-delete', t.deleteBtn);

  setText('print-title', t.printTitle);
  setText('btn-print', t.printBtn);
  setText('btn-gedcom', t.gedcomBtn);

  setText('tree-title', t.treeTitle);
  setText('tree-select-label', t.treeSelectLabel);

  setText('dashboard-title', t.dashboardTitle);

  setText('settings-title', t.settingsTitle);
  setText('label-public', t.publicLabel);
  setText('label-only-members', t.membersLabel);
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
  personMap = {};
  persons.forEach(p => {
    personMap[p.id] = p;
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
  // globale Referenzen setzen
  byId = personMap;

  // Helper: build nested list items recursively
  function buildNode(person) {
    const li = document.createElement("li");
    li.dataset.id = person.id;
    li.textContent = `${person.name}${person.birthYear ? ` (${person.birthYear})` : ""}`;
    li.addEventListener("click", e => {
      // Remove selection from any previously selected nodes
      container.querySelectorAll("li.selected").forEach(node => node.classList.remove("selected"));
      // Mark the clicked node as selected
      li.classList.add("selected");
      computeRelation(li);
      e.stopPropagation();
    });
    if (person.children && person.children.length) {
      const ul = document.createElement("ul");
      person.children.forEach(cid => {
        const child = personMap[cid];
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

document.getElementById("treeSelect").addEventListener("change", () => computeRelation());

// Ermittelt verschiedene Verwandtschaften für eine Person und zeigt das Ergebnis
function computeRelation(personId) {
  const info = document.getElementById("relationInfo");
  if (personId && typeof personId === "object") {
    if (personId.dataset && personId.dataset.id) {
      personId = personId.dataset.id;
    } else if (personId.currentTarget && personId.currentTarget.dataset) {
      personId = personId.currentTarget.dataset.id;
    } else if (personId.target && personId.target.dataset) {
      personId = personId.target.dataset.id;
    }
  }

  if (!personId) {
    const select = document.getElementById("treeSelect");
    personId = select.value;
  }

  if (!personId || !byId[personId]) {
    info.textContent = "";
    return;
  }

  const person = byId[personId];

  const resolveNames = ids =>
    (ids || [])
      .map(pid => byId[pid])
      .filter(Boolean)
      .map(p => p.name);

  const parents = resolveNames(person.parents);
  const children = resolveNames(person.children);

  let spouseIds = [];
  if (Array.isArray(person.spouses)) {
    spouseIds = person.spouses;
  } else if (person.spouse) {
    spouseIds = [person.spouse];
  }
  const spouses = resolveNames(spouseIds);

  // Geschwister bestimmen
  const siblingIds = [];
  (person.parents || []).forEach(pid => {
    const parent = byId[pid];
    if (parent && parent.children) {
      parent.children.forEach(cid => {
        if (cid !== person.id && !siblingIds.includes(cid)) siblingIds.push(cid);
      });
    }
  });
  const siblings = resolveNames(siblingIds);

  // Großeltern bestimmen
  const grandIds = [];
  (person.parents || []).forEach(pid => {
    const par = byId[pid];
    if (par && par.parents) {
      par.parents.forEach(gpid => {
        if (!grandIds.includes(gpid)) grandIds.push(gpid);
      });
    }
  });
  const grandparents = resolveNames(grandIds);

  // Onkel und Tanten
  const auntUncleIds = [];
  grandIds.forEach(gpid => {
    const grand = byId[gpid];
    if (grand && grand.children) {
      grand.children.forEach(cid => {
        if (
          !(person.parents || []).includes(cid) &&
          !auntUncleIds.includes(cid)
        ) {
          auntUncleIds.push(cid);
        }
      });
    }
  });
  const auntsUncles = resolveNames(auntUncleIds);

  // Cousins und Cousinen
  const cousinIds = [];
  auntUncleIds.forEach(aid => {
    const au = byId[aid];
    if (au && au.children) {
      au.children.forEach(cid => {
        if (!cousinIds.includes(cid)) cousinIds.push(cid);
      });
    }
  });
  const cousins = resolveNames(cousinIds);

  const fmt = arr => (arr.length ? arr.join(", ") : "—");

  info.innerHTML = `
    <table>
      <tr><th>Beziehung</th><th>Personen</th></tr>
      <tr><td><strong>Eltern</strong></td><td>${fmt(parents)}</td></tr>
      <tr><td><strong>Geschwister</strong></td><td>${fmt(siblings)}</td></tr>
      <tr><td><strong>Großeltern</strong></td><td>${fmt(grandparents)}</td></tr>
      <tr><td><strong>Onkel/Tante</strong></td><td>${fmt(auntsUncles)}</td></tr>
      <tr><td><strong>Cousins/Cousinen</strong></td><td>${fmt(cousins)}</td></tr>
      <tr><td><strong>Ehepartner</strong></td><td>${fmt(spouses)}</td></tr>
      <tr><td><strong>Kinder</strong></td><td>${fmt(children)}</td></tr>
    </table>`;
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
  const select = document.getElementById("languageSelect");
  if (select) applyLanguage(select.value);
  loadGroups();
  loadProfiles();
});
