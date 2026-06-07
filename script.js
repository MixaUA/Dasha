document.addEventListener('DOMContentLoaded', () => {
    // ЕЛЕМЕНТИ СТОРІНКИ
    const birthdayContent = document.getElementById('birthdayContent');
    const currentYearSpan = document.getElementById('year');
    
    const video = document.getElementById('giftVideo');
    const imageDisplay = document.getElementById('imageDisplay');
    const videoDisplay = document.getElementById('videoDisplay');
    const videoLoader = document.getElementById('videoLoader');
    
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
    let isSeeking = false; // Прапорець: чи йде зараз перемотування

    // ==========================================================================
    // КРОК 1: НАЙВИЩИЙ ПРІОРИТЕТ — МИТТЄВО ВИВОДИМО ТЕКСТ ПРИВІТАННЯ
    // ==========================================================================
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    fetch('birthday.json')
        .then(response => {
            if (!response.ok) throw new Error();
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
        .catch(() => {
            birthdayContent.innerHTML = '<div class="loading-text" style="color: red;">Не вдалося завантажити привітання. Проте ми все одно тебе міцно любимо! ❤️</div>';
        });

    // ==========================================================================
    // КРОК 2: РОБОТА З ЕКРАНАМИ ТА ТВОЇМ ЛОАДЕРОМ
    // ==========================================================================
    function resetToImageState() {
        videoDisplay.classList.add('hidden');
        videoDisplay.classList.remove('video-playing');
        videoLoader.classList.add('hidden');
        imageDisplay.classList.remove('hidden');
        isSeeking = false;
    }

    // Розумні події відео: ловимо буферизацію (завантаження), АЛЕ ігноруємо при перемотуванні
    video.addEventListener('waiting', () => {
        // Якщо відео задумалося ПІД ЧАС перемотування — лоадер НЕ вмикаємо, щоб не було блимання
        if (!video.paused && !isSeeking) {
            videoDisplay.classList.add('hidden');
            videoLoader.classList.remove('hidden'); 
        }
    });

    video.addEventListener('playing', () => {
        videoLoader.classList.add('hidden');       
        videoDisplay.classList.remove('hidden');   
        videoDisplay.classList.add('video-playing'); 
        isSeeking = false; // Перемотування точно завершено, відео грає
    });

    // Подія seeked спрацьовує, коли браузер успішно перестрибнув на потрібну секунду
    video.addEventListener('seeked', () => {
        isSeeking = false; 
    });

    // Кнопка Play / Pause
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            imageDisplay.classList.add('hidden');
            videoLoader.classList.remove('hidden'); 
            video.play().catch(() => {
                resetToImageState();
            });
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
        video.currentTime = 0;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
        resetToImageState(); 
    });

    // Кліп закінчився
    video.addEventListener('ended', () => {
        if (!isLooping) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            resetToImageState();
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

    // Рух прогрес-бара
    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    });

    // ОНОВЛЕНО: Безпечне перемотування з блокуванням помилкових викликів лоадера
    progressContainer.addEventListener('click', (e) => {
        if (video.duration) {
            isSeeking = true; // Виставляємо захист: зараз триває зміна часу!
            
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const clickPercentage = clickX / width;
            
            video.currentTime = clickPercentage * video.duration;
        }
    });
});
