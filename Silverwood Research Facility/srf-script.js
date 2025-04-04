document.addEventListener('DOMContentLoaded', () => {
	// --- Core Elements ---
	const body = document.body;
	const pageBorder = document.getElementById('page-border');
	const accessCounter = document.getElementById('access-counter');
    const stabilityIndicator = document.getElementById('stability-indicator');
	const mainLoginForm = document.getElementById('main-login-form');
	const mainLoginMessage = document.getElementById('main-login-message');
	const popup = document.getElementById('login-popup');
	const popupLoginForm = document.getElementById('popup-login-form');
	const popupMessage = document.getElementById('popup-message');
    const popupLoginAttemptsCounter = document.getElementById('login-attempts-counter');
	const popupCloseButton = document.querySelector('.popup-close');
    // Select restricted links carefully (exclude # anchors unless logged out)
	const restrictedLinks = document.querySelectorAll('nav a.nav-link:not([href="srf.html"]), a.sidebar-link[href*=".html"]'); // Page links
    const restrictedAnchorLinks = document.querySelectorAll('a.sidebar-link[href^="#"]'); // Anchor links
    const allRedacted = document.querySelectorAll('.redacted');
    const flickerOverlay = document.querySelector('.flicker-overlay');
    const inputFields = document.querySelectorAll('input[type="text"], input[type="password"], textarea'); // For typing sound

	// --- Audio Elements ---
	const sounds = {
        bgHum: document.getElementById('bg-hum'),
        staticBurst: document.getElementById('static-burst'),
        whisper: document.getElementById('whisper'),
        loginFail: document.getElementById('login-fail-sound'),
        loginSuccess: document.getElementById('login-success-sound'),
        uiClick: document.getElementById('ui-click'),
        uiHover: document.getElementById('ui-hover'),
        redactedReveal: document.getElementById('redacted-reveal'),
        ambientCreak: document.getElementById('ambient-creak'),
        resonancePing: document.getElementById('resonance-ping'),
        distortedTyping: document.getElementById('distorted-typing'),
        lowRumble: document.getElementById('low-rumble'),
        electronicError: document.getElementById('electronic-error'),
        faintBreathing: document.getElementById('faint-breathing')
    };

	// --- Configuration ---
	const correctUsername = 'reyes';
	const correctPassword = 'crystal5';
    const maxLoginAttempts = 5; // Max attempts before harsher penalty
	const glitchSelectors = 'h1, h2, h3, .sidebar-link, .nav-link, .update-item.urgent, .status-warning, .status-missing, .access-restricted, .clearance-box, footer p, .popup-content h2'; // Expanded selectors
    const textCorruptionSelectors = 'p, li, .update-item:not(.urgent):not(.status-warning):not(.status-missing), .faint-clue, #main-content h3, #sidebar h3, .access-info, footer p:first-child, .popup p:not(.login-message)'; // More specific text corruption targets
    const horrorKeywords = ['anomaly', 'entity', 'breach', 'containment', 'resonance', 'madness', 'angles', 'whisper', 'shadow', 'geometry', 'unfolding', 'wrong']; // For contextual effects

	// --- State & Timers ---
	let currentAccessCount = parseInt(localStorage.getItem('srfAccessCount') || '4815', 10);
    let visitCount = parseInt(localStorage.getItem('srfVisitCount') || '0');
    let redactedClickCount = parseInt(localStorage.getItem('srfRedactedClicks') || '0');
    let loginAttempts = 0;
    let systemStability = 1.0; // 1.0 = stable, approaches 0 = unstable
	let accessCounterInterval;
    let randomGlitchInterval;
    let randomEffectInterval;
    let systemAlertTimeout;
    let idleTimeout;
    let interactionOccurred = false;

    // --- Initialization ---
    visitCount++;
    localStorage.setItem('srfVisitCount', visitCount.toString());
    systemStability = Math.max(0.1, 1.0 - (visitCount * 0.02)); // Decrease stability with visits
    console.log(`%c[SRF System Log] Visit #${visitCount}. User fingerprint stored. System Stability: ${(systemStability * 100).toFixed(1)}%.`, 'color: #555; font-family: monospace;');
    if (visitCount > 5 && systemStability < 0.8) {
         console.warn('%c[SRF System Alert] Persistent connection detected. Increasing surveillance protocols. Expect instability.', 'color: yellow; font-family: monospace;');
    }
    if (localStorage.getItem('isLockedOut') === 'true') {
        // Handle persistent lockout if needed (e.g., disable login immediately)
        console.error("%cSYSTEM LOCKOUT ACTIVE due to previous unauthorized access attempts.", "color: red; font-weight: bold;");
        // Could disable login forms here permanently for the session/localstorage
    }
    resetIdleTimer(); // Start idle timer

	// --- Audio Handling ---
	function playSound(soundElement, volume = 0.5, maxOverlap = 1, playbackRate = 1.0) {
		if (!soundElement || !interactionOccurred) return;

		// Rudimentary overlap check
		let currentPlays = parseInt(soundElement.dataset.playCount || '0');
		if (currentPlays >= maxOverlap) return;

		soundElement.dataset.playCount = currentPlays + 1;
		soundElement.currentTime = 0;
		soundElement.volume = Math.min(1, Math.max(0, volume * (Math.random() * 0.3 + 0.85))); // Slightly variable volume
        soundElement.playbackRate = playbackRate * (1.0 + (Math.random() - 0.5) * 0.05); // Slight random pitch variation

		soundElement.play().then(() => {
			// Decrement play count after a delay (e.g., half duration or fallback)
			const delay = soundElement.duration && soundElement.duration > 0.1 ? (soundElement.duration * 1000) / 2 : 200;
			setTimeout(() => {
				let plays = parseInt(soundElement.dataset.playCount || '0');
				if (plays > 0) soundElement.dataset.playCount = plays - 1;
			}, delay);
		}).catch(e => {
            // If play fails, reset count immediately
            let plays = parseInt(soundElement.dataset.playCount || '0');
            if (plays > 0) soundElement.dataset.playCount = plays - 1;
            // console.log("Sound play prevented/failed:", e.name, e.message); // Avoid spamming console
        });
	}

    function startBackgroundAudio() {
        if (sounds.bgHum && sounds.bgHum.paused && interactionOccurred) {
            sounds.bgHum.volume = 0.07 + (Math.random() * 0.04); // Very low, slightly variable volume
            sounds.bgHum.loop = true;
            sounds.bgHum.play().catch(e => console.log("Background audio failed:", e));

            // Periodically adjust background hum volume and pitch slightly
            setInterval(() => {
                if(sounds.bgHum && !sounds.bgHum.paused) {
                    sounds.bgHum.volume = Math.min(0.18, Math.max(0.04, sounds.bgHum.volume + (Math.random() - 0.5) * 0.025));
                    // Subtle pitch shift - more frequent but smaller changes
                    if (Math.random() < 0.2) {
                        sounds.bgHum.playbackRate = 1.0 + (Math.random() - 0.5) * 0.015; // Tiny +/- speed variation
                    }
                }
            }, 8000 + Math.random() * 5000); // Adjust every 8-13 seconds
        }
    }

    // Initial interaction listener
    function handleFirstInteraction() {
        if (!interactionOccurred) {
            console.log("User interaction detected. Initializing audio context.");
            interactionOccurred = true;
            // Attempt to unlock audio context if needed (for some browsers)
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const context = new AudioContext();
                if (context.state === 'suspended') {
                    context.resume();
                }
            }
            startBackgroundAudio();
            // Remove this listener after first interaction
            body.removeEventListener('click', handleFirstInteraction);
            body.removeEventListener('keypress', handleFirstInteraction);
        }
    }
    body.addEventListener('click', handleFirstInteraction, { once: false }); // Keep listening until it works
    body.addEventListener('keypress', handleFirstInteraction, { once: false });


	// --- Visual Effects ---
	function randomGlitchElement(selector) {
		const elements = document.querySelectorAll(selector);
		if (elements.length === 0) return;
		const target = elements[Math.floor(Math.random() * elements.length)];
		target.classList.add('glitch-effect-subtle-js');
        playSound(sounds.staticBurst, 0.06, 4); // Quieter static for subtle glitch
		setTimeout(() => {
			target.classList.remove('glitch-effect-subtle-js');
		}, 120 + Math.random() * 180); // Slightly longer duration possible
	}

	function corruptText(element) {
        if (!element || element.classList.contains('redacted') || element.closest('.redacted')) return; // Don't corrupt redacted blocks or their contents

        const originalText = element.dataset.originalText || element.textContent;
        if (!originalText || originalText.trim().length < 3) return; // Skip empty/short elements
        element.dataset.originalText = originalText; // Store original

		const baseCorruptionRate = 0.05 + (1.0 - systemStability) * 0.15; // Corruption increases as stability decreases
        let corruptionRate = baseCorruptionRate;

        // Increase rate for horror keywords
        if (horrorKeywords.some(word => originalText.toLowerCase().includes(word)) && Math.random() < 0.15) {
             corruptionRate *= 1.8;
        }

		const chars = originalText.split('');
		const glitchChars = ['█', '░', '▒', '▓', '?', '*', '#', '$', '%', '&', '/', '\\', '_', '|', String.fromCharCode(Math.floor(Math.random()*256))]; // Wider range

		const corrupted = chars.map(char => {
			// Preserve spaces, sometimes corrupt numbers/symbols less
            const isSpecialChar = /[^\w\s]/.test(char);
            const corruptChance = (isSpecialChar && Math.random() < 0.5) ? corruptionRate * 0.5 : corruptionRate;

			if (char !== ' ' && Math.random() < corruptChance) {
				return glitchChars[Math.floor(Math.random() * glitchChars.length)];
			}
			return char;
		}).join('');

        if (element.textContent !== corrupted) {
		    element.textContent = corrupted;
            playSound(sounds.staticBurst, 0.04, 5); // Very quiet
        }

		// Restore text, but sometimes leave minor corruption if system is unstable
		setTimeout(() => {
			if (element.textContent === corrupted && element.dataset.originalText) {
                if (Math.random() > systemStability * 0.8) { // Higher chance of *not* fully restoring if unstable
                    // Slightly re-corrupt before restoring fully later
                    const slightlyCorrupted = chars.map(char => (char !== ' ' && Math.random() < baseCorruptionRate * 0.2) ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char).join('');
                    element.textContent = slightlyCorrupted;
                    setTimeout(() => {
                        if (element.dataset.originalText) element.textContent = element.dataset.originalText;
                    }, 1000 + Math.random() * 1500); // Long delay for full restore
                } else {
				    element.textContent = element.dataset.originalText;
                }
			}
             // Clean up data attribute if text is restored (or seems restored)
            // if (element.textContent === element.dataset.originalText) {
            //    delete element.dataset.originalText;
            // }
		}, 70 + Math.random() * 100);
	}

    function setFlickerIntensity(level = 1.0) { // level around 1.0 is normal
        if (flickerOverlay) {
            // Control base opacity AND flicker range via opacity in the keyframes
            // This example adjusts animation speed and base opacity slightly
             flickerOverlay.style.opacity = Math.min(1.0, 0.9 + (level - 1.0) * 0.1); // Adjust base visibility slightly
             flickerOverlay.style.animationDuration = `${Math.max(0.04, 0.15 / (level + 0.2))}s`; // Faster flicker at higher intensity
             // Modify flicker range via CSS variables (more complex flicker control)
             // document.documentElement.style.setProperty('--flicker-opacity-min', `${Math.max(0, 0.92 - (level-1.0)*0.1)}`);
             // document.documentElement.style.setProperty('--flicker-opacity-max', `${Math.min(1, 1.0 + (level-1.0)*0.05)}`);
        }
    }

    function triggerScreenJitter(intensity = 1) {
        if (!pageBorder) return;
        const jitterAmount = intensity * (Math.random() * 1.5 + 0.5); // 0.5px to 2px base intensity
        pageBorder.style.animation = 'horizontal-jitter 0.1s linear 2'; // Jitter twice
        playSound(sounds.staticBurst, 0.15 * intensity, 3);
        if (intensity > 1.5) playSound(sounds.lowRumble, 0.2, 1);
        setTimeout(() => { pageBorder.style.animation = ''; }, 200); // Clear animation after it runs
    }

    function toggleCursor(state) { // state true = visible, false = hide briefly
        if (state) {
            body.classList.remove('cursor-gone');
        } else {
            body.classList.add('cursor-gone');
            setTimeout(() => body.classList.remove('cursor-gone'), 180 + Math.random() * 250); // Briefly hide
        }
    }

    function subtleShiftElement(element) {
        if (!element) return;
        const xShift = (Math.random() - 0.5) * (2.5 / systemStability); // More shift if unstable
        const yShift = (Math.random() - 0.5) * (2.5 / systemStability);
        element.style.transition = 'transform 0.05s ease-out'; // Faster transition for shifts
        element.style.transform = `translate(${xShift.toFixed(1)}px, ${yShift.toFixed(1)}px)`;
        setTimeout(() => { element.style.transform = 'translate(0, 0)'; }, 80);
    }

    function triggerRandomVisualEffect() {
        const effectRoll = Math.random();
        const instabilityFactor = (1.0 - systemStability); // 0 = stable, approaches 1.0 = unstable

        // Glitch elements (more frequent if unstable)
        if (effectRoll < 0.25 + instabilityFactor * 0.3) {
            randomGlitchElement(glitchSelectors);
        }
        // Corrupt text (more frequent if unstable)
        else if (effectRoll < 0.45 + instabilityFactor * 0.4) {
            const textElements = document.querySelectorAll(textCorruptionSelectors);
            if (textElements.length > 0) {
                 corruptText(textElements[Math.floor(Math.random() * textElements.length)]);
            }
        }
        // Subtle layout shifts (more frequent/intense if unstable)
        else if (effectRoll < 0.60 + instabilityFactor * 0.2) {
             const elementsToShift = ['#page-border', '#sidebar', '#main-content section', '#header'];
             const randomElementSelector = elementsToShift[Math.floor(Math.random() * elementsToShift.length)];
             const element = document.querySelector(randomElementSelector);
             if(element) subtleShiftElement(element);
        }
        // Intense flicker burst (more likely if unstable)
        else if (effectRoll < 0.70 + instabilityFactor * 0.1) {
             const intensity = 1.5 + Math.random() * (1 + instabilityFactor * 2); // Higher intensity if unstable
             setFlickerIntensity(intensity);
             setTimeout(() => setFlickerIntensity(1.0), 200 + Math.random() * 200);
        }
         // Screen Jitter (only if unstable)
        else if (instabilityFactor > 0.3 && effectRoll < 0.75) {
            triggerScreenJitter(1 + instabilityFactor);
        }
        // Hide cursor (more likely if unstable)
        else if (effectRoll < 0.80 + instabilityFactor * 0.1) {
            toggleCursor(false);
        }
        // Chromatic Aberration effect (rare, more likely if unstable)
        else if (instabilityFactor > 0.4 && effectRoll < 0.83) {
            body.classList.add('aberration-effect');
            setTimeout(() => { body.classList.remove('aberration-effect'); }, 300 + Math.random() * 400);
        }
        // Play random ambient sound (more likely if unstable)
        else if (effectRoll < 0.90 + instabilityFactor * 0.1) {
            const soundRoll = Math.random();
            if (soundRoll < 0.4) playSound(sounds.ambientCreak, 0.18, 1);
            else if (soundRoll < 0.7) playSound(sounds.resonancePing, 0.10, 1);
            else if (soundRoll < 0.85 && instabilityFactor > 0.5) playSound(sounds.faintBreathing, 0.12, 1); // Breathing only if unstable
            else if (instabilityFactor > 0.2) playSound(sounds.staticBurst, 0.05, 3); // Extra static if unstable
        }
    }


	// --- UI Instability & Feedback ---
	function updateAccessCounter() {
		if (!accessCounter || !stabilityIndicator) return;

        const stabilityRoll = Math.random();
        let increment;
        let currentStabilityDesc = "NOMINAL";

        // Determine increment based on stability and randomness
		if (stabilityRoll < 0.05 * (1 + (1 - systemStability) * 2)) { // Increased chance of jump if unstable
			increment = Math.floor(Math.random() * (300 + 600 * (1 - systemStability))) + 50; // Bigger jumps if unstable
            currentStabilityDesc = "ERRATIC";
            playSound(sounds.resonancePing, 0.25, 1);
            if(Math.random() < 0.3) playSound(sounds.electronicError, 0.4, 1);
		} else if (stabilityRoll < 0.15 * (1 + (1 - systemStability))) { // Increased chance of stall/decrement if unstable
            increment = Math.floor(Math.random() * 4) - 2; // -2 to +1
            currentStabilityDesc = "UNSTABLE";
            if (Math.random() < 0.5) playSound(sounds.staticBurst, 0.1, 2);
		} else { // Normal increment (slower if unstable)
			increment = Math.floor(Math.random() * (systemStability * 2 + 1)) + 1; // 1 to 3 normally, fewer if unstable
            currentStabilityDesc = systemStability < 0.7 ? "DEGRADED" : "NOMINAL";
		}

        // Update count, ensuring it doesn't go below zero visually
		currentAccessCount = Math.max(0, currentAccessCount + increment);
        localStorage.setItem('srfAccessCount', currentAccessCount.toString());
		accessCounter.textContent = currentAccessCount.toString().padStart(6, '0');

        // Update stability indicator text and class
        if (currentStabilityDesc === "ERRATIC" || currentStabilityDesc === "UNSTABLE") {
            stabilityIndicator.textContent = currentStabilityDesc;
            stabilityIndicator.className = 'unstable';
            accessCounter.classList.add('unstable');
        } else if (currentStabilityDesc === "DEGRADED") {
             stabilityIndicator.textContent = currentStabilityDesc;
             stabilityIndicator.className = 'unstable'; // Use 'unstable' class styling
             accessCounter.classList.remove('unstable');
        } else { // NOMINAL
            stabilityIndicator.textContent = currentStabilityDesc;
            stabilityIndicator.className = 'nominal';
            accessCounter.classList.remove('unstable');
        }

        // Rare chance to jump backwards significantly if very unstable
        if (systemStability < 0.3 && Math.random() < 0.02) {
            currentAccessCount = Math.max(0, currentAccessCount - Math.floor(Math.random() * 1000 + 500));
            accessCounter.textContent = currentAccessCount.toString().padStart(6, '0');
            showSystemAlert("CRITICAL ERROR: COUNTER ROLLBACK DETECTED!");
            playSound(sounds.electronicError, 0.6, 1);
            playSound(sounds.lowRumble, 0.4, 1);
        }
	}

	function showSystemAlert(message, duration = 4500) {
        if (systemAlertTimeout) clearTimeout(systemAlertTimeout);

        let alertDiv = document.getElementById('system-alert-div');
        if (!alertDiv) {
            alertDiv = document.createElement('div');
            alertDiv.id = 'system-alert-div';
            alertDiv.className = 'system-alert-overlay';
            body.appendChild(alertDiv);
        }

        alertDiv.textContent = `// ${message}`;
        alertDiv.classList.add('visible');
        playSound(sounds.uiClick, 0.45, 1); // Alert sound

        systemAlertTimeout = setTimeout(() => {
            alertDiv.classList.remove('visible');
        }, duration + Math.random() * 1500); // Variable duration
	}

    function triggerRandomSystemEvent() {
        const roll = Math.random();
        const instabilityFactor = (1.0 - systemStability);

        // Only trigger events occasionally
        if (roll > 0.15) return; // ~15% chance per interval check

        const eventRoll = Math.random();

        if (eventRoll < 0.15 && instabilityFactor > 0.3) {
            showSystemAlert(`UNEXPECTED PACKET ORIGIN [${Math.random().toString(16).substring(2, 10)}]... ANALYZING... FAILED.`);
            playSound(sounds.electronicError, 0.3, 1);
        } else if (eventRoll < 0.30 && localStorage.getItem('isLoggedIn') === 'true') {
             showSystemAlert(`User 'reyes' session active. Monitoring resonance signature. [Anomalies Detected]`);
        } else if (eventRoll < 0.45) {
             const desync = (Math.random() * 2.5 - 1.0) * (1 + instabilityFactor);
             showSystemAlert(`Chronometer desync detected: ${ desync.toFixed(3) }s`);
             if (Math.abs(desync) > 1.0) playSound(sounds.resonancePing, 0.15, 1);
        } else if (eventRoll < 0.60 && instabilityFactor > 0.2) {
            console.warn(`%c[SRF Internal] Wall sensor ${Math.floor(Math.random()*20)+1} reports anomalous resonance pattern. Possible structural shift.`, 'color: yellow; font-family: monospace;');
            playSound(sounds.ambientCreak, 0.2, 1);
        } else if (eventRoll < 0.70 && instabilityFactor > 0.5) {
            showSystemAlert("ERROR: Memory integrity check failed. Corruption spreading.");
            playSound(sounds.electronicError, 0.5, 1);
            triggerScreenJitter(1.2);
        } else if (eventRoll < 0.80 && instabilityFactor > 0.6) {
             console.error("%c[OBSIDIAN_PRIME?] Unknown process attempting Kernel access...", "color: red; font-weight: bold;");
             playSound(sounds.lowRumble, 0.3, 1);
             playSound(sounds.whisper, 0.1, 1);
        } else if (eventRoll < 0.90 && instabilityFactor > 0.1) {
            // Just play a random unsettling sound
            const soundRoll = Math.random();
            if (soundRoll < 0.5) playSound(sounds.staticBurst, 0.1, 2);
            else if (soundRoll < 0.8) playSound(sounds.resonancePing, 0.08, 1);
            else playSound(sounds.ambientCreak, 0.15, 1);
        } else if (instabilityFactor > 0.7) { // Rare direct message if very unstable
            showSystemAlert("IT SEES YOU THROUGH THE SCREEN", 6000);
            playSound(sounds.faintBreathing, 0.2, 1);
        }
    }

	// --- Login Logic ---
	function showPopup(message = "LEVEL 4 CLEARANCE REQUIRED.") {
        if(popup) {
            // Reset attempts counter display if needed
            loginAttempts = 0;
            updateLoginAttemptsDisplay();

            popup.style.display = 'block';
            setFlickerIntensity(1.8 + (1 - systemStability)); // More intense flicker if unstable
            playSound(sounds.staticBurst, 0.35, 2);
            playSound(sounds.uiClick, 0.3, 1); // Popup open sound

            if (popupMessage) popupMessage.textContent = message;

            // Focus the username field
            const userField = document.getElementById('popup-username');
            if (userField) setTimeout(() => userField.focus(), 50);
        }
	}

	function hidePopup() {
		if (popup) popup.style.display = 'none';
		if (popupMessage) {
			popupMessage.textContent = '';
			popupMessage.className = 'login-message';
		}
        if (popupLoginAttemptsCounter) popupLoginAttemptsCounter.textContent = '';
		if (popupLoginForm) popupLoginForm.reset();
        setFlickerIntensity(1.0); // Reset flicker
	}

    function updateLoginAttemptsDisplay() {
        if (popupLoginAttemptsCounter) {
            const remaining = maxLoginAttempts - loginAttempts;
            if (remaining <= 2 && remaining > 0) {
                 popupLoginAttemptsCounter.textContent = `Attempts remaining: ${remaining}`;
                 popupLoginAttemptsCounter.style.color = 'var(--warning-color)';
            } else if (remaining <= 0) {
                popupLoginAttemptsCounter.textContent = `MAX ATTEMPTS REACHED. SYSTEM LOCKOUT INITIATED.`;
                popupLoginAttemptsCounter.style.color = 'var(--accent-color)';
            } else {
                 popupLoginAttemptsCounter.textContent = ''; // Hide if plenty attempts left
            }
        }
    }

	 function handleLoginSuccess(isPopup) {
		 localStorage.setItem('isLoggedIn', 'true');
         localStorage.removeItem('isLockedOut'); // Clear lockout on success
         loginAttempts = 0; // Reset attempts
		 body.classList.add('logged-in');
         playSound(sounds.loginSuccess, 0.65, 1);
         // Minor positive system feedback
         systemStability = Math.min(1.0, systemStability + 0.05); // Slightly increase stability
         updateAccessCounter(); // Update display

		 if (isPopup) {
			 if (popupMessage) {
				 popupMessage.textContent = 'ACCESS GRANTED. WELCOME BACK, DR. REYES.';
				 popupMessage.className = 'login-message success';
			 }
             if (popupLoginAttemptsCounter) popupLoginAttemptsCounter.textContent = ''; // Clear attempts counter
			 setTimeout(hidePopup, 1500); // Slightly longer display
             showSystemAlert(`LEVEL 4 ACCESS GRANTED. Session authorized.`, 5000);
             console.log("%cUser 'reyes' authenticated via popup. Welcome, Doctor.", "color: #0f0; font-family: monospace;");

		 } else { // Main form login
			 if (mainLoginMessage) {
				 mainLoginMessage.textContent = 'ACCESS GRANTED.';
				 mainLoginMessage.className = 'login-message success';
			 }
			 if (mainLoginForm) {
				 mainLoginForm.style.opacity = '0.6';
                 // Disable and show logged in state
                 const userInput = mainLoginForm.querySelector('#main-username');
                 const passInput = mainLoginForm.querySelector('#main-password');
                 const button = mainLoginForm.querySelector('button');
                 if(userInput) { userInput.value = 'reyes'; userInput.disabled = true; }
                 if(passInput) { passInput.value = '********'; passInput.disabled = true; }
                 if(button) { button.disabled = true; button.textContent = 'AUTH OK'; }
			 }
             console.log("%cMain terminal authenticated for 'reyes'.", "color: #0f0; font-family: monospace;");
		 }
	 }

	 function handleLoginFailure(isPopup) {
		loginAttempts++;
        systemStability = Math.max(0, systemStability - 0.05); // Decrease stability on fail
        updateAccessCounter(); // Update display

        const messageArea = isPopup ? popupMessage : mainLoginMessage;
        const form = isPopup ? popupLoginForm : mainLoginForm;

		 if (messageArea) {
			 messageArea.textContent = 'AUTH FAILURE // ACCESS DENIED';
			 messageArea.className = 'login-message error';
		 }
         playSound(sounds.loginFail, 0.75, 1);
         playSound(sounds.electronicError, 0.6, 1);
         playSound(sounds.staticBurst, 0.55, 2);
         setFlickerIntensity(2.8); // Intense flicker on fail
         triggerScreenJitter(1.5); // Jitter screen on fail
         setTimeout(() => setFlickerIntensity(isPopup ? 1.8 : 1.0), 450); // Reset flicker after delay

		 if (form) {
             form.reset(); // Clear fields immediately
             // Disable form briefly
             const inputsAndButton = form.querySelectorAll('input, button');
             inputsAndButton.forEach(el => el.disabled = true);

             // Check for lockout
             if (loginAttempts >= maxLoginAttempts) {
                 handleLockout(isPopup);
                 // Keep form disabled
             } else {
                 // Re-enable form after delay
                 setTimeout(() => {
                     inputsAndButton.forEach(el => el.disabled = false);
                     if (messageArea) messageArea.textContent = ''; // Clear message
                     // Focus username again if popup
                     if (isPopup) {
                        const userField = document.getElementById('popup-username');
                        if (userField) userField.focus();
                     }
                 }, 1000); // 1 second delay before allowing retry
             }
         }

         // Update attempts display for popup
         if (isPopup) updateLoginAttemptsDisplay();

         // Unsettling feedback
         if (Math.random() < 0.3 + (1 - systemStability) * 0.4) {
            const messages = ["Unauthorized access attempt logged.", "Source traced.", "Security protocols tightening.", "Incorrect credentials.", "Are you sure you belong here?"];
            showSystemAlert(messages[Math.floor(Math.random() * messages.length)], 5000);
            console.error(`AUTH FAIL: User input rejected. Attempt ${loginAttempts}/${maxLoginAttempts}. System Stability: ${(systemStability * 100).toFixed(1)}%.`);
         } else {
             console.warn(`Auth failure recorded. Attempt ${loginAttempts}/${maxLoginAttempts}.`);
         }

         // Trigger body shake on third attempt or lockout
         if (loginAttempts === 3 || loginAttempts >= maxLoginAttempts) {
            body.classList.add('high-stress');
            setTimeout(() => body.classList.remove('high-stress'), 300);
         }
	 }

     function handleLockout(isPopup) {
         localStorage.setItem('isLockedOut', 'true');
         const messageArea = isPopup ? popupMessage : mainLoginMessage;
         const form = isPopup ? popupLoginForm : mainLoginForm;

         if (messageArea) {
             messageArea.textContent = 'MAX ATTEMPTS REACHED // SYSTEM LOCKOUT';
             messageArea.className = 'login-message error';
         }
         if (popupLoginAttemptsCounter) { // Ensure counter shows lockout
             updateLoginAttemptsDisplay();
         }

         playSound(sounds.lowRumble, 0.7, 1);
         playSound(sounds.electronicError, 0.8, 1);
         setFlickerIntensity(3.5); // Max flicker
         triggerScreenJitter(2.5); // Max jitter

         showSystemAlert("CRITICAL ALERT: MULTIPLE AUTH FAILURES. TERMINAL LOCKED.", 8000);
         console.error("SYSTEM LOCKOUT INITIATED. Further login attempts blocked for this session.");

         // Keep form disabled permanently (for this session)
         if (form) {
             form.querySelectorAll('input, button').forEach(el => el.disabled = true);
             const button = form.querySelector('button');
             if (button) button.textContent = 'LOCKED';
         }

         // Optionally hide popup after a longer delay
         if (isPopup) {
             setTimeout(hidePopup, 5000);
         }
     }


	function checkLogin(event) {
		event.preventDefault();
        // Prevent login if already locked out
        if (localStorage.getItem('isLockedOut') === 'true') {
            showSystemAlert("Terminal Locked. Access Denied.", 4000);
            playSound(sounds.loginFail, 0.5, 1);
            return;
        }

		const isPopup = this.id === 'popup-login-form';
		const usernameInput = document.getElementById(isPopup ? 'popup-username' : 'main-username');
		const passwordInput = document.getElementById(isPopup ? 'popup-password' : 'main-password');

		const username = usernameInput?.value.trim().toLowerCase() ?? '';
		const password = passwordInput?.value.trim() ?? '';

        // Simulate network lag/instability, more lag if unstable
        const delay = Math.random() < 0.15 ? (400 + Math.random() * 800 * (1 + (1-systemStability))) : (60 + Math.random() * 120);
        const button = this.querySelector('button');
        if(button) button.disabled = true; // Disable button during check

        setTimeout(() => {
            if (username === correctUsername && password === correctPassword) {
                handleLoginSuccess(isPopup);
            } else {
                handleLoginFailure(isPopup);
            }
            // Re-enable button only handled by failure/lockout logic now
        }, delay);
	}

    // --- Idle Timer ---
    function resetIdleTimer() {
        clearTimeout(idleTimeout);
        idleTimeout = setTimeout(() => {
            // Trigger idle effect
            console.log("%c[System Monitor] User idle detected... increasing ambient monitoring...", "color: #555;");
            playSound(sounds.whisper, 0.35, 1); // Louder whisper
            if(Math.random() < 0.4) playSound(sounds.faintBreathing, 0.15, 1);
            if(Math.random() < 0.5) randomFlicker(); // Trigger a flicker effect
            if (Math.random() < 0.3) showSystemAlert("SYSTEM MONITORING ACTIVE... ARE YOU STILL THERE?", 6000);
            if (Math.random() < 0.2 && systemStability < 0.6) triggerScreenJitter(0.8);
            // Reset timer again after effect to loop idle checks
            resetIdleTimer();
        }, 45000 + Math.random() * 30000); // 45-75 seconds idle time
    }


	// --- Event Listeners ---

    // Restricted Page Links Click
	restrictedLinks.forEach(link => {
		link.addEventListener('click', (event) => {
			const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
			const targetHref = link.getAttribute('href');
            playSound(sounds.uiClick, 0.35, 2);

			if (!isLoggedIn) {
				 event.preventDefault();
				 showPopup(`LEVEL 4 CLEARANCE REQUIRED TO ACCESS ${targetHref.replace('.html','').toUpperCase()} ARCHIVES.`);
			} else {
                 // Logged in, allow navigation
                 console.log(`Navigating to ${targetHref}...`);
                 // Optional: Add transition effect here?
                 body.style.transition = 'opacity 0.3s ease-out';
                 body.style.opacity = '0'; // Fade out before navigating
                 // No need for setTimeout, browser navigation will interrupt
            }
		});
        // Hover sound for links
        link.addEventListener('mouseenter', () => playSound(sounds.uiHover, 0.12, 1));
	});

    // Restricted Anchor Links Click
    restrictedAnchorLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const targetHref = link.getAttribute('href'); // Should be like "#incident1"
            playSound(sounds.uiClick, 0.3, 2);

            if (!isLoggedIn) {
                event.preventDefault(); // Prevent default anchor jump
                showPopup(`LEVEL 4 CLEARANCE REQUIRED TO ACCESS DATA POINT: ${targetHref.toUpperCase()}`);
            } else {
                // Allow normal anchor link behavior if logged in
                // Smooth scroll is handled by CSS 'scroll-behavior: smooth;'
                // Optional: Add effect on jump target
                const targetElement = document.getElementById(targetHref.substring(1));
                if (targetElement) {
                     targetElement.style.transition = 'background-color 0.1s ease-out';
                     targetElement.style.backgroundColor = 'rgba(0, 255, 0, 0.1)'; // Brief green flash
                     setTimeout(() => { targetElement.style.backgroundColor = ''; }, 300);
                     playSound(sounds.resonancePing, 0.1, 1); // Ping sound on successful jump
                }
            }
        });
         // Hover sound for anchor links
        link.addEventListener('mouseenter', () => playSound(sounds.uiHover, 0.1, 1));
    });


    // Redacted Text Click
	allRedacted.forEach(span => {
		span.addEventListener('click', (event) => {
			const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
			const targetPage = span.getAttribute('data-target-page');
            const revealedText = span.getAttribute('data-revealed');

			if (isLoggedIn) {
                redactedClickCount++;
                localStorage.setItem('srfRedactedClicks', redactedClickCount.toString());
                playSound(sounds.redactedReveal, 0.55, 1);
                if (Math.random() < 0.15 / systemStability) playSound(sounds.whisper, 0.18, 1); // Occasional whisper, more likely if unstable

                // Flash the revealed text briefly - more intense
                span.style.transition = 'none';
                span.style.color = '#000'; // Black text
                span.style.backgroundColor = '#0f0'; // Bright green background
                span.style.textShadow = '0 0 5px #fff'; // White glow
                setTimeout(() => {
                    span.style.transition = 'background-color 0.1s ease, color 0.1s ease, text-shadow 0.1s ease';
                    span.style.color = ''; // Revert to CSS hover color
                    span.style.backgroundColor = ''; // Revert to CSS hover bg
                    span.style.textShadow = ''; // Revert shadow
                }, 180); // Slightly longer flash

                // Console log interaction
                console.log(`Redacted data accessed: "${revealedText}"`);
                if (redactedClickCount > 10 && Math.random() < 0.1 * (1 + (1-systemStability))) {
                    showSystemAlert("Anomalous data access pattern noted. Cross-referencing user profile...");
                }
                 // Trigger infohazard effect if applicable
                const parentSection = span.closest('.infohazard-source');
                if (parentSection) {
                    triggerInfohazardEffect(parentSection);
                }

                // Handle navigation if targetPage exists
				if (targetPage) {
                    event.preventDefault(); // Prevent immediate navigation
                    showSystemAlert(`Cross-referencing: ${revealedText.substring(0, 25)}... navigating.`);
                    body.style.transition = 'opacity 0.3s ease-out';
                    body.style.opacity = '0'; // Fade out
                    setTimeout(() => { window.location.href = targetPage; }, 300); // Navigate after fade
				}

			} else { // Not logged in
				event.preventDefault();
				showPopup(`LEVEL 4 CLEARANCE REQUIRED TO VIEW REDACTED DATA.`);
                playSound(sounds.loginFail, 0.45, 1); // Use fail sound for denied access
                if(Math.random() < 0.2) playSound(sounds.electronicError, 0.3, 1);
			}
		});
        // Hover sound for redacted text
        span.addEventListener('mouseenter', () => {
             if (localStorage.getItem('isLoggedIn') !== 'true') {
                 playSound(sounds.uiHover, 0.09, 2); // Quieter if locked
             } else {
                 playSound(sounds.uiHover, 0.16, 1); // Louder hover when logged in
                 if (Math.random() < 0.05) playSound(sounds.whisper, 0.05, 1); // Very faint whisper on hover sometimes
             }
        });
	});

    // Infohazard Effects Trigger
    function triggerInfohazardEffect(element) {
        console.warn("Infohazard source accessed!");
        playSound(sounds.lowRumble, 0.2, 1);
        playSound(sounds.resonancePing, 0.3, 1);
        body.classList.add('aberration-effect'); // Visual distortion
        setFlickerIntensity(2.0); // Increase flicker

        // Specific effects based on hazard type
        if (element.classList.contains('audio-hazard')) {
             playSound(sounds.whisper, 0.4, 1); // Louder whisper
             if (sounds.bgHum) sounds.bgHum.playbackRate *= 1.05; // Speed up hum slightly
             showSystemAlert("WARNING: Potential memetic audio signature detected!", 6000);
        }
        if (element.classList.contains('visual-hazard')) {
             triggerScreenJitter(1.5);
             showSystemAlert("WARNING: Visual hazard exposure. Monitor perception.", 6000);
             if (Math.random() < 0.3) toggleCursor(false); // Hide cursor
        }
        if (element.classList.contains('temporal-hazard')) {
             updateAccessCounter(); // Force counter update/potential jump
             showSystemAlert("WARNING: Temporal field fluctuation detected!", 6000);
             playSound(sounds.electronicError, 0.5, 1);
        }

        // Effect wears off after a short duration
        setTimeout(() => {
            body.classList.remove('aberration-effect');
            setFlickerIntensity(1.0);
            if (sounds.bgHum) sounds.bgHum.playbackRate = 1.0; // Reset hum speed
        }, 2000 + Math.random() * 3000); // 2-5 second duration
    }


    // Popup Close Button
	if (popupCloseButton) {
		popupCloseButton.addEventListener('click', () => {
            playSound(sounds.uiClick, 0.45, 1);
            hidePopup();
        });
	}

    // Click outside Popup to Close
	if (popup) {
		popup.addEventListener('click', (event) => {
			// Only close if clicking directly on the overlay, not the content
            if (event.target === popup) {
                playSound(sounds.uiClick, 0.25, 1);
				hidePopup();
			}
		});
	}

    // Login Form Submissions
	if (mainLoginForm) {
		mainLoginForm.addEventListener('submit', checkLogin);
	}
	if (popupLoginForm) {
		popupLoginForm.addEventListener('submit', checkLogin);
	}

    // Typing sound effect
    inputFields.forEach(input => {
        input.addEventListener('input', () => {
            // Play typing sound infrequently
            if (Math.random() < 0.4) { // Adjust probability as needed
                playSound(sounds.distortedTyping, 0.3, 1, 1.0 + Math.random() * 0.2); // Slightly faster/varied typing
            }
            resetIdleTimer(); // Input counts as activity
        });
         input.addEventListener('focus', () => playSound(sounds.uiClick, 0.2, 1)); // Click on focus
    });


    // --- Restore Login State on Load ---
	 if (localStorage.getItem('isLoggedIn') === 'true') {
          body.classList.add('logged-in');
          // Update main login form appearance if it exists
		  if (mainLoginForm) {
              const userInput = mainLoginForm.querySelector('#main-username');
              const passInput = mainLoginForm.querySelector('#main-password');
              const button = mainLoginForm.querySelector('button');
              if (mainLoginMessage) {
                  mainLoginMessage.textContent = 'SYSTEM ACCESS GRANTED. SESSION RESUMED.';
                  mainLoginMessage.className = 'login-message success';
              }
              mainLoginForm.style.opacity = '0.6';
              if(userInput) { userInput.value = 'reyes'; userInput.disabled = true; }
              if(passInput) { passInput.value = '********'; passInput.disabled = true; }
              if(button) { button.disabled = true; button.textContent = 'AUTH OK'; }
		  }
          console.log("%cResuming logged-in session for 'reyes'.", "color: #0f0; font-family: monospace;");
	 } else {
         console.log("%cUser not authenticated. Restricted access enabled.", "color: yellow; font-family: monospace;");
     }

    // --- Periodic Effects Timers ---
    if (accessCounter) { // Start counter update loop
	    updateAccessCounter(); // Initial update
	    accessCounterInterval = setInterval(updateAccessCounter, 2500 + Math.random() * 2000); // Update every 2.5-4.5 seconds
    }
    // Start random visual/system effects after a short delay
    setTimeout(() => {
        // Separate timers for different effect types maybe? Or adjust frequency within one timer.
        randomEffectInterval = setInterval(() => {
             // Higher chance to trigger *some* effect if unstable
             if (Math.random() < 0.5 + (1 - systemStability) * 0.4) {
                 triggerRandomVisualEffect();
             }
             // System events are rarer
             if (Math.random() < 0.15 + (1 - systemStability) * 0.2) {
                 triggerRandomSystemEvent();
             }
        }, 1800 + Math.random() * 2500); // Check for effects every 1.8-4.3 seconds
    }, 1500); // Initial delay before effects start

    // Initial flicker setup
    setFlickerIntensity(1.0);

    // Final Console Log & Warnings
    console.log('%c--------------------------------------------------', 'color: #333;');
    console.log('%cSRF Terminal Interface Initialized. Monitor Active.', 'color: var(--text-color); font-family: monospace;');
    console.log(`%cSystem Stability: ${(systemStability * 100).toFixed(1)}%. Standing by... ${new Date().toISOString()}`, 'color: #555; font-family: monospace;');
    if (systemStability < 0.5) {
        console.error('%cCRITICAL WARNING: System stability dangerously low. Expect severe anomalies and potential data loss.', 'color: red; font-weight: bold; font-size: 14px;');
        playSound(sounds.lowRumble, 0.4, 1); // Rumble on load if unstable
    }
    console.log('%c--------------------------------------------------', 'color: #333;');
    if(Math.random() < 0.15) { // More frequent spooky message
        const messages = [
            '...it is listening...',
            '...the walls have ears... and eyes...',
            '...can you feel the static cling?',
            '...reality is thinner here...',
            '...don\'t look behind you...'
        ];
        console.log(`%c\n\n${messages[Math.floor(Math.random() * messages.length)]}\n\n`, 'color: red; font-weight: bold; font-size: 14px; font-family: monospace;');
    }


}); // End DOMContentLoaded