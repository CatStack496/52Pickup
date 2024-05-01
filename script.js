// Checks if local storage value scores exists and makes a blank array on it if it doesnt
// Keeps several functions that rely on local storage scores from breaking
if (localStorage.getItem('scores') === null || localStorage.getItem('scores') === undefined) {
  localStorage.setItem('scores', JSON.stringify([]));
}
let scores = loadScores(); // Load scores from local storage or cookie
const d = new Date();
const cardImages = [
  'cardClubs10.png',
  'cardClubs2.png',
  'cardClubs3.png',
  'cardClubs4.png',
  'cardClubs5.png',
  'cardClubs6.png',
  'cardClubs7.png',
  'cardClubs8.png',
  'cardClubs9.png',
  'cardClubsA.png',
  'cardClubsJ.png',
  'cardClubsK.png',
  'cardClubsQ.png',
  'cardDiamonds10.png',
  'cardDiamonds2.png',
  'cardDiamonds3.png',
  'cardDiamonds4.png',
  'cardDiamonds5.png',
  'cardDiamonds6.png',
  'cardDiamonds7.png',
  'cardDiamonds8.png',
  'cardDiamonds9.png',
  'cardDiamondsA.png',
  'cardDiamondsJ.png',
  'cardDiamondsK.png',
  'cardDiamondsQ.png',
  'cardHearts10.png',
  'cardHearts2.png',
  'cardHearts3.png',
  'cardHearts4.png',
  'cardHearts5.png',
  'cardHearts6.png',
  'cardHearts7.png',
  'cardHearts8.png',
  'cardHearts9.png',
  'cardHeartsA.png',
  'cardHeartsJ.png',
  'cardHeartsK.png',
  'cardHeartsQ.png',
  'cardSpades10.png',
  'cardSpades2.png',
  'cardSpades3.png',
  'cardSpades4.png',
  'cardSpades5.png',
  'cardSpades6.png',
  'cardSpades7.png',
  'cardSpades8.png',
  'cardSpades9.png',
  'cardSpadesA.png',
  'cardSpadesJ.png',
  'cardSpadesK.png',
  'cardSpadesQ.png'
];
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

window.onload = function() {
  const container = document.getElementById('container');
  //open nav bar with animation
  openNav();
  //initialize the selected cards array
  const selectedCards = [];

  function createCard() {
    const img = document.createElement('img');
    //create card class
    img.classList.add('card');

    //get random card image from cardImages array
    const randomIndex = Math.floor(Math.random() * cardImages.length);
    //remove the selected random card from the cardImages array
    const randomImage = cardImages.splice(randomIndex, 1)[0];
    //set the src of the img element to the random image
    img.src = `images/cards/${randomImage}`;

    //setting styles for the card
    img.style.left = `${getRandomNumber(15, 85)}vw`;
    img.style.top = `${getRandomNumber(15, 85)}vh`;
    img.style.setProperty('--rotation', `${getRandomNumber(0, 360)}deg`);

    //make the images clickable
    img.addEventListener('click', function() {
      //define card by their image and timestamp
      const cardName = randomImage;
      const timestamp = new Date().getTime();
      getCard(cardName, timestamp);
      img.remove();
      console.log(selectedCards);
      //remove the navbar
      closeNav();
      //start stopwatch on the first card being clicked
      (selectedCards.length == 1) ? (startStopwatch()) : (null);
      //save score to local storage and reload the page
      if (selectedCards.length == 52) {
        addScore(stopStopwatch());
        location.reload();
      }
    });

    //send the card data to the container element so it can be drawn and animated with css
    container.appendChild(img);
  }

  function getCard(cardName, timestamp) {
    selectedCards.push([cardName, timestamp]);
    console.log(`Selected card: ${cardName} at ${timestamp}`);
  }

  //create each card on a time delay
  for (let i = 1; i <= 52; i++) {
    setTimeout(createCard, i * 12.5);
  }

  //make the most recent 10 scores show up in the table
  updateScoresTable();
};

//random number generator
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to save scores array to local storage or cookie
function saveScores(scores) {
  // Convert scores array to string
  let scoresString = JSON.stringify(scores);
  // Save to local storage if available
  if (window.localStorage) {
    localStorage.setItem('scores', scoresString);
  }
}

// Function to load scores array from local storage or cookie
function loadScores() {
  // Get the scores array from local storage
  const scoresJSON = localStorage.getItem('scores');
  // If the scores array exists in local storage and is not null
  if (scoresJSON !== null) {
    try {
      // Parse the JSON string into an array
      const scores = JSON.parse(scoresJSON);
      // If the parsed array is an array, return it
      if (Array.isArray(scores)) {
        console.log(scores)
        return scores;
      } else {
        // If it's not an array return an empty array
        return [];
      }
    } catch (error) {
      // If there's an error parsing the JSON string, return an empty array
      console.error('Error parsing scores from local storage:', error);
      return [];
    }
  } else {
    // If the scores array doesn't exist in local storage, return an empty array
    return [];
  }
}

// function to add score to scores array
function addScore(score) {
  scores.unshift([d.toDateString(), score]); //add score to the beginning of the array
  if (scores.length > 10) {
    scores.pop(); //Remove the last element if there are more than 10 scores
  }
  saveScores(scores); // Save updated scores array
  updateScoresTable(); // Update scores table
}

// Function to add rows to scores table
function updateScoresTable() {
  const scoresTable = document.getElementById('scores');
  // Clear existing rows
  scoresTable.innerHTML = '<tr><th>Date</th><th>Time</th></tr>';
  // Add rows for each score in the scores array
  if (scores.length > 0) {
    scores.forEach((score) => {
      const row = scoresTable.insertRow();
      const cellIndex = row.insertCell(0);
      const cellScore = row.insertCell(1);
      cellIndex.textContent = score[0]; // Display date of score
      cellScore.textContent = score[1]; // Display score
    })
  } else {
    return
  };
}

let timerInterval;
let startTime;

// Function to start stopwatch
function startStopwatch() {
  startTime = Date.now();
  timerInterval = setInterval(updateStopwatch, 1000); // Update every second
}

// Function to stop stopwatch and return elapsed time
function stopStopwatch() {
  clearInterval(timerInterval);
  return getElapsedTime();
}

// Function to update stopwatch display
function updateStopwatch() {
  const elapsedTime = getElapsedTime();
  console.log(elapsedTime); // Display elapsed time (you can change this to update the UI)
}

// Function to calculate elapsed time
function getElapsedTime() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  return formatTime(elapsedTime);
}

// Function to format time in HH:MM:SS format
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Function to pad single digits with leading zero
function pad(number) {
  return number < 10 ? '0' + number : number;
}