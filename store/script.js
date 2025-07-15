import { awards } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const lenis = new Lenis({
    autoRaf: true,
  });

  const awardsListContainer = document.querySelector(".awards-list");
  const awardPreview = document.querySelector(".award-preview");
  const awardsList = document.querySelector(".awards-list");

  const POSITIONS = {
    BOTTOM: 0,
    MIDDLE: -80,
    TOP: -160,
  };

  let lastMousePosition = { x: 0, y: 0 };
  let activeAward = null;
  let ticking = false;
  let mouseTimeout = null;
  let isMouseMoving = false;

  awards.forEach((award) => {
    const awardElement = document.createElement("a");
    awardElement.className = "award";
    awardElement.href = `cars/${award.slug}/index.html`;
    awardElement.target = "_blank";

    awardElement.innerHTML = `
      <div class="award-wrapper">
        <div class="award-name">
          <h1>${award.name}</h1>
          <h1>${award.type}</h1>
        </div>
        <div class="award-project">
          <h1>${award.project}</h1>
          <h1>${award.label}</h1>
        </div>
        <div class="award-name">
          <h1>${award.name}</h1>
          <h1>${award.type}</h1>
        </div>
      </div>
    `;
    

    awardsListContainer.appendChild(awardElement);
  });

  const awardsElements = document.querySelectorAll(".award");

  const animatePreview = () => {
    const awardsListRect = awardsList.getBoundingClientRect();
    if (
      lastMousePosition.x < awardsListRect.left ||
      lastMousePosition.x > awardsListRect.right ||
      lastMousePosition.y < awardsListRect.top ||
      lastMousePosition.y > awardsListRect.bottom
    ) {
      const previewImages = awardPreview.querySelectorAll("img");
      previewImages.forEach((img) => {
        gsap.to(img, {
          scale: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => img.remove(),
        });
      });
    }
  };

  const updateAwards = () => {
    animatePreview();

    if (activeAward) {
      const rect = activeAward.getBoundingClientRect();
      const isStillOver =
        lastMousePosition.x >= rect.left &&
        lastMousePosition.x <= rect.right &&
        lastMousePosition.y >= rect.top &&
        lastMousePosition.y <= rect.bottom;

      if (!isStillOver) {
        const wrapper = activeAward.querySelector(".award-wrapper");
        const leavingFromTop = lastMousePosition.y < rect.top + rect.height / 2;

        gsap.to(wrapper, {
          y: leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM,
          duration: 0.4,
          ease: "power2.out",
        });
        activeAward = null;
      }
    }

    awardsElements.forEach((award, index) => {
      if (award === activeAward) return;

      const rect = award.getBoundingClientRect();
      const isMouseOver =
        lastMousePosition.x >= rect.left &&
        lastMousePosition.x <= rect.right &&
        lastMousePosition.y >= rect.top &&
        lastMousePosition.y <= rect.bottom;

      if (isMouseOver) {
        const wrapper = award.querySelector(".award-wrapper");
        const enterFromTop = lastMousePosition.y < rect.top + rect.height / 2;

        gsap.to(wrapper, {
          y: POSITIONS.MIDDLE,
          duration: 0.4,
          ease: "power2.out",
        });
        activeAward = award;
      }
    });

    ticking = false;
  };

  document.addEventListener("mousemove", (e) => {
    lastMousePosition.x = e.clientX;
    lastMousePosition.y = e.clientY;

    isMouseMoving = true;
    if (mouseTimeout) {
      clearTimeout(mouseTimeout);
    }

    const awardsListRect = awardsList.getBoundingClientRect();
    const isInsideAwardsList =
      lastMousePosition.x >= awardsListRect.left &&
      lastMousePosition.x <= awardsListRect.right &&
      lastMousePosition.y >= awardsListRect.top &&
      lastMousePosition.y <= awardsListRect.bottom;

    if (isInsideAwardsList) {
      mouseTimeout = setTimeout(() => {
        isMouseMoving = false;
        const images = awardPreview.querySelectorAll("img");
        if (images.length > 1) {
          const lastImage = images[images.length - 1];
          images.forEach((img) => {
            if (img !== lastImage) {
              gsap.to(img, {
                scale: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => img.remove(),
              });
            }
          });
        }
      }, 2000);
    }

    animatePreview();
  });

  document.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateAwards();
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  awardsElements.forEach((award, index) => {
    const wrapper = award.querySelector(".award-wrapper");
    let currentPosition = POSITIONS.TOP;

    award.addEventListener("mouseenter", (e) => {
      activeAward = award;
      const rect = award.getBoundingClientRect();
      const enterFromTop = e.clientY < rect.top + rect.height / 2;

      if (enterFromTop || currentPosition === POSITIONS.BOTTOM) {
        currentPosition = POSITIONS.MIDDLE;
        gsap.to(wrapper, {
          y: POSITIONS.MIDDLE,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      const img = document.createElement("img");
      img.src = `https://img.youtube.com/vi/${awards[index].youtubeId}/hqdefault.jpg`;
      img.style.position = "absolute";
      img.style.top = 0;
      img.style.left = 0;
      img.style.scale = 0;
      img.style.zIndex = 2;


      awardPreview.appendChild(img);

      gsap.to(img, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    });

    award.addEventListener("mouseleave", (e) => {
      activeAward = null;
      const rect = award.getBoundingClientRect();
      const leavingFromTop = e.clientY < rect.top + rect.height / 2;

      currentPosition = leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM;
      gsap.to(wrapper, {
        y: currentPosition,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });
});

/* SERVICES */

import { servicesCopy } from "./services.js";
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const stickySection = document.querySelector(".sticky");
  const stickyHeight = window.innerHeight * 8;
  const services = document.querySelectorAll(".service");
  const indicator = document.querySelector(".indicator");
  const currentCount = document.querySelector("#current-count");
  const serviceImg = document.querySelector(".service-img");
  const serviceCopy = document.querySelector(".service-copy p");
  const serviceHeight = 38;
  const imgHeight = 250;

  serviceCopy.textContent = servicesCopy[0][0];
  let currentSplitText = new SplitType(serviceCopy, { types: "lines" });

  const measureContainer = document.createElement("div");
  measureContainer.style.cssText = `
      position: absolute;
      visibility: hidden;
      height: auto;
      width: auto;
      white-space: nowrap;
      font-family: "PP NeueBit";
      font-size: 60px;
      font-weight: 600;
      text-transform: uppercase;
  `;
  document.body.appendChild(measureContainer);

  const serviceWidths = Array.from(services).map((service) => {
    measureContainer.textContent = service.querySelector("p").textContent;
    return measureContainer.offsetWidth + 8;
  });

  document.body.removeChild(measureContainer);

  gsap.set(indicator, {
    width: serviceWidths[0],
    xPercent: -50,
    left: "50%",
  });

  const scrollPerService = window.innerHeight;
  let currentIndex = 0;

  const animateTextChange = (index) => {
    return new Promise((resolve) => {
      gsap.to(currentSplitText.lines, {
        opacity: 0,
        y: -20,
        duration: 0.25,
        stagger: 0.025,
        ease: "power3.inOut",
        onComplete: () => {
          currentSplitText.revert();

          const newText = servicesCopy[index][0];
          serviceCopy.textContent = newText;

          currentSplitText = new SplitType(serviceCopy, {
            types: "lines",
          });

          gsap.set(currentSplitText.lines, {
            opacity: 0,
            y: 20,
          });

          gsap.to(currentSplitText.lines, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.025,
            ease: "power3.out",
            onComplete: resolve,
          });
        },
      });
    });
  };

  ScrollTrigger.create({
    trigger: stickySection,
    start: "top top",
    end: `${stickyHeight}px`,
    pin: true,
    onUpdate: async (self) => {
      const progress = self.progress;
      gsap.set(".progress", { scaleY: progress });

      const scrollPosition = Math.max(0, self.scroll() - window.innerHeight);
      const activeIndex = Math.floor(scrollPosition / scrollPerService);

      if (
        activeIndex >= 0 &&
        activeIndex < services.length &&
        currentIndex !== activeIndex
      ) {
        currentIndex = activeIndex;

        services.forEach((service) => service.classList.remove("active"));
        services[activeIndex].classList.add("active");

        await Promise.all([
          gsap.to(indicator, {
            y: activeIndex * serviceHeight,
            width: serviceWidths[activeIndex],
            duration: 0.3,
            ease: "power3.inOut",
            overwrite: true,
          }),

          gsap.to(serviceImg, {
            y: -(activeIndex * imgHeight),
            duration: 0.3,
            ease: "power3.inOut",
            overwrite: true,
          }),

          gsap.to(currentCount, {
            innerText: activeIndex + 1,
            snap: { innerText: 1 },
            duration: 0.3,
            ease: "power3.out",
          }),

          animateTextChange(activeIndex),
        ]);
      }
    },
  });
});
