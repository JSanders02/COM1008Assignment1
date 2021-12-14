// Author: Jack Sanders

/* The purpose of this script is to control whether articles on the news
 page are showing their preview or not. It does this by first calculating
  the maximum heights of each article when expanded (heading height + date
   height + image height + text height) and storing those, before minimising
    the article size to a value of (max heading height + max date height +
     max image height + preview height). Then, an event listener is added to
      each article, that calls toggleArticle for that particular one,
       setting the height to the maximum and allowing the user to read it.
 */

function toggleArticle(event) {
    // Select the article that was clicked
    let article = event.currentTarget;

    // Select the paragraph in the news article that was clicked
    let p = article.children[3];

    // Select the image in the article that was clicked
    let img = article.children[2];

    // Select the date of the article that was clicked
    let date = article.children[1];

    // Select the heading of the article that was clicked
    let heading = article.children[0];

    /* CSS transitions don't work with percentage values (only for height,
     for some reason they work fine for width), so I can't just use height =
      '100%'.
     */
    if (article.expanded === 'false') {
        img.style.width = '100%';
        // Set article to max height
        article.style.height =  maxImageHeight + heading.offsetHeight + date.offsetHeight + p.offsetHeight + 'px';
        article.expanded = 'true';
    } else {
        img.style.removeProperty('width');
        img.style.removeProperty('float');

        let extraHeight;
        if (window.innerWidth > 500) {
            /* On desktop, set the height of the article to include the
             maximum heading/date height of all articles - this means that the
              bottoms of the articles will be lined up with one another,
               making the page look consistent.
             */
            extraHeight = maxHeadingHeight + maxDateHeight;
        } else {
            /* If on mobile, just add the heading/date height of the current
             article - doesn't matter if articles have different heights as
              they are not aligned next to each other
             */
            extraHeight = heading.offsetHeight + date.offsetHeight;
        }
        article.style.height = totalHeight + extraHeight + 'px';
        article.expanded = 'false';
    }
}

function resetArticleSize() {
    articles = document.getElementById("articles").children;
    totalHeight = 0;
    maxImageHeight = 0;
    maxHeadingHeight = 0;
    maxDateHeight = 0;

    let windowHeight = window.innerHeight;
    for (let i=0; i<articles.length; i++) {
        let article = articles[i];

        // Get image
        var img = article.children[2];

        // Get date
        let date = article.children[1];

        // Get heading
        let heading = article.children[0];
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
        if (date.offsetHeight > maxDateHeight) {
            maxDateHeight = date.offsetHeight;
        }
    }

    // Set the max possible height of an article - not including the heading
    if (window.innerWidth > 500) {
        // If on desktop
        totalHeight = (windowHeight / 5);
    } else {
        /* If on mobile, image height needs to be taken into account - on
         desktop, text floats around the image so it can be ignored.
         */
        totalHeight = (windowHeight / 10) + img.offsetHeight;
    }

    
    for (let i=0; i<articles.length; i++) {
        let article = articles[i];
        let heading = article.children[0];
        let date = article.children[1];
        article.addEventListener('click', toggleArticle, false);

        // Reset height to CSS-defined value
        article.style.removeProperty('height');

        // Set article element to default starting height - to avoid using auto
        let extraHeight
        if (window.innerWidth > 500) {
            extraHeight = maxHeadingHeight + maxDateHeight;
        } else {
            extraHeight = heading.offsetHeight + date.offsetHeight;
        }
        article.style.height = totalHeight + extraHeight + 'px';

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
let maxDateHeight;

window.addEventListener('resize', resizeAction, false);
window.addEventListener('load', resetArticleSize, false);