/* ============================================
   COOKMATE AI - UI MODULE
   ============================================ */

CookMate.UI = {
    // Show notification
    showNotification: function (message, type = 'info') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <p class="font-medium">${message}</p>
        `;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    },

    // Celebration confetti
    celebrate: function () {
        if (typeof confetti === 'function') {
            // Left side
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { x: 0.1, y: 0.6 }
            });

            // Right side
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { x: 0.9, y: 0.6 }
                });
            }, 250);

            // Center burst
            setTimeout(() => {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { x: 0.5, y: 0.5 }
                });
            }, 500);
        }
    },

    // Toggle stats modal
    toggleStats: function () {
        const modal = document.getElementById('statsModal');
        modal.classList.toggle('hidden');

        if (!modal.classList.contains('hidden')) {
            this.updateStatsDisplay();
        }
    },

    // Update stats display
    updateStatsDisplay: function () {
        const stats = CookMate.Storage.getStats();

        document.getElementById('statMeals').textContent = stats.mealsCooked;
        document.getElementById('statTime').textContent = this.formatCookingTime(stats.totalTime);
        document.getElementById('statRecipes').textContent = stats.recipesTriedIds.length;
        document.getElementById('statStreak').textContent = stats.streak;

        // Update achievements
        const unlockedAchievements = CookMate.Storage.getAchievements();
        document.querySelectorAll('.achievement').forEach(el => {
            const achievementId = el.textContent.toLowerCase().replace(/[^a-z]/g, '_').replace(/_+/g, '_');
            if (unlockedAchievements.some(a => achievementId.includes(a.replace('_', '')))) {
                el.classList.remove('locked');
                el.classList.add('unlocked');
            }
        });
    },

    // Format cooking time
    formatCookingTime: function (seconds) {
        if (seconds < 3600) {
            return `${Math.floor(seconds / 60)}m`;
        }
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${mins}m`;
    },

    // Toggle settings modal
    toggleSettings: function () {
        const modal = document.getElementById('settingsModal');
        modal.classList.toggle('hidden');

        if (!modal.classList.contains('hidden')) {
            // Populate settings data
            const apiUrl = localStorage.getItem('cookmate_api_url') || '';
            const apiInput = document.getElementById('settingApiUrl');
            if (apiInput) apiInput.value = apiUrl;
        }
    },

    // Toggle fullscreen cooking mode
    toggleFullscreen: function () {
        const panel = document.getElementById('cookingPanel');
        panel.classList.toggle('fullscreen-mode');

        const btn = document.getElementById('fullscreenBtn');
        btn.textContent = panel.classList.contains('fullscreen-mode') ? '✕' : '⛶';
    },

    // Update model status
    updateModelStatus: function (status, text) {
        const el = document.getElementById('modelStatus');

        const colors = {
            loading: 'bg-yellow-500/20 text-yellow-400',
            ready: 'bg-green-500/20 text-green-400',
            error: 'bg-red-500/20 text-red-400'
        };

        const dotColors = {
            loading: 'bg-yellow-400 animate-pulse',
            ready: 'bg-green-400',
            error: 'bg-red-400'
        };

        el.className = `hidden md:flex items-center gap-2 px-3 py-1.5 ${colors[status]} rounded-full text-sm`;
        el.innerHTML = `
            <div class="w-2 h-2 ${dotColors[status]} rounded-full"></div>
            <span>${text}</span>
        `;
    },

    // Hide loading screen - fast!
    hideLoadingScreen: function () {
        const screen = document.getElementById('loadingScreen');
        if (!screen) return;
        screen.style.transition = 'opacity 0.2s ease-out';
        screen.style.opacity = '0';
        setTimeout(() => {
            screen.style.display = 'none';
            screen.remove(); // Remove from DOM completely
        }, 200);
    },

    // Update loading status
    updateLoadingStatus: function (text) {
        const el = document.getElementById('loadingStatus');
        if (el) el.textContent = text;
    }
};

