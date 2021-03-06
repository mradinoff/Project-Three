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
var imageFrame = `image/frame.jpg`
let modernRunning = "";

// Create a scene and camera
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 25);
//

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

    //Getting Artist Name
    //slug = name-name-title-title-title format
    if(modernRunning === false){
      var artistAndTitleArray = intersects[ 0 ].object.data.slug.split("-")
      var titleArray = intersects[0].object.data.title.split(" ")
      var artistAndTitle = intersects[ 0 ].object.data.slug.split("-").join(" ");
      var titleLength = intersects[0].object.data.title.split(" ").join(" ").length;
      var artistLowercase = artistAndTitle.slice(0, artistAndTitle.length - titleLength);
      //END GETIING ARTIST NAME
      var image = `${intersects[0].object.data._links.image.href.slice(0, intersects[0].object.data._links.image.href.length-19)}large.jpg`
      document.getElementById('popup-artist').innerHTML = artistLowercase;
      $('.info').prepend(`<img id='popup-img' src=${image}>`)
    }

    else{
      var image = intersects[0].object.data.image;
      var artist = intersects[0].object.data.artist;
      document.getElementById('popup-artist').innerHTML = artist;
      $('.info').prepend(`<img id='popup-img' src=${image}>`)
    }

		document.getElementById('popup-title').innerHTML = intersects[0].object.data.title;
    if(intersects[0].object.data.gallery == undefined){
      document.getElementById('popup-gallery').innerHTML = "";
    }
    else{
    document.getElementById('popup-gallery').innerHTML = intersects[0].object.data.gallery;
    }
    popupAnimation();
    menuAnimation();
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
  if (whiteSpace === true && modernRunning === ""){

  }
  else if (whiteSpace === true){
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
  if (event.keyCode === 119 || event.keyCode === 87) {
		forwardsPress(0.01);
		}
		if (event.keyCode === 115 || event.keyCode === 83) {
				  backwardsPress(0.01)
    }
		if (event.keyCode === 32) {
			stopPress();
		}
	});

			//Set up daydream variables
 if ('bluetooth' in navigator === false) {
	button.style.display = 'none';
}


function init() {


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
  skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 15000, 15000, 15000, 1, 1, 1, null, true ), material );
  skyboxMesh.doubleSided = true;
  // add it to the scene
  scene.add(skyboxMesh);
  //END SKYBOX CREATION

const classic = () => { //CLEARS THE SCENE
  modernRunning = false;
  x = 0;
	y = 1;
	z = -7.5;
	$.ajax({
		type: 'GET',
		dataType: 'json',
		async: false,
		url: 'classic.json',
		success: function(data) {

      var n = data._embedded.artworks.slice(0); // clone the array
      var r = []; //DATA RANDOMIZER
      while (n.length){
          rand = Math.floor(Math.random()*n.length);
          r.push(n.splice(rand,1));
      }

			for (var i = 0; i < data._embedded.artworks.length; i++) {
        if (r[i][0]._links.image == undefined){
        }
        else{
          var image = `${r[i][0]._links.image.href.slice(0, r[i][0]._links.image.href.length-19)}square.jpg`
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
          newSprite.data = r[i][0];
          newSprite.index = i + 1;
  				// newSprite.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
          newSprite.scale.set(1, 1, 1)


  				var mapFrame = new THREE.TextureLoader().load(`${imageFrame}`);
  				var materialFrame = new THREE.SpriteMaterial({
  					map: mapFrame,
  					color: 0xffffff,
  					fog: false
  				});
          var frame = new THREE.Sprite(materialFrame);
          frame.position.set(x, y, z);
          frame.index = i + 1
          frame.scale.set(1.25, 1.25, 1.25)
  				scene.add(newSprite)
          scene.add(frame)
  			}
      }
		}
	})
  lastImagePosition = scene.children[scene.children.length-1].position.z
}

const modern = () => {
  modernRunning = true;
	x = 0;
	y = 1;
	z = -7.5;

  $.ajax({
   type: 'GET',
   dataType: 'json',
   async: false,
   url: 'modern.json',
   success: function(data){

     var n = data.slice(0); // clone the array
     var r = []; //DATA RANDOMIZER
     while (n.length){
         rand = Math.floor(Math.random()*n.length);
         r.push(n.splice(rand,1));
     }
     for (var i = 0; i < data.length; i++) {
       var image = r[i][0].image;
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
       newSprite.data = r[i][0];
       newSprite.index = i + 1;
       newSprite.modern = true;
       // newSprite.position.set(5+Math.random()*(1, 5),2+Math.random()*(1,5),0+Math.random()*(1,5))
       newSprite.scale.set(1, 1, 1)


       var mapFrame = new THREE.TextureLoader().load(`${imageFrame}`);
       var materialFrame = new THREE.SpriteMaterial({
         map: mapFrame,
         color: 0xffffff,
         fog: false
       });
       var frame = new THREE.Sprite(materialFrame);

       frame.position.set(x, y, z);
       frame.index = i + 1
       frame.scale.set(1.25, 1.25, 1.25)
       scene.add(newSprite)
       scene.add(frame)
     }

   }

 })
 lastImagePosition = scene.children[scene.children.length-1].position.z

}
document.getElementById('classic').onclick = function(){
  for( var i = scene.children.length - 1; i >= 0; i--) {
    scene.remove(scene.children[2]);
 }
 window.stop()
 speed = 0.02;
 backwards = false;
 camera.position.z = 0;
 classic();
};
document.getElementById('modern').onclick = function(){
  for( var i = scene.children.length - 1; i >= 0; i--) {
  console.log(scene)
  scene.remove(scene.children[2]);
 }
  window.stop();
  speed = 0.02;
  backwards = false;
  camera.position.z = 0;
  modern();
};



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
      $('#popup-img').remove()
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
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 25);
}

function animate() {

	if (backwards === false && stop === false) {
		camera.position.z -= speed
	};

	if (backwards === true && stop === false) {
		camera.position.z += speed
	}

	if( camera.position.z > 10){
    backwards = false;
  }

	if (camera.position.z < lastImagePosition - 10){
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
