const geishas = [
  { id: 1, name: "Geisha 1", points: 2, presents: { player1: [], player2: [] }, favored: null },
  { id: 2, name: "Geisha 2", points: 2, presents: { player1: [], player2: [] }, favored: null },
  { id: 3, name: "Geisha 3", points: 2, presents: { player1: [], player2: [] }, favored: null },
  { id: 4, name: "Geisha 4", points: 3, presents: { player1: [], player2: [] }, favored: null },
  { id: 5, name: "Geisha 5", points: 3, presents: { player1: [], player2: [] }, favored: null },
  { id: 6, name: "Geisha 6", points: 4, presents: { player1: [], player2: [] }, favored: null },
  { id: 7, name: "Geisha 7", points: 5, presents: { player1: [], player2: [] }, favored: null },
];

const deck = [];
let Rounds = 1;
let isSinglePlayer = false;
let botDifficulty = null;

geishas.forEach(geisha => {
  for (let i = 0; i < geisha.points; i++) {
    deck.push({
      id: `${geisha.id}-${i + 1}`,
      geishaId: geisha.id,
      owner: null,
      revealed: false,
    });
  }
});

const player1 = {
  id: "player1",
  hand: [],
  points: 0,
  usedActions: [],
  actions: [
    { id: 1, name: "Discard 2 cards" },
    { id: 2, name: "Gift 1 card" },
    { id: 3, name: "Offer 2 piles" },
    { id: 4, name: "Keep 1, reveal rest" }
]
};

const player2 = {
  id: "player2",
  hand: [],
  points: 0,
  usedActions: [],
  actions: [
    { id: 1, name: "Discard 2 cards" },
    { id: 2, name: "Gift 1 card" },
    { id: 3, name: "Offer 2 piles" },
    { id: 4, name: "Keep 1, reveal rest" }
]
};

let tura = {
    runda: 0,
    active:player1,
}

function renderGeishasWithImages(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  geishas.forEach(geisha => {
    const geishaDiv = document.getElementById(`geisha${geisha.id}`);
    if (!geishaDiv) {
      console.warn(`Nie znaleziono diva o id geisha${geisha.id}`);
      return;
    }

    geishaDiv.style.backgroundImage = `url('graphic/geishe/geisha${geisha.id}.jpg')`;
    geishaDiv.style.backgroundSize = 'cover';
    geishaDiv.style.backgroundPosition = 'center';
    geishaDiv.style.backgroundRepeat = 'no-repeat';
  });
}

renderGeishasWithImages('geishe'); 

let lastStarter = player2;
