const v1 = (collection) => {

window.sr = ScrollReveal();
raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(), raycaster ;
var scene, camera, renderer, mesh;
var skyboxMesh;
var backwards = false;
var stop = false;
var speed = 0.02;
var previousIntersect = 1;
var lastImagePosition = ""

const popupAnimation = function() {
  sr.reveal(".drop-in",
  {
    reset: false,
    easing: 'linear',
    delay: 300,
    duration: 600,
    interval: 200,
    origin: 'bottom',
  });
}

popupAnimation();

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

const menuAnimation = function () {
	let popup = document.getElementById('popup')
	popup.style.transform = 'translateX(0)';
}

const selecting = function(intersects){
  if (intersects[0].object.type !== "Sprite"){
  }
  else{
    console.log(intersects[0].object)
    $('#close').remove();
    $('#title').remove();
    $('#thumbnail').remove();
    $('#artist').remove();

    //Getting Artist Name
    //slug = name-name-title-title-title format
    var artistAndTitleArray = intersects[ 0 ].object.data.slug.split("-")
    var titleArray = intersects[0].object.data.title.split(" ")
    var artistAndTitle = intersects[ 0 ].object.data.slug.split("-").join(" ");
    var titleLength = intersects[0].object.data.title.split(" ").join(" ").length;
    var artistLowercase = artistAndTitle.slice(0, artistAndTitle.length - titleLength);
    //END GETIING ARTIST NAME
    var image = `${intersects[0].object.data._links.image.href.slice(0, intersects[0].object.data._links.image.href.length-19)}large.jpg`


		popupAnimation();
		menuAnimation();
		document.getElementById('popup-img').src = image;
		document.getElementById('popup-artist').innerHTML = artistLowercase;
		document.getElementById('popup-gallery').innerHTML = intersects[0].object.data.gallery;
		document.getElementById('popup-title').innerHTML = intersects[0].object.data.title;

  }
}

const cursorOver = function(intersects, sceneChildren){
  var whiteSpace = false
  if(intersects[0]=== undefined || intersects[0].object.type === "Mesh"){
    whiteSpace = true;
    if(speed === 0.01){
      speed = 0.02
    }
  }
  ;

  if (whiteSpace === true ){
    scene.children[(previousIntersect*2)].material.opacity=1
    scene.children[(previousIntersect*2)+ 1].material.opacity=1
  }
  else{
    if(previousIntersect !== intersects[0].object.index) {
      scene.children[(previousIntersect*2)].material.opacity=1
      scene.children[(previousIntersect*2)+ 1].material.opacity=1
      previousIntersect = intersects[0].object.index;

    }
    if (previousIntersect === intersects[0].object.index){
    speed = 0.01;
    previousIntersect = intersects[0].object.index;
    scene.children[(previousIntersect*2)].material.opacity=0.7
    scene.children[(previousIntersect*2)+ 1].material.opacity=0.7
    }
  }
}

//
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mousemove', onDocumentMouseOver);
window.addEventListener( 'resize', onDocumentResize);


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
  var vector = new THREE.Vector3(); // create once and reuse it!

	// ADD DAY
	$('#button').on('click', function() {
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
				if (state.isVolMinusDown) { //when down is pressed
					backwardsPress(0.001);
				}

				if (state.isVolPlusDown) { //When up is pressed
					forwardsPress(0.001);
				}
        const motionOver = function(){
          let pointer = {}
          pointer.x = quaternion.x;
          pointer.y = quaternion.y + 0.45;
          pointer.z = quaternion.z;
          // find intersections
          raycaster.setFromCamera( pointer, camera);
          var intersects = raycaster.intersectObjects( scene.children );
          cursorOver(intersects);
        }
        motionOver();

        if (state.isClickDown === true){
          event.preventDefault();
          // document.getElementById('popup').style.display = "none";
          let pointer = {}
          pointer.x = quaternion.x;
          pointer.y = quaternion.y + 0.45;
          pointer.z = quaternion.z;

          // find intersections
          raycaster.setFromCamera( pointer, camera);
          var intersects = raycaster.intersectObjects( scene.children );
          selecting(intersects);
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
  //END DAYDREAM CONTROLLER

  //START SKYBOX CREATION

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
  //END SKYBOX CREATION

const classic = () => {

	x = 0;
	y = 1;
	z = -2.5;
	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'data.json',
		success: function(data) {
      console.log(data)
			for (var i = 0; i < data._embedded.artworks.length; i++) {
        if (data._embedded.artworks[i]._links.image == undefined){
        }
        else{
          var image = `${data._embedded.artworks[i]._links.image.href.slice(0, data._embedded.artworks[i]._links.image.href.length-19)}square.jpg`
  				var map = new THREE.TextureLoader().load(`${image}`);
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
          newSprite.data = data._embedded.artworks[i];
          newSprite.index = i + 1;
  				// newSprite.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
          newSprite.scale.set(1, 1, 1)

          var imageFrame = `image/frame.jpg`
  				var mapFrame = new THREE.TextureLoader().load(`${imageFrame}`);
  				var materialFrame = new THREE.SpriteMaterial({
  					map: mapFrame,
  					color: 0xffffff,
  					fog: false
  				});
          var frame = new THREE.Sprite(materialFrame);
          frame.position.set(x, y, z);
  				// frame.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
          frame.index = i + 1
          frame.scale.set(1.25, 1.25, 1.25)
  				scene.add(newSprite)
          // scene.add(frame)
  			}
      }
		}
	})
  console.log(scene.children)
  lastImagePosition = scene.children[scene.children.length-1].position.z
}

const modern = () => {

	x = 0;
	y = 1;
	z = -2.5;

$.ajax({
 type: 'GET',
 dataType: 'json',
 async: false,
 url: 'modern.json',
 success: function(data){
	console.log(data);
   for (var i = 0; i < data.length; i++) {
     var image = new THREE.TextureLoader().load( data[i].image );
     var map = new THREE.TextureLoader().load(`${image}`);
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
     newSprite.data = data;
     newSprite.index = i + 1;
     newSprite.modern = true;
     // newSprite.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
     newSprite.receiveShadow = true;
     newSprite.castShadow = true;
     newSprite.scale.set(1, 1, 1)

     var imageFrame = `image/frame.jpg`
     var mapFrame = new THREE.TextureLoader().load(`${imageFrame}`);
     var materialFrame = new THREE.SpriteMaterial({
       map: mapFrame,
       color: 0xffffff,
       fog: false
     });
     var frame = new THREE.Sprite(materialFrame);

     frame.position.set(x, y, z);
     // frame.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
     frame.receiveShadow = true;
     frame.castShadow = true;
     frame.index = i + 1
     frame.scale.set(1.25, 1.25, 1.25)
     scene.add(newSprite)
     scene.add(frame)
   }

 }
})

}
document.getElementById('classic').onclick = function(){classic();};
document.getElementById('modern').onclick = function(){modern();};



	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	// Puts the "canvas" into our HTML page.
	document.body.appendChild(renderer.domElement);

	// Begin animation
	animate();

}
// xxxxx

function onDocumentMouseDown( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


		if (popup.style.transform = 'translateX(0)' && event.target.id !== "popup") {
			popup.style.transform = 'translateX(-100%)';
		}


  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  selecting(intersects);

}
// xxxxxxx
function onDocumentMouseOver( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );

  cursorOver(intersects, scene.children);
}

function onDocumentResize( event ){
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100000);
}

function animate() {

	if (backwards === false && stop === false) {
		camera.position.z -= speed
	};

	if (backwards === true && stop === false) {
		camera.position.z += speed
	}

	if( camera.position.z > 3){
    backwards = false;
  }

	if (camera.position.z < lastImagePosition - 5){
	 backwards = true
 }

	requestAnimationFrame(animate); // Tells the browser to smoothly render at 60Hz
	renderer.render(scene, camera);
}




// When the page has loaded, run init();
window.onload = init;

	init();
}



window.onload = v1;
