// This source is the javascript needed to build a sky box in **three.js**
// It is the source about this [blog post](/blog/2011/08/15/lets-do-a-sky/).

// ## Now lets start

// declare a bunch of variable we will need later
var startTime	= Date.now();
var container;
var keyboard, devOrientation, world;
var physicsWorld;
var camera, scene, renderer, stats;
var skyboxMesh;

// ## bootstrap functions
if ( ! Detector.webgl ){
	// test if webgl is supported
	Detector.addGetWebGLMessage();
}else{
	// initialiaze everything
	init();
	// make it move			
	animate();	
}

// ## Initialize everything
function init() {
	// create the container element
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
	// keyboard	= new THREEx.KeyboardState();
	devOrientation	= new THREEx.DeviceOrientationState();
	// create the renderer cache
	renderer._microCache	= new MicroCache();

	// create the Scene
	scene = new THREE.Scene();
	
	// var ambient	= new THREE.AmbientLight( 0xFFFFFF );
	// scene.addLight( ambient );

	// var directionalLight = new THREE.DirectionalLight( 0xffffff );
	// directionalLight.position.set( 0, 0, 1 ).normalize();
	// scene.addLight( directionalLight );
	
	// physicsWorld	= new MarblePhysics.World();

	world	= new Marble.World({
		scene	: scene
	});

}

// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
}


// ## Render the 3D Scene
function render() {

	world.tick();
	
	// actually display the scene in the Dom element
	renderer.render( scene, world.camera().object() );
}
