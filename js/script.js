const devices = document.querySelectorAll(".device");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");

const atmImages = {
  default: "images/atm-sign.svg",
  online: "images/atm-sign-online.svg",
  offline: "images/atm-sign-offline.svg"
};

let audioContext;

/*
  AudioContext API version:
  This does not need Howler.js or mp3 files.
  It generates small ATM-style sounds directly in the browser.
*/
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

devices.forEach(function(device) {
  device.addEventListener("click", function() {
    const deviceName = device.dataset.name;
    const currentStatus = getRandomStatus();

    updateDeviceCard(device, currentStatus);
    updateStatusPanel(deviceName, currentStatus);
    playDeviceSound(currentStatus);
  });
});

function getRandomStatus() {
  if (Math.random() < 0.5) {
    return "online";
  }

  return "offline";
}

function updateDeviceCard(device, status) {
  const image = device.querySelector(".device-image");
  const statusText = device.querySelector(".device-status");
  const deviceName = device.dataset.name;

  device.classList.remove("online", "offline");
  device.classList.add(status);

  image.src = atmImages[status];
  image.alt = deviceName + " is " + status;
  statusText.textContent = status.toUpperCase();
}

function updateStatusPanel(deviceName, status) {
  statusTitle.textContent = deviceName + " is " + status.toUpperCase();

  if (status === "online") {
    statusMessage.textContent = "This ATM is available and ready for customer transactions.";
  } else {
    statusMessage.textContent = "This ATM is currently offline and may require maintenance.";
  }
}

function playDeviceSound(status) {
  playClickSound();

  if (status === "online") {
    playOnlineSound();
  } else {
    playOfflineSound();
  }
}

function playClickSound() {
  playTone(500, 0.03, 0.02, "square", 0);
}

function playOnlineSound() {
  playTone(700, 0.08, 0.1, "sine", 0.06);
  playTone(950, 0.12, 0.1, "sine", 0.16);
}

function playOfflineSound() {
  playTone(320, 0.12, 0.1, "sine", 0.06);
  playTone(220, 0.18, 0.1, "sawtooth", 0.18);
}

function playTone(frequency, duration, volume, waveType, delay) {
  const context = getAudioContext();
  const startTime = context.currentTime + delay;
  const stopTime = startTime + duration;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = waveType;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start(startTime);
  oscillator.stop(stopTime);
}
