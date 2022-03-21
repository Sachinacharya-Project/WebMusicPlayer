const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
mainAudio = wrapper.querySelector("#main-audio"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = progressArea.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
moreMusicBtn = wrapper.querySelector("#more-music"),
closemoreMusic = musicList.querySelector("#close");

const main = ()=>{
    fetch("./playlist.json", {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(response => {
        const LocalmusicList = response['list']
        loadMusic(LocalmusicList)
    })
}

const urlParser = (url)=>{
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
}

const loadMusic = (urlList, data = {},index=0, redirected=false)=>{
    if(redirected){
        const link = data['link']
        const msg = data['msg']
        const status = data['status']
        const duration = data['duration']
        const title = data['title']
        const thumbnail = `https://img.youtube.com/vi/${urlParser(urlList)}/maxresdefault.jpg`

        if(data['progress'] != 0){
            console.log("Request is still pending...please wait for moments")
            setTimeout(()=>{
                getMusicData(urlList[index], loadMusic)
            }, 1000)
        }
        musicName.innerText = title;
        musicArtist.innerText = "Sachin Acharya";
        musicImg.src = thumbnail;
        mainAudio.src = link;
    }else{
        getMusicData(urlList[index], loadMusic)
    }
}

const getMusicData = (url, cb)=>{
    const videoId = urlParser(url)
    // Video data from url
    fetch("https://full-ten-boysenberry.glitch.me/getYoutubeToAudio", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ videoId }),
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
        // console.log(res);
        const msg = res['msg']
        const status = res['status']
        if(status == 'ok'){
            if(msg == 'success'){
                console.log(url)
                loadMusic(url, res, 0, true) 
            }
        }else{
            // Long audio of more than 2 hr duration are not allowed [151.72033333333 min]
            // loadMusic(url, res['msg'], 0,redirect = true) 
        }
    })
}
main()
