const root = document.documentElement;
const heroStage = document.querySelector(".hero-stage");
const revealTargets = document.querySelectorAll(".reveal");
const heroTitle = document.querySelector(".hero h1");

const setGlowPosition = (x, y) => {
  root.style.setProperty("--glow-x", `${x}px`);
  root.style.setProperty("--glow-y", `${y}px`);
};

const fitHeroTitle = () => {
  if (!heroTitle) {
    return;
  }

  const container = heroTitle.parentElement;
  if (!container) {
    return;
  }

  const containerWidth = container.clientWidth;
  if (!containerWidth) {
    return;
  }

  let size = Math.min(86, Math.max(42, containerWidth * 0.12));
  heroTitle.style.setProperty("--hero-title-size", `${size}px`);

  for (let i = 0; i < 20; i += 1) {
    const widestLine = Math.max(...Array.from(heroTitle.children).map((line) => line.scrollWidth));
    if (widestLine <= containerWidth) {
      break;
    }

    size -= 2;
    if (size <= 32) {
      size = 32;
      break;
    }

    heroTitle.style.setProperty("--hero-title-size", `${size}px`);
  }
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

window.addEventListener("resize", fitHeroTitle);

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
fitHeroTitle();
