import {useState,useEffect,useRef} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Check,LoaderCircle} from 'lucide-react';
export function SaveToggleButton({onSave,label='Salvar',disabled=false,revision}:{onSave:()=>boolean|void;label?:string;disabled?:boolean;revision?:string}){
 const [status,setStatus]=useState<'idle'|'loading'|'success'|'saved'>('idle');
 const timers=useRef<ReturnType<typeof setTimeout>[]>([]);const reduce=useReducedMotion();
 useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
 useEffect(()=>{if(!disabled)setStatus("idle");},[disabled,revision]);
 const later=(fn:()=>void,ms:number)=>timers.current.push(setTimeout(fn,ms));
 function save(){if(disabled||status==='loading'||status==='success')return;setStatus('loading');later(()=>{try{if(onSave()===false){setStatus('idle');return;}setStatus('success');later(()=>setStatus('saved'),450);}catch{setStatus('idle');}},reduce?0:160);}
 const circle=status==='loading'||status==='success';
 return <motion.button type="button" layout className={`save-toggle real-save-toggle state-${status}`} disabled={disabled&&status==='idle'} onClick={save} style={{width:circle?46:170,minWidth:0,height:46}} transition={{type:'spring',stiffness:360,damping:34}} whileTap={reduce?undefined:{scale:.97}} aria-label={status==='saved'?'Salvo':label} aria-busy={status==='loading'}>
 <AnimatePresence mode="wait" initial={false}><motion.span key={status} className="save-toggle-content" initial={{opacity:0,y:reduce?0:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:-5}} transition={{duration:reduce?0:.12}}>{status==='loading'?<LoaderCircle className="save-spinner" size={21}/>:status==='success'?<Check size={23}/>:status==='saved'?<><Check size={19}/>Salvo</>:label}</motion.span></AnimatePresence>
 </motion.button>;
}
