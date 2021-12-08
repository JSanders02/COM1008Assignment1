function resetCanvasSize() {
    /* Function to automatically resize the game canvas when the page is
     loaded/reloaded/resized, to take up the maximum space possible
     */
    var canvas = document.getElementById('game-canvas');
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll
    var notCanvas = document.querySelectorAll('body>*:not(main, nav),' +
        ' main>*:not(#game-canvas), nav button');
    var elementsHeight = 0;

    // Get total height of all elements that aren't the canvas.
    for (let i=0; i<notCanvas.length; i++) {
       elementsHeight += notCanvas[i].offsetHeight;
    }

    if ((windowHeight - elementsHeight) * 0.9 < 450) {
        /* Minimum height, any smaller than this and the game would be
         uncomfortable to play
         */
        canvas.height = 450;
    } else {
        // Set height to 90% of available space
        canvas.height = (windowHeight - elementsHeight) * 0.9;
    }
    // Take 90% of screen width to match other elements
    canvas.width = windowWidth * 0.9;
}

function resizeAction() {
    /* This prevents all of the article size calculations being performed
     thousands of times every time the window is reset.
     */
    if (timer === 'false') {
        /* If timer is not running, start it */
        timer = window.setTimeout(resetCanvasSize, 500);
    } else {
        /* If timer is running but window is still being resized, reset it */
        window.clearTimeout(timer)
        timer = window.setTimeout(resetCanvasSize, 500);
    }
}

let timer = 'false';
window.addEventListener('load', resetCanvasSize);
window.addEventListener('resize', resizeAction);