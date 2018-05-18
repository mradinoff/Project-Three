//FOR ARTSY API
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6IiIsImV4cCI6MTUyNjk2NzU4MywiaWF0IjoxNTI2MzYyNzgzLCJhdWQiOiI1YWY0ZWFkN2EwOWE2NzZjODA4N2Y0YzAiLCJpc3MiOiJHcmF2aXR5IiwianRpIjoiNWFmYTcyOWY5YzE4ZGIyMDJlN2NjMTg5In0.zLuLtEdlB2dnD_u7VahsjNiW0RlaCu7avNn4Az_7icE"
var clientID = "b672dc2e7f242760d0d6"

raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), raycaster ;
var scene, camera, renderer, mesh;
var skyboxMesh;
var backwards = false;
var stop = false;
var speed = 0.02;
var previousIntersect = -1;
let timelineWorkspace = []

var forwardsPress = function(changingSpeed) {
	if (speed < 0 && backwards === true) {
		backwards = false;
		speed = changingSpeed
	} else if (backwards === true) {
		speed -= changingSpeed
	} else if (stop === true) {
		backwards = false;
		stop = false;
		speed = changingSpeed
	} else {
		speed += changingSpeed
	}
}
var backwardsPress = function(changingSpeed) {
	if (speed < 0 && backwards === false) {
		backwards = true;
		speed = changingSpeed
	} else if (backwards === false) {
		speed -= changingSpeed
	} else if (stop === true) {
		backwards = true;
		stop = false;
		speed = changingSpeed
	} else {
		speed += changingSpeed
	}
}
var stopPress = function() {
	if (stop === false) {
		stop = true
		console.log("pressed")
		speed = 0.02
	} else if (stop === true) {
		stop = false
	}
}

//
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mousemove', onDocumentMouseOver);


document.addEventListener("keypress", function(event) {
  if (event.keyCode === 119) {
		forwardsPress(0.01);
		}
		if (event.keyCode === 115) {
				  backwardsPress(0.01)
    }
		if (event.keyCode === 32) {
			stopPress();
		}
	});

			//Set up daydream variables
 if ('bluetooth' in navigator === false) {
	button.style.display = 'none';
	message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
}


