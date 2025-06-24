let tura = {
    runda: 0,
    active:player1
}

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

  // 👁️ Zawartość karty
  if (card.revealed) {
    cardDiv.textContent = `G${card.geishaId}`;
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
  drawnCard.revealed = true; // lub false, jeśli ma być zakryta

  player.hand.push(drawnCard);

  console.log(`${player.id} dobrał kartę Geishy ${drawnCard.geishaId}`);

  // 🔽 Dodaj kartę do HTML
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
        // wyczyść selecty i kliknięcia
        cards.forEach(c => {
          c.classList.remove('selectable');
          c.style.outline = '';
          c.replaceWith(c.cloneNode(true)); // usunięcie eventów
        });

        callback(selected.map(i => player.hand[i]));
      }
    });
  });
}

function endTurn() {
  // Zmiana aktywnego gracza
  tura.active = (tura.active.id === "player1") ? player2 : player1;
  console.log("Nowa tura. Gracz aktywny:", tura.active.id);

  // Dobranie karty dla nowego aktywnego gracza
  drawCard(tura.active);

  // Podświetlenie aktywnego gracza
  updateActivePlayerHighlight();
}

function startGame() {
  shuffle(deck);

  // Usuwamy 1 kartę z talii (zakrytą)
  const hiddenCard = deck.shift();
  hiddenCard.revealed = false;
  hiddenCard.owner = null;
  console.log("Usunięto jedną zakrytą kartę z gry.");

  for (let i = 0; i < 6; i++) {
    drawCard(player1);
    drawCard(player2);
  }

  tura.runda = 1;
  tura.active = player1;

  updateDeckCounter();
  updateActivePlayerHighlight()
}

function redrawHand(player) {
  const handDiv = document.querySelector(`#${player.id} .cards`);
  handDiv.innerHTML = '';
  player.hand.forEach(card => renderCardToHand(player.id, card));
}

function assignCardToGeisha(card, playerId) {
  const geishaDiv = document.getElementById(`geisha${card.geishaId}`);
  if (!geishaDiv) return;

  const targetZone = geishaDiv.querySelector(playerId === "player1" ? ".presentsP1" : ".presentsP2");
  const present = document.createElement("div");
  present.classList.add("present");
  present.textContent = "🎁"; // lub `G${card.geishaId}` jeśli chcesz to pokazać

  targetZone.appendChild(present);
}

function handleKeepOne(player) {
  alert("Wybierz jedną kartę, którą chcesz zakryć (przechować).");

  selectCards(player, 1, (selectedCards) => {
    const hiddenCard = selectedCards[0];
    hiddenCard.revealed = false;

    const idx = player.hand.indexOf(hiddenCard);
    if (idx !== -1) player.hand.splice(idx, 1);

    const hiddenZone = document.querySelector(`#${player.id} .hiddenCards`);
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.textContent = "❓";
    cardDiv.style.backgroundColor = "#333";
    hiddenZone.appendChild(cardDiv);

    redrawHand(player);
  });
  endTurn()
}

function handleDiscardTwo(player) {
  alert("Wybierz 2 karty do odrzucenia.");

  selectCards(player, 2, (selectedCards) => {
    // Usuń z ręki
    selectedCards.forEach(card => {
      const idx = player.hand.indexOf(card);
      if (idx !== -1) player.hand.splice(idx, 1);
    });

    // Dodaj zakryte do stosu odrzuconych
    const discardPile = document.getElementById("discardPile");

    selectedCards.forEach(() => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      discardPile.appendChild(cardDiv);
    });

    // Odśwież rękę
    redrawHand(player);
  });
  endTurn()
}

