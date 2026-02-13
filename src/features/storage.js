/* ============================================
   COOKMATE AI - STORAGE MODULE
   ============================================ */

CookMate.Storage = {
    // Initialize storage with default values
    init: function() {
        const defaults = {
            [CookMate.Config.STORAGE_KEYS.INGREDIENTS]: [],
            [CookMate.Config.STORAGE_KEYS.FAVORITES]: [],
            [CookMate.Config.STORAGE_KEYS.HISTORY]: [],
            [CookMate.Config.STORAGE_KEYS.STATS]: {
                mealsCooked: 0,
                totalTime: 0,
                recipesTriedIds: [],
                streak: 0,
                lastCookDate: null,
                perfectMeals: 0
            },
            [CookMate.Config.STORAGE_KEYS.SETTINGS]: {
                voice: true,
                sounds: true,
                autoStage: true,
                gestures: false,
                voiceSpeed: 0.9,
                sensitivity: 0.5
            },
            [CookMate.Config.STORAGE_KEYS.ACHIEVEMENTS]: []
        };

        // Initialize only if not exists
        Object.keys(defaults).forEach(key => {
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify(defaults[key]));
            }
        });

        console.log('✅ Storage initialized');
    },

    // Generic get/set methods
    get: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    },

    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    },

    // Ingredients
    getIngredients: function() {
        return this.get(CookMate.Config.STORAGE_KEYS.INGREDIENTS) || [];
    },

    saveIngredients: function(ingredients) {
        return this.set(CookMate.Config.STORAGE_KEYS.INGREDIENTS, Array.from(ingredients));
    },

    // Favorites
    getFavorites: function() {
        return this.get(CookMate.Config.STORAGE_KEYS.FAVORITES) || [];
    },

    addFavorite: function(recipeId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(recipeId)) {
            favorites.push(recipeId);
            this.set(CookMate.Config.STORAGE_KEYS.FAVORITES, favorites);
        }
    },

    removeFavorite: function(recipeId) {
        const favorites = this.getFavorites().filter(id => id !== recipeId);
        this.set(CookMate.Config.STORAGE_KEYS.FAVORITES, favorites);
    },

    isFavorite: function(recipeId) {
        return this.getFavorites().includes(recipeId);
    },

    // History
    getHistory: function() {
        return this.get(CookMate.Config.STORAGE_KEYS.HISTORY) || [];
    },

    addToHistory: function(recipeId, completedSteps, totalTime) {
        const history = this.getHistory();
        history.unshift({
            recipeId,
            completedSteps,
            totalTime,
            date: new Date().toISOString()
        });
        // Keep only last 50 entries
        this.set(CookMate.Config.STORAGE_KEYS.HISTORY, history.slice(0, 50));
    },

    // Stats
    getStats: function() {
        return this.get(CookMate.Config.STORAGE_KEYS.STATS) || {
            mealsCooked: 0,
            totalTime: 0,
            recipesTriedIds: [],
            streak: 0,
            lastCookDate: null,
            perfectMeals: 0
        };
    },

    updateStats: function(recipeId, cookingTime, isPerfect = false) {
        const stats = this.getStats();
        
        // Update meals count
        stats.mealsCooked++;
        
        // Update total time
        stats.totalTime += cookingTime;
        
        // Update recipes tried
        if (!stats.recipesTriedIds.includes(recipeId)) {
            stats.recipesTriedIds.push(recipeId);
        }
        
        // Update streak
        const today = new Date().toDateString();
        const lastCook = stats.lastCookDate ? new Date(stats.lastCookDate).toDateString() : null;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastCook === yesterday) {
            stats.streak++;
        } else if (lastCook !== today) {
            stats.streak = 1;
        }
        stats.lastCookDate = new Date().toISOString();
        
        // Update perfect meals
        if (isPerfect) {
            stats.perfectMeals++;
        }
        
        this.set(CookMate.Config.STORAGE_KEYS.STATS, stats);
        
        // Check achievements
        this.checkAchievements(stats);
        
        return stats;
    },

    // Settings
    getSettings: function() {
        return this.get(CookMate.Config.STORAGE_KEYS.SETTINGS) || {
            voice: true,
            sounds: true,
            autoStage: true,
            gestures: false,
            voiceSpeed: 0.9,
            sensitivity: 0.5
        };
    },

    updateSetting: function(key, value) {
        const settings = this.getSettings();
        settings[key] = value;
        this.set(CookMate.Config.STORAGE_KEYS.SETTINGS, settings);
    },

    // Achievements
    getAchievements: function() {
        return this.get(CookMate.Config.STORAGE_KEYS.ACHIEVEMENTS) || [];
    },

    unlockAchievement: function(achievementId) {
        const achievements = this.getAchievements();
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            this.set(CookMate.Config.STORAGE_KEYS.ACHIEVEMENTS, achievements);
            return true; // New achievement unlocked
        }
        return false;
    },

    checkAchievements: function(stats) {
        const achievements = CookMate.Config.ACHIEVEMENTS;
        const unlocked = [];

        // Check each achievement
        if (stats.mealsCooked >= 1 && this.unlockAchievement('first_meal')) {
            unlocked.push(achievements.FIRST_MEAL);
        }
        if (stats.recipesTriedIds.length >= 5 && this.unlockAchievement('five_recipes')) {
            unlocked.push(achievements.FIVE_RECIPES);
        }
        if (stats.mealsCooked >= 20 && this.unlockAchievement('master_chef')) {
            unlocked.push(achievements.MASTER_CHEF);
        }
        if (stats.streak >= 7 && this.unlockAchievement('week_streak')) {
            unlocked.push(achievements.WEEK_STREAK);
        }
        if (stats.perfectMeals >= 5 && this.unlockAchievement('perfectionist')) {
            unlocked.push(achievements.PERFECTIONIST);
        }

        // Notify for new achievements
        unlocked.forEach(achievement => {
            CookMate.UI.showNotification(`🏆 Achievement Unlocked: ${achievement.name}!`, 'success');
            CookMate.UI.celebrate();
        });

        return unlocked;
    },

    // Clear all data
    clearAll: function() {
        if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
            Object.values(CookMate.Config.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            this.init();
            CookMate.UI.showNotification('All data cleared', 'warning');
            location.reload();
        }
    }
};

