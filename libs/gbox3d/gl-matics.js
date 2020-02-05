try {
  if(gbox3d == null) {
    gbox3d={}
  }
}
catch (e) {
  console.log(e);
  gbox3d={}
}
gbox3d.matics = {}
gbox3d.matics.helper = {

  mat2dToCCTX : function (_) {
      let _transform = _.transform
      _.context.setTransform(_transform[0],_transform[1],_transform[2],_transform[3],_transform[4],_transform[5],_transform[6]);
    },
  makeVec2d : function (_) {
    return vec2.set(vec2.create(), _.x,_.y);
  },
  makeMat2dFromTranslation : function(_) {
    return mat2d.fromTranslation(mat2d.create(),this.makeVec2d(_));
  },
  makeMat2dFromRotation : function(_) {
    return mat2d.fromRotation(mat2d.create(), THREE.Math.degToRad( _.degree) );
  },
  makeMat2dFromScale : function(_) {
    return mat2d.fromScaling(mat2d.create(),this.makeVec2d(_));
  },
  applyMat2d : function(_) {
    let _out = vec2.create()
    vec2.transformMat2d(_out,gbox3d.matics.helper.makeVec2d(_.v),_.m)
    //_vec.x = _out[0]
    //_vec.y = _out[1]
    return new THREE.Vector2(_out[0],_out[1]);
  }
}

gbox3d.matics.canvasDrawer = {
  resetTransform : function(ctx) {
    ctx.setTransform(1,0,0,1,0,0);
  },
  setTransForm : function(_) {
    _.ctx.setTransform(_.tr[0],_.tr[1],_.tr[2],_.tr[3],_.tr[4],_.tr[5],_.tr[6]);
  },
  Box2d : function(_) {
    let _size = new THREE.Vector2();
    _.box.getSize(_size);
    _.ctx.rect(_.box.min.x,_.box.min.y,_size.x,_size.y);
  }

}




