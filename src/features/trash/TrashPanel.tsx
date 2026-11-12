import {useState,useEffect} from 'react';
import {SaveToggleButton} from '../../components/SaveToggleButton';
import {Trash2,Undo2} from 'lucide-react';
import {type DeletedBundle,type TrashPolicy} from './model';
export function TrashPanel({items,policy,onPolicy,onRestore,onEmpty}:{items:DeletedBundle[];policy:TrashPolicy;onPolicy:(policy:TrashPolicy)=>boolean|void;onRestore:(id:string)=>void;onEmpty:()=>void}){
 const [confirm,setConfirm]=useState(false);
 const [draft,setDraft]=useState(policy);useEffect(()=>setDraft(policy),[policy.amount,policy.unit]);
 return <section className="card trash-panel" aria-label="Lixeira"><h2>Lixeira</h2><p>Registros excluídos ficam aqui até a limpeza. Restaurar também recupera os vínculos financeiros, quando ainda forem válidos.</p>
 <label className="field"><span>Excluir definitivamente após (0 = manter até excluir manualmente)</span><input type="number" min="0" max={draft.unit==='months'?120:3650} value={draft.amount} onChange={event=>{const amount=Number(event.target.value);if(Number.isInteger(amount)&&amount>=0)setDraft({...draft,amount});}}/></label>
 <label className="field"><span>Unidade do prazo</span><select value={draft.unit} onChange={event=>setDraft({...draft,unit:event.target.value as TrashPolicy['unit']})}><option value="days">Dias</option><option value="months">Meses</option></select></label>
 <SaveToggleButton label="Salvar prazo" revision={`${draft.amount}-${draft.unit}`} onSave={()=>onPolicy(draft)}/>
 <small>A limpeza automática ocorre ao abrir e durante o uso do app. O prazo conta desde cada exclusão.</small>
 {items.length===0?<p className="muted">Lixeira vazia.</p>:<><p>{items.length} exclusões guardadas</p>{items.slice().reverse().map(item=><div className="simple-row" key={item.id}><span><strong>{item.title}</strong><small>{new Date(item.deletedAt).toLocaleString('pt-BR')}</small></span><button type="button" className="text-button" onClick={()=>onRestore(item.id)}><Undo2 size={16}/> Restaurar</button></div>)}<button type="button" className="button danger" onClick={()=>{if(confirm){onEmpty();setConfirm(false);}else setConfirm(true);}}><Trash2 size={16}/>{confirm?'Confirmar exclusão definitiva':'Esvaziar lixeira'}</button>{confirm&&<button type="button" className="text-button" onClick={()=>setConfirm(false)}>Cancelar</button>}</>}
 </section>;
}
