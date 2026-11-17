const button = document.getElementById("fullscreen");
const hint = document.getElementById("hint");

const exitLabel = window.matchMedia("(pointer: coarse)").matches
  ? "Double-tap to exit"
  : "Double-click to exit";

hint.textContent = exitLabel;

function fullscreenElement() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    null
  );
}

function requestFullscreen() {
  const root = document.documentElement;
  const request =
    root.requestFullscreen ||
    root.webkitRequestFullscreen ||
    root.msRequestFullscreen;
  if (!request) return Promise.reject(new Error("unsupported"));
  return request.call(root);
}

function exitFullscreen() {
  if (!fullscreenElement()) return;
  const exit =
    document.exitFullscreen ||
    document.webkitExitFullscreen ||
    document.msExitFullscreen;
  if (exit) exit.call(document);
}

let hintTimer = 0;

function syncChrome() {
  const active = Boolean(fullscreenElement());
  button.hidden = active;
  hint.hidden = !active;
  window.clearTimeout(hintTimer);
  if (active) {
    hint.style.animation = "none";
    void hint.offsetWidth;
    hint.style.animation = "";
    hintTimer = window.setTimeout(() => {
      hint.hidden = true;
    }, 2600);
  }
}

button.addEventListener("click", () => {
  requestFullscreen().catch(() => {
    button.textContent = "Fullscreen unavailable";
  });
});

document.addEventListener("fullscreenchange", syncChrome);
document.addEventListener("webkitfullscreenchange", syncChrome);

document.addEventListener("dblclick", (event) => {
  if (event.target === button) return;
  exitFullscreen();
});

let lastTap = 0;
document.addEventListener(
  "touchend",
  (event) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      event.preventDefault();
      lastTap = 0;
      exitFullscreen();
      return;
    }
    lastTap = now;
  },
  { passive: false }
);
