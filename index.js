let STORE = {
  randomNumbers: [],
  localRandomNumbers: [],
  venueType: ["food", "drinks"],
  domLocations: [$(".js-resultsFood"), $(".js-resultsDrinks")],
  activity: ["eat", "drink"],
  errorMsg: ["No food results, try again or change your search options!", "No bar results, try again or change your search options!"]
}

//Get first and second random numbers and push into STORE
function fetchRandomNumbers(){
  $.getJSON('https://qrng.anu.edu.au/API/jsonI.php?length=2&type=uint8', function(data){
    let returnedRandomOne = data.data[0];
    let returnedRandomTwo = data.data[1];
    let singleRandomDigitOne = parseInt(returnedRandomOne.toString().split('').pop());
    let singleRandomDigitTwo = parseInt(returnedRandomTwo.toString().split('').pop());
    STORE.randomNumbers.push(singleRandomDigitOne, singleRandomDigitTwo);
    console.log("Quantum Random Numbers", STORE.randomNumbers)
  });
};

function generateRandomNumbers(){
  for (let i=0; i<2; i++){
    let randomNum = Math.floor((Math.random() * 5) + 1);
    STORE.localRandomNumbers.push(randomNum);
    console.log("locally generated", STORE.localRandomNumbers);
  };
};

//take returned JSON and create HTML section for each venue


function generateResultHTML(data, array, i){
  try {
    let venue = data.response.groups[0].items[array[i]].venue;
    let activity = STORE.activity[i];
    let photoPrefix = venue.featuredPhotos.items[0].prefix;
    let photoSuffix = venue.featuredPhotos.items[0].suffix;
    let photo = `${photoPrefix}300x300${photoSuffix}`;
    let venueName = venue.name;
    let rating = `rating ${venue.rating}`;
    let firstLineAddress = venue.location.address;
    let city = venue.location.city;
    let postCode = venue.location.postalCode;
    let phoneNumber = venue.contact.formattedPhone;
    let faceBookCode = venue.contact.facebook;
    let facebookURL = `https://facebook.com/${faceBookCode}`;
    let website = venue.url;

    return `
    <div class="venueContainer">
      <p class="eatDrink montAltFont">${activity}</p>

      <div style="display: flex; align-items: flex-end; flex-wrap: wrap">
        <img class="inlineBlock" src=${photo}>
        <div>
          <div class="inlineBlock">
            <h2 class="venueName">${venueName}</h2><a href="${facebookURL}"><i class="fab fa-facebook-square colorWhite icons"></i></a><a href="${website}"><i class="fas fa-external-link-square-alt colorWhite icons"></i></a>
          </div>

          <p class="">${rating}</p>
          <p class="firstLineAddress">${firstLineAddress}</p>
          <p>${city}</p>
          <p>${postCode}</p>
          <p class="phoneNumber inlineBlock"><i class="fas fa-phone inlineBlock"></i> ${phoneNumber === undefined ? "not available" : phoneNumber}</p>
        </div>
      </div>

    </div>
`

  }
  catch(err){
    return `
    <p>${STORE.errorMsg[i]}</p>
    `
  }
}


//formats and sends query to Foursquare API, then pushes to DOM
//get run twice by setupApp using following data:
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
      radius: 20000,
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
    $('input').val("");
    $('.resultsPage').removeClass("hidden");
    $('.homePage').addClass("hidden");
    $('.js-video').addClass("hidden");
    let array = randomArrayChooser();
    // let randomNum = array[i];
    const result = generateResultHTML(data, array, i);
    appendToDom(STORE.domLocations[i], result);
  }).fail(response=>{
    $('.location-input-error').show();
    $('input').val("");
  })
}

// function randomArrayChooser() {
//   if (typeof STORE.randomNumbers[0] !== "undefined"){
//     console.log("used STORE.randomNumbers")
//     return STORE.randomNumbers;
//   } else {
//     console.log("used STORE.localRandomNumbers")
//     return STORE.localRandomNumbers;
//   };
// }


function randomArrayChooser(){
  console.log(STORE.randomNumbers);
  if (STORE.randomNumbers.length > 0){
    console.log("used STORE.randomNumbers")
    return STORE.randomNumbers;
  } else {
    console.log("used STORE.localRandomNumbers")
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

    tryAgain();
  });
};

//resets app to home page
function tryAgain(){
  $('.tryAgain').on("click", function(){
    window.location.reload();
  })
}

//actions the initialisation
$(setupApp);
