const start = Date.now();

  window.addEventListener("load", function () {
    const elapsed = Date.now() - start;
    const minTime = 1000; // 1s minimum

    const delay = Math.max(minTime - elapsed, 0);

    setTimeout(() => {
      document.body.classList.remove("loading");

      const preloader = document.querySelector(".preloader");
      if (preloader) {
        preloader.style.opacity = "0";
        setTimeout(() => preloader.style.display = "none", 500);
      }
    }, delay);
  });

  document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector(".cd-words-wrapper");
    if (!wrapper) return;

    const words = Array.from(wrapper.querySelectorAll("b"));
    if (words.length < 2) return;

    let index = words.findIndex(w => w.classList.contains("is-visible"));
    if (index < 0) index = 0;

    const displayTime = 3000;   // how long a word stays visible
    const leaveTime = 650;      // must match fallForward duration

    setInterval(() => {
      const current = words[index];
      const nextIndex = (index + 1) % words.length;
      const next = words[nextIndex];

      // animate current out
      current.classList.remove("is-entering");
      current.classList.add("is-leaving");

      // after it "falls", swap visibility
      setTimeout(() => {
        current.classList.remove("is-visible", "is-leaving");
        current.classList.add("is-hidden");

        next.classList.remove("is-hidden");
        next.classList.add("is-visible", "is-entering");

        // clean entering class after animation
        setTimeout(() => next.classList.remove("is-entering"), 360);

        index = nextIndex;
      }, leaveTime);

    }, displayTime);
  });

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("[data-animate]");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
});


document.getElementById('sidebar_contact_form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Message sent!'); // This will simulate sending the form.
});
document.addEventListener("DOMContentLoaded", function() {
    // Select the container and all the images
    const imgContainer = document.querySelector('.img');
    const images = document.querySelectorAll('.img img');

    // State variables to track the current image and rotation
    let currentIndex = 0;
    let currentRotation = 0;

    // Ensure the first image is visible on load
    if (images.length > 0) {
        images[currentIndex].classList.add('active');
    }

    /**
     * Function to handle the flip animation and image switching.
     */
    function flipImage() {
        // Calculate the next rotation angle for a continuous forward flip
        currentRotation += 180;

        // Apply the rotation to the container, triggering the CSS transition
        imgContainer.style.transform = `rotateY(${currentRotation}deg)`;

        // Set a timer to switch the image exactly halfway through the flip.
        // The CSS transition is 0.8s, so the midpoint is at 400ms.
        setTimeout(() => {
            // Hide the currently active image
            images[currentIndex].classList.remove('active');

            // Move to the next image index, looping back to the start if necessary
            currentIndex = (currentIndex + 1) % images.length;

            // Show the new image
            images[currentIndex].classList.add('active');
        }, 400); // 400ms is half of the 0.8s transition
    }

    // Set the interval to call the flipImage function every 5 seconds
    setInterval(flipImage, 5000);
});

  document.addEventListener("DOMContentLoaded", () => {
    const imgs = document.querySelectorAll("img.lazy-img[data-src]");

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.add("loaded");
        observer.unobserve(img);
      });
    }, { rootMargin: "200px 0px" });

    imgs.forEach(img => io.observe(img));
  });

// Get the elements
const toggleIcon = document.getElementById('toggle-sidebar');
const sidebar = document.getElementById('Right_sidebar');
const overlay = document.getElementById('overlay');
const closeButton = document.getElementById('close-sidebar');

// Function to open the sidebar
function openSidebar() {
  sidebar.classList.add('show');
  overlay.classList.add('active');
}

// Function to close the sidebar
function closeSidebar() {
  sidebar.classList.remove('show');
  overlay.classList.remove('active');
}

// Toggle sidebar on click of the icon
toggleIcon.addEventListener('click', openSidebar);

// Close sidebar on click of the close button inside the sidebar
closeButton.addEventListener('click', closeSidebar);

// Close sidebar if the user clicks anywhere outside the sidebar
overlay.addEventListener('click', closeSidebar);

// Get the elements
const toggleButton = document.getElementById('navbar-toggle');
const navbarMenu = document.getElementById('navbarNav');

navbarMenu.addEventListener('show.bs.collapse', () => {
  toggleButton.classList.add('active');
});

navbarMenu.addEventListener('hide.bs.collapse', () => {
  toggleButton.classList.remove('active');
});

const openBtn = document.getElementById('openVideo');
const closeBtn = document.getElementById('closeVideo');
const videoOverlay = document.getElementById('videoOverlay');
const iframe = document.getElementById('youtubeFrame');

const YOUTUBE_ID = 'B-mEyTOMLKY';

openBtn.addEventListener('click', (e) => {
  e.preventDefault();
  iframe.src = `https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1`;
  videoOverlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  videoOverlay.classList.remove('active');
  iframe.src = ''; // stops the video
});

// close when clicking outside video
videoOverlay.addEventListener('click', (e) => {
  if (e.target === videoOverlay) {
    videoOverlay.classList.remove('active');
    iframe.src = '';
  }
});


