import { API_URL, KEY, RES_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);

    // console.log(data.data.recipe);
    // let recipe = data.data.recipe;

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
    // console.log(state.recipe);
  } catch (error) {
    // Temp error handling
    console.error(`${error} ✴✴✴🔯✴✴`);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
    // console.log(state.search.results);
    // console.log(state.search.query);
  } catch (error) {
    console.error(`${error} ✴✴✴🔯✴✴`);
    throw error;
  }
};

// !Pagination function

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;

  // const start = (page - 1) * 5; // 0;
  // const end = page * 5; //5;
  const start = (page - 1) * state.search.resultPerPage; // 0;
  const end = page * state.search.resultPerPage; //5;

  //? slice method doeny include last value means end will go only until 4
  //?  start from 0 and end at 4
  return state.search.results.slice(start, end);
};

/////////////////////////////////////////////////////////

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    // e.g changing from 4 serving to 8 serving
    //? new Quantity = (oldQuantity*8)/4
    // new Quantity = oldQuantity * newServings/ oldServings
  });

  state.recipe.servings = newServings;
};

//! Local storage

export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //!  add BookMark
  state.bookmarks.push(recipe);

  // !Mark Current Recipe as BookMark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};
export const deleteBookmark = function (id) {
  // ! DELETE BookMark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // !Mark Current Recipe as NOT BookMark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

//! take out from local storage

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
console.log(state.bookmarks);

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3) throw new Error('Wrong ingredient format');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};
