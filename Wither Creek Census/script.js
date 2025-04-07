document.addEventListener('DOMContentLoaded', () => {
    // --- Global DOM References ---
    const startButton = document.getElementById('start-button');
    const titleScreen = document.querySelector('.title-screen');
    const gameScreen = document.getElementById('game-screen');
    const dialogueBox = document.querySelector('.dialogue-box');
    const dialogueText = document.getElementById('dialogue-text');
    const typewriterSound = document.getElementById('typewriter-sound');
    const titleMusic = document.getElementById('title-music');
    const ambientSound = document.getElementById('ambient-sound');
    const powerOnSound = document.getElementById('power-on-sound');
    const noiseOverlay = document.querySelector('.noise-overlay');
    const glitchContainer = document.querySelector('.glitch-container');
    const crtScreen = document.getElementById('crt-screen');

    // --- Control Panel References ---
    const powerButton = document.getElementById('power-button');
    const saveButton = document.getElementById('save-button');
    const loadButton = document.getElementById('load-button');
    const logsButton = document.getElementById('logs-button');

    // --- Logs Screen References ---
    const logsScreen = document.getElementById('logs-screen');
    const logsContent = document.querySelector('.logs-content');
    const closeLogsButton = document.getElementById('close-logs');

    // --- Save/Load Screen References ---
    const saveLoadScreen = document.getElementById('save-load-screen');
    const saveLoadTitle = document.getElementById('save-load-title');
    const closeSaveLoadButton = document.getElementById('close-save-load');
    const saveSlots = document.querySelectorAll('.save-slot');

    // --- Game State Management ---
    let gameState = {
        currentScene: null,
        currentDialogueIndex: 0,
        allDialogueHistory: [], // Stores all dialogue for logs
        saveSlots: [
            { empty: true, details: "Empty" },
            { empty: true, details: "Empty" },
            { empty: true, details: "Empty" }
        ]
    };

    // --- Audio Initialization ---
    function initializeAudio() {
        // Set up ambient sound (ominous drone) to play on the title screen
        if (ambientSound) {
            ambientSound.volume = 0.5; // Set volume to 50% (adjust as needed)
            
            // Modern browsers require user interaction before playing audio
            document.addEventListener('click', function startAmbient() {
                ambientSound.play().catch(e => console.log("Audio playback failed:", e));
                document.removeEventListener('click', startAmbient);
            }, { once: true });
        }
        
        // Set up title music volume (but don't play it yet)
        if (titleMusic) {
            titleMusic.volume = 0.7; // Set volume to 70% (adjust as needed)
        }
    }

    // --- Dialogue & State Management ---
    const TYPEWRITER_DELAY = 40; // Milliseconds between characters (adjust for speed)
    let isTyping = false;          // Is text currently being typed out?
    let typewriterTimeout = null;  // Holds the ID for the typewriter timeout
    let currentDialogueLines = []; // Array of lines for the current dialogue sequence
    let currentDialogueIndex = 0;  // Index of the line currently being shown/typed
    let currentFullLine = "";      // The full text of the line being typed
    let currentDialogueCallback = null; // Function to call when the entire sequence is finished

    // --- Typewriter Effect Function ---
    function typeWriter(text, charIndex = 0) {
        if (!dialogueText) {
            console.error("Dialogue text element not found!");
            return;
        }
        
        // First character - play sound to indicate start of typing
        if (charIndex === 0 && typewriterSound) {
            typewriterSound.currentTime = 0;
            typewriterSound.loop = true;
            typewriterSound.play().catch(e => console.error("Failed to play typewriter sound:", e));
        }
        
        // End of text - stop typing and sound
        if (charIndex >= text.length) {
            isTyping = false; // Finished typing this line
            clearTimeout(typewriterTimeout);
            // Stop the typewriter sound when done typing
            if (typewriterSound) {
                typewriterSound.loop = false;
                typewriterSound.pause();
                typewriterSound.currentTime = 0;
            }
            return;
        }

        isTyping = true;

        // Append next character
        dialogueText.textContent += text[charIndex];

        // Schedule next character
        typewriterTimeout = setTimeout(() => {
            typeWriter(text, charIndex + 1);
        }, TYPEWRITER_DELAY);
    }

    // --- Function to display dialogue lines sequentially ---
    function showDialogue(lines, callback) {
        if (!dialogueBox || !dialogueText) {
            console.error("Dialogue box or text element not found!");
            return;
        }
        dialogueBox.style.display = 'block'; // Make sure box is visible
        currentDialogueLines = lines;
        currentDialogueIndex = 0;
        currentDialogueCallback = callback; // Store the final callback
        displayNextLine(); // Start the first line
    }

    // --- Function to display the next line or finish ---
    function displayNextLine() {
        clearTimeout(typewriterTimeout); // Clear any previous timeout
        isTyping = false;

        if (currentDialogueIndex < currentDialogueLines.length) {
            currentFullLine = currentDialogueLines[currentDialogueIndex];
            dialogueText.textContent = ''; // Clear previous text
            typeWriter(currentFullLine); // Start typing the new line
            
            // Add to dialogue history for logs
            gameState.allDialogueHistory.push(currentFullLine);
            
            currentDialogueIndex++;
        } else {
            // No more lines in this sequence
            if (currentDialogueCallback) {
                const callbackToExecute = currentDialogueCallback; // Store before clearing
                currentDialogueCallback = null; // Clear callback before executing
                currentDialogueLines = [];      // Clear lines
                currentDialogueIndex = 0;
                callbackToExecute(); // Execute the stored final callback
            }
        }
    }

    // --- Input Handler (LMB Click / Spacebar) ---
    function handleAdvanceInput(event) {
        // Prevent advancing if the click was on the start button still somehow visible
        if (event && event.target === startButton) return;
        
        // If any utility screens are visible, ignore input
        if (logsScreen.style.display === 'flex' || saveLoadScreen.style.display === 'flex') {
            return;
        }

        // If dialogue is active (box is visible and has lines queued or is typing)
        if (dialogueBox.style.display === 'block' && (currentDialogueLines.length > 0 || isTyping)) {
            if (isTyping) {
                // --- SKIP TYPEWRITER ---
                clearTimeout(typewriterTimeout);
                isTyping = false;
                dialogueText.textContent = currentFullLine; // Show full line immediately
                
                // Make sure typewriter sound stops when skipping
                if (typewriterSound) {
                    typewriterSound.loop = false;
                    typewriterSound.pause();
                    typewriterSound.currentTime = 0;
                }
            } else {
                // --- ADVANCE TO NEXT LINE/CALLBACK ---
                // Check if there *was* a line being displayed (index > 0) before advancing
                if(currentDialogueIndex > 0) {
                    displayNextLine();
                }
            }
        }
    }

    // --- Global Event Listeners for Advancing ---
    if (gameScreen) {
        gameScreen.addEventListener('click', handleAdvanceInput);
    } else {
        console.error("Game screen element not found for click listener!");
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            // Only handle space if the game screen is visible
            if (gameScreen && gameScreen.classList.contains('visible')) {
                 e.preventDefault(); // Prevent spacebar from scrolling the page
                 handleAdvanceInput();
            }
        }
    });

    // --- Scene Management ---
    function activateScene(sceneElement) {
        // Save current scene to gameState
        gameState.currentScene = sceneElement.id;
        
        // Hide all scenes first
        document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
        // Show the target scene
        if (sceneElement) {
            sceneElement.classList.add('active');
        } else {
            console.error("Attempted to activate a null scene element!");
        }
    }

    function startScene1() {
        console.log("Loading Scene 1: Arrival...");
        // Get scene element directly to ensure it's found
        const sceneElement = document.getElementById('scene-1');
        if (!sceneElement) {
            console.error("Scene 1 element not found!");
            return;
        }
        
        activateScene(sceneElement);
        gameScreen.classList.add('visible'); // Make game screen visible *before* dialogue

        const scene1Dialogue = [
            "***Radio crackles with strange patterned static before suddenly clearing***",
            "Control (Over Radio): Agent Reed, confirm approach to designated location. We have clear skies on satellite imagery.",
            "***Brief burst of static interrupts***",
            "Control (Over Radio): Remember your primary directive: Verify census anomalies and locate Agent Chaney. His last transmission was... concerning.",
            "***Static pulses in a rhythmic pattern***",
            "Control (Over Radio): Maintain radio contact only when necessary. We've been experiencing... interference... in that region.",
            "***Long pause***",
            "Control (Over Radio): And Reed? If you encounter anything outside standard parameters, document thoroughly. Control out.",
            "***Static returns briefly before fading to silence***"
        ];

        showDialogue(scene1Dialogue, () => {
            console.log("Scene 1 Dialogue Complete. Transitioning to Scene 2.");
            startScene2();
        });
    }

    function startScene2() {
        console.log("Loading Scene 2: Arrival Sign...");
        // Get scene element directly to ensure it's found
        const sceneElement = document.getElementById('scene-2');
        if (!sceneElement) {
            console.error("Scene 2 element not found!");
            return;
        }
        
        activateScene(sceneElement);

        const scene2Dialogue = [
            "***Glances at the approaching town sign through the windshield***",
            "That must be it. Wither Creek.",
            "***Slows vehicle***",
            "The file said 'fluctuating census data' but this... this feels wrong already.",
            "***Wind whispers faintly through barely-open window***",
            "It's so... quiet. Like the world is holding its breath.",
            "***Shivers despite the mild temperature***",
            "***Drives slowly past the town sign, tires crunching on gravel***",
            "Complete stillness. Not just quiet... empty.",
            "***Wind chime tinkles faintly in the distance, the only sound***"
        ];

        showDialogue(scene2Dialogue, () => {
            console.log("Scene 2 Dialogue Complete. Transitioning to Scene 3.");
            startScene3();
        });
    }

    function startScene3() {
        console.log("Loading Scene 3: Main Street...");
        activateScene(document.getElementById('scene-3'));

        const scene3Dialogue = [
            "Where is everyone? Population sign said 3012...",
            "***Car headlights sweep across vacant storefronts***",
            "Main Street. Classic small-town America, frozen in time.",
            "***Stops car, turns off engine***",
            "Wait—what's that?",
            "***Focuses on playground in the distance***",
            "That swing... it's moving. Perfect rhythm. Back and forth."
        ];

        showDialogue(scene3Dialogue, () => {
            console.log("Scene 3 Dialogue Complete. Transitioning to Scene 4.");
            startScene4();
        });
    }

    function startScene4() {
        console.log("Loading Scene 4: Sensory Detail");
        activateScene(document.getElementById('scene-4'));

        const scene4Dialogue = [
            "***Squints through windshield***",
            "No children. No wind either. Just... moving. Like a metronome.",
            "***Hair stands up on back of neck***",
            "Someone's watching. I can feel it.",
            "That smell... what is that?",
            "Damp earth, definitely... and something electrical? Like ozone.",
            "But there's something else underneath. Something sweet, almost floral, but... off.",
            "Like flowers rotting in stagnant water.",
            "***Inhales deeply***",
            "It's faint but... it's everywhere. Part of this place somehow.",
            "Strange... I don't see any obvious source.",
            "***Scribbles note in field journal:***",
            "'Investigate unusual ambient odor - possible environmental anomaly?'"
        ];

        showDialogue(scene4Dialogue, () => {
            console.log("Scene 4 Dialogue Complete. Transitioning to Scene 5.");
            startScene5();
        });
    }

    function startScene5() {
        console.log("Loading Scene 5: Shadow Play");
        activateScene(document.getElementById('scene-5'));

        const scene5Dialogue = [
            "*Driving slowly down Main Street*",
            "Wait—what was that?",
            "*Stops abruptly, looking up at second-story window*",
            "Movement. Upper window of that Victorian. Someone watching?",
            "*Shields eyes from glare*",
            "Hello? Anyone there?",
            "*Silence*",
            "I swear I saw a shadow moving behind that curtain...",
            "*Continues staring at window*",
            "Gone now. If it was ever there.",
            "*Rubs eyes*",
            "Just tricks of the light? Or...",
            "*Makes note in field journal*",
            "First potential resident sighting. Unconfirmed.",
            "*Continuing slowly down Main Street*",
            "*A faint sound cuts through the car's engine noise*",
            "What was that?",
            "A laugh? A child's laugh?",
            "It came from that alley."
        ];

        showDialogue(scene5Dialogue, () => {
            console.log("Scene 5 Dialogue Complete. Transitioning to Scene 6.");
            startScene6();
        });
    }

    function startScene6() {
        console.log("Loading Scene 6: Auditory Glitch 1");
        activateScene(document.getElementById('scene-6'));

        const scene6Dialogue = [
            "Hello? Anyone there?",
            "*Nothing but absolute silence*",
            "*Footsteps echo as she approaches the alley entrance*",
            "*Peers down the dark passage*",
            "Empty. Completely empty.",
            "*Whispers to self*",
            "I know what I heard..."
        ];

        showDialogue(scene6Dialogue, () => {
            console.log("Scene 6 Dialogue Complete. Transitioning to Scene 7.");
            startScene7();
        });
    }

    function startScene7() {
        console.log("Loading Scene 7: Checking In...");
        activateScene(document.getElementById('scene-7'));

        const scene7Dialogue = [
            "Sheriff's office. First stop for any official business.",
            "***Gets out of car and tries door handle - locked***",
            "Locked tight. Middle of the day?",
            "***Peers through dusty window***",
            "Empty desk. Chair pushed back like someone left in a hurry.",
            "***Notices paper tacked to door***",
            "'Sheriff Harmon away on county business. For emergencies call...' And the rest is faded.",
            "***Runs finger along door frame, collecting dust***",
            "Thick layer of dust. This note's been here for weeks, not days.",
            "***Tries knocking firmly***",
            "***Silence***",
            "So who's policing Wither Creek? Anyone?",
            "***Makes note in field journal and gets back in the car***"
        ];

        showDialogue(scene7Dialogue, () => {
            console.log("Scene 7 Dialogue Complete. Transitioning to Scene 8.");
            startScene8();
        });
    }

    function startScene8() {
        console.log("Loading Scene 8: Checking Map");
        activateScene(document.getElementById('scene-8'));
    
        const scene8Dialogue = [
            "After driving one minute down the road, Reed pulls over",
            "This can't be right...",
            "***Unfolds official FBSAA map on the steering wheel***",
            "According to this, Wither Creek extends another half mile in each direction.",
            "***Looks up, scanning surroundings***",
            "But I can see the town limits from here. The whole place.",
            "***Traces finger along map boundaries***",
            "The scale is correct. Distances to neighboring towns check out.",
            "***Squints back at map***",
            "But Wither Creek itself... it's somehow smaller than it should be.",
            "***Makes notation on map***",
            "Either this map is wrong, or...",
            "...or the town itself is wrong."
        ];

        showDialogue(scene8Dialogue, () => {
            console.log("Scene 8 Dialogue Complete. Transitioning to Scene 9.");
            startScene9();
        });
    }

    function startScene9() {
        console.log("Loading Scene 9: General store");
        activateScene(document.getElementById('scene-9'));
    
        const scene9Dialogue = [
            "***Parks car across from the general store***",
            "'Abernathy's General Goods'... at least someone runs a business here.",
            "***Narrows eyes, studying the sign***",
            "Wait a minute...",
            "***Looks closer, head tilted***",
            "The way those letters have faded... it's not random weathering.",
            "***Traces shape in the air with finger***",
            "They form a pattern. Almost like... that symbol from the case file.",
            "***Examines peeling paint on storefront***",
            "Even the paint isn't peeling naturally. It's... curling into shapes.",
            "***Takes out camera***",
            "*Click*",
            "***Reviews digital image***",
            "Huh. Doesn't show up in the photo. Just looks like normal wear and tear."
        ];

        showDialogue(scene9Dialogue, () => {
            console.log("Scene 9 Dialogue Complete. Transitioning to Scene 10.");
            startScene10();
        });
    }

    function startScene10() {
        console.log("Loading Scene 10: General store interior");
        activateScene(document.getElementById('scene-10'));
    
        const scene10Dialogue = [
            "***Bell chimes softly as Stella pushes open the door***",
            "Hello? Anyone here?",
            "***Footsteps approach from back room***",
            "***An older man emerges, moving with slow, deliberately steps to the front counter***",
            "ABERNATHY: Afternoon. Abernathy's the name. Fine day for it.",
            "***His smile never reaches his eyes***",
            "Agent Reed, Federal Bureau. I'm conducting a census follow-up.",
            "***Abernathy stares blankly for three seconds too long***",
            "ABERNATHY: Census? Just had one of those. Few weeks back.",
            "***Begins polishing counter in slow, methodical circles***",
            "That would have been Agent Chaney. Have you seen him recently?",
            "***Polishing motion pauses fractionally, then resumes***",
            "ABERNATHY: Can't say I recall. Quiet town. Folk pass through.",
            "***Eyes drift toward Stella's radio, then back***",
            "ABERNATHY: Fine day for it.",
            "***Stella observes Abernathy as he continues polishing***",
            "***The circular motion never varies - same speed, same pressure***",
            "Do you have any bottled water? It's been a long drive.",
            "***His attention remains fixed on the exact spot he's polishing***",
            "ABERNATHY: Bottled water. Aisle three.",
            "***His eyes don't follow Stella as she moves, staying locked on middle distance***",
            "***His free hand twitches slightly, fingers moving in a pattern***",
            "***Stella's radio emits brief static burst***"
        ];

        showDialogue(scene10Dialogue, () => {
            console.log("Scene 10 Dialogue Complete. Transitioning to Scene 11.");
            startScene11();
        });
    }

    function startScene11() {
        console.log("Loading Scene 11: General store interior");
        activateScene(document.getElementById('scene-11'));
    
        const scene11Dialogue = [
            "***Abernathy's head tilts, listening, then resumes normal position***",
            "***His gaze shifts abruptly to her radio***",
            "ABERNATHY: Signal's not too good around here. Interference.",
            "***Resumes polishing the same spot, motion identical to before***",
            "***The cloth moves in perfect circles, like a programmed machine***",
            "***Stella browses the store shelves***",
            "***Standard items line the front shelves - canned goods, toiletries***"
        ];

        showDialogue(scene11Dialogue, () => {
            console.log("Scene 11 Dialogue Complete. Transitioning to Scene 12.");
            startScene12();
        });
    }

    function startScene12() {
        console.log("Loading Scene 12: Shelves");
        activateScene(document.getElementById('scene-12'));
    
        const scene12Dialogue = [
            "***Moving deeper into the store, products become... stranger***",
            "***Picks up a mason jar with murky liquid***",
            "No label. What is this supposed to be?",
            "***Liquid shifts unnaturally slowly when tilted***",
            "***Sets jar down carefully, moves to next shelf***",
            "***Finds row of small wooden carvings resembling the standing stone***",
            "***Each carving has the same symbols, meticulously detailed***",
            "***Runs finger along one carving, feels faint vibration***",
            "***Notices section of unlabeled canned goods, all identical***",
            "***Tests weight of one can - heavier than it should be***",
            "What exactly are these people buying?",
            "***Abernathy's voice calls from front counter, sounding suddenly closer***",
            "ABERNATHY: Finding everything you need, ma'am?"
        ];

        showDialogue(scene12Dialogue, scene12Callback);
    }

    // Define what happens AFTER the player advances past the last line in scene 11
    const scene12Callback = () => {
        console.log("Scene 12 finished, proceeding to next step.");
        dialogueBox.style.display = 'none'; // Hide the box after final advance
        
        // Trigger a subtle glitch effect as a story beat
        const glitchOverlay = document.querySelector('.noise-overlay');
        if (glitchOverlay) {
            glitchOverlay.style.opacity = '0.7';
            setTimeout(() => {
                glitchOverlay.style.opacity = '0';
                
                // Wait a moment after the glitch before proceeding
                setTimeout(() => {
                    // In the future, replace this with: startScene13();
                    alert("Transitioning to Scene 13: (Placeholder)");
                    // Define and call startScene13() when ready
                }, 500);
            }, 400);
        } else {
            alert("Transitioning to Scene 13: (Placeholder)");
        }
    };

    // --- Save/Load Functions ---
    function saveGame(slotIndex) {
        // Create a snapshot of the current game state
        const saveData = {
            currentScene: gameState.currentScene,
            dialogueHistory: gameState.allDialogueHistory,
            timestamp: new Date().toLocaleString()
        };
        
        // Store in the appropriate slot
        gameState.saveSlots[slotIndex] = {
            empty: false,
            details: `Scene: ${saveData.currentScene} - ${saveData.timestamp}`,
            data: saveData
        };
        
        // Save to localStorage
        localStorage.setItem('witherCreekSaves', JSON.stringify(gameState.saveSlots));
        
        // Update the save slot display
        updateSaveSlotDisplay();
        
        // Provide visual feedback
        const slot = document.querySelector(`.save-slot[data-slot="${slotIndex + 1}"]`);
        slot.style.backgroundColor = 'rgba(0, 100, 0, 0.5)';
        setTimeout(() => {
            slot.style.backgroundColor = '';
        }, 500);
    }
    
    function loadGame(slotIndex) {
        const saveData = gameState.saveSlots[slotIndex].data;
        if (!saveData) {
            console.error("No save data found in slot", slotIndex);
            return;
        }
        
        // Stop title music when loading a game
        if (titleMusic) {
            titleMusic.pause();
            titleMusic.currentTime = 0;
        }
        
        // Hide save/load screen
        saveLoadScreen.style.display = 'none';
        
        // Reset ALL dialogue state to ensure clean restart
        clearTimeout(typewriterTimeout);
        isTyping = false;
        currentDialogueLines = [];
        currentDialogueIndex = 0;
        currentDialogueCallback = null;
        dialogueBox.style.display = 'none';
        
        // Make sure the game screen is visible
        titleScreen.classList.add('hidden');
        gameScreen.classList.add('visible');
        
        // Extract scene number and directly call the appropriate scene function
        const sceneNumber = parseInt(saveData.currentScene.split('-')[1]);
        if (!isNaN(sceneNumber) && sceneNumber >= 1) {
            console.log(`Restarting scene ${sceneNumber} from beginning`);
            
            // Restore game state (but set currentDialogueIndex to 0)
            gameState.currentScene = saveData.currentScene;
            gameState.currentDialogueIndex = 0; 
            gameState.allDialogueHistory = saveData.dialogueHistory;
            
            // Use a switch statement to ensure we call the exact function
            switch(sceneNumber) {
                case 1:
                    startScene1();
                    break;
                case 2:
                    startScene2();
                    break;
                case 3:
                    startScene3();
                    break;
                case 4:
                    startScene4();
                    break;
                case 5:
                    startScene5();
                    break;
                case 6:
                    startScene6();
                    break;
                case 7:
                    startScene7();
                    break;
                case 8:
                    startScene8();
                    break;
                case 9:
                    startScene9();
                    break;
                case 10:
                    startScene10();
                    break;
                case 11:
                    startScene11();
                    break;
                default:
                    console.error(`Scene function for scene ${sceneNumber} not found`);
                    // Fallback - just activate the scene without dialogue
                    const sceneElement = document.getElementById(saveData.currentScene);
                    if (sceneElement) {
                        activateScene(sceneElement);
                    }
            }
        } else {
            console.error("Invalid scene ID format:", saveData.currentScene);
        }
    }
    
    function updateSaveSlotDisplay() {
        saveSlots.forEach((slot, index) => {
            const slotDetails = slot.querySelector('.slot-details');
            slotDetails.textContent = gameState.saveSlots[index].details;
        });
    }
    
    // --- Load saves from localStorage if they exist ---
    function loadSavedGames() {
        const savedGames = localStorage.getItem('witherCreekSaves');
        if (savedGames) {
            try {
                const parsedSaves = JSON.parse(savedGames);
                gameState.saveSlots = parsedSaves;
                updateSaveSlotDisplay();
            } catch (e) {
                console.error("Error parsing saved games:", e);
            }
        }
    }
    
    // --- Show Logs Function ---
    function showLogs() {
        // Clear previous content
        logsContent.innerHTML = '';
        
        // Add each dialogue line as a paragraph
        gameState.allDialogueHistory.forEach(line => {
            const p = document.createElement('p');
            p.textContent = line;
            logsContent.appendChild(p);
        });
        
        // Show logs screen
        logsScreen.style.display = 'flex';
    }
    
    // --- Event Listeners for Control Panel ---
    powerButton.addEventListener('click', () => {
        // Return to the title screen
        gameScreen.classList.remove('visible');
        titleScreen.classList.remove('hidden');
        titleScreen.style.opacity = '1';
        titleScreen.style.pointerEvents = 'auto';
        
        // Reset dialogue and hide any open screens
        dialogueBox.style.display = 'none';
        logsScreen.style.display = 'none';
        saveLoadScreen.style.display = 'none';
        
        // Stop any music that might be playing
        if (titleMusic) {
            titleMusic.pause();
            titleMusic.currentTime = 0;
        }
        
        // Play ambient drone sound when returning to title screen
        if (ambientSound) {
            ambientSound.currentTime = 0;
            ambientSound.play().catch(e => console.log("Audio playback failed:", e));
        }
    });
    
    saveButton.addEventListener('click', () => {
        // Only allow saving if game is active
        if (!gameScreen.classList.contains('visible')) return;
        
        saveLoadTitle.textContent = 'SAVE GAME';
        saveLoadScreen.style.display = 'flex';
        
        // Set click handlers for save mode
        saveSlots.forEach((slot, index) => {
            slot.onclick = () => saveGame(index);
        });
    });
    
    loadButton.addEventListener('click', () => {
        saveLoadTitle.textContent = 'LOAD GAME';
        saveLoadScreen.style.display = 'flex';
        
        // Set click handlers for load mode
        saveSlots.forEach((slot, index) => {
            if (!gameState.saveSlots[index].empty) {
                slot.onclick = () => loadGame(index);
                slot.style.cursor = 'pointer';
                slot.style.opacity = '1';
            } else {
                slot.onclick = null;
                slot.style.cursor = 'not-allowed';
                slot.style.opacity = '0.6';
            }
        });
    });
    
    logsButton.addEventListener('click', () => {
        // Only show logs if there's dialogue history
        if (gameState.allDialogueHistory.length > 0) {
            showLogs();
        }
    });
    
    // --- Close Button Listeners ---
    closeLogsButton.addEventListener('click', () => {
        logsScreen.style.display = 'none';
    });
    
    closeSaveLoadButton.addEventListener('click', () => {
        saveLoadScreen.style.display = 'none';
    });

    // --- Initial Setup ---
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log("Start button clicked!");
            
            // Stop ambient sound
            if (ambientSound) {
                ambientSound.pause();
                ambientSound.currentTime = 0;
            }
            
            // Play the title music when Start is pressed
            if (titleMusic) {
                titleMusic.currentTime = 0;
                titleMusic.play().catch(e => console.log("Title music playback failed:", e));
            }
            
            if (titleScreen) {
                titleScreen.style.opacity = '0';
                titleScreen.style.pointerEvents = 'none';
            }

            // Add CRT turn-on effect
            const crtScreen = document.getElementById('crt-screen');
            crtScreen.style.animation = 'crt-on 1s forwards';
            
            // Play CRT power on sound if available
            const powerOnSound = document.getElementById('power-on-sound');
            if (powerOnSound) {
                powerOnSound.play().catch(e => {});
            }

            setTimeout(() => {
                if (titleScreen) {
                    titleScreen.classList.add('hidden');
                }
                startScene1(); // Start the game sequence
            }, 1000); // Wait for CRT animation to complete
        });
    } else {
        console.error("Start button not found!");
    }
    
    // Load any saved games
    loadSavedGames();
    
    // Initialize audio
    initializeAudio();

    // --- Setup subtle UI glitch effects ---
    function triggerGlitch() {
        // Choose a random glitch effect (only static and minor color shift)
        const glitchType = Math.floor(Math.random() * 2);
        
        // Apply the selected glitch effect
        switch(glitchType) {
            case 0: // Minor color shift glitch
                crtScreen.style.animation = 'glitch-color 0.3s 1';
                setTimeout(() => {
                    crtScreen.style.animation = '';
                }, 300);
                break;
                
            case 1: // Static noise glitch
                noiseOverlay.style.opacity = '0.3';
                setTimeout(() => {
                    noiseOverlay.style.opacity = '0';
                }, 400);
                break;
        }
    }
    
    // Set up random glitch intervals (less frequent)
    function scheduleNextGlitch() {
        // Random interval between 15 and 45 seconds
        const nextGlitchTime = 15000 + Math.random() * 30000;
        
        setTimeout(() => {
            triggerGlitch();
            scheduleNextGlitch(); // Schedule the next glitch
        }, nextGlitchTime);
    }
    
    // Start the random glitch scheduling
    scheduleNextGlitch();

}); // End of DOMContentLoaded