// Enhanced Horror Website Javascript
// Controls interactivity, reveals, secret messages, and effects

// --- Core Interactive Functions ---

// Show hidden detail sections
function showDetail(elementId) {
    const element = document.getElementById(elementId);
    if (element && element.classList.contains('hidden')) {
        element.classList.remove('hidden');
        triggerGlitchEffect(element.closest('section') || element, 300);
        triggerWarningMaybe();
        
        // Special case for terminal interaction
        if (elementId === 'loginSecret' || elementId === 'fileList' || elementId === 'terminalOutput') {
            playAudio('staticSound', 0.3);
            
            // If revealing terminal options
            if (elementId === 'loginSecret') {
                setTimeout(() => {
                    const terminalOptions = document.getElementById('terminalOptions');
                    if (terminalOptions) {
                        terminalOptions.classList.remove('hidden');
                    }
                }, 1000);
            }
        }
    }
}

// Function to reveal horror text
function revealHorror(elementId) {
    const horrorElement = document.getElementById(elementId);
    if (horrorElement && horrorElement.classList.contains('hidden')) {
        horrorElement.classList.remove('hidden');
        horrorElement.classList.add('horror-reveal'); // Use a generic reveal animation if needed
        triggerWarningMaybe();
        triggerGlitchEffect(horrorElement, 400);
        playAudio('laughSound', 0.5); // Example sound trigger

        // Special case for lost page hint
        if (elementId === 'lostPageHint') {
            console.log("%cLOST PAGE COORDINATES FOUND", "color: green; font-weight: bold;");
            console.log("%cCheck source for remnants.html", "color: green;");
        }
    }
}

// Updated Decode Function for Redacted Text
function decodeRedacted(element) {
    if (element && element.classList.contains('interactive-redacted') && !element.classList.contains('revealed')) {
        const revealText = element.getAttribute('data-reveal');
        if (revealText) {
            element.textContent = revealText;
            element.classList.remove('interactive-redacted');
            element.classList.add('revealed-text'); // Apply revealing style
            element.style.cursor = 'default';
            triggerGlitchEffect(element.closest('.classified-doc') || element, 200); // Glitch parent doc
            playAudio('staticSound', 0.2); // Subtle sound
            triggerWarningMaybe(); // Count interaction
            
            // Log discovery in console
            console.log("%cREDACTED TEXT REVEALED:", "color: red;");
            console.log("%c" + revealText, "color: #ff4040;");
        }
    }
}

// Enhanced Audio Play Function
function playAudio(audioId, volume = 0.7) {
    const sound = document.getElementById(audioId);
    if (sound) {
        sound.currentTime = 0; // Rewind
        sound.volume = volume; // Set volume
        sound.play().catch(error => console.warn(`Audio playback failed for ${audioId}:`, error));
    } else {
        console.warn(`Audio element '${audioId}' not found!`);
    }
}

// Function to stop audio playback
function stopAudio(audioId) {
    const sound = document.getElementById(audioId);
    if (sound) {
        sound.pause();
        sound.currentTime = 0;
    }
}

// Function to loop audio
function loopAudio(audioId) {
    const sound = document.getElementById(audioId);
    if (sound) {
        sound.loop = true;
        sound.play().catch(error => console.warn(`Audio loop failed:`, error));
    }
}

// Simple Caesar Cipher Decoder
function caesarCipher(str, shift) {
    return str.split('').map(char => {
        if (char.match(/[a-z]/i)) {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + shift) % 26) + base);
        }
        return char;
    }).join('');
}

// Decode and display ciphered message
function decodeMessage(elementId, shift) {
    const element = document.getElementById(elementId);
    if (element) {
        const encoded = element.getAttribute('data-encoded');
        if (encoded) {
            const decoded = caesarCipher(encoded, shift);
            element.textContent = decoded;
            element.classList.add('decoded');
            triggerGlitchEffect(element, 300);
        }
    }
}

