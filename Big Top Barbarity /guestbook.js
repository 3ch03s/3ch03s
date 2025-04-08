// Function to open the guest book when "ETCH YOUR NAME IN BLOOD" is clicked
function openGuestBook() {
    // Create the popup overlay
    const overlay = document.createElement('div');
    overlay.id = 'guestbook-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    
    // Create the guest book container
    const guestBookContainer = document.createElement('div');
    guestBookContainer.id = 'guestbook-container';
    guestBookContainer.style.width = '80%';
    guestBookContainer.style.maxWidth = '600px';
    guestBookContainer.style.maxHeight = '80vh';
    guestBookContainer.style.backgroundColor = '#1a0000';
    guestBookContainer.style.border = '5px ridge #600';
    guestBookContainer.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.6)';
    guestBookContainer.style.padding = '20px';
    guestBookContainer.style.position = 'relative';
    guestBookContainer.style.overflow = 'hidden';
    
    // Create header
    const header = document.createElement('h2');
    header.innerHTML = 'DAMNATION BOOK';
    header.style.color = '#ff0000';
    header.style.fontFamily = 'Creepster, cursive';
    header.style.textAlign = 'center';
    header.style.margin = '0 0 20px 0';
    header.style.fontSize = '2.5em';
    header.style.textShadow = '0 0 10px rgba(255, 0, 0, 0.7)';
    
    // Create subtitle
    const subtitle = document.createElement('p');
    subtitle.innerHTML = 'Sign your name in blood... join the eternal audience';
    subtitle.style.color = '#ff9999';
    subtitle.style.textAlign = 'center';
    subtitle.style.marginBottom = '20px';
    subtitle.style.fontStyle = 'italic';
    
    // Create list container with scrolling
    const listContainer = document.createElement('div');
    listContainer.style.maxHeight = '250px';
    listContainer.style.overflowY = 'auto';
    listContainer.style.marginBottom = '20px';
    listContainer.style.padding = '10px';
    listContainer.style.border = '1px solid #600';
    listContainer.style.backgroundColor = '#0a0000';
    
    // Add scrollbar styling
    listContainer.style.scrollbarWidth = 'thin';
    listContainer.style.scrollbarColor = '#600 #0a0000';
    
    // List to hold the names
    const namesList = document.createElement('ul');
    namesList.id = 'guestbook-names';
    namesList.style.listStyleType = 'none';
    namesList.style.padding = '0';
    namesList.style.margin = '0';
    
    // Loading indicator
    const loadingMessage = document.createElement('li');
    loadingMessage.id = 'loading-message';
    loadingMessage.textContent = 'Summoning previous victims...';
    loadingMessage.style.color = '#ff6666';
    loadingMessage.style.textAlign = 'center';
    loadingMessage.style.padding = '10px';
    loadingMessage.style.fontStyle = 'italic';
    
    namesList.appendChild(loadingMessage);
    listContainer.appendChild(namesList);
    
    // Create form for new entries
    const formContainer = document.createElement('div');
    formContainer.style.display = 'flex';
    formContainer.style.flexDirection = 'column';
    formContainer.style.gap = '15px';
    
    // Input label
    const inputLabel = document.createElement('label');
    inputLabel.innerHTML = 'ETCH YOUR NAME:';
    inputLabel.style.color = '#ff6666';
    inputLabel.style.fontWeight = 'bold';
    
    // Text input
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.id = 'guestbook-input';
    inputField.maxLength = '30';
    inputField.style.backgroundColor = '#0a0000';
    inputField.style.border = '1px solid #600';
    inputField.style.padding = '10px';
    inputField.style.color = '#ff0000';
    inputField.style.fontSize = '1.2em';
    inputField.style.width = '100%';
    inputField.style.marginBottom = '10px';
    inputField.style.boxSizing = 'border-box';
    
    // Submit button
    const submitButton = document.createElement('button');
    submitButton.id = 'guestbook-submit';
    submitButton.innerHTML = 'SIGN IN BLOOD';
    submitButton.style.backgroundColor = '#600';
    submitButton.style.color = '#ffffff';
    submitButton.style.border = '2px outset #800';
    submitButton.style.padding = '10px 20px';
    submitButton.style.cursor = 'pointer';
    submitButton.style.fontFamily = 'Creepster, cursive';
    submitButton.style.fontSize = '1.5em';
    submitButton.style.width = '100%';
    
    // Close button (X in top right)
    const closeButton = document.createElement('div');
    closeButton.innerHTML = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.color = '#ff0000';
    closeButton.style.fontSize = '30px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '10001';
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
        
        // Trigger glitch effect when closing
        triggerGlitchEffect(document.body, 500);
        playAudio('staticSound', 0.3);
    };
    
    // Warning text
    const warningText = document.createElement('p');
    warningText.innerHTML = 'Your soul is bound once you sign...';
    warningText.style.color = '#990000';
    warningText.style.fontSize = '0.8em';
    warningText.style.textAlign = 'center';
    warningText.style.fontStyle = 'italic';
    warningText.style.marginTop = '15px';
    
    // Add blood drip effect to container
    for (let i = 0; i < 5; i++) {
        const bloodDrip = document.createElement('div');
        bloodDrip.style.position = 'absolute';
        bloodDrip.style.top = '0';
        bloodDrip.style.width = '2px';
        bloodDrip.style.backgroundColor = '#ff0000';
        bloodDrip.style.opacity = '0.7';
        
        // Random positions and heights
        const left = Math.random() * 100;
        const height = 30 + Math.random() * 200;
        
        bloodDrip.style.left = `${left}%`;
        bloodDrip.style.height = `${height}px`;
        
        guestBookContainer.appendChild(bloodDrip);
    }
    
    // Assemble the form
    formContainer.appendChild(inputLabel);
    formContainer.appendChild(inputField);
    formContainer.appendChild(submitButton);
    formContainer.appendChild(warningText);
    
    // Assemble the guest book
    guestBookContainer.appendChild(closeButton);
    guestBookContainer.appendChild(header);
    guestBookContainer.appendChild(subtitle);
    guestBookContainer.appendChild(listContainer);
    guestBookContainer.appendChild(formContainer);
    
    overlay.appendChild(guestBookContainer);
    document.body.appendChild(overlay);
    
    // Focus on the input field
    setTimeout(() => { inputField.focus(); }, 100);
    
    // Fetch the names from Firebase
    fetchGuestBookEntries();
    
    // Add event listeners
    submitButton.addEventListener('click', addGuestBookEntry);
    
    // Also submit on Enter key
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addGuestBookEntry();
        }
    });
}

