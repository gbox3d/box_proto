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
    }
}

