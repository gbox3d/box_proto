
function ObjImage(_) {

  //url,x,y,w,h

  this.pos = new THREE.Vector2(_.x,_.y);
  this.url = _.url;

  this.local = {
    pos : _.lpos.clone(),
    scale : _.scale.clone(),
    rot : _.rot
  }

  this.bActive = false;

  let _loader = new THREE.ImageLoader();

  _loader.load(_.url,
    (function (image) {
      this.image = image;
      this.bActive = true;

      this.local.pos = new THREE.Vector2(0-image.width/2,0-image.height/2);

    }).bind(this),
    undefined,
    function () {
      console.log('img load failed')
    }
  );

  this.rgn = new THREE.Box2(new THREE.Vector2(0,0),new THREE.Vector2(0,0));

}


ObjImage.prototype.getRgn = function()
{
  let _rgn = new THREE.Box2(
    new THREE.Vector2(0-(this.image.width/2),0-(this.image.height/2)),
    new THREE.Vector2((this.image.width/2),(this.image.height/2)));

  return _rgn;
}


ObjImage.prototype.checkRgn = function(point)
{
  let _rgn = this.rgn

  return _rgn.containsPoint(point);

}


ObjImage.prototype.draw = function (_) {

  if(this.bActive) {
    let context = _.context;
    let rootTransform = _.rootTransform

    context.save();

    //{x:this.local.pos.x-(this.image.width/2),y:this.local.pos.y-(this.image.height/2)}
    let t1 = gbox3d.matics.helper.makeMat2dFromRotation({degree: this.local.rot})
    let t2 = gbox3d.matics.helper.makeMat2dFromScale(this.local.scale);
    let t3 = gbox3d.matics.helper.makeMat2dFromTranslation({x:this.local.pos.x,y:this.local.pos.y});
    let _tr = mat2d.create();

    mat2d.multiply(_tr,t2,t1); //_tr = t1* t2
    mat2d.multiply(_tr,_tr,t3); //_tr = t3 * ( t1* t2)

    let t4 = gbox3d.matics.helper.makeMat2dFromTranslation(this.pos);
    mat2d.multiply(_tr,t4,_tr); //  _tr * t4

    //충돌처리용으로 사용할 실제 구역 재계산
    {
      let _min = new THREE.Vector2(0,0);
      let _max = new THREE.Vector2(this.image.width,this.image.height);

      // let _out = vec2.create()
      // vec2.transformMat2d(_out,gbox3d.matics.helper.makeVec2d(_min),_tr)
      // _min.x = _out[0]
      // _min.y = _out[1]
      _min = gbox3d.matics.helper.applyMat2d({
        v:_min,
        m:_tr
      })

      // vec2.transformMat2d(_out,gbox3d.matics.helper.makeVec2d(_max),_tr)
      // _max.x = _out[0]
      // _max.y = _out[1]
      _max = gbox3d.matics.helper.applyMat2d({
        v:_max,
        m:_tr
      })

      this.rgn.min = _min;
      this.rgn.max = _max;
    }

    mat2d.multiply(_tr,rootTransform,_tr); //root 변환 . _tr * _transform

    gbox3d.matics.helper.mat2dToCCTX({
      context:context,
      transform : _tr
    })

    context.drawImage(this.image,0,0);

    context.restore();
  }
}