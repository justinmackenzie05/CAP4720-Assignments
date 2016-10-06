(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var renderer;
var scene;
var camera;

keyboard = new THREEx.KeyboardState();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var scenewidth = 400, sceneheight = 400;

var isFire = false;

var score = 0;
var lives = 3;

var text2, text3;

var cena = false;

function createPortal()
{
    var texture = THREE.ImageUtils.loadTexture('images/Cena.jpg');
    var geo = new THREE.PlaneGeometry(200, 200, 200);
    var mat = new THREE.MeshBasicMaterial({map:texture});
    var msh = new THREE.Mesh(geo, mat);
    msh.rotation.x = Math.PI/2;
    msh.position.y = 2500;
    scene.add(msh);
}

function createSky()
{
    var tunnel = new THREE.Mesh(
        new THREE.CylinderGeometry(100, 100, 5000, 24, 24, true),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/space.jpg'),
            side: THREE.BackSide
        })
    )
    //tunnel.rotation.x = -Math.PI/2
    scene.fog = new THREE.FogExp2(0x0000022, 0.00125);
    scene.add(tunnel);
}
var player,red,green,yellow;
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
function createSpaceShip()
{
    var geo = new THREE.SphereGeometry(1, 30, 30);
    var mat = new THREE.MeshPhongMaterial({color:'red'});
    red = new THREE.Mesh(geo, mat);
    red.position.set(0, -2575, 0);
    //player = red;
    //scene.add(player);
    //var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    //directionalLight.position.set( 0, -1, 0 );
    //scene.add( directionalLight );

    geo = new THREE.SphereGeometry(1, 30, 30);
    mat = new THREE.MeshPhongMaterial({color:'yellow'});
    yellow = new THREE.Mesh(geo, mat);
    yellow.position.set(0, -2575, 0);
    //player = yellow;
    //scene.add(player);
    //directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    //directionalLight.position.set( 0, -1, 0 );
    //scene.add( directionalLight );

    geo = new THREE.SphereGeometry(1, 30, 30);
    mat = new THREE.MeshPhongMaterial({color:'green'});
    green = new THREE.Mesh(geo, mat);
    green.position.set(0, -2575, 0);
    player = green;
    scene.add(player);
    directionalLight.position.set( 0, -1, 0 );
    scene.add( directionalLight );

}

var asteroids = [];
function createAsteroids()
{
    var num = 20;
    asteroids = [];
    for(var i=0; i<20; i++)
    {
        num = num * -1;
        var geo = new THREE.SphereGeometry(3, 30, 30);
        var mat = new THREE.MeshPhongMaterial({color: 'brown'});
        var msh = new THREE.Mesh(geo, mat);
        msh.position.set(Math.random() * num, -2300 + 400 * i, 0);
        scene.add(msh);
        asteroids.push(msh);
    }
}

function removeAsteroids()
{
    for(var i=0; i<20; i++)
    {
        asteroids[i].position.x = -1000;
        scene.remove(asteroids[i]);
    }
}

var explode, one, two, three, four, five, six, backgroundMusic, pewpew, damage, explosionShip;
function loadSounds()
{
    explode = new Audio("sounds/Explosion.mp3");
    one = new Audio("sounds/1.mp3");
    two = new Audio("sounds/2.mp3");
    three = new Audio("sounds/3.mp3");
    four = new Audio("sounds/4.mp3");
    five = new Audio("sounds/5.mp3");
    six = new Audio("sounds/6.mp3");
    pewpew = new Audio("sounds/pew.wav");
    damage = new Audio("sounds/damage.wav");
    explosionShip = new Audio("sounds/explosionShip.wav");
    backgroundMusic = new Audio("sounds/backgroundMusic.mp3");
}

function init()
{

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 3000 );
    camera.position.x = 0;
    camera.position.y = -2600;
    camera.position.z = 10;
    camera.rotation.x = 0;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    var pos = new THREE.Vector3( 0, 200, 0 );
    camera.lookAt( pos );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000000, 0 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMapEnabled = true;

    // add spotlight for the shadows
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 10, 20, 20 );
    spotLight.shadowCameraNear = 20;
    spotLight.shadowCameraFar = 50;
    spotLight.castShadow = true;
    scene.add(spotLight);

    renderer.autoClear = false;

    var container = document.getElementById("mainview");
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    createPortal();
    createSky();
    createSpaceShip();
    createAsteroids();
    loadSounds();

    text2 = document.createElement('div');
    text2.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text2.style.width = 200;
    text2.style.height = 200;
    //text2.style.backgroundColor = "black";
    text2.innerHTML = "Score: " + score;
    text2.style.bottom = 75 + 'px';
    text2.style.left = 75 + 'px';
    text2.style.color = 'white';
    document.body.appendChild(text2);

    text3 = document.createElement('div');
    text3.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text3.style.width = 200;
    text3.style.height = 200;
    //text2.style.backgroundColor = "black";
    text3.innerHTML = "Lives: " + lives;
    text3.style.bottom = 60 + 'px';
    text3.style.left = 75 + 'px';
    text3.style.color = 'white';
    document.body.appendChild(text3);

    render();
}

