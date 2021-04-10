'use strict';

///////////////////////////////////////
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const imgTarget = document.querySelectorAll('img[data-src]');
const allSections = document.querySelectorAll('.section');
const header = document.querySelector('.header');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__link');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// Modal window //////////////////////
const openModal = function(e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//SCROLLING FEATURE/////////////////////////////////////////////////////
btnScrollTo.addEventListener('click', function(e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  //STADARD SCROLL FEATURE. WORKS WITH ALL BROWSERS, NO SMOOTH SCROLL
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  //SCROLL WITH SMOOTH ANIMATION (CREATE OBJECT) OLDSCHOOL WORKS WITH MOST BROWSERS
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });
  // MODERN WAY OF SCROLLING, WORKS ON MODERN BROWSERS ONLY
  section1.scrollIntoView({ behavior: 'smooth' });
});

//PAGE NAVIGATION /////////////////////////////////////
//1. BELOW IS NOT A SCALEABLE SOLUTION TO THIS PROBLEM. SEE NO.2 FOR EVENT DELEGATION
// document.querySelectorAll('.nav__link').forEach(function(el) {
//   el.addEventListener('click', function(e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     console.log(id);
//   });
// });

//2. EVENT DELEGATION // ADD EVENT LISTERNER TO COMMON PARENT ELEMENT
//DETERMINE WHAT ELEMENT ORIGINATED THE EVENT

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();

  //MATCHING STRATEGY
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//TABBED CONTENT /////////////////////////////////////////////////////////////

tabsContainer.addEventListener('click', function(e) {
  e.preventDefault;
  const clicked = e.target.closest('.operations__tab');
  // GAURD CLAUSE
  if (!clicked) return;
  //ACTIVE TAB
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // ACTIVATE CONETENT AREA
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//NAVIGATION MENU FADE////////////////////////////////////////////////
const handleHover = function(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// SETTING THE THIS KEYWORD: HANDLER FUNCTION CAN ONLY PASS 1 ARGUEMENT
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//STICKY NAVIGATION //////////////////////////////////////////////////
//1. NOT GREAT FOR PERFORMANCE WHEN USING THE SCROLL EVENT
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function() {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// INTERSECTION OBSERVER API/// STICKY NAV

// const obsCallback = function(entries, obserer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function(entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// REVEAL SECTIONS/ELEMENTS WHEN SCROLLING /////////////////////////////////////////////////

const revealSections = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSections, {
  root: null,
  threshold: 0.15
});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//LAZY LOAD IMAGES ////////////////////////////////////////////////////////////////

const loadImg = function(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //REPLACE WITH DATA SRC IMG
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function(e) {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0
  // rootMargin: `200px`
});

imgTarget.forEach(img => imgObserver.observe(img));

/////////SLIDER/////////////////////////////////////////////////////////////////////

const dotContainer = document.querySelector('.dots');

let curSlide = 0;

const maxSlide = slides.length - 1;

const goToSlide = function(slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

// TRACKING DOTS FOR SLIDER

const createDots = function() {
  slides.forEach((s, i) =>
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};

createDots();

const activateDot = function(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};

dotContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});

activateDot(0);

//MOVE TO THE NEXT SLIDE //

const nextSlide = function() {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

// move to previous slide

const prevSlide = function() {
  if (curSlide === 0) {
    curSlide = maxSlide;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

//keyboard event for slider

document.addEventListener('keydown', function(e) {
  console.log(e);
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

//SELECTING ELEMENTS/////////////////////////////////////////////
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// document.getElementById('section--1');
// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// //CREATING AND INSERTING ELEMENTS/////////////////////////////
// //.insertAdjacentHTML

// const message = document.createElement('div');

// message.classList.add('cookie-message');
// // message.textContent = `we use cookies for improved functionality and analytics`;
// message.innerHTML = `we use cookies for improved functionality and analytics <button class="btn btn--close-cookie">got it!</button>`;

// // header.prepend(message);
// // header.append(message);
// // header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);
// //DELETE ELEMENTS//////////////////////////////////////////////
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function() {
//     message.remove();
//   });

// //STYLES/////////////////////////////////////////////////////
// message.style.backgroundColor = 'grey';

// message.style.width = '120%';

// console.log(message.style.backgroundColor);
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //  ATRIBUTES /////////////////////////////////////
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.setAttribute('company', 'bankist');

// const link = document.querySelector('.twitter-link');
// console.log(link.href);

// //CLASSES ////////////////////////////////
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();

// const h1 = document.querySelector('h1');

// const alertH1 = function(e) {
//   alert('warning!!!');

//   h1.removeEventListener('mouseenter', alertH1);
// };

// h1.addEventListener('mouseenter', alertH1);

//OLD WAY OF LISTENING FOR EVENTS //////////////////////////
// h1.onmouseenter = function(e) {
//   alert(' on mouse enter warning!!!');
// };

//EVENT PROPOGATION //////////////////////////////////////

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav__links').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function(e) {
//   this.style.backgroundColor = randomColor();
// });

//DOM TRAVERSING ////////////////////////////////////////////////

// const h1 = document.querySelector('h1');

// //GOING DOWNWARDS: SELECTING CHILD ELEMENT
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// //GOING UPWARDS: SELECTING PARENTS.
// console.log(h1.parentNode);
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //GOING SIDEWAYS: SELECTING SIBLINGS

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function(el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });
