function changeNavVisibleMobile() {
    nav.classList.toggle('nav-shown'); // Expands nav menu
    toggleNavFocus() // Toggle whether nav items can be selected by tab

    // Changes button text
    if (showButtonMobile.innerHTML === "Menu") {
        showButtonMobile.innerHTML = "Close";
    } else {
        showButtonMobile.innerHTML = "Menu";
    }
}

function changeNavVisibleDesktop() {
    nav.classList.toggle('nav-shown'); // Expands nav menu
    toggleNavFocus() // Toggle whether nav items can be selected by tab
    showButtonDesktop.style.opacity = '0';
    if (showButtonDesktop.innerHTML === '<img src="img/menuClosed.png"><p>Menu</p>') {
        setTimeout(function (){
            showButtonDesktop.innerHTML = '<img src="img/menuOpen.png"><p>Close</p>';
            showButtonDesktop.style.opacity = '100';
        }, 250)
    } else {
        setTimeout(function (){
            showButtonDesktop.innerHTML = '<img src="img/menuClosed.png"><p>Menu</p>';
            showButtonDesktop.style.opacity = '100';
        }, 250)
    }
}

function toggleNavFocus() {
    /* Select list of children (li elements) of third child (ul element) of
     nav */
    let listItems = nav.children[2].children;
    for (let i=0; i<listItems.length; i++) {
        /* Select only child (anchor element) of li element */
        let anchor = listItems[i].children[0];
        if (anchor.tabIndex === 0) {
            anchor.tabIndex = -1;
        } else {
            anchor.tabIndex = 0;
        }
    }
}

let showButtonMobile = document.getElementById('show-nav-mobile');
let showButtonDesktop = document.getElementById('show-nav-desktop');
let nav = document.getElementsByTagName("nav")[0];
showButtonMobile.addEventListener('click', changeNavVisibleMobile, false);
showButtonDesktop.addEventListener('click', changeNavVisibleDesktop, false);
showButtonDesktop.innerHTML = '<img src="img/menuClosed.png"><p>Menu</p>'; // Fixes innerHTML to match if statement
toggleNavFocus();