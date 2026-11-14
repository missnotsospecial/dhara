/* Dhara offline rules parser (Module 4). Reads one message, returns candidate entries. Never saves anything. */
(function(root){
'use strict';
var DEV=/[\u0900-\u097F]/;
function nt(w){
  w=String(w).toLowerCase().normalize('NFC').replace(/[’'`]/g,'');
  w=w.replace(/[\u0966-\u096F]/g,function(c){return String(c.charCodeAt(0)-0x966)});
  if(DEV.test(w))return w.replace(/[\u0901\u093C]/g,'');
  return w.replace(/([a-z])\1+/g,'$1').replace(/ph/g,'f');
}
function set(a){var o={};a.forEach(function(x){o[nt(x)]=1});return o}
var RE=/[\p{L}\p{M}\p{N}'’`]+|[,;.!?\u0964\n]+/gu;
function words(s){return(String(s).match(RE)||[]).filter(function(t){return /[\p{L}\p{N}]/u.test(t)})}

var TIME={};
[['breakfast',['breakfast','bihana','bihan','बिहान']],['lunch',['lunch','diuso','दिउँसो','दिउसो']],
 ['dinner',['dinner','beluka','belukaa','belukai','बेलुका','बेलुकी','raat','rati','राति']],
 ['snack',['snack','snacks','tiffin']]].forEach(function(p){p[1].forEach(function(w){TIME[nt(w)]=p[0]})});
var BREAK=set(['ani','tara','but','then','अनि','तर']);
var NEGPRE=set(['no','not','without','never','nope','dont','didnt','havent','hasnt','wasnt']);
var NEGPOST=set(['chaina','chhaina','thiena','thiyena','hoina','khaina','khayena','khaena','छैन','थिएन','खाएन','होइन']);
var LATE=set(['late','dhilo','dhila','delay','delayed','ढिलो','ढिला']);
var BY=set(['by','for','of']);
var UNITS={};[['day',1],['days',1],['din',1],['dina',1],['दिन',1],['week',7],['weeks',7],['hapta',7],['हप्ता',7]].forEach(function(p){UNITS[nt(p[0])]=p[1]});
var NUMW={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,ek:1,dui:2,tin:3,char:4,panch:5,sat:7,nau:9,das:10};
var SUF=['हरुलाई','हरूलाई','हरुले','हरूले','हरु','हरू','लाई','ले','को','का','मा','सँग','बाट'].map(nt);
var RMARK=set(['khaye','khayo','khayen','bhayo','bhayen','lagyo','lagyen','aaja','aja','ra','ani','pani','thiyo','chha','cha','chhu','ko','ma','din','bihana','diuso','beluka','dherai','ali','mero','mahina','mahinawari','xa','xu','garyo','gare','lagena','dukhyo']);
var ENW=set(['had','the','for','feeling','felt','my','and','is','was','today','with','have','this','very','am','but']);
var CYCLE=[
 ['period_started','Period started',['period started','period start','period began','started my period','got my period','period came','period ayo','period suru','period shuru','mahina bhayo','mahinawari bhayo','mahina ayo','mahinawari ayo','period bhayo','period start bhayo','period suru bhayo','महिनावारी भयो','महिना भयो','पिरियड भयो','महिनावारी सुरु भयो']],
 ['period_ended','Period ended',['period ended','period end','period finished','period over','period sakiyo','period sakyo','mahina sakiyo','mahinawari sakiyo','महिनावारी सकियो','महिना सकियो']],
 ['missed_period','Missed period',['period not started','period not come','period didnt come','period didnt start','period havent come','period hasnt come','period didnt arrive']]
];
var state=null;
function eng(s){return String(s).split(' (')[0].split(' / ')[0]}
function build(v){
  var idx={},max=1;
  function add(term,e){
    var w=words(term).map(nt).filter(Boolean);if(!w.length)return;
    var k=w.join(' ');if(!idx[k])idx[k]=e;if(w.length>max)max=w.length;
  }
  var ents=[];
  v.foods.forEach(function(r){ents.push({r:r,e:{kind:'food',id:r.id,name:eng(r.english),category:r.category==='event'?'note':'food'}})});
  v.symptoms.forEach(function(r){ents.push({r:r,e:{kind:'symptom',id:r.id,name:eng(r.english),category:r.maps_to}})});
  CYCLE.forEach(function(c){c[2].forEach(function(p){add(p,{kind:'rule',id:c[0],name:c[1],category:'cycle'})})});
  ents.forEach(function(x){
    String(x.r.nepali).split(' / ').forEach(function(t){add(t,x.e)});
    add(x.r.romanized,x.e);(x.r.aliases||[]).forEach(function(a){add(a,x.e)});
  });
  ents.forEach(function(x){String(x.r.english).split(' (')[0].split(' / ').forEach(function(t){add(t,x.e)})});
  return{idx:idx,max:Math.min(max,6)};
}
function lookup(t,i,L){
  var k=t.slice(i,i+L).join(' ');if(state.idx[k])return state.idx[k];
  var last=t[i+L-1];
  if(DEV.test(last)){for(var s=0;s<SUF.length;s++){var S=SUF[s];
    if(last.length>S.length&&last.slice(-S.length)===S){var kk=t.slice(i,i+L-1).concat(last.slice(0,-S.length)).join(' ');if(state.idx[kk])return state.idx[kk]}}}
  return null;
}
function num(x){if(/^\d{1,3}$/.test(x))return parseInt(x,10);return NUMW.hasOwnProperty(x)?NUMW[x]:null}
function scanLate(t){
  for(var i=0;i<t.length;i++){
    var n=num(t[i]);
    if(n!=null&&UNITS[t[i+1]]){var j=i+2;if(t[j]==='ko'||t[j]==='को')j++;
      if(LATE[t[j]])return{s:i,e:j,days:n*UNITS[t[i+1]],wk:UNITS[t[i+1]]===7}}
    if(LATE[t[i]]){var k=i+1;if(BY[t[k]])k++;var m=num(t[k]);
      if(m!=null&&UNITS[t[k+1]])return{s:i,e:k+1,days:m*UNITS[t[k+1]],wk:UNITS[t[k+1]]===7}}
  }
  return null;
}
function tokenize(text){
  var out=[],cur=[],m;RE.lastIndex=0;
  function flush(){if(cur.length)out.push(cur);cur=[]}
  while((m=RE.exec(text))){
    var w=m[0];
    if(!/[\p{L}\p{N}]/u.test(w)){flush();continue}
    var n=nt(w);if(BREAK[n]){flush();continue}
    cur.push({raw:w,n:n});
  }
  flush();return out;
}
function language(text){
  var dev=(text.match(/[\u0900-\u097F]/g)||[]).length,lat=(text.match(/[a-zA-Z]/g)||[]).length;
  if(dev&&lat)return'mixed';if(dev)return'nepali';
  var r=0,e=0;words(text).forEach(function(w){var n=nt(w);if(RMARK[n])r++;if(ENW[n])e++});
  if(!r)return'english';if(!e)return'romanized_nepali';return'mixed';
}
function parse(text){
  if(!state)throw new Error('Parser not initialised');
  var entries=[],skipped=[];
  tokenize(text).forEach(function(c){
    var t=c.map(function(x){return x.n}),used=[],i,L;
    var times=[];t.forEach(function(n,p){if(TIME[n])times.push({p:p,type:TIME[n]})});
    function phrase(a,b){return c.slice(a,b+1).map(function(x){return x.raw}).join(' ')}
    var late=scanLate(t),clauseEntries=[];
    if(late){for(i=late.s;i<=late.e;i++)used[i]=1;
      if(late.days>=1&&late.days<=120)clauseEntries.push({category:'cycle',normalized_name:'Period late',vocab_id:'period_late',original_phrase:phrase(late.s,late.e),meal_type:null,days_late:late.days,uncertainties:late.wk?['converted_from_weeks']:[]})}
    for(i=0;i<t.length;i++){
      if(used[i]||TIME[t[i]])continue;
      var hit=null;
      for(L=Math.min(state.max,t.length-i);L>=1&&!hit;L--){
        var clash=false;for(var q=i;q<i+L;q++)if(used[q])clash=true;if(clash)continue;
        var e=lookup(t,i,L);if(e){hit={e:e,s:i,end:i+L-1}}
      }
      if(!hit)continue;
      for(var u=hit.s;u<=hit.end;u++)used[u]=1;
      var neg=false,a;
      for(a=Math.max(0,hit.s-3);a<hit.s;a++)if(NEGPRE[t[a]])neg=true;
      for(a=hit.end+1;a<=Math.min(t.length-1,hit.end+3);a++)if(NEGPOST[t[a]])neg=true;
      var en=hit.e,ph=phrase(hit.s,hit.end);
      if(neg){skipped.push({normalized_name:en.name,original_phrase:ph});i=hit.end;continue}
      var ent={category:en.category,normalized_name:en.name,vocab_id:en.id,original_phrase:ph,meal_type:null,days_late:null,uncertainties:[]};
      if(en.kind==='food'&&en.category==='food'){
        ent.uncertainties.push('portion_not_stated');
        var best=null;times.forEach(function(x){var d=Math.abs(x.p-hit.s);if(!best||d<best.d)best={d:d,type:x.type}});
        if(best)ent.meal_type=best.type;else ent.uncertainties.push('meal_type_not_stated');
      }else if(['symptom','mood','anxiety','energy','sleep'].indexOf(en.category)>=0)ent.uncertainties.push('intensity_not_stated');
      else if(en.id==='period_started'||en.id==='period_ended'||en.id==='missed_period')ent.uncertainties.push('date_not_stated');
      else if(en.id==='period_late')ent.uncertainties.push('days_late_not_stated');
      clauseEntries.push(ent);i=hit.end;
    }
    if(late&&late.days>=1&&late.days<=120)clauseEntries=clauseEntries.filter(function(x){return!(x.vocab_id==='period_late'&&x.days_late==null)});
    clauseEntries.forEach(function(x){entries.push(x)});
  });
  var seen={};entries=entries.filter(function(x){var k=x.vocab_id+'|'+x.meal_type+'|'+x.days_late;if(seen[k])return false;seen[k]=1;return true});
  return{schema_version:'1.1',message_language:language(text),source_layer:'offline_rules',entries:entries,skipped:skipped,requires_confirmation:true};
}
var P={init:function(v){state=build(v)},parse:parse};
if(typeof module!=='undefined'&&module.exports)module.exports=P;else root.Parser=P;
})(typeof window!=='undefined'?window:this);
