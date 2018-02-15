let STORE = {
  randomNumbers: [],
  venueType: ["food", "drinks"],
}

//Get first and second random numbers and push into STORE
function fetchRandomNumbers(){
  $.getJSON('https://qrng.anu.edu.au/API/jsonI.php?length=2&type=uint8', function(data){
    let returnedRandomOne = data.data[0];
    let returnedRandomTwo = data.data[1];
    let singleRandomDigitOne = parseInt(returnedRandomOne.toString().split('').pop());
    let singleRandomDigitTwo = parseInt(returnedRandomTwo.toString().split('').pop());
    STORE.randomNumbers.push(singleRandomDigitOne, singleRandomDigitTwo);
    console.log("randomNumbers", STORE.randomNumbers)
  });
};

//take returned JSON and create HTML section for each venue


function generateResultHTML(object, i){
  let photoPrefix = object.response.groups[0].items[STORE.randomNumbers[i]].venue.featuredPhotos.items[0].prefix;
  let photoSuffix = object.response.groups[0].items[STORE.randomNumbers[i]].venue.featuredPhotos.items[0].suffix;
  let photo = `${photoPrefix}300x300${photoSuffix}`;
  let venueName = object.response.groups[0].items[STORE.randomNumbers[i]].venue.name;
  let rating = object.response.groups[0].items[STORE.randomNumbers[i]].venue.rating;
  let firstLineAddress = object.response.groups[0].items[STORE.randomNumbers[i]].venue.location.address;
  let city = object.response.groups[0].items[STORE.randomNumbers[i]].venue.location.city;
  let postCode = object.response.groups[0].items[STORE.randomNumbers[i]].venue.location.postalCode;
  let phoneNumber = object.response.groups[0].items[STORE.randomNumbers[i]].venue.contact.formattedPhone;
  let faceBookCode = object.response.groups[0].items[STORE.randomNumbers[i]].venue.contact.facebook;
  let facebookURL = `https://facebook.com/${faceBookCode}`
  let website = object.response.groups[0].items[STORE.randomNumbers[i]].venue.url

  return `
  <div class="venueContainer">
    <img src=${photo}>
    <h2>${venueName}</h2>
    <div>${firstLineAddress}</div>
    <div>${city}</div>
    <div>${postCode}</div>
    <div>${phoneNumber}</div>
    <a href="${facebookURL}">Facebook</a>
    <a href="${website}">Website</a>
  </div>
  `
}


//formats and sends query to Foursquare API, then pushes to DOM
//get run twice by setupApp:
// - location, priceLevel, food, 0
// - location, priceLevel, drinks, 1

function queryFourSqAPI (location, priceLevel, section, i){
  var clientId = 'K0D0DBU3DHLWKXDSCSC0L5PK1RKTWD2LLKDYWCWYCE22XI55';
  var clientSecret = 'QZAEIAQCIA01JOQBW5QGYG01N2LNPYN2P0PRL3DDUGZOWAIK';
  var url = "https://api.foursquare.com/v2/venues/explore";
  var settings = {
    method: "GET",
    url: url,
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      near: location,
      radius: 10000,
      section: section,
      limit: 10,
      time: "any",
      day: "any",
      venuePhotos: true,
      price: priceLevel,
      v: Date.now(),
    }
  }

  $.ajax(settings).done(data=>{
    console.log(data);
    let randomNum = STORE.randomNumbers[i]
    const result = generateResultHTML(data, i);
    appendToDom('.js-results', result);
  })
}


//appends formated html to a selected DOM element
function appendToDom(selector, content){
  $(selector).append(content);
}

//initialises the app's code
function setupApp(){
  fetchRandomNumbers();
  $('.js-search-form').submit(event => {
    event.preventDefault();
    let location = $('input').val();
    let priceLevel = $('input[name=richPoor]:checked').val();
      for (let i=0; i<2; i++){
        let section = STORE.venueType[i];
        queryFourSqAPI(location, priceLevel, section, i);
      }
  });
};

//actions the initialisation
$(setupApp);
