//Get first random number

  $.getJSON('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8', function(data){
    let returnedRandom = data.data;
    let singleRandomDigitOne = returnedRandom.toString().split('').pop();
    console.log(singleRandomDigitOne);
  });

//Get second random number
$.getJSON('https://qrng.anu.edu.au/API/jsonI.php?length=1&type=uint8', function(data){
  let returnedRandom = data.data;
  let singleRandomDigitTwo = returnedRandom.toString().split('').pop();
  console.log(singleRandomDigitTwo);
});


//get location and price level and send request for 10 restaurants
$('.js-search-form').submit(event => {
  event.preventDefault();
  let location = $('input').val();
  let priceLevel = $('input[name=richPoor]:checked').val();
  console.log(location);
  console.log(priceLevel);

  var clientId = 'K0D0DBU3DHLWKXDSCSC0L5PK1RKTWD2LLKDYWCWYCE22XI55';
  var clientSecret = 'QZAEIAQCIA01JOQBW5QGYG01N2LNPYN2P0PRL3DDUGZOWAIK';
  var url = "https://api.foursquare.com/v2/venues/explore";
  var settings = {
    method: "GET",
    url: url,
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      v: Date.now(),
      near: location,
      radius: 5000,
      section: "food",
      query: "Restaurant",
      limit: 10,
      price: priceLevel,
      time: "any",
      day: "any",
      venuePhotos: true,
    }
  }
  $.ajax(settings).done(data=>{
    console.log(data);
  })
})
// data.response.groups["0"].items["singleRandomDigitOne"].venue


//get location and price level and send request for 10 bars
$('.js-search-form').submit(event => {
  event.preventDefault();
  let location = $('input').val();
  let priceLevel = $('input[name=richPoor]:checked').val();
  console.log(location);
  console.log(priceLevel);

  var clientId = 'K0D0DBU3DHLWKXDSCSC0L5PK1RKTWD2LLKDYWCWYCE22XI55';
  var clientSecret = 'QZAEIAQCIA01JOQBW5QGYG01N2LNPYN2P0PRL3DDUGZOWAIK';
  var url = "https://api.foursquare.com/v2/venues/explore";
  var settings = {
    method: "GET",
    url: url,
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      v: Date.now(),
      near: location,
      radius: 5000,
      section: "drinks",
      query: "Bar",
      limit: 10,
      price: priceLevel,
      time: "any",
      day: "any",
      venuePhotos: true,
    }
  }
  $.ajax(settings).done(data=>{
    console.log(data);
  })
})












//render html to the DOM



//render map with both locations
