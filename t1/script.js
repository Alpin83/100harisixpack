let timers = {};
let seconds = {};

function latihanHari(hari) {
  // Latihan bervariasi berdasarkan hari
  return [
    { name: "Jumping Jacks", type: "durasi", value: 30 },
    { name: "Plank", type: "durasi", value: 30 + hari },
    { name: "Sit-up", type: "repetisi", value: 15 + Math.floor(hari / 2) },
    { name: "Leg Raises", type: "repetisi", value: 15 + Math.floor(hari / 3) },
    { name: "Russian Twist", type: "repetisi", value: 20 + Math.floor(hari / 4) },
  ];
}

function loadDay() {
  const day = parseInt(document.getElementById("day").value);
  const container = document.getElementById("exercise-container");
  container.innerHTML = `<h2>Hari ke-${day}</h2>`;

  const exercises = latihanHari(day);
  exercises.forEach((ex, index) => {
    const id = `d${day}-e${index}`;
    const label = ex.type === "durasi" ? `${ex.value} detik` : `${ex.value} repetisi`;
    container.innerHTML += `
      <div class="exercise">
        <h3>${index + 1}. ${ex.name} – ${label}</h3>
        <div class="stopwatch">
          <span id="timer-${id}">00:00</span><br>
          <button onclick="startTimer('${id}')">Mulai</button>
          <button onclick="pauseTimer('${id}')">Pause</button>
          <button onclick="resetTimer('${id}')">Reset</button>
        </div>
      </div>
    `;
  });
}

function updateDisplay(id) {
  const mins = String(Math.floor(seconds[id] / 60)).padStart(2, '0');
  const secs = String(seconds[id] % 60).padStart(2, '0');
  document.getElementById(`timer-${id}`).textContent = `${mins}:${secs}`;
}

function startTimer(id) {
  if (!timers[id]) {
    if (!seconds[id]) seconds[id] = 0;

    // Ambil hari dan index dari id
    const [dayPart, exPart] = id.split('-');
    const day = parseInt(dayPart.substring(1));
    const exIndex = parseInt(exPart.substring(1));
    const exercise = latihanHari(day)[exIndex];

    // Jika jenisnya durasi, set alarm saat waktu habis
    if (exercise.type === "durasi") {
      const targetSeconds = exercise.value;
      timers[id] = setInterval(() => {
        seconds[id]++;
        updateDisplay(id);

        if (seconds[id] >= targetSeconds) {
          pauseTimer(id);
          document.getElementById("alarm-audio").play();
          alert(`⏰ Waktu untuk ${exercise.name} selesai!`);
        }
      }, 1000);
    } else {
      // Untuk repetisi, hanya stopwatch biasa
      timers[id] = setInterval(() => {
        seconds[id]++;
        updateDisplay(id);
      }, 1000);
    }
  }
}

function pauseTimer(id) {
  clearInterval(timers[id]);
  timers[id] = null;
}

function resetTimer(id) {
  pauseTimer(id);
  seconds[id] = 0;
  updateDisplay(id);
}

window.onload = () => {
  document.getElementById("day").value = "1";
  loadDay();
};