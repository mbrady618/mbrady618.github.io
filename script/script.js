document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".navbar");
    const dropdownButton = document.querySelector(".dropdown-button");
    const dropdownList = document.querySelector(".dropdown-list");
    const categoryFilter = document.getElementById("categoryFilter");
    const form = document.getElementById('contactForm');
    let currentlyPlaying = null;
    let expandedInfoContainer = null;
    let activeButton = null;
    let navbarCollapse = document.querySelector(".navbar-collapse");
    let navLinks = document.querySelectorAll(".nav-link");
    let content = document.getElementById('content');
    let videoContainer = document.getElementById('videoContainer');
    let originalContentHTML = content.innerHTML;
    let player;
    let isRestoring = false;
    
    // Play button click event
    //cover page video
    document.getElementById('playButton').addEventListener('click', function () {
        let videoContainer = document.getElementById('videoContainer');
        let content = document.getElementById('content');
        
        // Hide text and button
        content.style.display = 'none';
        videoContainer.style.display = 'flex';
        content.style.display = 'none';
        document.getElementById('titleStack').style.display = 'none';
    
        // Remove existing content
        videoContainer.innerHTML = "";
    
        // Create the iframe
        let iframe = document.createElement('iframe');
        iframe.id = "youtubeVideo";
        iframe.src = "https://www.youtube-nocookie.com/embed/GSbJzr4GQxc?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&mute=1&enablejsapi=1";
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen";
        iframe.allowFullscreen = true;
        iframe.title = ""; // Add this line to remove the tooltip
        iframe.style.opacity = "0";  // Initially hidden
        iframe.style.transition = "opacity 1s ease-in-out"; // Smooth fade-in
        iframe.style.border = "none";
        iframe.style.outline = "none";
        iframe.style.boxShadow = "none";

        if (window.innerWidth < 768) {
            iframe.classList.add("video-mobile");
        } else {
            iframe.classList.add("video-desktop");
        }

        // Create video wrapper
        let wrapper = document.createElement('div');
        wrapper.classList.add('video-wrapper');
        wrapper.appendChild(iframe);

        // Create transparent overlay
let overlay = document.createElement('div');
overlay.classList.add('video-touch-overlay');
wrapper.appendChild(overlay);
    
        // Replace placeholder with video wrapper
        videoContainer.innerHTML = "";
        videoContainer.appendChild(wrapper);
    
        iframe.onload = function () {
            setTimeout(() => {
                iframe.style.opacity = "1"; // Fade in the video
    
                // Setup YouTube Player to detect when the video ends
                if (typeof YT !== "undefined" && YT.Player) {
                    let player = new YT.Player(iframe, {
                        events: {
                            'onStateChange': function (event) {
                                if (event.data === YT.PlayerState.ENDED) {
                                    // Show the end image after the video ends
                                    youtubeVideo.style.opacity = "0";  // Fade in the image
                                    restoreContent()
                                }
                            }
                        }
                    });
                }
            }, 100);
        };
 
        
    
    //   // Track video progress and stop 2 seconds before the end
    //   function trackVideoProgress() {
    //     setInterval(function () {
    //       if (player && player.getPlayerState() === YT.PlayerState.PLAYING && !isRestoring) {
    //         let duration = player.getDuration();
    //         let currentTime = player.getCurrentTime();
    
    //         console.log('Duration:', duration);
    //         console.log('Current time:', currentTime);
    //         console.log('Time remaining:', duration - currentTime);
    
    //         // Stop 2 seconds before the end
    //         if (duration - currentTime <= 2) {
    //           console.log('2 seconds remaining, stopping video and restoring content...');
    //           isRestoring = true;
    //           restoreContent();
    //         }
    //       }
    //     }, 500); // Check every 0.5 seconds
    //   }
    
      // Handle state change (optional but useful)
    //   function onPlayerStateChange(event) {
    //     if (event.data === YT.PlayerState.ENDED && !isRestoring) {
    //       console.log('Video ended, restoring content...');
    //       restoreContent();
    //     }
    //   }
    
      // Restore content after video
    //   function restoreContent() {
    //     videoContainer.style.display = 'none'; // Hide the video
    //     content.style.display = 'block'; // Show original content
    //     restartTextAnimation(); // Restart text animation
    //     console.log('restarted text animation')
    //   }
    });
    
    // Function to restart text animation after video ends
