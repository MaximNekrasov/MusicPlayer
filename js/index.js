const API_URL = 'http://localhost:3024/'

let dataMusic = [];
let playList = [];

const favoriteList = localStorage.getItem('favorite')
  ? JSON.parse(localStorage.getItem('favorite'))
  : [];

const audio = new Audio();
const favoriteBtn = document.querySelector('.header__favorite-btn');
const headerLogo = document.querySelector('.header__logo');
const tracksCard = document.getElementsByClassName('track');
const catalogContainer = document.querySelector('.catalog__container');
const player = document.querySelector('.player');
const pauseBtn = document.querySelector('.player__controller-pause');
const stopBtn = document.querySelector('.player__controller-stop');
const prevBtn = document.querySelector('.player__controller-prev');
const nextBtn = document.querySelector('.player__controller-next');
const likeBtn = document.querySelector('.player__controller-like');
const muteBtn = document.querySelector('.player__controller-mute');
const playerProgressInput = document.querySelector('.player__progress-input');

const playerTimePassed = document.querySelector('.player__time-passed');
const playerTimeTotal = document.querySelector('.player__time-total');
const playerVolumeInput = document.querySelector('.player__volume-input');

const search = document.querySelector('.search');

const catalogAddBtn = document.createElement('button');
catalogAddBtn.classList.add('catalog__btn-add')
catalogAddBtn.innerHTML = `
  <span>Увидеть все</span>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/>  
`;              


const pausePlayer = () => {
  const trackActive = document.querySelector('.track_active')

  if (audio.paused) {
    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    trackActive.classList.remove('track_pause');
  } else {
    audio.pause();
    pauseBtn.classList.add('player__icon_play');
    trackActive.classList.add('track_pause');
  }
};

const playMusic = (event) => {
    event.preventDefault();
 
    const trackActive = event.currentTarget;

    if (trackActive.classList.contains('track_active')) {
      pausePlayer();
      return
    }
    
    let i = 0;
    const id = trackActive.dataset.idTrack;

    const index = favoriteList.indexOf(id)
    if (index !== -1) {
      likeBtn.classList.add('player__icon_like_active')
    } else {
      likeBtn.classList.remove('player__icon_like_active')
    };

    const track = playList.find((item, index) => {
      i = index;
      return id === item.id;
    });

    audio.src = `${API_URL}${track.mp3}`;

    audio.play();
    pauseBtn.classList.remove('player__icon_play');
    player.classList.add('player_active');
    player.dataset.idTrack = id;

    const prevTrack = i === 0 ? playList.length - 1 : i - 1;
    const nextTrack = i + 1 === playList.length ? 0 : i + 1;
    prevBtn.dataset.idTrack = playList[prevTrack].id;
    nextBtn.dataset.idTrack = playList[nextTrack].id;
    likeBtn.dataset.idTrack = id;

    for (let i = 0; i < tracksCard.length; i++) {
      if (id === tracksCard[i].dataset.idTrack) {
        tracksCard[i].classList.add('track_active');
      } else {
        tracksCard[i].classList.remove('track_active');
      }        
    };
    
};

const addHandlerTrack = () => {
  for (let i = 0; i < tracksCard.length; i++) {

    tracksCard[i].addEventListener('click', playMusic);
  }
};

pauseBtn.addEventListener('click', pausePlayer);

stopBtn.addEventListener('click', () => {
  player.classList.remove('player_active');
  audio.src = '';
  document.querySelector('.track_active').classList.remove('track_active')
})

const createCard = (data) => {
  const card = document.createElement('a');
  card.href = '#';
  card.classList.add('catalog__item', 'track');
  if (player.dataset.idTrack === data.id) {
    card.classList.add('track_active');
    if (audio.paused) {
      card.classList.add('track_pause');

    }
  }
  card.dataset.idTrack = data.id;

  card.innerHTML = `
    <div class="track__img-wrap">
      <img src="${API_URL}${data.poster}" alt="${data.artist} ${data.track}" class="track__poster">
    </div>
    <div class="track__info track-info">
      <p class="track-info__title">${data.track}</p>
      <p class="track-info__artist">${data.artist}</p>
    </div>
  `;

  return card
};

