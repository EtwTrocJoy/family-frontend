function buildFullTree(personMap, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = "";

  const processedPairs = new Set();

  const persons = Object.values(personMap);
  const roots = persons.filter(p => {
    if (p.parents && p.parents.length) return false;
    const spouseIds = Array.isArray(p.spouses)
      ? p.spouses
      : p.spouse
      ? [p.spouse]
      : [];
    if (spouseIds.length) {
      const min = Math.min(p.id, ...spouseIds);
      return p.id === min;
    }
    return true;
  });

  const tree = document.createElement("ul");
  roots.forEach(r => {
    const node = buildSubtree(r);
    if (node) tree.appendChild(node);
  });
  container.appendChild(tree);

  function getSpouseIds(p) {
    return Array.isArray(p.spouses) ? p.spouses : p.spouse ? [p.spouse] : [];
  }

  function makeLabel(p) {
    const span = document.createElement("span");
    span.dataset.id = p.id;
    span.textContent = `${p.name}${p.birthYear ? ` (${p.birthYear})` : ""}`;
    span.addEventListener("click", () => {
      const sel = document.getElementById("treeSelect");
      if (sel) sel.value = p.id;
      computeRelation(p.id);
    });
    return span;
  }

  function buildSubtree(person) {
    const spouseIds = getSpouseIds(person);
    if (spouseIds.length > 1) {
      const frag = document.createDocumentFragment();
      spouseIds.forEach(id => {
        const key = [person.id, id].sort().join("-");
        if (!processedPairs.has(key)) {
          processedPairs.add(key);
          const li = buildCouple(person, personMap[id]);
          if (li) frag.appendChild(li);
        }
      });
      return frag;
    }
    if (spouseIds.length === 1) {
      const key = [person.id, spouseIds[0]].sort().join("-");
      if (processedPairs.has(key)) return null;
      processedPairs.add(key);
      return buildCouple(person, personMap[spouseIds[0]]);
    }
    return buildSingle(person);
  }

  function collectSharedChildren(p1, p2) {
    if (!p2) return p1.children || [];
    return (p1.children || []).filter(c => (p2.children || []).includes(c));
  }

  function buildCouple(p1, p2) {
    const li = document.createElement("li");
    li.classList.add("partnerGroup");
    const head = document.createElement("div");
    head.appendChild(makeLabel(p1));
    if (p2) head.appendChild(makeLabel(p2));
    li.appendChild(head);

    const childIds = collectSharedChildren(p1, p2);
    if (childIds.length) {
      const ul = document.createElement("ul");
      childIds.forEach(cid => {
        const child = personMap[cid];
        if (child) {
          const n = buildSubtree(child);
          if (n) ul.appendChild(n);
        }
      });
      li.appendChild(ul);
    }
    return li;
  }

  function buildSingle(p) {
    const li = document.createElement("li");
    li.appendChild(makeLabel(p));
    const kids = p.children || [];
    if (kids.length) {
      const ul = document.createElement("ul");
      kids.forEach(cid => {
        const ch = personMap[cid];
        if (ch) {
          const n = buildSubtree(ch);
          if (n) ul.appendChild(n);
        }
      });
      li.appendChild(ul);
    }
    return li;
  }
}
