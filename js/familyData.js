// Example genealogical data with parent-child relations
// Each object represents a person with numeric id
window.genealogyData = [
  // 1. Stammvater
  { id: 1, name: "Francois", children: [2, 3, 4, 5, 6, 7, 8, 9] },

  // Kinder von Francois
  { id: 2, name: "Elvire", parents: [1], children: [10, 11, 12] },
  { id: 3, name: "Sandra", parents: [1], children: [13, 14, 15] },
  { id: 4, name: "Vivien", parents: [1], children: [16, 17] },
  { id: 5, name: "Thierry", parents: [1], children: [18, 19] },
  { id: 6, name: "Stephanie", parents: [1], children: [20, 21] },
  { id: 7, name: "Zephirin", parents: [1], children: [22, 23, 24, 25, 26, 27] },
  { id: 8, name: "Alain", parents: [1], children: [28, 29] },
  { id: 9, name: "Judith", parents: [1], children: [30, 31, 32, 33, 34, 35] },

  // Kinder von Elvire
  { id: 10, name: "Ghais", parents: [2] },
  { id: 11, name: "Julianna", parents: [2] },
  { id: 12, name: "Djessie", parents: [2] },

  // Kinder von Sandra
  { id: 13, name: "Maeli", parents: [3] },
  { id: 14, name: "Francois", parents: [3] },
  { id: 15, name: "Dila", parents: [3] },

  // Kinder von Vivien
  { id: 16, name: "Ophelie", parents: [4] },
  { id: 17, name: "Lyam", parents: [4] },

  // Kinder von Thierry
  { id: 18, name: "Nael", parents: [5] },
  { id: 19, name: "Nayla", parents: [5] },

  // Kinder von Stephanie
  { id: 20, name: "Gabriel", parents: [6] },
  { id: 21, name: "Owen", parents: [6] },

  // Kinder von Zephirin
  { id: 22, name: "Chloe", parents: [7] },
  { id: 23, name: "Erika", parents: [7] },
  { id: 24, name: "Milenne", parents: [7] },
  { id: 25, name: "Joyce", parents: [7] },
  { id: 26, name: "Nobel", parents: [7] },
  { id: 27, name: "Ange", parents: [7] },

  // Kinder von Alain
  { id: 28, name: "Première fille", parents: [8] },
  { id: 29, name: "Deuxième fille", parents: [8] },

  // Kinder von Judith
  { id: 30, name: "Une fille", parents: [9] },
  { id: 31, name: "Fille 2", parents: [9] },
  { id: 32, name: "Troisième", parents: [9] },
  { id: 33, name: "Fille unique", parents: [9] },
  { id: 34, name: "Fille unique 1", parents: [9] },
  { id: 35, name: "Fille??", parents: [9] }
];
