window.addEventListener('DOMContentLoaded', async () => {
    // VARIABLES
    const recipesData = await (await fetch('../../data/recipes.json')).json()
    const recipeContainer = document.querySelector('#recipe-container')
    const filterForms = document.querySelectorAll('#form-container form')
    const tagContainer = document.querySelector('#tag-container')
    const mainRecipeSearchInput = document.querySelector('#main-recipe-search')
    const mainSearchInput = document.querySelector('#main-recipe-search')
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

            // reset all inputs to avoid console errors
            const inputs = document.querySelectorAll('#form-container input')
            inputs.forEach(input=> input.value='')
            
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
            : `Rechercher un ${currentBtn.dataset.name.slice(0, -1)}`
            
            // dropdown is already open,the user clicked to close it
            if (icon.classList.contains('fa-chevron-up')) {
                resetFiltersDisplay()
                icon.classList.replace('fa-chevron-up', 'fa-chevron-down')
                input.setAttribute('placeholder', inputPlaceHolderString)
                return
            }

            // the dropdown is closed, open it
            resetFiltersDisplay()
            toggleIcon(currentBtn)
            ul.style.display = 'block'
            parent.style.width = ulStyle.width
            inputGroup.style.width = ulStyle.width
            
            input.setAttribute('placeholder', inputPlaceHolderString)
            
        })
    })

    /**
     * add a new button into the tags container
     * each time the user click on 1 of the dropdown links
     *
     * @param   {HTMLElement}  filterForm  
     *
     * @return  {void}              
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
                    <button data-tag="${linkTextContent}" class="btn btn-small btn-${classType} m-1 text-white">
                        ${linkTextContent}
                        <i class="fa-solid fa-times ms-1 rounded-circle
                         border border-white p-1"></i>
                    </button>
                `
                
                // get tags already selected and insert the new one if not already listed
                const tagsAlreadySelected = getTagsAlreadySelected().map(tag=> tag.toLowerCase())
                if(!tagsAlreadySelected.includes(linkTextContent.toLowerCase())){
                    tagContainer.innerHTML += output   
                    const currentForm = e.target.parentElement.parentElement.parentElement.parentElement
                    const currentBtn = currentForm.querySelector('button')
                    const inputGroup = currentForm.querySelector('.input-group')
                    const currentInput = currentForm.querySelector('input')
                    const currentUl = currentForm.querySelector('ul')
                    // console.log(currentForm,currentInput,currentUl)
                    // resetFiltersDisplay()
                    toggleIcon(currentBtn)
                    currentUl.style.display = 'none'
                    currentForm.style.width = '160px'
                    inputGroup.style.width = '160px'
                    currentInput.setAttribute('placeholder',`${currentBtn.dataset.name.charAt(0).toUpperCase()}${currentBtn.dataset.name.slice(1)}`)
                    currentInput.value = ''
                
                    handleSearchRoutine()
                    return
                }              
            })
        })
        
    })

    const getTagsAlreadySelected = ()=>{
        const tagElements =  tagContainer.querySelectorAll('button[data-tag]')
        const tagsAlreadySelected = []
        tagElements.forEach(tagElement => {
            tagsAlreadySelected.push(tagElement.dataset.tag)
        })

        return tagsAlreadySelected
    }

    /**
     * remove a button from tags container
     * when the user click on it
     *
     * @return  {void}  
     */
    const handleTagDeletionFromTagContainer = () => {
        tagContainer.addEventListener('click', e => {
            // const mainSearchInput = document.querySelector('#main-recipe-search')
            const mainSearchInputValue = mainSearchInput.value.toLowerCase().trim() 
            // bind the closest button and remove it from the dom
            const itemToRemove = e.target.closest('button')
            itemToRemove.remove()
            
            if(getTagsAlreadySelected().length > 0 || mainSearchInputValue.length > 2){
                handleSearchRoutine()
                return
            } 

            displayRecipes(recipesData)
            populateFilters(recipesData)
            handleClickOnFiltersLinks()
        })
    }

    /**
     * revert the form and dropdown to its initial state
     *
     * @return  {void}  
     */
    const resetFiltersDisplay = (e) => {
        filterForms.forEach(filterForm => {
            resetSingleFilterDisplay(filterForm)
        })
    }

   const resetSingleFilterDisplay = filterForm => {
        // bind dom elements
        const inputGroup = filterForm.querySelector('.input-group')
        const ul = filterForm.querySelector('ul')
        const icon = filterForm.querySelector('i')
        const currentBtn = filterForm.querySelector('button')
        const input = filterForm.querySelector('input')
        const inputPlaceHolderString = `${currentBtn.dataset.name.charAt(0).toUpperCase()}${currentBtn.dataset.name.slice(1)}`

        // apply the changes on the form and dropdown content
        inputGroup.style.width = '160px'
        filterForm.style.width = '160px'
        ul.style.display = 'none'
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down')
        input.setAttribute('placeholder', inputPlaceHolderString)
    
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

        // items, return "no data" message
        if(items.length === 0) return output = `<li class=""><a class="dropdown-item text-white" href="#">Pas de données</a></li> `

        // some items received, return data
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
        const ingredientsContainer = document.querySelector('#ingredients-container')
        const applianceContainer = document.querySelector('#appliance-container')
        const ustensilsContainer = document.querySelector('#ustensils-container')
        const tags = [...getRecipeTags(incomingRecipeData)]
        const ingredients = tags[0].ingredients
        const appliance = tags[1].appliance
        const ustensils = tags[2].ustensils

        // generate splitted ul in x or y columns
        if(ingredients.length < 10) ingredientsContainer.style.columns = 1
        else if(ingredients.length < 20 ) ingredientsContainer.style.columns = 2
        else ingredientsContainer.style.columns = 3
        
        // generate splitted ul in x or y columns
        if(appliance.length < 10) applianceContainer.style.columns = 1
        else if(appliance.length < 20 ) applianceContainer.style.columns = 2
        else applianceContainer.style.columns = 3
        
        // generate splitted ul in x or y columns
        if(ustensils.length < 10) ustensilsContainer.style.columns = 1
        else if(ustensils.length < 20 ) ustensilsContainer.style.columns = 2
        else ustensilsContainer.style.columns = 3
        
        // insert dropdowns content in the dom
        document.querySelector('#ingredients-container').innerHTML = generateStringOutput(ingredients)
        document.querySelector('#appliance-container').innerHTML = generateStringOutput(appliance)
        document.querySelector('#ustensils-container').innerHTML = generateStringOutput(ustensils)
    }

     const getFilteredRecipeIdsBySearchString =  (searchString) => {
        // initialize arrays to work with
        let filteredRecipeIds = []
        

        // get matches from ingredients arrays
        const RecipeIdsFromIngredientMatches = recipesData.reduce((accumulator, currentRecipe) => {

            const { ingredients } = currentRecipe
            ingredients.forEach(current => {
                // bind data
                let currentIngredient = current.ingredient.toLowerCase()
                let triggerReached = currentIngredient.indexOf(searchString) !== -1 
                                    && !accumulator.includes(currentRecipe.id)
                                     
                // match found on ingredients and recipe does not belong to accumulator, add it to accumulator
                if (triggerReached) accumulator.push(currentRecipe.id)
            })
            return accumulator
        }, [])

        const RecipeIdsFromTitleOrDescriptionMatches = recipesData.reduce((accumulator, currentRecipe) => {
            // bind data
            let currentTitle = currentRecipe.name.toLowerCase()
            let currentDescription = currentRecipe.description.toLowerCase()
            let triggerReached = ( currentTitle.indexOf(searchString) !== -1 || currentDescription.indexOf(searchString) !== -1 )
                                && !accumulator.includes(currentRecipe.id)

            // match found on title/description and recipe does not belong to accumulator, add it to accumulator
            if (triggerReached) accumulator.push(currentRecipe.id)
            return accumulator
        }, [])

        // concat arrays and remove duplicate entries with new Set
        filteredRecipeIds = Array.from(new Set([...RecipeIdsFromIngredientMatches,...RecipeIdsFromTitleOrDescriptionMatches]))
        return filteredRecipeIds
    }

    const handleSearchRoutine = ()=> {
        const tagsAlreadySelected = getTagsAlreadySelected()
        const mainSearchInputValue = mainSearchInput.value.toLowerCase().trim() 

        if(mainSearchInputValue.length > 2){
            tagsAlreadySelected.push(mainSearchInputValue)
        }

        const recipeIdsArraysToMerge =  tagsAlreadySelected.map( searchString =>{
            return getFilteredRecipeIdsBySearchString(searchString.toLowerCase())
        })

        // concat arrays and remove duplicate entries with new Set
        const filteredRecipeIds = [].concat.apply([],recipeIdsArraysToMerge)
        
        // no record found, display appropriate message
        if (filteredRecipeIds.length === 0) {
            populateFilters([])
            recipeContainer.innerHTML = `
                <div class="w-100 text-center">
                    <i class="fa-solid fa-triangle-exclamation fa-5x text-danger"></i>
                    <p class="text-center h2 w-75 mx-auto">Aucune recette ne correspond à votre critère "${tagsAlreadySelected.join(',')}".<br>
                    Vous pouvez chercher "tarte aux pommes", "poisson"</p>
                </div>
                
            `
            return
        }

        // some records found, get and display them
        let filteredRecipes = recipesData.filter(recipe =>  filteredRecipeIds.includes(recipe.id))
        displayRecipes(filteredRecipes)
        populateFilters(filteredRecipes)
        handleClickOnFiltersLinks()
        
    }

    const handleSearchOnFilterInputs = ()=>{
        filterForms.forEach(filterForm => {
            const input = filterForm.querySelector('input')

            input.addEventListener('keyup', e=> {
                e.preventDefault()
                const currentBtn = e.target.nextElementSibling
                const tagsToUse = getRecipeTags(recipesData).filter(recipeTags=> recipeTags[currentBtn.dataset.items] )[0][currentBtn.dataset.items]
                const tagsToReturn = tagsToUse.filter(tag => tag.toLowerCase().indexOf(e.target.value.toLowerCase().trim()) !== -1)
                populateSingleFilter(tagsToReturn,currentBtn.dataset.items)
                
                // const currentBtn = e.target.nextElementSibling
                const ul = currentBtn.nextElementSibling
                const parent = currentBtn.parentElement.parentElement
                const inputGroup = filterForm.querySelector('.input-group')
                const ulStyle = window.getComputedStyle(ul);
                resetFiltersDisplay()
                toggleIcon(currentBtn)
                ul.style.display = 'block'
                parent.style.width = ulStyle.width
                inputGroup.style.width = ulStyle.width
                input.setAttribute('placeholder', `Rechercher un ${currentBtn.dataset.name.slice(0, -1)}`)
                handleClickOnFiltersLinks()
            })
        })
    }

    const populateSingleFilter = (incomingTags,filterToFill) => {
        // extract/bind data to populate the dropdowns
        const tagContainerToFill = document.querySelector(`#${filterToFill}-container`)

        // generate splitted ul in x or y columns
        if(incomingTags.length < 10) tagContainerToFill.style.columns = 1
        else if(incomingTags.length < 20 ) tagContainerToFill.style.columns = 2
        else tagContainerToFill.style.columns = 3
        
        // insert dropdowns content in the dom
        tagContainerToFill.innerHTML = generateStringOutput(incomingTags)
    }

    // INITIALIZATION
    displayRecipes(recipesData)
    populateFilters(recipesData)
    handleSearchOnFilterInputs()
    handleClickOnFiltersLinks()
    handleClickOnFiltersBtn()
    handleTagDeletionFromTagContainer()

    // EVENT LISTENERS
    mainRecipeSearchInput.addEventListener('keyup', e => {
        // bind data
        const mainSearchString = e.target.value.toLowerCase().trim()
        
        // ignore less than 3 characters search strings
        if (mainSearchString.length > 2 || getTagsAlreadySelected().length > 0) {
            console.log(getTagsAlreadySelected().length)
            handleSearchRoutine()
            return    
        }
        displayRecipes(recipesData)
        populateFilters(recipesData)
        handleClickOnFiltersLinks()
    })

})