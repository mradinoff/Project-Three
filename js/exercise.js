//FOR ARTSY API
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUyNjk2NzU4MywiaWF0IjoxNTI2MzYyNzgzLCJhdWQiOiI1YWY0ZWFkN2EwOWE2NzZjODA4N2Y0YzAiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNWFmYTcyOWY5YzE4ZGIyMDJlN2NjMTg5In0.zLuLtEdlB2dnD_u7VahsjNiW0RlaCu7avNn4Az_7icE"
var clientID = "b672dc2e7f242760d0d6"

var scene, camera, renderer, mesh;
var zoom = "";
var orbitCamera = "";
var zooming = function(){
	camera.position.set(camera.position.x,camera.position.y,zoom)
	camera.updateProjectionMatrix();
}
//
	document.addEventListener("keypress", function(event){
	if(event.keyCode === 119){
		zoom-=0.3
	}
	if(event.keyCode === 115){
		console.log("down")
		zoom+=0.2
	}
	zooming();
})
//Set up daydream variables
if ( 'bluetooth' in navigator === false ) {
  button.style.display = 'none';
  message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
}


function init(){
	// Create a scene and camera
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
	//

	// controls.update() must be called after any manual changes to the camera's transform
	var axis = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var quaternionHome = new THREE.Quaternion();
	var initialised = false;
	var timeout = null;

	// A Mesh is made up of a geometry and a material.
	// Materials affect how the geometry looks, especially under lights.

	const light = new THREE.PointLight("#f7f3a3");
light.position.set(-20, 30, 0);
console.log(light)
light.intensity = 3;
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
scene.add(light);
const lightHelper = new THREE.PointLightHelper(light);

// Add daydream controller
  $('#button').on( 'click', function () {
    console.log("Initialise daydream");
    var controller = new DaydreamController();
    controller.onStateChange( function ( state ) {
      if ( camera !== undefined ) {
        var angle = Math.sqrt( state.xOri * state.xOri + state.yOri * state.yOri + state.zOri * state.zOri );
        if ( angle > 0 ) {
          axis.set( state.xOri, state.yOri, state.zOri )
          axis.multiplyScalar( 1 / angle );
          quaternion.setFromAxisAngle( axis, angle );
          if ( initialised === false ) {
            quaternionHome.copy( quaternion );
            quaternionHome.inverse();
            initialised = true;
          }
        } else {
          quaternion.set( 0, 0, 0, 1 );
        }
				if (state.yTouch > 0.5){ //when down is pressed
					console.log("down")
					zoom +=0.05;
					zooming();
				}

				if (state.yTouch < 0.5 && state.yTouch > 0){ //When up is pressed
					console.log("up")
					zoom -=0.05;
					zooming();
				}
        if ( state.isHomeDown ) {
          if ( timeout === null ) {
            timeout = setTimeout( function () {
              quaternionHome.copy( quaternion );
              quaternionHome.inverse();
            }, 1000 );
          }
        } else {
          if ( timeout !== null ) {
            clearTimeout( timeout );
            timeout = null;
          }
        }
        camera.quaternion.copy( quaternionHome );
        camera.quaternion.multiply( quaternion );
        // touch.position.x = ( state.xTouch * 2 - 1 ) / 1000;
        // touch.position.y = - ( state.yTouch * 2 - 1 ) / 1000;
        // touch.visible = state.xTouch > 0 && state.yTouch > 0;
      }
    } );

    controller.connect();
  } );

	var axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );

	x = 0;
	y = 1;
	z= 2;
	$.ajax({
		 type : 'GET',
		 dataType : 'json',
		 async: false,
		 url: 'data.json',
	  success : function(data) {
			console.log(data._embedded.artworks[1]._links.thumbnail.href)
			for (var i =0; i<data._embedded.artworks.length; i++){
				var map = new THREE.TextureLoader().load(data._embedded.artworks[i]._links.thumbnail.href);
					var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: false} );
				var newSprite = new THREE.Sprite(material)

				if(x >= 0 && y > 0){
					x += 0.5;
			 		y -= 0.25;
				}
				else if (x > 0 && y <= 0) {
					x -= 0.5;
					y -= 0.25;
				}
				else if(x >= -3 && y < 0){
					x -= 0.5;
					y += 0.25;
				}
				else if (x < 0 && y >= 0){
					x += 0.5;
					y += 0.25;
				}
				z -= 2.5
				console.log(x,y,z)
				newSprite.position.set(x,y,z);
				newSprite.receiveShadow = true;
				newSprite.castShadow = true;
				scene.add(newSprite)
			}
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(1280, 720);
	// Puts the "canvas" into our HTML page.
	document.body.appendChild(renderer.domElement);

	// Begin animation
	animate();

}
function animate(){
	requestAnimationFrame(animate); // Tells the browser to smoothly render at 60Hz

	// Rotate our mesh.
	// mesh.rotation.x += 0.01;
	// mesh.rotation.y += 0.02;

	// Draw the scene from the perspective of the camera.
	renderer.render(scene, camera);
}

// When the page has loaded, run init();
window.onload = init;
