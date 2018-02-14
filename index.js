let STORE = {
  randomNumbers: [],
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

function appendToDom(selector, content){
  $(selector).append(content);
}

function generateResultHTML(data){
  let photoPrefix = data.response.groups[0].items[0].venue.featuredPhotos.items[0].prefix;
  let photoSuffix = data.response.groups[0].items[0].venue.featuredPhotos.items[0].suffix;

  return `<img src="${photoPrefix}300x300${photoSuffix}" alt="bar photo">`;
}

function queryFourSqAPI (location, priceLevel){
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
      section: "food",
      limit: 10,
      time: "any",
      day: "any",
      venuePhotos: true,
      price: priceLevel,
      v: Date.now(),
    }
  }
  $.ajax(settings).done(data=>{
    const result = generateResultHTML(data);
    appendToDom('.js-results', result);
  })
}

function setupApp(){
  fetchRandomNumbers();
  $('.js-search-form').submit(event => {
    event.preventDefault();
    let location = $('input').val();
    let priceLevel = $('input[name=richPoor]:checked').val();
    queryFourSqAPI(location, priceLevel);
  });
};

$(setupApp);

// get location and price level and send request for 10 bars
// $('.js-search-form').submit(event => {
//   event.preventDefault();
//   let location = $('input').val();
//   let priceLevel = $('input[name=richPoor]:checked').val();
//   console.log(location);
//   console.log(priceLevel);
//
//   var clientId = 'K0D0DBU3DHLWKXDSCSC0L5PK1RKTWD2LLKDYWCWYCE22XI55';
//   var clientSecret = 'QZAEIAQCIA01JOQBW5QGYG01N2LNPYN2P0PRL3DDUGZOWAIK';
//   var url = "https://api.foursquare.com/v2/venues/explore";
//   var settings = {
//     method: "GET",
//     url: url,
//     data: {
//       client_id: clientId,
//       client_secret: clientSecret,
//       near: location,
//       radius: 5000,
//       section: "drinks",
//       limit: 10,
//       price: priceLevel,
//       v: Date.now(),
//       time: "any",
//       day: "any",
//       venuePhotos: true,
//     }
//   }
//   $.ajax(settings).done(data=>{
//     console.log("bars", data);
//   })
// })
//
// function createVenueElement(object, index){
//   let photoPrefix = object.response.groups["0"].items["index"].venue.featuredPhotos.items["0"].prefix;
//   let photoSuffix = object.response.groups["0"].items["index"].venue.featuredPhotos.items["0"].suffix;
//   let photoString = `<img src="${photoPrefix}300x300${photoSuffix}" alt="bar photo">`;
//
//
//   return `
//     <div>
//       <img src="${photoPrefix}300x300${photoSuffix}" alt="bar photo">
//       <h2>
//     </div>
//   `
//   $('.js-results').append(photoString);
// }




//render map with both locations
