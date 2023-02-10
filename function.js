
function clickImage(imgId){
  getLock()
  img0_src = getCleanerPath(img0.src)
  img1_src = getCleanerPath(img1.src)
  img2_src = getCleanerPath(img2.src)

  if(imgId == "0") {
    methodPreference = img0_src[0]
  } else if(imgId == "1") {
    methodPreference = img1_src[0]
  }else if(imgId == "2") {
    methodPreference = img2_src[0]
  } else {
    methodPreference = "None"
  }

  sendData({"UserName": userId,
            "Img0": img0_src, 
            "Img1": img1_src, 
            "Img2": img2_src, 
            "imgPreference": imgId,
            "methodPreference": methodPreference})

  // Delay display the next 2 images
  setTimeout(function(){
    sampleImages()
    setTimeout(function(){
      releaseLock()
    }, 500);
  }, 500);

}

function getRandomInt(max){ 
  return Math.floor(Math.random()*(max)) 
}

function getCleanerPath(path){
  /* Given a filepath, removes all directories except for the last one
      Ex. : a/b/d/e/f.txt -> e/f.txt */
  split = path.split("/")
  return split[split.length - 2] + "/" + split[split.length - 1]
}

function shuffleArray(arr){
  return arr.sort(function () {
    return Math.random() - 0.5;
  })
}

function sampleImages(){
  /* Samples and displays the same garment, draped by 3 methods: a, b, c. */
  num_renderings = 1345

  // Method order is randomized
  draping_modes = shuffleArray(["a", "b", "c"])
  // Body/garment combination is randomized
  rendering_id = getRandomInt(num_renderings)

  // Display corresponding images
  base_url = "https://raw.githubusercontent.com/drapingevaluation/drapingevaluation.github.io/assets/"
  img0.src = "https://raw.githubusercontent.com/shape2textevaluation/shape2textevaluation.github.io/main/gt/0.png"
  img1.src = "https://raw.githubusercontent.com/shape2textevaluation/shape2textevaluation.github.io/main/pred/0_0.png"
  img2.src = "https://raw.githubusercontent.com/shape2textevaluation/shape2textevaluation.github.io/main/pred/0_1.png"
}

function greyOutImages(){
  greyOutImage(img0)
  greyOutImage(img1)
  greyOutImage(img2)
  greyOutImage(imgNone)
}

function greyOutImage(img){
  img.classList.add("desaturate")
  img.classList.remove("imgHover")
}

function UNgreyOutImages(){
  UNgreyOutImage(img0)
  UNgreyOutImage(img1)
  UNgreyOutImage(img2)
  UNgreyOutImage(imgNone)
}

function UNgreyOutImage(img){
  img.classList.remove("desaturate")
  img.classList.add("imgHover")
}

function getLock(){
  img0.onclick = (event) => {}
  img1.onclick = (event) => {}
  img2.onclick = (event) => {}
  imgNone.onclick = (event) => {}
  greyOutImages()
}

function releaseLock(){
  img0.onclick = (event) => {clickImage('0')}
  img1.onclick = (event) => {clickImage('1')}
  img2.onclick = (event) => {clickImage('2')}
  imgNone.onclick = (event) => {clickImage('none')}
  UNgreyOutImages()
}

function sendData(data) {
  const XHR = new XMLHttpRequest();
  const FD = new FormData();

  // Push our data into our FormData object
  for (const [name, value] of Object.entries(data)) {
    FD.append(name, value);
  }

  // Define what happens on successful data submission
  XHR.addEventListener('load', (event) => {
    console.log('Sucessfully sent response.');
  });

  // Define what happens in case of error
  XHR.addEventListener('error', (event) => {
    alert('Oops! Something went wrong. Try refreshing the page. If the issue persists, please read the message at the bottom of the page.');
  });

  // Set up our request
  XHR.open('POST', 'https://script.google.com/macros/s/AKfycbzgoJLTCyaqrgrZ2jCHQZKymAZpW7ON1YX4nhXJ8lNyvraYf1MzJF01MIjJFWI-GQE/exec');

  // Send our FormData object; HTTP headers are set automatically
  XHR.send(FD);
}

function stringGen(len){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(getRandomInt(possible.length));
  return text;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

function userIdSetup(){
  userId = getCookie("userId")
  if(userId == ""){
    userId = stringGen(10)
    setCookie("userId", userId, 100)
  }
  return userId
}
