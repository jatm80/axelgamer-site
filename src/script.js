const grid = document.getElementById("video-grid");
const modal = document.getElementById("video-modal");
const player = document.getElementById("video-player");
const videoLink = document.getElementById("video-link");
const closeTriggers = document.querySelectorAll("[data-close-modal='true']");

function youtubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1`;
}

function youtubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}

function openModal(id, title) {
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  player.src = youtubeEmbedUrl(id);
  player.title = title;
  videoLink.href = youtubeWatchUrl(id);
  document.getElementById("modal-title").textContent = title;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  player.src = "";
  document.body.style.overflow = "";
}

if (grid) {
  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-video-id]");
    if (!button) return;
    openModal(button.dataset.videoId, button.dataset.videoTitle);
  });
}

closeTriggers.forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
  }
});