const renderCatalog = (dataList) => {
    playList = [...dataList];
    catalogContainer.textContent = '';
    const listCards = dataList.map(createCard);
    catalogContainer.append(...listCards);
    addHandlerTrack();
};

const checkCount = (i = 1) => {
  tracksCard[0]
  if(catalogContainer.clientHeight > tracksCard[0].clientHeight * 3) {
    tracksCard[tracksCard.length - i].style.display = 'none';
    checkCount(i + 1);
  } else if(i !== 1) {
      catalogContainer.append(catalogAddBtn);   
  }
};

const updateTime = () => {
  const duration = audio.duration;
  const currentTime = audio.currentTime;
  const progress = (currentTime / duration) * 1000;
  playerProgressInput.value = progress ? progress : 0;

  const minutesPassed = Math.floor(currentTime / 60) || '0';
  const secondsPassed = Math.floor(currentTime % 60) || '0';

  const minutesDuration = Math.floor(duration / 60) || '0';
  const secondsDuration = Math.floor(duration % 60) || '0';

  playerTimePassed.textContent = `${minutesPassed}:${secondsPassed < 10 ? '0' + secondsPassed : secondsPassed}`
  playerTimeTotal.textContent = `${minutesDuration}:${secondsDuration < 10 ? '0' + secondsDuration : secondsDuration}`

}


const init = async () => {
    audio.volume = localStorage.getItem('volume') || 1;
    playerVolumeInput.value = audio.volume * 100;

    dataMusic = await fetch(`${API_URL}api/music`).then((data) => data.json());


    renderCatalog(dataMusic);
    checkCount();

    catalogAddBtn.addEventListener('click', () => {
      [...tracksCard].forEach((trackCard) => {
        trackCard.style.display = '';
        catalogAddBtn.remove();
      });
    });

    prevBtn.addEventListener('click', playMusic);
    nextBtn.addEventListener('click', playMusic);

    audio.addEventListener('ended', () => {
      nextBtn.dispatchEvent(new Event('click', {bubbles: true}));
    });


    audio.addEventListener('timeupdate', updateTime);

    playerProgressInput.addEventListener('change', () => {
      const progress = playerProgressInput.value;
      audio.currentTime = (progress / 1000) * audio.duration;
    })

    favoriteBtn.addEventListener('click', () => {
      const data = dataMusic.filter((item) => favoriteList.includes(item.id));
      renderCatalog(data);
      checkCount();
  
    });

    headerLogo.addEventListener('click', () => {
      renderCatalog(dataMusic);
      checkCount();  
    });


    likeBtn.addEventListener('click', () => {
      const index = favoriteList.indexOf(likeBtn.dataset.idTrack)
      if (index === -1) {
        favoriteList.push(likeBtn.dataset.idTrack);
        likeBtn.classList.add('player__icon_like_active')
      } else {
        favoriteList.splice(index, 1);
        likeBtn.classList.remove('player__icon_like_active')
      }

      localStorage.setItem('favorite', JSON.stringify(favoriteList));
    });

    playerVolumeInput.addEventListener('input', () => {
      const value = playerVolumeInput.value;
      audio.volume = value / 100;
    })

    muteBtn.addEventListener('click', () => {
      if (audio.volume) {
        localStorage.setItem('volume', audio.volume);
        audio.volume = 0;
        muteBtn.classList.add('player__icon_mute-off');
        playerVolumeInput.value = 0;
      } else {
        audio.volume = localStorage.getItem('volume');
        muteBtn.classList.remove('player__icon_mute-off');
        playerVolumeInput.value = audio.volume * 100;
      }
    });

    search.addEventListener('submit', async (event) => {
      event.preventDefault();

      playList = await fetch(`${API_URL}api/music?search=${search.search.value}`).then((data) => data.json());

      renderCatalog(playList);
      checkCount();

    })
};

init();