function init() {
	// Create a scene and camera
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100000);
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
	light.intensity = 3;
	light.castShadow = true;
	light.shadow.mapSize.width = 2048;
	light.shadow.mapSize.height = 2048;
	scene.add(light);
	const lightHelper = new THREE.PointLightHelper(light);
	// Add daydream controller
	$('#button').on('click', function() {
		console.log("Initialise daydream");
		var controller = new DaydreamController();
		controller.onStateChange(function(state) {
			if (camera !== undefined) {
				var angle = Math.sqrt(state.xOri * state.xOri + state.yOri * state.yOri + state.zOri * state.zOri);
				if (angle > 0) {
					axis.set(state.xOri, state.yOri, state.zOri)
					axis.multiplyScalar(1 / angle);
					quaternion.setFromAxisAngle(axis, angle);
					if (initialised === false) {
						quaternionHome.copy(quaternion);
						quaternionHome.inverse();
						initialised = true;
					}
				} else {
					quaternion.set(0, 0, 0, 1);
				}
				if (state.yTouch > 0.5) { //when down is pressed
					backwardsPress(0.001);
				}

				if (state.yTouch < 0.5 && state.yTouch > 0) { //When up is pressed
					forwardsPress(0.001);
				}
        if (state.isVolMinusDown === true){
          stopPress();
        }
				if (state.isHomeDown) {
					if (timeout === null) {
						timeout = setTimeout(function() {
							quaternionHome.copy(quaternion);
							quaternionHome.inverse();
						}, 1000);
					}
				} else {
					if (timeout !== null) {
						clearTimeout(timeout);
						timeout = null;
					}
				}
				camera.quaternion.copy(quaternionHome);
				camera.quaternion.multiply(quaternion);
				// touch.position.x = ( state.xTouch * 2 - 1 ) / 1000;
				// touch.position.y = - ( state.yTouch * 2 - 1 ) / 1000;
				// touch.visible = state.xTouch > 0 && state.yTouch > 0;
			}
		});

		controller.connect();
	});

	var axesHelper = new THREE.AxesHelper(5);
	scene.add(axesHelper);

  var urls = [ "skybox/px.jpg", "skybox/nx.jpg",
      "skybox/py.jpg", "skybox/ny.jpg",
      "skybox/pz.jpg", "skybox/nz.jpg" ];
  var textureCube = THREE.ImageUtils.loadTextureCube(urls);
  var shader = THREE.ShaderLib["cube"];
  var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
  uniforms['tCube'].value= textureCube;   // textureCube has been init before
  var material = new THREE.ShaderMaterial({
      fragmentShader    : shader.fragmentShader,
      vertexShader  : shader.vertexShader,
      uniforms  : uniforms,
      side : THREE.BackSide
  });

  // build the skybox Mesh
  skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );
  skyboxMesh.doubleSided = true;
  // add it to the scene
  scene.add(skyboxMesh);

  //Sprite Loader
	x = 0;
	y = 1;
	z = -2.5;
	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'data.json',
		success: function(data) {

      console.log(data._embedded.artworks[0].date.slice(0, 4))
      for( var i = 0; i < data._embedded.artworks.length; i++){
          if  (data._embedded.artworks[i].date.slice(0, 4) === ""){
          }
          else{
          timelineWorkspace.push([i, data._embedded.artworks[i].date.slice(0, 4)])
        }
      }
      timelineWorkspace.sort(function(a, b) {
        return a[1] - b[1];
      });
      console.log(timelineWorkspace)
			for (var i = 0; i < timelineWorkspace.length; i++) {`${data._embedded.artworks[timelineWorkspace[i][0]]._links.image.href.slice(0, data._embedded.artworks[timelineWorkspace[i][0]]._links.image.href.length-19)}square.jpg`
        var image = `${data._embedded.artworks[timelineWorkspace[i][0]]._links.image.href.slice(0, data._embedded.artworks[timelineWorkspace[i][0]]._links.image.href.length-19)}square.jpg`
				var map = new THREE.TextureLoader().load(`${data._embedded.artworks[timelineWorkspace[i][0]]._links.image.href.slice(0, data._embedded.artworks[timelineWorkspace[i][0]]._links.image.href.length-19)}square.jpg`);
				var material = new THREE.SpriteMaterial({
					map: map,
					color: 0xffffff,
					fog: false
				});
				var newSprite = new THREE.Sprite(material)

				if (x >= 0 && y > 0) {
					x += 0.5;
					y -= 0.25;
				} else if (x > 0 && y <= 0) {
					x -= 0.5;
					y -= 0.25;
				} else if (x >= -2 && y < 0) {
					x -= 0.5;
					y += 0.25;
				} else if (x < 0 && y >= 0) {
					x += 0.5;
					y += 0.25;
				}
				z -= 2.5
				newSprite.position.set(x, y, z);
        console.log(data._embedded.artworks[timelineWorkspace[i][0]])
        newSprite.data = data._embedded.artworks[timelineWorkspace[i][0]];
        newSprite.index = [timelineWorkspace[i][0]];
				// newSprite.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
				newSprite.receiveShadow = true;
				newSprite.castShadow = true;
        newSprite.scale.set(1, 1, 1)
				scene.add(newSprite)
			}

		}
	})


	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor("white")

	// Puts the "canvas" into our HTML page.
	document.body.appendChild(renderer.domElement);

	// Begin animation
	animate();

}
// xxxxx

function onDocumentMouseDown( event ) {
  event.preventDefault();
  document.getElementById('popup').style.display = "none";
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  $('#close').remove();
  $('#title').remove();
  $('#thumbnail').remove();
  console.log(intersects)
  console.log(intersects[0].object.data._links.image.href)
  var image = `${intersects[0].object.data._links.image.href.slice(0, intersects[0].object.data._links.image.href.length-19)}large.jpg`
  document.getElementById('popup').style.display = "block";
  $('#popup').append(`<h1 id="title">${intersects[0].object.data.title}</h1>`);
  $('#popup').append(`<img id = "thumbnail" src=${image}>`);

}
// xxxxxxx
function onDocumentMouseOver( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );

  var whiteSpace = false
  if(intersects[0]=== undefined || intersects[0].object.type === "Mesh"){
    whiteSpace = true;
    if(speed === 0.01){
      speed = 0.02
    }
  }
  ;
  if (whiteSpace === true){
  }
  else{
    if(previousIntersect !== intersects[0].object.index){
    }
    else{
    }
    speed = 0.01;
    previousIntersect = intersects[0].object.index;
  }
}


function animate() {
	if (backwards === false && stop === false) {
		camera.position.z -= speed
	};
	if (backwards === true && stop === false) {
		camera.position.z += speed
	}
	requestAnimationFrame(animate); // Tells the browser to smoothly render at 60Hz
	renderer.render(scene, camera);
}

// When the page has loaded, run init();
window.onload = init;
