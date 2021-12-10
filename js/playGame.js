/* Use a super class for game object classes, to avoid having to rewrite
 methods that function identically.
 */
class GameObject {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.type = 'none';
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getType() {
        return this.type;
    }

    getHeight() {
        return this.height;
    }

    setCoords(x, y=null) {
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

    setHeight(height) {
        this.height = height;
    }

    checkMousePos(mX, mY) {
        /* Check if mouse is in a square that bounds the triangle - not as ideal
         as checking if it is in the triangle, but a lot easier.
         */
        if (mX > this.x && mX < this.x + this.height) {
            if (mY > this.y && mY < this.y + this.height) {
                return true;
            }
        }
        return false;
    }
}

/* This object is used to create a circle, as that is one of the objects in
 the game.
 */
class Circle extends GameObject {
    constructor(x, y, height) {
        super(x, y, height); // Invoke super class constructor
        /* this.x is needed as it gets used in canvasSize.js - when the canvas
     is resized, all objects on there are repositioned using their x attributes.
     */
        this.centreX = x + height / 2;
        this.centreY = y + height / 2;
        this.radius = height * 0.45;

        this.type = 'circle';
    }

    setCoords(x, y=null) {
        /* Use one function for both coordinates, rather than needing one for x
         and one for y.
         */
        if (x !== null) {
            this.x = x;
            this.centreX = x + this.height / 2;
        }
        if (y !== null) {
            this.y = y;
            this.centreY = y + this.height / 2;
        }
    }

    setHeight(height) {
        super.setHeight(height);
        this.radius = height * 0.45;
    }

    draw() {
        let ctx = GameGlobals.ctx;
        ctx.beginPath();
        ctx.arc(this.centreX, this.centreY, this.radius, 0, Math.PI*2);
        ctx.stroke();
    }

    checkMousePos(mX, mY) {
        // Checks the distance from the mouse to the centre of the circle
        if (Math.sqrt((this.centreX - mX)**2+(this.centreY - mY)**2) <= this.radius) {
            return true;
        }
        return false;
    }
}

class Triangle extends GameObject {
    constructor(x, y, height) {
        super(x, y, height);
        this.type = 'triangle';
    }

    draw() {
        let ctx = GameGlobals.ctx;
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
}

// Define object for images, so they can easily be manipulated
class GameImage extends GameObject {
    constructor(img, x, y, height) {
        super(x, y + 5, height - 10);
        this.img = img;

        // Set image type
        // Split at / (turn img/game/dog.jpg into ['img', 'game', 'dog1.jpg']
        let imgSrc = this.img.src.split('/');

        // Select last element (filename) from split filepath and remove extension.
        imgSrc = imgSrc[imgSrc.length - 1].split('.')[0];

        // Remove last character (the number) from the string
        imgSrc = imgSrc.substring(0, imgSrc.length - 1);
        this.type = imgSrc;
    }

    draw() {
        GameGlobals.ctx.drawImage(this.img, this.x, this.y, this.height, this.height);
    }
}

// Contain all global variables used by this script into one object literal.
/* Used an object literal as only one instance of this will ever need to be
 created, and so it makes more sense than creating a whole class just for
  one thing.
 */
let GameGlobals = {
    gameButton: document.getElementById('game-button'),
    nameInput: document.getElementById('game-name'),
    canvas: document.getElementById('game-canvas'),
    font: "20px Verdana",
    ctx: document.getElementById('game-canvas').getContext('2d'),
    currentText: "",
    roundCount: 0,
    rightAnswers: 0,

    drawObjects: new Array(3),

    /* Names of all images (or objects in the case of non-images) stored in
     an array, meaning I can easily add more images if I want.
     */
    imageNames: [['dog1', 'dog2', 'dog3', 'dog4', 'dog5'],
        ['cat1', 'cat2', 'cat3', 'cat4', 'cat5'], ['duck1', 'duck2'],
        ['penguin1', 'penguin2'], [new Triangle()], [new Circle()]],

    setFont: function (font) {
        this.font = font;
        this.ctx.font = font;
    },

    /* This function is used when the game is restarted, to reset all
     globals (ones that change throughout the runtime of the game, at least)
      to their initial values, to make sure the game plays the same each time.
     */
    reset: function () {
        this.font = "20px Verdana";
        this.currentText = "";
        this.roundCount = 0;
        this.rightAnswers = 0;

        // No need to reset drawObjects - that is reset in playRound.
    },
}

// Simple function to generate a random integer between two bounds
function randomNumber(lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower))
}

