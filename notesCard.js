// cards storage for local backup
let cardsSave = JSON.parse(localStorage.getItem("cards-save")) || [];
console.log("Total-cards: ", cardsSave.length);
// welcome message
if (cardsSave.length === 0) {
  console.log(cardsSave);
  makePopup("info", "Welcome to Snap Notes!");
} else {
  makePopup("info", "Hey welcome back!");
}
// card container in html
const cardContainer = document.querySelector(".cards-absolute");

// for z-index of cards
zindex = 0;
class NotesCard {
  constructor(id, content, color, top, left) {
    // if id passed just take it else create one
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
    this.card = card;
    this.makeDraggable();
    card.style.top = this.top + "px";
    card.style.left = this.left + "px";
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
    // u can't delete using this bcoz it is not in dom.. so use parentNode
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
    // u don't have to look in dom, u have content in notesCard
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

  makeDraggable() {
    const notesCardObj = this;
    const card = notesCardObj.card;
    let startX = 0,
      startY = 0,
      newX = 0,
      newY = 0;
    // for devices with pointer
    card.querySelector(".card__top").addEventListener("mousedown", mouseDown);
    // for devices with touch
    card.querySelector(".card__top").addEventListener("touchstart", mouseDown);

    function mouseDown(e) {
      if (!e.target.classList.contains("card__top")) {
        // to avoid dragging for copy or delete button presses
        return;
      }
      card.style.zIndex = ++zindex;
      console.log(zindex);
      if (e.type === "touchstart") {
        // for devices with touch
        startX = e.targetTouches[0].clientX;
        startY = e.targetTouches[0].clientY;
      } else {
        // for devices with pointer
        startX = e.clientX;
        startY = e.clientY;
      }
      // console.log(startX, startY);
      card.dataset.dragging = "true";
      // for devices with pointer
      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);

      // for devices with touch
      document.addEventListener("touchmove", mouseMove, { passive: false });
      document.addEventListener("touchend", mouseUp);
    }

    function mouseMove(e) {
      if (e.type === "touchmove") {
        // for devices with touch
        e.preventDefault();
        newX = startX - e.targetTouches[0].clientX;
        newY = startY - e.targetTouches[0].clientY;
        startX = e.targetTouches[0].clientX;
        startY = e.targetTouches[0].clientY;
      } else {
        // for devices with pointer
        newX = startX - e.clientX;
        newY = startY - e.clientY;
        startX = e.clientX;
        startY = e.clientY;
      }
      // set a padding because the card has an animation to scale
      // it's better to set a padding distance
      // here it's 10px
      if (card.offsetTop - newY < 10 || card.offsetLeft - newX < 10) {
        return;
      }
      // removed right and bottom boundary due to compatibility issue
      // else if (
      //   card.offsetTop - newY >
      //     visualViewport.height - card.offsetHeight - 10 ||
      //   card.offsetLeft - newX > visualViewport.width - card.offsetWidth - 10
      // ) {
      //   return;
      // }
      // console.log({ newX, newY });
      card.style.top = card.offsetTop - newY + "px";
      card.style.left = card.offsetLeft - newX + "px";
    }

    function mouseUp() {
      notesCardObj.top = card.offsetTop;
      notesCardObj.left = card.offsetLeft;
      console.log({ top: card.offsetTop, left: card.offsetLeft });
      card.dataset.dragging = "false";
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("touchmove", mouseMove, { passive: false });
      document.removeEventListener("touchend", mouseUp);
      // console.log(notesCardObj);
      notesCardObj.saveToLocal(notesCardObj);
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
