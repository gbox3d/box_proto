
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



  function _mouseDown(evt) {

    let rect = canvas.getBoundingClientRect()

    _prevX = evt.screenX
    _prevY = evt.screenY

    let x = evt.clientX - rect.left;
    let y = evt.clientY - rect.top;


    x -= canvas.width / 2;
    y -= canvas.height / 2;

    /*
    let _rgn = new THREE.Box2(new THREE.Vector2(_this.pos.x,_this.pos.y),
      new THREE.Vector2(_this.pos.x + _this.size.width,_this.pos.y + _this.size.height)
      )

    if(_rgn.containsPoint(x,y)) {
      OnMouseMove = _mouseDrag;
    }
    */

    for(var i=_Objlist.length-1; i >= 0 ;i--) {

      let _obj = _Objlist[i];

      console.log(_obj)

      if(_obj.checkRgn(new THREE.Vector2(x,y)) ) {
        _this.bActive = true;
        _this.pos = _obj.pos.clone();
        _this.size = _obj.getRgn().max.sub(_obj.getRgn().min).clone();
        _this.local.pos = _obj.local.pos.clone();
        _this.local.scale = _obj.local.scale.clone();
        _this.local.rot = _obj.local.rot;

        this.selectObj = _obj;
        OnMouseMove = _mouseDrag;
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

    this.selectObj.pos = _this.pos.clone();

    //console.log(movementX + "," + _prevX);

    //editorObj.selectObj.x += movementX
    //editorObj.selectObj.y += movementY

  }
  function _mouseMove(evt) {

    //console.log(evt.movementX);

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

    let t1 = gbox3d.matics.helper.makeMat2dFromRotation({degree: this.local.rot})
    let t2 = gbox3d.matics.helper.makeMat2dFromScale(this.local.scale);
    let t3 = gbox3d.matics.helper.makeMat2dFromTranslation({x:this.local.pos.x,y:this.local.pos.y});
    let _tr = mat2d.create();

    mat2d.multiply(_tr,t2,t1); //_tr = t1* t2
    mat2d.multiply(_tr,_tr,t3); //_tr = t3 * ( t1* t2)

    let t4 = gbox3d.matics.helper.makeMat2dFromTranslation(this.pos);
    mat2d.multiply(_tr,t4,_tr); //  _tr * t4

    mat2d.multiply(_tr,_rootTransform,_tr); //root 변환 . _tr * _transform

    gbox3d.matics.helper.mat2dToCCTX({
      context:context,
      transform : _tr
    })

    context.beginPath();
    context.strokeStyle = '#000000';
    context.linewidth = 1;
    context.rect(0,0,this.size.x,this.size.y);
    context.closePath()
    context.stroke();


    context.restore();

  }


}