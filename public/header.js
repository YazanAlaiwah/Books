const hamburgerrr = document.querySelector('.hamburgerrr');
const firstLine = document.querySelector('.hamburgerrr .line:first-child');
const lastLine = document.querySelector('.hamburgerrr .line:last-child');
const secondLine = document.querySelector('.hamburgerrr .line:nth-child(2)');
const popup = document.querySelector('.popup');
hamburgerrr.addEventListener('click', function () {
  if (hamburgerrr.classList.contains('transformed')) {
    console.log('if');
    hamburgerrr.classList.remove('transformed');
    popup.classList.toggle('popup1');
    firstLine.style.animationName = 'firstLineReverse';
    lastLine.style.animationName = 'lastLineReverse';
    secondLine.style.animation = 'appear 500ms ease-in-out forwards';
  } else {
    console.log('else');
    hamburgerrr.classList.add('transformed');
    popup.classList.toggle('popup1');

    firstLine.style.animationName = 'firstLine';
    lastLine.style.animationName = 'lastLine';
    secondLine.style.animation = 'disappear 0ms ease-in-out 250ms forwards';
  }
});