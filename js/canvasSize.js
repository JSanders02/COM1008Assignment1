function resetCanvasSize() {
    /* Function to automatically resize the game canvas when the page is
     loaded/reloaded/resized, to take up the maximum space possible - makes
      game responsive, even while running.
     */
    /* Retrive items on canvas from GameGlobals - javascript scripts all
     share the same namespace, making this possible.
     */
    let loadedItems = GameGlobals.drawObjects;
    let canvas = document.getElementById('game-canvas');
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;

    // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
    /* Select every element that isn't the canvas (or the navbar, as that
     shouldn't impact the height of the canvas.
     */
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

    // If loadedItems contains only objects,adjust their position accordingly
    if (!loadedItems.includes(undefined)) {
        // Calculate scale in each axis, and multiply coordinates by the scales
        let xScale = canvas.width / originalWidth;
        let yScale = canvas.height / originalHeight;
        for (let i=0; i<loadedItems.length; i++) {
            if (canvas.height !== originalHeight) {
                let imageHeight = (canvas.height - 80) / 3
                loadedItems[i].setHeight(imageHeight)
            }
            loadedItems[i].setCoords(loadedItems[i].getX() * xScale, loadedItems[i].getY() * yScale);
            loadedItems[i].draw();
        }
    }

    /* Adjust font size, by taking the current size and multiplying or
     dividing by 2, depending on whether the window width grew over the
      threshold, or shrunk below it.
     */
    let newSize;
    if (window.innerWidth > 550 && originalWindowWidth <= 550) {
        newSize = GameGlobals.font.substring(0, 2) * 2;
    } else if (window.innerWidth <= 550 && originalWindowWidth > 550) {
        newSize = GameGlobals.font.substring(0, 2) / 2;
    } else {
        newSize = GameGlobals.font.substring(0, 2);
    }

    GameGlobals.setFont(newSize + "px Verdana");

    // Adjust position of text
    let textX = canvas.width / 2;
    GameGlobals.ctx.textAlign = 'center'
    GameGlobals.ctx.fillText(GameGlobals.currentText, textX, 40);

    /* Set originalWindowWidth to the current width of the window, for use
     in future calculations.
     */
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