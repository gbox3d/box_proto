
function ObjText(_) {

  // this.member = {
  //   type : 'text',
  //   text : _text,
  //   x: _x,
  //   y: _y,
  //   fontName : _fontName,
  //   size : _size,
  //   color : _color
  // }

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

}

ObjText.prototype.getRgn = function()
{
  return new THREE.Box2(new THREE.Vector2(this.pos.x,this.pos.y),new THREE.Vector2(this.pos.x + this.mertrice.width,this.pos.y+this.fontSize));
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
  let t3 = gbox3d.matics.helper.makeMat2dFromTranslation({x:this.local.pos.x,y:this.local.pos.y + this.fontSize});
  let _tr = mat2d.create();

  mat2d.multiply(_tr,t2,t1); //_tr = t1* t2
  mat2d.multiply(_tr,_tr,t3); //_tr = t3 * ( t1* t2)

  let t4 = gbox3d.matics.helper.makeMat2dFromTranslation(this.pos);
  mat2d.multiply(_tr,t4,_tr); //  _tr * t4

  mat2d.multiply(_tr,rootTransform,_tr); //root 변환 . _tr * _transform

  gbox3d.matics.helper.mat2dToCCTX({
    context:context,
    transform : _tr
  })

  context.font = this.fontSize + 'pt ' + ' ' + this.fontName;
  context.fillStyle = this.fontColor;//'#000000';
  context.fillText(this.text, 0,0);
  this.mertrice = context.measureText(this.text);

  //let mertrice = context.measureText(this.text);
  //this.width = mertrice.width;
  //this.height = this.size;
  // this.box_rgn.topLeft.X = this.x;
  // this.box_rgn.topLeft.Y = this.y - this.size;
  //
  // this.box_rgn.bottomRight.X = this.x + mertrice.width;
  // this.box_rgn.bottomRight.Y = this.y;

  context.restore();
}