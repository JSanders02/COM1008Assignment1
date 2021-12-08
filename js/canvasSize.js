function resetCanvasSize() {
    /* Function to automatically resize the game canvas when the page is
     loaded/reloaded/resized, to take up the maximum space possible
     */
    let loadedItems = GameGlobals.drawObjects;
    let canvas = document.getElementById('game-canvas');
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
    let notCanvas = document.querySelectorAll('body>*:not(main, nav),' +
        ' main>*:not(#game-canvas), nav button');
    let elementsHeight = 0;

    let originalWidth = canvas.width;
    let originalHeight = canvas.height;

    // Get total height of all elements that aren't the canvas.
    for (let i=0; i<notCanvas.length; i++) {
       elementsHeight += notCanvas[i].offsetHeight;
    }

    if ((windowHeight - elementsHeight) * 0.9 < 500) {
        /* Minimum height, any smaller than this and the game would be
         uncomfortable to play
         */
        canvas.height = 500;
    } else {
        // Set height to 90% of available space
        canvas.height = (windowHeight - elementsHeight) * 0.9;
    }
    // Take 90% of screen width to match other elements
    canvas.width = windowWidth * 0.9;

    if (!loadedItems.includes(undefined)) {
        let xScale = canvas.width / originalWidth;
        for (let i=0; i<loadedItems.length; i++) {
            if (canvas.height !== originalHeight) {
                let imageHeight = (canvas.height - 80) / 3
                loadedItems[i].setHeight(imageHeight)
                var y = 65 + imageHeight*i;

                console.log(imageHeight, y);
            }
            loadedItems[i].setCoords(loadedItems[i].x * xScale, y);
            loadedItems[i].draw();
        }
    }

    let newSize;
    if (window.innerWidth > 550 && originalWindowWidth <= 550) {
        newSize = GameGlobals.font.substring(0, 2) * 2;
    } else if (window.innerWidth <= 550 && originalWindowWidth > 550) {
        newSize = GameGlobals.font.substring(0, 2) / 2;
    } else {
        newSize = GameGlobals.font.substring(0, 2);
    }

    console.log(newSize);
    GameGlobals.setFont(newSize + "px Verdana");

    let textX = canvas.width / 2;
    GameGlobals.ctx.textAlign = 'center'
    GameGlobals.ctx.fillText(GameGlobals.currentText, textX, 40);

    originalWindowWidth = window.innerWidth;
}

function resizeAction() {
    /* This prevents all of the article size calculations being performed
     thousands of times every time the window is reset.
     */
    if (timer === false) {
        /* If timer is not running, start it */
        timer = window.setTimeout(resetCanvasSize, 500);
    } else {
        /* If timer is running but window is still being resized, reset it */
        window.clearTimeout(timer)
        timer = window.setTimeout(resetCanvasSize, 500);
    }
}

let timer = false;
let originalWindowWidth = window.innerWidth;

window.addEventListener('load', resetCanvasSize);
window.addEventListener('resize', resizeAction);