// Final Secret Reveal on Classified Page
function revealFinalSecret() {
    const finalSecret = document.getElementById('finalSecret');
    const hiddenTerminal = document.getElementById('hiddenTerminal');
    
    if (finalSecret) {
        finalSecret.classList.remove('hidden');
        triggerGlitchEffect(document.body, 1000); // Big glitch!
        
        // Show hidden terminal after delay
        setTimeout(() => {
            if (hiddenTerminal) {
                hiddenTerminal.classList.remove('hidden');
                playAudio('staticSound', 0.8);
            }
        }, 2000);
        
        console.error("CONTAINMENT BREACH // CHIMERA PARADOX CONFIRMED // THEY ARE LOOSE");
        
        // Flash screen red briefly
        const flashOverlay = document.createElement('div');
        flashOverlay.style.position = 'fixed';
        flashOverlay.style.top = '0';
        flashOverlay.style.left = '0';
        flashOverlay.style.width = '100%';
        flashOverlay.style.height = '100%';
        flashOverlay.style.backgroundColor = 'rgba(255,0,0,0.3)';
        flashOverlay.style.zIndex = '9999';
        flashOverlay.style.pointerEvents = 'none';
        document.body.appendChild(flashOverlay);
        
        setTimeout(() => {
            document.body.removeChild(flashOverlay);
        }, 200);
    }
    
    // Disable the button after click
    event.target.disabled = true;
    event.target.textContent = "TRUTH REVEALED";
    event.target.style.backgroundColor = '#555';
}

// Warning Trigger Logic
let revealedCount = 0;
const revealThreshold = 3; // Adjusted from original 2

function triggerWarningMaybe() {
    revealedCount++;
    // After several interactions, maybe show warning
    if (revealedCount >= revealThreshold && Math.random() > 0.5) {
        const warning = document.getElementById('warning');
        if (warning && warning.classList.contains('hidden')) {
            warning.classList.remove('hidden');
            triggerGlitchEffect(document.body, 1000);
            playAudio('staticSound', 0.7);
            // Change cursor to something creepy
            document.body.style.cursor = 'url(images/clown_cursor.png), auto';
        }
    }
}

function hideWarning() {
    const warning = document.getElementById('warning');
    if (warning) {
        warning.classList.add('hidden');
        // Maybe restore cursor
        document.body.style.cursor = 'auto';
    }
}

// Visual Glitch Effect
function triggerGlitchEffect(element, duration = 300) {
    if (!element) return;
    
    // Add the glitch class
    element.classList.add('glitch-effect');
    
    // Remove it after duration
    setTimeout(() => {
        element.classList.remove('glitch-effect');
    }, duration);
    
    // Maybe trigger a color bleed too
    if (Math.random() > 0.7) {
        element.classList.add('bleed-effect');
        setTimeout(() => {
            element.classList.remove('bleed-effect');
        }, duration + 200);
    }
}

