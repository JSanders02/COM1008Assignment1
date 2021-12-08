function Globals() {
    this.playButton = document.getElementById('play-game')
    this.nameInput = document.getElementById('game-name');
    this.nameButton = document.getElementById('submit-name');
    this.nextRound = document.getElementById('next-round');
    this.canvas = document.getElementById('game-canvas');
    this.font = "20px Verdana";
    this.ctx = document.getElementById('game-canvas').getContext('2d');
    this.currentText = "";
    this.roundCount = 0;
    this.rightAnswers = 0;

    this.drawObjects = new Array(3);
}

Globals.prototype.setFont = function (font) {
    this.font = font;
    this.ctx.font = font;
}

Globals.prototype.reset = function () {
    this.font = "20px Verdana";
    this.currentText = "";
    this.roundCount = 0;
    this.rightAnswers = 0;

    this.drawObjects = new Array(3);
}

function Circle(x, y, size) {
    this.x = x;
    this.centreX = x + size / 2;
    this.y = y;
    this.centreY = y + size / 2;
    this.size = size;
    this.radius = size * 0.45;
}

Circle.prototype.setCoords = function(x, y=null) {
    /* Use one function for both coordinates, rather than needing one for x
     and one for y.
     */
    if (x !== null) {
        /* As radius is 45% of the 'bounding box', divide by 9 to get 5%,
         and multiply by 10 to get 50%, to put the coordinates in the centre
          of the box.
         */
        this.x = x;
        this.centreX = x + this.size / 2;
    }
    if (y !== null) {
        this.y = y;
        this.centreY = y + this.size / 2;
    }
}

Circle.prototype.setHeight = function (height) {
    this.size = height;
    this.radius = height * 0.45;
}

Circle.prototype.draw = function () {
    let ctx = GameGlobals.ctx;
    ctx.beginPath();
    ctx.arc(this.centreX, this.centreY, this.radius, 0, Math.PI*2);
    ctx.stroke();
}

Circle.prototype.clear = function () {
    GameGlobals.ctx.clearRect(this.x, this.y, this.size, this.size);
}

Circle.prototype.getType = function () {
    return 'circle';
}

Circle.prototype.checkMousePos = function (mX, mY) {
    if (Math.sqrt((this.centreX - mX)**2+(this.centreY - mY)**2) <= this.radius) {
        return true;
    }
    return false;
}

function Triangle(x, y, height) {
    this.x = x;
    this.y = y;
    this.height = height;
}

Triangle.prototype.setCoords = function(x, y=null) {
    /* Use one function for both coordinates, rather than needing one for x
     and one for y.
     */
    if (x !== null) {
        this.x = x;
    }
    if (y !== null) {
        this.y = y;
    }
}

Triangle.prototype.setHeight = function (height) {
    this.height = height;
}

Triangle.prototype.draw = function () {
    let ctx = GameGlobals.ctx
    let triangleX = this.x + this.height * 0.05;
    let triangleY = this.height + (this.y - this.height * 0.05);
    let triangleHeight = this.height * 0.9;
    ctx.beginPath();
    ctx.moveTo(triangleX, triangleY);
    ctx.lineTo(triangleX + triangleHeight, triangleY);
    ctx.lineTo(triangleX + triangleHeight / 2, triangleY - triangleHeight)
    ctx.lineTo(triangleX, triangleY);
    ctx.stroke();
}

Triangle.prototype.clear = function () {
    GameGlobals.ctx.clearRect(this.x, this.y, this.height, this.height);
}

Triangle.prototype.getType = function () {
    return 'triangle';
}

Triangle.prototype.checkMousePos = function (mX, mY) {
    if (mX > this.x && mX < this.x + this.height) {
        if (mY > this.y && mY < this.y + this.height) {
            return true;
        }
    }
    return false;
}

// Define object for images, so they can easily be manipulated
function GameImage(img, x, y, sideLength) {
    this.img = img;
    this.x = x;
    this.y = y + 5;
    this.sideLength = sideLength - 10;
}

GameImage.prototype.draw = function () {
    GameGlobals.ctx.drawImage(this.img, this.x, this.y, this.sideLength, this.sideLength);
}

GameImage.prototype.clear = function () {
    GameGlobals.ctx.clearRect(this.x, this.y, this.sideLength, this.sideLength);
}

GameImage.prototype.getType = function () {
    // Split at / (turn path/to/img.jpg into ['path', 'to', 'img.jpg']
    let imgSrc = this.img.src.split('/');

    // Select last element (filename) from split filepath and remove extension.
    imgSrc = imgSrc[imgSrc.length - 1].split('.')[0];

    // Remove last character (the number) from the string
    imgSrc = imgSrc.substring(0, imgSrc.length - 1);
    return imgSrc;
}

GameImage.prototype.setCoords = function(x, y=null) {
    /* Use one function for both coordinates, rather than needing one for x
     and one for y.
     */
    if (x !== null) {
        this.x = x;
    }
    if (y !== null) {
        this.y = y;
    }
}

GameImage.prototype.setHeight = function (height) {
    this.sideLength = height;
}

GameImage.prototype.checkMousePos = function (mX, mY) {
    if (mX > this.x && mX < this.x + this.sideLength) {
        if (mY > this.y && mY < this.y + this.sideLength) {
            return true;
        }
    }
    return false;
}

function randomNumber(lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower))
}

function finishGame() {
    GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);
    GameGlobals.currentText = "Nice one "+GameGlobals.name+"! You got "+GameGlobals.rightAnswers+"/3!";
    GameGlobals.ctx.fillText(GameGlobals.currentText, GameGlobals.canvas.width / 2, 40);
    GameGlobals.playButton.innerText = "Press here to play again!";
    GameGlobals.playButton.style.display = 'block';
}

