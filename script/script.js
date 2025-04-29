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
    
   
    //INTRO PAGE
    
    document.querySelector('.playCard').addEventListener('click', function () {
        document.querySelector('.playCard').classList.add('no-hover');
        let videoContainer = document.getElementById('videoContainer');
        let content = document.getElementById('content');
    
        content.style.display = 'none';
        videoContainer.style.display = 'flex';
        document.getElementById('titleStack').style.display = 'none';
    
        videoContainer.innerHTML = "";
    
        let iframe = document.createElement('iframe');
        iframe.id = "youtubeVideo";
        // iframe.src = "https://www.youtube-nocookie.com/embed/GSbJzr4GQxc?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&mute=1&enablejsapi=1";
        const baseSrc = "https://www.youtube-nocookie.com/embed/bY45Wjdda9c?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1";
iframe.src = window.innerWidth < 768 ? baseSrc + "&mute=1" : baseSrc;
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; fullscreen";
        iframe.allowFullscreen = true;
        iframe.title = "";
        iframe.style.opacity = "0";
        iframe.style.transition = "opacity 1s ease-in-out";
        iframe.style.border = "none";
        iframe.style.outline = "none";
        iframe.style.boxShadow = "none";
    
        if (window.innerWidth < 768) {
            iframe.classList.add("video-mobile");
        } else {
            iframe.classList.add("video-desktop");
        }
    
        let wrapper = document.createElement('div');
        wrapper.classList.add('video-wrapper');
        wrapper.appendChild(iframe);
    
        let overlay = document.createElement('div');
        overlay.classList.add('video-touch-overlay');
        wrapper.appendChild(overlay);
    
        videoContainer.innerHTML = "";
        videoContainer.appendChild(wrapper);

        
    
        iframe.onload = function () {
            setTimeout(() => {
                iframe.style.opacity = "1";
    
                if (typeof YT !== "undefined" && YT.Player) {
                    player = new YT.Player(iframe, { // <--- NO "let" here anymore!
                        events: {
                            'onStateChange': function (event) {
                                if (event.data === YT.PlayerState.ENDED) {
                                    youtubeVideo.style.opacity = "0";
                                    restoreContent();
                                    document.querySelector('.playCard').classList.remove('no-hover');
                                }
                            }
                        }
                    });
    
                    // Now that player is created, you can create the buttons
                    createVideoControls();
                }
            }, 100);
        };

        
    });
   
    // Load YouTube API asynchronously
    function loadYouTubeAPI() {
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      let firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Call YouTube API loader when the page loads
    loadYouTubeAPI();

// Function to create Pause/Play and Mute/Unmute buttons
function createVideoControls() {
    let controlsContainer = document.createElement('div');
    controlsContainer.id = 'videoControls';
    controlsContainer.style.position = 'absolute';
    controlsContainer.style.top = '630px';
    controlsContainer.style.left = '51%';
    controlsContainer.style.transform = 'translateX(-50%)';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.justifyContent = 'space-between';
    controlsContainer.style.zIndex = '1000';

    // Set width based on screen size
    if (window.innerWidth <= 768) {
        // Mobile
        controlsContainer.style.width = '350px';
    } else {
        // Desktop
        controlsContainer.style.width = '500px';
    }

    // Create Pause/Play Button
    let pauseButton = document.createElement('button');
    pauseButton.id = 'pauseButton';
    pauseButton.classList.add('pause-button');
    pauseButton.innerHTML = '<i class="fas fa-pause"></i>';

    // Create Mute/Unmute Button
    let muteButton = document.createElement('button');
    muteButton.id = 'muteButton';
    muteButton.classList.add('mute-button');
    
    // Default icon — will update below after checking state
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';

    // Append buttons first
    controlsContainer.appendChild(pauseButton);
    controlsContainer.appendChild(muteButton);
    document.body.appendChild(controlsContainer);

    // Delay icon update to ensure player is ready
    setTimeout(() => {
        if (player && typeof player.isMuted === 'function') {
            if (player.isMuted()) {
                muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }
    }, 300);

    // Set up event listeners
    pauseButton.addEventListener('click', function () {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
            pauseButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            player.playVideo();
            pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
    });

    muteButton.addEventListener('click', function () {
        if (player.isMuted()) {
            player.unMute();
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        } else {
            player.mute();
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        }
    });
}


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

// function resetText() {
  // Only restart if not already animating
//   if (!isAnimating) {
//     typeText();
//   }
// }

// Start typing when the page loads
// typeText();



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
  document.getElementById('videoControls').style.display = 'none';    

  // ALSO hide individual buttons if needed
  const pauseButton = document.getElementById('pauseButton');
  const muteButton = document.getElementById('muteButton');
  
  if (pauseButton) pauseButton.style.display = 'none';
  if (muteButton) muteButton.style.display = 'none';

}

typeText();

    



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
    // filterVideos("all");
// dropdownButton.querySelector(".button-text").textContent = "All Videos";
// categoryFilter.value = "all";
// updateDropdownList("all"); 


//YOUTUBE FOR MAIN VIDEOS

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



//DROPDOWN MENU


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


//dropdown function on click
dropdownList.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", function () {
        const selectedValue = item.getAttribute("data-value");
        dropdownButton.querySelector(".button-text").textContent = item.textContent;
        categoryFilter.value = selectedValue;
        dropdownList.classList.remove("open");
        rotateTriangle(false);
        filterVideos(selectedValue);
        updateDropdownList(selectedValue);
    });
});

