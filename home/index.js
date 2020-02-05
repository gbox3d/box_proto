

function appMain() {

  var Image_loader = new THREE.ImageLoader();

  let canvas = document.getElementById('canvas_box_texture');
  let context = canvas.getContext('2d');

  let _rootTransform = gbox3d.matics.helper.makeMat2dFromTranslation({x:canvas.width/2,y:canvas.height/2});

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
    addImage : function (_) {

      let obj = new ObjImage(_);

      this.Objlist.push(obj);


    },
    addText : function (_text,_x,_y,_fontName,_color,_size) {

      let obj = new ObjText({
        size : _size,
        color : _color,
        fontName : _fontName,
        text : _text,
        lpos : new THREE.Vector2(0,0),
        scale : new THREE.Vector2(1,1),
        rot : 0,
        pos : new THREE.Vector2(_x,_y),
      })

      this.Objlist.push(obj);

    },
    clearObject : function() {
      // console.log(this)
      this.Objlist = [];
    }

  };

  let ObjLoader = {
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
            ObjectMgr.addRect(_item.x,_item.y,_item.w,_item.h,_item.color)
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

  let ObjTfmWidget = new widget_transform({
    canvas : canvas,
    Objlist : ObjectMgr.Objlist
  });


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


      //씬노드 추가
      

      var loader = new THREE.FBXLoader();
      loader.load( '../res/box1.FBX', function ( object ) {
        console.log(object);
        //object.children
        object.children[0].material.map = texture;
        object.children[0].material.color = {r:1,g:1,b:1}

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

        context.save();
        context.fillStyle = canvasBkg.fillColor;
        context.fillRect(0,0, canvas.width, canvas.height);
        //context.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2); //변환행렬 초기화


        gbox3d.matics.helper.mat2dToCCTX({
          context:context,
          transform : _rootTransform
        })

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

          ObjectMgr.Objlist[i].draw({
            context: context,
            rootTransform : _rootTransform
          });

        }

        ObjTfmWidget.draw(context,_rootTransform)

        context.restore();

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
    loader : ObjLoader,
    ObjTfmWidget : ObjTfmWidget,
    mainCanvas : canvas
  }

}

var theApp = appMain();


/*
theApp.editor = lm_editor({
  canvas : theApp.mainCanvas,
  Objlist : theApp.ObjectMgr.Objlist
});
*/

lm_test_ui_hander();


//theApp.ObjectMgr.addImage('../res/gun1.jpg',-100,-100,150,150)


