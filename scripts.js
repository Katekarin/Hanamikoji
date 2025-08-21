function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderCardToHand(playerId, card) {
  const handDiv = document.querySelector(`#${playerId} .cards`);
  if (!handDiv) return;

  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");

  const isActivePlayer = playerId === tura.active.id;

  if (isActivePlayer) {
    cardDiv.textContent = `G${card.geishaId}`;
    cardDiv.style.backgroundColor = "#f0f0f0";
  } else {
    cardDiv.textContent = "❓";
    cardDiv.style.backgroundColor = "#999";
  }

  handDiv.appendChild(cardDiv);
}



function updateDeckCounter() {
  const counter = document.getElementById("deckCounter");
  counter.textContent = deck.length;
}

function drawCard(player) {
  if (deck.length === 0) {
    console.warn("Talia jest pusta!");
    return;
  }

  const drawnCard = deck.shift();
  drawnCard.owner = player.id;
  drawnCard.revealed = true;
  player.hand.push(drawnCard);

  console.log(`${player.id} dobrał kartę Geishy ${drawnCard.geishaId}`);

  renderCardToHand(player.id, drawnCard);

  updateDeckCounter()
}

function selectCards(player, numberToSelect, callback) {
  const handDiv = document.querySelector(`#${player.id} .cards`);
  const cards = handDiv.querySelectorAll('.card');
  let selected = [];

  cards.forEach((cardDiv, index) => {
    cardDiv.classList.add('selectable');
    cardDiv.addEventListener('click', function onClick() {
      if (selected.includes(index)) return;

      cardDiv.style.outline = '3px solid #0f0';
      selected.push(index);

      if (selected.length === numberToSelect) {
        cards.forEach(c => {
          c.classList.remove('selectable');
          c.style.outline = '';
          c.replaceWith(c.cloneNode(true)); // usunięcie eventów
        });

        callback(selected.map(i => player.hand[i]));
      }});});}

function endTurn() {
  tura.active = (tura.active === player1) ? player2 : player1;

  console.log("Nowa tura. Gracz aktywny:", tura.active.id);
  
  drawCard(tura.active);
  redrawHand(player1);
  redrawHand(player2, true);

  updateActivePlayerHighlight();

  const allCardsUsed = player1.hand.length === 0 && player2.hand.length === 0 && deck.length === 0;
  if (allCardsUsed) {
    endRound();
    return;
  }

  if (isSinglePlayer && tura.active === player2) {
    setTimeout(botPlayTurn, 500);
  }
}


function startGameSingle(level) {
  console.log("Start gry single player. Poziom trudności:", level);
  isSinglePlayer = true;
  botDifficulty = level;
  startGame();
}


function startGame(mode) {
  shuffle(deck);

  const hiddenCard = deck.shift();
  hiddenCard.revealed = false;
  hiddenCard.owner = null;
  console.log("Usunięto jedną zakrytą kartę z gry.");

  for (let i = 0; i < 7; i++) {
    drawCard(player1);
    drawCard(player2);
  }

  tura.runda = 1;

  if (mode === 'singlePlayer') {
    player1.isBot = true;
    player2.isBot = false;
    tura.active = player1;
  } else {
    player1.isBot = false;
    player2.isBot = false;
    tura.active = player1;
  }

  updateDeckCounter();
  updateActivePlayerHighlight();

  if (tura.active.isBot) {
    setTimeout(() => botTurn(), 1000);
  } else {
    console.log("Rozpoczęto grę. Gracz 1 zaczyna.");
  }
  console.log("Talia start nowej rundy:", deck.length);
console.log("Ręka P1:", player1.hand.length);
console.log("Ręka P2:", player2.hand.length);

}


function redrawHand(player, hideCards = false) {
  const handContainer = document.querySelector(`#${player.id} .cards`);
  handContainer.innerHTML = "";

  player.hand.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    if (hideCards && player.id === "player2") {
      cardDiv.textContent = "❓";
      cardDiv.style.backgroundColor = "#999";
    } else {
      cardDiv.textContent = `G${card.geishaId}`;
    }

    handContainer.appendChild(cardDiv);
  });
}


function assignCardToGeisha(card, playerId) {
  const geisha = geishas.find(g => g.id === card.geishaId);
  if (!geisha) return;

  if (!geisha.presents) {
    geisha.presents = { player1: [], player2: [] };
  }

  geisha.presents[playerId].push(card);

  const geishaDiv = document.getElementById(`geisha${card.geishaId}`);
  if (!geishaDiv) return;

  const targetZone = geishaDiv.querySelector(playerId === "player1" ? ".presentsP1" : ".presentsP2");
  const present = document.createElement("div");
  present.classList.add("present");
  present.textContent = "🎁";

  targetZone.appendChild(present);
}

function showModal(container, message) {
  const modal = document.getElementById("modal");
  modal.classList.remove("hidden");
  container.innerHTML = `<h3>${message}</h3>`;
}

function assignCardsToGeisha(cards, playerId) {
  cards.forEach(card => assignCardToGeisha(card, playerId));
}

function removeCardsFromHand(player, cardsToRemove) {
  cardsToRemove.forEach(card => {
    const idx = player.hand.indexOf(card);
    if (idx !== -1) player.hand.splice(idx, 1);
  });
}

