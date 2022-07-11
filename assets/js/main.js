window.addEventListener('DOMContentLoaded', async () => {
    // VARIABLES
    const recipesData = await (await fetch('../../data/recipes.json')).json()
    const recipeContainer = document.querySelector('#recipe-container')
    const filterForms = document.querySelectorAll('#form-container form')
    // const formBtns = filterForms.querySelector('button')


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

        recipeContainer.innerHTML = output
    }

    const handleClickOnFiltersBtn = () => filterForms.forEach(filterForm => {
        const formBtn = filterForm.querySelector('button')

        formBtn.addEventListener('click', e => {
            resetFiltersDisplay()
            e.preventDefault()
            const currentBtn = e.target.closest('button')
            const ul = currentBtn.nextElementSibling
            const parent = currentBtn.parentElement.parentElement
            const inputGroup = filterForm.querySelector('.input-group')
            const ulStyle = window.getComputedStyle(ul);
            const widthTest = ul.style.width
            ul.style.display = 'block'
            parent.style.width = ulStyle.width
            inputGroup.style.width = ulStyle.width
            console.log(widthTest)
            console.log(`'${ulStyle.width}'`)

        })
    })
    const resetFiltersDisplay = () => {
        filterForms.forEach(filterForm => {
            const inputGroup = filterForm.querySelector('.input-group')
            const ul = filterForm.querySelector('ul')
            inputGroup.style.width = '160px'
            filterForm.style.width = '160px'
            ul.style.display = 'none'

        })
    }

    const getRecipeTags = () => {
        let ingredients = []
        let appliance = []
        let ustensils = []

        filterForms.forEach(filterForm => {
            const itemsToFetch = filterForm.querySelector('button').dataset.items

            recipesData.forEach((recipe) => {
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

    const populateFilters = () => {
        const tags = [...getRecipeTags()]
        const ingredients = tags[0].ingredients
        const appliance = tags[1].appliance
        const ustensils = tags[2].ustensils

        document.querySelector('#ingredients-container').innerHTML = generateStringOutput(ingredients)
        document.querySelector('#appliance-container').innerHTML = generateStringOutput(appliance)
        document.querySelector('#ustensils-container').innerHTML = generateStringOutput(ustensils)
    }

    const generateStringOutput = items =>{
        let output = ''
        items.forEach(item=> {
            output += `<li class=""><a class="dropdown-item text-white" href="#">${item}</a></li> `
        })
        return output
    }

    displayRecipes()
    populateFilters()
    handleClickOnFiltersBtn()
    // EVENT LISTENERS



})