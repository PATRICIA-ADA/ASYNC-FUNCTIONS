'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////////
//INSERT HTML FORMAT
const renderCountry = function(data, className = ''){
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population /1000000).toFixed(1)} people </p>
        <p class="country__row"><span>😛</span>${Object.values(data.languages)}</p>
        <p class="country__row"><span>💰</span>${Object.values(data.currencies).map(curr => curr.name)}</p>
    </div>
</article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1; //commenting it out bcos of the finally() method
};

///////////////////
//ERROR MESSAGE FUNCTION
const renderError = function(msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1; //commenting it out bcos of the finally() method
}


///////////////////////////////////
//Function to getJson
  const fetchDataAndGetJSON = function(url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if(!response.ok)
      throw new Error(`${errorMsg} (${response.status})`);

    return response.json()
  });
}; 


///////////////////////////////////////
//FIRST AJAX CALL (OLD METHOD)
/* const getCountryData = function(country){

const request = new XMLHttpRequest();
request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
request.send();

//this will fetch the data from the background
request.addEventListener('load', function(){
  //console.log(this.responseText);//load data as a string
  //how to convert to an object
  const [data] = JSON.parse(this.responseText);
  console.log(data);

  //creating html format
  const html = `
  <article class="country">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name.common}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population /1000000).toFixed(1)} people </p>
        <p class="country__row"><span>😛</span>${Object.values(data.languages)}</p>
        <p class="country__row"><span>💰</span>${Object.values(data.currencies).map(curr => curr.name)}</p>
    </div>
</article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;

})
};
getCountryData('portugal') */


///////////////////////////////////////
//CALLBACK HELL
//HOW TO GET THE BORDERS BASED ON THE FIRST CALLBACK AS NESTED CALLBACK

/* const getCountryAndNeighbour = function(country){
  //Ajax call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();
  
  request.addEventListener('load', function(){
  
    const [data] = JSON.parse(this.responseText);
    console.log(data);

  //render country 1
  renderCountry(data)

  //get neighbour country(2)
  const [neighbour] = data.borders; //OR const neighbour = data.border?.[0]; using optional chaining for countries with no borders property or use the guide clause below

  //guide clause
  if(!neighbour) return;

   //Ajax call country 2
   const request2 = new XMLHttpRequest();
   request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
   request2.send();
   
   request2.addEventListener('load', function(){
  
    const [data2] = JSON.parse(this.responseText);
    console.log(data2);

  renderCountry(data2, 'neighbour')
   });

  });
  };
 // getCountryAndNeighbour('portugal');
  getCountryAndNeighbour('nigeria');
 */


/////////////////////////////////////////
//PROMISES AND THE FETCH API
//New method of making Ajax call
//using fecth API
/* const getCountryData = function(country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`) //returning a response
  .then(function(response) {
    return response.json();//to read the data on response, you need to call the json method and this return a new promise which needs to be called again using 'then()' method. Note, anything that we return will become the fulfilled value of the promise which will also be handled with the 'then()' method
  }).then(function(data){//here we get access to the country data
    console.log(data);
    renderCountry(data[0]);

  })
};
getCountryData('portugal') */

//Let us make it a simple code using arrow function
/* const getCountryData = function(country) {
  //country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then(response => response.json())
  .then(data => {
    renderCountry(data[0]);

    //get borders here
    const neighbour = data[0].borders[0];//or use optional chaining data[0].borders?.[0]

    if(!neighbour) return;
    
    //country 2
    return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)// here is the fulfilled value of the promise which will return a new promise using the 'then()' method
    .then(response => response.json())//here the body will now be the new promise
    .then(data => renderCountry(data[0], 'neighbour'));

  });
};
getCountryData('ghana') */


////////////////////////////////////////
//HANDLING REJECTED/ERRORS PROMISES
//there are two ways of handling a rejected promises
//1. pass a second callback function into the then() method, besides the json() method
//2. By adding a catch() method. this handle all the errors globally just one centre place. it can be added at the end of the chain this catch(). The error is a real JS object and it contains a messgae property which is use to basically only print the message of the error and not th whole error object itself

