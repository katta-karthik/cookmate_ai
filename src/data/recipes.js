/* ============================================
   COOKMATE AI - RECIPE DATABASE
   ============================================ */

CookMate.Recipes = CookMate.Recipes || {};

// Complete Recipe Database
CookMate.RecipeDB = [
    // ==========================================
    // INDIAN CUISINE
    // ==========================================
    {
        id: 1,
        name: "Aloo Gobi",
        emoji: "🥔",
        description: "Classic Indian dry curry with potatoes and cauliflower",
        cuisine: "indian",
        tags: ["vegan", "vegetarian", "gluten-free"],
        difficulty: "Easy",
        time: 25,
        servings: 4,
        calories: 180,
        ingredients: ["potato", "cauliflower", "onion", "tomato", "garlic", "ginger", "turmeric", "cumin", "oil"],
        requiredIngredients: ["potato", "cauliflower"],
        nutrition: { protein: 4, carbs: 28, fat: 6 },
        steps: [
            { text: "Cut potatoes and cauliflower into bite-sized florets", time: 300, stage: "raw" },
            { text: "Heat oil in a pan, add cumin seeds until they splutter", time: 60, stage: "raw" },
            { text: "Add chopped onions, sauté until golden brown (5 mins)", time: 300, stage: "cooking" },
            { text: "Add ginger-garlic paste, cook for 1 minute", time: 60, stage: "cooking" },
            { text: "Add turmeric, red chili powder, and salt", time: 30, stage: "cooking" },
            { text: "Add potatoes first, stir well and cook for 5 minutes", time: 300, stage: "cooking" },
            { text: "Add cauliflower, mix gently, cover and cook on low heat", time: 600, stage: "cooking" },
            { text: "Stir occasionally, cook until vegetables are tender", time: 300, stage: "cooking" },
            { text: "Garnish with fresh coriander and serve hot", time: 60, stage: "done" }
        ]
    },
    {
        id: 2,
        name: "Paneer Bhurji",
        emoji: "🧀",
        description: "Scrambled cottage cheese with spices - quick protein-rich dish",
        cuisine: "indian",
        tags: ["vegetarian", "quick", "gluten-free"],
        difficulty: "Easy",
        time: 15,
        servings: 3,
        calories: 250,
        ingredients: ["paneer", "onion", "tomato", "capsicum", "garlic", "ginger", "chili", "coriander"],
        requiredIngredients: ["paneer", "onion"],
        nutrition: { protein: 18, carbs: 8, fat: 16 },
        steps: [
            { text: "Crumble paneer into small pieces, set aside", time: 120, stage: "raw" },
            { text: "Finely chop onion, tomato, and capsicum", time: 180, stage: "raw" },
            { text: "Heat oil, add cumin and chopped green chilies", time: 30, stage: "cooking" },
            { text: "Add onions, sauté until translucent (3 mins)", time: 180, stage: "cooking" },
            { text: "Add tomatoes, cook until soft and mushy", time: 120, stage: "cooking" },
            { text: "Add turmeric, red chili powder, and salt", time: 30, stage: "cooking" },
            { text: "Add crumbled paneer, mix well on medium heat", time: 180, stage: "cooking" },
            { text: "Add capsicum, cook for 2 more minutes", time: 120, stage: "cooking" },
            { text: "Garnish with coriander, serve with roti or paratha", time: 60, stage: "done" }
        ]
    },
    {
        id: 3,
        name: "Egg Curry",
        emoji: "🥚",
        description: "Boiled eggs in rich, spiced tomato gravy",
        cuisine: "indian",
        tags: ["non-veg", "gluten-free"],
        difficulty: "Medium",
        time: 30,
        servings: 4,
        calories: 220,
        ingredients: ["egg", "onion", "tomato", "garlic", "ginger", "yogurt", "turmeric", "oil"],
        requiredIngredients: ["egg", "onion", "tomato"],
        nutrition: { protein: 14, carbs: 12, fat: 14 },
        steps: [
            { text: "Boil eggs for 10 minutes, peel and make slight cuts", time: 600, stage: "raw" },
            { text: "Blend onions, tomatoes, and ginger-garlic to paste", time: 120, stage: "raw" },
            { text: "Heat oil, add whole spices (bay leaf, cardamom)", time: 60, stage: "cooking" },
            { text: "Add onion-tomato paste, cook until oil separates (8 mins)", time: 480, stage: "cooking" },
            { text: "Add turmeric, coriander, cumin, and chili powder", time: 60, stage: "cooking" },
            { text: "Add whisked yogurt slowly, stir continuously", time: 120, stage: "cooking" },
            { text: "Add water for gravy consistency, bring to boil", time: 180, stage: "cooking" },
            { text: "Add boiled eggs, simmer for 5 minutes", time: 300, stage: "cooking" },
            { text: "Garnish with coriander and serve with rice", time: 60, stage: "done" }
        ]
    },
    {
        id: 4,
        name: "Palak Paneer",
        emoji: "🥬",
        description: "Cottage cheese cubes in creamy spinach gravy",
        cuisine: "indian",
        tags: ["vegetarian", "gluten-free"],
        difficulty: "Medium",
        time: 35,
        servings: 4,
        calories: 280,
        ingredients: ["spinach", "paneer", "onion", "tomato", "garlic", "ginger", "cream", "cumin"],
        requiredIngredients: ["spinach", "paneer"],
        nutrition: { protein: 16, carbs: 14, fat: 18 },
        steps: [
            { text: "Blanch spinach in boiling water for 2 minutes", time: 120, stage: "raw" },
            { text: "Transfer spinach to ice water, then blend to paste", time: 180, stage: "raw" },
            { text: "Cut paneer into cubes, lightly fry until golden", time: 180, stage: "cooking" },
            { text: "In same pan, add cumin and chopped onions", time: 180, stage: "cooking" },
            { text: "Add ginger-garlic paste, sauté for 1 minute", time: 60, stage: "cooking" },
            { text: "Add tomato puree, cook until oil separates", time: 240, stage: "cooking" },
            { text: "Add spinach puree, mix well and simmer", time: 180, stage: "cooking" },
            { text: "Add fried paneer cubes and cream", time: 120, stage: "cooking" },
            { text: "Simmer for 3 minutes, adjust salt and serve", time: 180, stage: "done" }
        ]
    },
    {
        id: 5,
        name: "Dal Tadka",
        emoji: "🍲",
        description: "Yellow lentils with aromatic tempering",
        cuisine: "indian",
        tags: ["vegan", "vegetarian", "gluten-free"],
        difficulty: "Easy",
        time: 30,
        servings: 4,
        calories: 190,
        ingredients: ["lentils", "onion", "tomato", "garlic", "ginger", "cumin", "turmeric", "chili", "coriander"],
        requiredIngredients: ["lentils", "onion"],
        nutrition: { protein: 12, carbs: 30, fat: 4 },
        steps: [
            { text: "Wash lentils thoroughly until water runs clear", time: 120, stage: "raw" },
            { text: "Pressure cook lentils with turmeric and salt (3 whistles)", time: 600, stage: "cooking" },
            { text: "Mash the cooked dal slightly with a ladle", time: 60, stage: "cooking" },
            { text: "For tadka: heat ghee, add cumin and mustard seeds", time: 60, stage: "cooking" },
            { text: "Add chopped garlic, fry until golden", time: 60, stage: "cooking" },
            { text: "Add dried red chilies and curry leaves", time: 30, stage: "cooking" },
            { text: "Add chopped onions, sauté until brown", time: 180, stage: "cooking" },
            { text: "Add tomatoes, cook until soft", time: 120, stage: "cooking" },
            { text: "Pour hot tadka over dal, garnish with coriander", time: 60, stage: "done" }
        ]
    },
    
    // ==========================================
    // CHINESE CUISINE
    // ==========================================
    {
        id: 6,
        name: "Vegetable Fried Rice",
        emoji: "🍚",
        description: "Wok-tossed rice with colorful vegetables",
        cuisine: "chinese",
        tags: ["vegan", "vegetarian", "quick"],
        difficulty: "Easy",
        time: 20,
        servings: 3,
        calories: 320,
        ingredients: ["rice", "carrot", "capsicum", "cabbage", "onion", "garlic", "soy sauce", "oil"],
        requiredIngredients: ["rice", "carrot"],
        nutrition: { protein: 8, carbs: 52, fat: 10 },
        steps: [
            { text: "Use day-old cold rice for best results", time: 0, stage: "raw" },
            { text: "Finely chop all vegetables into small cubes", time: 240, stage: "raw" },
            { text: "Heat wok on high flame, add oil", time: 60, stage: "cooking" },
            { text: "Add minced garlic, stir for 30 seconds", time: 30, stage: "cooking" },
            { text: "Add carrots first, stir-fry for 1 minute", time: 60, stage: "cooking" },
            { text: "Add remaining vegetables, fry on high heat", time: 120, stage: "cooking" },
            { text: "Push vegetables aside, scramble egg if using", time: 60, stage: "cooking" },
            { text: "Add cold rice, break clumps, toss well", time: 180, stage: "cooking" },
            { text: "Add soy sauce, pepper, toss for 2 minutes", time: 120, stage: "cooking" },
            { text: "Garnish with spring onions and serve hot", time: 60, stage: "done" }
        ]
    },
    {
        id: 7,
        name: "Chicken Manchurian",
        emoji: "🍗",
        description: "Indo-Chinese crispy chicken in tangy sauce",
        cuisine: "chinese",
        tags: ["non-veg"],
        difficulty: "Medium",
        time: 35,
        servings: 4,
        calories: 380,
        ingredients: ["chicken", "onion", "capsicum", "garlic", "ginger", "soy sauce", "cornflour", "egg"],
        requiredIngredients: ["chicken", "garlic"],
        nutrition: { protein: 28, carbs: 22, fat: 18 },
        steps: [
            { text: "Cut chicken into bite-sized pieces", time: 180, stage: "raw" },
            { text: "Marinate with soy sauce, cornflour, egg, and salt", time: 300, stage: "raw" },
            { text: "Deep fry chicken until golden and crispy", time: 480, stage: "cooking" },
            { text: "Remove and drain on paper towels", time: 60, stage: "cooking" },
            { text: "In wok, heat oil, add chopped garlic and ginger", time: 60, stage: "cooking" },
            { text: "Add sliced onions and capsicum, stir-fry", time: 120, stage: "cooking" },
            { text: "Add soy sauce, chili sauce, and vinegar", time: 30, stage: "cooking" },
            { text: "Add cornflour slurry to thicken sauce", time: 60, stage: "cooking" },
            { text: "Add fried chicken, toss to coat evenly", time: 120, stage: "cooking" },
            { text: "Garnish with spring onions, serve hot", time: 60, stage: "done" }
        ]
    },
    {
        id: 8,
        name: "Vegetable Noodles",
        emoji: "🍜",
        description: "Stir-fried noodles with crunchy vegetables",
        cuisine: "chinese",
        tags: ["vegan", "vegetarian", "quick"],
        difficulty: "Easy",
        time: 20,
        servings: 3,
        calories: 350,
        ingredients: ["noodles", "cabbage", "carrot", "capsicum", "onion", "garlic", "soy sauce"],
        requiredIngredients: ["noodles", "cabbage"],
        nutrition: { protein: 10, carbs: 48, fat: 12 },
        steps: [
            { text: "Boil noodles as per package, drain and toss with oil", time: 420, stage: "raw" },
            { text: "Julienne all vegetables into thin strips", time: 240, stage: "raw" },
            { text: "Heat wok on high flame until smoking", time: 60, stage: "cooking" },
            { text: "Add oil, then minced garlic", time: 30, stage: "cooking" },
            { text: "Add carrots, stir-fry for 1 minute", time: 60, stage: "cooking" },
            { text: "Add cabbage, capsicum, and onions", time: 90, stage: "cooking" },
            { text: "Stir-fry vegetables for 2 minutes on high heat", time: 120, stage: "cooking" },
            { text: "Add noodles, toss with vegetables", time: 60, stage: "cooking" },
            { text: "Add soy sauce, vinegar, and pepper", time: 60, stage: "cooking" },
            { text: "Toss well for 2 minutes, serve immediately", time: 120, stage: "done" }
        ]
    },
    
    // ==========================================
    // QUICK & EASY
    // ==========================================
    {
        id: 9,
        name: "Tomato Egg Stir-Fry",
        emoji: "🍳",
        description: "Simple Chinese-style eggs with juicy tomatoes",
        cuisine: "chinese",
        tags: ["vegetarian", "quick", "gluten-free"],
        difficulty: "Easy",
        time: 10,
        servings: 2,
        calories: 180,
        ingredients: ["egg", "tomato", "onion", "garlic", "oil", "salt"],
        requiredIngredients: ["egg", "tomato"],
        nutrition: { protein: 12, carbs: 8, fat: 12 },
        steps: [
            { text: "Beat eggs with pinch of salt", time: 60, stage: "raw" },
            { text: "Cut tomatoes into wedges", time: 90, stage: "raw" },
            { text: "Heat oil in pan, scramble eggs until just set", time: 90, stage: "cooking" },
            { text: "Remove eggs, set aside", time: 30, stage: "cooking" },
            { text: "In same pan, add garlic and onions", time: 60, stage: "cooking" },
            { text: "Add tomatoes, cook until slightly soft", time: 180, stage: "cooking" },
            { text: "Return eggs, gently mix together", time: 60, stage: "cooking" },
            { text: "Season with salt and sugar, serve hot", time: 30, stage: "done" }
        ]
    },
    {
        id: 10,
        name: "Classic Omelette",
        emoji: "🥚",
        description: "Fluffy eggs with your choice of fillings",
        cuisine: "continental",
        tags: ["vegetarian", "quick", "gluten-free", "keto"],
        difficulty: "Easy",
        time: 8,
        servings: 1,
        calories: 220,
        ingredients: ["egg", "onion", "tomato", "capsicum", "cheese", "butter"],
        requiredIngredients: ["egg"],
        nutrition: { protein: 14, carbs: 4, fat: 18 },
        steps: [
            { text: "Beat 2-3 eggs with salt and pepper", time: 60, stage: "raw" },
            { text: "Finely dice onion, tomato, and capsicum", time: 120, stage: "raw" },
            { text: "Heat butter in non-stick pan over medium heat", time: 60, stage: "cooking" },
            { text: "Pour beaten eggs, let bottom set (30 secs)", time: 30, stage: "cooking" },
            { text: "Gently push edges, tilt pan for uncooked egg", time: 60, stage: "cooking" },
            { text: "When mostly set, add fillings to one half", time: 30, stage: "cooking" },
            { text: "Fold omelette in half", time: 15, stage: "cooking" },
            { text: "Slide onto plate, serve immediately", time: 15, stage: "done" }
        ]
    },
    {
        id: 11,
        name: "Garlic Butter Vegetables",
        emoji: "🧄",
        description: "Quick sautéed vegetables in fragrant garlic butter",
        cuisine: "continental",
        tags: ["vegetarian", "quick", "gluten-free", "keto"],
        difficulty: "Easy",
        time: 12,
        servings: 2,
        calories: 150,
        ingredients: ["broccoli", "carrot", "mushroom", "garlic", "butter", "salt"],
        requiredIngredients: ["garlic", "butter"],
        nutrition: { protein: 4, carbs: 12, fat: 10 },
        steps: [
            { text: "Cut vegetables into even-sized pieces", time: 180, stage: "raw" },
            { text: "Mince garlic finely", time: 60, stage: "raw" },
            { text: "Melt butter in large pan over medium heat", time: 60, stage: "cooking" },
            { text: "Add garlic, sauté until fragrant (30 secs)", time: 30, stage: "cooking" },
            { text: "Add vegetables, season with salt and pepper", time: 60, stage: "cooking" },
            { text: "Toss and cook for 5-7 minutes", time: 420, stage: "cooking" },
            { text: "Vegetables should be tender-crisp", time: 60, stage: "cooking" },
            { text: "Add herbs if desired, serve hot", time: 30, stage: "done" }
        ]
    },
    {
        id: 12,
        name: "Mushroom Stir-Fry",
        emoji: "🍄",
        description: "Quick and healthy mushroom sauté",
        cuisine: "continental",
        tags: ["vegan", "vegetarian", "quick", "gluten-free", "keto"],
        difficulty: "Easy",
        time: 10,
        servings: 2,
        calories: 120,
        ingredients: ["mushroom", "garlic", "onion", "butter", "soy sauce", "pepper"],
        requiredIngredients: ["mushroom"],
        nutrition: { protein: 6, carbs: 8, fat: 8 },
        steps: [
            { text: "Clean and slice mushrooms evenly", time: 120, stage: "raw" },
            { text: "Slice onions and mince garlic", time: 90, stage: "raw" },
            { text: "Heat butter in pan on high heat", time: 60, stage: "cooking" },
            { text: "Add mushrooms in single layer, don't stir yet", time: 120, stage: "cooking" },
            { text: "Let mushrooms brown, then flip (2 mins)", time: 120, stage: "cooking" },
            { text: "Add garlic and onions, stir-fry", time: 90, stage: "cooking" },
            { text: "Add soy sauce and pepper", time: 30, stage: "cooking" },
            { text: "Toss well and serve immediately", time: 30, stage: "done" }
        ]
    },
    
    // ==========================================
    // MORE INDIAN RECIPES
    // ==========================================
    {
        id: 13,
        name: "Jeera Aloo",
        emoji: "🥔",
        description: "Cumin-spiced potatoes - simple comfort food",
        cuisine: "indian",
        tags: ["vegan", "vegetarian", "quick", "gluten-free"],
        difficulty: "Easy",
        time: 18,
        servings: 3,
        calories: 200,
        ingredients: ["potato", "cumin", "chili", "turmeric", "coriander", "oil"],
        requiredIngredients: ["potato", "cumin"],
        nutrition: { protein: 3, carbs: 32, fat: 8 },
        steps: [
            { text: "Boil potatoes until just cooked, peel and cube", time: 600, stage: "raw" },
            { text: "Heat oil in pan, add cumin seeds", time: 60, stage: "cooking" },
            { text: "When cumin splutters, add green chilies", time: 30, stage: "cooking" },
            { text: "Add potato cubes, sauté on medium heat", time: 180, stage: "cooking" },
            { text: "Add turmeric, red chili powder, and salt", time: 30, stage: "cooking" },
            { text: "Toss potatoes until well coated and crispy edges", time: 240, stage: "cooking" },
            { text: "Garnish with fresh coriander", time: 30, stage: "done" }
        ]
    },
    {
        id: 14,
        name: "Bhindi Masala",
        emoji: "🥬",
        description: "Spiced okra stir-fry - no sliminess guaranteed",
        cuisine: "indian",
        tags: ["vegan", "vegetarian", "gluten-free"],
        difficulty: "Medium",
        time: 25,
        servings: 3,
        calories: 160,
        ingredients: ["okra", "onion", "tomato", "garlic", "turmeric", "cumin", "coriander"],
        requiredIngredients: ["okra", "onion"],
        nutrition: { protein: 4, carbs: 18, fat: 8 },
        steps: [
            { text: "Wash okra, dry completely, then slice", time: 300, stage: "raw" },
            { text: "Heat oil, add okra and fry until crisp (8 mins)", time: 480, stage: "cooking" },
            { text: "Remove okra, set aside", time: 30, stage: "cooking" },
            { text: "In same oil, add cumin seeds", time: 30, stage: "cooking" },
            { text: "Add onions, sauté until golden", time: 180, stage: "cooking" },
            { text: "Add tomatoes and all spices", time: 120, stage: "cooking" },
            { text: "Return fried okra, mix gently", time: 60, stage: "cooking" },
            { text: "Cover and cook for 2 minutes", time: 120, stage: "cooking" },
            { text: "Garnish with coriander and serve", time: 30, stage: "done" }
        ]
    },
    {
        id: 15,
        name: "Vegetable Pulao",
        emoji: "🍚",
        description: "Fragrant rice cooked with mixed vegetables",
        cuisine: "indian",
        tags: ["vegan", "vegetarian"],
        difficulty: "Medium",
        time: 30,
        servings: 4,
        calories: 280,
        ingredients: ["rice", "carrot", "peas", "beans", "onion", "cumin", "bay leaf", "ghee"],
        requiredIngredients: ["rice", "carrot"],
        nutrition: { protein: 6, carbs: 48, fat: 8 },
        steps: [
            { text: "Wash and soak rice for 20 minutes", time: 1200, stage: "raw" },
            { text: "Chop all vegetables into small pieces", time: 180, stage: "raw" },
            { text: "Heat ghee, add whole spices (cumin, bay leaf)", time: 60, stage: "cooking" },
            { text: "Add sliced onions, fry until golden", time: 240, stage: "cooking" },
            { text: "Add vegetables, sauté for 3 minutes", time: 180, stage: "cooking" },
            { text: "Add drained rice, gently sauté for 2 minutes", time: 120, stage: "cooking" },
            { text: "Add water (1:1.5 ratio), salt, bring to boil", time: 180, stage: "cooking" },
            { text: "Cover and cook on low heat for 15 minutes", time: 900, stage: "cooking" },
            { text: "Let rest 5 mins, fluff with fork and serve", time: 300, stage: "done" }
        ]
    }
];

// Recipe utility functions
CookMate.Recipes.getAll = function() {
    return CookMate.RecipeDB;
};

CookMate.Recipes.getById = function(id) {
    return CookMate.RecipeDB.find(r => r.id === id);
};

CookMate.Recipes.getByCuisine = function(cuisine) {
    return CookMate.RecipeDB.filter(r => r.cuisine === cuisine);
};

CookMate.Recipes.getByTag = function(tag) {
    return CookMate.RecipeDB.filter(r => r.tags.includes(tag));
};

CookMate.Recipes.getQuick = function() {
    return CookMate.RecipeDB.filter(r => r.time <= 15);
};

console.log(`✅ Recipe database loaded: ${CookMate.RecipeDB.length} recipes`);
