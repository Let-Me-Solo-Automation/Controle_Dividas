const collections=['accounts','entries','sections','goals','deliveries','recurring','reserve','reservePlans','reserveTransactions'] as const;
export type TrashPolicy={amount:number;unit:'days'|'months'};
export type DeletedBundle={id:string;deletedAt:string;title:string;records:Record<string,any[]>;links:{id:string;sectionId?:string;paymentId?:string}[]};
export function normalizeTrash(data:any){
 const policy=data.trashPolicy;
 data.trashPolicy={amount:Math.min(policy?.unit==='months'?120:3650,Math.max(0,Math.floor(Number(policy?.amount)||0))),unit:policy?.unit==='months'?'months':'days'};
 data.trash=Array.isArray(data.trash)?data.trash.filter((item:any)=>item&&typeof item.id==='string'&&Number.isFinite(Date.parse(item.deletedAt))&&item.records&&typeof item.records==='object'&&Array.isArray(item.links)):[];
 purgeExpired(data);
 return data;
}
export function purgeExpired(data:any,now=Date.now()){
 if(!data.trashPolicy?.amount)return;
 data.trash=(data.trash||[]).filter((item:DeletedBundle)=>{const deadline=new Date(item.deletedAt);if(data.trashPolicy.unit==='months'){const day=deadline.getDate();deadline.setDate(1);deadline.setMonth(deadline.getMonth()+data.trashPolicy.amount);deadline.setDate(Math.min(day,new Date(deadline.getFullYear(),deadline.getMonth()+1,0).getDate()));}else deadline.setDate(deadline.getDate()+data.trashPolicy.amount);return deadline.getTime()>now;});
}
export function archiveDeleted(before:any,after:any,title:string){
 const records:Record<string,any[]>={};
 for(const key of collections){const ids=new Set((after[key]||[]).map((item:any)=>item.id??item.accountId));const removed=(before[key]||[]).filter((item:any)=>!ids.has(item.id??item.accountId));if(removed.length)records[key]=structuredClone(removed);}
 if(!Object.keys(records).length)return;
 const links=(before.entries||[]).filter((item:any)=>item.sectionId&&(records.sections||[]).some(section=>section.id===item.sectionId)).map((item:any)=>({id:item.id,sectionId:item.sectionId,paymentId:item.paymentId}));
 after.trash=[...(after.trash||[]),{id:crypto.randomUUID(),deletedAt:new Date().toISOString(),title:Object.values(records).flat().find(record=>record.title)?.title||title,records,links}];
 purgeExpired(after);
}
export function restoreDeleted(data:any,id:string){
 const item:DeletedBundle|undefined=data.trash?.find((item:DeletedBundle)=>item.id===id);if(!item)throw Error('Este registro já foi removido da lixeira.');
 for(const key of collections){for(const record of item.records[key]||[]){if((data[key]||[]).some((current:any)=>(current.id??current.accountId)===(record.id??record.accountId)))throw Error('Já existe um registro com o mesmo identificador.');data[key]??=[];data[key].push(structuredClone(record));}}
 for(const link of item.links){const entry=data.entries.find((entry:any)=>entry.id===link.id);if(entry){if(entry.sectionId&&entry.sectionId!==link.sectionId)throw Error('O lançamento já está associado a outra seção.');Object.assign(entry,link);}}
 data.trash=data.trash.filter((entry:DeletedBundle)=>entry.id!==id);
 // Caller validates the entire transaction, including account references and actual funds.
}