/* const getCountryData = function(country) {
  //country 1
  fetch(`https://restcountries.com/v3.1/name/${country}`)
  .then(response => {
    console.log(response); //if the ok property is set to false, then we can manually or basically reject the promise and set our own unique new error message. see below

    if(!response.ok)
      throw new Error(`Country not found (${response.status})`)//We created this by using a construction function. this stands as the real error msg we want at the moment. Note that the 'err.message' in the catch() below will now be represented by this new errow msg created here, for it will travel down to fill up the error message
    return response.json()
  })
  .then(data => {
    renderCountry(data[0]);

    //get borders here
    //const neighbour = data[0].borders[0];
    const neighbour = 'bhjvmhmhm'//second error

    if(!neighbour) return;
    
    //country 2
    return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
    .then(response => {
      if(!response.ok)
      throw new Error(`Country not found (${response.status})`)

      response.json()
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err}`);
      renderError(`Something went wrong ${err.message}. Try again`)
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    })//The method will always be called whatever happens in the promise, no matter if the promise is fulfiled or rejected. e.g to hide a loading spinner like it rotating circle that is being shown whenever we load a data. so the app show us spinner when asynchronous operation starts and then hides it when the operation complete. this also works when cath() return it promise

  });
};

btn.addEventListener('click', function() {
  getCountryData('ghana');
});
//getCountryData('jhbhubuliujl,');//first error msg
 */

//LET MAKE CODE DRY
////////////////////////////

//Function to getJson
/*  const fetchDataAndGetJSON = function(url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if(!response.ok)
      throw new Error(`${errorMsg} (${response.status})`);

    return response.json()
  });
}; 

 const getCountryData = function(country) {
  //country 1
  fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${country} `, 'Country not found'
  )
  .then(data => {
    renderCountry(data[0]);

    //get borders here
    const neighbour = data[0].borders[0];
    console.log(neighbour);
    //const neighbour = 'bhjvmhmhm'//second error

    if(!neighbour) throw new Error('No neighbour found');
    
    
    //country 2
    return fetchDataAndGetJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Country not found');
    
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err.message}`);
      renderError(`Something went wrong, ${err.message}. Try again Please`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function() {
  //getCountryData('portugal');
});
getCountryData('australia');
//getCountryData('jhbhubuliujl,');//first error msg 
 */


//////////////////////////////////////
//Coding Challenge #1 
/* //In this challenge you will build a function 'whereAmI' which renders a country only based on GPS coordinates. For that, you will use a second API to geocode coordinates. So in this challenge, you’ll use an API on your own for the first time 😁 
//Your tasks: PART 1 
//1. Create a function 'whereAmI' which takes as inputs a latitude value ('lat') and a longitude value ('lng') (these are GPS coordinates, examples are in test data below). 
//2. Do “reverse geocoding” of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api. The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do not use the 'getJSON' function we created, that is cheating 😉 
//3. Once you have the data, take a look at it in the console to see all the attributes that you received about the provided location. Then, using this data, log a message like this to the console: “You are in Berlin, Germany” 
//4. Chain a .catch method to the end of the promise chain and log errors to the console 
//5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does not reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message  

//PART 2 
//6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using. 
//7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code) 
 
//Test data: 
//Coordinates 1: 52.508, 13.381 (Latitude, Longitude) 
//Coordinates 2: 19.037, 72.873 
//Coordinates 3: -33.933, 18.474  
//GOOD LUCK 😀  */
//CHALLENGE 1
/* const whereAmI = function(lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=842403132830612399922x84519`)
  .then(response => {
    if(!response.ok) throw new Error(`Problem with geocoding ${response.status}`)
    return response.json();
  })
  .then(data => {
  console.log(data);
  console.log(`You are in ${data.city}, ${data.country}`);

  //rendering country from our former API
  return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
  })
  .then(response => {
    if(!response.ok) throw new Error(`Country not found ${response.status}`);

    return response.json();
  })
  .then(data => renderCountry(data[0]))
  .catch(err => {
    console.error(`${err.message}`);
  })
};
whereAmI(52.508, 13.381);
whereAmI(19.037, 72.873);
whereAmI(-33.933, 18.474 ); */

//////////////////////////////////////
//BUILDING A SIMPLE PROMISE
//Using the Lottery illustration

