import { useState } from 'react';
import { platformLogos } from './logos';
import { resizeIcon } from '../../lib/image-resize';
export function platformIcon(name: string, settings: any = {}) {
  const key = /ifood/i.test(name) ? 'ifood' : /99/.test(name) ? '99food' : /keeta/i.test(name) ? 'keeta' : /uber/i.test(name) ? 'uber' : /indrive/i.test(name) ? 'indrive' : '';
  return settings[name]?.icon || platformLogos[key] || '';
}
export function PlatformPicker({names, settings}: {names: string[]; settings: any}) {
  const [selected, setSelected] = useState(names[0] || '');
  return <fieldset className="platform-picker"><legend>Plataforma</legend><input type="hidden" name="platform" value={selected}/><div className="platform-picker-grid">{names.map(name => {
    const icon = platformIcon(name, settings);
    return <label key={name} className="platform-picker-option" data-selected={selected === name}><input type="radio" name="platform-choice" value={name} checked={selected === name} onChange={()=>setSelected(name)} required/>{icon ? <img src={icon} alt=""/> : <span aria-hidden="true">{name.slice(0,2)}</span>}<span>{name}</span></label>;
  })}</div></fieldset>;
}
export function PlatformIconField() {
  const [icon,setIcon]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
  return <div className="field"><label>Ícone da plataforma (opcional)<input type="file" accept="image/png,image/jpeg,image/webp" onChange={async event=>{const file=event.target.files?.[0];if(!file)return;setBusy(true);setError('');try{setIcon(await resizeIcon(file));}catch(error){setError((error as Error).message);}finally{setBusy(false);}}}/></label><input name="platformIcon" type="hidden" value={icon}/>{icon&&<img src={icon} alt="Prévia do ícone da plataforma" width="56" height="56" style={{objectFit:'contain'}}/>}<small>A imagem inteira é ajustada ao padrão de 256 × 256 pixels.</small>{busy&&<span role="status">Ajustando imagem…</span>}{error&&<span role="alert">{error}</span>}{busy&&<input type="text" required value="" readOnly aria-label="Aguarde o processamento do ícone" style={{position:'absolute',opacity:0,width:1,height:1}}/>}</div>;
}
