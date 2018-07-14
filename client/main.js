import {RectShapObj} from  './shapes/rect'
import THREE from './lib/threejs/three'

//var MouseXPos = new ReactiveVar(0);
var Texure_Context;
var Texure_Canvas;

var test_obj = new RectShapObj(0,0,20,30,'white');

function loop_main() {

  let context = Texure_Context;
  let canvas = Texure_Canvas;

  context.setTransform(1,0,0,1,canvas.width/2, canvas.height/2); //변환행렬 초기화

  context.fillStyle = 'blue';
  context.fillRect(-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);

  context.beginPath();
  context.moveTo(-canvas.width/2,0);
  context.lineTo(canvas.width/2,0);
  context.stroke()
  context.beginPath();
  context.moveTo(0,-canvas.height/2);
  context.lineTo(0,canvas.height/2);
  context.stroke();

  test_obj.draw(context);



  requestAnimationFrame(loop_main);

}



document.addEventListener('mousedown',function (evt) {
  console.log(evt);
  //console.log(MouseXPos)
  //MouseXPos.set(evt.clientX);
});

document.addEventListener('mouseup',function (evt) {
  console.log(evt);
  //console.log(MouseXPos)
  //MouseXPos.set(evt.clientX);
});



window.onload = ()=> {
  console.log('on load page');
  //document.querySelector('#hello').innerText = "hi meteor au there?";

  let canvas = document.getElementById('canvas_box_texture');
  let context = canvas.getContext('2d');


  //context.fillText("x pos is " + Math.round(3.14), 0, 0);

  /*
  Tracker.autorun(()=> {
    console.log("tracker--------- invalid screen");


  });

  Tracker.autorun(() => {
    console.log("tracker---------");
    console.log(MouseXPos.get())

    //Texure_Context.font = '18pt Calibri';
    //Texure_Context.fillStyle = 'white';
    context.font = '18pt Calibri';
    context.fillStyle = 'white';
    context.fillText("hello" + MouseXPos.get(),0,0);


  });
  */

  Texure_Canvas = canvas;
  Texure_Context = context;


  var camera = new THREE.PerspectiveCamera( 70, 320/240, 1, 1000 );
  camera.position.z = 40;
  camera.position.x = 0;
  camera.position.y = 10;

  camera.lookAt( new THREE.Vector3(0,0,0) );
  var scene = new THREE.Scene();

  scene.add(camera)

  //console.log(this.view)
  //console.log(document.getElementById((''))

  var glrenderer = new THREE.WebGLRenderer();

  glrenderer.setClearColor(0x000088);
  glrenderer.autoClear = true;

  //console.log(glrenderer.domElement)

  document.getElementById('canvas_prevw').appendChild(glrenderer.domElement)
  glrenderer.setSize(320,240)

  //그리드헬퍼
  var helper =  new THREE.GridHelper( 50, 8 ,0x00ff00,0xff0000);
  //helper.setColors(0x00ff00,0xff0000);
  scene.add(helper);

  //씬노드 추가
  var geometry = new THREE.CubeGeometry(5,5,5);
  var material = new THREE.MeshBasicMaterial(
    {
      color: 0x00ff00,
      wireframe : true
    }
  );
  var node = new THREE.Mesh(geometry, material);
  node.name = 'wire_cube';
  scene.add(node);

  var clock = new THREE.Clock();

  glrenderer.render(scene,camera)

  loop_main();

}


console.log('main.js loaded');


