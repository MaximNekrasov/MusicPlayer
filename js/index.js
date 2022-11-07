const dataMusic = [
    {
      id: '1',
      artist: 'The weekend',
      track: 'Save your tears',
      poster: 'img/photo1.jpg',
      mp3: 'audio/The Weeknd - Save Your Tears.mp3',
    },
    {
      id: '2',
      artist: 'Imagine Dragons',
      track: 'Follow You',
      poster: 'img/photo2.jpg',
      mp3: 'audio/Imagine Dragons - Follow You.mp3',
    },
    {
      id: '3',
      artist: 'Tove Lo',
      track: 'How Long',
      poster: 'img/photo3.jpg',
      mp3: 'audio/Tove Lo - How Long.mp3',
    },
    {
      id: '4',
      artist: 'Tom Odell',
      track: 'Another Love',
      poster: 'img/photo4.jpg',
      mp3: 'audio/Tom Odell - Another Love.mp3',
    },
    {
      id: '5',
      artist: 'Lana Del Rey',
      track: 'Born To Die',
      poster: 'img/photo5.jpg',
      mp3: 'audio/Lana Del Rey - Born To Die.mp3',
    },
    {
      id: '6',
      artist: 'Adele',
      track: 'Hello',
      poster: 'img/photo6.jpg',
      mp3: 'audio/Adele - Hello.mp3',
    },
    {
      id: '7',
      artist: 'Tom Odell',
      track: "Can't Pretend",
      poster: 'img/photo7.jpg',
      mp3: "audio/Tom Odell - Can't Pretend.mp3",
    },
    {
      id: '8',
      artist: 'Lana Del Rey',
      track: 'Young And Beautiful',
      poster: 'img/photo8.jpg',
      mp3: 'audio/Lana Del Rey - Young And Beautiful.mp3',
    },
    {
      id: '9',
      artist: 'Adele',
      track: 'Someone Like You',
      poster: 'img/photo9.jpg',
      mp3: 'audio/Adele - Someone Like You.mp3',
    },
    {
      id: '10',
      artist: 'Imagine Dragons',
      track: 'Natural',
      poster: 'img/photo10.jpg',
      mp3: 'audio/Imagine Dragons - Natural.mp3',
    },
    {
      id: '11',
      artist: 'Drake',
      track: 'Laugh Now Cry Later',
      poster: 'img/photo11.jpg',
      mp3: 'audio/Drake - Laugh Now Cry Later.mp3',
    },
    {
      id: '12',
      artist: 'Madonna',
      track: 'Frozen',
      poster: 'img/photo12.jpg',
      mp3: 'audio/Madonna - Frozen.mp3',
    },
  ];

const audio = new Audio();
const tracksCard = document.getElementsByClassName('track');
const player = document.querySelector('.player');
const pauseBtn = document.querySelector('.player__controller-pause');
const stopBtn = document.querySelector('.player__controller-stop');

const playMusic = (event) => {
    const trackActive = event.currentTarget;

    audio.src = trackActive.dataset.track;
    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    player.classList.add('player_active');

    for (let i = 0; i < tracksCard.length; i++) {
        tracksCard[i].classList.remove('track_active');
    }

    trackActive.classList.add('track_active');
};

for (let i = 0; i < tracksCard.length; i++) {
    tracksCard[i].addEventListener('click', playMusic);
}

pauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        pauseBtn.classList.remove('player__icon_play');
    } else {
        audio.pause();
        pauseBtn.classList.add('player__icon_play');
    }
});

stopBtn.addEventListener('click', () => {
    player.classList.remove('player_active');
    audio.src = '';
})




