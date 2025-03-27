document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector(".navbar");
    const dropdownButton = document.querySelector(".dropdown-button");
    const dropdownList = document.querySelector(".dropdown-list");
    const categoryFilter = document.getElementById("categoryFilter");
    let currentlyPlaying = null;
    let expandedInfoContainer = null;
    let activeButton = null;
    let navbarCollapse = document.querySelector(".navbar-collapse");
    let navLinks = document.querySelectorAll(".nav-link");

    //cover page video
    document.getElementById('playButton').addEventListener('click', function () {
    let videoContainer = document.getElementById('videoContainer');
    let content = document.getElementById('content');

    // Store original content to restore later
    let originalContentHTML = content.innerHTML;

    // Hide text and button
    content.style.display = 'none';
    videoContainer.style.display = 'flex';

    // Remove existing content
    videoContainer.innerHTML = "";

    // Create a white placeholder while the iframe loads
    let placeholder = document.createElement('div');
    placeholder.style.width = "500px";
    placeholder.style.height = "500px";
    placeholder.style.background = "white";
    placeholder.style.display = "inline-block";
    placeholder.style.position = "relative";

    videoContainer.appendChild(placeholder);

    // Create the iframe
    let iframe = document.createElement('iframe');
    iframe.id = "youtubeVideo";
    iframe.src = "https://www.youtube.com/embed/mj_8952IB08?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&mute=1&enablejsapi=1";
    iframe.frameBorder = "0";
    iframe.allow = "autoplay; fullscreen";
    iframe.allowFullscreen = true;
    iframe.style.width = "900px";
    iframe.style.height = "900px";
    iframe.style.position = "absolute";
    iframe.style.left = "-200px";
    iframe.style.top = "-200px";
    iframe.style.opacity = "0";  // Initially hidden
    iframe.style.transition = "opacity 0.5s ease-in-out"; // Smooth fade-in

    // Create video wrapper
    let wrapper = document.createElement('div');
    wrapper.classList.add('video-wrapper');
    wrapper.appendChild(iframe);

    // Replace placeholder with video wrapper
    videoContainer.innerHTML = "";
    videoContainer.appendChild(wrapper);

    // Image to show after the video ends
    let endImage = document.createElement('img');
    endImage.src = "path/to/your-end-image.jpg";  // Replace with the path to your image
    endImage.style.width = "500px";
    endImage.style.height = "500px";
    endImage.style.position = "absolute";
    endImage.style.top = "0";
    endImage.style.left = "0";
    endImage.style.opacity = "0"; // Initially hidden
    endImage.style.transition = "opacity 1s ease-in-out"; // Smooth fade-in and fade-out

    // Add the image to the container but keep it hidden initially
    videoContainer.appendChild(endImage);

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
                                endImage.style.opacity = "1";  // Fade in the image

                                // Wait for a few seconds, then transition back to the original content
                                setTimeout(() => {
                                    // Hide the end image
                                    endImage.style.opacity = "0";

                                    // Restore the original content after a brief delay
                                    setTimeout(() => {
                                        videoContainer.innerHTML = ""; // Remove the video
                                        content.innerHTML = originalContentHTML; // Restore original content
                                        content.style.display = 'block'; // Show content again
                                    }, 500); // Delay before restoring content
                                }, 1500); // Delay to show the end image for 1.5 seconds
                            }
                        }
                    }
                });
            }
        }, 100);
    };
});
    

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
    filterVideos("editing");
    dropdownButton.textContent = "Video/Audio Editing";
    categoryFilter.value = "editing";

    // Navbar transparency on scroll
    window.addEventListener("scroll", function () {
        let top = window.scrollY;
        let opacity = Math.min(top / 300, 1);
        
        if (top > 0) {
            header.style.backgroundImage = `linear-gradient(to bottom, rgba(58, 96, 115, ${opacity}) 0%, rgba(0, 0, 0, ${opacity}) 90%)`;
        } else {
            header.style.backgroundImage = "none"; // Transparent when at the top
        }
    });

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
        <iframe id="video-iframe-${videoId}" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&rel=0&showinfo=0&modestbranding=1&autohide=1" 
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
    document.addEventListener("click", function () {
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
        dropdownButton.firstChild.nodeValue = item.textContent; // Update text while keeping triangle
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

    function openExpandedInfo(videoCard, visibleVideos, insertAfterIndex) {
        expandedInfoContainer = document.createElement("div");
        expandedInfoContainer.classList.add("expanded-info-container");
        expandedInfoContainer.innerHTML = 
            `<button class="close-info">x</button>
            ${videoCard.querySelector(".expanded-info").innerHTML}`;

        visibleVideos[insertAfterIndex].insertAdjacentElement("afterend", expandedInfoContainer);

        expandedInfoContainer.querySelector(".close-info").addEventListener("click", function () {
            closeExpandedInfo();
        });

        requestAnimationFrame(() => {
            expandedInfoContainer.classList.add("open");
        });
    }

    //text animation
    const textElement = document.getElementById('text');
    const text = "welcome to my portfolio";
    let index = 0;
  
    function typeText() {
      if (index < text.length) {
        textElement.innerHTML += text[index];
        index++;
        setTimeout(typeText, 100); // Adjust typing speed here
      } else {
        setTimeout(resetText, 2000); // Delay before resetting
      }
    }
  
    function resetText() {
      textElement.innerHTML = "";
      index = 0;
      setTimeout(typeText, 500); // Delay before re-typing
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
            `<button class="close-info">x</button>
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

