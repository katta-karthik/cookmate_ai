/* ============================================
   COOKMATE AI - MAIN APPLICATION
   Version: 2.0.0
   Real-Time Vision-Based Cooking Assistant
   ============================================ */

(function () {
    'use strict';

    // Main initialization - FAST, no blocking
    async function init() {
        console.log('🍳 CookMate AI v2.0 Initializing...');

        const startTime = performance.now();

        try {
            // Step 1: Hide loading screen IMMEDIATELY (don't wait for anything)
            requestAnimationFrame(() => {
                hideLoadingFast();
            });

            // Step 2: Initialize core modules (all sync, fast)
            initCoreModules();

            // Step 3: Set up event listeners
            setupEventListeners();

            // Step 4: Load saved data
            loadSavedData();

            console.log(`✅ CookMate AI ready in ${Math.round(performance.now() - startTime)}ms`);

            // Step 5: Load AI model in background (completely async)
            setTimeout(() => loadAIInBackground(), 100);

        } catch (error) {
            console.error('❌ Initialization error:', error);
            hideLoadingFast();
        }
    }

    // Hide loading screen immediately
    function hideLoadingFast() {
        const screen = document.getElementById('loadingScreen');
        if (screen) {
            screen.style.opacity = '0';
            screen.style.transition = 'opacity 0.15s';
            setTimeout(() => screen.remove(), 150);
        }
    }

    // Initialize core modules (sync, fast)
    function initCoreModules() {
        try { CookMate.Storage?.init(); } catch (e) { console.warn('Storage init:', e); }
        try { CookMate.Settings?.load(); } catch (e) { console.warn('Settings load:', e); }
        try { CookMate.Camera?.init(); } catch (e) { console.warn('Camera init:', e); }
        try { CookMate.Voice?.init(); } catch (e) { console.warn('Voice init:', e); }
        try { CookMate.Sounds?.init(); } catch (e) { console.warn('Sounds init:', e); }
    }

    // Load saved data
    function loadSavedData() {
        try { CookMate.Ingredients?.loadSaved(); } catch (e) { console.warn('Ingredients:', e); }
        try { CookMate.Recipes?.updateRecommendations(); } catch (e) { console.warn('Recipes:', e); }
    }

    // Load AI model in background without blocking UI
    async function loadAIInBackground() {
        console.log('🤖 Connecting to AI backend...');

        // No more waiting for TF.js/COCO-SSD as we use a remote API now
        try {
            await CookMate.ModelLoader?.load();
        } catch (e) {
            console.error('Initial AI connection error:', e);
            CookMate.UI?.updateModelStatus?.('error', 'AI Offline');
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Manual ingredient input - Enter key
        document.getElementById('manualIngredient').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                CookMate.Ingredients.addManual();
            }
        });

        // Note: Recipe search is handled via oninput in HTML with CookMate.Recipes.search

        // Modal close on backdrop click
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));

                // Exit fullscreen if active
                const panel = document.getElementById('cookingPanel');
                if (panel.classList.contains('fullscreen-mode')) {
                    panel.classList.remove('fullscreen-mode');
                }
            }

            // Space to start/pause timer (when not in input)
            if (e.key === ' ' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                if (CookMate.State.timerRunning) {
                    CookMate.Timer.pause();
                } else if (CookMate.State.timerSeconds > 0) {
                    CookMate.Timer.start();
                }
            }

            // Arrow Right for next step
            if (e.key === 'ArrowRight' && CookMate.State.currentRecipe) {
                CookMate.Cooking.completeStep();
            }

            // Arrow Left for previous step
            if (e.key === 'ArrowLeft' && CookMate.State.currentRecipe && CookMate.State.currentStep > 0) {
                CookMate.State.currentStep--;
                CookMate.Cooking.updateStepsUI();
                CookMate.Cooking.updateProgress();
            }
        });

        // Visibility change - pause timer when hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && CookMate.State.timerRunning) {
                // Keep timer running but show notification when visible again
                CookMate.State.wasTimerRunning = true;
            } else if (!document.hidden && CookMate.State.wasTimerRunning) {
                CookMate.State.wasTimerRunning = false;
                if (CookMate.State.timerSeconds <= 0) {
                    CookMate.UI.showNotification('Timer completed while you were away!', 'warning');
                }
            }
        });

        // Before unload - save state
        window.addEventListener('beforeunload', () => {
            CookMate.Storage.saveIngredients(Array.from(CookMate.State.detectedIngredients));
        });

        // Handle camera permission changes
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'camera' }).then(permission => {
                permission.onchange = () => {
                    if (permission.state === 'denied' && CookMate.State.cameraActive) {
                        CookMate.Camera.stop();
                        CookMate.UI.showNotification('Camera permission was revoked', 'error');
                    }
                };
            }).catch(() => {
                // Permissions API not fully supported
            });
        }

        console.log('✅ Event listeners set up');
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

// ============================================
// GLOBAL HELPER FUNCTIONS
// ============================================

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Utility: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

console.log('✅ CookMate AI App loaded');
