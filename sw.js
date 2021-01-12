//Imports
importScripts('assets/js/sw-utils.js');

const CACHE_STATIC    = 'static-v1';
const CACHE_DYNAMIC   = 'dynamic-v1';
const CACHE_INMUTABLE = 'inmutable-v1';

const APP_SHELL = [
	'/bardot',
	'/bardot/',
	'index.html',
	
	'assets/css/style.css',

	'assets/js/main.js',
	'assets/js/app.js',

	'images/logo_bardot.png',
	'images/texto.png',
	'images/boton_ojo.png',
	'images/boton_labio.png',
	'images/boton_pomulos.png',
	'images/boton_rostro.png',
	'images/foto_modelo.png',
	'images/fondo_base.jpg',
	'images/boton_tiendas.png',
	'images/boton_virtual.png',
	'images/productos.png',
	'images/boton_labio1.png',
	'images/boton_labio2.png'
];

const APP_SHELL_INMUTABLE = [
	'https://use.fontawesome.com/releases/v5.7.2/css/all.css',
	'assets/css/bootstrap.min.css',
	'assets/js/popper.min.js',
	'assets/js/jquery-1.12.0.min.js',
	'assets/js/bootstrap.min.js',
	'assets/js/owl.carousel.min.js',
	'assets/js/jquery.yu2fvl.js'
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open( CACHE_STATIC )
        .then( cache => {
        	return cache.addAll(APP_SHELL);
        });
    
    const cacheInmutable = caches.open( CACHE_INMUTABLE )
    	.then( cache => cache.addAll(APP_SHELL_INMUTABLE) );

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]) );

});


self.addEventListener('activate', e => {

    const resp = caches.keys().then( keys => {
        keys.forEach(key => {
            if (key !== CACHE_STATIC && key.includes('static')) {
                return caches.delete(key);
            }
            if (key !== CACHE_DYNAMIC && key.includes('dynamic')) {
                return caches.delete(key);
            }

            if (key !== CACHE_INMUTABLE && key.includes('inmutable')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil( resp );
});


self.addEventListener('fetch', e => {

	const respuesta = caches.match( e.request ).then(resp => {
		//console.log('Peticion',e.request.url);
		if (resp) { return resp }
		//console.log('No existe',e.request.url);

		return fetch( e.request ).then( newResp => {
			
			return actualizarCacheDinamico(CACHE_DYNAMIC, e.request, newResp);
		});
	});

    
    e.respondWith( respuesta );
});