//Execution function
/* const lotteryPromise = new Promise(function(resolve, reject){
  if(Math.random() >= 0.5){
    resolve('You Won the lottery')//this will return a fulfilled promise which will later be consumed with the 'then' method. whatever value we passed into the resolve function will be he result of the promise that will be available in the 'then' handler
  } else{
    reject('You lost the lottery')//Here we passed in the error message that will later be used in the 'catch' handler
  }
});

//Consumming the Execution Promise
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err)); */

//Making it in an asynchronize way
/* const lotteryPromise = new Promise(function(resolve, reject){

  console.log('Lotter draw is happening, wait shortly for the result');

  setTimeout(function(){
    if(Math.random() >= 0.5){
      resolve('You Won the lottery')
    } else{
      reject(new Error('You lost the lottery'))
    }
  }, 2000);
});

//Consumming the Execution Promise
lotteryPromise.then(res => console.log(res)).catch(err => console.error(err)); */

/* //promisifying setTimeout
 const wait = function(seconds) {
  return new Promise(function(resolve){
    setTimeout(resolve, seconds * 1000 );
  });
};

//consuming the promise
wait(2)
.then(() => {
  console.log('I waited for 2 seconds');
  return wait(1);//returns a new promise
})
.then(() => console.log('I waited for 1 seconds')) 
 */

//PROMISIFYING THE GEOLOCATION
//It will automatically show your current location base on the geolocation in your device.
//const getPosition = function(){
  //return new Promise(function(resolve, reject){
    //callback base
   /*  navigator.geolocation.getCurrentPosition(position => resolve(position), err => reject(err)); */

   //Promise base
  // navigator.geolocation.getCurrentPosition(resolve, reject);
  //})
//};
//getPosition().then(pos => console.log(pos));


/* const whereAmI = function() {
  getPosition()
  .then(pos => {
    const {latitude: lat, longitude: lng} = pos.coords;

    return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=842403132830612399922x84519`);
  })
  .then(response => {
    if(!response.ok) throw new Error(`Problem with geocoding ${response.status}`)
    return response.json();
  })
  .then(data => {
  console.log(data);
  console.log(`You are in ${data.city}, ${data.country}`);

  //rendering country from our former API
  return fetch(`https://restcountries.com/v3.1/name/${data.country}`)
  })
  .then(response => {
    if(!response.ok) throw new Error(`Country not found ${response.status}`);

    return response.json();
  })
  .then(data => renderCountry(data[0]))
  .catch(err => {
    console.error(`${err.message}`);
  });
};

btn.addEventListener('click', whereAmI); */



//////////////////////////////////////
//Coding Challenge #2 
/* //For this challenge you will actually have to watch the video! Then, build the image loading functionality that I just showed you on the screen. 
//Your tasks: Tasks are not super-descriptive this time, so that you can figure out some stuff by yourself. Pretend you're working on your own 😉 
//PART 1 
//1. Create a function 'createImage' which receives 'imgPath' as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path 
//2. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image (listen for the'error' event), reject the promise 
//3. If this part is too tricky for you, just watch the first part of the solution  

//PART 2 
//4. Consume the promise using .then and also add an error handler 
//5. After the image has loaded, pause execution for 2 seconds using the 'wait' function we created earlier 
//6. After the 2 seconds have passed, hide the current image (set display CSS property to 'none'), and load a second image (Hint: Use the image element returned by the 'createImage' promise to hide the current image. You will need a global variable for that 😉) 
//7. After the second image has loaded, pause execution for 2 seconds again 
//8. After the 2 seconds have passed, hide the current image

//Test data: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to “Fast 3G” in the dev tools Network tab, otherwise images load too fast  
//GOOD LUCK 😀  */
/* let imgContainer = document.querySelector('.images');

const createImage = function(imgpath) {
  return new Promise(function(resolve, reject){
    let img = document.createElement('img');
    img.src = imgpath;

    img.addEventListener('load', function(){
      imgContainer.append(img);
      resolve(img);
      
    });

    img.addEventListener('error', function(){
      reject(new Error('Image not found'));
    });
  });
};

let currentImg;
createImage('img/img-1.jpg')
.then(img => {
    currentImg = img;
    console.log('Image 1 loaded')
    return wait(2);
})
.then(() => {
  currentImg.style.display = 'none';
  return createImage('img/img-2.jpg')//returns new promise
})
.then(img =>{
  currentImg = img;
    console.log('Image 2 loaded')
    return wait(2);
})
.then(() =>{
  currentImg.style.display = 'none';
  return createImage('img/img-3.jpg')
})
.then(img => {
  currentImg = img;
  console.log('Image 2 loaded')
  return wait(2);
})
.catch(err => console.error(err)) */



