//! Polyfilling for old browser(Everything)
import 'core-js/stable';
//! polyfilling for async-await
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config';
import {
  addBookmark,
  deleteBookmark,
  getSearchResultPage,
  loadSearchResult,
  updateServings,
  uploadRecipe,
} from './model';
// import * as model from './model.js';
import { loadRecipe, state } from './model.js';
import AddRecipeView from './views/addRecipeView';
import BookmarksView from './views/bookmarksViewR';
import PaginationView from './views/paginationView';
import RecipeView from './views/recipeView.js';
import ResultsView from './views/resultsViewR';
import SearchView from './views/searchView';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

// ! Render Recipe
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    RecipeView.renderSpinner();

    //? update results view to mark selected search result
    ResultsView.update(getSearchResultPage());

    // ? Loading Recipe
    // await model.loadRecipe(id);
    await loadRecipe(id);
    // const recipe = model.state.recipe;
    // const { recipe } = state;

    // ! Rendering Recipe

    RecipeView.render(state.recipe);
    // RecipeView.render(state.recipe);

    // 3) updationg bookmark views
    // BookmarksView.update(state.bookmarks);
    BookmarksView.render(state.bookmarks);
  } catch (error) {
    // alert('Error: ' + error);
    // console.log(error);
    RecipeView.renderError();
  }
};

// ! search result rendering

const controlSearchResults = async function () {
  try {
    ResultsView.renderSpinner();
    // 1) get Search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load Search
    await loadSearchResult(query);

    // 3) Render results
    // console.log(state.search.results);
    // ! all results
    // ResultsView.render(state.search.results);

    // ! some result according to pagination
    ResultsView.render(getSearchResultPage());

    // 4) Render initial pagination buttons
    PaginationView.render(state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render New  results
  // ! some result according to pagination
  ResultsView.render(getSearchResultPage(goToPage));

  // 4) Render New  pagination buttons
  PaginationView.render(state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  updateServings(newServings);

  // Update the recipe view
  RecipeView.update(state.recipe);
};

const controlAddBookmark = function () {
  // 1) ADD/ REMOVE bookmark

  if (!state.recipe.bookmarked) {
    addBookmark(state.recipe);
  } else {
    deleteBookmark(state.recipe.id);
  }
  // console.log(state.recipe);

  // 2) Update Recipe View
  RecipeView.update(state.recipe);

  // 3) Render Bookmarks
  BookmarksView.render(state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    AddRecipeView.renderSpinner();
    // console.log(newRecipe);
    // upload new Recipe data
    await uploadRecipe(newRecipe);
    console.log(state.recipe);

    // Render Recipe
    RecipeView.render(state.recipe);

    // Success Message
    AddRecipeView.renderMessage();

    // render Bookmark Views
    BookmarksView.render(state.bookmarks);

    // change id in url
    // window.history.pushState('state','title','url');
    window.history.pushState(null, '', `#${state.recipe.id}`);

    // close Form window

    setTimeout(function () {
      AddRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('💥', error);
    AddRecipeView.renderError(error.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

const init = function () {
  RecipeView.addHandlerRender(controlRecipes);
  RecipeView.addHandlerUpdateServings(controlServings);
  RecipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  PaginationView.addHandlerClick(controlPagination);
  AddRecipeView.addhandlerUpload(controlAddRecipe);
  newFeature();
  AddRecipeView;
};
init();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
