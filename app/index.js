function appMain() {

  let canvas = document.getElementById('canvas_box_texture');
  let context = canvas.getContext('2d');


  //--------------------------

  var Smgr = new  esparty.elvis3d.scene.SceneManager({
    camera : {
      fov : 45,
      far : 2000,
      near : 1,
      position : new THREE.Vector3(100, 200, 300),
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

      // 반구조명 추가
      light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
      light.position.set( 0, 200, 0 );
      this.scene.add( light );

      //방향광 추가
      light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 0, 200, 100 );
      light.castShadow = true;
      light.shadow.camera.top = 180;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.left = -120;
      light.shadow.camera.right = 120;
      this.scene.add( light );

      //그리드헬퍼
      var helper =  new THREE.GridHelper( 2000,20 ,0x00ff00,0xff0000);
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
      var node = new THREE.Mesh(geometry, material);
      // node.name = 'wire_cube';

      var loader = new THREE.FBXLoader();
      loader.load( '../res/box1.fbx', function ( object ) {
        console.log(object);
        //object.children
        object.children[0].material.map = texture;
        self.scene.add( object );
      } );



      //this.scene.add(node);
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

        context.fillStyle = 'yellow';
        context.fillRect(100,-100,50,50);

        //console.log(event);
        this.updateAll();

      }
    }
  });

}

appMain();


