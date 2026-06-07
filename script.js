document.addEventListener('DOMContentLoaded', () => {
    // 1. КЕРУВАННЯ ВІДЕОПЛЕЄРОМ ТА ЕКРАНАМИ
    const video = document.getElementById('giftVideo');
    const imageDisplay = document.getElementById('imageDisplay');
    const videoDisplay = document.getElementById('videoDisplay');
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const loopBtn = document.getElementById('loopBtn');
    
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const loopInactiveIcon = document.getElementById('loopInactiveIcon');
    const loopActiveIcon = document.getElementById('loopActiveIcon');
    
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progress');
    
    let isLooping = false;

    // Повернення малюнка назад
    function showImage() {
        videoDisplay.classList.add('hidden');
        imageDisplay.classList.remove('hidden');
    }

    // Показ відео кліпу
    function showVideo() {
        imageDisplay.classList.add('hidden');
        videoDisplay.classList.remove('hidden');
    }

    // Кнопка Play / Pause
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            showVideo(); 
            video.play();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            video.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    });

    // Кнопка Stop
    stopBtn.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0; // На початок
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        showImage(); // Малюнки повертаються на місце
    });

    // Кліп завершився — автоматично повертаємо малюнки з анімацією
    video.addEventListener('ended', () => {
        if (!isLooping) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            showImage();
        }
    });

    // Кнопка Повтору (Loop)
    loopBtn.addEventListener('click', () => {
        isLooping = !isLooping;
        video.loop = isLooping;
        
        if (isLooping) {
            loopBtn.classList.add('active');
            loopInactiveIcon.classList.add('hidden');
            loopActiveIcon.classList.remove('hidden');
        } else {
            loopBtn.classList.remove('active');
            loopInactiveIcon.classList.remove('hidden');
            loopActiveIcon.classList.add('hidden');
        }
    });

    // Оновлення прогрес-бара під час відтворення відео
    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    });

    // ПЕРЕМОТУВАННЯ КЛІКОМ/ТАПОМ ПО ПРОГРЕС-БАРУ
    progressContainer.addEventListener('click', (e) => {
        if (video.duration) {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickPercentage = clickX / width;
            
            if (video.paused) {
                showVideo();
            }
            
            video.currentTime = clickPercentage * video.duration;
        }
    });

    // 2. ЗАВАНТАЖЕННЯ ПРИВІТАННЯ З JSON ФАЙЛУ
    const birthdayContent = document.getElementById('birthdayContent');
    const currentYearSpan = document.getElementById('year');
    
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    fetch('birthday.json')
        .then(response => {
            if (!response.ok) throw new Error('Помилка завантаження привітання');
            return response.json();
        })
        .then(data => {
            birthdayContent.innerHTML = ''; 
            if (data.paragraphs && Array.isArray(data.paragraphs)) {
                data.paragraphs.forEach(text => {
                    const p = document.createElement('p');
                    p.textContent = text;
                    birthdayContent.appendChild(p);
                });
            }
        })
        .catch(error => {
            console.error(error);
            birthdayContent.innerHTML = '<div class="loading-text" style="color: red;">Не вдалося завантажити привітання. Проте ми все одно тебе міцно любимо! ❤️</div>';
        });
});
