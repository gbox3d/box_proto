
/*
{"objlist":[{"type":"img","img":{},"x":-100,"y":-100,"w":150,"h":150},{"type":"text","text":"hello","x":0,"y":0,"fontName":"Calibri","size":60,"color":"#000000"},{"type":"rect","color":"#ff0000","x":0,"y":0,"w":64,"h":64}],"canvasBkg":{"fillColor":"#afab96","pattern":null}}
 */

var __testdata = "{\"objlist\":[{\"type\":\"img\",\"url\":\"../res/mina.jpg\",\"x\":-200,\"y\":-100,\"w\":110,\"h\":170},{\"type\":\"img\",\"url\":\"../res/gun1.jpg\",\"x\":0,\"y\":-100,\"w\":260,\"h\":173.5},{\"type\":\"text\",\"text\":\"hello\",\"x\":0,\"y\":0,\"fontName\":\"Calibri\",\"size\":60,\"color\":\"#000000\"}],\"canvasBkg\":{\"fillColor\":\"#afab96\",\"pattern\":null}}"

function appMain() {

  var Image_loader = new THREE.ImageLoader();

  let canvas = document.getElementById('canvas_box_texture');
  let context = canvas.getContext('2d');

  //let backgroundCanvasFillColor = '#afab96';
  let canvasBkg = {
    fillColor : '#afab96',
    pattern : null
  }

  let ObjectMgr = {
    Objlist : [],
    addRect : function (_x,_y,_w,_h,_color) {
      //console.log(this);
      this.Objlist.push({
        type : 'rect',
        color : _color,
        x: _x,
        y: _y,
        w: _w,
        h: _h,
        draw : function (context) {
          context.fillStyle = this.color;
          context.fillRect(this.x,this.y,this.w,this.h);

        }
      })
    },
    addImage : function (url,x,y,w,h) {

      let __obj = {
        type : 'img',
        //img : image,
        url : url,
        x : x,
        y : y,
        w : w,
        h : h,
        draw : function () {
          
        }
      }

      this.Objlist.push(__obj)

      Image_loader.load(url,
        (function (image) {

          __obj.draw = function (context) {
            context.drawImage( image, this.x, this.y,this.w,this.h);
          }

        }).bind(this),
        undefined,
        function () {
          console.log('img load failed')
        }
      );
    },
    addText : function (_text,_x,_y,_fontName,_color,_size) {

      //context.font = '20pt Calibri';
      //context.textAlign = 'center';

      this.Objlist.push({
        type : 'text',
        text : _text,
        x: _x,
        y: _y,
        fontName : _fontName,
        size : _size,
        color : _color,
        box_rgn : new gbox3d.core.Box2d({
          topleft : new gbox3d.core.Vect2d(0,0),
          bottomright : new gbox3d.core.Vect2d(0,0)
        }),
        draw: function (context) {

          context.font = this.size + 'pt ' + ' ' + this.fontName;
          context.fillStyle = this.color;//'#000000';
          context.fillText(this.text, this.x,this.y);

          let mertrice = context.measureText(this.text);
          //this.width = mertrice.width;
          //this.height = this.size;
          this.box_rgn.topLeft.X = this.x;
          this.box_rgn.topLeft.Y = this.y;

          this.box_rgn.bottomRight.X = this.x + mertrice.width;
          this.box_rgn.bottomRight.Y = this.y + this.size;
        }

      })

    },
    clearObject : function() {
      // console.log(this)
      this.Objlist = [];
    },
    loader : {
      'rect' : (function (obj) {

      }).bind()
    }

  };

  let _loader = {
    exportObjData : function () {

      _exportObj = {
        objlist : ObjectMgr.Objlist,
        canvasBkg : canvasBkg
      }

      return JSON.stringify(_exportObj);

    },
    importObjData : function (data) {
      let _obj = JSON.parse(data);
      let _objlist = _obj.objlist;

      for(var i=0;i<_objlist.length;i++) {

        let _item = _objlist[i]

        switch(_item.type) {
          case 'rect':
            ObjectMgr.addRect(_item.x_item.y,_item.w,_item.h,_item.color)
            break;
          case 'img':
            ObjectMgr.addImage(_item.url,_item.x,_item.y,_item.w,_item.h)

            break;
          case 'text':
            ObjectMgr.addText(_item.text,_item.x,_item.y,_item.fontName,_item.color,_item.size)

            break;
        }

      }

      console.log(_obj);
    }

  }



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
      light.position.set( -250, 200, -100 );
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
      self.work_texture = texture;

      /*
      texture.needsUpdate = true;
      var material = new THREE.MeshBasicMaterial({
        map : texture,
        //wireframe : true,
        transparent : true //투명 컬러값 적용시킴

      });
      */

      //씬노드 추가
      //var geometry = new THREE.CubeGeometry(1,1,1);
      //var node = new THREE.Mesh(geometry, material);
      // node.name = 'wire_cube';

      var loader = new THREE.FBXLoader();
      loader.load( '../res/test box.FBX', function ( object ) {
        console.log(object);
        //object.children
        object.children[0].material[0].map = texture;
        object.children[0].material[0].color = {r:1,g:1,b:1}

        //object.children[0].material[1].map = texture;
        self.scene.add( object );
        //self.mainObject = object;
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

        context.fillStyle = canvasBkg.fillColor;
        context.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

        /*

        //십자선
        context.beginPath();
        context.moveTo(-canvas.width / 2, 0);
        context.lineTo(canvas.width / 2, 0);
        context.stroke()


        context.beginPath();
        context.moveTo(0, -canvas.height / 2);
        context.lineTo(0, canvas.height / 2);
        context.stroke();
        */


        for(i=0;i<ObjectMgr.Objlist.length;i++) {

          
          ObjectMgr.Objlist[i].draw(context);

        }

        /*context.font = '40pt Calibri';
        context.fillStyle = 'blue';
        context.fillText('Hello World!', 0, 0);*/

        /*
        context.fillStyle = 'yellow';
        context.fillRect(0,0,50,50);

        context.fillStyle = 'yellow';
        context.fillRect(100,-100,50,50);
        */

        //console.log(event);
        //this.work_texture.needsUpdate = true;
        this.updateAll();

      }
    },
    updateTexture : function () {
      this.work_texture.needsUpdate = true;
    }
  });


  return {
    sceneMgr : Smgr,
    ObjectMgr : ObjectMgr,
    loader : _loader,
    mainCanvas : canvas
  }

}

var theApp = appMain();
theApp.editor = lm_editor({
  canvas : theApp.mainCanvas
});
lm_test_ui_hander();


//theApp.ObjectMgr.addImage('../res/gun1.jpg',-100,-100,150,150)


