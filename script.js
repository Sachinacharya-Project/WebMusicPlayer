const search = document.querySelector('.search')
const play = document.querySelector('.play')
const info = document.querySelector('.info')
const audio = document.querySelector('audio')

const urlParser = (url)=>{
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    }
}

let errorCount = 0

const setResults = ()=>{
    const videoId = urlParser(search.value)
    fetch("https://full-ten-boysenberry.glitch.me/getYoutubeToAudio", {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ videoId }),
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        const videoLink = res['link']
        const msg = res['msg']
        const title = res['title']
        const status = res['status']
        if(status == 'ok'){
            if(msg == 'success'){
                audio.src  = `${videoLink}`
                info.innerHTML = `Audio (Titled <a href='${videoLink}' download>${title})</a> has been loaded`
                audio.play()
                errorCount = 0
                play.textContent = "Play"
            }
        }else if(status == 'processing'){
            if(errorCount >= 3){
                info.textContent = 'Could not load audio because of long duration'
                play.textContent = "Play"
                errorCount = 0
            }
            setResults(search.value)
            errorCount += 1
        }
        else{
            info.textContent = 'Could not load audio because of long duration'
            play.textContent = "Play"
            errorCount = 0
        }
    })
}

play.addEventListener('click', ()=>{
    play.textContent = "Loading"
    setResults()
    audio.addEventListener('load', ()=>{
        play.textContent = 'Play'
    })
})
