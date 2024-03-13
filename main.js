"use strict";

// START SECTION JS CODE BEGIN =>

// GET HTML ELEMENTS ;
const elStartSection = document.querySelector(".js-start-section");
const elStartBtns = document.querySelectorAll(".js-start-btn");
const elStartErrorBox = document.querySelector(".js-start-error");
const elSettingsSection = document.querySelector(".js-settings-section");
const elSettingsForm = document.querySelector(".js-settings-form");
const elErrorText = document.querySelector(".js-error-discription");
const elGameSection = document.querySelector(".js-game-section");
const elGameInnerTop = document.querySelector(".js-game-inner-top");
const elGameList = document.querySelector(".js-game-list");
const elQuestionInfo = document.querySelector(".js-question-info");
const elRoadySymbTemp = document.querySelector(".js-roady-symb-temp").content;
const elLastSection = document.querySelector(".js-last-section");
const elLastTitle = document.querySelector(".js-last-title");
const elLastScoreCount = document.querySelector(".js-last-score-count");
const elLastErrorCount = document.querySelector(".js-last-error-count");
const elLastWinBox = document.querySelector(".js-last-win")
const elRestartBtn = document.querySelector(".js-restart-btn")
const elDateMinutes = document.querySelector(".js-date-minutes");
const elDateSeconds = document.querySelector(".js-date-seconds");
let elScoretext = document.querySelector(".js-score-info");

// GAME SETTINGS OBJECT
const gameSettingsObj = {
  start: "START_GAME",
  settings: "SETTINGS_GAME",
  game: "GAME",
};


// GAME START SETTINGS OBJECT
const gameStartSettingsObj = {
  easy: {
    type: "easy",
    length: 21,
  },
  normal: {
    type: "normal",
    length: 42,
  },
  hard: {
    type: "hard",
    length: 62,
  },
};


// RESULT ROAD SYMBOL
let result = [];

// RESULT UNIQUE ARRAY NUMBERS
let uniqueArr = [];

// GAME SCORE
let gameScore = 0;

// GAME MAX ERROR;
let maxError = 5;

let gameMinute = 0;

// GAME SCORE TEXTCONTENT
elScoretext.textContent = `Score : ${gameScore} `;

// GAME LOCALSTORAGE CODE
let game = getItem("game-settings")
  ? JSON.parse(getItem("game-settings"))
  : null;

// GAME TYPE ROAD SYMBOL LENGTH
let gameTypeLength =
  game && gameStartSettingsObj[game.gameType]?.length
    ? gameStartSettingsObj[game.gameType]?.length
    : 0;


// SHOW AND HIDE SECTION
const handleOpenAndCloseSection = (showSection, hideSection) => {
  hideSection.classList.add("remove-section");
  showSection.classList.remove("remove-section");
};


// START SECTION BUTTONS DISABLED FUNCTION 
const handleBtnDisabled = (type) => {
  elStartBtns.forEach((startBtn) => {
    startBtn.disabled = type;
  });
  setTimeout(() => {
    handleBtnDisabled(false);
  }, 2000);
};

// SETTINGS SECTION BUTTON DISABLED
const handleSettingsDisabled = (type) => {
  elSettingsSection.querySelector("button").disabled = type;
  setTimeout(() => {
    handleSettingsDisabled(false);
  }, 2000);
};

// ERROR OPEN 
const handleOpenError = (text, type) => {
  elStartErrorBox.classList.add("start__error--animation");
  elErrorText.textContent = text;
  if (gameSettingsObj.start == type) {
    handleBtnDisabled(true);
  }
  if (gameSettingsObj.settings == type) {
    handleSettingsDisabled(true);
  }
  setTimeout(() => {
    elStartErrorBox.classList.remove("start__error--animation");
  }, 2000);
};