// function restartTextAnimation() {
//     console.log('Restarting text animation...');
//     textIndex = 0; // Always start with "welcome to my portfolio"
//     index = 0;
//     textElement.innerHTML = ""; // Clear content completely
//     isAnimating = false; // Reset animation state
//     typeText(); // Start fresh
//   }
    
    // Load YouTube API asynchronously
    function loadYouTubeAPI() {
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Call YouTube API loader when the page loads
    loadYouTubeAPI();





// Updated text animation with blank screen between texts
const textElement = document.getElementById('text');


const texts = ["welcome to my portfolio", "tap to play"];
let index = 0;
let textIndex = 0;
let isAnimating = false;

// Main function to type text
function typeText() {
  // Prevent multiple animations from running
  if (isAnimating) return;

  isAnimating = true;
  index = 0;
  textElement.innerHTML = ""; // Clear before typing new text

  function type() {
    if (index < texts[textIndex].length) {
      textElement.innerHTML += texts[textIndex][index];
      index++;
      setTimeout(type, 100); // Typing speed
    } else {
      // Wait after text is completed, then clear and switch text
      setTimeout(() => {
        textElement.innerHTML = ""; // Clear after showing text
        setTimeout(() => {
          textIndex = (textIndex + 1) % texts.length; // Switch between texts
          isAnimating = false;
          typeText(); // Continue cycling between texts
        }, 500); // 0.5-second delay before starting next text
      }, 2000); // Delay after displaying completed text
    }
  }

  // Start typing
  type();
}

// Reset text and animation completely when the video starts
function resetTextAnimation() {
  textIndex = 0;
  console.log('text index reset')
  index = 0;
  console.log('index reset')
  textElement.innerHTML = ""; // Clear any existing content
  console.log('text element reset')
  isAnimating = false; // Ensure animation state is reset
  console.log('is animating reset')
}

// Restore original content after the video ends
function restoreContent() {
  videoContainer.style.display = 'none'; // Hide the video
  content.style.display = 'block'; // Show original content
  resetTextAnimation(); // Restart animation fresh
  content.style.display = 'block';
  document.getElementById('titleStack').style.display = 'block';      
}

// Simulate video starting (optional, reset when video starts)
// function onVideoStart() {
//   console.log("Video started, resetting text animation...");
//   resetTextAnimation(); // Prepare to restart after video ends
// }

// Simulate the video ending
// setTimeout(restoreContent, 5000); // Simulate video ending after 5 seconds

// Start typing when the page loads
typeText();

    

    

    // function restoreContent() {
    //     videoContainer.style.transition = "opacity 0.5s ease-in-out";
    //     videoContainer.style.opacity = "0";
    //     setTimeout(function () {
    //         // Restore the original content
    //         content.innerHTML = originalContentHTML; 
    //         content.style.display = 'block';
    //         videoContainer.innerHTML = "";
    //         videoContainer.style.display = 'none';
    //         videoContainer.style.opacity = "1";
    //         isRestoring = false;
    
    //         // Reinitialize the text animation
    //         const textElement = document.getElementById('text');
    //         if (textElement) {
    //             // Reset animation state and variables
    //             isAnimating = false; // Make sure animation can restart
    //             index = 0; // Reset text index
    //             textElement.innerHTML = ""; // Clear any leftover text
    //             typeText(); // Restart typing animation
    //         }
    //     }, 500);
    // }
    
    

    

    // Close menu when a nav item is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", function () {
            if (navbarCollapse.classList.contains("show")) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener("click", function (event) {
        let isClickInside = navbarCollapse.contains(event.target) || event.target.classList.contains("navbar-toggler");

        if (!isClickInside && navbarCollapse.classList.contains("show")) {
            new bootstrap.Collapse(navbarCollapse).hide();
        }
    });


    // Automatically filter by "editing" when the page loads
    filterVideos("all");
    dropdownButton.querySelector(".button-text").textContent = "All Videos";
    categoryFilter.value = "all";

    // Navbar transparency on scroll
    // window.addEventListener("scroll", function () {
    //     let top = window.scrollY;
    //     let opacity = Math.min(top / 300, 1);
        
    //     if (top > 0) {
    //         header.style.backgroundImage = `linear-gradient(to bottom, rgba(58, 96, 115, ${opacity}) 0%, rgba(0, 0, 0, ${opacity}) 90%)`;
    //     } else {
    //         header.style.backgroundImage = "none"; // Transparent when at the top
    //     }
    // });

    function setupVideoEndListener(videoContainer, thumbnail, videoId) {
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            // If YouTube API is not ready, wait and try again
            setTimeout(() => setupVideoEndListener(videoContainer, thumbnail, videoId), 100);
            return;
        }
    
        // Create the YouTube Player and track video state
        let player = new YT.Player('video-iframe', {
            events: {
                'onStateChange': function (event) {
                    if (event.data === 0) { // Video ended
                        videoContainer.innerHTML = `<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video Thumbnail">`;
                    }
                }
            }
        });
    }

    function setupVideoEndListener(videoContainer, videoId) {
        if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
            setTimeout(() => setupVideoEndListener(videoContainer, videoId), 100);
            return;
        }
    
        const player = new YT.Player(`video-iframe-${videoId}`, {
            events: {
                'onStateChange': function (event) {
                    if (event.data === YT.PlayerState.ENDED) {
                        // Retrieve the original thumbnail from data-thumbnail
                        const originalThumbnail = videoContainer.dataset.thumbnail;
                        console.log("Restoring Thumbnail:", originalThumbnail); // Add this for debugging
                        
                        if (originalThumbnail) {
                            // Restore the original thumbnail after video ends
                            videoContainer.innerHTML = `<img src="${originalThumbnail}" alt="Video Thumbnail">`;
                        } else {
                            console.error("Thumbnail not found or incorrect path.");
                            videoContainer.innerHTML = `<img src="fallback-thumbnail.jpg" alt="Fallback Thumbnail">`;
                        }
    
                        currentlyPlaying = null;
                    }
                }
            }
        });
    }

    // Click to play Video
    document.querySelectorAll(".video-thumbnail .video-container").forEach(videoContainer => {
        videoContainer.addEventListener("click", function (event) {
            event.stopPropagation();
            const videoId = this.closest(".video-thumbnail").getAttribute("data-video-id");
            const thumbnail = this.querySelector("img");

            if (currentlyPlaying && currentlyPlaying !== this) {
                const originalThumbnail = currentlyPlaying.dataset.thumbnail;
                currentlyPlaying.innerHTML = `<img src="${originalThumbnail}" alt="Video Thumbnail">`;
            }

            let fadeOverlay = this.querySelector(".fade-overlay");
            if (!fadeOverlay) {
                fadeOverlay = document.createElement("div");
                fadeOverlay.classList.add("fade-overlay");
                this.appendChild(fadeOverlay);
            }

            thumbnail.style.opacity = "0";

            setTimeout(() => {
                fadeOverlay.style.opacity = "1";

                setTimeout(() => {
                    this.innerHTML = 
    `<div class="fade-video">
        <iframe id="video-iframe-${videoId}" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&rel=0&showinfo=0&modestbranding=1&autohide=1&cc_load_policy=1" 
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
    </div>`;
    
setTimeout(() => {
    setupVideoEndListener(this, videoId);
}, 100);
    
// Wait for the iframe to load, then check when the video ends
setTimeout(() => {
    setupVideoEndListener(this, thumbnail, videoId);
}, 100);
                    setTimeout(() => {
                        this.querySelector(".fade-video").style.opacity = "1";
                    }, 100);
                }, 500);
            }, 500);

            this.dataset.videoId = videoId;
            currentlyPlaying = this;
        });
    });

    // Remove focus from currently selected item after 1 second
    // document.addEventListener("click", function () {
    //     setTimeout(() => {
    //         if (document.activeElement) {
    //             document.activeElement.blur();
    //         }
    //     }, 1000);
    // });

    //remove focus from currently selected item after 1 second EXCEPT contact section
    document.addEventListener("click", function (event) {
        const contactSection = document.getElementById("contact");
    
        // If the click target is *inside* the contact section, don't blur
        if (contactSection && contactSection.contains(event.target)) {
            return;
        }
    
        // Otherwise, blur after 1 second
        setTimeout(() => {
            if (document.activeElement) {
                document.activeElement.blur();
            }
        }, 1000);
    });





  // Ensure the dropdown button has a proper position
