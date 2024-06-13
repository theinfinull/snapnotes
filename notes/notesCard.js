let cardsSave = JSON.parse(localStorage.getItem("cards-save")) || [];
console.log("Total-cards: ", cardsSave.length);
if (cardsSave.length == 0) {
  makePopup("info", "Welcome to Snap Notes!");
} else {
  makePopup("info", "Hey welcome back!");
}
const cardContainer = document.querySelector(".cards-absolute");

// for z-index
zindex = 0;

class NotesCard {
  constructor(id, content, color, top, left) {
    this.id = id || `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.content = content;
    this.color = color;
    this.top = Number(top);
    this.left = Number(left);
    this.card = null;
  }

  createHtml() {
    // making top
    let top = document.createElement("div");
    top.classList.add("card__top");
    // making del button
    let button_del = document.createElement("button");
    button_del.classList.add("card__delete-btn");
    button_del.addEventListener("click", (e) => {
      this.deleteCard(e);
    });
    let button_copy = document.createElement("button");
    button_copy.addEventListener("click", () => {
      this.copyCard();
    });
    button_copy.classList.add("card__copy-btn");
    // making img
    let img_del = document.createElement("img");
    img_del.classList.add("card__delete-img");
    img_del.src = "img/delete.png";
    let img_copy = document.createElement("img");
    img_copy.classList.add("card__copy-img");
    img_copy.src = "img/copy.png";
    button_del.appendChild(img_del);
    button_copy.appendChild(img_copy);
    top.appendChild(button_copy);
    top.appendChild(button_del);
    // making textarea
    let textarea = document.createElement("textarea");
    textarea.classList.add("card__content");
    textarea.value = this.content;
    textarea.placeholder = "Add a note!";
    this.autoResize(textarea);
    this.updateText(textarea);
    // making card
    let card = document.createElement("div");
    card.classList.add("card", "card--notes");
    card.dataset.color = this.color;
    card.appendChild(top);
    card.appendChild(textarea);
    this.makeDraggable(card);
    card.style.top = this.top + "px";
    card.style.left = this.left + "px";
    this.card = card;
    // console.log(this);
    return card;
  }

  addCard() {
    let card = this.createHtml();
    card.style.top = this.top + "px";
    card.style.left = this.left + "px";
    cardContainer.appendChild(card);
    // makePopup("success", "Note added");
  }

  deleteCard(e) {
    console.log(e.target.parentNode.parentNode.parentNode);
    e.target.parentNode.parentNode.parentNode.setAttribute(
      "data-deleted",
      "true"
    );
    setTimeout(() => {
      cardContainer.removeChild(this.card);
    }, 300);
    makePopup("failure", "Note deleted");
    this.deleteFromLocal();
  }

  copyCard() {
    navigator.clipboard.writeText(this.content);
    makePopup("success", "Copied to clipboard");
  }

  // text area
  updateText(textarea) {
    textarea.addEventListener("input", () => {
      this.content = textarea.value;
      // console.log(`content:` + this.content);
      // console.log(`text:` + textarea.value);
      this.saveToLocal(this);
    });
  }
  autoResize(textarea) {
    textarea.addEventListener("input", () => {
      // console.log(textarea);
      // console.log(textarea.style.height);
      textarea.style.height = "auto";
      // console.log(textarea.scrollHeight);
      textarea.style.height = textarea.scrollHeight + "px";
      // console.log(textarea.scrollHeight);
    });
  }

  makeDraggable(card_e) {
    const currNotesCard = this;
    let startX = 0,
      startY = 0,
      newX = 0,
      newY = 0;
    card_e.querySelector(".card__top").addEventListener("mousedown", mouseDown);

    function mouseDown(e) {
      // console.log(e.target.classList.contains("card__top"));
      if (!e.target.classList.contains("card__top")) {
        return;
      }
      card_e.style.zIndex = ++zindex;
      console.log(zindex);
      startX = e.clientX;
      startY = e.clientY;
      console.log({ startX, startY });
      card_e.dataset.dragging = "true";
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }

    function mouseMove(e) {
      newX = startX - e.clientX;
      newY = startY - e.clientY;
      startX = e.clientX;
      startY = e.clientY;
      if (card_e.offsetTop - newY < 10 || card_e.offsetLeft - newX < 10) {
        return;
      } else if (
        card_e.offsetTop - newY >
          visualViewport.height - card_e.offsetHeight - 10 ||
        card_e.offsetLeft - newX >
          visualViewport.width - card_e.offsetWidth - 10
      ) {
        return;
      }
      card_e.style.top = card_e.offsetTop - newY + "px";
      card_e.style.left = card_e.offsetLeft - newX + "px";
    }

    function mouseUp() {
      currNotesCard.top = card_e.offsetTop;
      currNotesCard.left = card_e.offsetLeft;
      card_e.dataset.dragging = "false";
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      console.log(currNotesCard);
      currNotesCard.saveToLocal(currNotesCard);
    }
  }

  saveToLocal(card_e) {
    let hasCard = false;
    cardsSave.forEach((card) => {
      if (card_e.id == card.id) {
        hasCard = true;
        card.top = card_e.top;
        card.left = card_e.left;
        card.content = card_e.content;
        card.color = card_e.color;
      }
    });
    if (!hasCard) {
      cardsSave.push({
        id: card_e.id,
        top: card_e.top,
        left: card_e.left,
        content: card_e.content,
        color: card_e.color,
      });
    }
    localStorage.setItem("cards-save", JSON.stringify(cardsSave));
    console.log("saved: " + card_e.id);
  }

  deleteFromLocal() {
    let id = this.id;
    // console.log(id);
    cardsSave.forEach((card) => {
      if (card.id == id) {
        console.log("deleted: " + id);
        cardsSave.splice(cardsSave.indexOf(card), 1);
      }
    });
    localStorage.setItem("cards-save", JSON.stringify(cardsSave));
  }
}
