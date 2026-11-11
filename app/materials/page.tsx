"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {supabase} from "@/lib/supabase";

const docs=[
 {id:"guide",title:"Сатуу боюнча окуу куралы",path:"/materials/satuu-boyuncha-okuu-kuraly.pdf"},
 {id:"script",title:"Хиджаз Куран — сатуу скрипти",path:"/materials/hidjaz-kuran-satuu-skripti.pdf"}
];
export default function Materials(){
 const [authorized,setAuthorized]=useState<boolean|null>(null);
 const [active,setActive]=useState(0);
 const [source,setSource]=useState<string|null>(null);
 const [available,setAvailable]=useState<boolean|null>(null);
 const [zoom,setZoom]=useState(100);
 const [page,setPage]=useState(1);
 const [notice,setNotice]=useState("");
 const fileRef=useRef<HTMLInputElement>(null);
 useEffect(()=>{const db=supabase();if(!db){setAuthorized(false);return}db.auth.getUser().then(({data})=>setAuthorized(!!data.user));const {data:{subscription}}=db.auth.onAuthStateChange((_e,s)=>setAuthorized(!!s?.user));return()=>subscription.unsubscribe()},[]);
 useEffect(()=>{setPage(1);setZoom(100);setNotice("");setAvailable(null);setSource(null);let cancel=false;fetch(docs[active].path,{method:"HEAD"}).then(r=>{if(!cancel){setAvailable(r.ok);if(r.ok)setSource(docs[active].path)}}).catch(()=>{if(!cancel)setAvailable(false)});return()=>{cancel=true}},[active]);
 useEffect(()=>()=>{if(source?.startsWith("blob:"))URL.revokeObjectURL(source)},[source]);
 function localFile(f?:File){if(!f)return;if(f.type!=="application/pdf"&&!f.name.toLowerCase().endsWith(".pdf")){setNotice("PDF файлын тандаңыз");return}setSource(URL.createObjectURL(f));setAvailable(true);setNotice("Бул файл ушул түзмөктө гана ачылды. Сайтка жүктөлгөн жок.");setPage(1)}
 const doc=docs[active];
 if(authorized===null)return <main style={{padding:30}}>Жүктөлүүдө…</main>;
 if(!authorized)return <main style={{maxWidth:560,margin:"70px auto",padding:24}}><h1>Окуу материалдары</h1><p>Материалдарды көрүү үчүн аккаунтуңузга кириңиз.</p><Link href="/">Башкы бетке кайтуу</Link></main>;
 return <main style={{maxWidth:1000,margin:"0 auto",padding:"20px 12px 60px",minHeight:"100dvh"}}>
 <Link href="/" style={{color:"#137b66",fontWeight:700,textDecoration:"none"}}>← Академияга кайтуу</Link>
 <h1 style={{fontSize:"clamp(24px,5vw,34px)",margin:"22px 0 8px"}}>Окуу материалдары</h1>
 <p style={{color:"#687587",fontSize:14}}>Телефондон окууга ылайыкталган PDF китепкана</p>
 <div style={{display:"grid",gap:10,gridTemplateColumns:"repeat(auto-fit,minmax(min(100%,260px),1fr))",margin:"18px 0"}}>
 {docs.map((d,i)=><button key={d.id} onClick={()=>setActive(i)} aria-pressed={active===i} style={{textAlign:"left",padding:17,borderRadius:14,border:active===i?"2px solid #137b66":"1px solid #dce4e8",background:active===i?"#eaf7f1":"white",color:"#17243a",fontWeight:750}}>{d.title}</button>)}
 </div>
 <section style={{background:"white",border:"1px solid #e3e8ed",borderRadius:16,overflow:"hidden"}}>
 <div style={{padding:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",borderBottom:"1px solid #e9edf2"}}>
 <strong style={{flex:"1 1 100%",fontSize:14}}>{doc.title}</strong>
 <button onClick={()=>setZoom(v=>Math.max(70,v-20))} aria-label="Кичирейтүү" style={btn}>−</button>
 <span style={{fontSize:13,minWidth:45,textAlign:"center"}}>{zoom}%</span>
 <button onClick={()=>setZoom(v=>Math.min(180,v+20))} aria-label="Чоңойтуу" style={btn}>+</button>
 {source&&<a href={source} target="_blank" rel="noopener noreferrer" style={{...btn,textDecoration:"none",color:"#137b66"}}>Толук экран ↗</a>}
 {source&&<a href={source} download={doc.id+".pdf"} style={{...btn,textDecoration:"none",color:"#137b66"}}>PDF ↓</a>}
 </div>
 {available===false?<div style={{padding:"45px 20px",textAlign:"center"}}><p>Документ серверге азырынча жүктөлө элек.</p><p style={{fontSize:13,color:"#687587"}}>PDF файлын телефонуңуздан убактылуу ачсаңыз болот.</p><button style={{...btn,color:"#137b66"}} onClick={()=>fileRef.current?.click()}>PDF ачуу</button><input ref={fileRef} type="file" accept="application/pdf,.pdf" hidden onChange={e=>localFile(e.target.files?.[0])}/></div>:source?<div style={{overflowX:"auto",background:"#e8ecf0",padding:"8px 0",textAlign:"center"}}><iframe key={source+"#"+page+"-"+zoom} title={doc.title} src={source+"#page="+page+"&zoom="+zoom+"&toolbar=1"} style={{width:zoom>100?zoom+"%":"100%",minWidth:zoom>100?600:0,height:"min(78dvh,900px)",border:0,background:"white"}}/></div>:<div style={{padding:40,textAlign:"center"}}>Документ текшерилүүдө…</div>}
 {notice&&<p role="status" style={{padding:"0 16px",fontSize:12,color:"#687587"}}>{notice}</p>}
 {source&&<div style={{padding:14,display:"flex",gap:10,justifyContent:"center",alignItems:"center"}}><button style={btn} onClick={()=>setPage(p=>Math.max(1,p-1))}>←</button><label style={{fontSize:13}}>Бет <input type="number" min={1} value={page} onChange={e=>setPage(Math.max(1,Number(e.target.value)||1))} style={{width:60,padding:8,border:"1px solid #ddd",borderRadius:7}}/></label><button style={btn} onClick={()=>setPage(p=>p+1)}>→</button></div>}
 </section>
 </main>
}
const btn:React.CSSProperties={padding:"9px 13px",border:"1px solid #dce4e8",borderRadius:9,background:"white",fontWeight:700,cursor:"pointer"};
