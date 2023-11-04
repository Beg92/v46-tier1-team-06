// DOM elements to listen to
const searchForm = document.querySelector('form.search-form');
const searchBtn = document.querySelector(".search-form__search-button");
const refreshButton = document.querySelector("#refresh-button");

// DOM elements to get user input from
const searchBarInput = document.querySelector('#search-bar');

// DOM element recieving data
const recipeList = document.querySelector("#search-results");

// DOM elements to hide and unhide
const landingPage = document.querySelector("#landing-page");
const searchResults = document.querySelector("#search-results-container");

// Constants needed for fetching from the TastyAPI
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'f3bd08de05mshbc74d5d0d7c6b6ep11586ejsn91973fbdea76',
		'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
	}
};

//event listeners
searchBtn.addEventListener('click', async function (e) {
    //prevent the normal submission of the form
    e.preventDefault();
    let recipeInput = document.getElementById("search-bar").value.trim();
    console.log(recipeInput); //see what is typed into the search form
    let url = `https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&q=${recipeInput}`;
    const getData = async function () {
        const res = await fetch(url, options);
         const data = await res.json();
         console.log(data); //shows 20 recipes based on what is typed into search
         let recipes = data.results;
         return recipes;
    };
    let recipes = await getData();
    console.log(recipes);
    showRecipes(recipes);
    landingPage.classList.add("hidden");
    searchResults.classList.remove("hidden");
});

refreshButton.addEventListener("click", () => {
    landingPage.classList.remove("hidden");
    searchResults.classList.add("hidden");
})

const showRecipes = function (recipes) {
    while (recipeList.hasChildNodes()) {
        recipeList.firstElementChild.remove();
    }
    for (const recipe in recipes) {
        const recipeID = recipes[recipe].id;
        const title = recipes[recipe].name;
        const thumbnail = recipes[recipe].thumbnail_url;
        const recipeObject = document.createElement("li");
        recipeObject.classList.add("recipe");
        recipeObject.innerHTML = `
            <p class="recipe-id hidden">${recipeID}</p>
            <img class="recipe-image" src="${thumbnail}" alt="food picture">
            <div class="recipe-title__container">
                <h2 class="recipe-title">${title}</h2>
            </div>
            <button id="id${recipeID}" class="recipe-button" aria-describedby="recipe-button__desc">View Recipe</button>
        `;
        recipeList.append(recipeObject);
    }
};

// Modal Functionality

// Opening and Closing
const dialog = document.querySelector("dialog");
const showButton = document.querySelector("#this-button"); // changed to our button
const closeButton = document.querySelector(".recipe-details__exit-button"); // changed to our button
showButton.addEventListener("click", () => {
  dialog.showModal();
});
closeButton.addEventListener("click", () => {
  dialog.close();
});

// Listening for View Recipe Button clicks through Event Delegation
recipeList.addEventListener("click", createModal)

// DOM references needed to place modal content
const modalImage = document.querySelector("#example1");
const modalTitle = document.querySelector(".title-container h1");
const modalCategory = document.querySelector(".meal-label h3")
const modalIngredientsList = document.querySelector("#ingredients-list");
const modalInstructionsList = document.querySelector("#instructions-list");

function createModal(event) {
    let recipeID = event.target.id.slice(2);
    for (const index in recipes) {
        if (recipes[index].id == recipeID) {
            const thumbnail = recipes[index].thumbnail_url;
            modalImage.src = thumbnail;

            const title = recipes[index].name;
            modalTitle.innerHTML = title;
            modalImage.alt = title;

            const tagsArray = recipes[index].tags
            for (const index in tagsArray) {
                if (tagsArray[index].root_tag_type == "meal") {
                    const mealCategory = tagsArray[index].display_name;
                    modalCategory.innerHTML = mealCategory;
                    break;
                }
            }

            const ingredientArray = recipes[index].sections[0].components.map(ingredient => ingredient.raw_text)
            ingredientArray.forEach(ingredient => {
                let nextIngredient = document.createElement("li");
                nextIngredient.innerHTML = ingredient;
                modalIngredientsList.appendChild(nextIngredient);
            });

            const instructionsArray = recipes[index].instructions.map(instruction => instruction.display_text)
            instructionsArray.forEach(instruction => {
                let nextInstruction = document.createElement("li");
                nextInstruction.innerHTML = instruction;
                modalInstructionsList.appendChild(nextInstruction);
            })
            break;
        }
    }
    dialog.showModal();
}
