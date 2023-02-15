function clickImage(imgId){
  getLock()
  img0_src = getCleanerPath(img0.src)
  img1_src = getCleanerPath(img1.src)

  if(imgId == "0") {
    methodPreference = img0_src[0]
  } else if(imgId == "1") {
    methodPreference = img1_src[0]
  } else {
    methodPreference = "None"
  }

  console.log('username: ', userId)
  console.log('preference: ', imgId)
  console.log('img0: ', img0_id)
  console.log('img1: ', img1_id)
  console.log('target: ', target)
  console.log('text: ', text)
  console.log('dataset: ', dataset)

  // save data we care about
  sendData({"username": userId,
            "preference": imgId})

  // Delay display the next 2 images
  // If first time this gt is shown => display now the same pair (no shuffle now) with the other text
  setTimeout(function(){
    newSampleImages()
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

function displayText(file, idx) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      const lines = data.split('\n')
      const line = lines[idx]
      console.log(line)
      // Display the line on the website:
      document.getElementById("Text").innerText = line
    })
}

function newSampleImages(){

  fetch('./all_data.json')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // pick random element from data
    idx = getRandomInt(data.length)
    gt_id = data[idx].gt_id
    dist_id = data[idx].dist_id
    text = data[idx].text
    dataset = data[idx].dataset
    task = data[idx].task
    base_url = "https://raw.githubusercontent.com/shape2textevaluation/shape2textevaluation.github.io/main/"
    base_url = 'http://localhost:8081/'

    // Method order is randomized
    var shapes = shuffleArray([gt_id, dist_id])
    if (shapes[0]==gt_id) // target is used to remember which shape is GT
    {
      target = 0
    }
    else
    {
      target = 1
    }

    // save model_ids of images
    img0_id = shapes[0]
    img1_id = shapes[1]

    // display images
    img0.src = base_url + "shapes/" + img0_id + ".png"
    img1.src = base_url + "shapes/" + img1_id + ".png"
    img0.src = base_url + "/" + img0_id + "/" + img0_id + ".png"
    img1.src = base_url + "/" + img1_id + "/" + img1_id + ".png"


    // display text
    document.getElementById("Text").innerText = text
  })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error)
  })
}

function sampleImages(){
  
      // Samples and displays a text description and two different objects 
      var num_gt    = 2
      var num_dist  = 3

      // Method order is randomized
      var shapes = shuffleArray(["gt", "dist"])
      var text_prompts = shuffleArray(["t2s", "gpt2s"])
      var dataset = text_prompts[0] // will contain t2s or gpt2s

      // Shapes combination is randomized
      var gt_id = getRandomInt(num_gt)
      var dist_id = getRandomInt(num_dist)

      var seen_gt = gt_id
      var seen_dist = dist_id
      var seen_text = dataset

  // Display corresponding images
  base_url = "https://raw.githubusercontent.com/shape2textevaluation/shape2textevaluation.github.io/main/"
  if (shapes[0]=="gt") 
      {
        img0.src = base_url + "shapes/" + "gt" + "/" + gt_id + ".png"
        img1.src = base_url + "shapes/" + "dist" + "/" + gt_id + "_" + dist_id + ".png"
      }
  else 
      {
        img1.src = base_url + "shapes/" + "gt" + "/" + gt_id + ".png"
        img0.src = base_url + "shapes/" + "dist" + "/" + gt_id + "_" + dist_id + ".png"
      }
      
  var file = base_url + dataset + ".txt"  // will be .../t2s.txt or .../gpt2s.txt
  // display text
  displayText(file, gt_id)
}

function greyOutImages(){
  greyOutImage(img0)
  greyOutImage(img1)
  greyOutImage(imgNone)
}

function greyOutImage(img){
  img.classList.add("desaturate")
  img.classList.remove("imgHover")
}

function UNgreyOutImages(){
  UNgreyOutImage(img0)
  UNgreyOutImage(img1)
  UNgreyOutImage(imgNone)
}

function UNgreyOutImage(img){
  img.classList.remove("desaturate")
  img.classList.add("imgHover")
}

function getLock(){
  img0.onclick = (event) => {}
  img1.onclick = (event) => {}
  imgNone.onclick = (event) => {}
  greyOutImages()
}

function releaseLock(seen_text, seen_gt, seen_dist){
  img0.onclick = (event) => {clickImage('0')}
  img1.onclick = (event) => {clickImage('1')}
  imgNone.onclick = (event) => {clickImage('none')}
  UNgreyOutImages()
}

function sendData(data) {
  console.log('sending data...')
  const XHR = new XMLHttpRequest();
  const FD = new FormData();

  // Push our data into our FormData object
  for (const [name, value] of Object.entries(data)) {
    FD.append(name, value);
  }
  console.log("FD")
  console.log(FD)

  // Define what happens on successful data submission
  XHR.addEventListener('load', (event) => {
    console.log('Sucessfully sent response.');
  });

  // Define what happens in case of error
  XHR.addEventListener('error', (event) => {
    alert('Oops! Something went wrong. Try refreshing the page. If the issue persists, please read the message at the bottom of the page.');
  });

  // Set up our request
  //XHR.open('POST', 'https://script.google.com/macros/s/AKfycbzgoJLTCyaqrgrZ2jCHQZKymAZpW7ON1YX4nhXJ8lNyvraYf1MzJF01MIjJFWI-GQE/exec');

  // Set up request to my Google Sheet
  XHR.open('POST', 'https://script.google.com/macros/s/AKfycbzJKxXXfkYJsXXaKZR6dau837x0DKo76M0GeMz1Up9lt-qonPuB0E9TXN_gS1AdI9Ua7Q/exec');

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