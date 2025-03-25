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

    // Dropdown functionality
    if (dropdownButton && dropdownList && categoryFilter) {
        dropdownButton.addEventListener("click", function (event) {
            event.stopPropagation();
            dropdownList.classList.toggle("open");
        });

        dropdownList.querySelectorAll("li").forEach(item => {
            item.addEventListener("click", function () {
                const selectedValue = item.getAttribute("data-value");
                dropdownButton.textContent = item.textContent;
                categoryFilter.value = selectedValue;
                dropdownList.classList.remove("open");
                filterVideos(selectedValue);

                // Close expanded info section when filter changes
                if (expandedInfoContainer) {
                    closeExpandedInfo();
                }
            });
        });

    // Close dropdown with delay if mouse leaves both button and menu
    function scheduleClose() {
        closeTimeout = setTimeout(() => {
            dropdownList.classList.remove("open");
        }, 300);
    }

    function cancelClose() {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
        }
    }

    dropdownButton.addEventListener("mouseenter", cancelClose);
    dropdownList.addEventListener("mouseenter", cancelClose);

    dropdownButton.addEventListener("mouseleave", scheduleClose);
    dropdownList.addEventListener("mouseleave", scheduleClose);

    document.addEventListener("click", function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
            dropdownList.classList.remove("open");
        }
    });

    }

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

