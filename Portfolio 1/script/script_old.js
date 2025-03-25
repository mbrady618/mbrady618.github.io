const header = document.querySelector(".navbar");

window.addEventListener("scroll", function () {
    let top = window.scrollY;
    let opacity = Math.min(top / 300, 1); // Adjust 300 for speed

    header.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
});


// Click to play Video
document.addEventListener("DOMContentLoaded", function () {
    let currentlyPlaying = null;

    document.querySelectorAll(".video-thumbnail").forEach(card => {
        card.addEventListener("click", function () {
            const videoId = this.getAttribute("data-video-id");
            const videoContainer = this.querySelector(".video-container");
            const thumbnail = videoContainer.querySelector("img");

            // Stop the currently playing video and restore its thumbnail
            if (currentlyPlaying && currentlyPlaying !== videoContainer) {
                const originalThumbnail = currentlyPlaying.dataset.thumbnail; // Get the stored custom thumbnail
                currentlyPlaying.innerHTML = `<img src="${originalThumbnail}" alt="Video Thumbnail">`;
            }

            // Create fade overlay if not exists
            let fadeOverlay = videoContainer.querySelector(".fade-overlay");
            if (!fadeOverlay) {
                fadeOverlay = document.createElement("div");
                fadeOverlay.classList.add("fade-overlay");
                videoContainer.appendChild(fadeOverlay);
            }

            // Fade out the thumbnail
            thumbnail.style.opacity = "0";

            setTimeout(() => {
                // Start fade to black
                fadeOverlay.style.opacity = "1";

                setTimeout(() => {
                    // Replace with video player
                    videoContainer.innerHTML = `
                        <div class="fade-video">
                            <iframe 
                                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1" 
                                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
                            </iframe>
                        </div>
                    `;

                    // Add fade-in effect for the video
                    setTimeout(() => {
                        videoContainer.querySelector(".fade-video").style.opacity = "1";
                    }, 100); // Start fade-in after 100ms

                }, 500); // 0.5-second fade to black

            }, 500); // 0.5-second fade out thumbnail

            videoContainer.dataset.videoId = videoId;
            currentlyPlaying = videoContainer;
        });
    });
});


//expand test
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".info-btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevents closing when clicking inside the expanded box

            let videoCard = this.closest(".video-thumbnail");
            let expandedInfo = videoCard.querySelector(".expanded-info");

            // Close any other expanded info boxes
            document.querySelectorAll(".video-thumbnail.expanded").forEach(otherCard => {
                if (otherCard !== videoCard) {
                    otherCard.classList.remove("expanded");
                }
            });

            // Toggle the clicked one
            videoCard.classList.toggle("expanded");
        });
    });



    // Clicking outside closes expanded info
    document.addEventListener("click", function (event) {
        document.querySelectorAll(".video-thumbnail.expanded").forEach(videoCard => {
            if (!videoCard.contains(event.target)) {
                videoCard.classList.remove("expanded");
            }
        });
    });


    // Filtering Logic with Dropdown
    document.getElementById("categoryFilter").addEventListener("change", function () {
        let selectedCategory = this.value;
    
        document.querySelectorAll(".video-thumbnail").forEach(video => {
            let categories = video.getAttribute("data-category").split(" "); // Convert to array
    
            if (categories.includes(selectedCategory)) {
                video.classList.remove("d-none"); // Show the element
                video.style.display = "block"; // Ensure it becomes visible
            } else {
                video.classList.add("d-none"); // Hide the element
                video.style.display = "none"; // Ensure it stays hidden
            }
        });
    });

    //dropdown toggle
    document.addEventListener("DOMContentLoaded", function () {
        const dropdownButton = document.querySelector(".dropdown-button");
        const dropdownList = document.querySelector(".dropdown-list");
    
        dropdownButton.addEventListener("click", function () {
            dropdownList.style.display = dropdownList.style.display === "block" ? "none" : "block";
        });
    
        // Hide dropdown if clicked outside
        document.addEventListener("click", function (event) {
            if (!dropdownButton.contains(event.target) && !dropdownList.contains(event.target)) {
                dropdownList.style.display = "none";
            }
        });
    
        // Update button text when an option is selected
        dropdownList.querySelectorAll("li").forEach(function (item) {
            item.addEventListener("click", function () {
                dropdownButton.textContent = item.textContent;
                dropdownList.style.display = "none";
            });
        });
    });
    
    

    

    
    
});
