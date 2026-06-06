document.addEventListener("DOMContentLoaded", () => {
    // Автоматичне встановлення поточного року у футер
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 1. ЗАВАНТАЖЕННЯ ТЕКСТУ З JSON
    const contentContainer = document.getElementById("birthdayContent");

    fetch("birthday.json")
        .then(response => {
            if (!response.ok) throw new Error("Не вдалося завантажити файл привітання");
            return response.json();
        })
        .then(data => {
            contentContainer.innerHTML = ""; // Очищаємо текст завантаження
            data.paragraphs.forEach(text => {
                const p = document.createElement("p");
                p.textContent = text;
                contentContainer.appendChild(p);
            });
        })
        .catch(error => {
            console.error(error);
            contentContainer.innerHTML = "<div class='loading-text'>Не вдалося завантажити привітання. Але ми тебе дуже любимо!</div>";
        });

    // 2. ЛОГІКА АУДІОПЛЕЄРА
    const audio = document.getElementById("giftAudio");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const playIcon = document.getElementById("playIcon");
    const pauseIcon = document.getElementById("pauseIcon");
    const stopBtn = document.getElementById("stopBtn");
    const loopBtn = document.getElementById("loopBtn");
    const loopInactiveIcon = document.getElementById("loopInactiveIcon");
    const loopActiveIcon = document.getElementById("loopActiveIcon");
    const progressBar = document.getElementById("progress");
    const progressContainer = document.querySelector(".progress-container");

    // Відтворення / Пауза
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playIcon.classList.add("hidden");
            pauseIcon.classList.remove("hidden");
        } else {
            audio.pause();
            playIcon.classList.remove("hidden");
            pauseIcon.classList.add("hidden");
        }
    });

    // Зупинка
    stopBtn.addEventListener("click", () => {
        audio.pause();
        audio.currentTime = 0;
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
        progressBar.style.width = "0%";
    });

    // Режим повтору (Зацикленість)
    loopBtn.addEventListener("click", () => {
        audio.loop = !audio.loop;
        if (audio.loop) {
            loopInactiveIcon.classList.add("hidden");
            loopActiveIcon.classList.remove("hidden");
        } else {
            loopInactiveIcon.classList.remove("hidden");
            loopActiveIcon.classList.add("hidden");
        }
    });

    // Оновлення прогрес-бару
    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
    });

    // Перемотування кліком по прогрес-бару
    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    });

    // Скидання іконки після завершення треку (якщо повтор вимкнено)
    audio.addEventListener("ended", () => {
        if (!audio.loop) {
            playIcon.classList.remove("hidden");
            pauseIcon.classList.add("hidden");
            progressBar.style.width = "0%";
        }
    });
});