// Function to fetch guest book entries from Firebase
function fetchGuestBookEntries() {
    try {
        const guestbookRef = firebase.database().ref('guestbook');
        
        // Limit to last 50 entries, ordered by timestamp descending
        guestbookRef.orderByChild('timestamp').limitToLast(50).on('value', (snapshot) => {
            const namesList = document.getElementById('guestbook-names');
            
            // Clear loading message
            namesList.innerHTML = '';
            
            // If no entries yet
            if (!snapshot.exists()) {
                const noEntries = document.createElement('li');
                noEntries.textContent = 'No souls have signed yet... be the first victim!';
                noEntries.style.color = '#ff6666';
                noEntries.style.textAlign = 'center';
                noEntries.style.padding = '10px';
                noEntries.style.fontStyle = 'italic';
                namesList.appendChild(noEntries);
                return;
            }
            
            // Convert to array and reverse for newest first
            const entries = [];
            snapshot.forEach((childSnapshot) => {
                entries.push({
                    key: childSnapshot.key,
                    ...childSnapshot.val()
                });
            });
            
            // Sort by timestamp descending (newest first)
            entries.sort((a, b) => b.timestamp - a.timestamp);
            
            // Add entries to the list
            entries.forEach((entry) => {
                const listItem = document.createElement('li');
                
                // Format date
                const date = new Date(entry.timestamp);
                const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                listItem.innerHTML = `<span class="name">${escapeHtml(entry.name)}</span> <span class="date">${formattedDate}</span>`;
                
                // Style the name
                listItem.style.borderBottom = '1px dashed #600';
                listItem.style.padding = '8px 5px';
                listItem.style.color = '#cc0000';
                
                // Name styling
                const nameSpan = listItem.querySelector('.name');
                nameSpan.style.fontFamily = 'Creepster, cursive';
                nameSpan.style.fontSize = '1.3em';
                nameSpan.style.marginRight = '10px';
                
                // Date styling
                const dateSpan = listItem.querySelector('.date');
                dateSpan.style.color = '#666';
                dateSpan.style.fontSize = '0.8em';
                dateSpan.style.fontStyle = 'italic';
                
                namesList.appendChild(listItem);
            });
        }, (error) => {
            console.error("Error fetching guestbook entries:", error);
            const namesList = document.getElementById('guestbook-names');
            namesList.innerHTML = '<li style="color: red; text-align: center;">Error loading guest book. The spirits are restless...</li>';
        });
    } catch (error) {
        console.error("Exception in fetchGuestBookEntries:", error);
    }
}

