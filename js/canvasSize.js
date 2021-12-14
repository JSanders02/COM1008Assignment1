// Author: Jack Sanders

/* This function is used to make the game responsive, by making the size of
 the canvas respond to the screen size. Also, it will alter the position and
  size of objects that have been drawn onto the canvas by the main game script.
 */

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

    let imageHeight;
    /* Different imageHeight depending on whether the canvas is wider
     than it is tall - using the same height no matter what will result
      in images being impossible to place without overlapping, resulting
       in the webpage freezing as the loop runs indefinitely.
     */
    if (canvas.height < canvas.width) {
        // - 80 to make room for any text that is displayed
        imageHeight = (canvas.height - 80) / 3;
    } else {
        imageHeight = (canvas.width) / 3;
    }

    // If loadedItems contains only objects,adjust their position accordingly
    if (!loadedItems.includes(undefined)) {
        // Calculate scale in each axis, and multiply coordinates by the scales
        let xScale = canvas.width / originalWidth;
        let yScale = canvas.height / originalHeight;
        for (let i=0; i<loadedItems.length; i++) {
            let current = loadedItems[i];
            let height = current.getHeight();
            let newCentreX = (current.getX() + height / 2) * xScale;
            let newCentreY = (current.getY() + height / 2) * yScale;
            current.setCoords(newCentreX - height / 2, newCentreY - height / 2);
            current.setHeight(imageHeight);
            current.draw();
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

/* Add event listeners for load and resize, so that the canvas is refreshed
 every time the page is loaded, reloaded, or resized.
 */
window.addEventListener('load', resetCanvasSize);
window.addEventListener('resize', resizeAction);