"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {supabase} from "@/lib/supabase";

const documents=[
 {title:"Сатуу боюнча окуу куралы",url:"https://raw.githubusercontent.com/adiletzainidinov/Satup.yiron/main/satuu_oku_kuraly_22mb.pdf"},
 {title:"Хиджаз Куран — сатуу скрипти",url:"https://raw.githubusercontent.com/adiletzainidinov/Satup.yiron/main/%D0%A5%D0%B8%D0%B4%D0%B6%D0%B0%D0%B7%20%D0%9A%D1%83%D1%80%D0%B0%D0%BD%20%E2%80%94%20%D1%81%D0%B0%D1%82%D1%83%D1%83%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B8_261110_002923.pdf"}
];

function ContinuousPage({pdf,number,zoom}:{pdf:any;number:number;zoom:number}){
 const outer=useRef<HTMLDivElement>(null);
 const canvas=useRef<HTMLCanvasElement>(null);
 const [visible,setVisible]=useState(false);
 const [ratio,setRatio]=useState(1.414);
 useEffect(()=>{
  const node=outer.current;if(!node)return;
  const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting),{rootMargin:"1100px 0px"});
  observer.observe(node);return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  const element=canvas.current,container=outer.current;
  if(!element||!container)return;
  if(!visible){element.width=0;element.height=0;return;}
  let stopped=false;let task:any;
  (async()=>{
   try{
    const page=await pdf.getPage(number);
    if(stopped)return;
    const base=page.getViewport({scale:1});
    setRatio(base.height/base.width);
    const width=Math.max(250,container.clientWidth-12);
    const scale=(width/base.width)*zoom;
    const dpr=Math.min(window.devicePixelRatio||1,1.6);
    const viewport=page.getViewport({scale:scale*dpr});
    element.width=Math.ceil(viewport.width);element.height=Math.ceil(viewport.height);
    element.style.width=Math.round(viewport.width/dpr)+"px";
    element.style.height=Math.round(viewport.height/dpr)+"px";
    const ctx=element.getContext("2d");
    if(!ctx)return;
    task=page.render({canvasContext:ctx,viewport});
    await task.promise;
   }catch(e){if(!stopped)console.error("PDF page rendering failed",e)}
  })();
  return()=>{stopped=true;if(task)task.cancel();};
 },[pdf,number,zoom,visible]);
 return <div ref={outer} style={{width:"100%",minHeight:"min(130vw,1100px)",aspectRatio:"1 / "+ratio,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"#fff",boxShadow:"0 2px 12px #17243a14",marginBottom:12,overflow:"hidden",borderRadius:5}}>
  <canvas ref={canvas} aria-label={"Бет "+number} style={{display:visible?"block":"none",maxWidth:"none"}}/>
  {!visible&&<span style={{fontSize:12,color:"#8c97a4",paddingTop:30}}>{number}</span>}
 </div>;
}
export default function Materials(){
 const [authorized,setAuthorized]=useState<boolean|null>(null);
 const [active,setActive]=useState(0);
 const [pdf,setPdf]=useState<any>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 const [zoom,setZoom]=useState(1);
 useEffect(()=>{
  const db=supabase();if(!db){setAuthorized(false);return}
  db.auth.getUser().then(({data})=>setAuthorized(!!data.user));
  const {data:{subscription}}=db.auth.onAuthStateChange((_e,s)=>setAuthorized(!!s?.user));
  return()=>subscription.unsubscribe();
 },[]);
 useEffect(()=>{
  if(!authorized)return;
  let cancelled=false;let documentTask:any;let loaded:any;
  setPdf(null);setError("");setLoading(true);
  (async()=>{
   try{
    const lib=await import("pdfjs-dist");
    lib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
    documentTask=lib.getDocument({url:documents[active].url,withCredentials:false});
    loaded=await documentTask.promise;
    if(!cancelled){setPdf(loaded);setLoading(false);}
   }catch(e){if(!cancelled){setError("PDF ачылбай калды. Интернет байланышын текшерип, кайра аракет кылыңыз.");setLoading(false);console.error(e)}}
  })();
  return()=>{cancelled=true;documentTask?.destroy?.();};
 },[active,authorized]);
 const select=(index:number)=>{if(index===active)return;setActive(index);setZoom(1);window.scrollTo({top:0,behavior:"instant"});};
 if(authorized===null)return <main style={{padding:30}}>Жүктөлүүдө…</main>;
 if(!authorized)return <main style={{maxWidth:560,margin:"70px auto",padding:24}}><h1>Окуу материалдары</h1><p>Материалдарды көрүү үчүн аккаунтуңузга кириңиз.</p><Link href="/">Башкы бетке кайтуу</Link></main>;
 return <main style={{maxWidth:920,margin:"0 auto",padding:"20px 12px 70px",minHeight:"100dvh"}}>
  <Link href="/" style={{color:"#137b66",fontWeight:700,textDecoration:"none"}}>← Академияга кайтуу</Link>
  <h1 style={{fontSize:"clamp(24px,5vw,34px)",margin:"22px 0 8px"}}>Окуу материалдары</h1>
  <p style={{color:"#687587",fontSize:14}}>Барактарды ылдый жылдырып, китепти аягына чейин окуңуз.</p>
  <div style={{display:"grid",gap:10,gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",margin:"18px 0"}}>
   {documents.map((d,i)=><button key={d.title} type="button" onClick={()=>select(i)} aria-pressed={active===i} style={{textAlign:"left",padding:17,borderRadius:14,border:active===i?"2px solid #137b66":"1px solid #dce4e8",background:active===i?"#eaf7f1":"white",color:"#17243a",fontWeight:750,fontSize:16,cursor:"pointer"}}>{d.title}</button>)}
  </div>
  <div style={{position:"sticky",top:0,zIndex:5,background:"#f7f8fa",padding:"12px 8px",display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",borderBottom:"1px solid #e1e6e9"}}>
   <strong style={{flex:"1 1 180px",fontSize:14}}>{documents[active].title}</strong>
   <button type="button" onClick={()=>setZoom(z=>Math.max(.75,Math.round((z-.15)*100)/100))} style={btn} aria-label="Кичирейтүү">−</button>
   <span style={{fontSize:14,minWidth:42,textAlign:"center"}}>{Math.round(zoom*100)}%</span>
   <button type="button" onClick={()=>setZoom(z=>Math.min(1.6,Math.round((z+.15)*100)/100))} style={btn} aria-label="Чоңойтуу">+</button>
   {pdf&&<span style={{fontSize:12,color:"#687587"}}>{pdf.numPages} бет</span>}
  </div>
  {loading&&<div role="status" style={{padding:"70px 16px",textAlign:"center",color:"#687587"}}>PDF жүктөлүүдө… Бир аз күтө туруңуз.</div>}
  {error&&<div role="alert" style={{padding:20,color:"#a43d32"}}>{error}<div style={{marginTop:12}}><button style={btn} onClick={()=>{setAuthorized(false);setTimeout(()=>setAuthorized(true),0)}}>Кайра аракет кылуу</button></div></div>}
  {pdf&&<div style={{background:"#e8ecf0",padding:"12px 6px",overflowX:"auto"}}>
   <div style={{width:zoom>1?Math.round(zoom*100)+"%":"100%",margin:"0 auto"}}>
    {Array.from({length:pdf.numPages},(_,i)=><ContinuousPage key={active+"-"+(i+1)} pdf={pdf} number={i+1} zoom={1}/>)}
   </div>
   <p style={{textAlign:"center",padding:"20px 0",color:"#687587",fontSize:14}}>Китептин аягы · {pdf.numPages} бет</p>
  </div>}
 </main>;
}
const btn:React.CSSProperties={padding:"9px 13px",border:"1px solid #dce4e8",borderRadius:9,background:"white",fontWeight:700,cursor:"pointer",fontSize:17};
