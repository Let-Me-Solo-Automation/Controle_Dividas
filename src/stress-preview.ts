/** Synthetic, deterministic fixtures used exclusively by the isolated visual preview. */
export function populateVisualPreview(data: any) {
 for (const account of data.accounts) account.initial=50000000;
 const day=(offset:number)=>{const date=new Date();date.setDate(date.getDate()+offset);return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;};
 for(let i=0;i<400;i++) data.entries.push({id:`stress-entry-${i}`,title:`${i%3?'Despesa':'Receita'} de exemplo ${i+1}${i%7===0?' · descrição longa para conferir a quebra de texto e alinhamento':''}`,type:i%3?'expense':'income',amount:1000+(i*379)%98000,date:day(-(i%120)),accountId:data.accounts[i%data.accounts.length].id,category:['Casa','Transporte','Trabalho','Saúde'][i%4]});
 const section=data.sections[0];
 for(let i=0;i<24;i++) data.sections.push({...structuredClone(section),id:`stress-section-${i}`,title:`Acordo de exemplo ${i+1}`,kind:i%2?'pay':'receive',payments:[],pinned:i<3});
 const goal=data.goals[0];
 for(let i=0;i<24;i++)data.goals.push({...structuredClone(goal),id:`stress-goal-${i}`,title:`Objetivo de exemplo ${i+1}`,target:100000,pinned:false,due:day(i*5-20),statusLabel:'Em andamento',contributions:[{id:`stress-contribution-${i}`,accountId:data.accounts[0].id,amount:(i%11)*10000,date:day(-i)}]});
 return data;
}