function handleSplitTwoTwo(player) {
  alert("Wybierz 4 karty do podziału 2/2.");

  selectCards(player, 4, (selectedCards) => {
    alert("Podziel wybrane 4 karty na dwa stosy po 2 karty.");

    // Pozwól graczowi stworzyć 2 stosy po 2 karty
    let stack1 = [];
    let stack2 = [];

    const chooseStack = (remainingCards) => {
      selectCards({ id: player.id, hand: remainingCards }, 2, (firstStack) => {
        stack1 = firstStack;
        stack2 = remainingCards.filter(card => !stack1.includes(card));

        // Usuń z ręki gracza
        selectedCards.forEach(card => {
          const idx = player.hand.indexOf(card);
          if (idx !== -1) player.hand.splice(idx, 1);
        });

        // Przeciwnik wybiera stos
        const opponent = (player.id === "player1") ? player2 : player1;
        alert(`${opponent.id}: wybierz jeden ze stosów`);

        // Pokazanie stosów do wyboru
        const bothStacks = [stack1, stack2];

        // tymczasowe przetwarzanie (np. przycisków) – uproszczenie:
        const modal = document.getElementById("modal");
        const container = document.getElementById("choiceZone");
        modal.classList.remove("hidden");
        container.innerHTML = '';


        bothStacks.forEach((stack, index) => {
          const stackDiv = document.createElement("div");
          stackDiv.classList.add("stackChoice");
          stack.forEach(card => {
            const c = document.createElement("div");
            c.classList.add("card");
            c.textContent = `G${card.geishaId}`;
            stackDiv.appendChild(c);
          });

          stackDiv.addEventListener("click", () => {
  // Przypisz prezenty do odpowiednich gejsz
  stack.forEach(card => assignCardToGeisha(card, opponent.id));
  bothStacks[1 - index].forEach(card => assignCardToGeisha(card, player.id));

  // Zamknij modal
  modal.classList.add("hidden");
  container.innerHTML = '';

  // Odśwież ręce (na wypadek gdyby coś jeszcze tam zostało)
  redrawHand(player);
  redrawHand(opponent);
});


          container.appendChild(stackDiv);
        });
      });
    };

    chooseStack(selectedCards);
  });
  endTurn()
}

function handleSplitThreeOne(player) {
  alert("Wybierz 4 karty do podziału 3/1.");

  selectCards(player, 4, (selectedCards) => {
    alert("Podziel wybrane 4 karty na dwa stosy: 3 i 1.");

    let stack3 = [];
    let stack1 = [];

    const chooseStack = (remainingCards) => {
      selectCards({ id: player.id, hand: remainingCards }, 3, (firstStack) => {
        stack3 = firstStack;
        stack1 = remainingCards.filter(card => !stack3.includes(card));

        // Usuń z ręki gracza
        selectedCards.forEach(card => {
          const idx = player.hand.indexOf(card);
          if (idx !== -1) player.hand.splice(idx, 1);
        });

        const opponent = (player.id === "player1") ? player2 : player1;
        alert(`${opponent.id}: wybierz jeden ze stosów.`);

        const bothStacks = [stack3, stack1];

        const modal = document.getElementById("modal");
        const container = document.getElementById("choiceZone");
        modal.classList.remove("hidden");
        container.innerHTML = '';

        bothStacks.forEach((stack, index) => {
          const stackDiv = document.createElement("div");
          stackDiv.classList.add("stackChoice");
          stack.forEach(card => {
            const c = document.createElement("div");
            c.classList.add("card");
            c.textContent = `G${card.geishaId}`;
            stackDiv.appendChild(c);
          });

          stackDiv.addEventListener("click", () => {
            stack.forEach(card => assignCardToGeisha(card, opponent.id));
            bothStacks[1 - index].forEach(card => assignCardToGeisha(card, player.id));

            modal.classList.add("hidden");
            container.innerHTML = '';

            redrawHand(player);
            redrawHand(opponent);
          });

          container.appendChild(stackDiv);
        });
      });
    };

    chooseStack(selectedCards);
  });
  endTurn()
}

function handleSplitThreeOne(player) {
  alert("Wybierz 3 karty, które chcesz rozdzielić (1 oddasz przeciwnikowi, 2 zachowasz).");

  selectCards(player, 3, (selectedCards) => {
    alert("Wybierz 1 kartę, którą oddasz przeciwnikowi jako prezent.");

    selectCards({ id: player.id, hand: selectedCards }, 1, (opponentCardArray) => {
      const opponentCard = opponentCardArray[0];
      const playerCards = selectedCards.filter(card => card !== opponentCard);

      // Usuń wszystkie 3 karty z ręki gracza
      selectedCards.forEach(card => {
        const idx = player.hand.indexOf(card);
        if (idx !== -1) player.hand.splice(idx, 1);
      });

      // Ustal przeciwnika
      const opponent = (player.id === "player1") ? player2 : player1;

      // Przypisz karty jako prezenty
      assignCardToGeisha(opponentCard, opponent.id);
      playerCards.forEach(card => assignCardToGeisha(card, player.id));

      // Odśwież ręce
      redrawHand(player);
      redrawHand(opponent);
      endTurn()
    });
  });
}

function handleAction(player, actionType) {
  if (player.usedActions.includes(actionType)) {
    alert("Ta akcja została już użyta!");
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
    case "action4": // Podział 3/1
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

startGame()

document.querySelectorAll(".action").forEach(action => {
  action.addEventListener("click", () => {
    const actionType = action.classList[1]; // np. "action1"
    handleAction(tura.active, actionType);
  });
});