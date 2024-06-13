const popupContainer = document.querySelector(".popupcontainer");

function makePopup(type, message) {
  if (type !== "success" && type !== "failure" && type !== "info") {
    return;
  }
  let popup = document.createElement("div");
  popup.classList.add("popup");
  popup.dataset.type = type;

  let img = document.createElement("img");
  img.classList.add("popup__img");
  if (type === "success") {
    img.src = "img/success.png";
  } else if (type === "failure") {
    img.src = "img/failure.png";
  } else if (type === "info") {
    img.src = "img/info.svg";
  }
  let p = document.createElement("p");
  p.classList.add("popup__text");
  p.textContent = message;
  popup.appendChild(img);
  popup.appendChild(p);
  popupContainer.appendChild(popup);

  //   animate
  setTimeout(() => {
    popup.dataset.visible = "true";
  }, 100);
  setTimeout(() => {
    popup.dataset.visible = "false";
    setTimeout(() => {
      popupContainer.removeChild(popup);
    }, 500);
  }, 3000);
}
