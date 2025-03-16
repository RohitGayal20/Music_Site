console.log("Lets write Javascript")
let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}





async function getSongs(folder){
currFolder=folder;
let a= await fetch(`http://127.0.0.1:3000/${folder}/`)
let response= await a.text()
let div=document.createElement("div")
div.innerHTML=response 
let as=div.getElementsByTagName("a")
 songs=[];

for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
    
    songs.push(decodeURIComponent(element.href.split(`${folder}`)[1]).trim());
    }

}



           //show all the songs in the playlist 
  let  songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
songUL.innerHTML=""
  for (const song of songs) {
  songUL.innerHTML=songUL.innerHTML+`<li> <img  class="invert" width="34" src="img/music.svg" alt="musicicon">
    <div class="info">
        <div>${song.replace(/^\//, "").replace(/^\d+\s*-\s*/, "").replaceAll("%20", " ")} </div>
        <div>Rohit</div>


    </div>
    <div class="playnow">   
      <span>Play Now</span>
    <img  class="invert"     src="img/play.svg" alt="">
  </div>
   </li> `;
  
}



//Attch an event listener to each song

Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click",element=>{
  
  playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim() )
})
})
return songs



}


const playMusic = (track,pause=false) => {
    
    currentSong.src = `/${currFolder}/` + track;
    if(!pause){
        currentSong.play();
        play.src = "img/pause.svg";
    }
  
    
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"


  


};

async function displayAlbums() {
let a= await fetch(`http://127.0.0.1:3000/songs/`)
let response= await a.text()
let div=document.createElement("div")
div.innerHTML=response;
let anchors = div.getElementsByTagName("a")

let cardContainer=document.querySelector(".cardContainer")

let array =  Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
     
    
    if(e.href.includes("/songs")){
        let folder=e.href.split("/").slice(-2)[0]
      //get the metadata of the folder 
      let a= await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
      let response= await a.json()
     console.log(response)
     cardContainer.innerHTML= cardContainer.innerHTML + ` <div   data-folder="${folder}" class="card  ">
          <div  class="play">
           
          
             <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
              <path d= "M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5" stroke-linejoin="round"/>
          
          </svg>
            
          </div>
           <img src="/songs/${folder}/cover.jpg" alt="">
          <h2>${response.title}</h2>
          <p>${response.description}</p>

        </div>`

    }
}


 //load the playlist whenever card is clicked 

 Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
    
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])

    })
})


}


//MAIN FUNCTION

 async function main(){

  

    await getSongs("songs/mixedsongs")
    
   playMusic(songs[0],true)
   
  //Display  all the albums on the page 
   displayAlbums()




 //Attach an event listener to play , next and previous



play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play();
        play.src = "img/pause.svg"; // Corrected typo
    } else {
        currentSong.pause();
        play.src = "img/play.svg"; // Corrected typo
    }
});

//listen for time update event



currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left= (currentSong.currentTime/currentSong.duration) *100 + "%";

});
//Add  an evenet listener to seekbar

document.querySelector(".seekbar").addEventListener("click", e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width) * 100 
    
    document.querySelector(".circle").style.left=percent + "%"
   currentSong.currentTime =( (currentSong.duration)* percent)/100


})

//adding an event listener for hamburger

document.querySelector(".hamburger").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="0"
})


//adding an event listener for close button

document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left="-120%"
})



// ADDING EVENT LISTENER FOR NEW PREVIOUS

previous.addEventListener("click", () => {
    console.log("Previous clicked");

    // Normalize the current song name (without leading slash)
    let currentSongName = decodeURIComponent(currentSong.src.split("/").slice(-1)[0])
        .replace(/- Copy/g, "")
        .trim();

    // Normalize all songs in the array (remove leading slash)
    let normalizedSongs = songs.map(song => decodeURIComponent(song)
        .replace(/- Copy/g, "")
        .trim()
        .replace(/^\//, "")); // Remove leading slash

    // Find the index of the current song in the array
    let index = normalizedSongs.indexOf(currentSongName);


    // Play the previous song if the index is valid
    if (index !== -1 && (index - 1) >= 0) {
        playMusic(songs[index - 1]);
    } else {
        console.log("No previous song found or index is invalid.");
    }
});





//   ADDING EVENT LISTENER FOR NEW NEXT
next.addEventListener("click", () => {
    console.log("Next clicked");

    // Normalize the current song name (without leading slash)
    let currentSongName = decodeURIComponent(currentSong.src.split("/").slice(-1)[0])
        .replace(/- Copy/g, "")
        .trim();

    // Normalize all songs in the array (remove leading slash)
    let normalizedSongs = songs.map(song => decodeURIComponent(song)
        .replace(/- Copy/g, "")
        .trim()
        .replace(/^\//, "")); // Remove leading slash

    // Find the index of the current song in the array
    let index = normalizedSongs.indexOf(currentSongName);



    // Play the next song if the index is valid
    if (index !== -1 && (index + 1) < songs.length) {
        playMusic(songs[index + 1]);
    } else {
        console.log("No next song found or index is invalid.");
    }
});



//ADD AN EVENT TO VOLUME
 document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    console.log(e,e.target,e.target.value)
    currentSong.volume=parseInt(e.target.value)/100
 })



//Add  event listener  to mute the track

document.querySelector(".volume>img").addEventListener("click", e=>{
    
if(e.target.src.includes("volume.svg")){
    e.target.src=e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume=0;
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
}

else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume=.10;
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;
}

})








}

// Call the main function
main();


     


