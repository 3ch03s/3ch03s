// Map JavaScript for The Endless Night ARG

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const toggleGrid = document.getElementById('toggle-grid');
    const toggleEntities = document.getElementById('toggle-entities');
    const toggleLights = document.getElementById('toggle-lights');
    const toggleAnomalies = document.getElementById('toggle-anomalies');
    const daySlider = document.getElementById('day-slider');
    const currentDay = document.getElementById('current-day');
    const hiddenNote = document.getElementById('hidden-note');
    const gridOverlay = document.querySelector('.grid-overlay');
    const entityLayer = document.querySelector('.entity-layer');
    const lightsLayer = document.querySelector('.lights-layer');
    const anomaliesLayer = document.querySelector('.anomalies-layer');
    const facility = document.querySelector('.facility');
    const batteryLevel = document.getElementById('battery-level');
    const currentDateDisplay = document.getElementById('current-date');
    const ambientSound = document.getElementById('ambient-sound');
    const mapSound = document.getElementById('map-sound');
    const anomalySound = document.getElementById('anomaly-sound');
    const navItems = document.querySelectorAll('.nav-item');
    const locationLabels = document.querySelectorAll('.location-label');
    const locations = document.querySelectorAll('.location');
    const roadElements = document.querySelectorAll('.main-roads, .train-tracks');
    
    // Set initial values
    let displayDay = 1;
    const playerMaxDay = parseInt(localStorage.getItem('endlessNightDay')) || 1;
    
    // Create location info popup
    createLocationInfoPopup();
    
    // Update the current date display
    updateDateDisplay();
    
    // Update the battery level to decrease slightly
    if (batteryLevel) {
        let battery = parseInt(batteryLevel.textContent);
        battery = Math.max(battery - Math.floor(Math.random() * 10), 20); // Decrease by 0-10%, min 20%
        batteryLevel.textContent = battery;
    }
    
    // Set max day for the slider based on player progress
    if (daySlider) {
        daySlider.max = Math.min(14, playerMaxDay);
        daySlider.value = 1;
        
        const sliderStyle = document.createElement('style');
        sliderStyle.textContent = `
            .day-slider {
                width: 100%;
                height: 8px;
                background: #001100;
                outline: none;
                border-radius: 4px;
                cursor: pointer;
                -webkit-appearance: none;
            }
            
            .day-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                background: #0f0;
                cursor: pointer;
                border-radius: 50%;
                border: 1px solid #003300;
            }
            
            .day-slider::-moz-range-thumb {
                width: 18px;
                height: 18px;
                background: #0f0;
                cursor: pointer;
                border-radius: 50%;
                border: 1px solid #003300;
            }
            
            .day-slider:hover {
                background: #002200;
            }
            
            .day-slider:active::-webkit-slider-thumb {
                background: #00ff00;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
            }
            
            .day-slider:active::-moz-range-thumb {
                background: #00ff00;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.7);
            }
        `;
        document.head.appendChild(sliderStyle);
    }
    
    // Initialize ambient sound
    if (ambientSound) {
        ambientSound.volume = 0.3;
        
        // Only autoplay if user has explicitly allowed audio before
        if (localStorage.getItem('audioEnabled') === 'true') {
            ambientSound.play().catch(e => console.log('Audio autoplay prevented: ' + e));
        }
        
        // Add click event to body to enable audio (needs user interaction)
        document.body.addEventListener('click', function() {
            if (ambientSound.paused) {
                ambientSound.play().then(() => {
                    localStorage.setItem('audioEnabled', 'true');
                }).catch(e => console.log('Audio play failed: ' + e));
            }
        }, { once: true });
    }
    
    // Toggle grid visibility
    if (toggleGrid) {
        toggleGrid.addEventListener('click', function() {
            toggleGrid.classList.toggle('active');
            if (gridOverlay) {
                gridOverlay.classList.toggle('hidden');
                playMapSound();
            }
        });
    }
    
    // Toggle entity visibility
    if (toggleEntities) {
        toggleEntities.addEventListener('click', function() {
            toggleEntities.classList.toggle('active');
            if (entityLayer) {
                entityLayer.classList.toggle('hidden');
                playMapSound();
                
                // If turning on, play entity sound
                if (!entityLayer.classList.contains('hidden')) {
                    playEntitySound();
                }
            }
        });
    }
    
    // Toggle lights visibility
    if (toggleLights) {
        toggleLights.addEventListener('click', function() {
            toggleLights.classList.toggle('active');
            if (lightsLayer) {
                lightsLayer.classList.toggle('hidden');
                playMapSound();
                
                // If turning on, play light sound
                if (!lightsLayer.classList.contains('hidden')) {
                    playLightSound();
                }
            }
        });
    }
    
    // Toggle anomalies visibility
    if (toggleAnomalies) {
        toggleAnomalies.addEventListener('click', function() {
            toggleAnomalies.classList.toggle('active');
            if (anomaliesLayer) {
                anomaliesLayer.classList.toggle('hidden');
                playMapSound();
                
                // If turning on, play anomaly sound
                if (!anomaliesLayer.classList.contains('hidden')) {
                    playAnomalySound();
                }
            }
        });
    }
    
    // Day slider functionality - enhanced with multiple event handlers
    if (daySlider) {
        // Handle input (live dragging)
        daySlider.addEventListener('input', function() {
            updateSliderValue(this.value);
        });
        
        // Handle change (for browsers that might not fire input events properly)
        daySlider.addEventListener('change', function() {
            updateSliderValue(this.value);
        });
        
        // Also add click handler for the slider container to improve usability
        const sliderContainer = daySlider.parentElement;
        if (sliderContainer) {
            sliderContainer.addEventListener('click', function(e) {
                // Don't interfere if the click was on the slider itself
                if (e.target === daySlider) return;
                
                // Calculate position and set slider value
                const rect = sliderContainer.getBoundingClientRect();
                const position = (e.clientX - rect.left) / rect.width;
                const min = parseInt(daySlider.min) || 1;
                const max = parseInt(daySlider.max) || 14;
                const value = Math.round(min + position * (max - min));
                
                // Set slider value and update display
                daySlider.value = value;
                updateSliderValue(value);
            });
        }
    }
    
    // Function to update display based on slider value
    function updateSliderValue(value) {
        const day = parseInt(value);
        displayDay = day;
        
        if (currentDay) {
            currentDay.textContent = day;
        }
        
        // Update visibility based on day
        updateMapForDay(day);
        
        // Play map sound
        playMapSound();
        
        // If day is 13 or higher, reveal hidden note
        if (day >= 13 && hiddenNote) {
            hiddenNote.classList.remove('hidden');
        } else if (hiddenNote) {
            hiddenNote.classList.add('hidden');
        }
        
        // If max day, show facility
        if (day >= 14 && facility) {
            facility.classList.remove('hidden');
            
            // Play anomaly sound
            playAnomalySound();
        } else if (facility) {
            facility.classList.add('hidden');
        }
    }
    
    // Add interactivity to locations - changed from hover to click with popup
    locations.forEach(location => {
        // Add cursor style to indicate clickable
        location.style.cursor = 'pointer';
        
        // Add hover effect
        location.addEventListener('mouseenter', function() {
            this.setAttribute('fill-opacity', '0.7');
        });
        
        location.addEventListener('mouseleave', function() {
            this.setAttribute('fill-opacity', '1');
        });
        
        // Add click event
        location.addEventListener('click', function() {
            // Get location name
            const name = this.getAttribute('data-name');
            
            if (name === 'FACILITY' && localStorage.getItem('facilityUnlocked') === 'true') {
                // Navigate to facility page
                navigateTo('facility.html');
            } else if (name === 'FACILITY') {
                // Play error and flash the facility
                playAnomalySound();
                flashElement(facility);
            } else if (name) {
                // For regular locations, show popup with info
                showLocationPopup(name);
            }
        });
    });
    
    // Create location info popup
    function createLocationInfoPopup() {
        // Create the popup container if it doesn't exist
        let popup = document.querySelector('.location-info-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'location-info-popup hidden';
            
            // Create close button
            const closeButton = document.createElement('div');
            closeButton.className = 'location-info-close';
            closeButton.innerHTML = '&times;';
            closeButton.addEventListener('click', function() {
                popup.classList.add('hidden');
                playMapSound();
            });
            
            // Create content container
            const content = document.createElement('div');
            content.className = 'location-info-content';
            
            // Add elements to popup
            popup.appendChild(closeButton);
            popup.appendChild(content);
            
            // Add popup to map container
            document.querySelector('.map-container').appendChild(popup);
            
            // Add CSS for the popup
            const style = document.createElement('style');
            style.textContent = `
                .location-info-popup {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(0, 17, 0, 0.9);
                    border: 2px solid #0f0;
                    padding: 20px;
                    max-width: 300px;
                    z-index: 100;
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
                    animation: fadeIn 0.3s forwards;
                }
                
                .location-info-popup.hidden {
                    display: none;
                }
                
                .location-info-close {
                    position: absolute;
                    top: 5px;
                    right: 10px;
                    font-size: 24px;
                    cursor: pointer;
                    color: #0f0;
                }
                
                .location-info-close:hover {
                    color: #fff;
                }
                
                .location-info-content h3 {
                    color: #0f0;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #0f0;
                    padding-bottom: 5px;
                }
                
                .location-info-content p {
                    margin-bottom: 10px;
                }
                
                .location-info-content .alert-text {
                    color: #f00;
                }
                
                /* Add cursor style for SVG elements */
                .location {
                    cursor: pointer;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Show location popup
    function showLocationPopup(name) {
        const popup = document.querySelector('.location-info-popup');
        const content = document.querySelector('.location-info-content');
        
        if (!popup || !content) return;
        
        // Add content based on location
        let contentHTML = '';
        switch (name) {
            case 'HOME':
                contentHTML = '<h3>HOME</h3><p>Christopher\'s residence at 42 Maple St.</p><p>No signs of family. Food in fridge still fresh.</p>';
                break;
            case 'SCHOOL':
                contentHTML = '<h3>MILLFIELD HIGH SCHOOL</h3><p>Building locked but accessible through gym doors.</p><p>Found yearbook photos with faces blurred.</p>';
                break;
            case 'MALL':
                contentHTML = '<h3>MILLFIELD MALL</h3><p>All stores intact but abandoned.</p><p>Mannequins sometimes appear to move between visits.</p>';
                break;
            case 'POLICE':
                contentHTML = '<h3>POLICE STATION</h3><p>Doors unlocked, weapons still in place.</p><p>911 call log shows surge of calls at 2:15 AM on 6/22.</p>';
                break;
            case 'HOSPITAL':
                contentHTML = '<h3>MILLFIELD HOSPITAL</h3><p>Patient rooms empty, medical equipment still running.</p><p>Found patient chart with my name, dated 1991.</p>';
                break;
            case 'FACILITY':
                contentHTML = '<h3>UNKNOWN FACILITY</h3><p>Structure visible only from train tracks.</p><p>Blue lights congregate around this area.</p><p class="alert-text">RESTRICTED AREA</p>';
                break;
            default:
                contentHTML = '<h3>' + name + '</h3><p>No additional information available.</p>';
        }
        
        content.innerHTML = contentHTML;
        popup.classList.remove('hidden');
        
        // Play sound
        playMapSound();
    }
    
    // Flash an element temporarily
    function flashElement(element) {
        if (element) {
            element.classList.remove('hidden');
            setTimeout(() => {
                element.classList.add('hidden');
            }, 500);
            setTimeout(() => {
                element.classList.remove('hidden');
            }, 1000);
            setTimeout(() => {
                element.classList.add('hidden');
            }, 1500);
        }
    }
    
    // Update map elements based on current day
    function updateMapForDay(day) {
        // Update entity visibility
        if (entityLayer) {
            const entityCircles = entityLayer.querySelectorAll('.entity');
            entityCircles.forEach(circle => {
                const entityDay = parseInt(circle.getAttribute('data-day')) || 99;
                if (entityDay <= day) {
                    circle.style.display = 'block';
                } else {
                    circle.style.display = 'none';
                }
            });
        }
        
        // Update lights visibility
        if (lightsLayer) {
            const lightCircles = lightsLayer.querySelectorAll('.light');
            lightCircles.forEach(circle => {
                const lightDay = parseInt(circle.getAttribute('data-day')) || 99;
                if (lightDay <= day) {
                    circle.style.display = 'block';
                } else {
                    circle.style.display = 'none';
                }
            });
            
            const lightPaths = lightsLayer.querySelectorAll('.light-path');
            lightPaths.forEach(path => {
                const pathDay = parseInt(path.getAttribute('data-day')) || 99;
                if (pathDay <= day) {
                    path.classList.remove('hidden');
                } else {
                    path.classList.add('hidden');
                }
            });
        }
        
        // Update anomalies visibility
        if (anomaliesLayer) {
            const anomalyElements = anomaliesLayer.querySelectorAll('.anomaly, .fracture, .time-anomaly');
            anomalyElements.forEach(element => {
                const anomalyDay = parseInt(element.getAttribute('data-day')) || 99;
                if (anomalyDay <= day) {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            });
        }
        
        // Update roads/paths visibility (they get more distorted with time)
        roadElements.forEach(road => {
            const distortionLevel = Math.min(0.5, day * 0.03);
            if (day > 7) {
                road.style.transform = `skew(${distortionLevel}deg, ${distortionLevel * 2}deg)`;
            } else {
                road.style.transform = 'skew(0deg, 0deg)';
            }
        });
    }
    
    // Sound effects
    function playMapSound() {
        if (mapSound) {
            mapSound.volume = 0.2;
            mapSound.currentTime = 0;
            mapSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    function playEntitySound() {
        // Using anomaly sound for entities on the map
        if (anomalySound) {
            anomalySound.volume = 0.1;
            anomalySound.currentTime = 0;
            anomalySound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    function playLightSound() {
        if (mapSound) {
            mapSound.volume = 0.1;
            mapSound.playbackRate = 1.5;
            mapSound.currentTime = 0;
            mapSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    function playAnomalySound() {
        if (anomalySound) {
            anomalySound.volume = 0.3;
            anomalySound.currentTime = 0;
            anomalySound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    // Update the current date based on the day
    function updateDateDisplay() {
        if (currentDateDisplay) {
            const playerDay = parseInt(localStorage.getItem('endlessNightDay')) || 1;
            const baseDate = new Date('1993-06-22T02:17:00');
            baseDate.setDate(baseDate.getDate() + (playerDay - 1));
            
            const formattedDate = `${(baseDate.getMonth() + 1).toString().padStart(2, '0')}-${baseDate.getDate().toString().padStart(2, '0')}-1993 02:17:00 AM`;
            currentDateDisplay.textContent = formattedDate;
        }
    }
    
    // Handle navigation items click
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (this.classList.contains('locked')) {
                // Play error sound and show message
                playAnomalySound();
                alert('ACCESS DENIED: SECURITY CLEARANCE REQUIRED');
                return;
            }
            
            navigateTo(page);
        });
    });
    
    // Navigate to a page
    function navigateTo(page) {
        // Add loading effect
        document.body.style.opacity = '0.5';
        setTimeout(function() {
            window.location.href = page;
        }, 500);
    }
    
    // Check if facility is already unlocked
    if (localStorage.getItem('facilityUnlocked') === 'true') {
        const facilityNav = document.getElementById('facility-nav');
        if (facilityNav) {
            facilityNav.classList.remove('locked');
            facilityNav.textContent = 'FACILITY ACCESS';
        }
    }
    
    // Randomly distort the map occasionally
    setInterval(function() {
        if (Math.random() > 0.95) {
            // Apply a temporary distortion to the map
            const townMap = document.querySelector('.town-map');
            if (townMap) {
                townMap.style.transform = 'scale(1.01) skew(0.5deg, 0.5deg)';
                setTimeout(() => {
                    townMap.style.transform = 'scale(1) skew(0deg, 0deg)';
                }, 300);
                
                // Play a subtle anomaly sound
                if (anomalySound) {
                    anomalySound.volume = 0.1;
                    anomalySound.currentTime = 0;
                    anomalySound.play().catch(e => console.log('Sound play failed: ' + e));
                }
            }
        }
    }, 15000);
    
    // Start with day 1 view
    updateMapForDay(1);
});