window.addEventListener('DOMContentLoaded', async () => {
    // VARIABLES
    const recipesData = await (await fetch('../../data/recipes.json')).json()
    const recipeContainer = document.querySelector('#recipe-container')
    const filterForms = document.querySelectorAll('#form-container form')
    const tagContainer = document.querySelector('#tag-container')
    const mainRecipeSearchInput = document.querySelector('#main-recipe-search')


    // FUNCTIONS
    /**
     * create the html for each recipe and insert it in the dom
     *
     * @return  {void}  
     */
    const displayRecipes = (incomingRecipeData) => {
        let output = ''

        incomingRecipeData.map(recipe => {

            // create string for ingredients list outside of the main output
            let recipeIngredientsList = ''
            recipe.ingredients.forEach(ingredient => {
                recipeIngredientsList += `
                    <li class="list-group-item border-0 p-0">
                        ${ingredient.ingredient} : ${ingredient.quantity} ${typeof ingredient.unit !== 'undefined' ? ingredient.unit : ''}
                    </li>
                `
            })

            // generate main output
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
                            <p class="col-6">${recipe.description.substring(0, 174)}...</p>
                        </div>
                    </div>
                </div>
            `

        })

        // insert main out in the dom
        recipeContainer.innerHTML = output
    }

    /**
     * show/hide the filters dropdowns
     *
     * @param   {HTMLElement}  filterForm  
     *
     * @return  {void}              
     */
    const handleClickOnFiltersBtn = () => filterForms.forEach(filterForm => {
        // bind dom element
        const formBtn = filterForm.querySelector('button')

        formBtn.addEventListener('click', e => {
            e.preventDefault()

            // bind variables
            const currentBtn = e.target.closest('button')
            const icon = currentBtn.querySelector('i')
            const ul = currentBtn.nextElementSibling
            const parent = currentBtn.parentElement.parentElement
            const inputGroup = filterForm.querySelector('.input-group')
            const ulStyle = window.getComputedStyle(ul);
            const input = filterForm.querySelector('input')
            const inputPlaceHolderString = icon.classList.contains('fa-chevron-up')
                                            ? `${currentBtn.dataset.name.charAt(0).toUpperCase()}${currentBtn.dataset.name.slice(1)}`
                                            : `Rechercher un ${currentBtn.dataset.name.slice(0,-1)}`
 
            // dropdown is already open,the user clicked to close it
            if (icon.classList.contains('fa-chevron-up')) {
                resetFiltersDisplay()
                icon.classList.replace('fa-chevron-up','fa-chevron-down')
                input.setAttribute('placeholder',inputPlaceHolderString)
                return
            }

            // the dropdown is closed, open it
            resetFiltersDisplay()
            toggleIcon(currentBtn)
            ul.style.display = 'block'
            parent.style.width = ulStyle.width
            inputGroup.style.width = ulStyle.width
            input.setAttribute('placeholder',inputPlaceHolderString)
        })
    })

    /**
     * add a new button into the tags container
     * each time the user click on 1 of the dropdown links
     *
     * @param   {HTMLeLEMENT}  filterForm  
     *
     * @return  {VOID}              
     */
    const handleClickOnFiltersLinks = () => filterForms.forEach(filterForm => {
        // bind links from dom
        const links = filterForm.querySelectorAll('ul a.dropdown-item')

        links.forEach(link => {
            link.addEventListener('click', e => {
                // bind dom elements and initialize variables 
                const parentElement = e.target.parentElement.parentElement
                const linkTextContent = e.target.textContent
                let output = ''
                let classType = 'warning'

                // define a classType for each type of dropdowns
                if (parentElement.id.startsWith('ingredients')) classType = 'primary'
                else if (parentElement.id.startsWith('appliance')) classType = 'success'

                // generate the html button
                output = `
                    <button class="btn btn-small btn-${classType} m-1 text-white">
                        ${linkTextContent}
                        <i class="fa-solid fa-times ms-1 rounded-circle
                         border border-white p-1"></i>
                    </button>
                `

                // insert the button element into the tags container
                tagContainer.innerHTML += output
            })
        })

    })

    /**
     * remove a button from tags container
     * when the user click on it
     *
     * @return  {void}  
     */
    const handleTagDeletionFromTagContainer = () => {
        tagContainer.addEventListener('click', e => {

            // bind the closest button and remove it from the dom
            const itemToRemove = e.target.closest('button')
            itemToRemove.remove()
        })
    }

    /**
     * revert the form and dropdown to its initial state
     *
     * @return  {void}  
     */
    const resetFiltersDisplay = () => {
        filterForms.forEach(filterForm => {

            // bind dom elements
            const inputGroup = filterForm.querySelector('.input-group')
            const ul = filterForm.querySelector('ul')
            const icon =  filterForm.querySelector('i')
            const currentBtn =  filterForm.querySelector('button')
            const input = filterForm.querySelector('input')
            const inputPlaceHolderString = `${currentBtn.dataset.name.charAt(0).toUpperCase()}${currentBtn.dataset.name.slice(1)}`
                                            
            // apply the changes on the form and dropdown content
            inputGroup.style.width = '160px'
            filterForm.style.width = '160px'
            ul.style.display = 'none'
            icon.classList.replace('fa-chevron-up','fa-chevron-down')
            input.setAttribute('placeholder',inputPlaceHolderString)
        })
    }

    /**
     * toggle the arrow icon up/down 
     *
     * @param   {HTMLElement}  btn 
     *
     * @return  {void}       
     */
    const toggleIcon = (btn) => {
        // bind dom element
        const icon = btn.querySelector('i')

        // toggle the down/up arrow on the dropdown
        icon.classList.contains('fa-chevron-down')
            ? icon.classList.replace('fa-chevron-down', 'fa-chevron-up')
            : icon.classList.replace('fa-chevron-up', 'fa-chevron-down')
    }

    /**
     * generate workable/flattered arrays of tags to be used to populate the dropdowns
     *
     * @return  {[object]}  
     */
    const getRecipeTags = (incomingRecipeData) => {
        // create variables to be filled later
        let ingredients = []
        let appliance = []
        let ustensils = []


        // loop through the filters forms to know what kind of data to look for
        filterForms.forEach(filterForm => {
            const itemsToFetch = filterForm.querySelector('button').dataset.items

            // loop through the stored data to fill workable arrays with unique values inside
            incomingRecipeData.forEach((recipe) => {
                if (itemsToFetch === 'ingredients') {
                    recipe[itemsToFetch].forEach(item => {
                        if (!ingredients.includes(item.ingredient)) ingredients.push(item.ingredient)
                    })
                }

                if (itemsToFetch === 'appliance') {
                    if (!appliance.includes(recipe.appliance)) appliance.push(recipe.appliance)
                }

                if (itemsToFetch === 'ustensils') {
                    recipe[itemsToFetch].forEach(ustensil => {
                        if (!ustensils.includes(ustensil)) ustensils.push(ustensil)
                    })

                }
            })
        })

        return [
            { ingredients: ingredients },
            { appliance: appliance },
            { ustensils: ustensils }
        ]
    }

    /**
     * generate the html markup to be inserted in the dom
     *
     * @var {string}
     */
    const generateStringOutput = items => {
        let output = ''
        items.forEach(item => {
            output += `<li class=""><a class="dropdown-item text-white" href="#">${item}</a></li> `
        })
        return output
    }

    /**
     * populate the multiple dropdowns with previous fromatted html
     *
     * @return  {void} 
     */
    const populateFilters = (incomingRecipeData) => {
        // extract/bind data to populate the dropdowns
        const tags = [...getRecipeTags(incomingRecipeData)]
        const ingredients = tags[0].ingredients
        const appliance = tags[1].appliance
        const ustensils = tags[2].ustensils

        // insert dropdowns content in the dom
        document.querySelector('#ingredients-container').innerHTML = generateStringOutput(ingredients)
        document.querySelector('#appliance-container').innerHTML = generateStringOutput(appliance)
        document.querySelector('#ustensils-container').innerHTML = generateStringOutput(ustensils)
    }

    // INITIALIZATION
    displayRecipes(recipesData)
    populateFilters(recipesData)
    handleClickOnFiltersBtn()
    handleClickOnFiltersLinks()
    handleTagDeletionFromTagContainer()

    // EVENT LISTENERS
    mainRecipeSearchInput.addEventListener('keyup', e => {
        // bind data
        const searchString = e.target.value
        let filteredRecipeIds = []
        let filteredRecipes = []

        // start to fetch data when searchString is 3 characters or more
        if (searchString.length > 3) {

            // loop through the recipes
            for (let i = 0; i < recipesData.length; i++) {

                // bind title and description
                let title = recipesData[i].name.toLowerCase()
                let description = recipesData[i].description.toLowerCase()

                // true if match found on title OR description
                let titleOrDescriptiontriggerReached = title.indexOf(searchString.toLowerCase()) !== -1
                                                    || description.indexOf(searchString.toLowerCase()) !== -1

                // trigger reached, add the current recipe id if not already in array
                if (titleOrDescriptiontriggerReached && !filteredRecipeIds.includes(recipesData[i].id)) {
                    filteredRecipeIds.push(recipesData[i].id)
                }

                // loop through recipe ingredients
                for (let j = 0; j < recipesData[i].ingredients.length; j++) {

                    // bind data and the trigger
                    let currentIngredient = recipesData[i].ingredients[j].ingredient.toLowerCase()
                    let ingredientTrigger = currentIngredient.indexOf(searchString.toLowerCase()) !== -1

                    // add the recipe id if a match found and recipe id not already part of the array
                    if (ingredientTrigger && !filteredRecipeIds.includes(recipesData[i].id)) {
                        filteredRecipeIds.push(recipesData[i].id)
                    }
                }

            }
        }

        // no record found, display appropriate message
        if (filteredRecipeIds.length === 0) {
            // TO BE DONE LATER

            recipeContainer.innerHTML = `
                <div class="w-100 text-center">
                    <i class="fa-solid fa-triangle-exclamation fa-5x text-danger"></i>
                    <p class="text-center h2 w-75 mx-auto">Aucune recette ne correspond à votre critère "${searchString}".<br>
                    Vous pouvez chercher "tarte aux pommes", "poisson"</p>
                </div>
                   
               `
            return

        }

        // populate the filteredRecipes with usable data
        for(let i=0; i < recipesData.length; i++){
            if(filteredRecipeIds.includes(recipesData[i].id)) 
            {
                filteredRecipes.push(recipesData[i])
            }
        }

        // some record found, update UI and filters
        displayRecipes(filteredRecipes)
        populateFilters(filteredRecipes)
        handleClickOnFiltersLinks()
    })

})