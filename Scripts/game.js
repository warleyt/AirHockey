// scene object variables
var renderer, scene, camera, cameraTop, pointLight, spotLight;

// mudanças camera
var camAtual,camAnt,cameraController, cima1=87,baix1=83,esq1=65,dir1=68,cima2=85,baix2=74,esq2=72,dir2=75,ganhadoratual=2;

// field variables
var field640 = 400, field360 = 200;

// paddle variables
var paddle640, paddle360, paddleDepth, paddleQuality, paddle1DirY = 0, paddle2DirY = 0,paddle1DirX = 0, paddle2DirX = 0, paddleSpeed = 0;

// ball variables
var ball, ball2,ball3,ball4, paddle1, paddle2, ballDirX = 1, ballDirY = 0, ball2DirX = 1, ball2DirY = 0,ball3DirX = -1, ball3DirY = 0,ball4DirX = -1, ball4DirY = 0, ballSpeed = 0;

// game-related variables
var score1 = 0, score2 = 0, maxScore = 7, paused=false,start=false,tempoEspera=200;
var antBallSpeed,antPaddleSpeed;
var mouse = { x: 0, y: 0 },LOOKSPEED = 0.075,controls,clock;

function setup()
{
	document.getElementById("winnerBoard").innerHTML = maxScore + " gols pra vitoria!";
	
	score1 = 0;
	score2 = 0;
	
	createScene();
	
	draw();
}

