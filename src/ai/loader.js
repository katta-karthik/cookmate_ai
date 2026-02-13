/* ============================================
   COOKMATE AI - MODEL LOADER
   TensorFlow.js COCO-SSD Model Loading
   ============================================ */

// Ensure CookMate namespace exists
window.CookMate = window.CookMate || {};

// Model Loader Module
CookMate.ModelLoader = {
    // Verify Connection to Remote Qwen-VL API
    load: async function () {
        const url = CookMate.Detection.apiEndpoint;

        if (!url) {
            console.warn('AI API URL not set. Please set it in settings.');
            CookMate.UI.updateModelStatus('warning', 'API Not Set');
            CookMate.State.modelLoaded = false;
            return false;
        }

        try {
            console.log('Verifying AI API connection at:', url);

            // Simple ping to check if server is up
            const response = await fetch(`${url}/ping`, {
                headers: { 'ngrok-skip-browser-warning': 'true' }
            });
            if (response.ok) {
                CookMate.State.modelLoaded = true;
                CookMate.UI.updateModelStatus('ready', 'AI Ready');
                console.log('✅ Remote AI API connected successfully');
                return true;
            } else {
                throw new Error('Server returned error');
            }
        } catch (error) {
            console.warn('AI API connection failed:', error.message);
            CookMate.State.modelLoaded = false;
            CookMate.UI.updateModelStatus('error', 'AI Offline');
            return false;
        }
    },

    // Check if model is ready
    isReady: function () {
        return CookMate.State.modelLoaded && CookMate.State.model !== null;
    },

    // Get model info
    getInfo: function () {
        if (!this.isReady()) {
            return { status: 'not loaded', model: null };
        }

        return {
            status: 'ready',
            model: 'COCO-SSD',
            base: CookMate.ModelConfig?.MODEL_BASE || 'mobilenet_v2'
        };
    },

    // Unload model (free memory)
    unload: function () {
        if (CookMate.State.model) {
            // TensorFlow.js doesn't have explicit unload, but we can clear reference
            CookMate.State.model = null;
            CookMate.State.modelLoaded = false;
            console.log('Model unloaded');
        }
    }
};

console.log('✅ Model Loader module loaded');
