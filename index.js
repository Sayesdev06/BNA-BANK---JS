"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

///// OPEN ACCOUNT BUTTONS

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => {
  btn.addEventListener("click", openModal);
});

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});

//// Manage Navigation bar////

// Navigate to sections using Nav links //
const nav = document.querySelector(".nav");
const navLinks = document.querySelector(".nav__links");

navLinks.addEventListener("click", function (e) {
  e.preventDefault();

  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({
      behavior: "smooth",
    });
  }
});

/// Nav Menu Animation ///

const handleHover = function (e, opacity) {
  const link = e.target;
  const parentLink = e.target.closest(".nav").querySelectorAll(".nav__link");
  parentLink.forEach((el) => {
    if (el !== link) {
      el.style.opacity = opacity;
    }
  });
};

nav.addEventListener("mouseover", function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener("mouseout", function (e) {
  handleHover(e, 1);
});

// Nav Fixed (sticky navigation) using  (IntersectionObserver) //

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height;

const stickyObs = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add("sticky");
  } else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyObs, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);

//// Scroll down to the first section using learn more button ////

const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener("click", function () {
  section1.scrollIntoView({
    behavior: "smooth",
  });
});

//// Tabbed component

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab");
  // Remove classes
  tabs.forEach((t) => {
    t.classList.remove("operations__tab--active");
  });
  tabsContent.forEach((t) => {
    t.classList.remove("operations__content--active");
  });
  // Add classes dynamically

  if (clicked) {
    clicked.classList.add("operations__tab--active");
  }

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Reval Section using  (IntersectionObserver)

const allSections = document.querySelectorAll(".section");

const revalSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
  }
};

const sectionObserver = new IntersectionObserver(revalSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

/// Lazy loading images
const imgTarget = document.querySelectorAll("img[data-src]");

const loadImg = function name(entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
  }
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTarget.forEach((img) => imageObserver.observe(img));

//////////////////////////////////////// Manage Slider
const sliders = function () {
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;
  const maxSlide = slides.length;
  const slider = document.querySelector(".slider");
  let dotContainer = document.querySelector(".dots");

  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const enableDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const roadToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // next slide
  const nextSlide = function () {
    currentSlide === maxSlide - 1 ? (currentSlide = 0) : currentSlide++;
    roadToSlide(currentSlide);
    enableDot(currentSlide);
  };

  const previousSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }

    roadToSlide(currentSlide);
    enableDot(currentSlide);
  };

  const init = function () {
    createDots();
    roadToSlide(0);
    enableDot(0);
  };
  init();

  ///Events
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", previousSlide);
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      nextSlide();
    }
    e.key === "ArrowLeft" && previousSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;

      roadToSlide(slide);
      enableDot(slide);
    }
  });
};
sliders();
