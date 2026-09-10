'use strict';
const {SAFE_FAILURE_VOICE,artifactFromInternalResult,inspectSurfaceA}=require('./surface_boundary');
const CONTROL_VOICE=Object.freeze({
  ROA_ACCESS_GATE:'Per consultare il materiale di ROA in questa sessione mi serve una sola conferma. Le condizioni d’uso complete sono disponibili nel documento associato. Se le accetti, scrivi esattamente I ACCEPT. Dopo la conferma riprenderò automaticamente la richiesta che mi hai già fatto.',
  RESET:'Ho chiuso questa sessione. Se vorrai tornare al materiale di ROA, ti mostrerò di nuovo le condizioni d’uso.',
  DECLINED:'Va bene. Non consulterò il materiale di ROA in questa sessione.',
  FAILURE:'Non riesco a completare questa richiesta in modo abbastanza affidabile da mostrarti un risultato. Preferisco fermarmi qui invece di nascondere il problema.',
  RESET_REQUIRED:'Il materiale di riferimento è cambiato dall’ultima verifica. Prima di continuare devo riaprire la sessione.',
  SESSION_MISSING:'Non riconosco più questa sessione. Puoi ripartire direttamente dalla richiesta che vuoi fare.'
});
class SemanticChat{
  constructor(config={}){if(config.runtime)this.runtime=config.runtime;else{const{ChatRuntime}=require('./chat_runtime');this.runtime=new ChatRuntime(config);}}
  async askRepository(intent){return this.project(await this.runtime.handleRepoRequest(intent));}
  async handleUserMessage(message){return this.project(await this.runtime.handleUserMessage(message));}
  project(result){
    if(!result||typeof result!=='object')return Object.freeze({voice:SAFE_FAILURE_VOICE,artifact:null});
    if(result.kind==='PASS_THROUGH')return Object.freeze({voice:null,artifact:artifactFromInternalResult(result)});
    const candidate=result.kind==='ANSWER'?result.voice:(CONTROL_VOICE[result.kind]||result.voice);
    const verdict=inspectSurfaceA(candidate);
    if(!verdict.ok){if(this.runtime&&typeof this.runtime.log==='function')this.runtime.log('PUBLIC_SURFACE_REJECTED',{issues:[...verdict.issues]});return Object.freeze({voice:SAFE_FAILURE_VOICE,artifact:artifactFromInternalResult(result)});}
    return Object.freeze({voice:String(candidate),artifact:artifactFromInternalResult(result)});
  }
}
module.exports={SemanticChat,CONTROL_VOICE};
