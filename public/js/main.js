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

const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');
butter.init();


