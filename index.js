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


function generateResultHTML(returnedDataObject){
  let photoPrefix = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.featuredPhotos.items[0].prefix;
  let photoSuffix = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.featuredPhotos.items[0].suffix;
  let photo = `${photoPrefix}300x300${photoSuffix}`;
  let venueName = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.name;
  let firstLineAddress = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.location.address;
  let city = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.location.city;
  let postCode = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.location.postalCode;
  let phoneNumber = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.contact.formattedPhone;
  let faceBookCode = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.contact.facebook;
  let facebookURL = `https://facebook.com/${faceBookCode}`
  let website = returnedDataObject.response.groups[0].items[STORE.randomNumbers[0]].venue.url

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

function queryFourSqAPI (location, priceLevel, section){
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
      radius: 5000,
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
    const result = generateResultHTML(data, STORE.randomNumbers[0]);
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
    queryFourSqAPI(location, priceLevel, "food");
  });
};

//actions the initialisation
$(setupApp);
