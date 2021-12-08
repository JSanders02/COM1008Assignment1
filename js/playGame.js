function randomNumber(lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower))
}

function playGame(images) {
    let imageNames = [['dog1', 'dog2'], ['cat1', 'cat2'], ['duck1', 'duck2'], ['penguin1', 'penguin2']];
    let imageHeight = (canvas.height - 30) / 3;

    console.log(canvas.height);

    let chosenType = imageNames[randomNumber(0, imageNames.length)];
    let toDraw = chosenType[randomNumber(0, chosenType.length)];

    console.log(images);
    for (let i=0; i<images.length; i++) {
        let selected = images[i];
        console.log(selected.src);
        if (selected.src.endsWith(toDraw + '.jpg')) {
            var chosenImage = selected;
            console.log(chosenImage);
            break;
        }
    }

    context.drawImage(chosenImage, 15, 15, imageHeight, imageHeight);
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