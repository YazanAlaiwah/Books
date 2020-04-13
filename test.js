const hamburgerrr = document.querySelector(".hamburgerrr");
const firstLine = document.querySelector(".hamburgerrr .line:first-child");
const lastLine = document.querySelector(".hamburgerrr .line:last-child");
const secondLine = document.querySelector(".hamburgerrr .line:nth-child(2)");

hamburgerrr.addEventListener("click", function() {
  if (hamburgerrr.classList.contains("transformed")) {
    hamburgerrr.classList.remove("transformed");

    firstLine.style.animationName = "firstLineReverse";
    lastLine.style.animationName = "lastLineReverse";
    secondLine.style.animation = "appear 500ms ease-in-out forwards";
  } else {
    hamburgerrr.classList.add("transformed");

    firstLine.style.animationName = "firstLine";
    lastLine.style.animationName = "lastLine";
    secondLine.style.animation = "disappear 0ms ease-in-out 250ms forwards";
  }
});
