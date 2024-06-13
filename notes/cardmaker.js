let buttons = document.querySelectorAll(".btn");
let cards = document.querySelector(".cards-absolute");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    console.log(button.dataset.color);
    let card_e = makeCard(button.dataset.color);
    makeDraggable(card_e);
  });
});

function makeCard(color) {
  // making top
  let top_e = document.createElement("div");
  top_e.classList.add("card__top");
  let button_e = document.createElement("button");
  button_e.classList.add("card__delete-btn");
  let img_e = document.createElement("img");
  img_e.classList.add("card__delete-img");
  img_e.src = "img/delete.png";
  button_e.appendChild(img_e);
  let card_e = document.createElement("div");
  card_e.classList.add("card", "card--notes");
  card_e.dataset.color = color;
  card_e.appendChild(top_e);
  card_e.appendChild(button_e);
  cards.appendChild(card_e);
  return card_e;
}
