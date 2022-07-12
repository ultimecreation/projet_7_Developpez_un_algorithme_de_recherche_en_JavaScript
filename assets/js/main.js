window.addEventListener('DOMContentLoaded', async () => {
    // VARIABLES
    const recipesData = await (await fetch('../../data/recipes.json')).json()
    const recipeContainer = document.querySelector('#recipe-container')
    const filterForms = document.querySelectorAll('#form-container form')
    const tagContainer = document.querySelector('#tag-container')
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
            e.preventDefault()
            const currentBtn = e.target.closest('button')
            const icon = currentBtn.querySelector('i')
            const ul = currentBtn.nextElementSibling
            const parent = currentBtn.parentElement.parentElement
            const inputGroup = filterForm.querySelector('.input-group')
            const ulStyle = window.getComputedStyle(ul);
 
            // dropdown is already open,the user clicked to close it
            if(icon.classList.contains('fa-chevron-up')){
                resetFiltersDisplay()
                icon.classList.replace('fa-chevron-up','fa-chevron-down')
                return
            }
            
            // the dropdown is closed, open it
            resetFiltersDisplay()
            toggleIcon(currentBtn)
            ul.style.display = 'block'
            parent.style.width = ulStyle.width
            inputGroup.style.width = ulStyle.width
        })
    })
 
    const handleClickOnFiltersLinks = () =>  filterForms.forEach(filterForm => {
        const links = filterForm.querySelectorAll('ul a.dropdown-item')

        links.forEach(link =>{
            link.addEventListener('click', e=>{
                const parentElement = e.target.parentElement.parentElement
                const linkTextContent = e.target.textContent
                let output = ''
                let classType = 'warning'

                if(parentElement.id.startsWith('ingredients')) classType = 'primary'
                else if(parentElement.id.startsWith('appliance')) classType = 'success'
                
                output = `
                    <button class="btn btn-small btn-${classType} m-1">
                        ${linkTextContent}
                        <i class="fa-solid fa-times ms-1 rounded-circle
                         border border-${classType==='warning' ? 'dark':'white'} p-1"></i>
                    </button>
                `

                tagContainer.innerHTML += output
                console.log(e.target, parentElement)
            })
        })
        
    })

    const handleTagDeletionFromTagContainer = ()=>{
        tagContainer.addEventListener('click', e => {
            const itemToRemove = e.target.closest('button')
            itemToRemove.remove()
            console.log(itemToRemove)
        })
    }
   
    const resetFiltersDisplay = () => {
        filterForms.forEach(filterForm => {
            const inputGroup = filterForm.querySelector('.input-group')
            const ul = filterForm.querySelector('ul')
            const icon =  filterForm.querySelector('i')

            inputGroup.style.width = '160px'
            filterForm.style.width = '160px'
            ul.style.display = 'none'
            icon.classList.replace('fa-chevron-up','fa-chevron-down')
        })
    }

    const toggleIcon = (btn) => {
        const icon = btn.querySelector('i')

        icon.classList.contains('fa-chevron-down')
            ? icon.classList.replace('fa-chevron-down','fa-chevron-up')
            : icon.classList.replace('fa-chevron-up','fa-chevron-down')
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
    handleClickOnFiltersLinks()
    handleTagDeletionFromTagContainer()
    // EVENT LISTENERS



})