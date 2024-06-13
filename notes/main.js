const cardsArr = Array.from(document.querySelectorAll(".card"));
cardsArr.forEach((card) => makeDraggable(card));

function makeDraggable(card_e) {
  let startX = 0,
    startY = 0;
  newX = 0;
  newY = 0;
  card_e.addEventListener("mousedown", mouseDown);

  function mouseDown(e) {
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
      card_e.offsetLeft - newX > visualViewport.width - card_e.offsetWidth - 10
    ) {
      return;
    }
    card_e.style.top = card_e.offsetTop - newY + "px";
    card_e.style.left = card_e.offsetLeft - newX + "px";
  }

  function mouseUp() {
    card_e.dataset.dragging = "false";
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  }
}