dropdownButton.style.position = "relative";
dropdownButton.style.display = "flex";
dropdownButton.style.alignItems = "center";
dropdownButton.style.justifyContent = "center"; // Center text

// Style the triangle
const triangle = document.createElement("span");
triangle.style.position = "absolute";
triangle.style.right = "20px"; // Fix to the right
triangle.style.top = "50%";
triangle.style.transform = "translateY(-50%)"; // Center vertically
triangle.style.borderLeft = "6px solid transparent";
triangle.style.borderRight = "6px solid transparent";
triangle.style.borderTop = "6px solid white";
triangle.style.transition = "transform 0.3s ease";
dropdownButton.appendChild(triangle);

function rotateTriangle(up) {
    triangle.style.transform = up ? "translateY(-50%) rotate(180deg)" : "translateY(-50%) rotate(0deg)";
}

dropdownButton.addEventListener("click", function (event) {
    event.stopPropagation();
    const isOpen = dropdownList.classList.contains("open");
    dropdownList.classList.toggle("open");
    rotateTriangle(!isOpen);
});

dropdownList.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", function () {
        const selectedValue = item.getAttribute("data-value");
        dropdownButton.querySelector(".button-text").textContent = item.textContent;
        categoryFilter.value = selectedValue;
        dropdownList.classList.remove("open");
        rotateTriangle(false);
        filterVideos(selectedValue);
        if (expandedInfoContainer) {
            closeExpandedInfo();
        }
    });
});

