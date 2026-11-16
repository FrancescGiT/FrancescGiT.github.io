// Three.js hero: procedural electronic circuit board. The HTML remains usable when WebGL is unavailable.
// Locked Three.js version: 0.170.0
const host = document.getElementById("hero3d");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
try {
  const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js");
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:"high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.35 : 1.8));
  renderer.setClearColor(0x080d12, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,0,19);
  const ambient = new THREE.AmbientLight(0x8cd6d9, 1.45); scene.add(ambient);
  const key = new THREE.DirectionalLight(0xe0fff2, 3); key.position.set(-3,7,10); scene.add(key);
  const rim = new THREE.PointLight(0x4bffe0, 55,22); rim.position.set(5,-1,5); scene.add(rim);
  const warm = new THREE.PointLight(0xf0ba89, 25,17); warm.position.set(-6,-3,4); scene.add(warm);
  const stage = new THREE.Group(); scene.add(stage);
  const pcb = new THREE.Group(); stage.add(pcb);
  const boardMaterial = new THREE.MeshPhysicalMaterial({color:0x0e4b48,metalness:.52,roughness:.3,clearcoat:.85,clearcoatRoughness:.18});
  const copper = new THREE.MeshStandardMaterial({color:0x7addbb,metalness:.86,roughness:.24});
  const copperDim = new THREE.MeshStandardMaterial({color:0x3c8275,metalness:.76,roughness:.3});
  const pad = new THREE.MeshStandardMaterial({color:0xb8d9bc,metalness:.86,roughness:.25});
  const dark = new THREE.MeshPhysicalMaterial({color:0x111923,metalness:.36,roughness:.4,clearcoat:.3});
  const darkEdge = new THREE.MeshStandardMaterial({color:0x35434b,metalness:.75,roughness:.35});
  const glowing = new THREE.MeshStandardMaterial({color:0x85ffee,emissive:0x3bf2bd,emissiveIntensity:2,metalness:.2});
  const boardShape = new THREE.Shape();
  const w=3.75,h=4.75,r=.25;
  boardShape.moveTo(-w+r,-h);
  boardShape.lineTo(w-r,-h);boardShape.quadraticCurveTo(w,-h,w,-h+r);
  boardShape.lineTo(w,h-r);boardShape.quadraticCurveTo(w,h,w-r,h);
  boardShape.lineTo(-w+r,h);boardShape.quadraticCurveTo(-w,h,-w,h-r);
  boardShape.lineTo(-w,-h+r);boardShape.quadraticCurveTo(-w,-h,-w+r,-h);
  const boardGeo=new THREE.ExtrudeGeometry(boardShape,{depth:.2,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.07,bevelThickness:.05,curveSegments:8});
  const board=new THREE.Mesh(boardGeo,boardMaterial);pcb.add(board);
  const holeMaterial=new THREE.MeshStandardMaterial({color:0x102124,metalness:.9,roughness:.2});
  for(const x of [-3.3,3.3])for(const y of [-4.3,4.3]){
    const metal=new THREE.Mesh(new THREE.TorusGeometry(.18,.064,10,28),pad);metal.position.set(x,y,.31);pcb.add(metal);
    const core=new THREE.Mesh(new THREE.CircleGeometry(.11,28),holeMaterial);core.position.set(x,y,.315);pcb.add(core);
  }
  function segment(x1,y1,x2,y2,material,thickness=.026,z=.315){
    const dx=x2-x1,dy=y2-y1,length=Math.hypot(dx,dy);
    if(length<.001)return;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(thickness,length,.018),material);
    mesh.position.set((x1+x2)/2,(y1+y2)/2,z);
    mesh.rotation.z=-Math.atan2(dx,dy);
    pcb.add(mesh);
  }
  function via(x,y,material=copper){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.055,.024,6,12),material);
    ring.position.set(x,y,.34);pcb.add(ring);
  }
  // Reproducible board routing. Each circuit is a contiguous set of geometric copper traces.
  for(let i=0;i<29;i++){
    const side=i%2?-1:1;
    const x=side*(1.2+(i%7)*.29);
    const y=-3.8+(i*1.71)%7.4;
    const kneeX=side*(2.0+(i%4)*.30);
    const kneeY=y+(i%3===0?.56:-.56);
    const endY=Math.max(-3.85,Math.min(3.85,kneeY+(i%2?.35:-.35)));
    segment(x,y,kneeX,y,i%4?copperDim:copper);segment(kneeX,y,kneeX,kneeY,i%4?copperDim:copper);
    segment(kneeX,kneeY,kneeX+side*.19,endY,copperDim);via(kneeX+side*.19,endY);
  }
  for(let i=0;i<14;i++){
    const y=-3.7+i*.56,x1=-2.85+(i%3)*.1,x2=-1.7-(i%4)*.12;
    segment(x1,y,x2,y,copperDim,.022);via(x1,y);
  }
  // Central microcontroller: package, bevel-like top, markings and 48 visible pins.
  const chipBase=new THREE.Mesh(new THREE.BoxGeometry(2.75,2.75,.31),darkEdge);chipBase.position.set(0,.3,.56);pcb.add(chipBase);
  const chip=new THREE.Mesh(new THREE.BoxGeometry(2.57,2.57,.39),dark);chip.position.set(0,.3,.79);pcb.add(chip);
  const top=new THREE.Mesh(new THREE.PlaneGeometry(2.32,2.32),new THREE.MeshStandardMaterial({color:0x1b2730,metalness:.28,roughness:.57}));top.position.set(0,.3,.99);pcb.add(top);
  const pinGeo = new THREE.BoxGeometry(.12,.28,.07);
  for(let i=0;i<12;i++)for(const dir of [-1,1]){
    const v=-1.16+i*.211;
    const a=new THREE.Mesh(pinGeo,pad);a.position.set(v,.3+dir*1.45,.54);pcb.add(a);
    const b=new THREE.Mesh(pinGeo,pad);b.position.set(dir*1.45,.3+v,.54);b.rotation.z=Math.PI/2;pcb.add(b);
  }
  function textTexture(lines, color="#a6d6cd"){
    const canvas=document.createElement("canvas");canvas.width=512;canvas.height=256;
    const ctx=canvas.getContext("2d");ctx.clearRect(0,0,512,256);
    ctx.textAlign="center";ctx.fillStyle=color;
    ctx.font="700 45px Arial";ctx.fillText(lines[0],256,100);
    ctx.font="22px monospace";ctx.fillStyle="#68948e";ctx.fillText(lines[1],256,155);
    ctx.strokeStyle="#426560";ctx.lineWidth=2;ctx.strokeRect(85,37,342,160);
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
  }
  const chipLogo=new THREE.Mesh(new THREE.PlaneGeometry(2.06,1.05),new THREE.MeshBasicMaterial({map:textTexture(["F / B","SYSTEMS ENGINEER"]),transparent:true}));
  chipLogo.position.set(0,.26,1.002);pcb.add(chipLogo);
  // Secondary packages, capacitors, quartz crystal and connectors.
  function component(x,y,sx,sy,height,material=dark){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,height),material);
    mesh.position.set(x,y,.3+height/2);pcb.add(mesh);return mesh;
  }
  component(-2.05,3.05,1.5,.8,.32);
  component(2.05,3.08,1.22,.65,.31);
  component(2.1,-2.75,1.45,.65,.34);
  component(-1.95,-2.65,1.25,.82,.34);
  component(0,-3.45,1.18,.52,.22,darkEdge);
  for(let i=0;i<6;i++)component(-2.85+i*.34,1.98,.19,.48,.19,darkEdge);
  for(let i=0;i<7;i++)component(-2.78+i*.38,-1.75,.18,.37,.13,i%2?pad:darkEdge);
  for(let i=0;i<6;i++)component(-.8+i*.33,3.75,.19,.48,.18,i%2?pad:darkEdge);
  for(let i=0;i<5;i++)component(-2.68+i*.38,-3.85,.13,.38,.17,darkEdge);
  for(let i=0;i<4;i++){
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.43,22),darkEdge);
    cap.rotation.x=Math.PI/2;cap.position.set(1.8+i*.34,1.97,.55);pcb.add(cap);
    const capTop=new THREE.Mesh(new THREE.CircleGeometry(.13,20),pad);
    capTop.position.set(1.8+i*.34,1.97,.78);pcb.add(capTop);
  }
  for(let i=0;i<5;i++){
    const led=new THREE.Mesh(new THREE.BoxGeometry(.18,.12,.09),glowing);
    led.position.set(-2.7+i*.42,-.95,.49);pcb.add(led);
  }
  // Header connector in genuine relief
  component(2.68,.02,.45,1.47,.37,darkEdge);
  for(let i=0;i<5;i++)component(2.68,-.53+i*.26,.12,.10,.45,pad);
  // Decorative object-space engineering grid, halo and orbital measurements
  const haloMat=new THREE.MeshBasicMaterial({color:0x1e7d72,transparent:true,opacity:.32});
  for(const radius of [5.45,6.25,7.18]){
    const orbit=new THREE.Mesh(new THREE.TorusGeometry(radius,.008,3,160),haloMat);
    orbit.rotation.x=.7;orbit.rotation.y=.25;stage.add(orbit);
  }
  const starPositions=[];for(let i=0;i<140;i++){
    const a=i*2.39996,rad=4+(i%37)/37*7;
    starPositions.push(Math.cos(a)*rad,Math.sin(a)*rad, -2-(i%5)*.9);
  }
  const pointsGeom=new THREE.BufferGeometry();pointsGeom.setAttribute("position",new THREE.Float32BufferAttribute(starPositions,3));
  const points=new THREE.Points(pointsGeom,new THREE.PointsMaterial({color:0x61d1be,size:.033,transparent:true,opacity:.42}));
  scene.add(points);
  let x=0,y=0,scroll=0,raf=0,last=0,active=true;
  const mobile=()=>window.innerWidth<720;
  function resize(){
    const width=host.clientWidth,height=host.clientHeight;
    if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    stage.position.set(mobile()?0:4.1,mobile()?2.1:.2,0);
    stage.scale.setScalar(mobile()?.60:Math.min(1.02,Math.max(.78,width/1550)));
    render();
  }
  function render(){
    pcb.rotation.set(-.18+(reduced?0:Math.sin(scroll*.003)*.04),-.12+y*.08, .20+x*.05);
    renderer.render(scene,camera);
  }
  function onPointer(e){if(reduced)return;x=(e.clientX/window.innerWidth-.5)*.9;y=(e.clientY/window.innerHeight-.5)*.8}
  function onScroll(){scroll=window.scrollY}
  function frame(now){
    if(!active)return;
    const dt=Math.min((now-last)/1000||0,.05);last=now;
    if(!reduced){pcb.rotation.y+=dt*.035;stage.rotation.z=Math.sin(now*.00012)*.02;render()}
    raf=requestAnimationFrame(frame);
  }
  const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting&&!document.hidden;if(active&&!reduced){last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}else cancelAnimationFrame(raf)},{threshold:0});
  observer.observe(host);
  const onVisibility=()=>{active=!document.hidden&&host.getBoundingClientRect().bottom>0;if(active&&!reduced){last=performance.now();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}else cancelAnimationFrame(raf)};
  window.addEventListener("resize",resize,{passive:true});
  window.addEventListener("pointermove",onPointer,{passive:true});
  window.addEventListener("scroll",onScroll,{passive:true});
  document.addEventListener("visibilitychange",onVisibility);
  resize();
  // An explicit cleanup path for SPA integration or hot replacement.
  window.disposePortfolio3D=()=>{
    cancelAnimationFrame(raf);observer.disconnect();
    window.removeEventListener("resize",resize);window.removeEventListener("pointermove",onPointer);
    window.removeEventListener("scroll",onScroll);document.removeEventListener("visibilitychange",onVisibility);
    scene.traverse(obj=>{if(obj.geometry)obj.geometry.dispose();const materials=Array.isArray(obj.material)?obj.material:[obj.material];materials.forEach(m=>{if(m){if(m.map)m.map.dispose();m.dispose()}})});
    renderer.dispose();renderer.domElement.remove();
  };
} catch(error) {
  console.warn("Vista 3D no disponible; el portfolio sigue operativo.", error);
  host.classList.add("no-webgl");
}
