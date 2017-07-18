// Sideout
// https://github.com/mango/slideout

var slideout = new Slideout({
    'menu': document.getElementById('sidebar'),
    'panel': document.getElementById('main'),
    'side': 'left',
    'padding': 300,
    'tolerance': 70
});

// Toggle button
document.querySelector('.btn-hamburger').addEventListener('click', function() {
    slideout.toggle();
});
// Enable touch
slideout.enableTouch();

// Show collapsed sidebar only on small screens
var jmediaquery = window.matchMedia("(min-width: 480px)")
jmediaquery.addListener(handleSmallScreen);
handleSmallScreen(jmediaquery);

function handleSmallScreen(jmediaquery) {
    if (!jmediaquery.matches) {
        // orientation changed
        slideout.open();
    } else {
        slideout.close();
    }
}