// START SECTION BTN CLICK RESULTS
const handleStartClick = (evt) => {
  switch (evt.target.id) {
    case "js-start-main-btn":
      {
        handleOpenAndCloseSection(elSettingsSection, elStartSection);
      }
      break;
    default: {
      handleOpenError(
        "Bunday hususiyat dasturga hali qo'shilmagan !",
        gameSettingsObj.start
      );
    }
  }
};

elStartBtns.forEach((startBtn) => {
  startBtn.addEventListener("click", handleStartClick);
});

// SETTINGS GAME CODES =>
const handleSub = (evt) => {
  evt.preventDefault();
  const gameSettings = {
    gameType: type.value,
    date: date.value,
  };
  if (!gameSettings.gameType || !gameSettings.date) {
    handleOpenError(
      "Daraja va vaqtni belgilamastan o'yinni boshlay olmaysiz !",
      gameSettingsObj.settings
    );
  } else {
    setItem("game-settings", gameSettings);
    handleOpenAndCloseSection(elGameSection, elSettingsSection);
    handleGameSettings();
    window.location.reload();
  }
};
elSettingsForm.addEventListener("submit", handleSub);

// REMOVE SECTION FUNCTION
const handleToCheckSectionRemove = (removeSection) => {
  if (!removeSection.getAttribute("class").includes("remove-section")) {
    removeSection.classList.add("remove-section");
  }
};


// GAME SETTINGS FUNCTION
function handleGameSettings() {
  if (game) {
    if (Object.keys(game).length == 2 && game.gameType && game.date) {
      handleToCheckSectionRemove(elStartSection);
      handleToCheckSectionRemove(elSettingsSection);
      gameMinute = game.date
      handleCreateDate()
      if (elGameSection.getAttribute("class").includes("remove-section")) {
        elGameSection.classList.remove("remove-section");
      }
      handleStartGame();
    }
  } else {
    console.log("Xato");
  }
}
let questionIndex = 0;

function handleCreateDate  () {
  gameMinute = +gameMinute > 0 ? +gameMinute: 0;
  let seconds = 60;
  if(gameMinute){
  let interval = setInterval(() => {
      if(gameMinute > 0){
        if(seconds > 1){
          seconds -= 1
        }else{
          gameMinute -=1
          if(gameMinute == 0){
            seconds = 0
          }else{
            seconds = 60
          }
        }
        elDateMinutes.textContent = gameMinute.toString().padStart(2, "0");
        elDateSeconds.textContent = seconds.toString().padStart(2, "0")
      }else{
        clearInterval(interval)
        elDateMinutes.textContent = "00";
        elDateSeconds.textContent = "00"
        handleEndFn(true)
      }
    }, 1000)
  }
}

// CREATE QUESTION FUNCTION
const handleCreateQuestion = () => {
  if (game && gameTypeLength) {
    if (result[uniqueArr[questionIndex]]) {
      elQuestionInfo.textContent =
        result[uniqueArr[questionIndex]].symbol_title;
    } else {
      elQuestionInfo.textContent = "";
      setTimeout(() => {
        handleEndFn(false);
      }, 2000);
    }
  }
};

// RENDER ROADYS 
const handleRenderRoadySymbol = (arr) => {
  const docFragmentRoadSymbol = document.createDocumentFragment();
  elGameList.innerHTML = null;
  arr.forEach((item) => {
    const clone = elRoadySymbTemp.cloneNode(true);
    clone.querySelector(".js-result-image").src = item.symbol_img;
    clone.querySelector(".js-result-image").dataset.id = item.id;
    clone.querySelector(".js-roady-symbol-item").dataset.id = item.id;

    docFragmentRoadSymbol.appendChild(clone);
  });
  elGameList.appendChild(docFragmentRoadSymbol);
};

// FILTER SYMBOLL ROADYS
const handleFilterRoadySymbol = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    for (let si = 0; si < roadSymbol.length; si++) {
      if (arr[i] == roadSymbol[si].id) {
        result.push(roadSymbol[si]);
      }
    }
  }
  handleRenderRoadySymbol(result);
};

