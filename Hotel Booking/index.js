//============================map button============================//
const mapBtn = document.getElementById('map-btn');
const popupMap = document.querySelector(".map-pop");
const closeBtn = document.querySelector('.close-popup');
const map = document.querySelector('.map-display');

mapBtn.addEventListener('click', function () {
  popupMap.style.display = "block";
});

closeBtn.addEventListener('click', () => { popupMap.style.display = "none"; })

popupMap.addEventListener('click', (outsideClick) => {
  if (outsideClick.target != map) {
    popupMap.style.display = "none";
  }

});


//============================search bar ============================//
const cities = [
  { name: "Paris" },
  { name: "Toulouz" },
  { name: "Marseille" }
];

const datalist = document.getElementById('search-bar-datalist');

let output = "";
for (let i = 0; i < cities.length; i++) {
  output += `<option value="${cities[i].name}"></option>\n`;
}

datalist.innerHTML = output;

//============================ hotel template ============================//

function toJSON(response) {
  return response.json();
}

function handleErrors(error) {
  console.error('Please try again problem occered!')
}

function initApp(data) {

  let hotels = data[1].entries;
  // console.log(data[0].roomtypes);

  let output = "";
  for (let i = 0; i < hotels.length; i++) {
    output += renderHotels(hotels[i]);
  }
  document.querySelector('.result-container').innerHTML = output;

}

function renderHotels(input) {
  const template = `
  <table class="result">
  <tr>
    <td rowspan="5" class="thumbnail"><img src="${input.thumbnail}" alt="Hotel Photo"></td>
      <td class="hotel-name c2">${input.hotelName}</td>
      <td rowspan="4" class="hotelprice"> BEST PRICE <BR>&#8364; ${input.price}</td>
  </tr>
    <tr>
      <td> <span class="hotel-rating c2 r${input.rating}" value="${input.rating}">  (${input.rating}</span>/5) Hotel</td>
    </tr>
    <tr>
      <td class="address c2">${input.city}</td>
    </tr>
    <tr>
      <td> <span class="rating-no c2">${input.ratings.no}</span>
      </td>
    </tr>
    <tr>
      <td class="rating-text c2" id="rating-text">${input.ratings.text} </td>
      <td class="viewdeal"><button>View Deal</button></td>
    </tr>
  </table>`
  return template;
}

// Show Hotels
fetch("data.json")
  .then(toJSON)
  .then(initApp)
  .catch(handleErrors);


//============================ Slider ============================//

function slider(data) {
  const priceList = [];
  let hotels = data[1].entries;

  for (let i = 0; i < hotels.length; i++) {
    priceList.push(parseInt(hotels[i].price));
  }

  document.getElementById('max_price').innerText = '€' + Math.max(...priceList);
  document.getElementById('price').value = Math.max(...priceList);
  document.getElementById('price').max = Math.max(...priceList);
};

fetch("data.json")
  .then(toJSON)
  .then(slider)
  .catch(handleErrors);


const inputEl = document.querySelector("#price");
const label = document.querySelector("#current-price");


inputEl.addEventListener("input", (e) => {
  label.innerText = e.currentTarget.value;

});


//============================ Cities ============================//

function setLocation(data) {
  const cityList = [];
  let hotels = data[1].entries;

  for (let i = 0; i < hotels.length; i++) {
    cityList.push(hotels[i].city);

  }

  let uList = [...new Set(cityList)];

  for (let i = 0; i < uList.length; i++) {
    document.getElementById('h-location').innerHTML += '<option value="' + uList[i] + '">' + uList[i] + '</option>';

  }

};

fetch("data.json")
  .then(toJSON)
  .then(setLocation)
  .catch(handleErrors);

//============================ Filters ============================//

function setMoreFilters(data) {

  let filters = data[1].entries[0].filters;

  for (let i = 0; i < filters.length; i++) {
    document.getElementById('filters').innerHTML += '<option value="' + filters[i].name + '">' + filters[i].name + '</option>';

  }

};

fetch("data.json")
  .then(toJSON)
  .then(setMoreFilters)
  .catch(handleErrors);

//============================ Filtering ============================//



function search(data) {
  //Step1: We get the UI choices 
  const serachbar = document.getElementById('search-bar').value;
  const currentPrice = document.getElementById('current-price').innerText;
  const propertyType = document.getElementById('property-type').value;
  const guestRating = document.getElementById('guest-rating').value;
  const hotelLocation = document.getElementById('h-location').value;
  const moreFilters = document.getElementById('filters').value;
  const hotels = data[1].entries;
  //Step2: We create filters using the UI choices 
  const searchFilter = hotels.filter(num => num.city.includes(serachbar)
    && num.price <= currentPrice
    && num.rating == propertyType
    && num.ratings.text.includes(guestRating)
    && num.city === hotelLocation);

  function myFilter(){
    const tempList=[];
    searchFilter.forEach(hotel => {
        hotel.filters.forEach(filter => {
          if (filter.name == moreFilters) {
  
           tempList.push(hotel);
          }
        });
      })
    return tempList;
  }


  renderFilter(myFilter());
};

//&& num.filters[0].name.includes(moreFilters));

//=====================================================
// for (let i in hotels) {
//   for (let j in hotels[i].filters) {
//     console.log(hotels[i].filters[j].name)
//   }
// }
//=====================================================





  function renderFilter(data) {
    let output = "";
    for (let i = 0; i < data.length; i++) {
      output += renderHotels(data[i]);
    }
    document.querySelector('.result-container').innerHTML = output;
  }

  const searchBtn = document.getElementById('search-button');
  searchBtn.addEventListener('click', () => {
    fetch("data.json")
      .then(toJSON)
      .then(search)
      .catch(handleErrors);
  });



