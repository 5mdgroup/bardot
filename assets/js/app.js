var url = window.location.href;
var swLocation = '/bardot/sw.js';

if ( navigator.serviceWorker ) {
    navigator.serviceWorker.register(swLocation);
}