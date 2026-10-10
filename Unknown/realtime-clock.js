// Real-Time 24-Hour Clock
function initRealtimeClock() {
    // Create clock container
    const clockContainer = document.createElement('div');
    clockContainer.className = 'realtime-clock-container';
    
    // Create clock HTML
    clockContainer.innerHTML = `
        <div class="realtime-clock">
            <div class="clock-icon">
                <i class="fas fa-clock"></i>
            </div>
            <div class="clock-segment">
                <div class="clock-time" id="hours">00</div>
                <div class="clock-label">Hours</div>
            </div>
            <div class="clock-separator">:</div>
            <div class="clock-segment">
                <div class="clock-time" id="minutes">00</div>
                <div class="clock-label">Minutes</div>
            </div>
            <div class="clock-separator">:</div>
            <div class="clock-segment">
                <div class="clock-time" id="seconds">00</div>
                <div class="clock-label">Seconds</div>
            </div>
        </div>
    `;
    
    // Append to home section
    const homeSection = document.getElementById('home');
    if (homeSection) {
        homeSection.appendChild(clockContainer);
    }
    
    // Update clock function
    function updateClock() {
        const now = new Date();
        
        // Get time components in 24-hour format
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        // Update DOM elements
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (hoursElement) hoursElement.textContent = hours;
        if (minutesElement) minutesElement.textContent = minutes;
        if (secondsElement) secondsElement.textContent = seconds;
    }
    
    // Initial update
    updateClock();
    
    // Update every second
    setInterval(updateClock, 1000);
}

// Initialize clock when DOM is ready
document.addEventListener('DOMContentLoaded', initRealtimeClock);
