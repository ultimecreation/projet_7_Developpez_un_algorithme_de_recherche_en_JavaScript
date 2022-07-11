window.addEventListener('DOMContentLoaded',async ()=> {
    // VARIABLES
    const recipesData = await (await fetch('../../data/recipes.json')).json()
    const recipeContainer = document.querySelector('#recipe-container')


    // FUNCTIONS
    const displayRecipes = () => {
        let output = ''
         
        recipesData.map(recipe => {
            let recipeIngredientsList = ''
            recipe.ingredients.forEach(ingredient => {
                recipeIngredientsList += `
                    <li class="list-group-item border-0 p-0">
                        ${ingredient.ingredient} : ${ingredient.quantity} ${typeof ingredient.unit !== 'undefined' ? ingredient.unit : ''}
                    </li>
                `
            })
           console.log(recipe)
            output += `
                <div class="card  col-lg-6 col-xl-4 mx-0 my-3  p-0 border-0 rounded-2">
                    <img src="https://via.placeholder.com/380" class="card-img-top img-fluid" alt="${recipe.name}">
                    <div class="card-body bg-light">
                        <div class="d-flex justify-content-between align-items-center card-body__header">
                            <h2>${recipe.name}</h2>
                            <span><i class="fa-regular fa-clock me-2"></i>${recipe.time} min</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-start card-body__infos mt-3">
                            <ul class="list-group list-unstyled col-6">
                                ${recipeIngredientsList}
                            </ul>
                            <p class="col-6">${recipe.description.substring(0,174)}...</p>
                        </div>
                    </div>
                </div>
            `
            
        })
        
        recipeContainer.innerHTML = output
    }
    displayRecipes()

    // EVENT LISTENERS



})