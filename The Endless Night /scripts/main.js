// Main JavaScript for The Endless Night ARG

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let daysCounter = 0;
    const bootSequence = document.querySelector('.boot-sequence');
    const loginPrompt = document.querySelector('.login-prompt');
    const terminalNav = document.querySelector('.terminal-nav');
    const errorMessages = document.querySelector('.error-messages');
    const ambientSound = document.getElementById('ambient-sound');
    const keySound = document.getElementById('key-sound');
    const errorSound = document.getElementById('error-sound');
    const successSound = document.getElementById('success-sound');
    const navItems = document.querySelectorAll('.nav-item');
    const commandInput = document.getElementById('command-input');
    const accessDenied = document.getElementById('access-denied');
    const systemError = document.getElementById('system-error');
    const shadowFigure = document.querySelector('.shadow-figure');
    const currentDateDisplay = document.querySelector('.date-time');
    
    // Set up the days counter and advance day each time the main terminal loads
    const daysCounterElement = document.getElementById('days-counter');
    if (daysCounterElement) {
        // If this is the first visit, start at day 1, otherwise increment by 1
        if (localStorage.getItem('endlessNightDay') === null) {
            localStorage.setItem('endlessNightDay', '1');
            daysCounter = 1;
        } else {
            // Increment the day counter each time the main terminal is loaded
            daysCounter = parseInt(localStorage.getItem('endlessNightDay'));
            daysCounter += 1;
            
            // Cap at day 14 (maximum for the story)
            if (daysCounter > 14) {
                daysCounter = 14;
            }
            
            localStorage.setItem('endlessNightDay', daysCounter.toString());
        }
        daysCounterElement.textContent = daysCounter;
        
        // Update the date display based on the current day
        updateDateDisplay();
        
        // Show a subtle message about time passing
        setTimeout(() => {
            const messageElement = document.createElement('p');
            messageElement.textContent = `ANOTHER DAY HAS PASSED IN THE DARKNESS...`;
            messageElement.style.color = '#0a0';
            messageElement.style.opacity = '0';
            
            // Insert before login prompt
            if (bootSequence && bootSequence.parentNode) {
                bootSequence.parentNode.appendChild(messageElement);
            }
            
            // Fade in the message
            setTimeout(() => {
                messageElement.style.transition = 'opacity 2s';
                messageElement.style.opacity = '1';
            }, 100);
            
            // Fade out after a few seconds
            setTimeout(() => {
                messageElement.style.opacity = '0';
            }, 5000);
        }, 16000); // Show after boot sequence completes
    }
    
    // Update the current date based on the day
    function updateDateDisplay() {
        if (currentDateDisplay) {
            const baseDate = new Date('1993-06-22T02:17:00');
            // Adjust date based on the current day counter
            baseDate.setDate(baseDate.getDate() + (daysCounter - 1));
            
            const formattedDate = `${(baseDate.getMonth() + 1).toString().padStart(2, '0')}-${baseDate.getDate().toString().padStart(2, '0')}-1993 02:17:00 AM`;
            currentDateDisplay.textContent = formattedDate;
        }
    }
    
    // Update the battery level to be slightly random
    const batteryLevel = document.getElementById('battery-level');
    if (batteryLevel) {
        const randomBattery = Math.floor(Math.random() * 20) + 60; // 60-80%
        batteryLevel.textContent = randomBattery;
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
    
    // After boot sequence completes, show login prompt
    setTimeout(function() {
        if (bootSequence && loginPrompt) {
            bootSequence.classList.add('hidden');
            loginPrompt.classList.remove('hidden');
            
            // Add event listener for typing
            document.addEventListener('keydown', handleKeyPress);
            
            // Show navigation after a short delay
            setTimeout(function() {
                if (terminalNav) {
                    terminalNav.classList.remove('hidden');
                }
            }, 2000);
        }
    }, 14000); // Match timing with CSS animations
    
    // Handle key press events
    function handleKeyPress(e) {
        // Only process if login prompt is visible
        if (loginPrompt.classList.contains('hidden')) {
            return;
        }
        
        // Play key press sound
        if (keySound) {
            keySound.currentTime = 0;
            keySound.play().catch(e => console.log('Sound play failed: ' + e));
        }
        
        if (e.key === 'Enter') {
            const command = commandInput.textContent.trim().toUpperCase();
            processCommand(command);
            commandInput.textContent = '';
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            commandInput.textContent = commandInput.textContent.slice(0, -1);
        } else if (e.key.length === 1) {
            commandInput.textContent += e.key;
        }
    }
    
    // Process command input
    function processCommand(command) {
        console.log('Processing command: ' + command);
        
        if (command === 'HELP') {
            showMessage('Available commands: HELP, ACCESS, JOURNAL, SIGHTINGS, MAP');
        } else if (command === 'ACCESS' || command === 'JOURNAL' || command === 'SIGHTINGS' || command === 'MAP') {
            navigateTo(command.toLowerCase() + '.html');
        } else if (command === 'NIGHTFALL') {
            unlockFacility();
        } else {
            showError('ACCESS DENIED: UNKNOWN COMMAND');
        }
    }
    
    // Show error message
    function showError(message) {
        if (errorSound) {
            errorSound.currentTime = 0;
            errorSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
        
        if (message.includes('ACCESS DENIED')) {
            accessDenied.textContent = message;
            accessDenied.style.display = 'block';
            systemError.style.display = 'none';
        } else {
            systemError.textContent = message;
            systemError.style.display = 'block';
            accessDenied.style.display = 'none';
        }
        
        errorMessages.classList.remove('hidden');
        errorMessages.classList.add('show');
        
        setTimeout(function() {
            errorMessages.classList.remove('show');
            errorMessages.classList.add('hidden');
        }, 3000);
    }
    
    // Show message in the terminal
    function showMessage(message) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        
        // Insert before login prompt
        if (loginPrompt.parentNode) {
            loginPrompt.parentNode.insertBefore(messageElement, loginPrompt);
        }
    }
    
    // Handle navigation items click
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            
            if (this.classList.contains('locked')) {
                showError('ACCESS DENIED: SECURITY CLEARANCE REQUIRED');
                return;
            }
            
            navigateTo(page);
        });
    });
    
    // Navigate to a page
    function navigateTo(page) {
        if (successSound) {
            successSound.currentTime = 0;
            successSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
        
        // Add loading effect
        document.body.style.opacity = '0.5';
        setTimeout(function() {
            window.location.href = page;
        }, 500);
    }
    
    // Unlock facility page
    function unlockFacility() {
        const facilityNav = document.getElementById('facility-nav');
        
        if (facilityNav) {
            if (successSound) {
                successSound.currentTime = 0;
                successSound.play().catch(e => console.log('Sound play failed: ' + e));
            }
            
            // Save to localStorage that facility is unlocked
            localStorage.setItem('facilityUnlocked', 'true');
            
            facilityNav.classList.remove('locked');
            facilityNav.textContent = 'FACILITY ACCESS';
            
            showMessage('FACILITY ACCESS GRANTED: PROJECT NIGHTFALL');
            
            // Trigger shadow figure animation
            if (shadowFigure) {
                shadowFigure.style.opacity = '0.5';
                setTimeout(() => {
                    shadowFigure.style.opacity = '0';
                }, 3000);
            }
        }
    }
    
    // Check if facility is already unlocked
    if (localStorage.getItem('facilityUnlocked') === 'true') {
        const facilityNav = document.getElementById('facility-nav');
        if (facilityNav) {
            facilityNav.classList.remove('locked');
            facilityNav.textContent = 'FACILITY ACCESS';
        }
    }
    
    // Set up random glitch effects
    setInterval(function() {
        const randomGlitch = Math.random();
        if (randomGlitch > 0.97) {
            // Trigger shadow figure
            if (shadowFigure) {
                shadowFigure.style.opacity = '0.2';
                setTimeout(() => {
                    shadowFigure.style.opacity = '0';
                }, 300);
            }
            
            // Randomly glitch text
            const paragraphs = document.querySelectorAll('p');
            if (paragraphs.length > 0) {
                const randomParagraph = paragraphs[Math.floor(Math.random() * paragraphs.length)];
                randomParagraph.classList.add('corrupted-text');
                setTimeout(() => {
                    randomParagraph.classList.remove('corrupted-text');
                }, 500);
            }
        }
    }, 10000);
    
    // Easter egg: Konami code to reveal hidden message
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Konami code completed
                revealHiddenMessage();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function revealHiddenMessage() {
        const hiddenMessage = document.querySelector('.hidden-message');
        if (hiddenMessage) {
            hiddenMessage.style.color = 'rgba(255, 0, 0, 0.5)';
            setTimeout(() => {
                hiddenMessage.style.color = 'rgba(255, 0, 0, 0.1)';
            }, 3000);
        }
        
        // Unlock facility
        unlockFacility();
    }
});