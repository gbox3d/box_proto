function lm_editor(_) {

  let editorObj = {
    selectObj : null
  }

  let canvas = _.canvas;

  function _mouseDown(__) {

    let rect = canvas.getBoundingClientRect()

    let x = __.evt.clientX - rect.left;
    let y = __.evt.clientY - rect.top;
    let _Objlist =  theApp.ObjectMgr.Objlist;

    x -= canvas.width / 2;
    y -= canvas.height / 2

    for(var i=0; i < _Objlist.length;i++) {

      let _obj = _Objlist[i];

      console.log(_obj)

      if( _obj.box_rgn.ptInBox(x,y) ) {
        console.log('hit')
      }

    }


  }

  function _mouseUp(__) {

  }

  canvas.addEventListener('mousedown',function(evt) {

    _mouseDown({
      canvas : _.canvas,
      evt : evt
    })



  });

  canvas.addEventListener('mouseup',function (evt) {

  });


  return editorObj;
}