// --- Initialization and Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("%c/// SYSTEM BOOTING... CORRUPTION DETECTED: ██████% ///", "color: red; font-weight: bold; font-size: 1.2em;");
    console.warn("~*~ Welcome to the show! Don't lose your head... ~*~");

    // Setup a simple click-to-play system for background music
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.4; // Lower volume for background music
        
        // Create a simple popup overlay
        const musicPrompt = document.createElement('div');
        musicPrompt.style.position = 'fixed';
        musicPrompt.style.top = '50%';
        musicPrompt.style.left = '50%';
        musicPrompt.style.transform = 'translate(-50%, -50%)';
        musicPrompt.style.backgroundColor = '#000000';
        musicPrompt.style.color = '#ff0000';
        musicPrompt.style.padding = '30px';
        musicPrompt.style.width = '600px';
        musicPrompt.style.height = '400px';
        musicPrompt.style.display = 'flex';
        musicPrompt.style.alignItems = 'center';
        musicPrompt.style.justifyContent = 'center';
        musicPrompt.style.borderRadius = '5px';
        musicPrompt.style.fontFamily = 'Creepster, cursive';
        musicPrompt.style.fontSize = '3em';
        musicPrompt.style.zIndex = '9999';
        musicPrompt.style.cursor = 'pointer';
        musicPrompt.style.border = '4px solid #ff0000';
        musicPrompt.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5)';
        musicPrompt.style.textAlign = 'center';
        musicPrompt.style.backgroundImage = 'url("images/popup_background.png")';
        musicPrompt.style.backgroundSize = 'cover';
        musicPrompt.style.backgroundPosition = 'center';
        musicPrompt.innerHTML = 'Click anywhere<br>to start the show!';
        musicPrompt.style.overflow = 'hidden';
        
        // No blood drip effects
        
        // Create a text container with higher z-index
        const promptText = document.createElement('div');
        promptText.innerHTML = musicPrompt.innerHTML;
        promptText.style.position = 'relative';
        promptText.style.zIndex = '2';
        promptText.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 4px rgba(0, 0, 0, 0.8), 2px -2px 4px rgba(0, 0, 0, 0.8), -2px 2px 4px rgba(0, 0, 0, 0.8)';
        
        // Clear the original innerHTML and append the text element
        musicPrompt.innerHTML = '';
        musicPrompt.appendChild(promptText);
        
        document.body.appendChild(musicPrompt);
        
        // Handle click to start music
        musicPrompt.addEventListener('click', function() {
            // Play music
            bgMusic.play().catch(e => console.warn('Failed to play audio:', e));
            
            // Remove prompt
            if (document.body.contains(musicPrompt)) {
                document.body.removeChild(musicPrompt);
            }
            
            // Show confirmation
            const notification = document.createElement('div');
            notification.style.position = 'fixed';
            notification.style.bottom = '10px';
            notification.style.right = '10px';
            notification.style.backgroundColor = 'rgba(0,0,0,0.7)';
            notification.style.color = '#ff0000';
            notification.style.padding = '5px 10px';
            notification.style.borderRadius = '5px';
            notification.style.zIndex = '999';
            notification.innerHTML = '♫ Music started...';
            document.body.appendChild(notification);
            
            // Fade out notification
            setTimeout(() => {
                notification.style.transition = 'opacity 1s';
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 1000);
            }, 2000);
        });
    }
    
    // Add listener for interactive redacted text
    document.querySelectorAll('.interactive-redacted').forEach(element => {
        element.addEventListener('click', () => decodeRedacted(element));
    });

    // Add listeners for general interactive text
    document.querySelectorAll('.interactive-text').forEach(element => {
        // Only add if it doesn't already have an onclick attribute
        if (!element.hasAttribute('onclick')) {
            element.addEventListener('click', function() {
                // If it has a data attribute for revealing something, use that
                const revealId = element.getAttribute('data-reveal');
                if (revealId) {
                    showDetail(revealId);
                } else {
                    // Otherwise just do a generic glitch effect
                    triggerGlitchEffect(element.closest('article') || element, 300);
                }
            });
        }
    });

    // Initial random glitch effect
    setTimeout(() => {
        if (Math.random() > 0.7) { // 30% chance
            triggerGlitchEffect(document.body, 500);
            console.log("...a flicker in the static...");
        }
    }, 1500);

    // Set up countdown timer
    setupCountdown();

    // Update visitor counter with random numbers periodically
    let visitorCounters = document.querySelectorAll('.visitor-counter span');
    if (visitorCounters.length) {
        setInterval(() => {
            visitorCounters.forEach(counter => {
                // Update the last digit randomly
                let digits = counter.textContent.split(' ');
                if (digits.length > 0) {
                    digits[digits.length - 1] = Math.floor(Math.random() * 10).toString();
                    counter.textContent = digits.join(' ');
                }
            });
        }, 3000);
    }

    // Console hint based on current page
    const bodyClass = document.body.className;
    const consoleHint = document.getElementById('consoleHint');
    if (consoleHint) {
        if (bodyClass.includes('page-history')) {
            consoleHint.textContent = "Check the dates. Check Nevada. Connect the dots...";
        } else if (bodyClass.includes('page-murders')) {
            consoleHint.textContent = "Cloves... paint... rope... Mama's work? Or Papa's?";
        } else if (bodyClass.includes('page-classified')) {
            consoleHint.textContent = "What IS Protocol Gamma-7? What is the Paradox Event?";
            console.log("%cPROJECT CHIMERA - ACTIVE FILES:", "color: #00ff00;");
            console.log("File: ASSET_PROFILE_CLOWNFISH.DAT");
            console.log("File: PROTOCOL_GAMMA7_EFFECTS.LOG [CORRUPTED]");
            console.log("File: CONTAINMENT_PROCEDURES_ECHO7.PDF");
            console.log("File: PARADOX_EVENT_THEORY.TXT [ACCESS DENIED]");
        }
    }

    // Set active state for navigation based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Check if user has visited before
    if (!localStorage.getItem('barlowVisited')) {
        localStorage.setItem('barlowVisited', 'true');
        // First time visitor - subtle effect
        setTimeout(() => {
            playAudio('laughSound', 0.1);
        }, 30000); // After 30 seconds
    } else {
        // Returning visitor - they're coming back for more!
        console.log("%cWELCOME BACK... THEY MISSED YOU.", "color: red; font-style: italic;");
    }

    // Set up the Konami code easter egg
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiPosition]) {
            konamiPosition++;
            if (konamiPosition === konamiCode.length) {
                activateEasterEgg();
                konamiPosition = 0;
            }
        } else {
            konamiPosition = 0;
        }
    });

    // Hidden message in HTML comment
    injectHiddenMessage();
});