////////////////////////////////////////
//CONSUMING PROMISES WITH ASYNC/AWAIT
//here, you dont have to return promises or create new 'then' method or callback functions, all you have to do is to 'await' them and store them into some variables
//new method
/*  const getPosition2 = function(){
  return new Promise(function(resolve, reject){
   navigator.geolocation.getCurrentPosition(resolve, reject);
  })
};
 
const whereAmI2 = async function() {
  try{
  //Geolocation
  const position = await getPosition2();
  const {latitude: lat, longitude: lng} = position.coords;

  //Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=842403132830612399922x84519`);
    if(!resGeo.ok) throw new Error('Problem getting location data')
    
    const dataGeo = await resGeo.json();

  //getting country data
  //old method
  //fetch(`https://restcountries.com/v3.1/name/${country}`).then(res => console.log(res)); 
  //new method
  const respond = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.country}`);
  if(!respond.ok) throw new Error('Problem getting country')
  
  const data = await respond.json();
  renderCountry(data[0]);
  } catch(err){
      console.error(`${err}`);
      renderError(`${err.message}`)
  }
};
whereAmI2();
 */



/////////////////////////////////////////
//RETURNING VALUES FROM ASYNC FUNCTIONS
//This is useful in real world code
/*  const getPosition2 = function(){
  return new Promise(function(resolve, reject){
   navigator.geolocation.getCurrentPosition(resolve, reject);
  })
};
 
const whereAmI2 = async function() {
  try{
  //Geolocation
  const position = await getPosition2();
  const {latitude: lat, longitude: lng} = position.coords;

  //Reverse geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=842403132830612399922x84519`);
    if(!resGeo.ok) throw new Error('Problem getting location data')
    
    const dataGeo = await resGeo.json();

  //getting country data
  //old method
  //fetch(`https://restcountries.com/v3.1/name/${country}`).then(res => console.log(res)); 
  //new method
  const respond = await fetch(`https://restcountries.com/v3.1/name/${dataGeo.country}`);
  if(!respond.ok) throw new Error('Problem getting country')
  
  const data = await respond.json();
  renderCountry(data[0]);

  //We want to return this promise as a fulfilled value from asyn function
  return `You are in ${dataGeo.city}, ${dataGeo.country}`
  } catch(err){
      console.error(`${err}`);
      renderError(`${err.message}`)

  //reject promise returned from async function
  throw err;
  }
};

console.log('1: Please, Wait to get a location');
//how to return a value from the asyn function
// whereAmI2().then(city => console.log(city)).catch(err => console.error(`${err.message}`))
//this is to align the async return value before no3 if not no3 will show up before the async function bcos of its loading at the background
//.finally(() => console.log('3: the process is finished, thanks for your patience')) 

//try this method as well
(async function(){
  try{
    const city = await whereAmI2();
    console.log(city);
  } catch(err) {
    console.error(`${err.message}`)
  }
  console.log('3: the process is finished, thanks for your patience')
})(); */



/////////////////////////////////////////
//RUNNING PROMISES IN PARALLEL
/* const get3Countries = async function(c1, c2, c3){
 try {
  //old method
  //const [data1] = await fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${c1}`);

  //const [data2] = await fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${c2}`);

  //const [data3] = await fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${c3}`);

  //console.log(data1.capital, data2.capital, data3.capital);

  //new method
  const dataPromise = await Promise.all([
    fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${c1}`),
    fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${c2}`),
    fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/${c3}`),
    
  ]);
  //console.log(dataPromise);
  //loop to get a new map
  console.log(dataPromise.map(data => data[0].capital));
  
 } catch (err) {
  console.log(err);
 }
};
get3Countries('nigeria', 'ghana','france') */