// RANDOM NUMBER FUNCTION
const handleRandomNumber = () => {
  let random = Math.floor(Math.random() * gameTypeLength);
  return random;
};

// UNIQUE ARRAY FUNCTION
let count = 0;
function handleStartGame() {
  let randomNumber = handleRandomNumber();
  if (gameTypeLength > count) {
    if (!uniqueArr.includes(randomNumber)) {
      count += 1;
      uniqueArr.push(randomNumber);
    }
    handleStartGame();
  } else if (gameTypeLength == count) {
    handleFilterRoadySymbol(uniqueArr);
  }
}

// SCROLL FUNCTION
const handleScroll = () => {
  if (gameTypeLength > 14 && window.scrollY > 0) {
    elGameInnerTop.classList.add("active");
  } else if (gameTypeLength > 14 && !window.scrollY) {
    elGameInnerTop.classList.remove("active");
  }
};

// TRUE RESPONSE FUNCTION
const handleTrueResponse = (questionBox, item) => {
  questionBox.classList.add("show-result");
  questionBox.querySelector("img").src = "./images/checkmark.gif";
  let gameAudio = questionBox.querySelector("#gameAudio")
  gameAudio.play()
  setTimeout(() => {
    item.style.opacity = 0;
  }, 2000);
};

// ERROR RESPONSE FUNCTION
const handleErrorResponse = (questionBox, item) => {
  questionBox.classList.add("show-result");
  questionBox.querySelector("img").src = "./images/error.png";
  let gameAudio = questionBox.querySelector("#gameErrorAudio")

  gameAudio.play()
  item.classList.add("animation-error-response");
  setTimeout(() => {
    questionBox.classList.remove("show-result");
  }, 1000);
};

// TO CHECK ANSWER FUNCTION
const handleToCheckAnswer = (id, type) => {
  let elItems = elGameList.querySelectorAll(".js-roady-symbol-item");
  elItems.forEach((item) => {
    const dataId = item.dataset.id;
    if (id == dataId) {
      const questionBox = item.querySelector(".game__question-result");
      if (type) {
        handleTrueResponse(questionBox, item);
      } else {
        handleErrorResponse(questionBox, item);
      }
    }
  });
};

// GAME CONTROLS FUNCTION
let userError = 0;
const handleClick = (evt) => {
  if(gameMinute > 0){
    const id = evt.target.dataset.id;
    if (Number(id) || id == 0) {
      if (maxError > userError) {
        let defaultRoadySymbol = roadSymbol.find((item) => item.id == id);
        let responseRoadySymbol = result.find(
          (item) => item.symbol_title == elQuestionInfo.textContent
        );
        if (responseRoadySymbol.id == defaultRoadySymbol.id) {
          gameScore += 1;
          questionIndex += 1;
          handleCreateQuestion();
          handleToCheckAnswer(id, true);
        } else {
          handleToCheckAnswer(id, false);
          userError += 1;
        }
        elScoretext.textContent = `Score : ${gameScore}`;
      } else {
        handleEndFn(true);
      }
    }
  }else{
    handleEndFn(true)
  }
};

// RESULT FUNCTION
function handleEndFn(type) {
  if (type) {
    elLastTitle.textContent = "GAME OVER !";
    elLastScoreCount.textContent = `Score = ${gameScore}`;
    elLastErrorCount.textContent = `Error = ${userError}`;
    elLastSection.classList.add("js-ower")
} else {
    elLastSection.classList.add("js-win")
}
  handleOpenAndCloseSection(elLastSection, elGameSection);
}


// RESTART FUNCTION
const handleRestartBtn = () => {
    clear();
    window.location.reload()
}
window.addEventListener("scroll", handleScroll);
elGameList.addEventListener("click", handleClick);
elRestartBtn.addEventListener("click", handleRestartBtn)
handleGameSettings();
handleCreateQuestion();