//hide inactive menu items
function updateDropdownList(selectedValue) {
    dropdownList.querySelectorAll("li").forEach(item => {
        if (item.getAttribute("data-value") === selectedValue) {
            item.style.display = "none"; // Hide the selected one
        } else {
            item.style.display = "block"; // Show all others
        }
    });
}

// Close dropdown on outside click
document.addEventListener("click", function (event) {
    if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
        dropdownList.classList.remove("open");
        rotateTriangle(false);
    }
});


//filter videos by category
function filterVideos(category) {
    document.querySelectorAll(".video-thumbnail").forEach(video => {
        let categories = video.getAttribute("data-category").split(" ");
        let displayValue = (categories.includes(category) || category === "all") ? "block" : "none";
        video.style.setProperty("display", displayValue, "important");

        video.classList.remove("empty-video");
        
        
        
        const expandButton = document.getElementById('expandButton');
        expandButton.style.display = 'none';
    });
    

      // Remove hide class from video-container elements
      document.querySelectorAll(".video-container").forEach(container => {
        container.classList.remove("hide");
    });
    
   // Remove hide class from card-body elements
   document.querySelectorAll(".card-body").forEach(cardBody => {
    cardBody.classList.remove("hide");
});

        // Stop the currently playing video when the filter changes
        if (currentlyPlaying) {
            const originalThumbnail = currentlyPlaying.dataset.thumbnail;
            currentlyPlaying.innerHTML = `<img src="${originalThumbnail}" alt="Video Thumbnail">`;
            currentlyPlaying = null;


}


    


//MORE INFO EXPANSION


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
        return rowEndIndex >= visibleVideos.length ? visibleVideos.length - 2 : rowEndIndex;
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



    //adjust screen to expanded-info panel
    function adjustScrollToFit(expandedInfoContainer, videoCard) {
        const videoRect = videoCard.getBoundingClientRect();
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        
        // Check if the top of the video is off the screen after expanding
        // if (videoRect.top < navbarHeight) {
        //     window.scrollBy({
        //         top: videoRect.top - navbarHeight - 20, 
        //         behavior: "smooth"
        //     });
        // }
    
        // Adjust scroll to fit the bottom of expanded info
        const rect = expandedInfoContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const spaceBelow = windowHeight - rect.bottom;
    
        if (spaceBelow < 0) {
            const scrollAmount = Math.min(Math.abs(spaceBelow) + 30, rect.top - 75); 
            if (scrollAmount > 0) {
                window.scrollBy({
                    top: scrollAmount,
                    behavior: "smooth"
                });
            }
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
    
            // After closing, check if we need to scroll back up
            requestAnimationFrame(() => {
                const videoRect = videoCard.getBoundingClientRect();
                const navbarHeight = document.querySelector(".navbar")?.offsetHeight || 0;
    
                if (videoRect.top - navbarHeight > 0) {
                    // Video is already fine; no need to scroll
                    return;
                } else {
                    // Scroll back up to the video
                    window.scrollBy({
                        top: videoRect.top - navbarHeight - 10, // Small padding
                        behavior: "smooth"
                    });
                }
            });
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


  
  //expand button function
  function expandVideos() {
    const hiddenThumbnails = document.querySelectorAll('.video-section .video-thumbnail:nth-child(n+4)');
    hiddenThumbnails.forEach(thumbnail => {
      thumbnail.style.setProperty('display', 'block', 'important');
    });
  
    const expandButton = document.getElementById('expandButton');
    const videoSlide = document.getElementById('videoSlide');
    let hideDiv = document.querySelector('.card-body.hide'); 
    let hideDiv2 = document.querySelector('.video-container.hide');
    const emptyVideoDiv = document.querySelector('.empty-video')
    const cardBody1 = document.querySelector('.card-body');
  
    // Make sure #videoSlide is visible
    if (videoSlide) {
      videoSlide.style.setProperty('display', 'block', 'important');
    }

    if (hideDiv) {
        hideDiv.classList.remove('hide'); // Removes the 'hide' class to make it visible
    }

    if (hideDiv2) {
        hideDiv2.classList.remove('hide'); // Removes the 'hide' class to make it visible
    }

    document.querySelectorAll(".video-container").forEach(container => {
        container.classList.remove("hide");
    });


  

  if (emptyVideoDiv) {
    // emptyVideoDiv.style.setProperty('border-top', '8px solid #2b4654', 'important');
    // emptyVideoDiv.style.setProperty('border-left', '2px solid rgb(234, 234, 234)', 'important');
    // emptyVideoDiv.style.setProperty('border-right', 'none', 'important');
    
  }
  


    // Start fade out for expandButton
    expandButton.style.opacity = '0';
    expandButton.style.height = '0px';
    expandButton.style.marginTop = '0px';
  
    // After the fade-out animation is done, hide it
    setTimeout(() => {
      expandButton.style.display = 'none';
    }, 1000); // Match the transition time (1000ms)
  
    // Force a reflow
    void videoSlide.offsetWidth;
  
    // Now transition the height
    videoSlide.style.height = '0'; // or whatever expanded size
  }
  
 

  






  