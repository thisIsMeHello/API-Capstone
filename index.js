let STORE = {
  randomNumbers: [],
  localRandomNumbers: [],
  venueType: ["food", "drinks"],
  domLocations: [$(".js-resultsFood"), $(".js-resultsDrinks")],
  activity: ["eat", "drink"],
  errorMsg: ["No food results with that location and price, try again or change your search options!", "No bar results at that location and price, try again or change your search options!"]
}

//Get first and second random numbers and push into STORE
function fetchRandomNumbers(){
  $.getJSON('https://qrng.anu.edu.au/API/jsonI.php?length=2&type=uint8', function(data){
    let returnedRandomOne = data.data[0];
    let returnedRandomTwo = data.data[1];
    let singleRandomDigitOne = parseInt(returnedRandomOne.toString().split('').pop());
    let singleRandomDigitTwo = parseInt(returnedRandomTwo.toString().split('').pop());
    STORE.randomNumbers.push(singleRandomDigitOne, singleRandomDigitTwo);
  });
};

//backup number generation if quantum numbers not available
function generateRandomNumbers(){
  for (let i=0; i<2; i++){
    let randomNum = Math.floor((Math.random() * 5) + 1);
    STORE.localRandomNumbers.push(randomNum);
  };
};

//take returned JSON and create HTML section for each venue
function generateResultHTML(data, array, i){
  try {
    const venue = data.response.groups[0].items[array[i]].venue;
    const activity = STORE.activity[i];
    const photoPrefix = venue.featuredPhotos.items[0].prefix;
    const photoSuffix = venue.featuredPhotos.items[0].suffix;
    const photo = `${photoPrefix}300x300${photoSuffix}`;
    const venueName = venue.name;
    const rating = `rating ${venue.rating}`;
    const firstLineAddress = venue.location.address;
    const city = venue.location.city;
    const postCode = venue.location.postalCode;
    const phoneNumber = venue.contact.formattedPhone;
    const faceBookCode = venue.contact.facebook;
    const facebookURL = `https://facebook.com/${faceBookCode}`;
    const website = venue.url;

    return `
    <section class="venueContainer inlineBlock">
      <p class="eatDrink montAltFont">${activity}</p>
      <div style="display: flex; align-items: flex-end; flex-wrap: wrap">
        <img class="inlineBlock" src=${photo} alt="Venue photo">
        <address>
          <div class="inlineBlock">
            <h2 class="venueName">${venueName}</h2>
            <div class="icons">
              <a href="${facebookURL}"><i class="fab fa-facebook-square colorWhite icon"></i></a><a href="${website}"><i class="fas fa-external-link-square-alt colorWhite icon"></i></a><span class="">${rating}</span>
            </div>
          </div>
          <p class="firstLineAddress">${firstLineAddress}</p>
          <p>${city}</p>
          <p>${postCode}</p>
          <p class="phoneNumber inlineBlock">
            <i class="fas fa-phone inlineBlock"></i> ${phoneNumber === undefined ? "not available" : phoneNumber}
          </p>
        </address>
      </div>
    </section>
`

  }
  catch(err){
    return `
    <p>${STORE.errorMsg[i]}</p>
    `
  }
};


//formats and sends query to Foursquare API, then pushes to DOM
function queryFourSqAPI (location, priceLevel, section, i){
  const clientId = 'K0D0DBU3DHLWKXDSCSC0L5PK1RKTWD2LLKDYWCWYCE22XI55';
  const clientSecret = 'QZAEIAQCIA01JOQBW5QGYG01N2LNPYN2P0PRL3DDUGZOWAIK';
  const url = "https://api.foursquare.com/v2/venues/explore";
  const settings = {
    method: "GET",
    url: url,
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      near: location,
      radius: 20000,
      section: section,
      limit: 10,
      time: "any",
      day: "any",
      venuePhotos: true,
      price: priceLevel,
      v: Date.now(),
    }
  };

  $.ajax(settings).done(data => {
    // $('input').val("");
    $('.resultsPage').removeClass("hidden");
    $('.homePageContainer').hide();
    let array = randomArrayChooser();
    const result = generateResultHTML(data, array, i);
    appendToDom(STORE.domLocations[i], result);
  }).fail(response=>{
    $('.location-input-error').show();
    $('input').val("");
  });
}

function randomArrayChooser(){
  if (STORE.randomNumbers.length > 0){
    return STORE.randomNumbers;
  } else {
    return STORE.localRandomNumbers;
  }
}

//appends formated html to a selected DOM element
function appendToDom(domSelector, content){
  $(domSelector).append(content);
}

//initialises the app
function setupApp(){
  fetchRandomNumbers();
  generateRandomNumbers();

  $('.js-search-form').submit(event => {
    event.preventDefault();
    let location = $('input').val();
    let priceLevel = $('input[name=richPoor]:checked').val();
      for (let i=0; i<2; i++){
        let section = STORE.venueType[i];
        queryFourSqAPI(location, priceLevel, section, i);
      }
  });

  $('.tryAgain').on("click", function(){
    window.location.reload();
  })
};

//actions the initialisation
$(setupApp);
