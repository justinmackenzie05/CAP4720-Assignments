var renderer;
var scene;
var camera;

keyboard = new THREEx.KeyboardState();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

var scenewidth = 400, sceneheight = 400;

var isFire = false;

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
var player;
function createSpaceShip()
{
    var geo = new THREE.SphereGeometry(1, 30, 30);
    var mat = new THREE.MeshPhongMaterial({color:'yellow'});
    var msh = new THREE.Mesh(geo, mat);
    msh.position.set(0, -2575, 0);
    player = msh;
    scene.add(player);
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0, -1, 0 );
    scene.add( directionalLight );

}

var asteroids = [];
function createAsteroids()
{
    var num = 20;
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

var explode, one, two, three, four, five, six, backgroundMusic;
function loadSounds()
{
    explode = new Audio("sounds/Explosion.mp3");
    one = new Audio("sounds/1.mp3");
    two = new Audio("sounds/2.mp3");
    three = new Audio("sounds/3.mp3");
    four = new Audio("sounds/4.mp3");
    five = new Audio("sounds/5.mp3");
    six = new Audio("sounds/6.mp3");
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
    render();
}

var pew;
var counter = 0;
var isFireCounter = 0;
function render()
{
    counter++;

    //Travelling through SPACE.....
    camera.position.y += 5;
    player.position.y += 5;

    //Ship vs Asteroid Collision Detection
    for(var i=0; i<20; i++)
    {
        if (Math.abs(player.position.y - asteroids[i].position.y) < 1.5)
        {
            if(Math.abs(player.position.x - asteroids[i].position.x) < 1.5)
            {
                console.log("collision");
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
    if(camera.position.y == 2500)
    {
        camera.position.y = -2600;
        player.position.y = -2575;

        var num = 10;
        for(var j=0; i<30; i++)
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
    }

    //Animation Frame
    requestAnimationFrame( render );

    renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
    renderer.render( scene, camera );
}

window.onload = init;