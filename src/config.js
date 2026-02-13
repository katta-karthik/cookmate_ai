/* ============================================
   COOKMATE AI - CONFIGURATION
   ============================================ */

// Global namespace
window.CookMate = window.CookMate || {};

// Configuration Constants
CookMate.Config = {
    // App Info
    APP_NAME: 'CookMate AI',
    VERSION: '2.0.0',
    
    // Detection Settings
    DETECTION_CONFIDENCE: 0.5,
    DETECTION_INTERVAL: 100, // ms between detections
    MAX_DETECTIONS: 20,
    
    // Camera Settings
    CAMERA_WIDTH: 640,
    CAMERA_HEIGHT: 480,
    PREFERRED_CAMERA: 'environment', // 'user' for front camera
    
    // Voice Settings
    VOICE_RATE: 0.9,
    VOICE_PITCH: 1.0,
    VOICE_VOLUME: 1.0,
    
    // Timer Settings
    TIMER_WARNING_THRESHOLD: 30, // seconds
    TIMER_CRITICAL_THRESHOLD: 10, // seconds
    
    // Color Analysis (for cooking stage detection)
    COLOR_SAMPLE_SIZE: 50, // pixels to sample
    BROWN_THRESHOLD: { h: [15, 40], s: [30, 80], l: [20, 50] },
    BURNT_THRESHOLD: { h: [0, 30], s: [10, 50], l: [5, 25] },
    
    // Storage Keys
    STORAGE_KEYS: {
        INGREDIENTS: 'cookmate_ingredients',
        FAVORITES: 'cookmate_favorites',
        HISTORY: 'cookmate_history',
        STATS: 'cookmate_stats',
        SETTINGS: 'cookmate_settings',
        ACHIEVEMENTS: 'cookmate_achievements'
    },
    
    // Achievement Definitions
    ACHIEVEMENTS: {
        FIRST_MEAL: { id: 'first_meal', name: '🥉 First Meal', requirement: 1, type: 'meals' },
        FIVE_RECIPES: { id: 'five_recipes', name: '🥈 5 Recipes', requirement: 5, type: 'recipes' },
        MASTER_CHEF: { id: 'master_chef', name: '🥇 Master Chef', requirement: 20, type: 'meals' },
        WEEK_STREAK: { id: 'week_streak', name: '🔥 Week Streak', requirement: 7, type: 'streak' },
        SPEED_COOK: { id: 'speed_cook', name: '⚡ Speed Cook', requirement: 1, type: 'speed' },
        PERFECTIONIST: { id: 'perfectionist', name: '✨ Perfectionist', requirement: 5, type: 'perfect' }
    }
};

// NOTE: FoodMapping has been moved to js/model/config.js
// This ensures all AI/ML related code is in one place

