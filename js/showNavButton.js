function changeNavVisibleMobile() {
    nav.classList.toggle('nav-shown'); // Expands nav menu

    // Changes button text
    if (showButtonMobile.innerHTML === "Menu") {
        showButtonMobile.innerHTML = "Close";
    } else {
        showButtonMobile.innerHTML = "Menu";
    }
}

function changeNavVisibleDesktop() {
    nav.classList.toggle('nav-shown'); // Expands nav menu
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

let showButtonMobile = document.getElementById('show-nav-mobile');
let showButtonDesktop = document.getElementById('show-nav-desktop');
let nav = document.getElementsByTagName("nav")[0];
showButtonMobile.addEventListener('click', changeNavVisibleMobile, false);
showButtonDesktop.addEventListener('click', changeNavVisibleDesktop, false);
showButtonDesktop.innerHTML = '<img src="img/menuClosed.png"><p>Menu</p>'; // Fixes innerHTML to match if statement