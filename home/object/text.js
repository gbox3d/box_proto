
function ObjText(_) {

  this.fontSize = _.size;
  this.fontColor = _.color;
  this.fontName = _.fontName;
  this.pos = _.pos;
  this.text = _.text;

  this.local = {
    pos : new THREE.Vector2(_.lpos.x,_.lpos.y),
    scale : new THREE.Vector2(_.scale.x,_.scale.y),
    rot : _.rot
  }

  this.rgn = new THREE.Box2();

}

ObjText.prototype.getRgn = function()
{
  //return new THREE.Box2(new THREE.Vector2(this.pos.x,this.pos.y),new THREE.Vector2(this.pos.x + this.mertrice.width,this.pos.y+this.fontSize));
  return this.rgn;
}


ObjText.prototype.checkRgn = function(point)
{
  let _rgn = this.getRgn()

  return _rgn.containsPoint(point);

}


ObjText.prototype.draw = function (_) {

  let context = _.context;
  let rootTransform = _.rootTransform

  context.save();

  let t1 = gbox3d.matics.helper.makeMat2dFromRotation({degree: this.local.rot})
  let t2 = gbox3d.matics.helper.makeMat2dFromScale(this.local.scale);
  let t3 = gbox3d.matics.helper.makeMat2dFromTranslation({x:this.local.pos.x,y:this.local.pos.y+this.fontSize});
  let t4 = gbox3d.matics.helper.makeMat2dFromTranslation(this.pos);
  let _tr = mat2d.create();

  mat2d.multiply(_tr,t2,t1); //_tr = t1* t2
  mat2d.multiply(_tr,_tr,t3); //_tr = t3 * ( t1* t2)
  mat2d.multiply(_tr,t4,_tr); //  _tr * t4

  mat2d.multiply(_tr,rootTransform,_tr); //root 변환 . _tr * _transform

  gbox3d.matics.helper.mat2dToCCTX({
    context:context,
    transform : _tr
  })

  //context.font = '68px KulminoituvaRegular'
  context.font = this.fontSize + 'pt ' + ' ' + this.fontName;
  //console.log(context.font)
  context.fillStyle = this.fontColor;//'#000000';
  context.fillText(this.text, 0,0);
  this.mertrice = context.measureText(this.text);


  //충돌처리용으로 사용할 실제 구역 재계산
  {
    let _tr = mat2d.create();
    let t3 = gbox3d.matics.helper.makeMat2dFromTranslation({x:this.local.pos.x,y:this.local.pos.y});

    mat2d.multiply(_tr,t2,t1);
    mat2d.multiply(_tr,_tr,t3);
    mat2d.multiply(_tr,t4,_tr); //  _tr =  (t3 * ( t1* t2)) * t4

    let _min = new THREE.Vector2(0,0);
    let _max = new THREE.Vector2(this.mertrice.width,this.fontSize);


    _min = gbox3d.matics.helper.applyMat2d({
      v:_min,
      m:_tr
    })

    _max = gbox3d.matics.helper.applyMat2d({
      v:_max,
      m:_tr
    })

    this.rgn.min = _min;
    this.rgn.max = _max;
  }

  //중심점 재계산
  {
    this.local.pos.x = this.mertrice.width/2
    this.local.pos.y = this.fontSize/2
  }



  context.restore();
}