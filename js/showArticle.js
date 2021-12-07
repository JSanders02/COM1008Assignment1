function toggleArticle(event) {
    // Select the paragraph in the news article that was clicked
    let p = event.currentTarget.children[2];

    /* Script checks whether the article is expanded. If not, then it
     multiplies current height of the article by 5 to get the final height,
      which will be enough to show all of the text. It will then set the
       height of the article to that, and change the value of expanded
        accordingly.
     */
    /* CSS transitions don't work with percentage values, so I can't just
     use height = '100%'.
     */
    if (p.dataset.expanded === 'false') {
        for (let i=0; i<articleFullSizes.length; i++) {
            if (articleFullSizes[i][0] === p) {
                p.style.height = (articleFullSizes[i][1]) + 'px';
            }
        }
        p.dataset.expanded = 'true';
    } else {
        /* Get heading element (previous sibling of the previous sibling
             (the image) of the paragraph).
             */
        let heading = p.previousElementSibling.previousElementSibling;
        p.style.height = (totalHeight - heading.offsetHeight) + 'px';
        p.dataset.expanded = 'false';
    }
}

function resetArticleSize() {
    let windowHeight = window.innerHeight;
    for (let i=0; i<articles.length; i++) {
        articles[i].addEventListener('click', toggleArticle, false);

        // Get paragraph - second child of the article
        let p = articles[i].children[2];

        let heading = p.previousElementSibling.previousElementSibling;

        /* Set default height of paragraph element */
        p.style.height = '100%';
        /* Add a little extra to the max height, to avoid final line being
         cut off
         */
        articleFullSizes[i] = [p, p.offsetHeight + 32];
        if (i === 0) {
            // Set first article to a default height
            p.style.height = (windowHeight / 5 + 0.4) + 'px';
            totalHeight = (windowHeight / 5 + 0.4) + heading.offsetHeight;
        } else {
            /* Use total height and subtract height of heading, so that the
             bottom of every article lines up, creating a nicer look.
             */
            p.style.height = (totalHeight - heading.offsetHeight) + 'px';
        }

        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        /* Set HTML data-expanded to false (so the script knows that the article
         is not fully expanded)
         */
        p.dataset.expanded = 'false';
    }
}

function resizeAction() {
    /* This prevents all of the article size calculations being performed
     thousands of times every time the window is reset.
     */
    if (timer === 'false') {
        /* If timer is not running, start it */
        timer = window.setTimeout(resetArticleSize, 500);
    } else {
        /* If timer is running but window is still being resized, reset it */
        window.clearTimeout(timer)
        timer = window.setTimeout(resetArticleSize, 500);
    }
}

let articles = document.getElementById("articles").children
let articleFullSizes = [];
let timer = 'false'
let totalHeight = 0;

resetArticleSize();
window.addEventListener('resize', resizeAction, false);