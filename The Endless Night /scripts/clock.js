// Real-time clock for The Endless Night ARG
// This script should be included on all pages

document.addEventListener('DOMContentLoaded', function() {
    // Find the date-time element that exists on all pages
    const clockDisplay = document.querySelector('.date-time');
    if (!clockDisplay) return;
    
    // Get the player's current day from localStorage
    const playerDay = parseInt(localStorage.getItem('endlessNightDay')) || 1;
    
    // Set base date as June 22, 1993 (plus the player's elapsed days)
    const baseDate = new Date('1993-06-22T02:17:00');
    baseDate.setDate(baseDate.getDate() + (playerDay - 1));
    
    // Get current real time to calculate offset
    const realNow = new Date();
    
    // Generate random second offset (to make each page load slightly different)
    const randomOffset = Math.floor(Math.random() * 300); // 0-300 seconds (0-5 minutes)
    
    // Calculate initial time (02:17:00 + real seconds + random offset)
    const gameNow = new Date(baseDate);
    gameNow.setSeconds(realNow.getSeconds() + randomOffset);
    
    // Update clock display
    updateClock(gameNow, baseDate, clockDisplay);
    
    // Update every second
    setInterval(function() {
        // Get current real time
        const currentReal = new Date();
        
        // Create a new game time, keeping the base date but updating seconds
        const currentGame = new Date(gameNow);
        
        // Add 1 second to our game time
        currentGame.setSeconds(currentGame.getSeconds() + 1);
        
        // Update the global gameNow time
        gameNow.setTime(currentGame.getTime());
        
        // Update the display
        updateClock(currentGame, baseDate, clockDisplay);
    }, 1000);
});

// Function to update the clock display
function updateClock(gameTime, baseDate, clockDisplay) {
    // Format the time portion: HH:MM:SS AM/PM
    const hours = gameTime.getHours();
    const minutes = gameTime.getMinutes();
    const seconds = gameTime.getSeconds();
    
    // Handle AM/PM formatting
    const ampm = hours >= 12 ? 'AM' : 'AM'; // Always AM in this game world since it's always night
    
    // Format the time with leading zeros
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    
    // Format the date: MM-DD-YYYY
    const month = (gameTime.getMonth() + 1).toString().padStart(2, '0');
    const day = gameTime.getDate().toString().padStart(2, '0');
    const year = gameTime.getFullYear();
    
    // Combine date and time
    const formattedDateTime = `${month}-${day}-${year} ${formattedTime}`;
    
    // Update the display
    clockDisplay.textContent = formattedDateTime;
    
    // Occasionally add a glitch effect to the clock (5% chance each update)
    if (Math.random() < 0.05) {
        clockDisplay.classList.add('clock-glitch');
        
        // Remove the glitch effect after a short time
        setTimeout(() => {
            clockDisplay.classList.remove('clock-glitch');
        }, 200);
    }
}