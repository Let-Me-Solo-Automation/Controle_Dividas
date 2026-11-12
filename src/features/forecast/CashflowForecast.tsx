import {useRef} from 'react';
import {motion,useInView,useReducedMotion} from 'motion/react';
import {AnimatedMoney,MotionCard,useMotionPreferences} from '../../components/nexo-ui';
type Event={id:string;date:string;title:string;amount:number;type:string};
export function CashflowForecast({balance,items,visible}:{balance:number;items:Event[];visible:boolean}){
 const pref=useMotionPreferences(),root=useRef<HTMLElement>(null),seen=useInView(root,{once:!!pref.efficient,amount:.15}),reduced=useReducedMotion();
 const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+30);
 const date=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const scheduled=items.filter(item=>item.date>=date(start)&&item.date<=date(end)&&item.type!=='goal').sort((a,b)=>a.date.localeCompare(b.date));
 let running=balance;const values=[balance,...scheduled.map(item=>{running+=(['income','receive'].includes(item.type)?1:-1)*item.amount;return running;})];
 const low=Math.min(0,...values),high=Math.max(1,...values),range=Math.max(1,high-low);
 const path=values.map((value,index)=>`${index?'L':'M'}${12+276*index/Math.max(1,values.length-1)},${100-(value-low)/range*85}`).join(' ');
 const animate=!reduced&&pref.motion!==false;
 return <MotionCard ref={root} className="card forecast-card" aria-label="Previsão de saldo"><h2>Previsão para os próximos 30 dias</h2><p>Estimativa com parcelas e recorrências cadastradas. Não inclui receitas ainda não registradas nem trata metas como despesas.</p><div className="forecast-values"><span><small>Saldo estimado ao final</small><AnimatedMoney value={running} visible={visible} signed fromZero className={running<0?'negative-text':'positive-text'}/></span><span><small>Menor saldo estimado</small><AnimatedMoney value={Math.min(...values)} visible={visible} signed fromZero className={Math.min(...values)<0?'negative-text':'positive-text'}/></span></div>{visible?<svg viewBox="0 0 300 120" role="img" aria-label="Evolução do saldo previsto"><line x1="10" x2="290" y1={100-(0-low)/range*85} y2={100-(0-low)/range*85} stroke="var(--line)" strokeDasharray="3 4"/><motion.path d={path} fill="none" stroke={Math.min(...values)<0?'var(--negative)':'var(--positive)'} strokeWidth="3" strokeLinecap="round" initial={animate?{pathLength:0}:false} animate={{pathLength:!animate||seen?1:0}} transition={{duration:animate?.7:0,ease:'easeOut'}}/></svg>:<p className="muted">Valores protegidos.</p>}<small>{scheduled.length} compromissos considerados · atualiza com os seus registros</small></MotionCard>;
}
