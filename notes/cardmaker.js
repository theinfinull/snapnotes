let buttons = document.querySelectorAll(".btn");

// this makes sure the card doesn't overlap while creation.
let createOffset = 0;

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // console.log(button.dataset.color);
    let card_e = new NotesCard(
      null,
      "",
      button.dataset.color,
      20 + createOffset,
      80 + createOffset
    );
    // increase the offset
    createOffset += 16;
    card_e.addCard();
    makePopup("success", "Note added");
    // console.log(card_e.top, card_e.left);
    card_e.saveToLocal(card_e);
  });
});

cardsSave.forEach((cardSave) => {
  let card_e = new NotesCard(
    cardSave.id,
    cardSave.content,
    cardSave.color,
    cardSave.top,
    cardSave.left
  );
  card_e.addCard();
});
