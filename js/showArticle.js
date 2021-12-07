function toggleArticle(event) {
    // Select the article that was clicked
    let article = event.currentTarget;

    // Select the paragraph in the news article that was clicked
    let p = article.children[2];

    // Select the image in the article that was clicked
    let img = article.children[1];

    // Select the heading of the article that was clicked
    let heading = article.children[0];

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
                // Retrieve full size of article from array.
                img.style.width = '100%';
                article.style.height =  maxImageHeight + heading.offsetHeight + articleFullSizes[i][1] + 'px';
            }
        }
        p.dataset.expanded = 'true';
    } else {
        img.style.removeProperty('width');
        img.style.removeProperty('float');
        article.style.height = totalHeight + 'px';
        p.dataset.expanded = 'false';
    }
}

function resetArticleSize() {
    articles = document.getElementById("articles").children;
    articleFullSizes = [];
    totalHeight = 0;
    maxImageHeight = 0;

    let windowHeight = window.innerHeight;
    for (let i=0; i<articles.length; i++) {
        let article = articles[i];
        article.addEventListener('click', toggleArticle, false);

        // Get paragraph - second child of the article
        let p = article.children[2];

        // Reset height to CSS-defined value
        article.style.removeProperty('height');

        // Get image
        let img = article.children[1];

        // Get heading
        let heading = article.children[0];

        console.log(i);
        articleFullSizes[i] = [p, p.offsetHeight];
        if (i === 0) {
            totalHeight = (windowHeight / 5 + 0.4) + heading.offsetHeight;

            // Get max height of image
            img.style.transition = 'none';
            img.style.width = '100%';
            maxImageHeight = img.offsetHeight;
        }

        img.style.removeProperty('width');
        // Reset transition to stylesheet-defined value
        img.style.removeProperty('transition');

        // Set article element to default starting height - to avoid using auto
        article.style.height = totalHeight + 'px';

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

let articles;
let articleFullSizes;
let timer = 'false';
let totalHeight;
let maxImageHeight;

window.addEventListener('resize', resizeAction, false);
window.addEventListener('load', resetArticleSize, false);