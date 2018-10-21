var nickField, timeField, playersField, collecionField, buttonSearch, buttonRandom, itemsArray, fittingArray, buttonRandom, randomSection, paragraphSection;

nickField = document.querySelector('.nick');
timeField = document.querySelector('.time');
playersField = document.querySelector('.players');
collecionField = document.getElementById('gameCollection');
buttonSearch = document.querySelector('.searchButton');
buttonClear = document.querySelector('.clearSearch');
buttonRandom = document.querySelector('.random');
buttonNotPlayed = document.querySelector('.notPlayed');
paragraphRandom = document.querySelector('.paragraphRandom');
randomSection = document.querySelector('.randomSection');
totalTime = document.querySelector('.totalTime');
itemsArray = [];
fittingArray = [];

init();

buttonSearch.addEventListener('click', function(event){

    if (event.keyCode = '13') {
        var req, text, xmlDoc, items, timeInput, playersInput;

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
    
        
        for (var i = 0 ; i < itemsArray[0].length-1 ; i ++) {
    
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
        } 

        randomSection.style.display = 'flex';
        totalTime.style.display = 'block';

        buttonRandom.addEventListener('click', findMe);
        buttonNotPlayed.addEventListener('click', notPlay);
    }   
});

buttonClear.addEventListener('click', init);


function clearFields() {
    while (collecionField.firstChild) {
        collecionField.removeChild(collecionField.firstChild);
    }
};

function init() {
    clearFields();
    nickField.value = '';
    timeField.value = '';
    playersField.value = '';

    randomSection.style.display = 'none';
    totalTime.style.display = 'none';
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
    totalTime.style.display = 'none';
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
    totalTime.style.display = 'block';
}

function buildStructure(timeOfGame, name, playersMin, playersMax, numPlays, imgSrc) {
    var title, time, img, gameBox, blockImage, wholeGameInfo, textInfo, playersInfo, gameName, gameTime, gameImgSrc, playersMin, playersMax, numOfPlays;


    title = document.createElement('p');
    time = document.createElement('p');
    img = document.createElement('img');
    playersInfo = document.createElement('p');
    numOfPlaysInfo = document.createElement('p');
    singleGame = document.createElement('li');
    buttonTime = document.createElement('button');
    textInfo = document.createElement('div');

    title.classList.add('gameTitle');
    time.classList.add('gameTime');
    img.classList.add('gamePhoto');
    singleGame.classList.add('singleGame');
    buttonTime.classList.add('buttonNotSelected');
    textInfo.classList.add('textInfo');

    time.innerHTML = timeOfGame + 'min';
    title.innerHTML = name;
    playersInfo.innerHTML = playersMin + ' - ' + playersMax + ' players';

    if (numPlays != 0) {
        numOfPlaysInfo.innerHTML = 'Number of plays: ' + numPlays;
    } else {
        numOfPlaysInfo.innerHTML = 'Ouch, you didn\'t play this one!';
        numOfPlaysInfo.style.color = 'rgb(187, 45, 68)';
        numOfPlaysInfo.style.fontSize = '17px';
    }

    img.setAttribute('src', imgSrc);

    singleGame.appendChild(img);
    textInfo.appendChild(title);
    textInfo.appendChild(time);
    textInfo.appendChild(playersInfo);
    textInfo.appendChild(numOfPlaysInfo);
    textInfo.appendChild(buttonTime);
    singleGame.appendChild(textInfo);

    
    collecionField.appendChild(singleGame);

}

function addTimes(button) {

    var parent = button.parentNode;
    var parentTime = parent.querySelector('.gameTime').innerHTML;
    var time = parseInt(parentTime.slice(0, parentTime.length - 3));


    var total = document.querySelector('.totalTime').innerHTML;
    var totalP = document.querySelector('.totalTime');

    if (button.className == 'buttonNotSelected') {
        button.classList.remove('buttonNotSelected');
        button.classList.add('buttonSelected');
    
        totalP.innerHTML = parseInt(total) + time + ' min';
        
    } else {
        button.classList.remove('buttonSelected');
        button.classList.add('buttonNotSelected');

        totalP.innerHTML = parseInt(total) - time + ' min';
    }
};

document.addEventListener('click', function(e){
    if (e.target && e.target.className == 'buttonNotSelected' || e.target.className == 'buttonSelected') {
        addTimes(e.target);
    }
 });