// Recipe UI Functions - Define after ensuring CookMate.Recipes exists
(function () {
    // Ensure CookMate.Recipes exists
    CookMate.Recipes = CookMate.Recipes || {};

    CookMate.Recipes.filter = function (filterType) {
        CookMate.State.currentFilter = filterType;

        // Update filter button styles
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filterType) {
                btn.classList.add('active');
            }
        });

        if (this.updateRecommendations) {
            this.updateRecommendations();
        }
    };

    CookMate.Recipes.search = function (query) {
        CookMate.State.searchQuery = (query || '').toLowerCase();
        if (this.updateRecommendations) {
            this.updateRecommendations();
        }
    };

    CookMate.Recipes.updateRecommendations = function () {
        const container = document.getElementById('recipeList');
        if (!container) return;

        const ingredients = Array.from(CookMate.State?.detectedIngredients || []);
        const filter = CookMate.State?.currentFilter || 'all';
        const search = CookMate.State?.searchQuery || '';

        // Get all recipes
        let recipes = typeof this.getAll === 'function' ? this.getAll() : [];

        // Apply cuisine/tag filter
        if (filter !== 'all') {
            recipes = recipes.filter(r =>
                r.cuisine === filter || (r.tags && r.tags.includes(filter))
            );
        }

        // Apply search filter
        if (search) {
            recipes = recipes.filter(r =>
                (r.name && r.name.toLowerCase().includes(search)) ||
                (r.ingredients && r.ingredients.some(i => i.toLowerCase().includes(search)))
            );
        }

        // Score recipes by ingredient match
        const scoredRecipes = recipes.map(recipe => {
            const requiredIngs = recipe.requiredIngredients || [];
            const allIngs = recipe.ingredients || [];

            const matchingRequired = requiredIngs.filter(ing =>
                ingredients.some(detected => detected.toLowerCase().includes(ing.toLowerCase()))
            ).length;

            const matchingAll = allIngs.filter(ing =>
                ingredients.some(detected => detected.toLowerCase().includes(ing.toLowerCase()))
            ).length;

            const hasAllRequired = matchingRequired === requiredIngs.length;
            const matchPercent = allIngs.length > 0 ? Math.round((matchingAll / allIngs.length) * 100) : 0;

            return {
                ...recipe,
                matchScore: matchingAll,
                hasAllRequired,
                matchPercent
            };
        });

        // Sort by match score
        scoredRecipes.sort((a, b) => b.matchScore - a.matchScore);

        // Render recipes
        if (scoredRecipes.length === 0) {
            container.innerHTML = `
                <div class="text-slate-500 text-sm col-span-2 text-center py-8">
                    No recipes found. Try different filters or add more ingredients.
                </div>
            `;
            return;
        }

        const favorites = CookMate.Storage?.getFavorites() || [];

        container.innerHTML = scoredRecipes.map(recipe => {
            const isFavorite = favorites.includes(recipe.id);
            const isSelected = CookMate.State.currentRecipe?.id === recipe.id;

            return `
            <div class="recipe-card ${recipe.hasAllRequired ? 'recommended' : ''} ${isSelected ? 'selected' : ''}" 
                 data-recipe-id="${recipe.id}" 
                 onclick="CookMate.Cooking.selectRecipe(${recipe.id})">
                <div class="flex items-start justify-between mb-2">
                    <span class="text-3xl">${recipe.emoji}</span>
                    <div class="flex items-center gap-2">
                        <button onclick="event.stopPropagation(); CookMate.Recipes.toggleFavorite(${recipe.id})" 
                                class="text-lg hover:scale-110 transition">
                            ${isFavorite ? '❤️' : '🤍'}
                        </button>
                        <span class="match-badge ${recipe.matchPercent > 50 ? 'bg-green-500/30 text-green-300' : 'bg-slate-600 text-slate-300'}">
                            ${recipe.matchPercent}% match
                        </span>
                    </div>
                </div>
                
                <h3 class="font-semibold text-base mb-1">${recipe.name}</h3>
                <p class="text-xs text-slate-400 mb-2 line-clamp-2">${recipe.description}</p>
                
                <div class="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <span>⏱️ ${recipe.time} min</span>
                    <span>📊 ${recipe.difficulty}</span>
                    <span>🍽️ ${recipe.servings} srv</span>
                </div>
                
                <div class="flex flex-wrap gap-1">
                    ${recipe.ingredients.slice(0, 5).map(ing => {
                const hasIt = ingredients.some(d => d.toLowerCase().includes(ing.toLowerCase()));
                return `<span class="ingredient-check ${hasIt ? 'have' : 'missing'}">${ing}</span>`;
            }).join('')}
                    ${recipe.ingredients.length > 5 ? `
                        <span class="text-xs text-slate-500">+${recipe.ingredients.length - 5}</span>
                    ` : ''}
                </div>
                
                <div class="flex gap-2 mt-3">
                    <button onclick="event.stopPropagation(); CookMate.Shopping.generate(${recipe.id})" 
                            class="flex-1 py-1.5 bg-slate-600 hover:bg-slate-500 rounded text-xs transition">
                        🛒 Shopping List
                    </button>
                    <button onclick="event.stopPropagation(); CookMate.Cooking.selectRecipe(${recipe.id})" 
                            class="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs font-medium transition">
                        👨‍🍳 Start Cooking
                    </button>
                </div>
            </div>
        `;
        }).join('');
    };

    CookMate.Recipes.toggleFavorite = function (recipeId) {
        if (CookMate.Storage?.isFavorite(recipeId)) {
            CookMate.Storage.removeFavorite(recipeId);
        } else {
            CookMate.Storage?.addFavorite(recipeId);
        }
        if (this.updateRecommendations) {
            this.updateRecommendations();
        }
    };
})();

console.log('✅ UI module loaded');
