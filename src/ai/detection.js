/* ============================================
   COOKMATE AI - DETECTION MODULE (QWEN-VL VERSION)
   Remote Vision-Language API Detection
   ============================================ */

window.CookMate = window.CookMate || {};

CookMate.Detection = {
    // API Configuration
    // The endpoint should be your Colab Flask URL (e.g., https://####.ngrok-free.app)
    apiEndpoint: localStorage.getItem('cookmate_api_url') || '',
    isAnalyzing: false,

    // Set the API URL (can be called from console or settings UI)
    setApiUrl: function (url) {
        if (!url || !url.startsWith('http')) return false;
        this.apiEndpoint = url.endsWith('/') ? url.slice(0, -1) : url;
        localStorage.setItem('cookmate_api_url', this.apiEndpoint);
        console.log('✅ AI API URL updated to:', this.apiEndpoint);

        // Refresh connection status
        if (CookMate.ModelLoader) {
            CookMate.ModelLoader.load();
        }
        return true;
    },

    // Main routine: Identify ingredients from an image source
    // imageSource can be a canvas, blob, or base64 string
    analyze: async function (imageSource) {
        if (!this.apiEndpoint) {
            CookMate.UI.showNotification('Please set the AI API URL in settings first.', 'error');
            return null;
        }

        if (this.isAnalyzing) return null;
        this.isAnalyzing = true;
        CookMate.UI.updateModelStatus('loading', 'AI Thinking...');

        try {
            let base64Image = '';

            // Handle different image sources
            if (imageSource instanceof HTMLCanvasElement) {
                base64Image = imageSource.toDataURL('image/jpeg', 0.8).split(',')[1];
            } else if (typeof imageSource === 'string' && imageSource.includes('base64')) {
                base64Image = imageSource.split(',')[1];
            } else {
                // Assuming it's already a base64 string without prefix
                base64Image = imageSource;
            }

            // Call the remote Qwen-VL Flask Server
            const response = await fetch(`${this.apiEndpoint}/detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({ image: base64Image })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();

            // Expected response: { ingredients: ["Tomato", "Onion"] }
            if (data && data.ingredients && Array.isArray(data.ingredients)) {
                this.processResults(data.ingredients);
                return data.ingredients;
            }

            return [];

        } catch (error) {
            console.error('Detection API Error:', error);
            CookMate.UI.showNotification('Failed to connect to AI server.', 'error');
            return null;
        } finally {
            this.isAnalyzing = false;
            CookMate.UI.updateModelStatus('ready', 'AI Ready');
        }
    },

    // Process detected item list
    processResults: function (ingredients) {
        if (ingredients.length === 0) {
            CookMate.UI.showNotification('No ingredients detected.', 'info');
            return;
        }

        console.log('Detected items:', ingredients);

        ingredients.forEach(item => {
            // Standardize and add to our tracking
            CookMate.Ingredients.addDetected(item);
        });

        CookMate.UI.showNotification(`Detected: ${ingredients.join(', ')}`, 'success');

        // Trigger recipe update
        if (CookMate.Recipes && CookMate.Recipes.updateRecommendations) {
            CookMate.Recipes.updateRecommendations();
        }
    },

    // Helper functions for drawing (kept for compatibility, though we don't do boxes now)
    drawDetection: function () { /* No longer used in capture mode */ },
    startLoop: function () { /* Disabled: Using capture instead of live */ },
    stopLoop: function () { /* Disabled */ }
};

console.log('✅ Qwen-VL Detection module loaded');
