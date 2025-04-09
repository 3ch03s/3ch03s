// Journal JavaScript for The Endless Night ARG

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const entryContainers = document.querySelectorAll('.entry-container');
    const entryHeaders = document.querySelectorAll('.entry-header');
    const currentDateDisplay = document.getElementById('current-date');
    const batteryLevel = document.getElementById('battery-level');
    const ambientSound = document.getElementById('ambient-sound');
    const pageTurnSound = document.getElementById('page-turn');
    const whisperSound = document.getElementById('whisper-sound');
    const shadowFigure = document.querySelector('.shadow-figure');
    const navItems = document.querySelectorAll('.nav-item');
    const hiddenTexts = document.querySelectorAll('.hidden-text');
    
    // Get player's current day from localStorage
    const playerDay = parseInt(localStorage.getItem('endlessNightDay')) || 1;
    
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
    
    // Show only entries that are unlocked based on player's progress
    // Using the formula: available entries = ceil(playerDay / 2)
    const availableEntries = Math.ceil(playerDay / 2);
    console.log(`Player day: ${playerDay}, Available entries: ${availableEntries}`);
    
    // Process each entry container
    entryContainers.forEach(container => {
        const entryDay = parseInt(container.getAttribute('data-day'));
        const header = container.querySelector('.entry-header');
        const content = container.querySelector('.entry-content');
        const icon = container.querySelector('.entry-icon');
        
        // Initially hide all entry content
        content.style.display = 'none';
        
        // If the entry is not yet unlocked, completely hide it
        if (entryDay > availableEntries) {
            container.style.display = 'none'; // Hide entire container instead of just showing locked
        } else {
            // Make sure container is visible
            container.style.display = 'block';
            
            // Add click event for unlocked entries
            header.addEventListener('click', function() {
                // Toggle the content display
                if (content.style.display === 'none') {
                    // Hide all other open entries first
                    entryContainers.forEach(otherContainer => {
                        if (otherContainer !== container && otherContainer.style.display !== 'none') {
                            otherContainer.querySelector('.entry-content').style.display = 'none';
                            otherContainer.querySelector('.entry-icon').textContent = '►';
                        }
                    });
                    
                    // Show this entry content
                    content.style.display = 'block';
                    icon.textContent = '▼';
                    playPageTurn();
                    
                    // Random chance to trigger whisper
                    if (Math.random() > 0.7) {
                        setTimeout(playWhisper, 1000);
                    }
                } else {
                    // Hide this entry content
                    content.style.display = 'none';
                    icon.textContent = '►';
                    playPageTurn();
                }
            });
        }
    });
    
    // For first-time visitors, auto-expand the first entry
    if (!localStorage.getItem('journalVisited')) {
        const firstVisibleEntry = Array.from(entryContainers).find(container => 
            container.style.display !== 'none'
        );
        
        if (firstVisibleEntry) {
            const content = firstVisibleEntry.querySelector('.entry-content');
            const icon = firstVisibleEntry.querySelector('.entry-icon');
            content.style.display = 'block';
            icon.textContent = '▼';
        }
        localStorage.setItem('journalVisited', 'true');
    }
    
    // Check for hidden texts to reveal
    checkForHiddenTexts();
    
    // Play page turn sound
    function playPageTurn() {
        if (pageTurnSound) {
            pageTurnSound.currentTime = 0;
            pageTurnSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    // Play whisper sound
    function playWhisper() {
        if (whisperSound) {
            whisperSound.volume = 0.2;
            whisperSound.currentTime = 0;
            whisperSound.play().catch(e => console.log('Sound play failed: ' + e));
            
            // Also trigger shadow figure
            if (shadowFigure) {
                shadowFigure.style.opacity = '0.3';
                setTimeout(() => {
                    shadowFigure.style.opacity = '0';
                }, 1500);
            }
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
    
    // Check for hidden texts that should be revealed
    function checkForHiddenTexts() {
        hiddenTexts.forEach(text => {
            const revealDay = parseInt(text.getAttribute('data-reveal-on-day')) || 99;
            
            if (playerDay >= revealDay) {
                text.classList.add('revealed');
            }
        });
    }
    
    // Handle navigation items click
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (this.classList.contains('locked')) {
                // Play error sound and show message
                if (whisperSound) {
                    whisperSound.currentTime = 0;
                    whisperSound.play().catch(e => console.log('Sound play failed: ' + e));
                }
                
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
    
    // Set up random corrupted text effect
    const paragraphs = document.querySelectorAll('.entry-content p');
    setInterval(function() {
        if (paragraphs.length > 0 && Math.random() > 0.9) {
            const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
            randomParagraph.setAttribute('data-text', randomParagraph.textContent);
            randomParagraph.classList.add('glitch-text');
            
            setTimeout(() => {
                randomParagraph.classList.remove('glitch-text');
            }, 3000);
        }
    }, 15000);
    
    // Set up subtle shadow figure appearances
    setInterval(function() {
        if (shadowFigure && Math.random() > 0.85) {
            shadowFigure.style.opacity = '0.15';
            setTimeout(() => {
                shadowFigure.style.opacity = '0';
            }, 1000);
        }
    }, 30000);
});