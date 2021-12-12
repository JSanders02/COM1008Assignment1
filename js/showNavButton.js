function changeNavVisible() {
    // 'Parent' function, used to control which change nav function is called
    if (nav.dataset.expanded === 'false') {
        nav.dataset.expanded = 'true';
    } else {
        nav.dataset.expanded = 'false';
    }

    if (window.innerWidth > 500) {
        changeNavVisibleDesktop();
    } else {
        changeNavVisibleMobile();
    }
}

function changeNavVisibleMobile() {
    
    nav.classList.toggle('nav-shown'); // Expands nav menu
    toggleNavFocus() // Toggle whether nav items can be selected by tab

    // Changes button text
    if (showButton.innerText === "Menu") {
        showButton.innerText = "Close";
    } else {
        showButton.innerText = "Menu";
    }
}

function changeNavVisibleDesktop() {
    nav.classList.toggle('nav-shown'); // Expands nav menu
    toggleNavFocus() // Toggle whether nav items can be selected by tab
    showButton.style.opacity = '0';
    if (nav.dataset.expanded === 'true') {
        setTimeout(function (){
            showButton.innerHTML = '<img' +
                ' src="img/nav/menuOpen.png"><p>Close</p>';
            showButton.style.opacity = '100';
        }, 250)
    } else {
        setTimeout(function (){
            showButton.innerHTML = '<img' +
                ' src="img/nav/menuClosed.png"><p>Menu</p>';
            showButton.style.opacity = '100';
        }, 250)
    }
}

function toggleNavFocus() {
    /* Select list of children (li elements) of second child (ul element) of
     nav */
    let listItems = nav.children[1].children;
    for (let i=0; i<listItems.length; i++) {
        // Select only child (anchor element) of li element
        let anchor = listItems[i].children[0];
        /* Change tabIndex attribute of anchor element to either 0 (can be
         selected with tab) or -1 (cannot be selected with tab).
         */
        if (anchor.tabIndex === 0) {
            anchor.tabIndex = -1;
        } else {
            anchor.tabIndex = 0;
        }
    }
}

let showButton = document.getElementById('show-nav');
let nav = document.getElementsByTagName("nav")[0];
nav.dataset.expanded = 'false';
showButton.addEventListener('click', changeNavVisible, false);
toggleNavFocus();