function createScene()
{
	clock = new THREE.Clock();
	
	var c = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;	

	camera = new THREE.PerspectiveCamera( 50, 640 / 360, 0.1, 10000);

	cameraTop = new THREE.PerspectiveCamera( 50, 640 / 360, 0.1, 10000); 
	scene = new THREE.Scene();
	scene.add(camera);
	scene.add(cameraTop);

	camera.position.z = 320;
	camAtual = camera;
	cameraTop.position.z = 320;
	cameraTop.position.y = 0;
	cameraTop.position.x = 0;
	
	// cameraController = new THREE.OrbitControls(camAtual,c);
	// cameraController.center = new THREE.Vector3(10 * 4, 0, 10 * 4);
	// cameraController.autoRotate=false;
	// cameraController.enableZoom=false;
	// cameraController.autoRotateSpeed=1;
	// cameraController.panSpeed=0.5; 
	// // cameraController.maxPolarAngle=0;
	// // cameraController.minPolarAngle=0;
	// cameraController.enableDamping=false;

	// cameraController.update();
	
	// Camera moves with mouse, flies around with WASD/arrow keys
	controls = new THREE.FirstPersonControls(cameraTop); // Handles camera control
	controls.enabled=false;
	controls.lookSpeed = 0.075; // How fast the player can look around with the mouse
	controls.lookVertical = true; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
	controls.noFly = true; // Don't allow hitting R or F to go up or down
	controls.lon = -30*3,14;
	
	renderer.setSize(640, 360);

	
	c.appendChild(renderer.domElement);

	// Track mouse position (set mouse.x and mouse.y to pointer coordinates) so we know where to shoot
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	
	var plane640 = field640,plane360 = field360, planeQuality = 10;
	
	var pillarMaterial = new THREE.MeshLambertMaterial( {   color: 0x535000 });	 
	var groundMaterial = new THREE.MeshLambertMaterial( {   map: THREE.ImageUtils.loadTexture("images/Dark_Wood_Floor.jpg") });
	
	var plane = new THREE.Mesh(new THREE.PlaneGeometry( plane640 * 0.95,	 plane360, planeQuality, planeQuality),
	  new THREE.MeshLambertMaterial( {   map: THREE.ImageUtils.loadTexture("images/surface.png") }));
	
	scene.add(plane);
	plane.receiveShadow = true;	
	
	var table = new THREE.Mesh(new THREE.CubeGeometry( plane640 * 1.05,	plane360 * 1.03, 100,planeQuality, planeQuality, 1),
	  new THREE.MeshLambertMaterial( {   color: 0x534d0d,   map: THREE.ImageUtils.loadTexture("images/s-l1600.jpg")    }));
	  
	table.position.z = -51;	
	scene.add(table);
	table.receiveShadow = true;	
	
	var radius =6, segments = 2.5, rings = 32;
	
	var ballMaterial = new THREE.MeshLambertMaterial( {   color: 0xFFA500 }); 
	
	ball = new THREE.Mesh(new THREE.CylinderGeometry( radius, radius, segments, rings),
	  ballMaterial );

	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 60;
	ball.position.z = radius;
	ball.rotation.x=190;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	
	ball2 = new THREE.Mesh(new THREE.CylinderGeometry( radius, radius, segments, rings),
	  ballMaterial );

	
	scene.add(ball2);
	
	ball2.position.x = 0;
	ball2.position.y = 30;
	ball2.position.z = radius;
	ball2.rotation.x=190;
	ball2.receiveShadow = true;
    ball2.castShadow = true;
	
	ball3 = new THREE.Mesh(new THREE.CylinderGeometry( radius, radius, segments, rings),
	  ballMaterial );

	scene.add(ball3);
	
	ball3.position.x = 0;
	ball3.position.y = -30;
	ball3.position.z = radius;
	ball3.rotation.x=190;
	ball3.receiveShadow = true;
    ball3.castShadow = true;
	
	ball4 = new THREE.Mesh(new THREE.CylinderGeometry( radius, radius, segments, rings),
	  ballMaterial );
	
	scene.add(ball4);
	
	ball4.position.x = 0;
	ball4.position.y = -60;
	ball4.position.z = radius;
	ball4.rotation.x=190;
	ball4.receiveShadow = true;
    ball4.castShadow = true;
	
	paddle640 = 15;
	paddle360 = 15;
	paddleDepth = 3.5;
	paddleQuality = 32;
		
	var loaderA = new THREE.STLLoader();
	loaderA.load('models/air_hockey_mallet.stl', function (geometryA) {

		var materialA = new THREE.MeshPhongMaterial( { color: 0x1B32C0 } );

		paddle1 = new THREE.Mesh( geometryA, materialA);
		console.log( paddle1);

		scene.add( paddle1 );
		paddle1.receiveShadow = true;
		paddle1.castShadow = true;
		paddle1.scale.set(0.3,0.3,0.3)
		paddle1.position.x = -field640/2 + paddle640;
		paddle1.position.z = paddleDepth;

	} );	
		
	loaderA.load('models/air_hockey_mallet.stl', function (geometryB) {

		var materialB = new THREE.MeshPhongMaterial( { color: 0x1B32C0 } );

		paddle2 = new THREE.Mesh( geometryB, materialB);
		console.log( paddle2);

		scene.add( paddle2 );		
		paddle2.receiveShadow = true;
		paddle2.castShadow = true;
		paddle2.scale.set(0.3,0.3,0.3)
		paddle2.position.x = field640/2 - paddle640;
		paddle2.position.z = paddleDepth;

	} );		
	

	var ground = new THREE.Mesh(new THREE.CubeGeometry(  1000,  1000,  3,  1,  1, 1 ),
	  groundMaterial);

	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);		
	
	var geometry = new THREE.SphereGeometry( 500, 7, 1,0,6.3,1,0.45 );
	var material = new THREE.MeshBasicMaterial( {map:THREE.ImageUtils.loadTexture("images/aud2.jpg")} );
	
	var sphere = new THREE.Mesh( geometry, material );
	sphere.material.side = THREE.DoubleSide;
	sphere.position.z=-190;
	sphere.rotation.x=190;
	scene.add( sphere );
		
	
	pointLight = new THREE.PointLight(0xFFFFE0);//0xF8D898);

	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 1.5;
	pointLight.distance = 10000;
	scene.add(pointLight);
	
    spotLight = new THREE.SpotLight(0xFFFFE0);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 0.3;
    spotLight.castShadow = true;
    scene.add(spotLight);
	
	renderer.shadowMap.enabled = true;		
}