//////////////////////////////////////
//OTHER PROMISE COMBINATORS
//1. Promise.race => it recieves an array of promises and also returns a promise.
/* (async function(){
  const respond = await Promise.race([
    fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/italy`),
    fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/egypt`),
    fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/mexico`),
  ]);
  console.log(respond[0]);
})();

//Setting timeout function when there is so much delay
const timeout = function(sec) {
  return new Promise(function(_, reject){
    setTimeout(function(){
      reject(new Error('Request took so long, Reload Pls'))
    }, sec * 1000)
  });
};

Promise.race([
  fetchDataAndGetJSON(`https://restcountries.com/v3.1/name/greece`),
  timeout(10),
])
.then(res => console.log(res))
.catch(err => console.error(err));


//Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
.then(res => console.log(res))
//while promise.all is seen this way
Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
.then(res => console.log(res))
.catch(err => console.error(err) )


//Promise.any [ES2021]
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another Success'),
])
.then(res => console.log(res))
.catch(err => console.error(err) ) */



//////////////////////////////////////
//Coding Challenge #3 
/* //Your tasks: PART 1 
//1. Write an async function 'loadNPause' that recreates Challenge #2, this time using async/await (only the part where the promise is consumed, reuse the 'createImage' function from before) 
//2. Compare the two versions, think about the big differences, and see which one you like more 
//3. Don't forget to test the error handler, and to set the network speed to “Fast 3G” in the dev tools Network tab  
//PART 2 
//1. Create an async function 'loadAll' that receives an array of image paths 'imgArr' 
//2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs') 
//3. Check out the 'imgs' array in the console! Is it like you expected? 4. Use a promise combinator function to actually get the images from the array 😉 
//5. Add the 'parallel' class to all the images (it has some CSS styles) 
//Test data Part 2: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img- 3.jpg']. To test, turn off the 'loadNPause' function  
//GOOD LUCK 😀 */
 
const wait = function(seconds) {
  return new Promise(function(resolve){
    setTimeout(resolve, seconds * 1000 );
  });
};

//old method
let imgContainer = document.querySelector('.images');

const createImage = function(imgpath) {
  return new Promise(function(resolve, reject){
    let img = document.createElement('img');
    img.src = imgpath;

    img.addEventListener('load', function(){
      imgContainer.append(img);
      resolve(img);
      
    });

    img.addEventListener('error', function(){
      reject(new Error('Image not found'));
    });
  });
};

/* let currentImg;
createImage('img/img-1.jpg')
.then(img => {
    currentImg = img;
    console.log('Image 1 loaded')
    return wait(2);
})
.then(() => {
  currentImg.style.display = 'none';
  return createImage('img/img-2.jpg')//returns new promise
})
.then(img =>{
  currentImg = img;
    console.log('Image 2 loaded')
    return wait(2);
})
.then(() =>{
  currentImg.style.display = 'none';
  return createImage('img/img-3.jpg')
})
.then(img => {
  currentImg = img;
  console.log('Image 3 loaded')
  return wait(2);
})
.catch(err => console.error(err)); */


//Challenge Solution Part1
const loadPause = async function() {
  try {
    //Load image 1
    let img = await createImage('img/img-1.jpg');
    console.log('Image 1 loaded')
    await wait(2); //since the wait promise does not have any result value no need to save it into a variable
    img.style.display = 'none';

    //Load image 2
    img = await createImage('img/img-2.jpg');
    console.log('Image 2 loaded')
    await wait(2);
    img.style.display = 'none';

    //Load image 3
    img = await createImage('img/img-2.jpg');
    console.log('Image 3 loaded')
    await wait(2);
    img.style.display = 'none';
    
  } catch (err) {
    console.error(err);
  }
};
//loadPause();


//Challenge Solution Part2
const loadAll = async function(imgArr) {
  try {
    const imgs = imgArr.map(async img => await createImage(img))// this pause the images into the promise

//to get the images out from the promise
    const imgEl = await Promise.all(imgs)
    imgEl.forEach(img => img.classList.add('parallel'))

  } catch (err) {
    console.error(err);
  }
};
loadAll(['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'])


