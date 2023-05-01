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


ScrollReveal().reveal('.reveal', config);
ScrollReveal().reveal('.reveal-right', config_1);
ScrollReveal().reveal('.reveal-top', config_2);
ScrollReveal().reveal('.reveal-bottom', config_3);

const button = document.querySelector('#menu-button');
const menu = document.querySelector('#menu');


button.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});
