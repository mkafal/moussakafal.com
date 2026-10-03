import * as THREE from './vendor/three.module.min.js';

// The artwork is a real geometric sculpture: twisted metallic ribbons,
// fine conductors and moving emissive currents. All assets are local.
const hero=document.querySelector('.hero');
const mount=document.querySelector('#hero-webgl');
const root=document.documentElement;
let renderer;
try {
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
} catch(error) {
  mount.remove();
}
if(renderer) init();

function init(){
  const mobile=matchMedia('(max-width:760px)').matches;
  const segments=mobile?192:320;
  renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.25:1.65));
  renderer.setClearColor(0x080908,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=.88;
  mount.appendChild(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(40,1,.1,60);
  camera.position.set(0,0,9);
  // Broad studio reflections give metal its shape without downloaded HDR maps.
  const studio=new THREE.Scene();studio.background=new THREE.Color(0x242728);
  const panels=[
    [0,5,0,12,1,8,0xffe4c3,5],[-5,1,2,1,7,6,0xf0f4ff,4],
    [5,1,-1,1,8,8,0xffb675,5],[0,-4,3,9,1,4,0x858fa4,1],
    [0,1,-5,10,6,1,0xe0eaff,3],[1,0,5,2,7,1,0xffb683,2]
  ];
  panels.forEach(([x,y,z,w,h,d,c,intensity])=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(intensity*.6)}));m.position.set(x,y,z);studio.add(m);
  });
  const pmrem=new THREE.PMREMGenerator(renderer);
  const environment=pmrem.fromScene(studio,.12);
  scene.environment=environment.texture;
  studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose()});pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xf4e7d5,0x332013,1.1));
  const key=new THREE.DirectionalLight(0xfff0db,2.3);key.position.set(-3,5,7);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff681d,5);rim.position.set(4,-1,-3);scene.add(rim);
  const fill=new THREE.DirectionalLight(0xb8c6dc,1.2);fill.position.set(-5,0,-2);scene.add(fill);
  const stage=new THREE.Group();scene.add(stage);
  const sculpture=new THREE.Group();stage.add(sculpture);
  const copper=new THREE.MeshPhysicalMaterial({color:0xad6337,metalness:1,roughness:.25,clearcoat:.2,clearcoatRoughness:.28,side:THREE.DoubleSide,envMapIntensity:1.0});
  const titanium=new THREE.MeshPhysicalMaterial({color:0x79828b,metalness:1,roughness:.23,clearcoat:.15,side:THREE.DoubleSide,envMapIntensity:1.05});
  const edgeMaterial=new THREE.MeshStandardMaterial({color:0xefad62,metalness:1,roughness:.28,envMapIntensity:1.6});
  const darkCopper=new THREE.MeshStandardMaterial({color:0x58331e,metalness:1,roughness:.32});
  const major=1.94, minor=.57, twists=2;
  function point(u,phase,radius=minor){
    const theta=u*Math.PI*2;const phi=twists*theta+phase;
    const r=major+radius*Math.cos(phi);
    return new THREE.Vector3(r*Math.cos(theta),r*Math.sin(theta),radius*Math.sin(phi));
  }
  class Conductor extends THREE.Curve {
    constructor(phase,radius){super();this.phase=phase;this.radius=radius;}
    getPoint(t,target=new THREE.Vector3()){return target.copy(point(t,this.phase,this.radius));}
  }
  // Six interlaced, substantial metal ribbons, each with a copper edge.
  for(let band=0;band<6;band++){
    const phase=band*Math.PI/3, width=.68;
    const vertices=[],uv=[],indices=[];const across=10;
    for(let i=0;i<=segments;i++)for(let j=0;j<=across;j++){
      const v=point(i/segments,phase+(j/across-.5)*width);
      vertices.push(v.x,v.y,v.z);uv.push(i/segments,j/across);
      if(i<segments&&j<across){const k=i*(across+1)+j;indices.push(k,k+across+1,k+1,k+1,k+across+1,k+across+2)}
    }
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
    sculpture.add(new THREE.Mesh(geometry,band%3===0?titanium:copper));
    for(const side of [-1,1])sculpture.add(new THREE.Mesh(new THREE.TubeGeometry(new Conductor(phase+side*width/2,minor),segments,.012,5,true),edgeMaterial));
  }
  // Slender dark conductor filaments sit in the gaps between the ribbons.
  const currentMaterials=[];
  const currentVertex=`varying vec2 vUV;void main(){vUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
  const currentFragment=`uniform float time;uniform float offset;uniform float glow;varying vec2 vUV;void main(){float a=fract(vUV.x-time*.047+offset);float pulse=pow(max(0.,1.-a/.15),2.);float second=pow(max(0.,1.-fract(a+.5)/.08),2.);float energy=max(pulse,second*.75);vec3 copper=vec3(1.,.18,.012);vec3 hot=vec3(1.,.76,.33);vec3 color=mix(copper,hot,energy);gl_FragColor=vec4(color,(.16+energy*.84)*glow);}`;
  const sparks=[];
  for(let i=0;i<(mobile?12:18);i++){
    const phase=i*Math.PI*2/(mobile?12:18)+.12;
    const path=new Conductor(phase,minor+.027);
    sculpture.add(new THREE.Mesh(new THREE.TubeGeometry(path,segments,.005,4,true),darkCopper));
    for(const glow of [false,true]){
      const material=new THREE.ShaderMaterial({uniforms:{time:{value:0},offset:{value:i*.113},glow:{value:glow?.24:1}},vertexShader:currentVertex,fragmentShader:currentFragment,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
      const tube=new THREE.Mesh(new THREE.TubeGeometry(path,segments,glow?.048:.012,5,true),material);
      sculpture.add(tube);currentMaterials.push(material);
    }
    if(i%3===0){const spark=new THREE.Mesh(new THREE.SphereGeometry(.018,8,6),new THREE.MeshBasicMaterial({color:0xffdf8d}));sculpture.add(spark);sparks.push({mesh:spark,path,offset:i*.113})}
  }
  // A minimal orbital trace adds depth around the physical centerpiece.
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(2.82,.002,3,180),new THREE.MeshBasicMaterial({color:0xa56034,transparent:true,opacity:.28}));orbit.rotation.set(.5,-.2,.2);sculpture.add(orbit);
  const pointer=new THREE.Vector2(),smoothed=new THREE.Vector2();
  let isVisible=true,raf=0,elapsed=0,last=0,lastFrame=0,scrollAmount=0,disposed=false;
  const isPaused=()=>root.classList.contains('motion-paused')||matchMedia('(prefers-reduced-motion:reduce)').matches;
  function resize(){
    const {width,height}=mount.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
    const small=width<761;
    stage.position.set(small?.64:2.0,small?-.2:.08,0);
    stage.scale.setScalar(small?.82:1.2);
    camera.position.z=small?9.4:9;
    draw();
  }
  function pose(){
    const small=mount.clientWidth<761;
    sculpture.rotation.set(.31+Math.sin(elapsed*.12)*.1+smoothed.y*.14,-.48+Math.sin(elapsed*.095)*.28+smoothed.x*.24,-.27+elapsed*.055);
    stage.position.y=(small?-.2:.08)+Math.sin(elapsed*.35)*.05+scrollAmount*.38;
    const base=small?.82:1.2;stage.scale.setScalar(base*(1-scrollAmount*.12));
    currentMaterials.forEach(m=>m.uniforms.time.value=elapsed);
    sparks.forEach(s=>s.mesh.position.copy(s.path.getPoint(((elapsed*.047-s.offset)%1+1)%1)));
  }
  function draw(){if(disposed)return;pose();renderer.render(scene,camera);}
  function frame(now){
    raf=0;if(disposed||!isVisible||document.hidden||isPaused())return;
    const delta=last?Math.min((now-last)/1000,.07):0;last=now;
    elapsed+=delta;
    smoothed.lerp(pointer,.045);
    if(now-lastFrame>=(mobile?32:21)){draw();lastFrame=now;}
    raf=requestAnimationFrame(frame);
  }
  function sync(){
    if(raf){cancelAnimationFrame(raf);raf=0}last=0;
    if(isVisible&&!document.hidden&&!isPaused())raf=requestAnimationFrame(frame);else draw();
  }
  const watch=new MutationObserver(sync);watch.observe(root,{attributes:true,attributeFilter:['class']});
  const visibility=new IntersectionObserver(([e])=>{isVisible=e.isIntersecting;sync()},{threshold:0});visibility.observe(hero);
  const sizing=new ResizeObserver(resize);sizing.observe(mount);
  hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch'||isPaused())return;const r=hero.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1)});
  hero.addEventListener('pointerleave',()=>pointer.set(0,0));
  window.addEventListener('scroll',()=>{scrollAmount=Math.min(1,Math.max(0,window.scrollY/hero.offsetHeight));if(isPaused())return;},{passive:true});
  document.addEventListener('visibilitychange',sync);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();disposed=true;cancelAnimationFrame(raf);hero.classList.remove('has-3d');mount.style.opacity='0';});
  resize();draw();
  hero.classList.add('has-3d');mount.dataset.ready='true';sync();
}
