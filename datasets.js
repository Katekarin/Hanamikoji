const geishas = [
  { id: 1, name: "Geisha 1", points: 2, presents: { player1: [], player2: [] } },
  { id: 2, name: "Geisha 2", points: 2, presents: { player1: [], player2: [] } },
  { id: 3, name: "Geisha 3", points: 2, presents: { player1: [], player2: [] } },
  { id: 4, name: "Geisha 4", points: 3, presents: { player1: [], player2: [] } },
  { id: 5, name: "Geisha 5", points: 3, presents: { player1: [], player2: [] } },
  { id: 6, name: "Geisha 6", points: 4, presents: { player1: [], player2: [] } },
  { id: 7, name: "Geisha 7", points: 5, presents: { player1: [], player2: [] } },
];

const deck = [];

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
};

const player2 = {
  id: "player2",
  hand: [],
  points: 0,
  usedActions: [],
};


function renderGeishasWithImages(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  geishas.forEach(geisha => {
    const geishaDiv = document.getElementById(`geisha${geisha.id}`);
    if (!geishaDiv) {
      console.warn(`Nie znaleziono diva o id geisha${geisha.id}`);
      return;
    }

    // Tworzymy i dodajemy obrazek gejszy
    const img = document.createElement('img');
    img.src = `graphic/geishe/geisha${geisha.id}.jpg`;  // Dopasuj ścieżkę do swoich folderów
    img.alt = geisha.name;
    img.classList.add('geisha-img'); // opcjonalna klasa do stylowania

    geishaDiv.appendChild(img);
  });
}



renderGeishasWithImages('geishe'); 
