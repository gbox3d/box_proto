
function lm_test_ui_hander() {

 
  console.log('test ui load');
  let ui_root = document.querySelector("#test-ui");

  console.log(ui_root)

  ui_root.querySelector("button.add-text").addEventListener('click',function () {
    theApp.ObjectMgr.addText("hello",0,0,'nanumfontpen','#000000',60);
  })

  ui_root.querySelector("button.add-rect").addEventListener('click',function () {

  })

  ui_root.querySelector("button.add-img").addEventListener('click',function () {
    theApp.ObjectMgr.addImage({
      url : "../res/gun1.jpg",
      scale : new THREE.Vector2(0.5,0.5),
      lpos : new THREE.Vector2(0,0),
      rot : 0
    })
  })

  ui_root.querySelector("button.add-expld").addEventListener('click',function () {
    theApp.ObjectMgr.addImage('../res/box1_expld.png',-256,-256,512,512)
  })

  ui_root.querySelector("button.update").addEventListener('click',function () {
    theApp.sceneMgr.work_texture.needsUpdate = true;
  })


}