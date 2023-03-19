async function getJSON(url) {
  const res = await fetch(url);
  let obj = res.json();
  return obj;
}

async function main() {
  /* Getting JSON Data from url */
  var url = test.json();
  //url = "https://api.unsplash.com/photos/random?client_id=5n1FlvJwoPLW5wqIzsmFghDQ72Q0-qyiqc49dchdKIU";
  var jsondata = await getJSON(url);
  /* Setting up canvas */
  var canvas = document.getElementById("picCanvas");
  var context = canvas.getContext("2d");
  var image = new Image();
  image.crossOrigin = "Anonymous";
  image.src = jsondata.urls.full;

  image.onload = () => {
    canvas.width = jsondata.width;
    canvas.height = jsondata.height;
    context.drawImage(image, 0, 0);
  };
}

main();
