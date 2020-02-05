
function widget_transform(_) {

  let _Objlist =  _.Objlist;
  let canvas = _.canvas;

  let _prevX=0;
  let _prevY=0;
  let _this = this;

  this.bActive = false;
  this.local = {
    pos : new THREE.Vector2(-32,-32),
    scale : new THREE.Vector2(1,1),
    rot : 0
  }
  this.size = new THREE.Vector2(64,64);
  this.pos = new THREE.Vector2(0,0);

  this.selectObj = null;

  this.worldTransform = mat2d.create();

  this.scale_spot = new THREE.Box2();



  function _mouseDown(evt) {

    let rect = canvas.getBoundingClientRect()

    _prevX = evt.screenX
    _prevY = evt.screenY

    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;


    x -= canvas.width / 2;
    y -= canvas.height / 2;

    let mouse_pt = new THREE.Vector2(x,y)

    /*
    let _rgn = new THREE.Box2(new THREE.Vector2(_this.pos.x,_this.pos.y),
      new THREE.Vector2(_this.pos.x + _this.size.width,_this.pos.y + _this.size.height)
      )

    if(_rgn.containsPoint(x,y)) {
      OnMouseMove = _mouseDrag;
    }
    */


    if(_this.bActive) {

      let scale_spot =  _this.selectObj.getRgn().max.clone();
      let _scale_rgn = new THREE.Box2(new THREE.Vector2(scale_spot.x-16,scale_spot.y-16),new THREE.Vector2(scale_spot.x+16,scale_spot.y+16))

      if(_scale_rgn.containsPoint(mouse_pt)) {
        OnMouseMove = _mouseDrag_scale;
        return;
      }
    }


    for(var i=_Objlist.length-1; i >= 0 ;i--) {

      let _obj = _Objlist[i];

      console.log(_obj)

      if(_obj.checkRgn(mouse_pt) ) {
        _this.bActive = true;
        _this.pos = _obj.pos.clone();
        _this.size = _obj.getRgn().max.sub(_obj.getRgn().min).clone();
        _this.local.pos = _obj.local.pos.clone();
        _this.local.scale = _obj.local.scale.clone();
        _this.local.rot = _obj.local.rot;

        // _this.scale_spot.min.copy(_obj.getRgn().max)
        // _this.scale_spot.max.copy(_obj.getRgn().max)
        // _this.scale_spot.min.add(new THREE.Vector2(-16,-16))
        // _this.scale_spot.max.add(new THREE.Vector2(16,16))

        _this.selectObj = _obj;
        OnMouseMove = _mouseDrag;
        break;
      }

    }


  }


  function _mouseDrag(evt) {
    console.log( evt);
    var movementX = (_prevX ? evt.screenX - _prevX : 0)
    var movementY = (_prevY ? evt.screenY - _prevY : 0)
    _prevX = evt.screenX;
    _prevY = evt.screenY;

    _this.pos.x += movementX
    _this.pos.y += movementY

    _this.selectObj.pos = _this.pos.clone();
  }

  function _mouseDrag_scale(evt) {
    console.log( evt);
    var movementX = (_prevX ? evt.screenX - _prevX : 0)
    var movementY = (_prevY ? evt.screenY - _prevY : 0)
    _prevX = evt.screenX;
    _prevY = evt.screenY;

    //_this.size.x += movementX
    //_this.size.y += movementY

    //console.log(movementX);

    let _rgn =  _this.selectObj.getRgn().clone();

    _rgn.max.x += movementX;
    _rgn.max.y += movementY;

    _rgn.min.x -= movementX;
    _rgn.min.y -= movementY;

    let _size = new THREE.Vector2()
    let _size_ori = new THREE.Vector2()

    _this.selectObj.getRgn().getSize(_size_ori);
    _rgn.getSize(_size);

    console.log( _size.width/_size_ori.width );

    _this.selectObj.local.scale.x *= (_size.width/_size_ori.width);
    _this.selectObj.local.scale.y *= (_size.height/_size_ori.height);


    //_this.selectObj.pos = _this.pos.clone();
  }



  function _mouseMove(evt) {

  }

  function _mouseUp(evt) {

    OnMouseMove = _mouseMove

  }

  let OnMouseDown = _mouseDown
  canvas.addEventListener('mousedown',function (evt) {
    OnMouseDown(evt)

  } );

  let OnMouseMove = _mouseMove
  canvas.addEventListener('mousemove',function (evt) {

    OnMouseMove(evt);

  })

  let OnMouseUp = _mouseUp;
  canvas.addEventListener('mouseup',function(evt) {
    OnMouseUp(evt);
  });


}

widget_transform.prototype.draw = function (context,_rootTransform) {


  if(this.bActive) {
    context.save();

    /*
    let t1 = gbox3d.matics.helper.makeMat2dFromRotation({degree: this.local.rot})
    let t2 = gbox3d.matics.helper.makeMat2dFromScale(this.local.scale);
    let t3 = gbox3d.matics.helper.makeMat2dFromTranslation({x:this.local.pos.x,y:this.local.pos.y});
    let _tr = mat2d.create();

    mat2d.multiply(_tr,t2,t1); //_tr = t1* t2
    mat2d.multiply(_tr,_tr,t3); //_tr = t3 * ( t1* t2)

    let t4 = gbox3d.matics.helper.makeMat2dFromTranslation(this.pos);
    mat2d.multiply(_tr,t4,_tr); //  _tr * t4
    */

    // let _tr = mat2d.create();
    // let t4 = gbox3d.matics.helper.makeMat2dFromTranslation(this.pos);
    // mat2d.multiply(_tr,_rootTransform,t4);

    //mat2d.multiply(_tr,_rootTransform,_tr); //root 변환 . _tr * _transform

    gbox3d.matics.helper.mat2dToCCTX({
      context:context,
      transform : _rootTransform
    })

    //mat2d.copy(this.worldTransform ,_tr);

    context.beginPath();
    context.strokeStyle = '#000000';
    context.linewidth = 1;

    gbox3d.matics.canvasDrawer.Box2d({
      ctx : context,
      box : this.selectObj.getRgn()
    })

    //context.rect(0,0,this.size.x,this.size.y);

    context.closePath()
    context.stroke();


    //변환 초기화
    // gbox3d.matics.canvasDrawer.setTransForm({
    //   ctx : context,
    //   tr : _rootTransform
    // })

    context.beginPath();
    context.strokeStyle = '#000000';
    context.linewidth = 1;

    let scale_spot =  this.selectObj.getRgn().max.clone();

    //우하단 월드 좌표 얻기
    // let _scale_spot = gbox3d.matics.helper.applyMat2d({
    //   m: _tr,
    //   v: this.size
    // })
    //
    // this.scale_spot.min.copy(_scale_spot)
    // this.scale_spot.max.copy(_scale_spot)
    //
    // this.scale_spot.min.add(new THREE.Vector2(-16,-16))
    // this.scale_spot.max.add(new THREE.Vector2(16,16))

    gbox3d.matics.canvasDrawer.Box2d({
      ctx : context,
      box : new THREE.Box2(new THREE.Vector2(scale_spot.x-16,scale_spot.y-16),new THREE.Vector2(scale_spot.x+16,scale_spot.y+16))
    })
    context.closePath()
    context.stroke();


    context.restore();
  }


}