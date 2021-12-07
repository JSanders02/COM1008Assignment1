function toggleArticle(event) {
    // Select the article that was clicked
    let article = event.currentTarget;

    // Select the paragraph in the news article that was clicked
    let p = article.children[2];

    // Select the image in the article that was clicked
    let img = article.children[1];

    // Select the heading of the article that was clicked
    let heading = article.children[0];

    /* CSS transitions don't work with percentage values (only for height,
     for some reason they work fine for width), so I can't just use height =
      '100%'.
     */
    if (article.expanded === 'false') {
        // Retrieve full size of article from array.
        img.style.width = '100%';
        article.style.height =  maxImageHeight + heading.offsetHeight + p.offsetHeight + 'px';
        article.expanded = 'true';
    } else {
        img.style.removeProperty('width');
        img.style.removeProperty('float');
        article.style.height = totalHeight + 'px';
        article.expanded = 'false';
    }
}

function resetArticleSize() {
    articles = document.getElementById("articles").children;
    totalHeight = 0;
    maxImageHeight = 0;
    maxHeadingHeight = 0;

    let windowHeight = window.innerHeight;
    console.log(windowHeight);
    for (let i=0; i<articles.length; i++) {
        let article = articles[i];

        // Get image
        var img = article.children[1];

        // Get heading
        var heading = article.children[0];
        if (i === 0) {
            // Get max height of image
            img.style.transition = 'none';
            img.style.width = '100%';
            maxImageHeight = img.offsetHeight;
        }

        img.style.removeProperty('width');
        img.style.removeProperty('transition');

        if (heading.offsetHeight > maxHeadingHeight) {
            maxHeadingHeight = heading.offsetHeight;
        }
    }

    if (window.innerWidth > 500) {
        // If on desktop
        totalHeight = (windowHeight / 5) + maxHeadingHeight;
    } else {
        totalHeight = (windowHeight / 10) + img.offsetHeight + heading.offsetHeight;
    }

    
    for (let i=0; i<articles.length; i++) {
        let article = articles[i];
        article.addEventListener('click', toggleArticle, false);

        // Reset height to CSS-defined value
        article.style.removeProperty('height');

        // Set article element to default starting height - to avoid using auto
        article.style.height = totalHeight + 'px';

        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        /* Set HTML data-expanded to false (so the script knows that the article
         is not fully expanded)
         */
        article.expanded = 'false';
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
let timer = 'false';
let totalHeight;
let maxImageHeight;
let maxHeadingHeight;

window.addEventListener('resize', resizeAction, false);
window.addEventListener('load', resetArticleSize, false);