function draw()
{	

	var delta = clock.getDelta();	
	controls.update(delta); // Move camera
		
	// draw THREE.JS scene
	renderer.render(scene, camAtual);
	// loop draw function call
	requestAnimationFrame(draw);
	// cameraController.update();
	ball2Physics();
	ball3Physics();
	ball4Physics();
	paddlePhysics();
	cameraPhysics();
	ballPhysics();
	playerPaddleMovementY();
	playerPaddleMovementX();
	opponentPaddleMovementY();
	opponentPaddleMovementX();
	
	if (Key.isDown(82)){
			if(start==false){
				setTimeout(function(){
				start=true;
				paddleSpeed = 5;
				ballSpeed=2;
				document.getElementById("scores").innerHTML = score1 + "-" + score2;
				}, tempoEspera/2);
			}else{
				setTimeout(function(){
				start = false;
				ball.position.x = 0;
				ball.position.y = 60;
				ballDirX=1;
				ball2.position.x = 0;
				ball2.position.y = 30;
				ball2DirX=1;
				ball3.position.x = 0;
				ball3.position.y = -30;
				ball3DirX=-1;
				ball4.position.x = 0;
				ball4.position.y = -60;
				ball4DirX=-1;
				paddleSpeed = 0;
				ballSpeed=0;
				paddle1.position.x = -field640/2 + paddle640;
				paddle2.position.x = field640/2 - paddle640;
				paddle1.position.y=0;
				paddle2.position.y=0;
				score1=0;
				score2=0;
				document.getElementById("scores").innerHTML = 'Pressione R para comecar!';
				}, tempoEspera/2);
			}
		
	}
	
	//light
	if (Key.isDown(76))
	{
		if(pointLight.intensity != 0.1){
			setTimeout(function(){
			pointLight.intensity = 0.1;
			}, tempoEspera);
		}else{
			setTimeout(function(){
			pointLight.intensity = 1.5;
		}, tempoEspera);		}
	}
	
	//pause
	if (Key.isDown(80)){
		if(ballSpeed!=0 &&paddleSpeed!=0 && paused==false){
			camAnt=camAtual;
			camAtual=cameraTop;
			controls.enabled=true;
			antBallSpeed =ballSpeed;
			antPaddleSpeed=paddleSpeed;
			ballSpeed=0;
			paddleSpeed=0;
			setTimeout(function(){paused=true;
			}, tempoEspera);	
			document.getElementById("scores").innerHTML = "Pausado!";
		}else if(paused==true){
			ballSpeed=antBallSpeed;	
			paddleSpeed=antPaddleSpeed;
			camAtual=camAnt;
			if(camAnt==cameraTop){
				setCamTop(ganhadoratual);
			}else{
				setCam(ganhadoratual);
			}
			controls.mouseX = 0;
			controls.mouseY = 0;
			controls.lat = 0;
			controls.lon = -30*3,14;
			controls.phi = 0;
			controls.theta = 0;
			controls.update(clock.getDelta());
	
			controls.enabled=false;
		
			setTimeout(function(){paused=false;
			}, tempoEspera)
			document.getElementById("scores").innerHTML = score1 + "-" + score2;
			
		}
	}
	
	//cameraSwitch
	if (Key.isDown(49))
	{
		camAtual=cameraTop;
		setCamTop(ganhadoratual);
	}
	if (Key.isDown(50)){
		camAtual=camera;
		setCam(ganhadoratual);
	}
}