var pew;
var counter = 0;
var isFireCounter = 0;
var hitCounter = 0;
function render()
{
    counter++;

    backgroundMusic.play();
    backgroundMusic.loop = true;

    if(lives == 0)
    {
        var answer = window.confirm("Game Over, try again?");
        if(answer)
        {
            lives = 3;
            text3.innerHTML = ("Lives: " + lives);
            score = 0;
            text2.innerHTML = "Score: " + score;
        }
        else
        {
            window.close();
        }
    }

    //Travelling through SPACE.....
    if(cena)
    {
        camera.position.y += 20;
        player.position.y += 20;
        if(counter % 20 == 0)
            score --;
        text2.innerHTML = "Score: " + score;
    }
    else
    {
        camera.position.y += 5;
        player.position.y += 5;
    }

    if(keyboard.pressed("cena"))
    {
        cena = true;
        backgroundMusic.pause();
        six.load();
        six.play();
    }

    if(score == 0)
    {
        cena = false;
        six.pause();
        backgroundMusic.play();
    }

    //Ship vs Asteroid Collision Detection
    for(var i=0; i<20; i++)
    {
        if (Math.abs(player.position.y - asteroids[i].position.y) < 1.5)
        {
            if(Math.abs(player.position.x - asteroids[i].position.x) < 1.5)
            {
                console.log("collision");
                if(hitCounter == 0)
                {
                    yellow.position.y = player.position.y;
                    scene.remove(player);
                    player = yellow;
                    scene.add(player);
                    hitCounter++;
                    explosionShip.load();
                    damage.play();
                }

                else if(hitCounter == 1)
                {
                    red.position.y = player.position.y;
                    scene.remove(player);
                    player = red;
                    scene.add(player);
                    hitCounter++;
                    damage.load();
                    damage.play();
                }

                else if(hitCounter == 2)
                {
                    var temp;
                    temp = player;
                    createSpaceShip();
                    player.position.y = temp.position.y;
                    scene.remove(temp);
                    hitCounter = 0;
                    lives--;
                    text3.innerHTML = "Lives: " + lives;
                    damage.load();
                    explosionShip.play();
                }

            }
        }
    }

    //Laser vs Asteroid Collision Detection
    if(isFire)
        for(var i=0; i<20; i++)
        {
            if (Math.abs(pew.position.y - asteroids[i].position.y) < 1.5)
            {
                if(Math.abs(pew.position.x - asteroids[i].position.x) < 1.5)
                {
                    console.log("collision");
                    asteroids[i].position.x = -1000;
                    scene.remove(asteroids[i]);
                    score += 5;
                    text2.innerHTML = "Score: " + score;
                    explode.load();
                    explode.play();
                }
            }
        }

    //Logic to distance laser from ship
    if(isFire)
    {
        pew.position.y += 10;
        isFireCounter++;
    }

    //Logic to remove laser from the scene after 2s
    if(isFireCounter == 120 && isFire)
    {
        isFireCounter = 0;
        scene.remove(pew);
    }

    //Wormhole logic
    if(camera.position.y >= 2500)
    {

        camera.position.y = -2600;
        player.position.y = -2575;

        var num = 10;
        removeAsteroids();
        createAsteroids();
        for(var j=0; i<20; i++)
        {
            num *= -1;
            asteroids[j].position.set(num, -2300 + 200 * j, 0);
        }
    }

    //Asteroid movement
    for(var k=0; i<30; i++)
    {
        asteroids[k].position.y += 3;
    }

    //Ship Movement
    if( keyboard.pressed("left"))
    {
        player.position.x -= .5;
    }

    else if( keyboard.pressed("right"))
    {
        player.position.x += .5;
    }

    //Fire Control
    else if( keyboard.pressed("space") && counter%10==0)
    {
        if(isFire)
        {
            scene.remove(pew);
        }

        isFire = true;
        var geo = new THREE.SphereGeometry(.5, 30, 30);
        var mat = new THREE.MeshPhongMaterial({color: 'red'});
        pew = new THREE.Mesh(geo, mat);
        pew.position.set(player.position.x, player.position.y + 5, 0);
        scene.add(pew);
        pewpew.play();

    }

    //Animation Frame
    requestAnimationFrame( render );

    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}

window.onload = init;
},{}]},{},[1]);
