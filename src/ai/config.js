/* ============================================
   COOKMATE AI - MODEL CONFIGURATION
   AI/ML related configurations and mappings
   ============================================ */

// Ensure CookMate namespace exists
window.CookMate = window.CookMate || {};

// Model Configuration
CookMate.ModelConfig = {
    // Model Settings - using 'lite_mobilenet_v2' for faster loading
    // Options: 'lite_mobilenet_v2' (fastest), 'mobilenet_v1', 'mobilenet_v2' (most accurate)
    MODEL_BASE: 'lite_mobilenet_v2',
    DETECTION_CONFIDENCE: 0.5,
    DETECTION_INTERVAL: 100, // ms between detections
    MAX_DETECTIONS: 20,
    
    // Color Analysis Settings (for cooking stage detection)
    COLOR_SAMPLE_SIZE: 50, // pixels to sample
    BROWN_THRESHOLD: { h: [15, 40], s: [30, 80], l: [20, 50] },
    BURNT_THRESHOLD: { h: [0, 30], s: [10, 50], l: [5, 25] },
    
    // Cooking Stage Thresholds
    BURNT_DARK_RATIO: 0.4,
    DONE_BROWN_RATIO: 0.3,
    DONE_AVG_R: 120,
    COOKING_BROWN_RATIO: 0.1,
    COOKING_AVG_R: 100
};

// Food/Ingredient Mapping from COCO-SSD detectable objects
CookMate.FoodMapping = {
    // Direct mappings from COCO-SSD labels
    'apple': { name: 'Apple', emoji: '🍎', category: 'fruit' },
    'orange': { name: 'Orange', emoji: '🍊', category: 'fruit' },
    'banana': { name: 'Banana', emoji: '🍌', category: 'fruit' },
    'broccoli': { name: 'Broccoli', emoji: '🥦', category: 'vegetable' },
    'carrot': { name: 'Carrot', emoji: '🥕', category: 'vegetable' },
    'hot dog': { name: 'Sausage', emoji: '🌭', category: 'protein' },
    'pizza': { name: 'Pizza', emoji: '🍕', category: 'prepared' },
    'donut': { name: 'Donut', emoji: '🍩', category: 'dessert' },
    'cake': { name: 'Cake', emoji: '🍰', category: 'dessert' },
    'sandwich': { name: 'Sandwich', emoji: '🥪', category: 'prepared' },
    
    // Kitchenware detection (context clues)
    'bowl': { name: 'Bowl', emoji: '🥣', category: 'utensil' },
    'bottle': { name: 'Bottle', emoji: '🍶', category: 'utensil' },
    'wine glass': { name: 'Glass', emoji: '🍷', category: 'utensil' },
    'cup': { name: 'Cup', emoji: '☕', category: 'utensil' },
    'fork': { name: 'Fork', emoji: '🍴', category: 'utensil' },
    'knife': { name: 'Knife', emoji: '🔪', category: 'utensil' },
    'spoon': { name: 'Spoon', emoji: '🥄', category: 'utensil' }
};

// Cooking Stage Definitions
CookMate.CookingStages = {
    RAW: {
        id: 'raw',
        name: 'Raw',
        emoji: '🥩',
        colorRange: { h: [0, 360], s: [40, 100], l: [50, 80] },
        description: 'Ingredients not yet cooked'
    },
    COOKING: {
        id: 'cooking',
        name: 'Cooking',
        emoji: '🍳',
        colorRange: { h: [30, 60], s: [30, 70], l: [40, 60] },
        description: 'Food is being cooked, color changing'
    },
    DONE: {
        id: 'done',
        name: 'Done',
        emoji: '✅',
        colorRange: { h: [20, 45], s: [40, 80], l: [30, 50] },
        description: 'Food is properly cooked, golden brown'
    },
    BURNT: {
        id: 'burnt',
        name: 'Burnt',
        emoji: '🔥',
        colorRange: { h: [0, 30], s: [20, 60], l: [10, 30] },
        description: 'Food is overcooked or burning'
    }
};

console.log('✅ Model Config loaded');
