var nickField, timeField, playersField, collecionField, buttonSearch, buttonRandom, itemsArray, fittingArray, buttonRandom, randomSection, paragraphSection;

nickField = document.querySelector('.nick');
timeField = document.querySelector('.time');
playersField = document.querySelector('.players');
collecionField = document.getElementById('gameCollection');
buttonSearch = document.querySelector('.searchButton');
buttonRandom = document.querySelector('.randomButton');
buttonNotPlayed = document.querySelector('.btnNotPlayed');
paragraphRandom = document.querySelector('.paragraphRandom');
randomSection = document.querySelector('.randomSection');
itemsArray = [];
fittingArray = [];

init();

buttonSearch.addEventListener('click', function(event){

    if (event.keyCode = '13') {
        var req, text, xmlDoc, items, timeInput, playersInput;

        changeIcon();
        clearFields();
    
        nickInput = nickField.value;
        timeInput = parseInt(timeField.value);
        playersInput = parseInt(playersField.value);
    
    
        var req = new XMLHttpRequest();
        req.open("GET", "https://www.boardgamegeek.com/xmlapi2/collection?username=" + nickInput + "&stats=1&subtype=boardgame&own=1", false);
        req.send();
    
        text = req.responseText;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(text, "text/xml");
        items = xmlDoc.getElementsByTagName("item"); 
        itemsArray.push(items);
    
        
        for (var i = 0 ; i < itemsArray[0].length ; i ++) {
    
            var playTime, playersMinAmount, playersMaxAmount;
            
            playTime = itemsArray[0][i].getElementsByTagName('stats')[0].getAttribute('playingtime');
            playersMinAmount = itemsArray[0][i].getElementsByTagName('stats')[0].getAttribute('minplayers');
            playersMaxAmount = itemsArray[0][i].getElementsByTagName('stats')[0].getAttribute('maxplayers');
    
            if (timeInput >= parseInt(playTime) && playersInput >= playersMinAmount && playersInput <= playersMaxAmount ) {
            
                gameName = itemsArray[0][i].getElementsByTagName('name')[0].innerHTML;
                gameTime = itemsArray[0][i].getElementsByTagName('stats')[0].getAttribute('playingtime');
                gameImgSrc = itemsArray[0][i].getElementsByTagName('image')[0].innerHTML;
                playersMin = itemsArray[0][i].getElementsByTagName('stats')[0].getAttribute('minplayers');
                playersMax = itemsArray[0][i].getElementsByTagName('stats')[0].getAttribute('maxplayers');
                numOfPlays = itemsArray[0][i].getElementsByTagName('numplays')[0].innerHTML;
            
                buildStructure(gameTime, gameName, playersMin, playersMax, numOfPlays, gameImgSrc);
            
                fittingArray.push(itemsArray[0][i]);
            }

            randomSection.style.display = 'flex';
        } 

        buttonRandom.addEventListener('click', findMe);
        buttonNotPlayed.addEventListener('click', notPlay);
    }
   
});


function clearFields() {
    while (collecionField.firstChild) {
        collecionField.removeChild(collecionField.firstChild);
    }
};

function changeIcon() {
    var xIcon = '<i class="fas fa-times"></i>';
    buttonSearch.innerHTML = xIcon;
}

function init() {
    var searchIcon = '<i class="fas fa-search"></i>';
    clearFields();
    buttonSearch.innerHTML = searchIcon;
    nickField.value = '';
    timeField.value = '';
}

function findMe() {
    var length, result, title, time, img, gameName, gameTime, gameImgSrc, playersMax, playersMin, wholeGameInfo;

    length = fittingArray.length;
    result = Math.floor(Math.random() * (length));
    
    clearFields();

    gameName = fittingArray[result].getElementsByTagName('name')[0].innerHTML;
    gameTime = fittingArray[result].getElementsByTagName('stats')[0].getAttribute('playingtime');
    gameImgSrc = fittingArray[result].getElementsByTagName('image')[0].innerHTML;
    playersMin = fittingArray[result].getElementsByTagName('stats')[0].getAttribute('minplayers');
    playersMax = fittingArray[result].getElementsByTagName('stats')[0].getAttribute('maxplayers');
    numOfPlays = fittingArray[result].getElementsByTagName('numplays')[0].innerHTML;

    buildStructure(gameTime, gameName, playersMin, playersMax, numOfPlays, gameImgSrc);

    paragraphRandom.innerHTML = 'Pick something else';
}

function notPlay() {

    clearFields();

    for (i = 0 ; i < fittingArray.length ; i++) {
        var numberOfPlays;

        numberOfPlays = parseInt(fittingArray[i].getElementsByTagName('numplays')[0].innerHTML);

        if (numberOfPlays === 0) {
            gameName = fittingArray[i].getElementsByTagName('name')[0].innerHTML;
            gameTime = fittingArray[i].getElementsByTagName('stats')[0].getAttribute('playingtime');
            gameImgSrc = fittingArray[i].getElementsByTagName('image')[0].innerHTML;
            playersMin = fittingArray[i].getElementsByTagName('stats')[0].getAttribute('minplayers');
            playersMax = fittingArray[i].getElementsByTagName('stats')[0].getAttribute('maxplayers');
            numOfPlays = fittingArray[i].getElementsByTagName('numplays')[0].innerHTML;

            buildStructure(gameTime, gameName, playersMin, playersMax, numOfPlays, gameImgSrc);
        }
    }
    randomSection.style.display = 'none';
}

function buildStructure(timeOfGame, name, playersMin, playersMax, numPlays, imgSrc) {
    var title, time, img, gameBox, blockImage, wholeGameInfo, textInfo, playersInfo, gameName, gameTime, gameImgSrc, playersMin, playersMax, numOfPlays;

    title = document.createElement('p');
    time = document.createElement('p');
    img = document.createElement('img');
    gameBox = document.createElement('div');
    blockImage = document.createElement('div');
    wholeGameInfo = document.createElement('div');
    textInfo = document.createElement('div');
    playersInfo = document.createElement('p');
    numOfPlaysInfo = document.createElement('p');

    title.classList.add('gameTitle');
    gameBox.classList.add('gameBox');
    textInfo.classList.add('textInfo');
    img.classList.add('gamePhoto');
    wholeGameInfo.classList.add('wholeGameInfo');

    time.innerHTML = timeOfGame + 'min';
    title.innerHTML = name;
    playersInfo.innerHTML = playersMin + ' - ' + playersMax + ' players';

    if (numPlays != 0) {
        numOfPlaysInfo.innerHTML = 'Number of plays: ' + numPlays;
    } else {
        numOfPlaysInfo.innerHTML = 'Ouch, you didn\'t play this one!';
    }

    img.setAttribute('src', imgSrc);

    blockImage.appendChild(img);
    textInfo.appendChild(title);
    textInfo.appendChild(time);
    textInfo.appendChild(playersInfo);
    textInfo.appendChild(numOfPlaysInfo);
    wholeGameInfo.appendChild(textInfo);
    wholeGameInfo.insertBefore(blockImage, wholeGameInfo.firstChild);
    gameBox.appendChild(wholeGameInfo);
    collecionField.appendChild(gameBox);
}









