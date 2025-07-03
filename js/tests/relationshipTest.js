const { linkFamily } = require('../family');

// Construct simple family
const persons = [
  { id: 1, name: 'Parent', children: [2] },
  { id: 2, name: 'Child', parents: [1], children: [3] },
  { id: 3, name: 'Grandchild', parents: [2] }
];

linkFamily(persons);

const byId = Object.fromEntries(persons.map(p => [p.id, p]));

console.assert(byId[1].childObjs[0] === byId[2], 'Parent should link to child');
console.assert(byId[2].parentObjs[0] === byId[1], 'Child should link to parent');
console.assert(byId[2].childObjs[0] === byId[3], 'Child should link to grandchild');
console.assert(byId[3].parentObjs[0] === byId[2], 'Grandchild should link to parent');

console.log('All tests passed.');
