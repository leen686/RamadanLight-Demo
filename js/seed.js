/* Sample data for the Ramadan Light demo (fictional). */
window.RL_SEED = {
 "categories": [
  {
   "id": 1,
   "categoryName": "Iftar"
  },
  {
   "id": 2,
   "categoryName": "Suhoor"
  },
  {
   "id": 3,
   "categoryName": "Snacks"
  }
 ],
 "users": [
  {
   "id": 1,
   "userType": "admin",
   "firstName": "Noura",
   "lastName": "Alharbi",
   "emailAddress": "admin@ramadanlight.demo",
   "password": "demo1234",
   "photoFileName": "avatar.png"
  },
  {
   "id": 2,
   "userType": "user",
   "firstName": "Lina",
   "lastName": "Osama",
   "emailAddress": "lina@ramadanlight.demo",
   "password": "demo1234",
   "photoFileName": "Lina Osama.png"
  },
  {
   "id": 3,
   "userType": "user",
   "firstName": "Razan",
   "lastName": "Faisal",
   "emailAddress": "razan@ramadanlight.demo",
   "password": "demo1234",
   "photoFileName": "Razan Faisal.png"
  },
  {
   "id": 4,
   "userType": "user",
   "firstName": "Sami",
   "lastName": "Ahmed",
   "emailAddress": "sami@ramadanlight.demo",
   "password": "demo1234",
   "photoFileName": "Sami Ahmed.png"
  },
  {
   "id": 5,
   "userType": "user",
   "firstName": "Abdullah",
   "lastName": "Ali",
   "emailAddress": "abdullah@ramadanlight.demo",
   "password": "demo1234",
   "photoFileName": "Abdullah Ali.png"
  }
 ],
 "blockedUsers": [],
 "recipes": [
  {
   "id": 1,
   "userID": 3,
   "categoryID": 1,
   "name": "Creamy Lemon Pasta with Shrimp",
   "description": "A light, zesty pasta with juicy shrimp and a creamy lemon sauce — comforting enough for Iftar without feeling heavy.",
   "photoFileName": "recipe_1_Creamy Lemon Pasta with Shrimp.webp",
   "videoFilePath": "recipe_1_Lemon Shrimp Pasta.mp4",
   "ingredients": [
    [
     "Whole-wheat pasta",
     "250 g"
    ],
    [
     "Shrimp, peeled",
     "300 g"
    ],
    [
     "Garlic, minced",
     "3 cloves"
    ],
    [
     "Light cooking cream",
     "1 cup"
    ],
    [
     "Lemon (juice and zest)",
     "1"
    ],
    [
     "Fresh parsley",
     "2 tbsp"
    ],
    [
     "Olive oil",
     "1 tbsp"
    ]
   ],
   "steps": [
    "Cook the pasta in salted water until al dente, then drain.",
    "Sauté the garlic in olive oil, add the shrimp and cook until pink.",
    "Stir in the cream, lemon juice and zest and simmer for 2 minutes.",
    "Toss the pasta in the sauce and finish with parsley."
   ]
  },
  {
   "id": 2,
   "userID": 2,
   "categoryID": 1,
   "name": "Creamy Rotisserie Chicken Salad",
   "description": "Shredded rotisserie chicken in a light yogurt dressing with crunchy celery and grapes — a refreshing Iftar plate.",
   "photoFileName": "recipe_2_Creamy Rotisserie Chicken Salad.jpg",
   "videoFilePath": "",
   "ingredients": [
    [
     "Rotisserie chicken, shredded",
     "2 cups"
    ],
    [
     "Greek yogurt",
     "1/2 cup"
    ],
    [
     "Celery, chopped",
     "2 stalks"
    ],
    [
     "Red grapes, halved",
     "1 cup"
    ],
    [
     "Lemon juice",
     "1 tbsp"
    ],
    [
     "Salt and pepper",
     "To taste"
    ]
   ],
   "steps": [
    "Whisk the yogurt, lemon juice, salt and pepper.",
    "Add the chicken, celery and grapes.",
    "Mix gently and chill for 15 minutes before serving."
   ]
  },
  {
   "id": 3,
   "userID": 4,
   "categoryID": 3,
   "name": "Energy Balls",
   "description": "No-bake date and oat bites packed with natural energy — the perfect light snack between Iftar and Suhoor.",
   "photoFileName": "recipe_3_Energy Balls.webp",
   "videoFilePath": "",
   "ingredients": [
    [
     "Dates, pitted",
     "1 cup"
    ],
    [
     "Rolled oats",
     "1 cup"
    ],
    [
     "Peanut butter",
     "1/3 cup"
    ],
    [
     "Chia seeds",
     "1 tbsp"
    ],
    [
     "Desiccated coconut",
     "2 tbsp"
    ]
   ],
   "steps": [
    "Blend the dates into a smooth paste.",
    "Mix in the oats, peanut butter and chia seeds.",
    "Roll into small balls and coat with coconut.",
    "Refrigerate for 30 minutes."
   ]
  },
  {
   "id": 4,
   "userID": 2,
   "categoryID": 2,
   "name": "Veggie & Hummus Sandwich",
   "description": "Whole-grain bread layered with creamy hummus and fresh vegetables — filling, steady fuel for Suhoor.",
   "photoFileName": "recipe_4_Veggie & Hummus Sandwich.jpg",
   "videoFilePath": "",
   "ingredients": [
    [
     "Whole-grain bread",
     "2 slices"
    ],
    [
     "Hummus",
     "3 tbsp"
    ],
    [
     "Cucumber, sliced",
     "1/2"
    ],
    [
     "Tomato, sliced",
     "1"
    ],
    [
     "Baby spinach",
     "1 handful"
    ],
    [
     "Avocado, sliced",
     "1/2"
    ]
   ],
   "steps": [
    "Spread hummus on both slices of bread.",
    "Layer the spinach, cucumber, tomato and avocado.",
    "Close the sandwich and cut in half."
   ]
  },
  {
   "id": 5,
   "userID": 5,
   "categoryID": 1,
   "name": "Wild Rice Mushroom Soup",
   "description": "A warm, hearty soup of wild rice and mushrooms — a gentle way to break your fast.",
   "photoFileName": "recipe_5_wild rice mushroom soup.jpg",
   "videoFilePath": "",
   "ingredients": [
    [
     "Wild rice",
     "1/2 cup"
    ],
    [
     "Mushrooms, sliced",
     "250 g"
    ],
    [
     "Onion, diced",
     "1"
    ],
    [
     "Carrot, diced",
     "1"
    ],
    [
     "Vegetable broth",
     "5 cups"
    ],
    [
     "Fresh thyme",
     "1 tsp"
    ]
   ],
   "steps": [
    "Sauté the onion and carrot until soft.",
    "Add the mushrooms and cook for 5 minutes.",
    "Pour in the broth, add the wild rice and thyme.",
    "Simmer for 40 minutes until the rice is tender."
   ]
  }
 ],
 "likes": [
  [
   2,
   1
  ],
  [
   4,
   1
  ],
  [
   5,
   1
  ],
  [
   3,
   2
  ],
  [
   4,
   2
  ],
  [
   2,
   3
  ],
  [
   3,
   3
  ],
  [
   5,
   4
  ],
  [
   3,
   5
  ]
 ],
 "favourites": [
  [
   2,
   1
  ],
  [
   2,
   3
  ]
 ],
 "comments": [
  {
   "id": 1,
   "recipeID": 1,
   "userID": 4,
   "comment": "Made this for Iftar yesterday — the lemon makes it so fresh!",
   "date": "2026-03-02"
  },
  {
   "id": 2,
   "recipeID": 1,
   "userID": 2,
   "comment": "Loved it, I used less cream and it was still great.",
   "date": "2026-03-04"
  },
  {
   "id": 3,
   "recipeID": 3,
   "userID": 3,
   "comment": "Perfect snack after Taraweeh.",
   "date": "2026-03-05"
  },
  {
   "id": 4,
   "recipeID": 2,
   "userID": 5,
   "comment": "Simple and tasty, thank you!",
   "date": "2026-03-06"
  }
 ],
 "reports": [
  {
   "id": 1,
   "userID": 4,
   "recipeID": 5
  }
 ]
};
