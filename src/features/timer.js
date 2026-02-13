/* ============================================
   COOKMATE AI - TIMER MODULE
   ============================================ */

CookMate.Timer = {
    // Set timer to specific seconds
    set: function(seconds) {
        CookMate.State.timerSeconds = seconds || 0;
        this.updateDisplay();
    },
    
    // Start the timer
    start: function() {
        if (CookMate.State.timerRunning || CookMate.State.timerSeconds <= 0) return;
        
        CookMate.State.timerRunning = true;
        
        // Update UI with null checks
        const startBtn = document.getElementById('timerStartBtn');
        const pauseBtn = document.getElementById('timerPauseBtn');
        const display = document.getElementById('timerDisplay');
        
        if (startBtn) startBtn.classList.add('hidden');
        if (pauseBtn) pauseBtn.classList.remove('hidden');
        if (display) display.classList.add('timer-running');
        
        // Start interval
        CookMate.State.timerInterval = setInterval(() => {
            if (CookMate.State.timerSeconds > 0) {
                CookMate.State.timerSeconds--;
                this.updateDisplay();
                
                const timerDisplay = document.getElementById('timerDisplay');
                
                // Check thresholds
                if (CookMate.State.timerSeconds === 30) {
                    CookMate.Voice?.speak('30 seconds remaining');
                    CookMate.Sounds?.timerWarning();
                    if (timerDisplay) timerDisplay.classList.add('timer-warning');
                } else if (CookMate.State.timerSeconds === 10) {
                    if (timerDisplay) {
                        timerDisplay.classList.add('timer-critical');
                        timerDisplay.classList.remove('timer-warning');
                    }
                } else if (CookMate.State.timerSeconds === 0) {
                    this.complete();
                }
            }
        }, 1000);
    },
    
    // Pause the timer
    pause: function() {
        CookMate.State.timerRunning = false;
        if (CookMate.State.timerInterval) {
            clearInterval(CookMate.State.timerInterval);
            CookMate.State.timerInterval = null;
        }
        
        // Update UI with null checks
        const startBtn = document.getElementById('timerStartBtn');
        const pauseBtn = document.getElementById('timerPauseBtn');
        const display = document.getElementById('timerDisplay');
        
        if (startBtn) startBtn.classList.remove('hidden');
        if (pauseBtn) pauseBtn.classList.add('hidden');
        if (display) display.classList.remove('timer-running');
    },
    
    // Reset the timer
    reset: function() {
        this.pause();
        CookMate.State.timerSeconds = 0;
        this.updateDisplay();
        
        const display = document.getElementById('timerDisplay');
        if (display) {
            display.classList.remove('timer-warning', 'timer-critical');
        }
    },
    
    // Timer complete
    complete: function() {
        this.pause();
        
        CookMate.Voice?.speak('Timer complete! Check your food.', true);
        CookMate.Sounds?.timerComplete();
        CookMate.UI?.showNotification('⏰ Timer Complete!', 'success');
        
        // Flash effect
        const display = document.getElementById('timerDisplay');
        if (display) {
            display.classList.remove('timer-warning', 'timer-critical');
            display.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            setTimeout(() => {
                display.style.background = '';
            }, 3000);
        }
    },
    
    // Add time
    addTime: function(seconds) {
        CookMate.State.timerSeconds += seconds;
        this.updateDisplay();
        
        // Remove warning states if time added
        if (CookMate.State.timerSeconds > 30) {
            const display = document.getElementById('timerDisplay');
            display.classList.remove('timer-warning', 'timer-critical');
        }
    },
    
    // Quick timer presets
    setQuick: function(minutes) {
        this.reset();
        this.set(minutes * 60);
        this.start();
        CookMate.Voice.speak(`${minutes} minute timer started`);
    },
    
    // Update display
    updateDisplay: function() {
        const seconds = CookMate.State.timerSeconds || 0;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        const el = document.getElementById('timerDisplay');
        if (el) el.textContent = display;
    },
    
    // Format time for display
    formatTime: function(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else if (seconds < 3600) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return secs > 0 ? `${mins}m ${secs}s` : `${mins} min`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            return `${hours}h ${mins}m`;
        }
    }
};

console.log('✅ Timer module loaded');
