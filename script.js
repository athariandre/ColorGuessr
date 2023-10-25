async function getJSON(link) {
  const res = await fetch(link);
  console.log(res);
  console.log("==========");
  let obj = await res.json();
  console.log(obj);
  return obj;
}

function getGuessColor() {
  var guess = Array.from(document.getElementById("colorpicker").value);
  //console.log(guess);
  var r = guess[1] + guess[2];
  var g = guess[3] + guess[4];
  var b = guess[5] + guess[6];
  const hexToDecimal = (hex) => parseInt(hex, 16);
  r = hexToDecimal(r);
  g = hexToDecimal(g);
  b = hexToDecimal(b);
  guess = [r, g, b];
  console.log(guess);
  return guess;
}

function getAverageColor(imgdata) {
  /* Calculate average RGB color of the image */
  var r = 0;
  var b = 0;
  var g = 0;
  for (var i = 0; i < imgdata.length; i += 4) {
    r += imgdata[i];
    g += imgdata[i + 1];
    b += imgdata[i + 2];
  }
  var pixels = imgdata.length / 4;
  r = Math.floor(r / pixels);
  g = Math.floor(g / pixels);
  b = Math.floor(b / pixels);
  return [r, g, b];
}

//returns 3-D distance between guess/answer

function getDist(arrayGuess, arrayAns) {
  let ans = Math.sqrt(
    (arrayAns[0] - arrayGuess[0]) ** 2 +
      (arrayAns[1] - arrayGuess[1]) ** 2 +
      (arrayAns[2] - arrayGuess[2]) ** 2
  );
  return ans;
}

//returns score out of 10000 based on distance

function getScore(arrayGuess, arrayAns) {
  let dist = getDist(arrayGuess, arrayAns);
  let max = Math.sqrt(3) * 255;
  let ans = 10000 - Math.round(10000 * (dist / max));
  return ans;
}

//button function - updates color picked

async function main() {
  var url = "test.json";
  url =
    "https://api.unsplash.com/photos/random?client_id=5n1FlvJwoPLW5wqIzsmFghDQ72Q0-qyiqc49dchdKIU";
  var jsondata = await getJSON(url);

  //Setting author's name to add to credits
  var authorname = document.getElementById("authorname");
  authorname.innerHTML =
    jsondata.user.first_name + " " + jsondata.user.last_name;
  document.getElementById("authorname").href = jsondata.user.links.html;

  /*
Drawing image on Canvas
*/
  var canvas = document.getElementById("myCanvas");
  var context = myCanvas.getContext("2d");
  var image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = jsondata.urls.full;

  image.onload = () => {
    canvas.width = jsondata.width;
    canvas.height = jsondata.height;
    context.drawImage(image, 0, 0);
    // Allow user to make a guess onload (stops user from guessing whenever canvas is blank and avg. color is white)
    document.getElementById("colorpicker").style.display = "inline";
    document.getElementById("confirmGuess").style.display = "inline";
    document.getElementById("colorlabel").style.display = "inline";
  };
}

function guessed() {
  var canvas = document.getElementById("myCanvas");
  var context = myCanvas.getContext("2d");
  var guessedColor = getGuessColor();
  var averageColor = getAverageColor(
    context.getImageData(0, 0, canvas.width, canvas.height).data
  );
  //finds average color

  var score = getScore(guessedColor, averageColor);
  //calculates score using player guess and actual color
  document.getElementById("confirmGuess").style.display = "none";
  //hide confirm guess button

  document.querySelector(".post-guess-modal").style.display = "flex";
  //shows modal

  document.getElementById(
    "guessedColor"
  ).style.background = `rgb(${guessedColor})`;
  //displays what color the user guessed
  document.getElementById(
    "actualColor"
  ).style.background = `rgb(${averageColor})`;
  //displays the actual color
  document.getElementById(
    "playerGuessText"
  ).innerHTML = `You guessed: (${guessedColor})`;
  //text guess color
  document.getElementById(
    "actualGuessText"
  ).innerHTML = `Actual color: (${averageColor})`;
  //text actual color
  document.getElementById("scoreText").innerHTML = `Your score: ${score}`;
  //score text
  document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("post-guess-modal").style.display = "none";
  });
  //makes the x button close the modal
}

main();
