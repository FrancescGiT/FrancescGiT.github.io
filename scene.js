// Sculpted modular control instrument. Every physical layer is independently modeled.
// This source module owns the 3D experience; interface content remains ordinary HTML.
const holder = document.getElementById('world');
const cinema = document.getElementById('cinema');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let disposed = false;

try {
  const THREE = await import('./vendor/three.module.js');
  if (disposed) throw new Error('Disposed before initialization');
  const renderer = new THREE.WebGLRenderer({antialias:window.innerWidth>800,alpha:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,window.innerWidth < 800?1.15:1.7));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.5;
  holder.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(33,1,.1,120);
  camera.position.set(0,0,17);
  const ambient=new THREE.HemisphereLight(0xffffff,0x456069,2.1);scene.add(ambient);
  const key=new THREE.DirectionalLight(0xffffff,5.1);key.position.set(-4,6,9);scene.add(key);
  const fill=new THREE.DirectionalLight(0xb8d8e4,3.2);fill.position.set(6,-1,7);scene.add(fill);
  const rim=new THREE.PointLight(0xff8153,130,24);rim.position.set(6,3,0);scene.add(rim);
  const lower=new THREE.PointLight(0x9ee4cf,75,19);lower.position.set(-2,-6,3);scene.add(lower);
  const root=new THREE.Group();scene.add(root);

  const mat={
    black:new THREE.MeshPhysicalMaterial({color:0x182126,metalness:.42,roughness:.26,clearcoat:.65,clearcoatRoughness:.25}),
    titanium:new THREE.MeshStandardMaterial({color:0x72797b,metalness:.88,roughness:.27}),
    titaniumDark:new THREE.MeshStandardMaterial({color:0x3d474c,metalness:.78,roughness:.32}),
    bronze:new THREE.MeshStandardMaterial({color:0xa27e57,metalness:.88,roughness:.24}),
    orange:new THREE.MeshPhysicalMaterial({color:0xfa6539,metalness:.46,roughness:.26,clearcoat:.72,clearcoatRoughness:.12}),
    orangeDark:new THREE.MeshStandardMaterial({color:0xb6432a,metalness:.59,roughness:.33}),
    pcb:new THREE.MeshPhysicalMaterial({color:0x1a5350,metalness:.48,roughness:.31,clearcoat:.5}),
    trace:new THREE.MeshStandardMaterial({color:0xc0b580,metalness:.86,roughness:.25}),
    traceSoft:new THREE.MeshStandardMaterial({color:0x73aaa0,metalness:.72,roughness:.29}),
    white:new THREE.MeshStandardMaterial({color:0xe6e8df,metalness:.25,roughness:.32}),
    glass:new THREE.MeshPhysicalMaterial({color:0x89aeb2,transparent:true,opacity:.28,roughness:.08,metalness:0,transmission:.35,thickness:.12,side:THREE.DoubleSide,depthWrite:false}),
    emissive:new THREE.MeshStandardMaterial({color:0xff9e59,emissive:0xff562b,emissiveIntensity:1.9,metalness:.05}),
    aqua:new THREE.MeshStandardMaterial({color:0xe1eddb,emissive:0xa7f2c3,emissiveIntensity:.3,metalness:.3}),
  };

  function roundRect(w,h,r=.2){
    const s=new THREE.Shape();
    s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);
    s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);
    s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);
    s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);
    return s;
  }
  function extruded(w,h,depth,r,material,bevel=.08){
    const geo=new THREE.ExtrudeGeometry(roundRect(w,h,r),{depth,steps:1,bevelEnabled:true,bevelThickness:bevel,bevelSize:bevel,bevelSegments:3,curveSegments:8});
    const mesh=new THREE.Mesh(geo,material);
    return mesh;
  }
  function cylinder(radius,depth,material,segments=64){
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,depth,segments),material);
    mesh.rotation.x=Math.PI/2;return mesh;
  }
  function ring(outer,inner,material,z=0){
    const shape=new THREE.Shape();shape.absarc(0,0,outer,0,Math.PI*2,false);
    const hole=new THREE.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);shape.holes.push(hole);
    const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.14,bevelEnabled:true,bevelSegments:2,bevelThickness:.035,bevelSize:.035,curveSegments:90}),material);
    mesh.position.z=z;return mesh;
  }
  function line(x1,y1,x2,y2,z,material=mat.trace,width=.018,parent){
    const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy);
    if (L<.0001) return;
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(width,L,.016),material);
    mesh.position.set((x1+x2)/2,(y1+y2)/2,z);
    mesh.rotation.z=-Math.atan2(dx,dy);
    parent.add(mesh);
  }
  function pin(x,y,z,parent){
    const geo=new THREE.CylinderGeometry(.07,.07,.06,12);
    const obj=new THREE.Mesh(geo,mat.bronze);
    obj.rotation.x=Math.PI/2;obj.position.set(x,y,z);parent.add(obj);
  }
  function labelTexture(title,subtitle){
    const cv=document.createElement('canvas');cv.width=1024;cv.height=512;
    const ctx=cv.getContext('2d');ctx.clearRect(0,0,1024,512);
    ctx.textAlign='center';ctx.fillStyle='#f2efe6';ctx.font='700 129px Arial, sans-serif';ctx.fillText(title,512,248);
    ctx.fillStyle='#e6a389';ctx.font='500 39px monospace';ctx.fillText(subtitle,512,348);
    const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;return tex;
  }
  function planeLabel(w,h,texture,x,y,z,parent){
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));
    mesh.position.set(x,y,z);parent.add(mesh);return mesh;
  }

  // Chassis — machined backplate, sidewalls and metal fasteners.
  const back=new THREE.Group();root.add(back);
  const body=extruded(5.25,6.35,.36,.50,mat.black,.15);body.position.z=-.75;back.add(body);
  const backLip=extruded(4.97,6.06,.12,.35,mat.titaniumDark,.06);backLip.position.z=-.29;back.add(backLip);
  const darkPanel=extruded(4.74,5.84,.07,.28,mat.pcb,.035);darkPanel.position.z=-.13;back.add(darkPanel);
  for (const x of [-2.21,2.21]) for (const y of [-2.7,2.7]){
    const fastener=ring(.17,.09,mat.titanium,.1);fastener.position.set(x,y,.18);back.add(fastener);
    line(x-.05,y,x+.05,y,.335,mat.titaniumDark,.018,back);
  }
  for (let i=0;i<6;i++) {
    const vent=new THREE.Mesh(new THREE.BoxGeometry(.09,.4,.03),mat.titanium);
    vent.position.set(-2.5,-1.85+i*.57,-.31);back.add(vent);
  }
  // Recessed ports, machined frame and small contacts.
  const port=extruded(1.5,.46,.24,.13,mat.titanium,.025);port.position.set(0,-3.03,-.4);back.add(port);
  const portHole=extruded(1.0,.19,.014,.04,mat.black,0);portHole.position.set(0,-3.02,-.10);back.add(portHole);
  for(let i=0;i<8;i++){const contact=new THREE.Mesh(new THREE.BoxGeometry(.07,.09,.035),mat.trace);contact.position.set(-.38+i*.11,-3.02,-.07);back.add(contact)}

  // PCB — radial buses, serpentine routing, silicon packages and passive components.
  const board=new THREE.Group();board.position.z=.13;root.add(board);
  const boardPlate=extruded(4.35,5.42,.09,.26,mat.pcb,.035);board.add(boardPlate);
  const padGeo=new THREE.BoxGeometry(.17,.15,.07);
  const padMeshes=new THREE.InstancedMesh(padGeo,mat.trace,72);board.add(padMeshes);
  const dummy=new THREE.Object3D();let padIndex=0;
  for (let side=0;side<4;side++) for(let j=0;j<18;j++){
    const u=-2.01+j*.236;
    if(side===0){dummy.position.set(u,2.49,.17);dummy.rotation.set(0,0,0)}
    if(side===1){dummy.position.set(u,-2.49,.17);dummy.rotation.set(0,0,0)}
    if(side===2){dummy.position.set(-1.98,u*.99,.17);dummy.rotation.set(0,0,Math.PI/2)}
    if(side===3){dummy.position.set(1.98,u*.99,.17);dummy.rotation.set(0,0,Math.PI/2)}
    dummy.updateMatrix();padMeshes.setMatrixAt(padIndex++,dummy.matrix);
  }
  padMeshes.instanceMatrix.needsUpdate=true;
  for (let i=0;i<40;i++){
    const side=i%2===0?-1:1;
    const yy=-2.18+(i%20)*.228;
    const xStart=side*(.91+(i%4)*.10),xMid=side*(1.32+(i%3)*.13),xEnd=side*(1.9+(i%5)*.04);
    line(xStart,yy,xMid,yy,.186,i%3===0?mat.trace:mat.traceSoft,.021,board);
    line(xMid,yy,xMid,yy+(i%3-1)*.23,.186,i%3===0?mat.trace:mat.traceSoft,.021,board);
    line(xMid,yy+(i%3-1)*.23,xEnd,yy+(i%3-1)*.23,.186,i%3===0?mat.trace:mat.traceSoft,.021,board);
    pin(xEnd,yy+(i%3-1)*.23,.20,board);
  }
  for(let row=0;row<7;row++)for(let col=0;col<2;col++){
    const x=-1.75+col*3.5,y=-1.9+row*.57;
    const chip=new THREE.Mesh(new THREE.BoxGeometry(.19,.34,.16),row%3===0?mat.titanium:mat.black);
    chip.position.set(x,y,.25);board.add(chip);
    const sidePin=new THREE.Mesh(new THREE.BoxGeometry(.27,.05,.06),mat.trace);sidePin.position.set(x,y+.18,.19);board.add(sidePin);
  }
  // Main processor and its packaging, raised above the board.
  const chipBase=extruded(2.05,2.24,.18,.08,mat.titaniumDark,.04);chipBase.position.set(0,0,.28);board.add(chipBase);
  const chipBody=extruded(1.9,2.08,.22,.06,mat.black,.025);chipBody.position.set(0,0,.46);board.add(chipBody);
  planeLabel(1.7,.9,labelTexture('F/B','CONTROL SYSTEM'),0,.02,.76,board);
  // Edge components, main power stage and orange indicator.
  for(let i=0;i<4;i++){
    const c=cylinder(.18,.37,mat.titaniumDark,22);c.position.set(-1.31+i*.88,2.05,.4);board.add(c);
    const top=cylinder(.145,.007,mat.white,22);top.position.set(-1.31+i*.88,2.05,.62);board.add(top);
  }
  for(let i=0;i<5;i++){
    const led=new THREE.Mesh(new THREE.BoxGeometry(.15,.12,.08),i===0?mat.emissive:mat.aqua);
    led.position.set(-1.55+i*.33,-2.12,.30);board.add(led);
  }
  // Vented side fin material shows genuine case depth.
  const fins=new THREE.Group();fins.position.z=-.53;root.add(fins);
  for (let i=0;i<9;i++){
    const fin=extruded(.18,5.3,.31,.04,mat.titanium,.015);
    fin.position.set(-2.19+i*.55,0,0);fins.add(fin);
  }

  // Front frame is a real extruded outline with a hole, not a painted rectangle.
  const frame=new THREE.Group();frame.position.z=.72;root.add(frame);
  const frameShape=roundRect(5.2,6.28,.45);
  const frameHole=new THREE.Path();
  // Shape.holes requires opposite winding; coordinates below run clockwise.
  const iw=4.49,ih=5.56,ir=.26;
  frameHole.moveTo(-iw/2+ir,-ih/2);
  frameHole.lineTo(-iw/2, -ih/2+ir);frameHole.quadraticCurveTo(-iw/2,ih/2,-iw/2+ir,ih/2);
  frameHole.lineTo(iw/2-ir,ih/2);frameHole.quadraticCurveTo(iw/2,ih/2,iw/2,ih/2-ir);
  frameHole.lineTo(iw/2,-ih/2+ir);frameHole.quadraticCurveTo(iw/2,-ih/2,iw/2-ir,-ih/2);
  frameHole.lineTo(-iw/2+ir,-ih/2);
  frameShape.holes.push(frameHole);
  const outerFrame=new THREE.Mesh(new THREE.ExtrudeGeometry(frameShape,{depth:.19,steps:1,bevelEnabled:true,bevelSize:.10,bevelThickness:.09,bevelSegments:4,curveSegments:10}),mat.orange);
  frame.add(outerFrame);
  for(const x of [-2.24,2.24]) for(const y of [-2.74,2.74]){
    const bolt=cylinder(.10,.08,mat.titanium,20);bolt.position.set(x,y,.36);frame.add(bolt);
  }
  // Optical/sensor assembly: orange anodized ring, brushed steel collar, deep black lens.
  const lens=new THREE.Group();lens.position.z=1.10;root.add(lens);
  lens.add(ring(1.49,1.21,mat.orange,.03));
  lens.add(ring(1.14,.99,mat.titanium,.22));
  const blackLens=cylinder(.98,.11,mat.black,84);blackLens.position.z=.2;lens.add(blackLens);
  const lensGlass=cylinder(.76,.035,mat.glass,84);lensGlass.position.z=.31;lens.add(lensGlass);
  const lensCenter=cylinder(.44,.07,mat.titaniumDark,64);lensCenter.position.z=.36;lens.add(lensCenter);
  const dot=cylinder(.15,.07,mat.emissive,36);dot.position.z=.44;lens.add(dot);
  // Radial rings add real engraved details.
  for(let i=0;i<40;i++){
    const a=(i/40)*Math.PI*2;
    const tick=new THREE.Mesh(new THREE.BoxGeometry(.028,i%5===0?.13:.07,.02),mat.titanium);
    tick.position.set(Math.cos(a)*1.30,Math.sin(a)*1.30,.205);
    tick.rotation.z=a-Math.PI/2;lens.add(tick);
  }
  // Four front-facing status lamps above the body.
  const lamps=new THREE.Group();lamps.position.z=.8;root.add(lamps);
  for(let i=0;i<4;i++){
    const x=-1.02+i*.68,y=2.34;
    const bezel=cylinder(.15,.13,mat.titaniumDark,20);bezel.position.set(x,y,0);lamps.add(bezel);
    const light=cylinder(.083,.025,i===0?mat.emissive:mat.aqua,20);light.position.set(x,y,.11);lamps.add(light);
  }
  // Floating measuring geometry in the real world space.
  const orbitMaterial=new THREE.MeshBasicMaterial({color:0x7a9189,transparent:true,opacity:.18,depthWrite:false});
  const orbitGroup=new THREE.Group();scene.add(orbitGroup);
  for(const rad of [4.6,5.4,6.5]) {
    const orbit=new THREE.Mesh(new THREE.TorusGeometry(rad,.005,4,150),orbitMaterial);
    orbit.rotation.set(.18,.34,.16);orbitGroup.add(orbit);
  }
  const points=[];for(let i=0;i<120;i++){
    const angle=i*2.39996,radius=4.1+(i%34)*.105;
    points.push(Math.cos(angle)*radius,Math.sin(angle)*radius,-2-(i%7)*.2);
  }
  const pgeo=new THREE.BufferGeometry();pgeo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  const particles=new THREE.Points(pgeo,new THREE.PointsMaterial({color:0x678783,size:.024,transparent:true,opacity:.48}));scene.add(particles);

  const v={p:0,target:0,pointerX:0,pointerY:0,offsetX:0,offsetY:0};
  let rafActive=false,visible=true,last=0,width=0,height=0;
  const mobile=()=>window.innerWidth<700;
  function resize(){
    width=holder.clientWidth;height=holder.clientHeight;if(!width||!height)return;
    renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    if(!rafActive)draw();
  }
  function targetFromScroll(scroll,h){
    return THREE.MathUtils.clamp(scroll/Math.max(1,h),0,1.85);
  }
  function onScroll(event){
    v.target=prefersReducedMotion?0:targetFromScroll(event.detail.scroll,event.detail.heroHeight);
    visible=!document.hidden&&event.detail.scroll<document.getElementById('about').offsetTop-window.innerHeight*.28;
    if(prefersReducedMotion){v.p=v.target;if(visible)draw()}
    else if(!visible)stop();else if(!rafActive)start();
  }
  function onPointer(e){if(prefersReducedMotion||mobile())return;v.pointerX=(e.clientX/window.innerWidth-.5)*.2;v.pointerY=(e.clientY/window.innerHeight-.5)*.15}
  function draw(){
    const s=THREE.MathUtils.smoothstep(v.p,.05,1.25);
    const assemble=THREE.MathUtils.smoothstep(v.p,.17,.9);
    const fadeOut=1-THREE.MathUtils.smoothstep(v.p,1.45,1.9);
    const heroX=mobile()?0.0:3.15,storyX=mobile()?0.0:-3.0;
    root.position.x=THREE.MathUtils.lerp(heroX,storyX,s);
    root.position.y=THREE.MathUtils.lerp(mobile()?2.15:0, mobile()?2.5:-.18,s);
    const scale=THREE.MathUtils.lerp(mobile()?.64:.82,mobile()?.63:.92,s)*fadeOut;
    root.scale.setScalar(Math.max(.001,scale));
    root.rotation.x=THREE.MathUtils.lerp(-.30,.15,s)+v.offsetY;
    root.rotation.y=THREE.MathUtils.lerp(-.62,.33,s)+v.offsetX;
    root.rotation.z=THREE.MathUtils.lerp(.12,-.13,s);
    back.position.z=-assemble*1.75;
    board.position.z=.13-assemble*.57;
    frame.position.z=.72+assemble*.95;
    lens.position.z=1.1+assemble*2.15;
    lamps.position.z=.8+assemble*1.10;
    fins.position.z=-.53-assemble*1.23;
    orbitGroup.rotation.z=v.p*.10;
    orbitGroup.position.x=THREE.MathUtils.lerp(heroX,storyX,s);
    orbitGroup.position.y=mobile()?1.8:0;
    orbitGroup.scale.setScalar(mobile()?.65:.84);
    renderer.render(scene,camera);
  }
  function frameUpdate(now){
    if(!visible||disposed){rafActive=false;renderer.setAnimationLoop(null);return;}
    const dt=Math.min((now-last)/1000||0,.04);last=now;
    const k=1-Math.exp(-dt*3.3);
    v.p=THREE.MathUtils.lerp(v.p,v.target,k);
    v.offsetX=THREE.MathUtils.lerp(v.offsetX,v.pointerX,k*.7);
    v.offsetY=THREE.MathUtils.lerp(v.offsetY,v.pointerY,k*.7);
    draw();
  }
  function start(){if(rafActive||disposed||prefersReducedMotion)return;rafActive=true;last=performance.now();renderer.setAnimationLoop(frameUpdate)}
  function stop(){if(!rafActive)return;rafActive=false;renderer.setAnimationLoop(null)}
  const onVisibility=()=>{visible=!document.hidden&&window.scrollY<document.getElementById('manifesto').offsetTop+document.getElementById('manifesto').offsetHeight;if(visible)start();else stop()};
  const observer=new ResizeObserver(resize);observer.observe(holder);
  window.addEventListener('portfolio-scroll',onScroll);
  window.addEventListener('pointermove',onPointer,{passive:true});
  document.addEventListener('visibilitychange',onVisibility);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cinema.classList.remove('has-webgl');stop()});
  cinema.classList.add('has-webgl');
  resize();v.target=prefersReducedMotion?0:targetFromScroll(window.scrollY,document.getElementById('hero').offsetHeight);v.p=v.target;draw();start();
  window.disposePortfolioScene=()=>{
    if(disposed)return;disposed=true;stop();observer.disconnect();
    window.removeEventListener('portfolio-scroll',onScroll);window.removeEventListener('pointermove',onPointer);
    document.removeEventListener('visibilitychange',onVisibility);
    scene.traverse(obj=>{if(obj.geometry)obj.geometry.dispose();const mats=Array.isArray(obj.material)?obj.material:[obj.material];mats.forEach(m=>{if(m){if(m.map)m.map.dispose();m.dispose()}})});
    renderer.dispose();renderer.domElement.remove();
  };
} catch(error) {
  console.warn('La vista interactiva no está disponible. La web sigue siendo funcional.',error);
  cinema.classList.remove('has-webgl');
}