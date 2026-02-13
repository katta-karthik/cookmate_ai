/* ============================================
   COOKMATE AI - COOKING STAGE ANALYZER
   Color-based cooking stage detection
   ============================================ */

// Ensure CookMate namespace exists
window.CookMate = window.CookMate || {};

// Analyzer Module - Cooking Stage Detection
CookMate.Analyzer = {
    // Reusable canvas for performance
    _canvas: null,
    _ctx: null,
    _lastAnalysis: 0,
    _analysisInterval: 500, // Only analyze every 500ms
    
    // Get or create reusable canvas
    getCanvas: function(size) {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._ctx = this._canvas.getContext('2d', { willReadFrequently: true });
        }
        if (this._canvas.width !== size || this._canvas.height !== size) {
            this._canvas.width = size;
            this._canvas.height = size;
        }
        return { canvas: this._canvas, ctx: this._ctx };
    },
    
    // Analyze cooking stage based on color (throttled)
    analyzeCookingStage: function() {
        const now = performance.now();
        if (now - this._lastAnalysis < this._analysisInterval) {
            return null; // Skip if called too frequently
        }
        this._lastAnalysis = now;
        
        const video = CookMate.Camera?.video;
        if (!video || video.readyState < 2) return null;
        
        // Sample center region
        const sampleSize = CookMate.ModelConfig?.COLOR_SAMPLE_SIZE || 100;
        const x = (video.videoWidth - sampleSize) / 2;
        const y = (video.videoHeight - sampleSize) / 2;
        
        const { canvas, ctx } = this.getCanvas(sampleSize);
        ctx.drawImage(video, x, y, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize);
        
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const colors = this.analyzeColors(imageData);
        
        // Determine cooking stage based on color analysis
        const stage = this.determineCookingStage(colors);
        CookMate.Cooking?.updateStage(stage);
        
        return stage;
    },
    
    // Analyze color distribution from image data
    analyzeColors: function(imageData) {
        const data = imageData.data;
        let rSum = 0, gSum = 0, bSum = 0;
        let brownCount = 0, darkCount = 0;
        const pixelCount = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            rSum += r;
            gSum += g;
            bSum += b;
            
            // Check for brown tones (cooking indicator)
            if (r > 100 && r > g && g > b && r - b > 30) {
                brownCount++;
            }
            
            // Check for dark tones (burnt indicator)
            if (r < 60 && g < 60 && b < 60) {
                darkCount++;
            }
        }
        
        return {
            avgR: rSum / pixelCount,
            avgG: gSum / pixelCount,
            avgB: bSum / pixelCount,
            brownRatio: brownCount / pixelCount,
            darkRatio: darkCount / pixelCount
        };
    },
    
    // Determine cooking stage from color analysis
    determineCookingStage: function(colors) {
        // Get thresholds from config or use defaults
        const config = CookMate.ModelConfig || {};
        const burntDarkRatio = config.BURNT_DARK_RATIO || 0.4;
        const doneBrownRatio = config.DONE_BROWN_RATIO || 0.3;
        const doneAvgR = config.DONE_AVG_R || 120;
        const cookingBrownRatio = config.COOKING_BROWN_RATIO || 0.1;
        const cookingAvgR = config.COOKING_AVG_R || 100;
        
        // Burnt detection
        if (colors.darkRatio > burntDarkRatio) {
            return 'burnt';
        }
        
        // Done detection (golden brown)
        if (colors.brownRatio > doneBrownRatio && colors.avgR > doneAvgR) {
            return 'done';
        }
        
        // Cooking detection
        if (colors.brownRatio > cookingBrownRatio || (colors.avgR > cookingAvgR && colors.avgR > colors.avgG)) {
            return 'cooking';
        }
        
        // Raw
        return 'raw';
    },
    
    // Get cooking stage info
    getStageInfo: function(stageId) {
        const stages = CookMate.CookingStages;
        
        switch (stageId) {
            case 'raw': return stages.RAW;
            case 'cooking': return stages.COOKING;
            case 'done': return stages.DONE;
            case 'burnt': return stages.BURNT;
            default: return stages.RAW;
        }
    },
    
    // Analyze a specific region of interest
    analyzeROI: function(x, y, width, height) {
        const imageData = CookMate.Camera.getROI(x, y, width, height);
        const colors = this.analyzeColors(imageData);
        return this.determineCookingStage(colors);
    },
    
    // Get color analysis for debugging/display
    getColorAnalysis: function() {
        const video = CookMate.Camera.video;
        if (!video || !CookMate.State.cameraActive) {
            return null;
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sampleSize = CookMate.ModelConfig?.COLOR_SAMPLE_SIZE || 100;
        
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        
        const x = (video.videoWidth - sampleSize) / 2;
        const y = (video.videoHeight - sampleSize) / 2;
        
        ctx.drawImage(video, x, y, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize);
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        
        return this.analyzeColors(imageData);
    }
};

console.log('✅ Analyzer module loaded');
