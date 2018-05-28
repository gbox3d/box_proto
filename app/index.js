function appMain() {

  let canvas = document.getElementById('canvas_box_texture');
  let context = canvas.getContext('2d');



  function loop_main() {

    context.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2); //변환행렬 초기화

    context.fillStyle = 'blue';
    context.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    context.beginPath();
    context.moveTo(-canvas.width / 2, 0);
    context.lineTo(canvas.width / 2, 0);
    context.stroke()
    context.beginPath();
    context.moveTo(0, -canvas.height / 2);
    context.lineTo(0, canvas.height / 2);
    context.stroke();

    context.fillStyle = 'yellow';
    context.fillRect(0,0,50,50);

    //test_obj.draw(context);

    requestAnimationFrame(loop_main);

  }

  loop_main();

  //--------------------------

  var Smgr = new  esparty.elvis3d.scene.SceneManager({
    camera : {
      fov : 45,
      far : 5000,
      near : 1,
      position : new THREE.Vector3(5, 10, 10),
      lookat : new THREE.Vector3()

    },
    renderer : {
      type : 'webgl',
      container : document.querySelector('#canvas_3d'),
      clear : {
        color : 0x000000
      }

    },
    setup : function() {

      var self = this;

      //그리드헬퍼
      var helper =  new THREE.GridHelper( 8,16 ,0x00ff00,0xff0000);
      //var helper =  new THREE.GridHelper( 50, 1 );
      //helper.setColors(0x00ff00,0xff0000);
      this.scene.add(helper);

      //오빗컨트롤
      //카메라의 현재 위치 기준으로 시작한다.
      var controls = new THREE.OrbitControls( this.camera , this.renderer.domElement);
      controls.target.set( 0, 0, 0 ); //바라보는 위치
      controls.update();

      var texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      var material = new THREE.MeshBasicMaterial({
        map : texture,
        //wireframe : true,
        transparent : true //투명 컬러값 적용시킴

      });

      //씬노드 추가
      var geometry = new THREE.CubeGeometry(1,1,1);
      /*
      var material = new THREE.MeshBasicMaterial(
        {
          color: 0x00ff00,
          wireframe : true

        }
      );
      */
      var node = new THREE.Mesh(geometry, material);

      node.name = 'wire_cube';

      this.scene.add(node);
    },
    event : {
      onWindowResize : function(evt) {


        if(this.window_size) { //창모드일경우

        }
        else { //전체 화면일경우
          this.updateAll({
            resize : {
              width :  window.innerWidth,
              height : window.innerHeight
            }
          });
        }
      },
      onMouseMove : function(event) {

        var mx = ( event.offsetX / this.window_size.width ) * 2 - 1;
        var my = - ( event.offsetY / this.window_size.height ) * 2 + 1;

        //document.querySelector('#text-log .mouse-pos').innerText = mx.toFixed(2) + ',' + my.toFixed(2);

      },
      onKeyDown : function(event) {

        console.log(event);

      },
      onMouseDown : function(event) {

      },
      onUpdate : function(event) {

        /*
         event 인자
         deltaTick : 루프지연시간 (ms)
         */

        //console.log(event);



        this.updateAll();


      }
    }
  });



}

appMain();