function handleAction(player, actionType) {
  if (player.usedActions.includes(actionType)) {
    return;
  }

  if (!player || !player.id) {
    console.error("Nieprawidłowy gracz w handleAction");
    return;
  }

  switch (actionType) {
    case "action1": // Zachowaj 1
      handleKeepOne(player)
      console.log('action1')
      break;
    case "action2": // Odrzuć 2
      handleDiscardTwo(player)
      console.log('action2')
      break;
    case "action3": // Podział 2/2
      handleSplitTwoTwo(player)
      console.log('action3')
      break;
    case "action4": // Podział 2/1
      handleSplitThreeOne(player);
      console.log('action4');
      break;
    }

  player.usedActions.push(actionType);  

}


function updateActivePlayerHighlight() {
  document.querySelectorAll('.player').forEach(p => p.classList.remove('activePlayer'));
  document.getElementById(tura.active.id).classList.add('activePlayer');
}

document.querySelectorAll(".action").forEach(action => {
  action.addEventListener("click", () => {
    const actionType = action.classList[1];

    const playerDiv = action.closest(".player");
    const playerId = playerDiv.id;

    const owner = playerId.replace("player", "");

    if ("player"+owner !== tura.active.id) {
      alert("To nie Twój żeton! Użyj swojego.");
      return;
    }

    handleAction(tura.active, actionType);
     action.classList.add("used");
  });
});

function endRound() {
  console.log("Runda zakończona!");

  if (Rounds === 3) {
    checkGameEnd();
  }
  Rounds++;
  player1.points = 0;
  player2.points = 0;

  setTimeout(() => {
    geishas.forEach(geisha => {
      const gDiv = document.getElementById(`geisha${geisha.id}`);
      if (!gDiv) {
        console.warn(`Nie znaleziono elementu geisha${geisha.id}`);
        return;
      }

      gDiv.classList.remove("favoredP1", "favoredP2");
      geisha.favored = null;

      const p1 = geisha.presents.player1.length;
      const p2 = geisha.presents.player2.length;

      if (p1 > p2) {
        geisha.favored = "player1";
        gDiv.classList.add("favoredP1");
        player1.points += geisha.points;
      } else if (p2 > p1) {
        geisha.favored = "player2";
        gDiv.classList.add("favoredP2");
        player2.points += geisha.points;
      }
    });

    document.querySelector("#player1 .points").textContent = `${player1.points} pkt`;
    document.querySelector("#player2 .points").textContent = `${player2.points} pkt`;

    tura.runda += 1;
    console.log("Start nowej rundy:", tura.runda);

    [player1, player2].forEach(p => {
      p.hand = [];
      p.usedActions = [];
    });

    deck.length = 0;
    geishas.forEach(geisha => {
      geisha.presents.player1 = [];
      geisha.presents.player2 = [];
      const gDiv = document.getElementById(`geisha${geisha.id}`);
      gDiv.querySelector(".presentsP1").innerHTML = '';
      gDiv.querySelector(".presentsP2").innerHTML = '';
    });

    document.querySelectorAll('.cards, .hiddenCards, #discardPile').forEach(c => c.innerHTML = '');

    geishas.forEach(geisha => {
      for (let i = 0; i < geisha.points; i++) {
        deck.push({
          id: `${geisha.id}-${i + 1}-r${tura.runda}`,
          geishaId: geisha.id,
          owner: null,
          revealed: false
        });
      }
    });

    shuffle(deck);
    const hiddenCard = deck.shift();
    hiddenCard.revealed = false;

    for (let i = 0; i < 7; i++) {
      drawCard(player1);
      drawCard(player2);
    }

    updateDeckCounter();

    tura.active = (lastStarter === player1) ? player2 : player1;
    lastStarter = tura.active;

    updateActivePlayerHighlight();

    if (tura.active === player2) {
      setTimeout(() => botPlayTurn(), 800);
    }

    document.querySelectorAll(".action").forEach(action => action.classList.remove("used"));

  }, 2000);
}

function showVictoryScreen(winnerId) {
  const modal = document.getElementById("modal");
  const container = document.getElementById("choiceZone") || document.querySelector(".modal-content");

  modal.classList.remove("hidden");

  if (winnerId === "player1") {
    container.innerHTML = `<h2>🎉 Zwycięstwo! 🎉</h2><p>Wygrał <strong>${player1.name || "Gracz 1"}</strong>!</p>`;
  } else if (winnerId === "player2") {
    container.innerHTML = `<h2>🎉 Zwycięstwo! 🎉</h2><p>Wygrał <strong>${player2.name || "Gracz 2"}</strong>!</p>`;
  } else {
    container.innerHTML = `<h2>🤝 Remis!</h2><p>Żaden gracz nie zdobył przewagi.</p>`;
  }
}


function checkGeishaMajority() {
  let p1GeishaCount = 0;
  let p2GeishaCount = 0;

  geishas.forEach(g => {
    if (g.favored === "player1") p1GeishaCount++;
    else if (g.favored === "player2") p2GeishaCount++;
  });

  if (p1GeishaCount > p2GeishaCount) return showVictoryScreen("player1");
  if (p2GeishaCount > p1GeishaCount) return showVictoryScreen("player2");

  return showVictoryScreen(null);
}


function checkGameEnd() {
  if (tura.runda < 3) return;

  const p1Points = player1.points;
  const p2Points = player2.points;

  if (p1Points >= 11 && p2Points >= 11) {
    return checkGeishaMajority();
  }

  if (p1Points >= 11) return showVictoryScreen("player1");
  if (p2Points >= 11) return showVictoryScreen("player2");

  return checkGeishaMajority();
}