// Settings module (convenience wrapper)
CookMate.Settings = {
    update: function(key, value) {
        CookMate.Storage.updateSetting(key, value);
        
        // Apply setting immediately
        switch(key) {
            case 'voice':
                CookMate.State.voiceEnabled = value;
                break;
            case 'sounds':
                CookMate.State.soundsEnabled = value;
                break;
            case 'voiceSpeed':
                CookMate.Config.VOICE_RATE = parseFloat(value);
                break;
            case 'sensitivity':
                CookMate.Config.DETECTION_CONFIDENCE = parseFloat(value);
                break;
        }
    },
    
    load: function() {
        const settings = CookMate.Storage.getSettings();
        
        // Apply stored settings
        CookMate.State.voiceEnabled = settings.voice ?? true;
        CookMate.State.soundsEnabled = settings.sounds ?? true;
        CookMate.Config.VOICE_RATE = settings.voiceSpeed || 0.9;
        CookMate.Config.DETECTION_CONFIDENCE = settings.sensitivity || 0.5;
        
        // Update UI toggles with null checks
        const voiceEl = document.getElementById('settingVoice');
        const soundsEl = document.getElementById('settingSounds');
        const autoStageEl = document.getElementById('settingAutoStage');
        const gesturesEl = document.getElementById('settingGestures');
        const voiceSpeedEl = document.getElementById('settingVoiceSpeed');
        const sensitivityEl = document.getElementById('settingSensitivity');
        
        if (voiceEl) voiceEl.checked = settings.voice;
        if (soundsEl) soundsEl.checked = settings.sounds;
        if (autoStageEl) autoStageEl.checked = settings.autoStage;
        if (gesturesEl) gesturesEl.checked = settings.gestures;
        if (voiceSpeedEl) voiceSpeedEl.value = settings.voiceSpeed || 0.9;
        if (sensitivityEl) sensitivityEl.value = settings.sensitivity || 0.5;
    }
};

// Application State
CookMate.State = {
    // Camera & Detection
    cameraActive: false,
    modelLoaded: false,
    model: null,
    detectionLoop: null,
    
    // Ingredients
    detectedIngredients: new Set(),
    
    // Cooking Mode
    currentRecipe: null,
    currentStep: 0,
    cookingStartTime: null,
    
    // Timer
    timerInterval: null,
    timerSeconds: 0,
    timerRunning: false,
    
    // Voice
    voiceEnabled: true,
    soundsEnabled: true,
    isListening: false,
    
    // UI
    currentFilter: 'all',
    searchQuery: '',
    
    // Performance
    frameCount: 0,
    lastFpsUpdate: Date.now(),
    fps: 0
};

console.log('✅ Storage module loaded');