// Extended Ingredient Database (for manual input matching)
CookMate.IngredientDB = {
    // Vegetables
    'tomato': { emoji: '🍅', category: 'vegetable', aliases: ['tomatoes'] },
    'onion': { emoji: '🧅', category: 'vegetable', aliases: ['onions'] },
    'potato': { emoji: '🥔', category: 'vegetable', aliases: ['potatoes', 'aloo'] },
    'carrot': { emoji: '🥕', category: 'vegetable', aliases: ['carrots'] },
    'broccoli': { emoji: '🥦', category: 'vegetable', aliases: [] },
    'spinach': { emoji: '🥬', category: 'vegetable', aliases: ['palak'] },
    'cabbage': { emoji: '🥬', category: 'vegetable', aliases: ['patta gobhi'] },
    'cauliflower': { emoji: '🥦', category: 'vegetable', aliases: ['gobi'] },
    'capsicum': { emoji: '🫑', category: 'vegetable', aliases: ['bell pepper', 'shimla mirch'] },
    'mushroom': { emoji: '🍄', category: 'vegetable', aliases: ['mushrooms'] },
    'eggplant': { emoji: '🍆', category: 'vegetable', aliases: ['brinjal', 'baingan'] },
    'cucumber': { emoji: '🥒', category: 'vegetable', aliases: ['kheera'] },
    'peas': { emoji: '🟢', category: 'vegetable', aliases: ['matar', 'green peas'] },
    'corn': { emoji: '🌽', category: 'vegetable', aliases: ['maize', 'makka'] },
    'beans': { emoji: '🫘', category: 'vegetable', aliases: ['french beans'] },
    'okra': { emoji: '🥬', category: 'vegetable', aliases: ['bhindi', 'ladyfinger'] },
    
    // Fruits
    'apple': { emoji: '🍎', category: 'fruit', aliases: ['apples'] },
    'banana': { emoji: '🍌', category: 'fruit', aliases: ['bananas', 'kela'] },
    'orange': { emoji: '🍊', category: 'fruit', aliases: ['oranges', 'santra'] },
    'mango': { emoji: '🥭', category: 'fruit', aliases: ['mangoes', 'aam'] },
    'lemon': { emoji: '🍋', category: 'fruit', aliases: ['lemons', 'nimbu'] },
    'grapes': { emoji: '🍇', category: 'fruit', aliases: ['angoor'] },
    
    // Proteins
    'chicken': { emoji: '🍗', category: 'protein', aliases: ['murgh'] },
    'egg': { emoji: '🥚', category: 'protein', aliases: ['eggs', 'anda'] },
    'fish': { emoji: '🐟', category: 'protein', aliases: ['machli'] },
    'mutton': { emoji: '🍖', category: 'protein', aliases: ['lamb', 'gosht'] },
    'paneer': { emoji: '🧀', category: 'protein', aliases: ['cottage cheese'] },
    'tofu': { emoji: '🧈', category: 'protein', aliases: ['bean curd'] },
    'shrimp': { emoji: '🦐', category: 'protein', aliases: ['prawns', 'jhinga'] },
    
    // Grains & Carbs
    'rice': { emoji: '🍚', category: 'grain', aliases: ['chawal'] },
    'bread': { emoji: '🍞', category: 'grain', aliases: ['roti', 'naan'] },
    'pasta': { emoji: '🍝', category: 'grain', aliases: ['noodles'] },
    'flour': { emoji: '🌾', category: 'grain', aliases: ['atta', 'maida'] },
    
    // Dairy
    'milk': { emoji: '🥛', category: 'dairy', aliases: ['doodh'] },
    'butter': { emoji: '🧈', category: 'dairy', aliases: ['makhan'] },
    'cheese': { emoji: '🧀', category: 'dairy', aliases: [] },
    'cream': { emoji: '🥛', category: 'dairy', aliases: ['malai'] },
    'yogurt': { emoji: '🥛', category: 'dairy', aliases: ['curd', 'dahi'] },
    
    // Spices & Aromatics
    'garlic': { emoji: '🧄', category: 'spice', aliases: ['lahsun'] },
    'ginger': { emoji: '🫚', category: 'spice', aliases: ['adrak'] },
    'chili': { emoji: '🌶️', category: 'spice', aliases: ['mirch', 'chilli'] },
    'turmeric': { emoji: '🟡', category: 'spice', aliases: ['haldi'] },
    'cumin': { emoji: '🟤', category: 'spice', aliases: ['jeera'] },
    'coriander': { emoji: '🌿', category: 'spice', aliases: ['dhania'] },
    'mint': { emoji: '🌿', category: 'spice', aliases: ['pudina'] },
    
    // Others
    'oil': { emoji: '🫒', category: 'other', aliases: ['cooking oil', 'tel'] },
    'salt': { emoji: '🧂', category: 'other', aliases: ['namak'] },
    'sugar': { emoji: '🍬', category: 'other', aliases: ['cheeni'] },
    'soy sauce': { emoji: '🥢', category: 'other', aliases: ['soya sauce'] }
};

// NOTE: CookingStages has been moved to js/model/config.js
// This ensures all AI/ML related code is in one place

// Dietary Tags
CookMate.DietaryTags = {
    VEGAN: { id: 'vegan', name: 'Vegan', emoji: '🌱' },
    VEGETARIAN: { id: 'vegetarian', name: 'Vegetarian', emoji: '🥗' },
    NON_VEG: { id: 'non-veg', name: 'Non-Veg', emoji: '🍖' },
    GLUTEN_FREE: { id: 'gluten-free', name: 'Gluten-Free', emoji: '🌾' },
    KETO: { id: 'keto', name: 'Keto', emoji: '🥑' },
    QUICK: { id: 'quick', name: 'Quick', emoji: '⚡' }
};

// Cuisine Types
CookMate.Cuisines = {
    INDIAN: { id: 'indian', name: 'Indian', emoji: '🇮🇳' },
    CHINESE: { id: 'chinese', name: 'Chinese', emoji: '🥡' },
    ITALIAN: { id: 'italian', name: 'Italian', emoji: '🇮🇹' },
    CONTINENTAL: { id: 'continental', name: 'Continental', emoji: '🍽️' },
    MEXICAN: { id: 'mexican', name: 'Mexican', emoji: '🌮' }
};

// Sound Effects URLs (using Web Audio API tones as fallback)
CookMate.SoundDefs = {
    TIMER_TICK: { frequency: 800, duration: 50 },
    TIMER_WARNING: { frequency: 600, duration: 200 },
    TIMER_COMPLETE: { frequency: 1000, duration: 500 },
    STEP_COMPLETE: { frequency: 880, duration: 150 },
    DETECTION: { frequency: 440, duration: 100 },
    ERROR: { frequency: 200, duration: 300 }
};

console.log('✅ CookMate Config loaded');