function finishGame() {
    /* Ends the game - shows message informing player of how many they got
     right, as well as showing the game button, but changing its text and
      function.
     */
    GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);
    GameGlobals.currentText = "Nice one "+GameGlobals.name+"! You got "+GameGlobals.rightAnswers+"/3!";
    GameGlobals.ctx.fillText(GameGlobals.currentText, GameGlobals.canvas.width / 2, 40);
    GameGlobals.gameButton.innerText = "Press here to play again!";
    GameGlobals.gameButton.style.display = 'block';

    GameGlobals.gameButton.removeEventListener('click', playRound);
    GameGlobals.gameButton.addEventListener('click', inputName);
}

function checkImages(event) {
    /* This function checks all images, to see if the mouse has clicked on
     them or not, and if they are the correct image.
     */
    let clickX = event.layerX;
    let clickY = event.layerY;
    var correct;

    /* If GameGlobals is not fully populated, then rerun the playRound
     function, as this means not all images have been generated.
     */
    if (GameGlobals.drawObjects.includes(undefined)) {
        playRound();
    }

    for (let i=0; i<GameGlobals.drawObjects.length; i++) {
        // If mouse is positioned over an image, runs end of round sequence.
        if (GameGlobals.drawObjects[i].checkMousePos(clickX, clickY)) {
            if (GameGlobals.drawObjects[i].getType() === GameGlobals.type) {
                correct = true;
            } else {
                correct = false;
                // Store type of incorrect image, so it can be printed later.
                var incorrectType = GameGlobals.drawObjects[i].getType();
            }

            // Remove event listener from canvas to prevent double clicks
            GameGlobals.canvas.removeEventListener('click', checkImages);

            // Clear canvas to remove images and text.
            GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);

            // Reset drawObjects, so they aren't drawn if the canvas is resized
            GameGlobals.drawObjects = new Array(3);

            /* Inform player whether or not they chose the right image, and
             also what the image they clicked was.
             */
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
                /* Mobile font size - needs to be smaller than on desktop
                 otherwise text will clip.
                 */
                GameGlobals.setFont("10px Verdana");
            }

            // Output text onto canvas
            GameGlobals.ctx.fillText(GameGlobals.currentText, GameGlobals.canvas.width / 2, 40);

            if (GameGlobals.roundCount < 3) {
                /* If not the final round, show game button, and make it run
                 the next round function
                 */
                GameGlobals.gameButton.innerText = 'Next Round'
                GameGlobals.gameButton.style.display = 'block';

                GameGlobals.gameButton.removeEventListener('click', inputName);
                GameGlobals.gameButton.addEventListener('click', playRound);
            } else {
                /* If last round, run finishGame function, but wait 3.5
                 seconds so the user has a chance to read feedback before
                  the canvas is cleared
                 */
                setTimeout(finishGame, 3500);
            }

            break;
        }
    }
}

