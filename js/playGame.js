function randomNumber(lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower))
}

function playGame(images) {
    let imageNames = [['dog1', 'dog2'], ['cat1', 'cat2'], ['duck1', 'duck2'], ['penguin1', 'penguin2']];
    let imageHeight = (canvas.height - 30) / 3;

    let xUpper = canvas.width - 15 - imageHeight;

    for (let i=0; i<3; i++) {
        let randType = randomNumber(0, imageNames.length)
        let chosenType = imageNames[randType];
        let randImg = randomNumber(0, chosenType.length)

        let toDraw = chosenType[randImg];
        chosenType.splice(randImg, 1);

        for (let j=0; j<images.length; j++) {
            let selected = images[j];
            if (selected.src.endsWith(toDraw + '.jpg')) {
                var chosenImage = selected;
                console.log(chosenImage);
                break;
            }
        }

        context.drawImage(chosenImage, randomNumber(15, xUpper), 15 + imageHeight*i, imageHeight, imageHeight);
    }
}

function loadImages(files, callback) {
    var images = new Array(files.length);
    var loadedCount = 0;
    for (var i=0; i<files.length; ++i) {
        images[i] = new Image();
        images[i].onload = function() {
            loadedCount++;
            if (loadedCount==files.length)
                callback(images);
        }
        images[i].src = files[i];
    }
}

function initialiseImageLoad() {
    var names = ["img/game/dog1.jpg", "img/game/dog2.jpg", "img/game/cat1.jpg",
        "img/game/cat2.jpg", "img/game/penguin1.jpg", "img/game/penguin2.jpg", "img/game/duck1.jpg", "img/game/duck2.jpg"]
    loadImages(names, playGame);
}

function inputName() {
    // Hide play button, show name input
    playButton.style.display = 'none';
    nameInput.style.display = 'block';
}

function getName() {
    // Get value of second child (text field) of nameInput div
    let name = nameInput.children[1].value;
    nameInput.style.removeProperty('display') // back to none - in CSS

    initialiseImageLoad(name);
}

const playButton = document.getElementById('play-game');
const nameInput = document.getElementById('game-name');
const nameButton = document.getElementById('submit-name');
const canvas = document.getElementById('game-canvas')
const context = canvas.getContext('2d');
playButton.addEventListener('click', inputName);
nameButton.addEventListener('click', getName);