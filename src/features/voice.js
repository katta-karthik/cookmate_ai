/* ============================================
   COOKMATE AI - VOICE MODULE
   Text-to-Speech & Speech Recognition
   ============================================ */

CookMate.Voice = {
    synthesis: window.speechSynthesis,
    recognition: null,
    isSupported: true,
    
    // Initialize voice systems
    init: function() {
        // Check TTS support
        if (!this.synthesis) {
            console.warn('Text-to-Speech not supported');
            this.isSupported = false;
        }
        
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = this.handleSpeechResult.bind(this);
            this.recognition.onerror = this.handleSpeechError.bind(this);
            this.recognition.onend = this.handleSpeechEnd.bind(this);
        } else {
            console.warn('Speech Recognition not supported');
        }
        
        console.log('✅ Voice module initialized');
    },
    
    // Speak text aloud
    speak: function(text, priority = false) {
        if (!this.isSupported || !CookMate.State.voiceEnabled) return;
        
        // Cancel current speech if priority
        if (priority) {
            this.synthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = CookMate.Config.VOICE_RATE;
        utterance.pitch = CookMate.Config.VOICE_PITCH;
        utterance.volume = CookMate.Config.VOICE_VOLUME;
        
        // Show speaking overlay
        this.showSpeakingUI(text);
        
        utterance.onend = () => {
            this.hideSpeakingUI();
        };
        
        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            this.hideSpeakingUI();
        };
        
        this.synthesis.speak(utterance);
        
        // Update last spoken
        document.getElementById('lastSpoken').textContent = text;
    },
    
    // Stop speaking
    stop: function() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        this.hideSpeakingUI();
    },
    
    // Toggle voice on/off
    toggle: function() {
        CookMate.State.voiceEnabled = !CookMate.State.voiceEnabled;
        const icon = document.getElementById('voiceIcon');
        icon.textContent = CookMate.State.voiceEnabled ? '🔊' : '🔇';
        
        if (!CookMate.State.voiceEnabled) {
            this.stop();
        }
        
        CookMate.Storage.updateSetting('voice', CookMate.State.voiceEnabled);
    },
    
    // Start listening for voice commands
    listen: function() {
        if (!this.recognition) {
            CookMate.UI.showNotification('Speech recognition not supported', 'error');
            return;
        }
        
        if (CookMate.State.isListening) {
            this.recognition.stop();
            return;
        }
        
        try {
            this.recognition.start();
            CookMate.State.isListening = true;
            this.showListeningUI();
        } catch (e) {
            console.error('Speech recognition error:', e);
        }
    },
    
    // Handle speech recognition result
    handleSpeechResult: function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);
        
        this.hideListeningUI();
        this.processCommand(transcript);
    },
    
    // Process voice commands
    processCommand: function(command) {
        // Next step
        if (command.includes('next') || command.includes('continue') || command.includes('done')) {
            if (CookMate.State.currentRecipe) {
                CookMate.Cooking.completeStep();
                this.speak('Moving to next step');
            } else {
                this.speak('No recipe selected');
            }
            return;
        }
        
        // Previous step
        if (command.includes('previous') || command.includes('back') || command.includes('go back')) {
            if (CookMate.State.currentRecipe && CookMate.State.currentStep > 0) {
                CookMate.State.currentStep--;
                CookMate.Cooking.updateStepsUI();
                this.speak('Going back to previous step');
            }
            return;
        }
        
        // Repeat current step
        if (command.includes('repeat') || command.includes('again') || command.includes('what')) {
            if (CookMate.State.currentRecipe) {
                const step = CookMate.State.currentRecipe.steps[CookMate.State.currentStep];
                this.speak(step.text);
            }
            return;
        }
        
        // Timer commands
        if (command.includes('start timer') || command.includes('begin timer')) {
            CookMate.Timer.start();
            this.speak('Timer started');
            return;
        }
        
        if (command.includes('stop timer') || command.includes('pause timer')) {
            CookMate.Timer.pause();
            this.speak('Timer paused');
            return;
        }
        
        if (command.includes('reset timer')) {
            CookMate.Timer.reset();
            this.speak('Timer reset');
            return;
        }
        
        // Time-specific timers
        const timeMatch = command.match(/(\d+)\s*(minute|min|second|sec)/);
        if (timeMatch) {
            const amount = parseInt(timeMatch[1]);
            const unit = timeMatch[2].startsWith('min') ? 60 : 1;
            CookMate.Timer.set(amount * unit);
            CookMate.Timer.start();
            this.speak(`${amount} ${timeMatch[2]} timer started`);
            return;
        }
        
        // Help
        if (command.includes('help') || command.includes('commands')) {
            this.speak('You can say: next step, repeat, start timer, stop timer, or a time like 5 minutes');
            return;
        }
        
        // Unknown command
        this.speak("I didn't understand. Try saying next step, repeat, or start timer.");
    },
    
    // Handle speech recognition errors
    handleSpeechError: function(event) {
        console.error('Speech recognition error:', event.error);
        this.hideListeningUI();
        
        if (event.error === 'not-allowed') {
            CookMate.UI.showNotification('Microphone access denied', 'error');
        }
    },
    
    // Handle speech recognition end
    handleSpeechEnd: function() {
        CookMate.State.isListening = false;
        this.hideListeningUI();
    },
    
    // UI helpers
    showSpeakingUI: function(text) {
        const overlay = document.getElementById('speakingOverlay');
        const textEl = document.getElementById('speakingText');
        
        textEl.textContent = text.substring(0, 50) + (text.length > 50 ? '...' : '');
        overlay.classList.remove('hidden');
        
        const indicator = document.getElementById('voiceIndicator');
        indicator.classList.add('voice-active');
        indicator.innerHTML = '<span class="text-2xl">🔊</span>';
    },
    
    hideSpeakingUI: function() {
        document.getElementById('speakingOverlay').classList.add('hidden');
        
        const indicator = document.getElementById('voiceIndicator');
        indicator.classList.remove('voice-active');
        indicator.innerHTML = '<span class="text-2xl">🎤</span>';
    },
    
    showListeningUI: function() {
        document.getElementById('listeningOverlay').classList.remove('hidden');
        
        const indicator = document.getElementById('voiceIndicator');
        indicator.classList.add('listening-active');
        indicator.innerHTML = '<span class="text-2xl">👂</span>';
        
        const micBtn = document.getElementById('micBtn');
        micBtn.classList.add('bg-green-600');
        micBtn.classList.remove('bg-indigo-600');
    },
    
    hideListeningUI: function() {
        document.getElementById('listeningOverlay').classList.add('hidden');
        
        const indicator = document.getElementById('voiceIndicator');
        indicator.classList.remove('listening-active');
        indicator.innerHTML = '<span class="text-2xl">🎤</span>';
        
        const micBtn = document.getElementById('micBtn');
        micBtn.classList.remove('bg-green-600');
        micBtn.classList.add('bg-indigo-600');
    }
};

// Sound Effects Module
CookMate.Sounds = {
    audioContext: null,
    initialized: false,
    
    init: function() {
        // Defer AudioContext creation until user interaction
        const initAudio = () => {
            if (this.initialized) return;
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
                // Resume context if suspended
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', initAudio);
            document.removeEventListener('touchstart', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
        
        // Setup listeners for user interaction
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('touchstart', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
        
        console.log('✅ Sounds module initialized (will activate on user interaction)');
    },
    
    play: function(soundType) {
        if (!CookMate.State.soundsEnabled || !this.audioContext) return;
        
        // Resume context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const sound = CookMate.SoundDefs?.[soundType];
        if (!sound) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = sound.frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + sound.duration / 1000);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + sound.duration / 1000);
        } catch (e) {
            console.error('Sound play error:', e);
        }
    },
    
    timerTick: function() { this.play('TIMER_TICK'); },
    timerWarning: function() { this.play('TIMER_WARNING'); },
    timerComplete: function() { this.play('TIMER_COMPLETE'); },
    stepComplete: function() { this.play('STEP_COMPLETE'); },
    detection: function() { this.play('DETECTION'); },
    error: function() { this.play('ERROR'); }
};

console.log('✅ Voice module loaded');
