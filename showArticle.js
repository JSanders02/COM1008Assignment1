function toggleArticle(event) {
    // Select the paragraph in the news article that was clicked
    let article = event.currentTarget.children[2];

    /* Script checks whether the article is expanded. If not, then it
     multiplies current height of the article by 5 to get the final height,
      which will be enough to show all of the text. It will then set the
       height of the article to that, and change the value of expanded
        accordingly.
     */
    /* CSS transitions don't work with percentage values, so I can't just
     use height = '100%'.
     */
    if (article.dataset.expanded === 'false') {
        for (let i=0; i<articleFullSizes.length; i++) {
            if (articleFullSizes[i][0] === article) {
                article.style.height = (articleFullSizes[i][1]) + 'px';
            }
        }
        article.dataset.expanded = 'true';
    } else {
        let windowHeight = window.innerHeight;
        article.style.height = (windowHeight / 5 + 0.4) + 'px';
        article.dataset.expanded = 'false';
    }
}

function resetArticleSize() {
    let windowHeight = window.innerHeight;
    for (let i=0; i<articles.length; i++) {
        articles[i].addEventListener('click', toggleArticle, false);

        let paragraph = articles[i].children[2];

        /* Set default height of paragraph element */
        paragraph.style.height = '100%';
        /* Add a little extra to the max height, to avoid final line being
         cut off
         */
        articleFullSizes[i] = [paragraph, paragraph.offsetHeight + 32];
        paragraph.style.height = (windowHeight / 5 + 0.4) + 'px';

        // https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes
        /* Set HTML data-expanded to false (so the script knows that the article
         is not fully expanded)
         */
        paragraph.dataset.expanded = 'false';
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

resetArticleSize();
window.addEventListener('resize', resizeAction, false);