function ballPhysics()
{
	if (ball.position.x <= -field640/2)
	{	
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall(2);
		matchScoreCheck();	
	}
	
	if (ball.position.x >= field640/2)
	{	
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall(1);
		matchScoreCheck();	
	}
	
	if (ball.position.y <= -field360/2)
	{
		ballDirY = -ballDirY;
	}	
	if (ball.position.y >= field360/2)
	{
		ballDirY = -ballDirY;
	}
	
	ball.position.x += ballDirX * 1.2*ballSpeed;
	ball.position.y += ballDirY * 1.2*ballSpeed;
	
	if (ballDirY > ballSpeed * 200)
	{
		ballDirY = ballSpeed * 200;
	}
	else if (ballDirY < -ballSpeed * 200)
	{
		ballDirY = -ballSpeed * 200;
	}
}

function ball2Physics()
{
	if (ball2.position.x <= -field640/2)
	{	
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall2(2);
		matchScoreCheck();	
	}
	
	if (ball2.position.x >= field640/2)
	{	
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall2(1);
		matchScoreCheck();	
	}
	
	if (ball2.position.y <= -field360/2)
	{
		ball2DirY = -ball2DirY;
	}	
	if (ball2.position.y >= field360/2)
	{
		ball2DirY = -ball2DirY;
	}
	
	ball2.position.x += ball2DirX * 1.2*ballSpeed;
	ball2.position.y += ball2DirY * 1.2*ballSpeed;
	
	if (ball2DirY > ballSpeed * 200)
	{
		ball2DirY = ballSpeed * 200;
	}
	else if (ball2DirY < -ballSpeed * 200)
	{
		ball2DirY = -ballSpeed * 200;
	}
}

function ball3Physics()
{
	if (ball3.position.x <= -field640/2)
	{	
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall3(2);
		matchScoreCheck();	
	}
	
	if (ball3.position.x >= field640/2)
	{	
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall3(1);
		matchScoreCheck();	
	}
	
	if (ball3.position.y <= -field360/2)
	{
		ball3DirY = -ball3DirY;
	}	
	if (ball3.position.y >= field360/2)
	{
		ball3DirY = -ball3DirY;
	}
	
	ball3.position.x += ball3DirX * 1.2*ballSpeed;
	ball3.position.y += ball3DirY * 1.2*ballSpeed;
	
	if (ball3DirY > ballSpeed * 200)
	{
		ball3DirY = ballSpeed * 200;
	}
	else if (ball3DirY < -ballSpeed * 200)
	{
		ball3DirY = -ballSpeed * 200;
	}
}

function ball4Physics()
{
	if (ball4.position.x <= -field640/2)
	{	
		score2++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall4(2);
		matchScoreCheck();	
	}
	
	if (ball4.position.x >= field640/2)
	{	
		score1++;
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		resetBall4(1);
		matchScoreCheck();	
	}
	
	if (ball4.position.y <= -field360/2)
	{
		ball4DirY = -ball4DirY;
	}	
	if (ball4.position.y >= field360/2)
	{
		ball4DirY = -ball4DirY;
	}
	
	ball4.position.x += ball4DirX * 1.2*ballSpeed;
	ball4.position.y += ball4DirY * 1.2*ballSpeed;
	
	if (ball4DirY > ballSpeed * 200)
	{
		ball4DirY = ballSpeed * 200;
	}
	else if (ball4DirY < -ballSpeed * 200)
	{
		ball4DirY = -ballSpeed * 200;
	}
}

// Handles CPU paddle 2 movement X
function opponentPaddleMovementX()
{
	if (Key.isDown(cima2))		
	{
		if (paddle2.position.x < field640/2 - paddle640)
		{
			paddle2DirX = paddleSpeed * 0.5;
		}
		else
		{
			paddle2DirX = 0;
		}
	}		
	else if (Key.isDown(baix2))		
	{
		if (paddle2.position.x > 15 )
		{
			paddle2DirX = -paddleSpeed * 0.5;
		}
		else
		{
			paddle2DirX = 0;
		}
	}else{
		paddle2DirX = 0;
	}
	
	paddle2.position.x += paddle2DirX;
}