// Countdown setup
function setupCountdown() {
    const countdownElements = document.querySelectorAll('.countdown-value');
    if (countdownElements.length) {
        // Fixed start time: 01:02:03
        let hours = 1;
        let minutes = 2;
        let seconds = 3;
        
        // Update every second
        setInterval(() => {
            // Decrease time
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    if (hours < 0) {
                        // When countdown hits zero, redirect to remnants.html
                        window.location.href = 'remnants.html';
                        
                        // Special effect when countdown hits zero
                        triggerGlitchEffect(document.body, 1000);
                        playAudio('staticSound', 0.4);
                    }
                }
            }
            
            // Format and display
            countdownElements.forEach(el => {
                el.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            });
        }, 1000);
    }
}

// Easter egg function
function activateEasterEgg() {
    console.log("%cKONAMI CODE ACCEPTED", "color: green; font-size: 16px;");
    console.log("%cACCESSING HIDDEN FILE: remnants.html", "color: green;");
    playAudio('staticSound', 0.6);
    
    // Create a message on screen
    const message = document.createElement('div');
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.backgroundColor = 'black';
    message.style.color = '#00ff00';
    message.style.padding = '20px';
    message.style.zIndex = '9999';
    message.style.border = '3px solid #00ff00';
    message.style.fontFamily = 'monospace';
    message.style.textAlign = 'center';
    message.innerHTML = 'ACCESS GRANTED<br>remnants.html<br><span style="font-size:0.8em;">Click to proceed</span>';
    
    // Make it clickable to navigate to remnants.html
    message.style.cursor = 'pointer';
    message.onclick = function() {
        window.location.href = 'remnants.html';
    };
    
    document.body.appendChild(message);
    
    // Remove after 5 seconds if not clicked
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 5000);
}

// Function to inject a hidden comment into the page HTML
function injectHiddenMessage() {
    const comment = document.createComment(' THE CHIMERA PARADOX: When the barrier between realities dissolves. Find the hidden page. 36.4°N 113.9°W THEY WAIT STILL. PASSWORD: chimera_lake ');
    document.body.appendChild(comment);
}

// Function to handle lever pull in sidebar
function pullTheLever(element) {
    playAudio('leverSound', 0.7);
    triggerGlitchEffect(element, 300);
    element.classList.add('lever-pulled');
    
    // Reset lever after a moment
    setTimeout(() => {
        if (element.classList.contains('lever-pulled')) {
            element.classList.remove('lever-pulled');
        }
    }, 2000);
}

// Function to handle tamagotchi feeding
function feedTamagotchi() {
    const tamagotchiImg = document.querySelector('.tamagotchi-ad img');
    if (tamagotchiImg) {
        // Change to tamagotchi_2 image
        tamagotchiImg.src = "images/tamagotchi_2.png";
        
        // Play scream sound
        playAudio('scream', 0.6);
        
        // Get the scream audio element to listen for when it ends
        const screamAudio = document.getElementById('scream');
        if (screamAudio) {
            screamAudio.onended = function() {
                // Change back to original image when scream ends
                tamagotchiImg.src = "images/tamagotchi_1.png";
            };
        } else {
            // Fallback if audio element can't be found
            setTimeout(() => {
                tamagotchiImg.src = "images/tamagotchi_1.png";
            }, 3000); // Assume scream is about 3 seconds
        }
    }
}

