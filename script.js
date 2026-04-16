const root = document.documentElement;
const heroStage = document.querySelector(".hero-stage");
const revealTargets = document.querySelectorAll(".reveal");

const setGlowPosition = (x, y) => {
  root.style.setProperty("--glow-x", `${x}px`);
  root.style.setProperty("--glow-y", `${y}px`);
};

window.addEventListener("pointermove", (event) => {
  setGlowPosition(event.clientX, event.clientY);

  if (!heroStage) {
    return;
  }

  const rect = heroStage.getBoundingClientRect();
  const insideX = event.clientX >= rect.left && event.clientX <= rect.right;
  const insideY = event.clientY >= rect.top && event.clientY <= rect.bottom;

  if (!insideX || !insideY) {
    heroStage.style.transform = "";
    return;
  }

  const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
  const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
  heroStage.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

window.addEventListener("pointerleave", () => {
  if (heroStage) {
    heroStage.style.transform = "";
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealTargets.forEach((target) => observer.observe(target));