function checkImages(event) {
    let clickX = event.layerX;
    let clickY = event.layerY;
    var correct;

    if (GameGlobals.drawObjects.includes(undefined)) {
        return;
    }

    for (let i=0; i<GameGlobals.drawObjects.length; i++) {
        if (GameGlobals.drawObjects[i].checkMousePos(clickX, clickY)) {
            if (GameGlobals.drawObjects[i].getType() === GameGlobals.type) {
                correct = true;
            } else {
                correct = false;
                var incorrectType = GameGlobals.drawObjects[i].getType();
            }
            GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);

            GameGlobals.drawObjects = new Array(3);

            if (correct) {
                    GameGlobals.currentText = "Well done " + GameGlobals.name + "!\nThat is" +
                        " a " + GameGlobals.type + "!";
                    GameGlobals.rightAnswers++;
            } else {
                GameGlobals.currentText = "Unlucky " + GameGlobals.name + "!\nThat is a " + incorrectType + ".";
            }

            if (window.innerWidth > 550) {
                // Desktop font size
                GameGlobals.setFont("20px Verdana");
            } else {
                GameGlobals.setFont("10px Verdana");
            }
            GameGlobals.ctx.fillText(GameGlobals.currentText, GameGlobals.canvas.width / 2, 40);

            if (GameGlobals.roundCount < 3) {
                GameGlobals.nextRound.style.display = 'block';
                GameGlobals.nextRound.addEventListener('click', initialiseImageLoad);
            } else {
                setTimeout(finishGame, 5000);
            }

            break;
        }
    }
}

function playGame() {
    // Clear canvas from previous rounds
    GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);

    // Hide next round button
    GameGlobals.nextRound.style.display = 'none';

    // Increment round counter
    GameGlobals.roundCount++;

    let imageNames = [['dog1', 'dog2'], ['cat1', 'cat2'], ['duck1', 'duck2'],
        ['penguin1', 'penguin2'], [new Triangle()], [new Circle()]];
    let typesChosen = new Array(3);
    let imageHeight = (GameGlobals.canvas.height - 80) / 3;

    let xUpper = GameGlobals.canvas.width - 15 - imageHeight;

    for (let i=0; i<3; i++) {
        let randType = randomNumber(0, imageNames.length)
        while (typesChosen.includes(randType)) {
            // Make sure we get a unique image type
            randType = randomNumber(0, imageNames.length);
        }

        let chosenType = imageNames[randType];

        typesChosen[i] = randType;

        let randImg = randomNumber(0, chosenType.length)

        let toDraw = chosenType[randImg];

        /* If toDraw is a string, that means it is referring to an image,
         and so we treat it as such. If not, then just add the object
          directly to the array.
         */
        if (typeof toDraw === 'string') {
            for (let j = 0; j < GameGlobals.images.length; j++) {
                let selected = GameGlobals.images[j];
                if (selected.src.endsWith(toDraw + '.jpg')) {
                    var chosenImage = selected;
                    GameGlobals.drawObjects[i] = new GameImage(chosenImage, randomNumber(15, xUpper), 65 + imageHeight*i, imageHeight)
                    break;
                }
            }
        } else {
            toDraw.setHeight(imageHeight);
            toDraw.setCoords(randomNumber(15, xUpper), 65 + imageHeight*i);
            GameGlobals.drawObjects[i] = toDraw;
        }
        GameGlobals.drawObjects[i].draw();
    }

    GameGlobals.type = GameGlobals.drawObjects[randomNumber(0, 3)].getType();

    if (window.innerWidth > 550) {
        // Desktop font size
        GameGlobals.setFont("40px Verdana");
    } else {
        GameGlobals.setFont("20px Verdana");
    }

    GameGlobals.ctx.textAlign = "center";

    let textX = GameGlobals.canvas.width / 2;
    GameGlobals.currentText = 'Click on the '+GameGlobals.type;
    GameGlobals.ctx.fillText('Click on the '+GameGlobals.type, textX, 40);
    GameGlobals.canvas.addEventListener('click', checkImages);
}

function loadImages(files, callback) {
    GameGlobals.images = new Array(files.length);
    var loadedCount = 0;
    for (var i=0; i<files.length; ++i) {
        GameGlobals.images[i] = new Image();
        GameGlobals.images[i].onload = function() {
            loadedCount++;
            if (loadedCount==files.length)
                callback();
        }
        GameGlobals.images[i].src = files[i];
    }
}

function initialiseImageLoad() {
    var names = ["img/game/dog1.jpg", "img/game/dog2.jpg", "img/game/cat1.jpg",
        "img/game/cat2.jpg", "img/game/penguin1.jpg", "img/game/penguin2.jpg", "img/game/duck1.jpg", "img/game/duck2.jpg"]
    loadImages(names, playGame);
}

function inputName() {
    GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);
    // Hide play button, show name input
    GameGlobals.playButton.style.display = 'none';
    GameGlobals.nameInput.style.display = 'block';
}

function getName() {
    GameGlobals.reset();
    // Get value of second child (text field) of GameGlobals.nameInput div
    GameGlobals.name = GameGlobals.nameInput.children[1].value;
    console.log(GameGlobals.name);
    GameGlobals.nameInput.style.removeProperty('display') // back to none - in CSS

    initialiseImageLoad();
}

// Use this object literal to minimise the number of global variables.
let GameGlobals = new Globals();

GameGlobals.playButton.addEventListener('click', inputName);
GameGlobals.nameButton.addEventListener('click', getName);