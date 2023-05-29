// import the links from another file
import { countries } from "./constants.js";
import { region } from "./constants.js";
import { names } from "./constants.js";

// get necessary elements
const modeBtn = document.getElementById("mode-btn")
const regionFilterBtn = document.getElementById("region-filter")
const regionSelector = document.querySelectorAll(".region-selector")
let data_row = document.querySelector(".row")
let name_input = document.getElementById("name-input")
let countryName = document.querySelectorAll(".country-name")


// function to show the countries and details
let get_country_data = async (url) => {
    let data = await fetch(url)
    let country = await data.json()

    

    if(data.status == 404){
        notFound()
    }
    else{
        nodeRemover()
        country.map(e => {
            let population = e.population

            let markup = `<div class="columns">
                        <div class="box">

                            <div class="image">
                                <img src="${e.flags.svg}" alt="${e.flags.alt}">
                            </div>

                            <div class="country-info">
                                <a href="details.html?country=${e.name.common}" class="country-name">${e.name.common}</a>

                                <p class="population">
                                    <b>Population:</b> ${population.toLocaleString("en-US")}
                                </p>
                                <p class="country-region">
                                    <b>Region:</b> ${e.region}
                                </p>
                                <p class="capital">
                                    <b>capital:</b> ${e.capital}
                                </p>
                            </div>

                        </div>
                    </div>`

            data_row.insertAdjacentHTML("beforeend", markup)
        })
        
    }
}

// call the 'get_country_data' function on window load
window.onload = () => {
    get_country_data(countries)
    let dataMode = localStorage.getItem('mode')
    if(dataMode == "dark"){
        document.body.setAttribute('data-mode', 'dark')
    }
}

// print not found message
let notFound = () => {
    let markup = "<p class=\"error-msg\">Country Not Found</p>"
    data_row.insertAdjacentHTML("beforeend", markup)
}

// node remover
let nodeRemover = () => {
    while (data_row.hasChildNodes()) {
        data_row.removeChild(data_row.firstChild);
    }
}

// darkmode toggle
modeBtn.onclick = () => {
    let dark_icon = modeBtn.querySelector(".dark")
    let light_icon = modeBtn.querySelector(".light")
    let mode = document.body.getAttribute('data-mode')

    if(mode == "light"){
        document.body.setAttribute('data-mode', 'dark')
        localStorage.setItem('mode', 'dark')
    }
    else{
        document.body.setAttribute('data-mode', 'light')
        localStorage.setItem('mode', 'light')
    }
    
    dark_icon.classList.toggle("d-none")
    light_icon.classList.toggle("d-none")
}

// show the regions for filtering
regionFilterBtn.onclick = () => {
    regionFilterBtn.nextElementSibling.classList.toggle("open")
}

// search countries by region
regionSelector.forEach(e => {
    e.addEventListener('click', () => {
        nodeRemover()
        let regionName = e.value
        if(regionName == "all"){
            get_country_data(countries)
        }
        else{
            get_country_data(region.concat(regionName))
        }
    })
})

// show the searched country
name_input.onkeyup = () => {
    if(name_input.value == ""){
        get_country_data(countries)
    }
    else{
        nodeRemover()
        get_country_data(names.concat(name_input.value))
    }
}