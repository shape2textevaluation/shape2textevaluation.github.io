
function clickImage(imgId, seen_text, seen_gt, seen_dist){
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

  console.log('inside clickImage')
  console.log(seen_text)
  console.log(seen_gt)
  console.log(seen_dist)
  
  // save data we care about
  /*
  sendData({"UserName": userId,
            "Img0": img0_src, 
            "Img1": img1_src, 
            "imgPreference": imgId,
            "methodPreference": methodPreference,
            "dataset": seen_text})
  */
  // Delay display the next 2 images
  // If first time this gt is shown => display now the same pair (no shuffle now) with the other text
  setTimeout(function(){
    sampleImages(seen_text, seen_gt, seen_dist)
    setTimeout(function(){
      releaseLock(seen_text, seen_gt, seen_dist)
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
      document.getElementById("Text").innerHTML = line
    })
}

function sampleImages(seen_text, seen_gt, seen_dist){
  
  console.log('inside SampleImages(...)')
  console.log(seen_text)
  console.log(seen_gt)
  console.log(seen_dist)

  if (seen_text.innerHTML == 't2s' || seen_text.innerHTML == 'gpt2s')
    {
      console.log('building double pair of shape with different text')
      if (seen_text.innerHTML == 't2s')
      {
        var dataset = 'gpt2s'
      }
      else
      {
        var dataset = 't2s'
      }
        var gt_id   = seen_gt.innerHTML
        var dist_id = seen_dist.innerHTML
        seen_text = "None"
        console.log(gt_id)
        console.log(dist_id)

    }
  else
  {
      // Samples and displays a text description and two different objects 
      num_gt    = 2
      num_dist  = 3

      // Method order is randomized
      shapes = shuffleArray(["gt", "dist"])
      text_prompts = shuffleArray(["t2s", "gpt2s"])
      var dataset = text_prompts[0] // will contain t2s or gpt2s

      // Shapes combination is randomized
      var gt_id = getRandomInt(num_gt)
      var dist_id = getRandomInt(num_dist)

      var seen_gt = gt_id
      var seen_dist = dist_id
      var seen_text = dataset
  }

  // Display corresponding images
  base_url = "https://raw.githubusercontent.com/shape2textevaluation/shape2textevaluation.github.io/main/"
  if (shapes[0]=="gt") 
      {
        img0.src = base_url + "/shapes/" + shapes[0] + "/" + gt_id + ".png"
        //img0.src = draping_modes[0] + "_" + draping_modes[1]
        img1.src = base_url + "/shapes/" + shapes[1] + "/" + gt_id + "_" + dist_id + ".png"
      }
  else 
      {
        img1.src = base_url + "/shapes/" + shapes[1] + "/" + gt_id + ".png"
        img0.src = base_url + "/shapes/" + shapes[0] + "/" + gt_id + "_" + dist_id + ".png"
      }
      
  var file = base_url + dataset + ".txt"  // will be .../t2s.txt or .../gpt2s.txt
  // display text
  displayText(file, gt_id)
  
  console.log('saving vars')
  console.log(seen_text)
  console.log(seen_gt)
  console.log(seen_dist)
  document.getElementById("seen_gt").innerHTML = seen_gt
  document.getElementById("seen_dist").innerHTML = seen_dist      
  document.getElementById("seen_text").innerHTML = seen_text
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
  img0.onclick = (event) => {clickImage('0', seen_text, seen_gt, seen_dist)}
  img1.onclick = (event) => {clickImage('1', seen_text, seen_gt, seen_dist)}
  imgNone.onclick = (event) => {clickImage('none', seen_text, seen_gt, seen_dist)}
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