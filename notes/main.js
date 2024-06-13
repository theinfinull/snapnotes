let newX = 0,
  newY = 0;
startX = 0;
startY = 0;
offsetTop = 0;
offsetLeft = 0;

const card_e = document.querySelector(".card");

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
