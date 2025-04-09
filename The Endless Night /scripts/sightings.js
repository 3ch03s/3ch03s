// Sightings JavaScript for The Endless Night ARG

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const shadowCount = document.getElementById('shadow-count');
    const lightCount = document.getElementById('light-count');
    const entityCards = document.querySelectorAll('.entity-card');
    const classifiedTab = document.getElementById('classified-tab');
    const classifiedPassword = document.getElementById('classified-password');
    const submitPassword = document.getElementById('submit-password');
    const attemptsLeft = document.getElementById('attempts-left');
    const batteryLevel = document.getElementById('battery-level');
    const currentDateDisplay = document.getElementById('current-date');
    const ambientSound = document.getElementById('ambient-sound');
    const entitySound = document.getElementById('entity-sound');
    const lightSound = document.getElementById('light-sound');
    const errorSound = document.getElementById('error-sound');
    const navItems = document.querySelectorAll('.nav-item');
    const hiddenTexts = document.querySelectorAll('.hidden-text');
    
    // Get player's current day from localStorage
    const playerDay = parseInt(localStorage.getItem('endlessNightDay')) || 1;
    
    // Track password attempts
    let passwordAttempts = 3;
    
    // Update the current date display
    updateDateDisplay();
    
    // Update the battery level to decrease slightly
    if (batteryLevel) {
        let battery = parseInt(batteryLevel.textContent);
        battery = Math.max(battery - Math.floor(Math.random() * 5), 20); // Decrease by 0-5%, min 20%
        batteryLevel.textContent = battery;
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
    
    // Show/hide entity tabs based on player's progress
    // Shadow entities first appear on day 4
    // Blue lights first appear on day 9
    if (playerDay < 4) {
        // If before day 4, hide both shadow and blue lights tabs
        document.querySelector('[data-tab="shadow-entities"]').style.display = 'none';
        document.querySelector('[data-tab="blue-lights"]').style.display = 'none';
        
        // Create a message tab
        const noEntitiesTab = document.createElement('button');
        noEntitiesTab.className = 'tab-button active';
        noEntitiesTab.textContent = 'NO ENTITIES DOCUMENTED';
        document.querySelector('.tabs').appendChild(noEntitiesTab);
        
        // Create a message panel
        const noEntitiesPanel = document.createElement('div');
        noEntitiesPanel.className = 'tab-panel active';
        noEntitiesPanel.innerHTML = '<div class="no-entities-message"><p>No unusual entities have been documented yet.</p><p>Check back after further exploration of Millfield.</p></div>';
        document.querySelector('.tab-content').appendChild(noEntitiesPanel);
    } else if (playerDay >= 4 && playerDay < 9) {
        // If after day 4 but before day 9, show shadow entities but hide blue lights
        document.querySelector('[data-tab="shadow-entities"]').classList.add('active');
        document.querySelector('#shadow-entities').classList.add('active');
        document.querySelector('[data-tab="blue-lights"]').style.display = 'none';
    } else {
        // If day 9 or later, show both tabs
        document.querySelector('[data-tab="shadow-entities"]').classList.add('active');
        document.querySelector('#shadow-entities').classList.add('active');
    }
    
    // Update entity counts based on the current day
    updateEntityCounts();
    
    // Show/hide entity cards based on player day - shadow entities
    document.querySelectorAll('.entity-card[data-entity^="shadow-"]').forEach(card => {
        const entityNumber = parseInt(card.getAttribute('data-entity').split('-')[1]);
        
        // Determine day when this entity should appear
        // For simplicity: entity-1 appears day 4, entity-2 appears day 5, etc.
        const appearDay = 3 + entityNumber;
        
        if (playerDay < appearDay) {
            card.style.display = 'none';
        }
    });
    
    // Show/hide entity cards based on player day - blue lights
    document.querySelectorAll('.entity-card[data-entity^="light-"]').forEach(card => {
        const entityNumber = parseInt(card.getAttribute('data-entity').split('-')[1]);
        
        // Determine day when this entity should appear
        // For simplicity: light-1 appears day 9, light-2 appears day 10, etc.
        const appearDay = 8 + entityNumber;
        
        if (playerDay < appearDay) {
            card.style.display = 'none';
        }
    });
    
    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Skip if the tab is locked
            if (this.classList.contains('locked')) {
                playErrorSound();
                return;
            }
            
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to selected tab
            this.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Play appropriate sound for tab
            if (tabName === 'shadow-entities') {
                playEntitySound();
            } else if (tabName === 'blue-lights') {
                playLightSound();
            }
        });
    });
    
    // Entity card hover effects
    entityCards.forEach(card => {
        if (card.style.display !== 'none') { // Only for visible cards
            card.addEventListener('mouseenter', function() {
                const entityType = this.getAttribute('data-entity');
                
                if (entityType && entityType.startsWith('shadow')) {
                    playEntitySound(0.1);
                } else if (entityType && entityType.startsWith('light')) {
                    playLightSound(0.1);
                }
                
                // Show hidden image if available
                const hiddenImage = this.querySelector('.hidden-image');
                if (hiddenImage && !this.classList.contains('locked')) {
                    hiddenImage.style.opacity = '0.2';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                // Hide hidden image
                const hiddenImage = this.querySelector('.hidden-image');
                if (hiddenImage) {
                    hiddenImage.style.opacity = '0';
                }
            });
        }
    });
    
    // Classified tab password functionality
    if (submitPassword) {
        submitPassword.addEventListener('click', function() {
            checkPassword();
        });
    }
    
    if (classifiedPassword) {
        classifiedPassword.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Check password for classified tab
    function checkPassword() {
        const password = classifiedPassword.value.trim().toUpperCase();
        
        if (password === 'NIGHTFALL') {
            // Correct password
            unlockFacility();
            
            // Update UI
            const accessDeniedScreen = document.querySelector('.access-denied-screen');
            if (accessDeniedScreen) {
                accessDeniedScreen.innerHTML = '<h2>ACCESS GRANTED</h2><p>Redirecting to facility access...</p>';
                
                // Redirect to facility page
                setTimeout(function() {
                    window.location.href = 'facility.html';
                }, 3000);
            }
        } else {
            // Wrong password
            passwordAttempts--;
            
            if (attemptsLeft) {
                attemptsLeft.textContent = passwordAttempts;
            }
            
            // Play error sound
            playErrorSound();
            
            // If no attempts left, lock account
            if (passwordAttempts <= 0) {
                const accessDeniedScreen = document.querySelector('.access-denied-screen');
                if (accessDeniedScreen) {
                    accessDeniedScreen.innerHTML = '<h2>TERMINAL LOCKED</h2><p class="alert-text">TOO MANY FAILED ATTEMPTS</p><p>System will reset in 30 seconds</p>';
                    
                    // Redirect to main page
                    setTimeout(function() {
                        window.location.href = 'index.html';
                    }, 5000);
                }
            }
        }
    }
    
    // Unlock facility page
    function unlockFacility() {
        const facilityNav = document.getElementById('facility-nav');
        
        if (facilityNav) {
            // Save to localStorage that facility is unlocked
            localStorage.setItem('facilityUnlocked', 'true');
            
            facilityNav.classList.remove('locked');
            facilityNav.textContent = 'FACILITY ACCESS';
        }
        
        if (classifiedTab) {
            classifiedTab.classList.remove('locked');
        }
    }
    
    // Play entity sound
    function playEntitySound(volume = 0.3) {
        if (entitySound) {
            entitySound.volume = volume;
            entitySound.currentTime = 0;
            entitySound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    // Play light sound
    function playLightSound(volume = 0.3) {
        if (lightSound) {
            lightSound.volume = volume;
            lightSound.currentTime = 0;
            lightSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    // Play error sound
    function playErrorSound() {
        if (errorSound) {
            errorSound.volume = 0.3;
            errorSound.currentTime = 0;
            errorSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    // Update the current date based on the day
    function updateDateDisplay() {
        if (currentDateDisplay) {
            const baseDate = new Date('1993-06-22T02:17:00');
            baseDate.setDate(baseDate.getDate() + (playerDay - 1));
            
            const formattedDate = `${(baseDate.getMonth() + 1).toString().padStart(2, '0')}-${baseDate.getDate().toString().padStart(2, '0')}-1993 02:17:00 AM`;
            currentDateDisplay.textContent = formattedDate;
        }
    }
    
    // Update entity counts based on current day
    function updateEntityCounts() {
        // Shadow entities start appearing on day 4
        if (shadowCount) {
            if (playerDay < 4) {
                shadowCount.textContent = '0';
            } else {
                const shadowEntities = Math.min(7, Math.max(1, Math.floor((playerDay - 3) * 0.5)));
                shadowCount.textContent = shadowEntities;
            }
        }
        
        // Blue lights start appearing on day 9
        if (lightCount) {
            if (playerDay < 9) {
                lightCount.textContent = '0';
            } else {
                const lightEntities = Math.min(5, Math.max(1, Math.floor((playerDay - 8) * 0.8)));
                lightCount.textContent = lightEntities;
            }
        }
        
        // Show hidden texts based on time spent
        hiddenTexts.forEach(text => {
            const showAfter = parseInt(text.getAttribute('data-show-after')) || 60;
            setTimeout(() => {
                text.style.color = 'rgba(255, 0, 0, 0.7)';
            }, showAfter * 1000);
        });
    }
    
    // Handle navigation items click
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (this.classList.contains('locked')) {
                // Play error sound and show message
                playErrorSound();
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
        
        // Also unlock the classified tab
        if (classifiedTab) {
            classifiedTab.classList.remove('locked');
        }
    }
    
    // Add CSS for "No entities" message
    const style = document.createElement('style');
    style.textContent = `
        .no-entities-message {
            text-align: center;
            padding: 50px 20px;
            color: #0f0;
            font-size: 18px;
            line-height: 1.6;
        }
        
        .no-entities-message p {
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(style);
    
    // Random glitch effects for entity images
    setInterval(function() {
        if (Math.random() > 0.9) {
            const visibleCards = Array.from(entityCards).filter(card => card.style.display !== 'none');
            if (visibleCards.length > 0) {
                const randomCard = visibleCards[Math.floor(Math.random() * visibleCards.length)];
                const image = randomCard.querySelector('.entity-image');
                if (image) {
                    image.style.transform = 'scale(1.05) skew(2deg, 2deg)';
                    setTimeout(() => {
                        image.style.transform = 'scale(1) skew(0deg, 0deg)';
                    }, 200);
                    
                    // Also play a faint entity sound
                    if (randomCard.getAttribute('data-entity').startsWith('shadow')) {
                        playEntitySound(0.05);
                    } else if (randomCard.getAttribute('data-entity').startsWith('light')) {
                        playLightSound(0.05);
                    }
                }
            }
        }
    }, 10000);
});