let buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // console.log(button.dataset.color);
    let card_e = new NotesCard(null, "", button.dataset.color, 20, 80);
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