// Close dropdown on outside click
document.addEventListener("click", function (event) {
    if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
        dropdownList.classList.remove("open");
        rotateTriangle(false);
    }
});



    function filterVideos(category) {
        document.querySelectorAll(".video-thumbnail").forEach(video => {
            let categories = video.getAttribute("data-category").split(" ");
            video.style.display = categories.includes(category) || category === "all" ? "block" : "none";
        });
    
        // Stop the currently playing video when the filter changes
        if (currentlyPlaying) {
            const originalThumbnail = currentlyPlaying.dataset.thumbnail;
            currentlyPlaying.innerHTML = `<img src="${originalThumbnail}" alt="Video Thumbnail">`;
            currentlyPlaying = null;
}
    
    }

    function getInsertIndex(clickedVideo, visibleVideos) {
        const isSmallScreen = window.innerWidth <= 768;
        if (isSmallScreen) return visibleVideos.indexOf(clickedVideo);

        let firstRowY = visibleVideos[0].getBoundingClientRect().top;
        let videosPerRow = 1;

        for (let i = 1; i < visibleVideos.length; i++) {
            if (visibleVideos[i].getBoundingClientRect().top === firstRowY) {
                videosPerRow++;
            } else {
                break;
            }
        }

        const index = visibleVideos.indexOf(clickedVideo);
        let rowEndIndex = Math.floor(index / videosPerRow) * videosPerRow + (videosPerRow - 1);
        return rowEndIndex >= visibleVideos.length ? visibleVideos.length - 1 : rowEndIndex;
    }

    function closeExpandedInfo(callback) {
        if (expandedInfoContainer) {
            if (activeButton) {
                // Instantly reset button text and state
                activeButton.classList.remove("active");
                activeButton.textContent = "more info";
                activeButton = null;
            }
    
            // Remove outline when closing
            const activeVideo = document.querySelector(".video-thumbnail.info-active");
            if (activeVideo) {
                activeVideo.classList.remove("info-active");
            }
    
            expandedInfoContainer.classList.remove("open");
            setTimeout(() => {
                expandedInfoContainer.remove();
                expandedInfoContainer = null;
                if (callback) callback();
            }, 800);
        } else if (callback) {
            callback();
        }
    }

    // function openExpandedInfo(videoCard, visibleVideos, insertAfterIndex) {
    //     expandedInfoContainer = document.createElement("div");
    //     expandedInfoContainer.classList.add("expanded-info-container");
    //     expandedInfoContainer.innerHTML = 
    // `<div class="dialog-header">
    //     <button class="close-info">x</button>
    // </div>
    // ${videoCard.querySelector(".expanded-info").innerHTML}`;

    //     visibleVideos[insertAfterIndex].insertAdjacentElement("afterend", expandedInfoContainer);

    //     expandedInfoContainer.querySelector(".close-info").addEventListener("click", function () {
    //         closeExpandedInfo();
    //     });

    //     requestAnimationFrame(() => {
    //         expandedInfoContainer.classList.add("open");
    //     });
    // }    

function resetText() {
  // Only restart if not already animating
  if (!isAnimating) {
    typeText();
  }
}

