// import the links
import { names } from "./constants.js";
import { code } from "./constants.js";

// get necessary elements
const flag = document.querySelector('.country-flag')
const countryName = document.querySelector('.country-name')
const nativeName = document.querySelector('.native-name')
const country_population = document.querySelector('.population')
const region = document.querySelector('.region')
const subRegion = document.querySelector('.sub-region')
const capital = document.querySelector('.capital')
const tld = document.querySelector('.tld')
const currency = document.querySelector('.currency')
const language = document.querySelector('.language')
const border_countries = document.querySelector('.border-countries')
const modeBtn = document.getElementById("mode-btn")

let load_country = async (url) => {
    let methods = {method: 'GET', mode: 'cors'}
    let data = await fetch(url, methods)
    let country = await data.json()

    // let borders = Object.values(country.borders)
    console.log(country)

    country.map(e => {
        let population = e.population
        let native_name = Object.values(e.name.nativeName)[0].common
        let currency_name = Object.values(e.currencies)[0].name
        let language_name = Object.values(e.languages).join(", ")
        let borders = e.borders

        console.log(borders)
        

        flag.src = `${e.flags.svg}`
        flag.alt = `${e.flags.alt}`
        countryName.innerHTML = `${e.name.common}`
        nativeName.innerHTML = `${native_name}`
        country_population.innerHTML = `${population.toLocaleString("en-US")}`
        region.innerHTML = `${e.region}`
        subRegion.innerHTML = `${e.subregion}`
        capital.innerHTML = `${e.capital}`
        tld.innerHTML = `${e.tld}`
        currency.innerHTML = `${currency_name}`
        language.innerHTML = `${language_name}`

        if(borders){
            border_countries.style.display = "block"
            borders.map(borderCountries => {
                fetch(`${code}${borderCountries}`)
                .then(res => res.json())
                .then(data => {
                    data.map(e => {
                        let markup = `<li>
                            <a href="details.html?country=${e.name.common}">${e.name.common}</a>
                        </li>`

                        border_countries.insertAdjacentHTML('beforeend', markup)
                    })
                })
            })
        }
    })

}

// call the 'get_country_data' function on window load
window.onload = () => {
    prep_url()
    let dataMode = localStorage.getItem('mode')
    if(dataMode == "dark"){
        document.body.setAttribute('data-mode', 'dark')
    }
    
}

// node remover / previous data remover
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

    if (mode == "light") {
        document.body.setAttribute('data-mode', 'dark')
        localStorage.setItem('mode', 'dark')
    }
    else {
        document.body.setAttribute('data-mode', 'light')
        localStorage.setItem('mode', 'light')
    }

    dark_icon.classList.toggle("d-none")
    light_icon.classList.toggle("d-none")
}

// remove the file extension
let removeExtension = (filename) => {
    let newName = filename.substring(0, filename.lastIndexOf('/')) || filename;
    window.location.pathname = newName
}

// prepare the url and call function to get data
let prep_url = () => {
    const search_param = window.location.search
    const countryName = new URLSearchParams(search_param).get('country')

    console.log(countryName.toLocaleLowerCase())

    load_country(`${names}${countryName.toLowerCase()}?fullText=true`)
}