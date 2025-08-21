function handleKeepOne(player, selectedCards) {
  if (!selectedCards) {
    // tryb gracza
    return selectCards(player, 1, (cards) => handleKeepOne(player, cards));
  }

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
  endTurn();
}

function handleDiscardTwo(player, selectedCards) {
  if (!selectedCards) {
    return selectCards(player, 2, (cards) => handleDiscardTwo(player, cards));
  }

  selectedCards.forEach(card => {
    const idx = player.hand.indexOf(card);
    if (idx !== -1) player.hand.splice(idx, 1);
  });

  const discardPile = document.getElementById("discardPile");
  selectedCards.forEach(() => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    discardPile.appendChild(cardDiv);
  });

  redrawHand(player);
  endTurn();
}

function handleSplitTwoTwo(player, selectedCards) {
  if (!selectedCards) {
    return selectCards(player, 4, (cards) => handleSplitTwoTwo(player, cards));
  }

  const modal = document.getElementById("modal");
  const container = document.getElementById("choiceZone");

  const stack1 = selectedCards.slice(0, 2);
  const stack2 = selectedCards.slice(2, 4);

  const stacks = [stack1, stack2];
  const opponent = (player.id === "player1") ? player2 : player1;

  if (opponent.id === "player2") {
    const choiceIndex = window.easyBot.botChooseStack(opponent, stacks);
    const chosen = stacks[choiceIndex];
    const other = stacks[1 - choiceIndex];

    assignCardsToGeisha(chosen, opponent.id);
    assignCardsToGeisha(other, player.id);
    removeCardsFromHand(player, selectedCards);

    redrawHand(player);
    redrawHand(opponent);

    endTurn();
    return;
  }

  showModal(container, "Przeciwnik wybiera jeden ze stosów:");
  stacks.forEach((stack, index) => {
    const stackDiv = document.createElement("div");
    stackDiv.classList.add("stackChoice");

    stack.forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card");
      cardDiv.textContent = `G${card.geishaId}`;
      stackDiv.appendChild(cardDiv);
    });

    stackDiv.addEventListener("click", () => {
      assignCardsToGeisha(stack, opponent.id);
      assignCardsToGeisha(stacks[1 - index], player.id);
      removeCardsFromHand(player, selectedCards);

      modal.classList.add("hidden");
      container.innerHTML = "";

      redrawHand(player);
      redrawHand(opponent);

      endTurn();
    });

    container.appendChild(stackDiv);
  });
}



function handleSplitThreeOne(player, selectedCards) {
  if (!selectedCards) {
    return selectCards(player, 3, (cards) => handleSplitThreeOne(player, cards));
  }

  const playerPresents = selectedCards.slice(0, 2);
  const opponentCard = selectedCards[2];
  const opponent = (player.id === "player1") ? player2 : player1;

  const allSelected = [...playerPresents, opponentCard];
  allSelected.forEach(card => {
    const idx = player.hand.indexOf(card);
    if (idx !== -1) player.hand.splice(idx, 1);
  });

  playerPresents.forEach(card => assignCardToGeisha(card, player.id));
  assignCardToGeisha(opponentCard, opponent.id);

  redrawHand(player);
  redrawHand(opponent);

  endTurn();
}
