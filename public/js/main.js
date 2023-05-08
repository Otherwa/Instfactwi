ScrollReveal({ reset: true });

let config = {
    delay: 375,
    duration: 500,
    useDelay: 'always',
    origin: 'bottom',
    distance: '50px'
}

let config_1 = {
    delay: 375,
    duration: 500,
    useDelay: 'always',
    origin: 'right',
    distance: '50px'
}

let config_2 = {
    delay: 375,
    duration: 500,
    useDelay: 'always',
    origin: 'top',
    distance: '50px'
}

let config_3 = {
    delay: 375,
    duration: 500,
    useDelay: 'always',
    origin: 'bottom',
    distance: '50px'
}


ScrollReveal().reveal('#head', config);
ScrollReveal().reveal('#accordion-color', config_1);
ScrollReveal().reveal('#form', config);
ScrollReveal().reveal('#network', config);
ScrollReveal().reveal('#heading', config);
ScrollReveal().reveal('#content', config);

const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');

window.addEventListener("contextmenu", e => e.preventDefault());