// Start typing when the page loads
typeText();

    //adjust screen to expanded-info panel
    function adjustScrollToFit(expandedInfoContainer, videoCard) {
        const videoRect = videoCard.getBoundingClientRect();
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        
        // Check if the top of the video is off the screen after expanding
        if (videoRect.top < navbarHeight) {
            window.scrollBy({
                top: videoRect.top - navbarHeight - 10, // Slight padding for spacing
                behavior: "smooth"
            });
        }
    
        // Adjust scroll to fit the bottom of expanded info
        const rect = expandedInfoContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - rect.bottom;
    
        if (spaceBelow < 0) {
            window.scrollBy({
                top: Math.abs(spaceBelow) + 20, // Add padding to avoid exact edge
                behavior: "smooth"
            });
        }
    }
    
    function openExpandedInfo(videoCard, visibleVideos, insertAfterIndex) {
        expandedInfoContainer = document.createElement("div");
        expandedInfoContainer.classList.add("expanded-info-container");
        expandedInfoContainer.innerHTML = 
            `<button class="close-info">
  <div class="toggler-icon open-x">
    <span></span>
    <span></span>
    <span></span>
  </div>
</button>
            ${videoCard.querySelector(".expanded-info").innerHTML}`;
    
        visibleVideos[insertAfterIndex].insertAdjacentElement("afterend", expandedInfoContainer);
    
        expandedInfoContainer.querySelector(".close-info").addEventListener("click", function () {
            closeExpandedInfo();
        });
    
        requestAnimationFrame(() => {
            expandedInfoContainer.classList.add("open");
    
            // Wait for animation, then adjust scroll
            setTimeout(() => {
                adjustScrollToFit(expandedInfoContainer, videoCard);
            }, 300);
        });
    }
    
    //close expanded info - "more info" button to "less info"
    document.querySelectorAll(".info-btn").forEach(button => {
        button.addEventListener("click", function () {
            const videoGrid = document.querySelector(".video-grid");
            let videoCard = this.closest(".video-thumbnail");

            // If this button is already active, close the section and EXIT EARLY
            if (activeButton === this) {
                closeExpandedInfo();
                return;
            }

            // Reset previous active button if any
            if (activeButton && activeButton !== this) {
                activeButton.classList.remove("active");
                activeButton.textContent = "more info";
            }

            // Immediately update button text and state
                this.classList.add("active");
                this.textContent = "less info";

            // Close any open expanded info before opening a new one
            closeExpandedInfo(() => {
                const visibleVideos = Array.from(videoGrid.children).filter(video => video.style.display !== "none");
                let insertAfterIndex = getInsertIndex(videoCard, visibleVideos);
                openExpandedInfo(videoCard, visibleVideos, insertAfterIndex);

                // Add outline to the selected video
    document.querySelectorAll(".video-thumbnail").forEach(video => {
        video.classList.remove("info-active"); // Remove outline from others
    });
    videoCard.classList.add("info-active"); // Add outline to selected video

                // Set the new active button
                activeButton = this;
            });
        });
    });
});

// Contact Form
const form = document.getElementById('contactForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      form.reset();
      document.getElementById('thankYouPopup').style.display = 'flex';
    } else {
      alert('Oops! Something went wrong. Please try again.');
    }
  });

  function closePopup() {
    document.getElementById('thankYouPopup').style.display = 'none';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
  
    if (response.ok) {
      form.reset();
      document.getElementById('thankYouPopup').style.display = 'flex';
    } else {
      alert('Oops! Something went wrong. Please try again.');
    }
  });
  
  function closePopup() {
    document.getElementById('thankYouPopup').style.display = 'none';
  }
  
  // ✅ This is the missing piece: attach the click event to the close button
  document.getElementById('closePopupBtn').addEventListener('click', closePopup);

 
  //make tooltips work with bootstrap 
  document.addEventListener("DOMContentLoaded", function () {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  });

  //make title expand with menu open on mobile 
  document.addEventListener('DOMContentLoaded', function () {
    const toggler = document.querySelector('.navbar-toggler');
    const collapse = document.querySelector('#navbarSupportedContent');
    const logo = document.querySelector('.navbar-logo');

    // Use Bootstrap's shown/hidden events to track collapse state
    collapse.addEventListener('show.bs.collapse', function () {
        logo.classList.add('logo-expanded');
      });
      
      collapse.addEventListener('hide.bs.collapse', function () {
        logo.classList.remove('logo-expanded');
      });

    collapse.addEventListener('hidden.bs.collapse', function () {
      logo.classList.remove('logo-expanded');
    });
  });

  function toggleBio() {
    const bio = document.getElementById('bio-content');
    const button = document.querySelector('.toggle-bio-btn');
    const dots = document.getElementById('bio-dots');
    const bioTop = document.getElementById('biotop');
    const photoTop = document.getElementById('phototop');
  
    bio.classList.toggle('show');
    dots.classList.toggle('hidden');
  
    const expandOffset = 75;  // Offset for expanding (scroll to biotop)
    const collapseOffset = 80; // Offset for collapsing (scroll to phototop)
  
    if (bio.classList.contains('show')) {
      button.textContent = "Collapse Bio −";
      const topPosition = bioTop.getBoundingClientRect().top + window.pageYOffset - expandOffset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    } else {
      button.textContent = "Expand Bio +";
      const topPosition = photoTop.getBoundingClientRect().top + window.pageYOffset - collapseOffset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  }