// Function to flash white and play gunshot
function flashAndShoot() {
    // Play gunshot sound
    playAudio('gunshot', 0.8);
    
    // Create white flash overlay
    const flashOverlay = document.createElement('div');
    flashOverlay.style.position = 'fixed';
    flashOverlay.style.top = '0';
    flashOverlay.style.left = '0';
    flashOverlay.style.width = '100%';
    flashOverlay.style.height = '100%';
    flashOverlay.style.backgroundColor = '#ffffff';
    flashOverlay.style.zIndex = '9999';
    flashOverlay.style.pointerEvents = 'none';
    document.body.appendChild(flashOverlay);
    
    // Remove flash after 1 seconds
    setTimeout(() => {
        if (document.body.contains(flashOverlay)) {
            document.body.removeChild(flashOverlay);
        }
    }, 800);
    
    // Trigger page glitch
    triggerGlitchEffect(document.body, 500);
}

// Function to handle dripping blood effect
function createBloodDrip(element) {
    if (!element) return;
    
    const drip = document.createElement('div');
    drip.classList.add('blood-drip');
    drip.style.position = 'absolute';
    drip.style.width = '2px';
    drip.style.backgroundColor = 'var(--accent-red)';
    drip.style.top = '0';
    drip.style.left = Math.floor(Math.random() * element.offsetWidth) + 'px';
    drip.style.height = '0';
    drip.style.zIndex = '10';
    
    element.appendChild(drip);
    
    // Animate the drip
    let height = 0;
    const interval = setInterval(() => {
        height += Math.random() * 2 + 1;
        drip.style.height = height + 'px';
        
        if (height > element.offsetHeight || Math.random() > 0.98) {
            clearInterval(interval);
            setTimeout(() => {
                if (element.contains(drip)) {
                    element.removeChild(drip);
                }
            }, 5000); // Leave the drip for a while
        }
    }, 50);
}

// Function to rate nightmare
function rateNightmare(stars) {
    const ratingResponse = document.getElementById('ratingResponse');
    if (ratingResponse) {
        ratingResponse.classList.remove('hidden');
        
        // Highlight the stars
        for (let i = 1; i <= 5; i++) {
            const star = document.querySelector(`.star:nth-child(${i + 1})`);
            if (star) {
                if (i <= stars) {
                    star.style.color = '#ffcc00'; // Gold for selected stars
                    star.style.textShadow = '0 0 5px #ffcc00';
                } else {
                    star.style.color = '#555'; // Dim for unselected stars
                    star.style.textShadow = 'none';
                }
            }
        }
        
        // Set response message based on rating
        let message = '';
        switch (stars) {
            case 1:
                message = "Only one star? You'll learn to appreciate true horror...";
                break;
            case 2:
                message = "Just warming up. The nightmare intensifies...";
                break;
            case 3:
                message = "The Barlows appreciate your feedback. They'll visit soon.";
                break;
            case 4:
                message = "Excellent! You're almost one of the family now.";
                break;
            case 5:
                message = "PERFECT! You've been added to the special guest list!";
                break;
        }
        
        ratingResponse.innerHTML = message;
        
        // Play spooky sound
        playAudio('laughSound', 0.3);
        
        // Trigger glitch effect
        triggerGlitchEffect(document.querySelector('.rate-nightmare'), 300);
    }
}

// Maybe occasional blood drips on horror elements
setInterval(() => {
    if (Math.random() > 0.9) { // 10% chance
        // Find a suitable container for blood effects
        const containers = [
            document.querySelector('.late-night-header'),
            document.querySelector('.case-file'),
            document.querySelector('.diary-entry')
        ].filter(el => el !== null);
        
        if (containers.length) {
            const randomContainer = containers[Math.floor(Math.random() * containers.length)];
            createBloodDrip(randomContainer);
        }
    }
}, 10000);