// Handles CPU paddle movement and logic
function opponentPaddleMovementY()
{
	if (Key.isDown(esq2))		
	{
		if (paddle2.position.y < field360 * 0.45)
		{
			paddle2DirY = paddleSpeed * 0.5;
		}
		else
		{
			paddle2DirY = 0;
		}
	}	
	else if (Key.isDown(dir2))
	{
		if (paddle2.position.y > -field360 * 0.45)
		{
			paddle2DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle2DirY = 0;
		}
	}
	else
	{
		paddle2DirY = 0;
	}
	paddle2.position.y += paddle2DirY;
}

// Handles player's paddle movement X
function playerPaddleMovementX()
{
	if (Key.isDown(cima1))		
	{
		if (paddle1.position.x < -15)
		{
			paddle1DirX = paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirX = 0;
		}
	}		
	else if (Key.isDown(baix1))		
	{
		if (paddle1.position.x > -field640/2 + paddle640 )
		{
			paddle1DirX = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirX = 0;
		}
	}else
	{
		paddle1DirX = 0;
	}
	
	paddle1.position.x += paddle1DirX;
	
}

// Handles player's paddle movement Y
function playerPaddleMovementY()
{
	if (Key.isDown(esq1))		
	{
		if (paddle1.position.y < field360 * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
		}
	}	
	else if (Key.isDown(dir1))
	{
		if (paddle1.position.y > -field360 * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
		}
	}
	else
	{
		paddle1DirY = 0;		
	}
	
	paddle1.position.y += paddle1DirY;
	}
	
// Handles camera and lighting logic
function cameraPhysics()
{	
	camera.position.x = paddle1.position.x - 100;
	camera.position.y += (paddle1.position.y - camera.position.y) * 0.05;
	camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x);
	
	camera.rotation.x = -0.01 * (ball.position.y) * Math.PI/180;
	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Handles paddle collision logic