// Function to add a new entry to the guest book
function addGuestBookEntry() {
    try {
        const inputField = document.getElementById('guestbook-input');
        const name = inputField.value.trim();
        
        if (name === '') {
            // Shake the input field if empty
            inputField.style.animation = 'shakeInput 0.5s';
            setTimeout(() => { inputField.style.animation = ''; }, 500);
            return;
        }
        
        // Limit name length for safety
        const safeName = name.substring(0, 30);
        
        // Get a reference to the guestbook in Firebase
        const guestbookRef = firebase.database().ref('guestbook');
        
        // Add entry with timestamp
        guestbookRef.push({
            name: safeName,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            // Clear input field
            inputField.value = '';
            
            // Show success feedback
            triggerGlitchEffect(document.body, 300);
            playAudio('laughSound', 0.3);
            
            // Maybe show a creepy confirmation
            if (Math.random() > 0.7) {
                const messages = [
                    "Your soul is ours now...",
                    "We'll see you in your dreams...",
                    "Welcome to the family...",
                    "The Barlows thank you for your offering..."
                ];
                
                const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                
                const confirmation = document.createElement('div');
                confirmation.textContent = randomMessage;
                confirmation.style.position = 'absolute';
                confirmation.style.bottom = '10px';
                confirmation.style.left = '50%';
                confirmation.style.transform = 'translateX(-50%)';
                confirmation.style.color = '#ff0000';
                confirmation.style.fontStyle = 'italic';
                confirmation.style.opacity = '0';
                confirmation.style.transition = 'opacity 1s';
                
                document.getElementById('guestbook-container').appendChild(confirmation);
                
                setTimeout(() => { confirmation.style.opacity = '1'; }, 100);
                setTimeout(() => { 
                    confirmation.style.opacity = '0';
                    setTimeout(() => {
                        if (confirmation.parentNode) {
                            confirmation.parentNode.removeChild(confirmation);
                        }
                    }, 1000);
                }, 3000);
            }
        }).catch((error) => {
            console.error("Error adding guestbook entry:", error);
            alert("Failed to sign the book. The spirits rejected your offering...");
        });
    } catch (error) {
        console.error("Exception in addGuestBookEntry:", error);
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Add global CSS for the guestbook
function addGuestbookStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shakeInput {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        #guestbook-names::-webkit-scrollbar {
            width: 8px;
        }
        
        #guestbook-names::-webkit-scrollbar-track {
            background: #0a0000;
        }
        
        #guestbook-names::-webkit-scrollbar-thumb {
            background-color: #600;
            border-radius: 4px;
        }
        
        #guestbook-submit:hover {
            background-color: #800;
            box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        }
        
        #guestbook-submit:active {
            border-style: inset;
        }
    `;
    document.head.appendChild(style);
}

// Initialize Firebase guestbook when the page loads
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Add guestbook styles
        addGuestbookStyles();
        
        // Find all "ETCH YOUR NAME IN BLOOD" links and add event listeners
        const guestbookLinks = document.querySelectorAll('.guestbook a.interactive-text');
        guestbookLinks.forEach(link => {
            // Remove existing onclick to avoid conflicts
            const originalOnclick = link.getAttribute('onclick');
            link.removeAttribute('onclick');
            
            // Add new event listener
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Execute original onClick function if it exists (to keep the glitch effect)
                if (originalOnclick && originalOnclick.includes('triggerGlitchEffect')) {
                    // If it's an inline function call, execute the relevant parts
                    triggerGlitchEffect(document.body, 500);
                    
                    // If it includes showDetail, call that too
                    if (originalOnclick.includes('showDetail')) {
                        const match = originalOnclick.match(/showDetail\(['"](.*)['"]\)/);
                        if (match && match[1]) {
                            showDetail(match[1]);
                        }
                    }
                }
                
                // Now open the guestbook
                openGuestBook();
            });
        });
    } catch (error) {
        console.error("Error initializing guestbook:", error);
    }
});