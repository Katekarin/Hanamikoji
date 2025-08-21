function botPlayTurn() {
  console.log("Bot gra turę.");

  // Dostępne akcje bota (po nazwach)
  let available = player2.actions
    .map(a => a.name) // pobieramy tylko nazwy
    .filter(name => !player2.usedActions.includes(name));

  if (available.length === 0) {
    console.warn("Bot nie ma już dostępnych akcji.");
    return;
  }

  // Losowa akcja
  const action = available[Math.floor(Math.random() * available.length)];
  console.log("Bot wybrał akcję:", action);

  // Losuje n kart z ręki
  function pickRandomCards(player, n) {
    const handCopy = [...player.hand];
    const picked = [];
    for (let i = 0; i < n && handCopy.length > 0; i++) {
      const idx = Math.floor(Math.random() * handCopy.length);
      picked.push(handCopy.splice(idx, 1)[0]);
    }
    // Usuwamy z ręki
    picked.forEach(card => {
      const index = player.hand.indexOf(card);
      if (index !== -1) player.hand.splice(index, 1);
    });
    return picked;
  }

  // easyBot.js
window.easyBot = {
  botChooseStack(player, stacks) {
    return Math.random() > 0.5 ? 0 : 1;
  }
};


  // Obsługa akcji
  switch (action) {
    case "Discard 2 cards":
      handleDiscardTwo(player2, pickRandomCards(player2, 2));
      break;

    case "Gift 1 card":
      handleSplitThreeOne(player2, pickRandomCards(player2, 3));
      break;

    case "Offer 2 piles":
      handleSplitTwoTwo(player2, pickRandomCards(player2, 4));
      break;

    case "Keep 1, reveal rest":
      handleKeepOne(player2, pickRandomCards(player2, 1));
      break;
  }

  player2.usedActions.push(action);

}
