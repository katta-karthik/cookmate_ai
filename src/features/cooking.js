/* ============================================
   COOKMATE AI - COOKING MODULE
   ============================================ */

CookMate.Cooking = {
    // Select a recipe and start cooking mode
    selectRecipe: function(recipeId) {
        const recipe = CookMate.Recipes?.getById(recipeId);
        if (!recipe) {
            console.warn('Recipe not found:', recipeId);
            return;
        }
        
        CookMate.State.currentRecipe = recipe;
        CookMate.State.currentStep = 0;
        CookMate.State.cookingStartTime = Date.now();
        
        // Update UI with null checks
        const recipeNameEl = document.getElementById('currentRecipeName');
        const progressEl = document.getElementById('progressSection');
        const timerEl = document.getElementById('timerSection');
        const stageEl = document.getElementById('cookingStageSection');
        const fullscreenEl = document.getElementById('fullscreenBtn');
        
        if (recipeNameEl) recipeNameEl.textContent = recipe.name;
        if (progressEl) progressEl.classList.remove('hidden');
        if (timerEl) timerEl.classList.remove('hidden');
        if (stageEl) stageEl.classList.remove('hidden');
        if (fullscreenEl) fullscreenEl.classList.remove('hidden');
        
        // Update recipe list to show selected
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.classList.remove('selected');
        });
        const selectedCard = document.querySelector(`[data-recipe-id="${recipeId}"]`);
        if (selectedCard) selectedCard.classList.add('selected');
        
        // Set up steps
        this.updateStepsUI();
        this.updateProgress();
        
        // Set timer for first step
        const firstStep = recipe.steps[0];
        if (firstStep.time > 0) {
            CookMate.Timer.set(firstStep.time);
        }
        
        // Announce
        CookMate.Voice.speak(`Starting ${recipe.name}. ${recipe.steps.length} steps. Let's cook!`);
        
        // Scroll to cooking panel on mobile
        document.getElementById('cookingPanel').scrollIntoView({ behavior: 'smooth' });
        
        console.log('Recipe selected:', recipe.name);
    },
    
    // Update steps UI
    updateStepsUI: function() {
        const container = document.getElementById('recipeSteps');
        const recipe = CookMate.State.currentRecipe;
        
        if (!recipe) {
            container.innerHTML = `
                <div class="text-slate-500 text-sm text-center py-8">
                    <span class="text-4xl block mb-2">🍽️</span>
                    Select a recipe to see cooking steps
                </div>
            `;
            return;
        }
        
        container.innerHTML = recipe.steps.map((step, index) => {
            const isCompleted = index < CookMate.State.currentStep;
            const isActive = index === CookMate.State.currentStep;
            const isFuture = index > CookMate.State.currentStep;
            
            let stateClass = '';
            if (isCompleted) stateClass = 'completed';
            else if (isActive) stateClass = 'active';
            
            return `
                <div class="step-item ${stateClass}" data-step="${index}">
                    <div class="flex items-start gap-3">
                        <div class="step-number">
                            ${isCompleted ? '✓' : index + 1}
                        </div>
                        <div class="flex-1">
                            <p class="text-sm ${isActive ? 'text-white font-medium' : 'text-slate-400'}">${step.text}</p>
                            ${step.time > 0 ? `
                                <span class="text-xs text-slate-500 mt-1 inline-block">
                                    ⏱️ ${CookMate.Timer.formatTime(step.time)}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    ${isActive ? `
                        <div class="flex gap-2 mt-3 pl-10">
                            <button onclick="CookMate.Cooking.completeStep()" class="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded text-sm font-medium transition">
                                ✓ Complete Step
                            </button>
                            <button onclick="CookMate.Cooking.speakStep(${index})" class="px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded text-sm transition" title="Read aloud">
                                🔊
                            </button>
                            ${step.time > 0 ? `
                                <button onclick="CookMate.Timer.set(${step.time}); CookMate.Timer.start();" class="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition" title="Start step timer">
                                    ⏱️
                                </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Update cooking stage indicator
        const currentStage = recipe.steps[CookMate.State.currentStep]?.stage || 'raw';
        this.updateStage(currentStage);
    },
    
    // Complete current step
    completeStep: function() {
        if (!CookMate.State.currentRecipe) return;
        
        const recipe = CookMate.State.currentRecipe;
        CookMate.State.currentStep++;
        
        // Stop current timer
        CookMate.Timer?.reset();
        
        // Play sound
        CookMate.Sounds?.stepComplete();
        
        // Check if recipe complete
        if (CookMate.State.currentStep >= recipe.steps.length) {
            this.completeRecipe();
            return;
        }
        
        // Update UI
        this.updateStepsUI();
        this.updateProgress();
        
        // Set timer for new step
        const newStep = recipe.steps[CookMate.State.currentStep];
        if (newStep && newStep.time > 0) {
            CookMate.Timer?.set(newStep.time);
        }
        
        // Speak new step
        if (newStep) CookMate.Voice?.speak(newStep.text);
    },
    
    // Complete recipe
    completeRecipe: function() {
        const recipe = CookMate.State.currentRecipe;
        if (!recipe) return;
        
        const cookingTime = Math.floor((Date.now() - CookMate.State.cookingStartTime) / 1000);
        
        // Celebration!
        CookMate.UI?.celebrate();
        CookMate.Voice?.speak(`Congratulations! ${recipe.name} is complete. Enjoy your meal!`, true);
        
        // Update stats
        CookMate.Storage?.updateStats(recipe.id, cookingTime, true);
        CookMate.Storage?.addToHistory(recipe.id, recipe.steps.length, cookingTime);
        
        // Show completion notification
        CookMate.UI?.showNotification(`🎉 ${recipe.name} completed! Great job!`, 'success');
        
        // Update progress to 100%
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (progressBar) progressBar.style.width = '100%';
        if (progressText) progressText.textContent = 'Complete!';
        
        // Update steps UI to show all completed
        CookMate.State.currentStep = recipe.steps.length;
        this.updateStepsUI();
    },
    
    // Speak current step
    speakStep: function(index) {
        if (CookMate.State.currentRecipe?.steps?.[index]) {
            CookMate.Voice?.speak(CookMate.State.currentRecipe.steps[index].text);
        }
    },
    
    // Update progress bar
    updateProgress: function() {
        if (!CookMate.State.currentRecipe) return;
        
        const recipe = CookMate.State.currentRecipe;
        const progress = (CookMate.State.currentStep / recipe.steps.length) * 100;
        
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Step ${CookMate.State.currentStep + 1}/${recipe.steps.length}`;
    },
    
    // Update cooking stage
    updateStage: function(stage) {
        // Remove active from all stages
        ['raw', 'cooking', 'done', 'burnt'].forEach(s => {
            const el = document.getElementById(`stage-${s}`);
            if (el) el.classList.remove('active', 'warning');
        });
        
        // Add active to current stage
        const currentEl = document.getElementById(`stage-${stage}`);
        if (currentEl) currentEl.classList.add('active');
        
        // Show warning if burnt
        const warning = document.getElementById('stageWarning');
        if (stage === 'burnt') {
            if (currentEl) currentEl.classList.add('warning');
            if (warning) warning.classList.remove('hidden');
            CookMate.Voice?.speak('Warning! The food may be burning. Please check immediately.', true);
            CookMate.Sounds?.error();
        } else {
            if (warning) warning.classList.add('hidden');
        }
    },
    
    // Exit cooking mode
    exit: function() {
        CookMate.State.currentRecipe = null;
        CookMate.State.currentStep = 0;
        CookMate.Timer?.reset();
        
        const recipeNameEl = document.getElementById('currentRecipeName');
        const progressEl = document.getElementById('progressSection');
        const timerEl = document.getElementById('timerSection');
        const stageEl = document.getElementById('cookingStageSection');
        const fullscreenEl = document.getElementById('fullscreenBtn');
        
        if (recipeNameEl) recipeNameEl.textContent = 'Select a recipe to start';
        if (progressEl) progressEl.classList.add('hidden');
        if (timerEl) timerEl.classList.add('hidden');
        if (stageEl) stageEl.classList.add('hidden');
        if (fullscreenEl) fullscreenEl.classList.add('hidden');
        
        this.updateStepsUI();
    }
};

// Ingredients Management
CookMate.Ingredients = {
    // Add detected ingredient (with debounce for performance)
    _addQueue: new Set(),
    _addTimeout: null,
    
    addDetected: function(name) {
        if (!name) return;
        const normalized = name.toLowerCase();
        
        // Skip if already have it
        if (CookMate.State.detectedIngredients?.has(normalized)) return;
        
        // Queue the add for batch processing
        this._addQueue.add(normalized);
        
        // Debounce UI updates
        if (this._addTimeout) clearTimeout(this._addTimeout);
        this._addTimeout = setTimeout(() => {
            this._processAddQueue();
        }, 100);
    },
    
    _processAddQueue: function() {
        if (this._addQueue.size === 0) return;
        
        // Add all queued ingredients
        this._addQueue.forEach(name => {
            CookMate.State.detectedIngredients.add(name);
        });
        
        // Clear queue
        const hadItems = this._addQueue.size > 0;
        this._addQueue.clear();
        
        // Update UI once
        if (hadItems) {
            this.updateUI();
            CookMate.Recipes?.updateRecommendations();
            CookMate.Sounds?.detection();
        }
    },
    
    // Quick add ingredient
    quickAdd: function(name) {
        this.addDetected(name);
    },
    
    // Add manual ingredient
    addManual: function() {
        const input = document.getElementById('manualIngredient');
        if (!input) return;
        
        const value = input.value.trim();
        
        if (value) {
            value.split(',').forEach(ing => {
                const trimmed = ing.trim();
                if (trimmed) this.addDetected(trimmed);
            });
            input.value = '';
        }
    },
    
    // Remove ingredient
    remove: function(name) {
        CookMate.State.detectedIngredients?.delete(name.toLowerCase());
        this.updateUI();
        CookMate.Recipes?.updateRecommendations();
    },
    
    // Clear all ingredients
    clear: function() {
        CookMate.State.detectedIngredients?.clear();
        this.updateUI();
        CookMate.Recipes?.updateRecommendations();
    },
    
    // Update ingredients UI
    updateUI: function() {
        const container = document.getElementById('ingredientsList');
        const countEl = document.getElementById('ingredientCount');
        const ingredients = Array.from(CookMate.State.detectedIngredients || []);
        
        if (countEl) countEl.textContent = ingredients.length;
        
        if (!container) return;
        
        if (ingredients.length === 0) {
            container.innerHTML = '<div class="text-slate-500 text-sm">Point your camera at ingredients...</div>';
            return;
        }
        
        container.innerHTML = ingredients.map(ing => {
            // Get emoji from database
            const dbItem = CookMate.IngredientDB?.[ing.toLowerCase()];
            const emoji = dbItem ? dbItem.emoji : '🥗';
            
            return `
                <div class="ingredient-tag">
                    <span>${emoji}</span>
                    <span class="capitalize">${ing}</span>
                    <button onclick="CookMate.Ingredients.remove('${ing}')" title="Remove">×</button>
                </div>
            `;
        }).join('');
        
        // Save to storage
        CookMate.Storage?.saveIngredients(ingredients);
    },
    
    // Load saved ingredients
    loadSaved: function() {
        const saved = CookMate.Storage?.getIngredients() || [];
        saved.forEach(ing => {
            if (ing && CookMate.State.detectedIngredients) {
                CookMate.State.detectedIngredients.add(ing.toLowerCase());
            }
        });
        this.updateUI();
    }
};

// Quick Actions
CookMate.Actions = {
    stir: function() {
        CookMate.Voice?.speak('Remember to stir the food to ensure even cooking.');
        CookMate.UI?.showNotification('🥄 Time to stir!', 'info');
    },
    
    flip: function() {
        CookMate.Voice?.speak('Time to flip or turn the food over.');
        CookMate.UI?.showNotification('🔄 Flip the food!', 'info');
    },
    
    check: function() {
        CookMate.Voice?.speak('Check if the food is cooked properly. Look for golden color and test tenderness.');
        CookMate.UI?.showNotification('🔍 Check the food!', 'info');
    },
    
    taste: function() {
        CookMate.Voice?.speak('Time for a taste test. Adjust seasoning if needed.');
        CookMate.UI?.showNotification('👅 Taste and adjust!', 'info');
    },
    
    reduce: function() {
        CookMate.Voice?.speak('Reduce the heat to prevent burning.');
        CookMate.UI?.showNotification('🔥 Lower the heat!', 'warning');
    },
    
    cover: function() {
        CookMate.Voice?.speak('Cover the pan to trap steam and cook evenly.');
        CookMate.UI?.showNotification('🍲 Cover the pan!', 'info');
    }
};

// Shopping List
CookMate.Shopping = {
    items: [],
    
    generate: function(recipeId) {
        const recipe = CookMate.Recipes?.getById(recipeId);
        if (!recipe) return;
        
        const haveIngredients = Array.from(CookMate.State.detectedIngredients || []);
        const recipeIngs = recipe.ingredients || [];
        const missing = recipeIngs.filter(ing => 
            !haveIngredients.some(have => have.toLowerCase().includes(ing.toLowerCase()))
        );
        
        this.items = missing;
        this.updateUI();
        
        const sectionEl = document.getElementById('shoppingSection');
        if (sectionEl) sectionEl.classList.remove('hidden');
    },
    
    updateUI: function() {
        const container = document.getElementById('shoppingList');
        if (!container) return;
        
        if (this.items.length === 0) {
            container.innerHTML = '<p class="text-slate-500 text-sm">No items needed!</p>';
            return;
        }
        
        container.innerHTML = this.items.map((item, index) => `
            <div class="shopping-item" data-index="${index}">
                <input type="checkbox" onchange="CookMate.Shopping.toggleItem(${index})">
                <span class="capitalize">${item}</span>
            </div>
        `).join('');
    },
    
    toggleItem: function(index) {
        const items = document.querySelectorAll('.shopping-item');
        if (items[index]) items[index].classList.toggle('checked');
    },
    
    copy: function() {
        const text = this.items.join('\n');
        navigator.clipboard.writeText(text).then(() => {
            CookMate.UI?.showNotification('Shopping list copied!', 'success');
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    },
    
    clear: function() {
        this.items = [];
        this.updateUI();
        const sectionEl = document.getElementById('shoppingSection');
        if (sectionEl) sectionEl.classList.add('hidden');
    }
};

console.log('✅ Cooking module loaded');
