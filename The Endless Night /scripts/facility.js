// Facility JavaScript for The Endless Night ARG

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const files = document.querySelectorAll('.file');
    const fileContents = document.querySelectorAll('.file-content');
    const rooms = document.querySelectorAll('.room');
    const executeEclipse = document.getElementById('execute-eclipse');
    const confirmationCode = document.querySelector('.confirmation-code');
    const confirmEclipse = document.getElementById('confirm-eclipse');
    const timelinePassword = document.getElementById('timeline-password');
    const timelineSubmit = document.getElementById('timeline-submit');
    const echoForm = document.getElementById('echo-form');
    const echoInput = document.getElementById('echo-input');
    const terminalOutput = document.querySelector('.terminal-output');
    const facilityTime = document.getElementById('facility-time');
    const facilityAmbient = document.getElementById('facility-ambient');
    const terminalSound = document.getElementById('terminal-sound');
    const alertSound = document.getElementById('alert-sound');
    const glitchSound = document.getElementById('glitch-sound');
    const logEntries = document.querySelectorAll('.log-entry');
    const logFilter = document.getElementById('log-filter');
    
    // Record if user has seen intro message
    let hasSeenIntro = localStorage.getItem('facilityIntroSeen') === 'true';
    
    // Initialize ambient sound
    if (facilityAmbient) {
        facilityAmbient.volume = 0.3;
        
        // Only autoplay if user has explicitly allowed audio before
        if (localStorage.getItem('audioEnabled') === 'true') {
            facilityAmbient.play().catch(e => console.log('Audio autoplay prevented: ' + e));
        }
        
        // Add click event to body to enable audio (needs user interaction)
        document.body.addEventListener('click', function() {
            if (facilityAmbient.paused) {
                facilityAmbient.play().then(() => {
                    localStorage.setItem('audioEnabled', 'true');
                }).catch(e => console.log('Audio play failed: ' + e));
            }
        }, { once: true });
    }
    
    // Show intro message if first time
    if (!hasSeenIntro) {
        setTimeout(function() {
            playAlertSound();
            alert('WARNING: You have accessed a restricted government system. Unauthorized access is a federal offense. All activity is being monitored.');
            localStorage.setItem('facilityIntroSeen', 'true');
        }, 3000);
    }
    
    // Update the facility time
    updateFacilityTime();
    setInterval(updateFacilityTime, 10000);
    
    // Simplified tab switching functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            console.log('Tab clicked:', tabName); // Debug info
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected tab
            this.classList.add('active');
            const contentToActivate = document.getElementById(tabName);
            if (contentToActivate) {
                contentToActivate.classList.add('active');
                console.log('Activated content:', tabName); // Debug info
            } else {
                console.error('Tab content not found:', tabName); // Debug info
            }
            
            // Play terminal sound
            playTerminalSound();
        });
    });
    
    // File selection functionality
    files.forEach(file => {
        file.addEventListener('click', function() {
            // Skip if locked
            if (this.classList.contains('locked')) {
                playAlertSound();
                return;
            }
            
            const fileName = this.getAttribute('data-file');
            
            // Hide all file contents
            fileContents.forEach(content => {
                content.classList.add('hidden');
            });
            
            // Show selected file content
            const contentToShow = document.getElementById(fileName + '-content');
            if (contentToShow) {
                contentToShow.classList.remove('hidden');
                playTerminalSound();
            }
        });
    });
    
    // Room hover functionality
    rooms.forEach(room => {
        room.addEventListener('mouseenter', function() {
            const roomName = this.getAttribute('data-room');
            showRoomInfo(roomName);
        });
        
        room.addEventListener('mouseleave', function() {
            hideRoomInfo();
        });
        
        room.addEventListener('click', function() {
            const roomName = this.getAttribute('data-room');
            
            if (roomName === 'CRYO') {
                playGlitchSound();
                showCryoMessage();
            } else if (roomName === 'CONTROL') {
                // Switch to overview tab
                showTab('overview');
            } else if (roomName === 'SERVER') {
                // Switch to logs tab
                showTab('logs');
            } else {
                playTerminalSound();
            }
        });
    });
    
    // ECLIPSE Protocol buttons
    if (executeEclipse) {
        executeEclipse.addEventListener('click', function() {
            playAlertSound();
            if (confirmationCode) {
                confirmationCode.classList.remove('hidden');
            }
        });
    }
    
    if (confirmEclipse) {
        confirmEclipse.addEventListener('click', function() {
            const code = document.getElementById('confirmation-code').value.trim().toUpperCase();
            
            if (code === 'SUBJECT ZERO' || code === 'SUBJECTZERO') {
                // Trigger ending sequence
                triggerEclipseEnding();
            } else {
                playAlertSound();
                alert('INVALID AUTHORIZATION CODE. ECLIPSE PROTOCOL ABORTED.');
            }
        });
    }
    
    // Timeline password functionality
    if (timelineSubmit) {
        timelineSubmit.addEventListener('click', function() {
            checkTimelinePassword();
        });
    }
    
    if (timelinePassword) {
        timelinePassword.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                checkTimelinePassword();
            }
        });
    }
    
    // ECHO terminal functionality
    if (echoForm) {
        echoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const command = echoInput.value.trim().toUpperCase();
            echoInput.value = '';
            
            // Add command to terminal output
            addToTerminal('> ' + command);
            
            // Process command
            processEchoCommand(command);
        });
    }
    
    // Log filter functionality
    if (logFilter) {
        logFilter.addEventListener('change', function() {
            const filterValue = this.value;
            
            logEntries.forEach(entry => {
                const entryType = entry.getAttribute('data-type');
                
                if (filterValue === 'all' || entryType === filterValue) {
                    entry.style.display = 'block';
                } else {
                    entry.style.display = 'none';
                }
            });
            
            playTerminalSound();
        });
    }
    
    // Process ECHO terminal command
    function processEchoCommand(command) {
        playTerminalSound();
        
        // Add a slight delay for effect
        setTimeout(() => {
            // Process different commands
            switch (command) {
                case 'HELP':
                    addToTerminal('ECHO: Available commands:');
                    addToTerminal('      STATUS - Check system status');
                    addToTerminal('      SCAN - Scan surroundings');
                    addToTerminal('      WHAT HAPPENED - Request incident info');
                    addToTerminal('      WHO AM I - Identity confirmation');
                    addToTerminal('      ECLIPSE - ECLIPSE Protocol info');
                    break;
                    
                case 'STATUS':
                    addToTerminal('ECHO: Running system diagnostics...');
                    setTimeout(() => {
                        addToTerminal('      Power: Emergency generators active (27%)');
                        addToTerminal('      Network: Disconnected');
                        addToTerminal('      Security: Multiple breaches detected');
                        addToTerminal('      Temporal stability: CRITICAL (14% below safe threshold)');
                        addToTerminal('      Entity containment: FAILED');
                        playGlitchSound();
                        addToTerminal('      WARNING: Timeline collapse imminent. ECLIPSE Protocol recommended.', 'alert-text');
                    }, 1500);
                    break;
                    
                case 'SCAN':
                    addToTerminal('ECHO: Scanning facility...');
                    setTimeout(() => {
                        addToTerminal('      No life signs detected');
                        addToTerminal('      Dimensional anomalies detected in CRYO sector');
                        addToTerminal('      WARNING: You appear to be both present and absent from this facility.', 'corrupted-text');
                        
                        // Show hidden message briefly
                        setTimeout(() => {
                            playGlitchSound();
                            addToTerminal('      [CORRUPTED DATA RECOVERED]: Subject Zero is already in cryostasis.', 'hidden-text');
                            
                            setTimeout(() => {
                                const hiddenText = document.querySelector('.terminal-output .hidden-text');
                                if (hiddenText) {
                                    hiddenText.style.color = 'rgba(0, 255, 0, 0.1)';
                                }
                            }, 2000);
                        }, 2000);
                    }, 2000);
                    break;
                    
                case 'WHAT HAPPENED':
                    addToTerminal('ECHO: Accessing incident report...');
                    setTimeout(() => {
                        addToTerminal('      On June 22, 1993 at 02:17:00, a catastrophic breach occurred in the dimensional containment field.');
                        addToTerminal('      Project NIGHTFALL experienced a critical failure during routine timeline manipulation testing.');
                        addToTerminal('      The breach caused a temporal fracture that isolated Millfield from the primary timeline.');
                        
                        setTimeout(() => {
                            playGlitchSound();
                            addToTerminal('      WARNING: This information appears to be causing temporal instability.', 'alert-text');
                            addToTerminal('      The entities escaped containment and have been [REDACTED] the town residents.');
                            addToTerminal('      Only Subject Zero survived due to [REDACTED] properties.');
                            addToTerminal('      ECHO SYSTEM ERROR: TIMELINE CORRUPTION DETECTED', 'corrupted-text');
                        }, 3000);
                    }, 1500);
                    break;
                    
                case 'WHO AM I':
                    addToTerminal('ECHO: Running identity verification...');
                    setTimeout(() => {
                        playGlitchSound();
                        addToTerminal('      Identity confirmed: Christopher Manly');
                        addToTerminal('      Age: 17');
                        addToTerminal('      Status: Temporal anomaly / Subject Zero');
                        addToTerminal('      Note: You should not be here and here simultaneously.');
                        
                        setTimeout(() => {
                            addToTerminal('      PARADOX DETECTED: Your temporal signature exists in two locations.', 'alert-text');
                            addToTerminal('      According to records, you are currently in cryostasis in this facility.');
                            addToTerminal('      And yet you are also here, accessing this terminal.');
                            addToTerminal('      This temporal duplication may be the key to activating ECLIPSE Protocol.');
                        }, 2000);
                    }, 1500);
                    break;
                    
                case 'ECLIPSE':
                    addToTerminal('ECHO: ECLIPSE Protocol information...');
                    setTimeout(() => {
                        addToTerminal('      ECLIPSE Protocol was designed as a last resort measure in case of catastrophic dimensional breach.');
                        addToTerminal('      The protocol will reset the local timeline to a point prior to the breach.');
                        addToTerminal('      WARNING: Initiating the protocol will likely result in your removal from the timeline.', 'alert-text');
                        addToTerminal('      To activate ECLIPSE Protocol, access the file system and execute ECLIPSE_PROTOCOL.exe');
                        addToTerminal('      Authorization code required: "SUBJECT ZERO"');
                        
                        // Change to files tab and highlight Eclipse file
                        setTimeout(() => {
                            showTab('files');
                            highlightFile('eclipse');
                        }, 3000);
                    }, 1500);
                    break;
                    
                default:
                    // Random responses for other inputs
                    const responses = [
                        'ECHO: Command not recognized. Type "HELP" for available commands.',
                        'ECHO: Unable to process that request.',
                        'ECHO: System limitations prevent me from responding to that query.',
                        'ECHO: [ERROR] Response database corrupted for that input.',
                        'ECHO: That information is restricted.',
                        'ECHO: I cannot help with that. My systems are limited.'
                    ];
                    
                    // Randomly select a response
                    const response = responses[Math.floor(Math.random() * responses.length)];
                    addToTerminal(response);
                    
                    // Small chance of glitching out with a secret message
                    if (Math.random() > 0.8) {
                        setTimeout(() => {
                            playGlitchSound();
                            addToTerminal('ECHO: [SYSTEM OVERRIDE] You need to find yourself in the cryo chamber.', 'time-loop-text');
                        }, 1000);
                    }
            }
        }, 500);
    }
    
    // Add text to the terminal output
    function addToTerminal(text, className = '') {
        const line = document.createElement('p');
        line.textContent = text;
        
        if (className) {
            line.className = className;
        }
        
        if (terminalOutput) {
            terminalOutput.appendChild(line);
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }
    
    // Show room information
    function showRoomInfo(roomName) {
        // Create or update info box
        let infoBox = document.querySelector('.room-info');
        if (!infoBox) {
            infoBox = document.createElement('div');
            infoBox.className = 'room-info';
            document.querySelector('.schematic-container').appendChild(infoBox);
        }
        
        // Add content based on room
        let content = '';
        switch (roomName) {
            case 'LAB A':
                content = '<h3>LABORATORY A</h3><p>Primary research area for dimensional anchoring experiments.</p><p>Status: Contaminated</p>';
                break;
            case 'LAB B':
                content = '<h3>LABORATORY B</h3><p>Secondary research area for timeline manipulation.</p><p>Status: Contaminated</p>';
                break;
            case 'CONTAINMENT':
                content = '<h3>CONTAINMENT CHAMBER</h3><p>Entity holding facility. All specimens have escaped.</p><p>Status: BREACH</p>';
                break;
            case 'CONTROL':
                content = '<h3>CONTROL ROOM</h3><p>Main facility operations center.</p><p>Status: Emergency Power Only</p>';
                break;
            case 'STORAGE':
                content = '<h3>STORAGE</h3><p>Supply area with food, equipment, and emergency supplies.</p><p>Note: MREs have unusual expiration dates (2015-2025)</p>';
                break;
            case 'SERVER':
                content = '<h3>SERVER ROOM</h3><p>Data storage and processing center.</p><p>Most systems offline. ECHO AI still operational.</p>';
                break;
            case 'QUARTERS':
                content = '<h3>PERSONNEL QUARTERS</h3><p>Living spaces for facility staff.</p><p>All personnel missing. Personal effects still present.</p>';
                break;
            case 'CRYO':
                content = '<h3>CRYOSTASIS CHAMBER</h3><p>Long-term subject preservation.</p><p class="alert-text">WARNING: Active stasis pod detected.</p><p>Subject ID: MANLY_C</p>';
                break;
            default:
                content = '<h3>' + roomName + '</h3><p>No additional information available.</p>';
        }
        
        infoBox.innerHTML = content;
        infoBox.style.display = 'block';
    }
    
    // Hide room info
    function hideRoomInfo() {
        const infoBox = document.querySelector('.room-info');
        if (infoBox) {
            infoBox.style.display = 'none';
        }
    }
    
    // Show cryostasis message
    function showCryoMessage() {
        const message = 'WARNING: Approaching your own stasis pod may cause a temporal paradox. The system detects that you are both here and in cryostasis simultaneously. This contradiction could be leveraged to activate the ECLIPSE Protocol and reset the timeline.';
        
        playAlertSound();
        alert(message);
        
        // Switch to files tab and highlight Eclipse file
        showTab('files');
        highlightFile('eclipse');
    }
    
    // Check timeline password
    function checkTimelinePassword() {
        const password = timelinePassword.value.trim().toUpperCase();
        
        if (password === 'DIRECTOR' || password === 'REYNOLDS') {
            // Reveal timeline content
            const timelineContent = document.getElementById('timeline-content');
            if (timelineContent) {
                timelineContent.innerHTML = `
                    <h3>TIMELINE PREDICTIONS</h3>
                    <div class="document-text">
                        <p class="alert-text">TOP SECRET - DIRECTOR EYES ONLY</p>
                        <p>Based on our calculations, the timeline breach that occurred on June 22, 1993 was always going to happen.</p>
                        <p>In fact, it appears that it has already happened multiple times.</p>
                        <p>Evidence suggests that Christopher Manly (Subject Zero) has been caught in a temporal loop, repeatedly experiencing the same 14-day period after the breach.</p>
                        <p>Each iteration ends with his arrival at this facility, where he discovers his other self in cryostasis - a paradox that should be impossible.</p>
                        <p>We believe this paradox is the key to breaking the loop and restoring the timeline.</p>
                        <p>Recommended action: Guide Subject Zero to activate the ECLIPSE Protocol.</p>
                        <p class="corrupted-text">Note: Our analysis suggests we ourselves may be part of this loop, with our memories reset each time. This may be iteration #47.</p>
                    </div>
                `;
                
                playGlitchSound();
            }
        } else {
            playAlertSound();
            alert('ACCESS DENIED: INVALID CREDENTIALS');
        }
    }
    
    // Trigger ECLIPSE ending sequence
    function triggerEclipseEnding() {
        // First, create a full-screen overlay
        const endingOverlay = document.createElement('div');
        endingOverlay.className = 'ending-overlay';
        document.body.appendChild(endingOverlay);
        
        // Play glitch sound
        playGlitchSound();
        
        // Sequence of messages
        const messages = [
            'INITIATING ECLIPSE PROTOCOL...',
            'TEMPORAL RESET SEQUENCE ACTIVATED',
            'PREPARING TO REVERT TIMELINE TO JUNE 21, 1993',
            'WARNING: SUBJECT ZERO WILL BE REMOVED FROM TIMELINE',
            'TIMELINE STABILIZATION IN PROGRESS...',
            '3...',
            '2...',
            '1...',
            'GOODBYE, CHRISTOPHER'
        ];
        
        // Display messages in sequence
        let messageIndex = 0;
        
        function showNextMessage() {
            if (messageIndex < messages.length) {
                const messageElement = document.createElement('div');
                messageElement.className = 'ending-message';
                messageElement.textContent = messages[messageIndex];
                endingOverlay.appendChild(messageElement);
                
                // Play sound for each message
                if (messageIndex < messages.length - 1) {
                    playTerminalSound();
                } else {
                    playGlitchSound();
                }
                
                messageIndex++;
                setTimeout(showNextMessage, 3000);
            } else {
                // Final white flash and reset
                setTimeout(() => {
                    endingOverlay.style.backgroundColor = '#fff';
                    
                    // Reset localStorage values
                    localStorage.removeItem('endlessNightDay');
                    localStorage.removeItem('facilityUnlocked');
                    localStorage.removeItem('facilityIntroSeen');
                    
                    // Redirect to index after flash
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 2000);
                }, 2000);
            }
        }
        
        // Start the sequence
        showNextMessage();
    }
    
    // Show a specific tab
    function showTab(tabName) {
        // Find the tab and click it
        const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        if (tab) {
            tab.click();
        }
    }
    
    // Highlight a specific file
    function highlightFile(fileName) {
        const file = document.querySelector(`.file[data-file="${fileName}"]`);
        if (file) {
            file.style.boxShadow = '0 0 15px rgba(0, 204, 255, 0.7)';
            
            setTimeout(() => {
                file.style.boxShadow = 'none';
            }, 5000);
        }
    }
    
    // Update facility time display
    function updateFacilityTime() {
        if (facilityTime) {
            const playerDay = parseInt(localStorage.getItem('endlessNightDay')) || 1;
            const baseDate = new Date('1993-06-22T02:17:00');
            baseDate.setDate(baseDate.getDate() + (playerDay - 1));
            
            // For the facility, time is not fixed at 2:17
            const randomHour = Math.floor(Math.random() * 24);
            const randomMinute = Math.floor(Math.random() * 60);
            const randomSecond = Math.floor(Math.random() * 60);
            
            // Format with question marks to indicate time instability
            const formattedDate = `07/05/1993 ${randomHour.toString().padStart(2, '?')}:${randomMinute.toString().padStart(2, '?')}:${randomSecond.toString().padStart(2, '?')}`;
            facilityTime.textContent = formattedDate;
        }
    }
    
    // Sound functions
    function playTerminalSound() {
        if (terminalSound) {
            terminalSound.volume = 0.2;
            terminalSound.currentTime = 0;
            terminalSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    function playAlertSound() {
        if (alertSound) {
            alertSound.volume = 0.3;
            alertSound.currentTime = 0;
            alertSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    function playGlitchSound() {
        if (glitchSound) {
            glitchSound.volume = 0.3;
            glitchSound.currentTime = 0;
            glitchSound.play().catch(e => console.log('Sound play failed: ' + e));
        }
    }
    
    // Set up random glitches and effects
    setInterval(function() {
        if (Math.random() > 0.95) {
            // Random screen glitch
            const screenGlitch = document.querySelector('.screen-glitch');
            if (screenGlitch) {
                screenGlitch.style.opacity = '0.3';
                setTimeout(() => {
                    screenGlitch.style.opacity = '0.02';
                }, 200);
            }
            
            // Random text glitch in a terminal or document
            const textElements = document.querySelectorAll('.terminal-output p, .document-text p');
            if (textElements.length > 0) {
                const randomText = textElements[Math.floor(Math.random() * textElements.length)];
                randomText.classList.add('corrupted-text');
                
                setTimeout(() => {
                    randomText.classList.remove('corrupted-text');
                }, 1000);
                
                // Small chance to play a sound
                if (Math.random() > 0.7) {
                    playGlitchSound();
                }
            }
        }
    }, 20000);
    
    // Add CSS for ending sequence
    const style = document.createElement('style');
    style.textContent = `
        .ending-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            transition: background-color 2s ease;
        }
        
        .ending-message {
            color: #00ccff;
            font-size: 32px;
            margin: 20px;
            text-align: center;
            animation: fadeIn 2s forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .room-info {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 17, 34, 0.9);
            border: 1px solid #00aaee;
            padding: 10px;
            width: 250px;
            z-index: 100;
            display: none;
        }
        
        .room-info h3 {
            color: #00ccff;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .room-info p {
            font-size: 14px;
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(style);
    
    // Add a direct function to force show tabs (for debugging)
    window.forceShowTab = function(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab
        const tabToShow = document.getElementById(tabName);
        if (tabToShow) {
            console.log("Forcing show tab:", tabName);
            tabToShow.classList.add('active');
            
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
                if (t.getAttribute('data-tab') === tabName) {
                    t.classList.add('active');
                }
            });
            
            return true;
        }
        console.error("Tab not found:", tabName);
        return false;
    }
});