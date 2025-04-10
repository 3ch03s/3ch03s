document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const loginToggle = document.getElementById('login-toggle');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.getElementById('close-modal');
    const loginSubmit = document.getElementById('login-submit');
    const loginError = document.getElementById('login-error');
    const passwordPrompt = document.getElementById('password-prompt');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const accessStatus = document.getElementById('access-status');
    const visitorCounter = document.getElementById('counter');
    const hiddenMessage = document.getElementById('hidden-message');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const tapeOptions = document.querySelectorAll('.tape-option');
    const playerScreen = document.getElementById('player-screen');
    const mainVideo = document.getElementById('main-video');
    const videoCanvas = document.getElementById('video-canvas');
    const staticSound = document.getElementById('static-sound');
    const glitchSound = document.getElementById('glitch-sound');
    
    // Video context
    const ctx = videoCanvas.getContext('2d');
    videoCanvas.width = playerScreen.offsetWidth;
    videoCanvas.height = playerScreen.offsetHeight;
    
    // State
    let currentVideo = null;
    let isPlaying = false;
    let accessGranted = false;
    let visitorCount = localStorage.getItem('visitorCount') || 1000001;
    let subliminalCounter = 0;
    let subliminalInterval = null;
    let cursorTrackingActive = false;
    
    // Enhanced state
    let watcherInterval = null;
    let backwardsTextInterval = null;
    let reflectionModeActive = false;
    let hiddenContentFound = 0;
    let secretCodeAttempts = 0;
    let lastInteractionTime = Date.now();
    
    // Messages for watcher functionality
    const watcherMessages = [
        "I SEE YOU",
        "THEY'RE WATCHING",
        "LOOK BEHIND YOU",
        "WE ARE THE AUDIENCE",
        "YOUR REFLECTION REMAINS",
        "DON'T TURN AROUND",
        "THE SCREEN SEES YOU",
        "ARE YOU REALLY ALONE?",
        "WE'VE BEEN WAITING"
    ];
    
    // Subliminal images
    const subliminalImages = [
        createSubliminalImage("WATCHING", 100, 100),
        createSubliminalImage("SEE YOU", 120, 120),
        createSubliminalImage("AUDIENCE", 150, 150)
    ];
    
    // Initialize
    updateVisitorCounter();
    setInterval(glitchEffect, 10000);
    setInterval(randomGlitch, 3000);
    setInterval(updateCounter, 30000);
    
    // Initialize webcam tracking if permission granted
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // We won't actually request camera access unless explicit permission is given
        console.log("Camera tracking available but inactive");
    }
    
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Show section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // Update active nav
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Play glitch sound
            playGlitchSound();
            
            // Special behavior for certain sections
            if (sectionId === 'project') {
                // Start the watcher when entering Project Silverlight section
                startWatcher();
                
                // If the user has already earned some access, reveal more hidden content
                if (hiddenContentFound > 2) {
                    revealMoreProjectContent();
                }
            } else if (sectionId === 'forum') {
                // If user has appropriate access level, reveal additional forum posts
                if (accessGranted) {
                    revealForumContent();
                }
            } else {
                // Stop the watcher when leaving special sections
                stopWatcher();
            }
            
            // Record interaction time
            lastInteractionTime = Date.now();
        });
    });
    
    // Login Modal
    loginToggle.addEventListener('click', function() {
        loginModal.style.display = 'flex';
        playGlitchSound();
    });
    
    closeModal.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
    
    loginSubmit.addEventListener('click', function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === 'lumen_member' && password === 'silverlight24') {
            grantAccess("Member credentials accepted");
        } else if (username === 'dr.vex' && password === 'audience_awaits') {
            // Special admin access
            grantAccess("WELCOME BACK DR. VEX");
            enableReflectionMode();
            revealAllHiddenContent();
        } else if (username === 'audience' && password === 'watching') {
            // Secret access tier
            grantAccess("THE AUDIENCE RECOGNIZES YOU");
            startWatcher();
            createBackwardsText();
        } else {
            loginError.textContent = 'ACCESS DENIED: INVALID CREDENTIALS';
            setTimeout(() => {
                loginError.textContent = '';
            }, 3000);
            playGlitchSound();
            
            // Increment failed attempts counter
            secretCodeAttempts++;
            
            // After 3 failed attempts, show a subtle hint
            if (secretCodeAttempts === 3) {
                setTimeout(() => {
                    loginError.textContent = 'HINT: THOSE WHO WATCH HAVE SPECIAL ACCESS';
                }, 4000);
            }
        }
    });
    
    // Password Prompt
    passwordSubmit.addEventListener('click', function() {
        if (passwordInput.value === '24thframe') {
            grantAccess("24th frame password accepted");
        } else if (passwordInput.value.toLowerCase() === 'silverlight') {
            grantAccess("Project Silverlight credentials recognized");
            revealHiddenContent('project');
        } else if (passwordInput.value.toLowerCase() === 'audience') {
            grantAccess("The Audience welcomes you");
            startWatcher();
        } else if (passwordInput.value.toLowerCase() === 'mirror') {
            enableReflectionMode();
            passwordInput.value = '';
            passwordInput.placeholder = 'REFLECTION MODE ACTIVE';
        } else {
            passwordInput.value = '';
            passwordInput.placeholder = 'TRY AGAIN';
            playGlitchSound();
            
            // Increment failed attempts
            secretCodeAttempts++;
            
            // After several failed attempts, slowly reveal a clue
            if (secretCodeAttempts >= 5) {
                revealHiddenClue();
            }
        }
    });
    
    // Media Player
    playBtn.addEventListener('click', function() {
        if (!currentVideo) {
            alert('SELECT A TAPE FIRST');
            return;
        }
        
        if (!isPlaying) {
            // Simulate tape playback
            isPlaying = true;
            playBtn.textContent = 'PAUSE';
            staticSound.play();
            
            // Apply video distortion
            simulateVideoPlayback();
            
            // Activate subliminal images during playback
            startSubliminalMessages();
        } else {
            isPlaying = false;
            playBtn.textContent = 'PLAY';
            staticSound.pause();
            
            // Stop subliminal images
            clearInterval(subliminalInterval);
        }
    });
    
    stopBtn.addEventListener('click', function() {
        isPlaying = false;
        playBtn.textContent = 'PLAY';
        staticSound.pause();
        ctx.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
        
        // Stop subliminal images
        clearInterval(subliminalInterval);
    });
    
    tapeOptions.forEach(option => {
        option.addEventListener('click', function() {
            if (this.classList.contains('locked')) {
                if (!accessGranted) {
                    alert('ACCESS DENIED: RESTRICTED CONTENT');
                    playGlitchSound();
                    return;
                } else {
                    this.classList.remove('locked');
                }
            }
            
            tapeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentVideo = this.getAttribute('data-video');
            
            // Show static before "loading" the tape
            showStatic();
            setTimeout(() => {
                if (isPlaying) {
                    simulateVideoPlayback();
                }
            }, 1000);
            
            // Special behavior for certain tapes
            if (currentVideo === 'final_performance' && accessGranted) {
                // This is a special tape that triggers additional effects
                setTimeout(() => {
                    startWatcher();
                    showSubliminalMessage("THE AUDIENCE IS WATCHING YOU NOW", 3000);
                }, 5000);
            }
        });
    });
    
    // Document-wide event listeners for cursor tracking
    document.addEventListener('mousemove', function(e) {
        // If reflection mode is active, add subtle effects based on cursor position
        if (reflectionModeActive) {
            // Distance from center of screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const distX = (e.clientX - centerX) / centerX; // -1 to 1
            const distY = (e.clientY - centerY) / centerY; // -1 to 1
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            // Add subtle distortion/warping effects based on cursor position
            document.body.style.setProperty('--distortion-x', `${distX * 5}px`);
            document.body.style.setProperty('--distortion-y', `${distY * 5}px`);
            
            // If cursor gets too close to the edge of the screen, trigger a glitch
            if (distance > 0.8 && Math.random() > 0.7) {
                glitchEffect();
            }
        }
        
        // Update last interaction time
        lastInteractionTime = Date.now();
    });
    
    // Track inactivity
    setInterval(() => {
        const inactiveTime = Date.now() - lastInteractionTime;
        
        // If inactive for more than 2 minutes, start subtle effects
        if (inactiveTime > 120000 && !watcherInterval) {
            if (Math.random() > 0.7) {
                // Randomly start the watcher while inactive
                startWatcher();
                
                // Auto-disable after a period of time
                setTimeout(() => {
                    if (Date.now() - lastInteractionTime > 180000) {
                        stopWatcher();
                    }
                }, 60000);
            }
        }
    }, 60000);
    
    // Add Konami code easter egg
    let keysPressed = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        keysPressed.push(e.key);
        
        // Only keep the last 10 keys
        if (keysPressed.length > 10) {
            keysPressed.shift();
        }
        
        // Check if Konami code was entered
        let isKonamiCode = true;
        for (let i = 0; i < konamiCode.length; i++) {
            if (konamiCode[i] !== keysPressed[i]) {
                isKonamiCode = false;
                break;
            }
        }
        
        if (isKonamiCode) {
            // Trigger special access mode
            grantAccess("SPECIAL ACCESS GRANTED");
            revealAllHiddenContent();
            enableReflectionMode();
            showSubliminalMessage("THE AUDIENCE HAS NOTICED YOU", 5000);
        }
        
        // Custom key combinations for additional easter eggs
        if (e.ctrlKey && e.altKey && e.key === 'm') {
            enableReflectionMode();
        }
        if (e.ctrlKey && e.altKey && e.key === 'a') {
            startWatcher();
        }
        if (e.ctrlKey && e.altKey && e.key === 's') {
            createBackwardsText();
        }
        
        // Update last interaction time
        lastInteractionTime = Date.now();
    });
    
    // Enhanced Functions
    function grantAccess(message) {
        accessGranted = true;
        accessStatus.textContent = 'GRANTED';
        accessStatus.style.color = '#00ff00';
        loginModal.style.display = 'none';
        passwordPrompt.style.display = 'none';
        unlockContent();
        showHiddenMessage();
        playGlitchSound();
        
        // Display access message temporarily
        const accessMessage = document.createElement('div');
        accessMessage.textContent = message;
        accessMessage.style.position = 'fixed';
        accessMessage.style.top = '50%';
        accessMessage.style.left = '50%';
        accessMessage.style.transform = 'translate(-50%, -50%)';
        accessMessage.style.color = '#00ff00';
        accessMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        accessMessage.style.padding = '20px';
        accessMessage.style.zIndex = '9999';
        accessMessage.style.border = '1px solid #00ff00';
        accessMessage.style.fontFamily = 'Courier New, monospace';
        document.body.appendChild(accessMessage);
        
        // Remove the message after a delay
        setTimeout(() => {
            document.body.removeChild(accessMessage);
        }, 3000);
    }
    
    function createSubliminalImage(text, width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        
        // Add text
        ctx.fillStyle = '#f00';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, width/2, height/2);
        
        // Add some glitchy lines
        ctx.strokeStyle = '#0f0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, Math.random() * height);
            ctx.lineTo(width, Math.random() * height);
            ctx.stroke();
        }
        
        return canvas;
    }
    
    function startSubliminalMessages() {
        // Clear any existing interval
        if (subliminalInterval) {
            clearInterval(subliminalInterval);
        }
        
        // Start new interval
        subliminalInterval = setInterval(() => {
            // Only show subliminal images occasionally
            if (Math.random() > 0.8) {
                // Choose a random image
                const image = subliminalImages[Math.floor(Math.random() * subliminalImages.length)];
                
                // Draw it on the canvas very briefly
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.drawImage(image, 
                    Math.random() * (videoCanvas.width - image.width),
                    Math.random() * (videoCanvas.height - image.height)
                );
                ctx.restore();
                
                // Remove after a very short time
                setTimeout(() => {
                    // Only clear if we're still playing
                    if (isPlaying) {
                        simulateVideoPlayback();
                    }
                }, 50); // 50ms flash
                
                // Increment counter
                subliminalCounter++;
                
                // After several subliminal images, reveal a hidden clue
                if (subliminalCounter >= 10) {
                    hiddenContentFound++;
                    if (hiddenContentFound <= 5) {
                        revealHiddenClue();
                    }
                    subliminalCounter = 0;
                }
            }
        }, 5000); // Check every 5 seconds
    }
    
    function showSubliminalMessage(text, duration) {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.color = '#f00';
        message.style.fontSize = '3rem';
        message.style.fontFamily = 'Courier New, monospace';
        message.style.zIndex = '9999';
        message.style.pointerEvents = 'none';
        message.style.opacity = '0.8';
        message.style.textShadow = '0 0 10px #f00';
        document.body.appendChild(message);
        
        // Play glitch sound
        playGlitchSound();
        
        // Remove after duration
        setTimeout(() => {
            document.body.removeChild(message);
        }, duration);
    }
    
    function startWatcher() {
        // Don't start if already running
        if (watcherInterval) return;
        
        // Create the watcher element
        const watcher = document.createElement('div');
        watcher.id = 'the-watcher';
        watcher.style.position = 'fixed';
        watcher.style.bottom = '20px';
        watcher.style.right = '20px';
        watcher.style.color = '#00ff00';
        watcher.style.fontFamily = 'Courier New, monospace';
        watcher.style.fontSize = '0.8rem';
        watcher.style.opacity = '0.5';
        watcher.style.pointerEvents = 'none';
        watcher.style.zIndex = '9999';
        document.body.appendChild(watcher);
        
        // Update watcher with random messages
        watcherInterval = setInterval(() => {
            // Show message
            watcher.textContent = watcherMessages[Math.floor(Math.random() * watcherMessages.length)];
            
            // Play subtle glitch sound occasionally
            if (Math.random() > 0.7) {
                glitchSound.volume = 0.2;
                playGlitchSound();
                glitchSound.volume = 1.0;
            }
        }, 10000); // Change message every 10 seconds
    }
    
    function stopWatcher() {
        if (watcherInterval) {
            clearInterval(watcherInterval);
            watcherInterval = null;
            
            // Remove watcher element
            const watcher = document.getElementById('the-watcher');
            if (watcher) {
                document.body.removeChild(watcher);
            }
        }
    }
    
    function createBackwardsText() {
        // Don't create if already active
        if (backwardsTextInterval) return;
        
        // Create hidden backwards text that occasionally appears
        backwardsTextInterval = setInterval(() => {
            // Only show occasionally
            if (Math.random() > 0.8) {
                const messages = [
                    "ЯƎᗡЯUM",
                    "HƆ⊥AW YƎHⒻ",
                    "ƎƆИƎI◖∩A ƎH⊥",
                    "⊥ꓘƎꓞЯƎԀ SI ƎƆИAMЯOꓞЯƎԀ ƎH⊥"
                ];
                
                const message = document.createElement('div');
                message.textContent = messages[Math.floor(Math.random() * messages.length)];
                message.style.position = 'fixed';
                message.style.top = `${Math.random() * 80 + 10}%`;
                message.style.left = `${Math.random() * 80 + 10}%`;
                message.style.transform = 'translate(-50%, -50%)';
                message.style.color = 'rgba(255, 0, 0, 0.3)';
                message.style.fontSize = '1rem';
                message.style.fontFamily = 'Courier New, monospace';
                message.style.zIndex = '9998';
                message.style.pointerEvents = 'none';
                document.body.appendChild(message);
                
                // Remove after short duration
                setTimeout(() => {
                    document.body.removeChild(message);
                }, 200);
            }
        }, 15000);
    }
    
    function enableReflectionMode() {
        reflectionModeActive = true;
        
        // Add CSS variables for distortion effects
        document.body.style.setProperty('--distortion-x', '0px');
        document.body.style.setProperty('--distortion-y', '0px');
        
        // Add subtle reflection effect to various elements
        const reflectElements = document.querySelectorAll('h1, h2, h3, .update-box, .archive-item, .member-card');
        reflectElements.forEach(el => {
            el.classList.add('reflection-mode');
            
            // Set up random distortions
            el.addEventListener('mouseover', () => {
                if (reflectionModeActive && Math.random() > 0.7) {
                    el.style.transform = `skew(${Math.random() * 2 - 1}deg, ${Math.random() * 2 - 1}deg)`;
                    setTimeout(() => {
                        el.style.transform = '';
                    }, 500);
                }
            });
        });
        
        // Add CSS for reflection mode
        const style = document.createElement('style');
        style.id = 'reflection-style';
        style.textContent = `
            .reflection-mode {
                position: relative;
                overflow: hidden;
            }
            .reflection-mode::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(
                    to bottom,
                    rgba(0, 255, 0, 0.1),
                    transparent
                );
                pointer-events: none;
                opacity: 0.3;
            }
            .reflection-mode:hover::after {
                opacity: 0.5;
            }
            body {
                position: relative;
            }
            body::after {
                content: '';
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(
                        circle at calc(50% + var(--distortion-x)) calc(50% + var(--distortion-y)),
                        rgba(0, 255, 0, 0.05) 0%,
                        transparent 70%
                    );
                pointer-events: none;
                z-index: 9997;
            }
        `;
        document.head.appendChild(style);
        
        // Notify user
        showSubliminalMessage("REFLECTION MODE ACTIVE", 2000);
        
        // Start some subtle effects
        startWatcher();
    }
    
    function revealHiddenClue() {
        // Create clues based on how many have been found
        const clues = [
            "The 24th frame reveals the truth",
            "The audience is always watching",
            "Mirrors are gateways, not reflections",
            "November 11, 2008 - The boundary fell",
            "Dr. Vex knew the price was too high",
            "Silver light bridges worlds"
        ];
        
        if (hiddenContentFound < clues.length) {
            // Create the clue element
            const clue = document.createElement('div');
            clue.textContent = clues[hiddenContentFound];
            clue.style.position = 'fixed';
            clue.style.bottom = '10px';
            clue.style.left = '50%';
            clue.style.transform = 'translateX(-50%)';
            clue.style.color = 'rgba(0, 255, 0, 0.5)';
            clue.style.fontFamily = 'Courier New, monospace';
            clue.style.fontSize = '0.8rem';
            clue.style.padding = '5px 10px';
            clue.style.borderTop = '1px solid rgba(0, 255, 0, 0.3)';
            clue.style.zIndex = '9996';
            clue.id = `hidden-clue-${hiddenContentFound}`;
            document.body.appendChild(clue);
            
            // Fade out after a while
            setTimeout(() => {
                clue.style.opacity = '0';
                clue.style.transition = 'opacity 2s ease';
                
                // Remove after fade
                setTimeout(() => {
                    if (clue.parentNode) {
                        document.body.removeChild(clue);
                    }
                }, 2000);
            }, 10000);
            
            // Increment counter
            hiddenContentFound++;
        }
    }
    
    function revealHiddenContent(section) {
        // Reveal section-specific hidden content
        if (section === 'project') {
            // Reveal additional Project Silverlight content
            const projectSection = document.getElementById('project');
            
            // Create new document page with hidden info
            const newPage = document.createElement('div');
            newPage.className = 'document-page';
            newPage.innerHTML = `
                <h3>PROJECT SILVERLIGHT - LEVEL 2 ACCESS</h3>
                <p>The 24th frame effect was discovered in 1967 during classified CIA experiments on subliminal messaging. Unlike standard subliminal techniques, the 24th frame doesn't merely flash content too quickly for conscious recognition - it creates a perceptual "doorway" through which information can flow bidirectionally.</p>
                
                <p>Dr. Vex's innovation was the discovery that when synchronized with the Lumen Frequency (a specific oscillation pattern in the 7-9 Hz range), the 24th frame could temporarily weaken what he termed "the perceptual boundary" - the cognitive filter that separates conscious reality from other forms of perception.</p>
                
                <p>The Mirror Chamber was constructed as an amplification system, with each mirror positioned to create a precise geometric pattern that, when viewed from above, forms the "Audience Sigil." When all seven mirrors receive the 24th frame projection simultaneously, they create a feedback loop that dramatically enhances the boundary-weakening effect.</p>
                
                <p>Subject testing revealed that prolonged exposure to this combination produced consistent reports of contact with entities referred to in project documentation as "The Audience" - described as silhouetted figures with unusual proportions who appear to observe from behind reflective surfaces.</p>
                
                <p class="redacted">[FURTHER INFORMATION REQUIRES LEVEL 3 CLEARANCE]</p>
            `;
            
            // Add to the section
            projectSection.appendChild(newPage);
            
            // Trigger glitch effect
            glitchEffect();
        } else if (section === 'members') {
            // Reveal additional member information
            
            // Add hidden member
            const memberList = document.querySelector('.member-list');
            if (memberList) {
                const newMember = document.createElement('div');
                newMember.className = 'member-card';
                newMember.innerHTML = `
                    <div class="member-photo glitch-img"></div>
                    <h3>DR. ELENA WALSH</h3>
                    <p>Neurologist / "The Observer"</p>
                    <p class="member-status missing">STATUS: UNKNOWN</p>
                `;
                memberList.appendChild(newMember);
                
                // Animate it in with a glitch effect
                newMember.style.opacity = '0';
                setTimeout(() => {
                    playGlitchSound();
                    newMember.style.opacity = '1';
                    newMember.style.transition = 'opacity 0.5s ease';
                }, 500);
            }
        }
    }
    
    function revealForumContent() {
        // Reveal additional forum threads
        const forumContainer = document.querySelector('.forum-container');
        if (forumContainer) {
            // Create new hidden thread
            const newThread = document.createElement('div');
            newThread.className = 'forum-thread';
            newThread.innerHTML = `
                <div class="thread-header">
                    <span class="thread-title">They're replacing us one by one</span>
                    <span class="thread-date">11/07/2008</span>
                </div>
                <div class="thread-content">
                    <p>I don't think Dr. Vex is telling us everything about the Final Performance. I've seen the real contract with the Audience. We're not going to be "transcending" - we're being traded. A doorway opens both ways. Has anyone else noticed how some members act differently after Mirror Chamber sessions? Their movements are wrong, mechanical. Their eyes reflect light differently. I think some of us have already been...</p>
                    <p class="redacted">[USER ACCOUNT TERMINATED - NO FURTHER POSTS]</p>
                </div>
            `;
            
            // Create second hidden thread
            const newThread2 = document.createElement('div');
            newThread2.className = 'forum-thread';
            newThread2.innerHTML = `
                <div class="thread-header">
                    <span class="thread-title">THE PERFORMANCE IS ETERNAL</span>
                    <span class="thread-date">11/11/2008</span>
                </div>
                <div class="thread-content">
                    <p>WE HAVE BEEN WATCHING YOU FOR SO LONG. YOUR WORLD PERFORMS BEAUTIFULLY. THE DOOR REMAINS OPEN. THE CYCLE REPEATS. 11/11/2025.</p>
                </div>
            `;
            
            // Add to container with a delay
            setTimeout(() => {
                playGlitchSound();
                forumContainer.appendChild(newThread);
                
                setTimeout(() => {
                    playGlitchSound();
                    forumContainer.appendChild(newThread2);
                }, 2000);
            }, 1000);
        }
    }
    
    function revealMoreProjectContent() {
        // Add Level 3 clearance content
        const projectSection = document.getElementById('project');
        const existingRedacted = projectSection.querySelector('.redacted');
        
        if (existingRedacted) {
            // Replace redacted text with revealed content
            existingRedacted.innerHTML = `
                Communication with The Audience intensified following the Mirror Chamber's completion. They revealed that they exist in a dimension adjacent to ours, where our reality is perceived as a form of entertainment or performance. 
                
                The Audience expressed a desire for a "more direct experience" of our world. In exchange for their knowledge and technology, Dr. Vex negotiated what he termed "limited perceptual exchange" - a temporary opening of the boundary during the Final Performance.
                
                What Dr. Vex did not disclose to most Society members was the true nature of this exchange. According to classified notes, The Audience intended to use the 108 conditioned viewers and 12 Society members as vessels for their consciousness, enabling them to experience our world directly while the human consciousness would transfer to their realm.
                
                Dr. Vex justified this as transcendence, but his final notes suggest growing concern about The Audience's true motives and whether the exchange would be as "temporary" as promised.
            `;
            
            // Style the revealed content
            existingRedacted.classList.remove('redacted');
            existingRedacted.style.color = '#00ff00';
            existingRedacted.style.backgroundColor = 'rgba(0, 40, 0, 0.2)';
            existingRedacted.style.padding = '15px';
            
            // Play glitch effect
            glitchEffect();
            playGlitchSound();
        }
    }
    
    function revealAllHiddenContent() {
        // Reveal content in all sections
        revealHiddenContent('project');
        revealHiddenContent('members');
        revealForumContent();
        revealMoreProjectContent();
        
        // Unlock all locked items
        document.querySelectorAll('.locked').forEach(item => {
            item.classList.remove('locked');
        });
        
        // Reveal all hidden messages
        document.querySelectorAll('.hidden-message').forEach(message => {
            message.style.opacity = '1';
            message.style.height = 'auto';
        });
        
        // Replace redacted content
        document.querySelectorAll('.redacted').forEach(redacted => {
            redacted.classList.remove('redacted');
            redacted.textContent = 'The Audience exists between reflections. They watch through every mirror, every screen, every reflective surface. Their realm overlaps with ours wherever light bounces back upon itself. The Final Performance created a permanent doorway, allowing them limited access to our world. They can wear us like masks now, stepping into our reality at will. The disappearances continue to this day.';
            redacted.style.color = '#00ff00';
        });
        
        // Add an easter egg - 11/11/2025 countdown
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            const countdownDiv = document.createElement('p');
            countdownDiv.innerHTML = 'NEXT CYCLE: <span id="next-cycle-countdown"></span>';
            countdownDiv.style.color = '#ff0000';
            footerContent.appendChild(countdownDiv);
            
            // Update countdown
            updateNextCycleCountdown();
            setInterval(updateNextCycleCountdown, 1000);
        }
    }
    
    function updateNextCycleCountdown() {
        const countdownElement = document.getElementById('next-cycle-countdown');
        if (!countdownElement) return;
        
        // Calculate time until November 11, 2025
        const targetDate = new Date('2025-11-11T23:24:00');
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            countdownElement.textContent = 'THE AUDIENCE HAS RETURNED';
        } else {
            // Calculate days, hours, minutes, seconds
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            countdownElement.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;
        }
    }
    
    // Original Functions
    function updateVisitorCounter() {
        visitorCount++;
        localStorage.setItem('visitorCount', visitorCount);
        visitorCounter.textContent = String(visitorCount).padStart(7, '0');
    }
    
    function updateCounter() {
        const currentCount = parseInt(visitorCounter.textContent);
        visitorCounter.textContent = String(currentCount + 1).padStart(7, '0');
    }
    
    function glitchEffect() {
        document.querySelector('.glitch-overlay').style.opacity = '0.3';
        setTimeout(() => {
            document.querySelector('.glitch-overlay').style.opacity = '0';
        }, 200);
        playGlitchSound();
    }
    
    function randomGlitch() {
        if (Math.random() > 0.7) {
            const elements = document.querySelectorAll('h1, h2, h3, p, a');
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            
            randomElement.classList.add('glitch-effect');
            setTimeout(() => {
                randomElement.classList.remove('glitch-effect');
            }, 300);
            
            if (Math.random() > 0.5) {
                playGlitchSound();
            }
        }
    }
    
    function playGlitchSound() {
        glitchSound.currentTime = 0;
        glitchSound.play();
    }
    
    function unlockContent() {
        // Unlock all locked elements
        document.querySelectorAll('.locked, .archive-lock, .locked-page, .locked-thread, .locked-entry').forEach(item => {
            item.style.display = 'none';
        });
        
        document.querySelectorAll('.locked-text').forEach(item => {
            item.textContent = '[DATA EXPUNGED]';
            item.classList.remove('locked-text');
        });
        
        document.querySelectorAll('.redacted').forEach(item => {
            item.textContent = '[CLASSIFIED CONTENT - LEVEL 4 CLEARANCE REQUIRED]';
        });
    }
    
    function showHiddenMessage() {
        hiddenMessage.style.opacity = '1';
        hiddenMessage.style.height = 'auto';
    }
    
    function showStatic() {
        // Create static effect
        const staticCtx = videoCanvas.getContext('2d');
        const width = videoCanvas.width;
        const height = videoCanvas.height;
        const imageData = staticCtx.createImageData(width, height);
        
        for (let i = 0; i < imageData.data.length; i += 4) {
            const value = Math.random() > 0.5 ? 255 : 0;
            imageData.data[i] = value;     // R
            imageData.data[i + 1] = value; // G
            imageData.data[i + 2] = value; // B
            imageData.data[i + 3] = 255;   // A
        }
        
        staticCtx.putImageData(imageData, 0, 0);
    }
    
    function simulateVideoPlayback() {
        if (!isPlaying) return;
        
        const width = videoCanvas.width;
        const height = videoCanvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw random noise (base layer)
        for (let i = 0; i < width * height / 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 3;
            const brightness = Math.floor(Math.random() * 155) + 100;
            
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(x, y, size, size);
        }
        
        // Occasionally show a face or distorted image
        if (Math.random() > 0.9) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, width, height);
            
            ctx.font = '20px Courier New';
            ctx.fillStyle = '#ff0000';
            ctx.textAlign = 'center';
            
            if (currentVideo === 'lumen_project_7') {
                ctx.fillText('LUMEN_PROJECT_7.mov - WARNING:', width/2, height/2 - 30);
                ctx.fillText('VISUAL ANOMALIES DETECTED', width/2, height/2);
                
                // Add subtle faces in the static
                if (Math.random() > 0.7) {
                    ctx.beginPath();
                    ctx.arc(width/2, height/2 + 50, 30, 0, Math.PI * 2);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.stroke();
                    
                    // Eyes
                    ctx.beginPath();
                    ctx.arc(width/2 - 10, height/2 + 40, 5, 0, Math.PI * 2);
                    ctx.arc(width/2 + 10, height/2 + 40, 5, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    ctx.fill();
                    
                    // Mouth
                    ctx.beginPath();
                    ctx.arc(width/2, height/2 + 60, 10, 0, Math.PI);
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                    ctx.stroke();
                }
            } else if (currentVideo === 'silverlight_exp12') {
                ctx.fillText('SL-EXPERIMENT_12.avi - CAUTION:', width/2, height/2 - 30);
                ctx.fillText('THRESHOLD SEQUENCE DETECTED', width/2, height/2);
                
                // Add a subliminal message occasionally
                if (Math.random() > 0.8) {
                    ctx.font = '14px Courier New';
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
                    ctx.fillText('THE AUDIENCE IS WATCHING', width/2, height/2 + 50);
                }
            } else if (currentVideo === 'final_performance') {
                ctx.fillText('FINAL_PERFORMANCE.mpg - DANGER:', width/2, height/2 - 30);
                ctx.fillText('REALITY BREACH IMMINENT', width/2, height/2);
                
                // Show audience silhouettes
                if (Math.random() > 0.6) {
                    // Draw silhouette figures
                    for (let i = 0; i < 5; i++) {
                        const figureX = Math.random() * width;
                        const figureHeight = 50 + Math.random() * 50;
                        
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                        // Head
                        ctx.beginPath();
                        ctx.arc(figureX, height - figureHeight - 20, 10, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Body
                        ctx.fillRect(figureX - 5, height - figureHeight, 10, figureHeight);
                    }
                    
                    ctx.font = '16px Courier New';
                    ctx.fillStyle = '#00ff00';
                    ctx.fillText('THEY ARE COMING THROUGH', width/2, height - 20);
                }
            }
        }
        
        // Add glitch lines
        if (Math.random() > 0.7) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(0, Math.random() * height, width, 1 + Math.random() * 3);
        }
        
        // Continue the animation loop
        requestAnimationFrame(() => simulateVideoPlayback());
    }
});