function paddlePhysics()
{
	
	if (ball.position.x <= paddle1.position.x + paddle640
	&&  ball.position.x >= paddle1.position.x)
	{
		if (ball.position.y <= paddle1.position.y + paddle360
		&&  ball.position.y >= paddle1.position.y - paddle360)
		{
			if (ballDirX < 0)
			{
				ballDirX = -ballDirX;
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	if (ball2.position.x <= paddle1.position.x + paddle640
	&&  ball2.position.x >= paddle1.position.x)
	{
		if (ball2.position.y <= paddle1.position.y + paddle360
		&&  ball2.position.y >= paddle1.position.y - paddle360)
		{
			if (ball2DirX < 0)
			{
				ball2DirX = -ball2DirX;
				ball2DirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	if (ball3.position.x <= paddle1.position.x + paddle640
	&&  ball3.position.x >= paddle1.position.x)
	{
		if (ball3.position.y <= paddle1.position.y + paddle360
		&&  ball3.position.y >= paddle1.position.y - paddle360)
		{
			if (ball3DirX < 0)
			{
				ball3DirX = -ball3DirX;
				ball3DirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	if (ball4.position.x <= paddle1.position.x + paddle640
	&&  ball4.position.x >= paddle1.position.x)
	{
		if (ball4.position.y <= paddle1.position.y + paddle360
		&&  ball4.position.y >= paddle1.position.y - paddle360)
		{
			if (ball4DirX < 0)
			{
				ball4DirX = -ball4DirX;
				ball4DirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	
	if (ball.position.x <= paddle2.position.x + paddle640
	&&  ball.position.x >= paddle2.position.x)
	{
		if (ball.position.y <= paddle2.position.y + paddle360
		&&  ball.position.y >= paddle2.position.y - paddle360)
		{
			if (ballDirX > 0)
			{
				ballDirX = -ballDirX;
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
	
	if (ball2.position.x <= paddle2.position.x + paddle640
	&&  ball2.position.x >= paddle2.position.x)
	{
		if (ball2.position.y <= paddle2.position.y + paddle360
		&&  ball2.position.y >= paddle2.position.y - paddle360)
		{
			if (ball2DirX > 0)
			{
				ball2DirX = -ball2DirX;
				ball2DirY -= paddle2DirY * 0.7;
			}
		}
	}
	
	if (ball3.position.x <= paddle2.position.x + paddle640
	&&  ball3.position.x >= paddle2.position.x)
	{
		if (ball3.position.y <= paddle2.position.y + paddle360
		&&  ball3.position.y >= paddle2.position.y - paddle360)
		{
			if (ball3DirX > 0)
			{
				ball3DirX = -ball3DirX;
				ball3DirY -= paddle2DirY * 0.7;
			}
		}
	}
	
	if (ball4.position.x <= paddle2.position.x + paddle640
	&&  ball4.position.x >= paddle2.position.x)
	{
		if (ball4.position.y <= paddle2.position.y + paddle360
		&&  ball4.position.y >= paddle2.position.y - paddle360)
		{
			if (ball4DirX > 0)
			{
				ball4DirX = -ball4DirX;
				ball4DirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{
	ball.position.x = 0;
	ball.position.y = 60;
	
	if (loser == 1)
	{
		ballDirX = -1;
	}
	else
	{
		ballDirX = 1;
	}
	
}

function resetBall2(loser)
{
	ball2.position.x = 0;
	ball2.position.y = 30;
	
	if (loser == 1)
	{
		ball2DirX = -1;
	}
	else
	{
		ball2DirX = 1;
	}
	
}

function resetBall3(loser)
{
	ball3.position.x = 0;
	ball3.position.y = -30;
	
	if (loser == 1)
	{
		ball3DirX = -1;
	}
	else
	{
		ball3DirX = 1;
	}
	
}

function resetBall4(loser)
{
	ball4.position.x = 0;
	ball4.position.y = -60;
	
	if (loser == 1)
	{
		ball4DirX = -1;
	}
	else
	{
		ball4DirX = 1;
	}
	
}

var bounceTime = 0;
// checks if either player or opponent has reached 7 points
function matchScoreCheck()
{
	if (score1 >= maxScore)
	{
		ballSpeed = 0;
		if(ganhadoratual==1){
			ganhadoratual=2;	
		}else{
			ganhadoratual=1;
		}	
		document.getElementById("scores").innerHTML = "Player "+ ganhadoratual +" ganhou!";		
		document.getElementById("winnerBoard").innerHTML = "Aperte R para jogar novamente";
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
		if(camAtual==camera){
		setCam(ganhadoratual);
		}else{
			setCamTop(ganhadoratual);
		}
	}
	else if (score2 >= maxScore)
	{
		ballSpeed = 0;
		winner=0;
		if(ganhadoratual==1){
			document.getElementById("scores").innerHTML = "Player 1 ganhou!";
		}else{
			document.getElementById("scores").innerHTML = "Player 2 ganhou!";
		}
		document.getElementById("winnerBoard").innerHTML = "Aperte R para jogar novamente";
		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
		if(camAtual==camera){
			setCam(ganhadoratual);
			}else{
				setCamTop(ganhadoratual);
			}
	}
}

function onDocumentMouseMove(e) {
	e.preventDefault();
	mouse.x = (e.clientX / 640) * 2 - 1;
	mouse.y = - (e.clientY / 360) * 2 + 1;
}

function setCamTop(ganha) {
	if(ganha==2){
		dir1=83;
		esq1=87;
		cima1=68;
		baix1=65;
		dir2=74;
		esq2=85;
		cima2=75;
		baix2=72;
	}else{
		dir1=74;
		esq1=85;
		cima1=75;
		baix1=72;
		dir2=83;
		esq2=87;
		cima2=68;
		baix2=65;
	}
}	

function setCam(ganha) {
	if(ganha==2){
		dir1=68;
		esq1=65;
		cima1=87;
		baix1=83;
		dir2=75;
		esq2=72;
		cima2=85;
		baix2=74;
	}else{
		dir1=75;
		esq1=72;
		cima1=85;
		baix1=74;
		dir2=68;
		esq2=65;
		cima2=87;
		baix2=83;
	}
}