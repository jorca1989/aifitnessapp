import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../config/api';
import { 
  Search, 
  Heart, 
  Clock, 
  Users, 
  ChefHat,
  Star,
  Bookmark,
  Filter,
  Plus,
  X,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

interface Recipe {
  id: number;
  title?: string;
  name?: string;
  image?: string;
  cookTime?: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  rating?: number;
  reviews?: number;
  ingredients?: string[];
  instructions?: string[];
  saved?: boolean;
  category?: string;
}

const Recipes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<number[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCurrentDate, addFoodEntry } = useUser();
  const [showLogModal, setShowLogModal] = useState(false);
  const [logRecipe, setLogRecipe] = useState<Recipe | null>(null);
  const [logMeal, setLogMeal] = useState('Lunch');
  const [logQuantity, setLogQuantity] = useState(1);
  const [logSuccess, setLogSuccess] = useState(false);
  const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Vegetarian', 'High Protein', 'Low Carb'];

  // Fetch recipes from API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.RECIPES, {
          params: {
            category: selectedCategory,
            search: searchQuery
          }
        });
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        // Fallback to empty array if API fails
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory, searchQuery]);

  const toggleSaveRecipe = (recipeId: number) => {
    setSavedRecipes(prev => 
      prev.includes(recipeId) 
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleLogRecipe = (recipe: Recipe) => {
    setLogRecipe(recipe);
    setShowLogModal(true);
    setLogMeal('Lunch');
    setLogQuantity(1);
    setLogSuccess(false);
  };

  const handleLogSubmit = () => {
    if (!logRecipe) return;
    addFoodEntry({
      id: `${logRecipe.id}-${Date.now()}`,
      foodId: logRecipe.id,
      name: logRecipe.title || logRecipe.name || 'Recipe',
      calories: logRecipe.calories,
      protein: logRecipe.protein,
      carbs: logRecipe.carbs,
      fat: logRecipe.fat,
      quantity: logQuantity,
      meal: logMeal,
      date: getCurrentDate(),
    });
    setLogSuccess(true);
    setTimeout(() => {
      setShowLogModal(false);
      setLogRecipe(null);
    }, 1200);
  };

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Recipe Detail View */}
        <div className="px-6 pt-12 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <button
              onClick={() => setSelectedRecipe(null)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span>Back to Recipes</span>
            </button>
            <button
              onClick={() => toggleSaveRecipe(selectedRecipe.id)}
              className={`p-3 rounded-full shadow-lg transition-colors ${
                savedRecipes.includes(selectedRecipe.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:text-red-500'
              }`}
            >
              <Heart size={20} fill={savedRecipes.includes(selectedRecipe.id) ? 'currentColor' : 'none'} />
            </button>
          </motion.div>

          {/* Recipe Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            {selectedRecipe.image ? (
            <img
              src={selectedRecipe.image}
                alt={selectedRecipe.title || selectedRecipe.name || 'Recipe'}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                <ChefHat className="text-gray-400" size={48} />
              </div>
            )}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedRecipe.title || selectedRecipe.name}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              {selectedRecipe.rating && (
              <div className="flex items-center space-x-1">
                <Star className="text-yellow-500 fill-current" size={16} />
                <span className="text-sm font-medium">{selectedRecipe.rating}</span>
                  <span className="text-sm text-gray-500">({selectedRecipe.reviews || 0} reviews)</span>
              </div>
              )}
              {selectedRecipe.cookTime && (
              <div className="flex items-center space-x-1">
                <Clock className="text-gray-500" size={16} />
                <span className="text-sm text-gray-600">{selectedRecipe.cookTime} min</span>
              </div>
              )}
              <div className="flex items-center space-x-1">
                <Users className="text-gray-500" size={16} />
                <span className="text-sm text-gray-600">{selectedRecipe.servings} servings</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedRecipe.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Nutrition Facts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Facts (per serving)</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{selectedRecipe.calories}</p>
                <p className="text-sm text-gray-600">Calories</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{selectedRecipe.protein}g</p>
                <p className="text-sm text-gray-600">Protein</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{selectedRecipe.carbs}g</p>
                <p className="text-sm text-gray-600">Carbs</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{selectedRecipe.fat}g</p>
                <p className="text-sm text-gray-600">Fat</p>
              </div>
            </div>
          </motion.div>

          {/* Ingredients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingredients</h3>
            <ul className="space-y-2">
              {selectedRecipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructions</h3>
            <ol className="space-y-4">
              {selectedRecipe.instructions?.map((instruction, index) => (
                <li key={index} className="flex space-x-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </motion.div>

          <button
            onClick={() => handleLogRecipe(selectedRecipe)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-base hover:bg-blue-700"
          >
            Log to Meal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Recipes</h1>
            <p className="text-gray-600">Healthy & delicious meal ideas</p>
          </div>
          <Link
            to="/fuel"
            className="bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors"
          >
            <Plus size={24} />
          </Link>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading delicious recipes...</p>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {recipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative">
                  {recipe.image ? (
                  <img
                    src={recipe.image}
                      alt={recipe.title || recipe.name || 'Recipe'}
                    className="w-full h-48 object-cover"
                  />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <ChefHat className="text-gray-400" size={32} />
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveRecipe(recipe.id);
                    }}
                    className={`absolute top-3 right-3 w-10 h-10 rounded-full shadow-lg transition-colors ${
                      savedRecipes.includes(recipe.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-600 hover:text-red-500'
                    }`}
                  >
                    <Heart size={16} fill={savedRecipes.includes(recipe.id) ? 'currentColor' : 'none'} className="mx-auto" />
                  </button>
                  {recipe.difficulty && (
                  <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.difficulty === 'Easy' ? 'bg-green-500 text-white' :
                      recipe.difficulty === 'Medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {recipe.difficulty}
                    </span>
                  </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.title || recipe.name}</h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      {recipe.cookTime && (
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{recipe.cookTime}m</span>
                      </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Users size={14} />
                        <span>{recipe.servings}</span>
                      </div>
                    </div>
                    {recipe.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="text-yellow-500 fill-current" size={14} />
                      <span className="text-sm font-medium">{recipe.rating}</span>
                    </div>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                    <div>
                      <p className="font-bold text-blue-600">{recipe.calories}</p>
                      <p className="text-gray-500">cal</p>
                    </div>
                    <div>
                      <p className="font-bold text-red-600">{recipe.protein}g</p>
                      <p className="text-gray-500">protein</p>
                    </div>
                    <div>
                      <p className="font-bold text-green-600">{recipe.carbs}g</p>
                      <p className="text-gray-500">carbs</p>
                    </div>
                    <div>
                      <p className="font-bold text-yellow-600">{recipe.fat}g</p>
                      <p className="text-gray-500">fat</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {(recipe.tags || []).slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {recipe.tags && recipe.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{recipe.tags.length - 2}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogRecipe(recipe);
                    }}
                    className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Log to Meal
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="text-center py-12">
            <ChefHat className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No recipes found matching your criteria</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Log to Meal Modal */}
      {showLogModal && logRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Log Recipe to Meal</h3>
            <div className="mb-2 text-gray-700 font-medium">{logRecipe.title || logRecipe.name}</div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Meal</label>
              <select
                value={logMeal}
                onChange={e => setLogMeal(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              >
                {mealOptions.map(meal => (
                  <option key={meal} value={meal}>{meal}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={logQuantity}
                onChange={e => setLogQuantity(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            {logSuccess ? (
              <div className="text-green-600 font-semibold text-center mb-2">Logged!</div>
            ) : (
              <button
                onClick={handleLogSubmit}
                className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Log
              </button>
            )}
            <button
              onClick={() => setShowLogModal(false)}
              className="w-full mt-2 py-2 border border-gray-300 rounded-lg font-medium text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;