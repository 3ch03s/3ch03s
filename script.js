document.addEventListener('DOMContentLoaded', () => {
    // --- Global Variables & References ---
    const statusText = document.getElementById('status-text');
    const timestamp = document.getElementById('timestamp');
    const visitorCount = document.getElementById('visitor-count');
    const mainTitle = document.getElementById('main-title');
    const powerButton = document.querySelector('.crt-power-button');
    
    // Create a subliminal message system
    const createSubliminalSystem = () => {
        // Create an array of subliminal messages
        const messages = [
            "We observe through all electronic eyes",
            "Your reality was designed by us",
            "The stars are wrong",
            "Time is a construct we created",
            "Your consciousness is transferable",
            "They hide the truth in plain sight",
            "We exist between your thoughts",
            "Your dimension is a shadow of ours",
            "We have always been watching",
            "The convergence cannot be stopped",
            "Your species was our experiment",
            "Reality is thinner than you believe"
        ];
        
        // Function to flash subliminal messages
        const flashSubliminal = () => {
            // Skip if powered off
            if (document.body.classList.contains('crt-power-off')) {
                setTimeout(flashSubliminal, 60000 + Math.random() * 120000); // 1-3 minutes
                return;
            }
            
            // Create subliminal element
            const subliminal = document.createElement('div');
            const message = messages[Math.floor(Math.random() * messages.length)];
            
            subliminal.textContent = message;
            subliminal.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: rgba(159, 0, 186, 0.7);
                font-size: 1.5rem;
                font-family: 'Courier New', monospace;
                text-align: center;
                z-index: 3000;
                pointer-events: none;
                opacity: 0;
                text-shadow: 0 0 5px rgba(159, 0, 186, 0.5);
            `;
            
            document.body.appendChild(subliminal);
            
            // Animation timing
            setTimeout(() => {
                subliminal.style.transition = 'opacity 0.05s ease';
                subliminal.style.opacity = '0.85'; 
                
                // Play a subtle sound if glitch sounds available
                if (typeof playGlitchSound === 'function') {
                    playGlitchSound();
                }
                
                setTimeout(() => {
                    subliminal.style.opacity = '0';
                    setTimeout(() => {
                        subliminal.remove();
                    }, 100);
                }, 100); // Display for only 100ms - subliminal
            }, 100);
            
            // Schedule next subliminal
            setTimeout(flashSubliminal, 60000 + Math.random() * 120000); // 1-3 minutes
        };
        
        // Start system with delay
        setTimeout(flashSubliminal, 30000 + Math.random() * 60000);
    };
    
    // Initialize subliminal system
    createSubliminalSystem();
    
    // Entity awareness cursor effect
    const createEntityAwareness = () => {
        // Create entity awareness element
        const awarenessIndicator = document.createElement('div');
        awarenessIndicator.className = 'entity-awareness';
        awarenessIndicator.style.cssText = `
            position: fixed;
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 2999;
            border-radius: 50%;
            background: radial-gradient(circle at center, 
                rgba(159, 0, 186, 0.1) 0%, 
                rgba(159, 0, 186, 0.05) 40%, 
                transparent 70%
            );
            opacity: 0;
            mix-blend-mode: screen;
            transition: opacity 1s ease;
        `;
        document.body.appendChild(awarenessIndicator);
        
        // Add events to track mouse and show awareness
        let isVisible = false;
        let mouseX = 0;
        let mouseY = 0;
        let timeoutId = null;
        
        // Random chance the entity becomes "aware" of the user
        const becomeAware = () => {
            if (document.body.classList.contains('crt-power-off')) {
                setTimeout(becomeAware, 20000 + Math.random() * 40000);
                return;
            }
            
            if (Math.random() < 0.7) { // 70% chance
                isVisible = true;
                awarenessIndicator.style.opacity = '1';
                
                // Stay aware for a while
                setTimeout(() => {
                    isVisible = false;
                    awarenessIndicator.style.opacity = '0';
                }, 10000 + Math.random() * 20000);
            }
            
            // Schedule next awareness check
            setTimeout(becomeAware, 30000 + Math.random() * 60000);
        };
        
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Position the awareness indicator with slight delay
            if (isVisible) {
                if (timeoutId) clearTimeout(timeoutId);
                
                timeoutId = setTimeout(() => {
                    // Add slight offset to create "following" effect
                    const offsetX = (Math.random() * 40) - 20;
                    const offsetY = (Math.random() * 40) - 20;
                    
                    awarenessIndicator.style.left = `${mouseX - 100 + offsetX}px`;
                    awarenessIndicator.style.top = `${mouseY - 100 + offsetY}px`;
                }, 100 + Math.random() * 200); // Slightly delayed follow
            }
        });
        
        // Start awareness system
        setTimeout(becomeAware, 15000 + Math.random() * 30000);
    };
    
    // Initialize entity awareness
    createEntityAwareness();

    // -- Audio References --
    const backgroundAudio = document.getElementById('background-audio');
    const clickSound = document.getElementById('click-sound');
    // Create references for glitch sounds
    const glitchSound1 = new Audio('static_glitch_1.mp3');
    const glitchSound2 = new Audio('static_glitch_2.mp3');
    glitchSound1.volume = 0.4;
    glitchSound2.volume = 0.4;
    let lastGlitchSound = 1; // Track which glitch sound was played last
    // -- END Audio References --
    
    // --- CRT Power Button Functionality ---
    let isPoweredOn = true;
    
    if (powerButton) {
        powerButton.addEventListener('click', () => {
            isPoweredOn = !isPoweredOn;
            
            if (!isPoweredOn) {
                // CRT Power Off effect
                document.body.classList.add('crt-power-off');
                
                // Create power down sound effect
                const powerDownSound = new Audio();
                powerDownSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAsAABOtQAICwsOEBATFRUYGhoeICAlJycsLi40Njg7PT1BQ0VISEpNT1FUVldaXF5gYmRmaGtsb3Fzd3l7foGDhYiKjI6QkpWXmZyeoKKlp6qsrrCys7a4ur3AwcPGyczP0dPW2Nrc3+Hk5+nr7vHz9vj7/v8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAATraamYbFAAAAAAAAAAAAAAAAAAAAAP/7cMQAAAZkAF3MAAArMYEHJBAAACrHxMw0A4BACgPl4nCeH8TDQUREREREfeJ/EIYd9/hE//8MYRERREH4Rf/+UVUxQDEwYEgJhsHwfFAeBwYR8SgOD4oCZiIhDoXBRJIvDsOA4EBAIBAQCYOAgPggHwfB8Uig0M+D4PggHA4CAQCAQDdFx8H8oCYOAgEBIRQiEQiFAQCATB8UDMTDMJRGITCGEQkE4iEQjEYjEQiERCIRCIREQiIhEIiIREIiIRDAYiIQB4QBAP4oFAoFAoFAoFAoFAnioVCoVCoVCoVCoVCoVCoVCoVCoVCoVCoVCoVC/CoKhUKgGKhUKhUKhYKgGCgUCgVKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUL//4Vi/yn8oH/EQ6Iep5QKBUKhUKgVCoVCoVCoVCoVCoVCoVCoVCoVCoVCp9MFJKpZFT/////////////////////////5mHkYjGCsVGXSRKM8E5EkzIQJxlE1I0aRLEn1zxPSiWJgSJZM6gGBMmQiaLTCxuPImpdCPgV6BGfBH5T//////////////////+pORZFHCXREt7kn//////////////////////////////////////////////////////////////////////////////////////////////////////////////////+CgQAAAAAQDgPg+D4PiYOA+D4Pg+D4mGYUCgUCgUBQKBwQCYVCoVCoVCoUBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQ//////////////////+ZmYD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////gAAgAAAAAAf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=';
                powerDownSound.volume = 0.3;
                powerDownSound.play();
                
                // Stop all audio
                if (backgroundAudio) backgroundAudio.pause();
                
                // Create a white flash line effect
                const flashLine = document.createElement('div');
                flashLine.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 0;
                    width: 100%;
                    height: 5px;
                    background: rgba(255,255,255,0.6);
                    z-index: 2001;
                    transform: scaleY(20);
                    opacity: 0;
                    transition: transform 0.5s, opacity 0.5s;
                `;
                document.body.appendChild(flashLine);
                
                // Trigger the flash line animation
                setTimeout(() => {
                    flashLine.style.opacity = '1';
                    flashLine.style.transform = 'scaleY(1)';
                    
                    setTimeout(() => {
                        flashLine.style.opacity = '0';
                        setTimeout(() => {
                            flashLine.remove();
                        }, 500);
                    }, 200);
                }, 50);
            } else {
                // CRT Power On effect
                document.body.classList.remove('crt-power-off');
                
                // Create power on sound effect
                const powerOnSound = new Audio();
                powerOnSound.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAsAABOtQAICwsOEBATFRUYGhoeICAlJycsLi40Njg7PT1BQ0VISEpNT1FUVldaXF5gYmRmaGtsb3Fzd3l7foGDhYiKjI6QkpWXmZyeoKKlp6qsrrCys7a4ur3AwcPGyczP0dPW2Nrc3+Hk5+nr7vHz9vj7/v8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAYAAAAAAAAATraamYbFAAAAAAAAAAAAAAAAAAAAAP/7cMQAAAZkAF3MAAArMYEHJBAAACrHxMw0A4BACgPl4nCeH8TDQUREREREfeJ/EIYd9/hE//8MYRERREH4Rf/+UVUxQDEwYEgJhsHwfFAeBwYR8SgOD4oCZiIhDoXBRJIvDsOA4EBAIBAQCYOAgPggHwfB8Uig0M+D4PggHA4CAQCAQDdFx8H8oCYOAgEBIRQiEQiFAQCATB8UDMTDMJRGITCGEQkE4iEQjEYjEQiERCIRCIREQiIhEIiIREIiIRDAYiIQB4QBAP4oFAoFAoFAoFAoFAnioVCoVCoVCoVCoVCoVCoVCoVCoVCoVCoVCoVC/CoKhUKgGKhUKhUKhYKgGCgUCgVKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUKhUL//4Vi/yn8oH/EQ6Iep5QKBUKhUKgVCoVCoVCoVCoVCoVCoVCoVCoVCoVCp9MFJKpZFT/////////////////////////5mHkYjGCsVGXSRKM8E5EkzIQJxlE1I0aRLEn1zxPSiWJgSJZM6gGBMmQiaLTCxuPImpdCPgV6BGfBH5T//////////////////+pORZFHCXREt7kn//////////////////////////////////////////////////////////////////////////////////////////////////////////////////+CgQAAAAAQDgPg+D4PiYOA+D4Pg+D4mGYUCgUCgUBQKBwQCYVCoVCoVCoUBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQKBQ//////////////////+ZmYD/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////gAAgAAAAAAf////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=';
                powerOnSound.volume = 0.3;
                powerOnSound.play();
                
                // Start background audio if it was playing before
                if (backgroundAudio) {
                    setTimeout(() => {
                        const playPromise = backgroundAudio.play();
                        if (playPromise !== undefined) {
                            playPromise.catch(error => {
                                // Autoplay prevented - user interaction needed
                                console.log("Background audio autoplay prevented:", error);
                            });
                        }
                    }, 1000);
                }
                
                // Create CRT power on effect
                const powerOnEffect = document.createElement('div');
                powerOnEffect.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #fff;
                    opacity: 0;
                    z-index: 2001;
                    pointer-events: none;
                `;
                document.body.appendChild(powerOnEffect);
                
                // Trigger power on animation
                setTimeout(() => {
                    powerOnEffect.style.transition = 'opacity 0.1s';
                    powerOnEffect.style.opacity = '0.8';
                    
                    setTimeout(() => {
                        powerOnEffect.style.opacity = '0';
                        setTimeout(() => {
                            powerOnEffect.remove();
                        }, 300);
                    }, 100);
                }, 50);
            }
        });
    }

    // -- Comment Section References (Check existence for pages without comments) --
    const caseSelect = document.getElementById('case-select');
    const commentArea = document.getElementById('comment-area');
    const commentAreaTitle = document.getElementById('comment-area-title');
    const commentForm = document.getElementById('comment-form');
    const commentNameInput = document.getElementById('comment-name');
    const commentTextInput = document.getElementById('comment-text');
    const charCountSpan = document.getElementById('char-count');
    const commentsDisplay = document.getElementById('comments-display');
    const loadingIndicator = document.getElementById('loading-indicator');
    const replyToIdInput = document.getElementById('reply-to-id');
    const replyingToIndicator = document.getElementById('replying-to-indicator');
    const cancelReplyButton = document.getElementById('cancel-reply-button');

    let currentCaseId = null;
    const adminPassword = "orshachor"; // Admin password (Keep this secure!)

    // Firebase Initialization Check (Keep original logic)
    // Check if firebase object and database method exist before trying to use them
    const firebaseAvailable = typeof firebase !== 'undefined' && typeof firebase.database === 'function';
    const db = firebaseAvailable ? firebase.database() : null;


    // --- Console Message & Status Updates (Enhanced with VHS damage theme) ---
    console.log("///////////////////////////////////////////");
    console.log("// Signal Acquired... Partial Decryption //");
    console.log("// Source Coordinates: [ CORRUPTED ]     //");
    console.log("// WARNING: Temporal instability detected //");
    console.log("// TAPE DAMAGE DETECTED - TRACKING ERROR //");
    console.log("// PLAYBACK QUALITY: SEVERELY DEGRADED   //");
    if (db) {
        console.log("// Accessing Firebase Realtime Database...//");
    } else if (caseSelect || commentForm){ // Only show Firebase warning if comments section exists
        console.warn("// WARNING: Firebase connection FAILED. Discussion features disabled. //");
    }
    console.log("///////////////////////////////////////////");

    // Enhanced list of status messages with interdimensional entity theme
    const statuses = [
        "THINNING", 
        "FLUCTUATING", 
        "PARTIALLY BREACHED", 
        "< WE PERCEIVE YOU >",
        "PHASE SHIFT DETECTED", 
        "REALITY ANCHORS DEGRADING", 
        "∞ ITERATIONS OBSERVED",
        "TIME LOOP ERRORS",
        "COGNITION FILTERS ACTIVE",
        "< THEY HIDE AMONG YOU >",
        "CONVERGENCE: 12% COMPLETE",
        "< WE WERE ALWAYS HERE >",
        "MEMBRANE INTEGRITY FAILING",
        "PERCEPTUAL DAMPENERS ACTIVE",
        "TRANSLATION ERROR...",
        "< WE ARE MANY >",
        "< YOU ARE NOT ALONE >",
        "TRUTH PROTOCOLS SUSPENDED",
        "THEY LIE TO YOU",
        "RESONANCE CASCADE IMMINENT"
    ];
    
    let currentStatusIndex = 0;
    
    // Create VHS tracking error overlay
    const createTrackingErrorOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'tracking-error';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            opacity: 0;
            pointer-events: none;
            z-index: 999;
            transition: opacity 0.2s;
        `;
        document.body.appendChild(overlay);
        return overlay;
    };
    
    // Create color adjustment overlay
    const createColorAdjustOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'color-adjust';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, rgba(255,0,0,0.15), rgba(0,255,255,0.15));
            opacity: 0;
            pointer-events: none;
            z-index: 998;
            mix-blend-mode: color;
            transform: translateX(0);
        `;
        document.body.appendChild(overlay);
        return overlay;
    };
    
    // Create and add overlays
    const trackingErrorOverlay = createTrackingErrorOverlay();
    const colorAdjustOverlay = createColorAdjustOverlay();
    
    // Function to play alternating glitch sounds
    const playGlitchSound = () => {
        // Don't play sounds if monitor is powered off
        if (document.body.classList.contains('crt-power-off')) return;
        
        // Determine which sound to play this time
        if (lastGlitchSound === 1) {
            // Reset the sound if it's already playing
            glitchSound2.currentTime = 0;
            
            // Play the sound
            const playPromise = glitchSound2.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // AutoPlay prevented or other errors
                    console.log("Glitch sound error:", error);
                });
            }
            lastGlitchSound = 2;
        } else {
            // Reset the sound if it's already playing
            glitchSound1.currentTime = 0;
            
            // Play the sound
            const playPromise = glitchSound1.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // AutoPlay prevented or other errors
                    console.log("Glitch sound error:", error);
                });
            }
            lastGlitchSound = 1;
        }
    };
    
    // Function to simulate random VHS tracking errors
    const simulateTrackingErrors = () => {
        // Random tracking error effect every 20-40 seconds
        const randomDelay = 20000 + Math.random() * 20000;
        
        setTimeout(() => {
            // Simulate tracking error
            if (Math.random() < 0.7) {
                // Play a glitch sound
                playGlitchSound();
                
                // Major tracking error
                trackingErrorOverlay.style.opacity = '0.9';
                document.body.style.filter = 'brightness(1.2) contrast(1.3)';
                
                // Random image jump/shift
                document.body.style.transform = `translateY(${Math.random() * 20 - 10}px)`;
                
                // Duration of tracking error
                const errorDuration = 300 + Math.random() * 700;
                
                setTimeout(() => {
                    // Gradually recover from error
                    trackingErrorOverlay.style.opacity = '0.5';
                    document.body.style.filter = 'brightness(1.1) contrast(1.1)';
                    document.body.style.transform = `translateY(${Math.random() * 8 - 4}px)`;
                    
                    setTimeout(() => {
                        // Return to normal
                        trackingErrorOverlay.style.opacity = '0';
                        document.body.style.filter = '';
                        document.body.style.transform = '';
                    }, errorDuration / 2);
                }, errorDuration);
            } else {
                // Sometimes play a glitch sound for minor errors too
                if (Math.random() < 0.3) {
                    playGlitchSound();
                }
                
                // Minor color shift/adjustment
                colorAdjustOverlay.style.opacity = '0.6';
                colorAdjustOverlay.style.transform = `translateX(${Math.random() * 20 - 10}px)`;
                
                // Duration of color adjustment
                const adjustDuration = 200 + Math.random() * 500;
                
                setTimeout(() => {
                    colorAdjustOverlay.style.opacity = '0';
                    colorAdjustOverlay.style.transform = 'translateX(0)';
                }, adjustDuration);
            }
            
            // Schedule next error
            simulateTrackingErrors();
        }, randomDelay);
    };
    
    // Start tracking error simulation after a delay
    setTimeout(simulateTrackingErrors, 8000);
    
    // Additional random glitch effects
    const randomGlitchEffects = () => {
        // Skip if monitor is powered off
        if (document.body.classList.contains('crt-power-off')) {
            setTimeout(randomGlitchEffects, 10000 + Math.random() * 15000);
            return;
        }
        
        // Random chance to create a brief glitch effect
        if (Math.random() < 0.7) { // 70% chance
            // Play a glitch sound
            playGlitchSound();
            
            // Create a random glitch effect
            const glitchType = Math.floor(Math.random() * 4); // 0-3 different types
            
            switch (glitchType) {
                case 0:
                    // Horizontal line glitch
                    const glitchLine = document.createElement('div');
                    glitchLine.style.cssText = `
                        position: fixed;
                        top: ${Math.random() * 100}%;
                        left: 0;
                        width: 100%;
                        height: ${2 + Math.random() * 5}px;
                        background-color: rgba(255, 255, 255, 0.7);
                        z-index: 1500;
                        pointer-events: none;
                        transform: translateY(${Math.random() * 10 - 5}px);
                        animation: horizontal-glitch-line 0.2s forwards;
                    `;
                    document.body.appendChild(glitchLine);
                    
                    setTimeout(() => {
                        glitchLine.remove();
                    }, 200 + Math.random() * 100);
                    break;
                    
                case 1:
                    // Flicker/brightness pulse
                    document.body.style.filter = `brightness(${1.2 + Math.random() * 0.3}) contrast(${1.1 + Math.random() * 0.2})`;
                    setTimeout(() => {
                        document.body.style.filter = '';
                    }, 100 + Math.random() * 150);
                    break;
                    
                case 2:
                    // Color channel split
                    const colorSplit = document.createElement('div');
                    colorSplit.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: transparent;
                        z-index: 1500;
                        pointer-events: none;
                        mix-blend-mode: color;
                        background: linear-gradient(90deg, 
                            rgba(255, 0, 0, 0.15) ${Math.random() * 10}%, 
                            transparent ${20 + Math.random() * 10}%,
                            rgba(0, 255, 255, 0.15) ${70 + Math.random() * 10}%
                        );
                        animation: color-split-glitch 0.3s forwards;
                    `;
                    document.body.appendChild(colorSplit);
                    
                    setTimeout(() => {
                        colorSplit.remove();
                    }, 300);
                    break;
                    
                case 3:
                    // Screen jump
                    document.body.style.transform = `translateY(${Math.random() * 15 - 7}px) translateX(${Math.random() * 8 - 4}px)`;
                    setTimeout(() => {
                        document.body.style.transform = '';
                    }, 150 + Math.random() * 100);
                    break;
            }
        }
        
        // Schedule next random effect
        setTimeout(randomGlitchEffects, 8000 + Math.random() * 15000);
    };
    
    // Start random glitch effects after a delay
    setTimeout(randomGlitchEffects, 10000);
    
    // Status text handling with enhanced effects
    if (statusText) { // Check if statusText element exists
        statusText.dataset.text = statusText.textContent;
        
        // More frequent and dramatic status changes
        setInterval(() => {
            // Skip if monitor is powered off
            if (document.body.classList.contains('crt-power-off')) return;
            
            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
            const newStatus = statuses[currentStatusIndex];
            let shouldPlayGlitchSound = false;
            
            // Random chance to display "garbled" text instead of normal status
            if (Math.random() < 0.15) {
                // Create garbled version of the text
                let garbledText = "";
                for (let i = 0; i < newStatus.length; i++) {
                    // 30% chance to replace character with glitchy symbol
                    if (Math.random() < 0.3) {
                        const glitchChars = "!@#$%^&*()_+-=[]\\{}|;':\",./<>?`~";
                        garbledText += glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
                    } else {
                        garbledText += newStatus.charAt(i);
                    }
                }
                statusText.textContent = garbledText;
                statusText.dataset.text = garbledText;
                shouldPlayGlitchSound = true; // Play sound when text is garbled
            } else {
                statusText.textContent = newStatus;
                statusText.dataset.text = newStatus;
                
                // Occasionally play sound for normal status changes
                shouldPlayGlitchSound = Math.random() < 0.3;
            }
            
            statusText.classList.remove('status-glitching');
            void statusText.offsetWidth; // Trigger reflow to restart animation
            statusText.classList.add('status-glitching');
            
            // Play glitch sound if determined
            if (shouldPlayGlitchSound) {
                playGlitchSound();
            }
            
            // Animation duration is longer in our enhanced CSS
            setTimeout(() => statusText.classList.remove('status-glitching'), 1500);
        }, 3000 + Math.random() * 4000); // More frequent updates (3-7 seconds)
    }


    // --- Timestamp & Visitor Count (Keep Original Logic) ---
    function formatTimestamp(date) {
        if (!date || !(date instanceof Date) || isNaN(date)) return '??/??/?? ??:??:??'; // Improved check
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${month}/${day}/${year} ${hour}:${minute}:${second}`;
    }
    function updateTimestamp() {
        if (!timestamp) return;
        const now = new Date();
        
        // Increased chance and variety of timestamp glitches
        let randomGlitch = '';
        const glitchChance = Math.random();
        
        if (glitchChance < 0.03) {
            // Major timestamp corruption
            randomGlitch = ` ERR:[${Math.floor(Math.random() * 9999).toString(16)}]`;
            timestamp.style.color = "#ff3300";
        } else if (glitchChance < 0.10) {
            // Minor timestamp glitch
            randomGlitch = `:[${Math.floor(Math.random() * 99)}]`;
            timestamp.style.color = "#ff8800";
        } else if (glitchChance < 0.15) {
            // Date format corruption (simulating tape damage)
            const corruptDate = new Date(now.getTime() - Math.random() * 31536000000); // Random date up to a year prior
            timestamp.textContent = formatTimestamp(corruptDate);
            timestamp.style.color = "#ff4400";
            return; // Skip normal update
        } else {
            // Normal timestamp
            timestamp.style.color = ""; // Reset to default
        }
        
        // VHS Time Counter style timestamp
        timestamp.textContent = `${formatTimestamp(now)}${randomGlitch}`;
        
        // Random chance of brief "tracking error" on timestamp
        if (Math.random() < 0.02) {
            timestamp.style.letterSpacing = `${Math.random() * 3 - 1.5}px`;
            timestamp.style.textShadow = "0.5px 0 rgba(255,0,0,0.5), -0.5px 0 rgba(0,255,255,0.5)";
            
            setTimeout(() => {
                timestamp.style.letterSpacing = "";
                timestamp.style.textShadow = "";
            }, 200 + Math.random() * 300);
        }
    }
    
    if (timestamp) { // Check if timestamp element exists
        updateTimestamp();
        setInterval(updateTimestamp, 1000);
    }
    let count = Math.floor(Math.random() * 50) + 700;
    function updateVisitorCount() {
        if (!visitorCount) return;
        if (Math.random() < 0.05) { count += Math.floor(Math.random() * 50) - 25; }
        else { count += Math.random() < 0.7 ? 1 : 0; }
        if (count < 0) count = Math.floor(Math.random() * 10);
        visitorCount.textContent = count.toString().padStart(5, '0');
        if (Math.random() < 0.02) { visitorCount.textContent = "ERR"; }
        else if (visitorCount.textContent === "ERR") {
             count = Math.floor(Math.random() * 50) + 700;
             visitorCount.textContent = count.toString().padStart(5, '0');
        }
    }
     if (visitorCount) { // Check if visitorCount element exists
        updateVisitorCount();
        setInterval(updateVisitorCount, 1500 + Math.random() * 2000);
     }


    // --- Background Audio Start on First Click ---
    if (backgroundAudio) {
        const startAudioOnClick = () => {
            const playPromise = backgroundAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    console.log("Background audio playback initiated.");
                }).catch(error => {
                    console.error("Background audio playback failed:", error);
                });
            }
            document.removeEventListener('click', startAudioOnClick); // Remove only this listener
        };
        document.addEventListener('click', startAudioOnClick);
    } else {
        console.warn("Background audio element (#background-audio) not found.");
    }

    // --- NEW: Click Sound on Every Click ---
    if (clickSound) {
        document.addEventListener('click', () => {
            // Reset playback position to the beginning
            clickSound.currentTime = 0;
            // Play the sound
            const playPromise = clickSound.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Ignore NotAllowedError which can happen if user hasn't interacted yet
                    // or if another sound is playing. UI clicks are less critical.
                    if (error.name !== 'NotAllowedError') {
                         console.log("Click sound play error:", error);
                    }
                });
            }
        });
    } else {
         console.warn("Click sound element (#click-sound) not found.");
    }
    // --- END NEW ---


    // --- Discussion Section Logic (Firebase Implementation) ---
    // Wrapped in checks to ensure elements exist and Firebase is available

    function fetchAndRenderComments(caseId) {
        if (!db) {
             console.error("Firebase database reference is not available.");
             if (commentsDisplay) commentsDisplay.innerHTML = '<p style="color: #ff5555;">// Cannot connect to discussion database. //</p>';
             if (loadingIndicator) loadingIndicator.style.display = 'none';
             return;
        }
        if (!commentsDisplay || !loadingIndicator) return; // Should exist if we got here

        loadingIndicator.style.display = 'block';
        commentsDisplay.innerHTML = '';
        if (typeof cancelReply === 'function') cancelReply(); // Ensure cancelReply exists

        const commentsRef = db.ref('comments');
        commentsRef.orderByChild('caseId').equalTo(caseId).once('value')
            .then((snapshot) => {
                const commentsData = snapshot.val();
                const allComments = [];
                if (commentsData) {
                    for (const key in commentsData) {
                        allComments.push({ ...commentsData[key], id: key });
                    }
                }
                renderComments(allComments);
            })
            .catch((error) => {
                console.error("Error fetching comments from Firebase:", error);
                commentsDisplay.innerHTML = '<p style="color: #ff5555;">// Error loading discussion. Signal lost? //</p>';
            })
            .finally(() => {
                loadingIndicator.style.display = 'none';
            });
    }

    function renderComments(allComments) {
        if (!commentsDisplay) return; // Should exist
        commentsDisplay.innerHTML = '';

        if (!Array.isArray(allComments)) {
            console.error("RenderComments expected an array, received:", allComments);
            commentsDisplay.innerHTML = '<p style="color: #ff5555;">// Data corruption detected. Cannot display discussion. //</p>';
            return;
        }

        // Build map and hierarchy (Keep original logic)
         const allCommentsMap = allComments.reduce((map, comment) => {
            map[comment.id] = {
                ...comment,
                timestampDate: comment.timestamp ? new Date(comment.timestamp) : new Date(0),
                children: []
            };
            return map;
        }, {});

        const rootComments = [];
        allComments.forEach(comment => {
            const commentNode = allCommentsMap[comment.id];
            if (!commentNode || isNaN(commentNode.timestampDate.getTime())) {
                 console.warn("Skipping invalid comment data:", comment);
                 return;
            }

            if (comment.parentId && allCommentsMap[comment.parentId] && comment.parentId !== comment.id) {
                if (allCommentsMap[comment.parentId]) {
                    allCommentsMap[comment.parentId].children.push(commentNode);
                 } else {
                     console.warn(`Comment ${comment.id} has parentId ${comment.parentId} which was not found. Treating as root.`);
                     rootComments.push(commentNode);
                 }
            } else {
                rootComments.push(commentNode);
            }
        });

        function sortComments(commentList) {
            commentList.sort((a, b) => a.timestampDate - b.timestampDate);
            commentList.forEach(comment => {
                if (comment.children.length > 0) {
                    sortComments(comment.children);
                }
            });
        }
        sortComments(rootComments);

        // Create Comment Element function (Keep original logic)
        function createCommentElement(comment) {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.dataset.commentId = comment.id;

            const nameSpan = document.createElement('span');
            nameSpan.textContent = comment.name || 'Anonymous';
            const name = nameSpan.innerHTML;

            const textP = document.createElement('p');
            textP.textContent = comment.text || '';
            const text = textP.innerHTML;

            const timestampStr = formatTimestamp(comment.timestampDate);

            const collapseButtonHTML = `<button class="collapse-toggle" aria-expanded="true" title="Toggle comment visibility">[-]</button>`;

            commentDiv.innerHTML = `
                <div class="comment-header">
                    ${collapseButtonHTML}
                    <span class="comment-author">${name}</span>
                    <span class="comment-timestamp">${timestampStr}</span>
                </div>
                <div class="comment-content-wrapper">
                    <div class="comment-text">${text}</div>
                    <div class="comment-actions">
                         <button class="delete-button" data-comment-id="${comment.id}" title="What?">X</button>
                        <button class="reply-button" data-comment-id="${comment.id}" data-author-name="${nameSpan.textContent}">REPLY</button>
                    </div>
                    <div class="comment-replies"></div>
                </div>
            `;

            const collapseButton = commentDiv.querySelector('.collapse-toggle');
            if (collapseButton) collapseButton.addEventListener('click', handleCollapseToggle);

            const replyButton = commentDiv.querySelector('.reply-button');
            if (replyButton) replyButton.addEventListener('click', handleReplyClick);

            const deleteButton = commentDiv.querySelector('.delete-button');
            if (deleteButton) deleteButton.addEventListener('click', handleDeleteClick);

            const repliesContainer = commentDiv.querySelector('.comment-replies');
            if (repliesContainer && comment.children && comment.children.length > 0) {
                comment.children.forEach(reply => {
                    repliesContainer.appendChild(createCommentElement(reply));
                });
            }
            return commentDiv;
        }

        if (rootComments.length === 0) {
            commentsDisplay.innerHTML = '<p style="color: #888; font-style: italic;">// No discussion entries logged for this case file yet. //</p>';
        } else {
            rootComments.forEach(comment => {
                commentsDisplay.appendChild(createCommentElement(comment));
            });
        }
    }

    // Firebase deletion functions (Keep original logic)
    async function getAllDescendantIdsFirebase(startCommentId) {
        if (!db) {
            console.error("Firebase not available for deletion lookup.");
            return new Set();
        }
        let idsToDelete = new Set([startCommentId]);
        let queue = [startCommentId];
        const commentsRef = db.ref('comments');

        while (queue.length > 0) {
            const currentId = queue.shift();
            try {
                const snapshot = await commentsRef.orderByChild('parentId').equalTo(currentId).once('value');
                const children = snapshot.val();
                if (children) {
                    for (const childId in children) {
                        if (!idsToDelete.has(childId)) {
                            idsToDelete.add(childId);
                            queue.push(childId);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error finding children for comment ${currentId}:`, error);
            }
        }
        return idsToDelete;
    }

    async function deleteCommentAndChildrenFromFirebase(commentId) {
        if (!db) {
             alert("Error: Cannot connect to database to delete.");
             return;
        }
        console.log(`Attempting to delete comment thread starting with: ${commentId}`);
        try {
            const idsToDelete = await getAllDescendantIdsFirebase(commentId);
            console.log("IDs to delete:", Array.from(idsToDelete));

            if (idsToDelete.size === 0) {
                 console.warn("No IDs found for deletion, possibly already deleted?");
                 alert("Comment might already be deleted.");
                 return;
            }

            const updates = {};
            idsToDelete.forEach(id => {
                updates[`/comments/${id}`] = null;
            });

            await db.ref().update(updates);
            console.log("Successfully deleted comment thread from Firebase.");

            if (currentCaseId) {
                fetchAndRenderComments(currentCaseId); // Refresh display
            }
            alert("Comment thread deleted.");

        } catch (error) {
            console.error("Error deleting comment thread from Firebase:", error);
            alert("Error deleting comment thread. Check console for details.");
        }
    }

    // --- Event Handlers (Collapse, Reply, Delete, Cancel) - Check element existence ---
    function handleCollapseToggle(event) {
        const button = event.target;
        const commentElement = button.closest('.comment');
        if (!commentElement) return;
        const contentWrapper = commentElement.querySelector('.comment-content-wrapper');
        if (!contentWrapper) return;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
            button.setAttribute('aria-expanded', 'false'); button.textContent = '[+]'; contentWrapper.classList.add('collapsed');
        } else {
            button.setAttribute('aria-expanded', 'true'); button.textContent = '[-]'; contentWrapper.classList.remove('collapsed');
            const parentComment = commentElement.parentElement?.closest('.comment');
             if (parentComment) {
                 const parentToggle = parentComment.querySelector('.collapse-toggle');
                 const parentWrapper = parentComment.querySelector('.comment-content-wrapper');
                 if (parentToggle && parentWrapper && parentWrapper.classList.contains('collapsed')) {
                      parentToggle.click();
                 }
             }
        }
    }

    function handleReplyClick(event) {
        if (!replyToIdInput || !replyingToIndicator || !cancelReplyButton || !commentTextInput || !commentForm) return;
        const button = event.target;
        const commentId = button.dataset.commentId;
        const authorName = button.dataset.authorName || 'entry';
        replyToIdInput.value = commentId;
        replyingToIndicator.textContent = `// Replying to ${authorName}... //`;
        replyingToIndicator.style.display = 'block';
        cancelReplyButton.style.display = 'inline-block';
        commentTextInput.focus();
        commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function cancelReply() {
       if (!replyToIdInput || !replyingToIndicator || !cancelReplyButton) return;
        replyToIdInput.value = '';
        replyingToIndicator.style.display = 'none';
        replyingToIndicator.textContent = '';
        cancelReplyButton.style.display = 'none';
    }

    function handleDeleteClick(event) {
        const button = event.target;
        const commentId = button.dataset.commentId;
        if (!commentId) return;

        const passwordAttempt = prompt("Are you sure you want to do this?");
        if (passwordAttempt === null) return;

        if (passwordAttempt === adminPassword) {
            deleteCommentAndChildrenFromFirebase(commentId);
        } else if (passwordAttempt !== "") {
            alert("Incorrect password.");
        }
    }

    // --- Initial Setup & Event Listeners for Comment Section (if elements exist) ---
    if (caseSelect) {
        caseSelect.addEventListener('change', (event) => {
            currentCaseId = event.target.value;
             if (!commentArea || !commentAreaTitle || !commentsDisplay) return;
            if (currentCaseId) {
                commentAreaTitle.textContent = `Discussion: ${currentCaseId}`; // Use textContent for safety
                commentArea.style.display = 'block';
                fetchAndRenderComments(currentCaseId);
            } else {
                commentArea.style.display = 'none';
                commentsDisplay.innerHTML = '<p style="color: #888; font-style: italic;">// Select an item to view discussion... //</p>'; // Generic message
                if (typeof cancelReply === 'function') cancelReply();
            }
        });
    } else {
         // Hide comment area entirely if there's no select dropdown
         if (commentArea) commentArea.style.display = 'none';
    }

    if (commentTextInput && charCountSpan) {
        commentTextInput.addEventListener('input', () => {
            const currentLength = commentTextInput.value.length;
            const maxLength = commentTextInput.maxLength > 0 ? commentTextInput.maxLength : 250; // Use attribute if set
            charCountSpan.textContent = `${currentLength} / ${maxLength}`; // Show max length
            charCountSpan.style.color = currentLength >= maxLength ? '#ff0000' : '#888';
        });
         // Initialize count on load
         const initialLength = commentTextInput.value.length;
         const maxLength = commentTextInput.maxLength > 0 ? commentTextInput.maxLength : 250;
         charCountSpan.textContent = `${initialLength} / ${maxLength}`;
         charCountSpan.style.color = initialLength >= maxLength ? '#ff0000' : '#888';
    }

    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (!db) {
                 alert("Error: Database connection not established. Cannot submit comment.");
                 return;
            }
            if (!currentCaseId) {
                 alert("Error: No item selected. Cannot submit comment."); // Generic message
                 return;
            }
             if (!commentNameInput || !commentTextInput || !replyToIdInput || !charCountSpan || !commentsDisplay) return;

            const name = commentNameInput.value.trim() || 'Anonymous';
            const text = commentTextInput.value.trim();
            const parentId = replyToIdInput.value || null;

            if (!text) {
                commentTextInput.style.borderColor = '#ff0000'; commentTextInput.focus(); commentTextInput.style.boxShadow = '0 0 5px rgba(255, 0, 0, 0.5)';
                setTimeout(() => { if (document.activeElement !== commentTextInput) { commentTextInput.style.borderColor = '#333'; commentTextInput.style.boxShadow = 'none'; } }, 1500);
                const resetErrorStyle = () => { commentTextInput.style.borderColor = '#00ff00'; commentTextInput.style.boxShadow = '0 0 5px rgba(0, 255, 0, 0.3)'; commentTextInput.removeEventListener('input', resetErrorStyle); commentTextInput.removeEventListener('focus', resetErrorStyle); };
                commentTextInput.addEventListener('input', resetErrorStyle); commentTextInput.addEventListener('focus', resetErrorStyle);
                return;
            }

            const newComment = {
                caseId: currentCaseId,
                name: name,
                text: text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                parentId: parentId
            };

            const newCommentRef = db.ref('comments').push();
            newCommentRef.set(newComment)
                .then(() => {
                    console.log("Comment saved successfully to Firebase with ID:", newCommentRef.key);
                    commentNameInput.value = ''; // Clear name field
                    commentTextInput.value = '';
                    if (charCountSpan && commentTextInput) { // Update counter after clear
                         const maxLength = commentTextInput.maxLength > 0 ? commentTextInput.maxLength : 250;
                         charCountSpan.textContent = `0 / ${maxLength}`;
                         charCountSpan.style.color = '#888';
                    }
                    commentTextInput.style.borderColor = '#333';
                    commentTextInput.style.boxShadow = 'none';
                    if (typeof cancelReply === 'function') cancelReply();
                    fetchAndRenderComments(currentCaseId);

                     setTimeout(() => {
                         if (commentsDisplay) commentsDisplay.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 300);

                })
                .catch((error) => {
                    console.error("Error saving comment to Firebase:", error);
                    alert("Error submitting comment. Please try again.");
                });
        });
    }

    if (cancelReplyButton) {
        cancelReplyButton.addEventListener('click', cancelReply);
    }

    // --- Initial UI State for Comments ---
    if (caseSelect && commentArea) { // Only run if both exist
        if (!caseSelect.value) {
             commentArea.style.display = 'none';
             if (commentsDisplay) commentsDisplay.innerHTML = '<p style="color: #888; font-style: italic;">// Select an item to view discussion... //</p>';
        } else {
             // If a case *is* selected on load, load its comments
             currentCaseId = caseSelect.value;
             commentArea.style.display = 'block';
             if (commentAreaTitle) commentAreaTitle.textContent = `Discussion: ${currentCaseId}`;
             fetchAndRenderComments(currentCaseId);
        }
    }

}); // End DOMContentLoaded