function playRound() {
    // Clear canvas from previous rounds
    GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);

    // Hide game button
    GameGlobals.gameButton.style.display = 'none';

    // Increment round counter
    GameGlobals.roundCount++;

    /* This array stores the types of image (dog, cat, triangle etc.) that have
     been chosen, to ensure only one image of each type is displayed.
     */
    let typesChosen = new Array(3);

    /* This array stores the coordinates of images that have been displayed,
     so that new images can be checked to ensure they don't overlap.
     */
    let previousCoords = [];

    for (let i=0; i<3; i++) {
        // Set imageHeight here, in case user resizes canvas between rounds.
        let imageHeight;
        /* Different imageHeight depending on whether the canvas is wider
         than it is tall - using the same height no matter what will result
          in images being impossible to place without overlapping, resulting
           in the webpage freezing as the loop runs indefinitely.
         */
        if (GameGlobals.canvas.height < GameGlobals.canvas.width) {
            // - 80 to make room for any text that is displayed
            imageHeight = (GameGlobals.canvas.height - 80) / 3;
        } else {
            imageHeight = (GameGlobals.canvas.width) / 3;
        }
        let xUpper = GameGlobals.canvas.width - 15 - imageHeight;
        let yUpper = GameGlobals.canvas.height - 15 - imageHeight;

        let randType = randomNumber(0, GameGlobals.imageNames.length)
        while (typesChosen.includes(randType)) {
            // Make sure we get a unique image type
            randType = randomNumber(0, GameGlobals.imageNames.length);
        }

        let chosenType = GameGlobals.imageNames[randType];

        typesChosen[i] = randType; // Update typesChosen to include current type

        // Select an image from that type, and set its x and y to a default of 0
        let randImg = randomNumber(0, chosenType.length)
        let toDraw = chosenType[randImg];
        let x = 0;
        let y = 0;

        /* Set overlap to true initially, so that the while loop runs at
         least once, and the x and y values of the image are set to unique
          values
         */
        let overlap = true;

        while (overlap) {
            overlap = false;
            x = randomNumber(15, xUpper);
            y = randomNumber(65, yUpper);

            for (let i=0; i<previousCoords.length; i++) {
                /* Check difference between x and y coordinates of previous
                 coordinates, and current x and y coordinates. If there is
                  any previous coord where the difference between for both
                   axes is less than image height, this means that the two
                    images are overlapping, and therefore the loop runs again.
                 */
                if (Math.abs(x - previousCoords[i][0]) <= imageHeight && Math.abs(y - previousCoords[i][1]) <= imageHeight)  {
                    overlap = true;
                    break; // No point checking rest of previousCoords
                }
            }
        }

        previousCoords.push([x, y]);

        /* If toDraw is a string, that means it is referring to an image,
         and so we treat it as such and therefore create an image object. If
          not, then just add the object directly to the array.
         */
        if (typeof toDraw === 'string') {
            for (let j = 0; j < GameGlobals.images.length; j++) {
                let selected = GameGlobals.images[j];
                // Run through image array to find the correct one
                if (selected.src.endsWith(toDraw + '.jpg')) {
                    GameGlobals.drawObjects[i] = new GameImage(selected, x, y, imageHeight)
                    break;
                }
            }
        } else {
            toDraw.setHeight(imageHeight);
            toDraw.setCoords(x, y);
            GameGlobals.drawObjects[i] = toDraw;
        }
        GameGlobals.drawObjects[i].draw();
    }

    // Choose a random image from the drawObjects array to be the target
    GameGlobals.type = GameGlobals.drawObjects[randomNumber(0, 3)].getType();

    if (window.innerWidth > 550) {
        // Desktop font size
        GameGlobals.setFont("40px Verdana");
    } else {
        GameGlobals.setFont("20px Verdana");
    }

    // Align text to center to make it easier to position
    GameGlobals.ctx.textAlign = "center";

    // Display text telling the player what they should click on.
    let textX = GameGlobals.canvas.width / 2;
    GameGlobals.currentText = 'Click on the '+GameGlobals.type;
    GameGlobals.ctx.fillText('Click on the '+GameGlobals.type, textX, 40);
    GameGlobals.canvas.addEventListener('click', checkImages);
}

// loadImages function taken from Lecture slides for lecture 14
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
    let names = [];
    /* Using this loop to run through all arrays in imageNames, so that I
     can add more images to the game solely by adding new image names to
      that array, rather than having to edit two different arrays.
     */
    for (let i=0; i<GameGlobals.imageNames.length; i++) {
        for (let j=0; j<GameGlobals.imageNames[i].length; j++) {
            let fileName = GameGlobals.imageNames[i][j];
            if (typeof fileName === 'string') {
                names.push("./img/game/" + fileName + ".jpg");
            }
        }
    }
    loadImages(names, playRound);
}

function inputName() {
    GameGlobals.ctx.clearRect(0, 0, GameGlobals.canvas.width, GameGlobals.canvas.height);
    // Show name input
    GameGlobals.gameButton.removeEventListener('click', inputName);
    GameGlobals.gameButton.addEventListener('click', getName);
    // Move game button down, so it shows below the name form
    GameGlobals.gameButton.style.top = 'calc(50% + 3.5em)';
    GameGlobals.nameInput.style.display = 'block';
}

function getName() {
    // Reset positioning and function of game button
    GameGlobals.gameButton.removeEventListener('click', getName);
    GameGlobals.gameButton.style.removeProperty('top');

    // Reset game globals, to ensure each round functions identically
    GameGlobals.reset();

    // Get value of second child (text field) of GameGlobals.nameInput div
    GameGlobals.name = GameGlobals.nameInput.children[1].value;
    GameGlobals.nameInput.style.removeProperty('display') // back to none - in CSS

    initialiseImageLoad();
}

GameGlobals.gameButton.addEventListener('click', inputName);