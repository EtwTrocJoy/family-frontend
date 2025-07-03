function linkFamily(persons) {
  const byId = {};
  persons.forEach(p => {
    byId[p.id] = p;
    p.children = p.children ? p.children.slice() : [];
    p.parents = p.parents ? p.parents.slice() : [];
  });

  // Replace children id lists with object references
  persons.forEach(p => {
    p.childObjs = p.children.map(cid => byId[cid]).filter(Boolean);
  });

  // Build parent links as object references
  persons.forEach(p => {
    p.parentObjs = p.parents.map(pid => byId[pid]).filter(Boolean);
  });

  return persons;
}

if (typeof module !== 'undefined') {
  module.exports = { linkFamily };
}
