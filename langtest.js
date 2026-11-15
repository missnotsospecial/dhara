/* Dhara language test set (Module 10). Messages were written by the team from the vocabulary, so scores
   are optimistic. exp tuples: [key, meal|null, daysLate|null, loose?]. */
(function(root){
var T=[],id=0;
function t(g,text,exp){T.push({id:++id,g:g,text:text,exp:exp.map(function(e){return{k:e[0],meal:e[1]||null,days:e[2]||null,loose:!!e[3]}})})}
// English
t('english','had momo for lunch, feeling anxious, period is 5 days late',[['momo','lunch'],['anxiety'],['period_late',null,5]]);
t('english','Dal bhat and gundruk for dinner, felt bloated',[['dal_bhat','dinner'],['gundruk','dinner'],['bloating']]);
t('english','I have bad cramps and a headache today',[['cramps'],['headache']]);
t('english','Had chowmein for lunch and then felt very tired',[['chowmein','lunch'],['fatigue']]);
t('english','No cramps today but my acne is bad',[['acne']]);
t('english','My period started this morning',[['period_started']]);
t('english','Period ended yesterday',[['period_ended']]);
t('english','Slept badly last night, poor sleep and feeling low',[['poor_sleep'],['low_mood']]);
t('english','Breakfast was sel roti and tea, then a samosa for snack',[['sel_roti','breakfast'],['chiya','breakfast'],['samosa','snack']]);
t('english','I am stressed and my hair fall is getting worse',[['stress'],['hair_thinning']]);
t('english','2 weeks late and feeling nauseous',[['period_late',null,14],['nausea']]);
t('english','Ate a lot of chocolate and cake, sugar cravings',[['chocolate'],['cake'],['cravings']]);
t('english','Feeling happy today, slept well',[['happy'],['slept_well']]);
t('english','my period hasn\u2019t come and I feel dizzy',[['missed_period'],['dizziness']]);
t('english','Fasting today for Teej, had only fruit in the evening',[['fasting'],['fruit']]);
// Nepali
t('nepali','आज दिउँसो मोमो खाएँ र चिन्ता भयो',[['momo','lunch'],['anxiety']]);
t('nepali','बिहान चिया र रोटी खाएँ',[['chiya','breakfast'],['roti','breakfast']]);
t('nepali','बेलुका दाल भात र गुन्द्रुक खाएँ, पेट फुल्यो',[['dal_bhat','dinner'],['gundruk','dinner'],['bloating']]);
t('nepali','आज पेट दुख्यो र टाउको दुख्यो',[['cramps'],['headache']]);
t('nepali','महिनावारी ५ दिन ढिलो छ',[['period_late',null,5]]);
t('nepali','आज महिनावारी भयो',[['period_started']]);
t('nepali','थकाइ लाग्यो र निद्रा लागेन',[['fatigue'],['poor_sleep']]);
t('nepali','दिउँसो चाउमिन खाएँ',[['chowmein','lunch']]);
t('nepali','मन उदास भयो तर चिन्ता छैन',[['low_mood']]);
t('nepali','बिहान सेल रोटी र चिया खाएँ, समोसा पनि खाएँ',[['sel_roti','breakfast'],['chiya','breakfast'],['samosa']]);
t('nepali','रिस उठ्यो र तनाव भयो',[['irritability'],['stress']]);
t('nepali','महिनावारी भएन र रिँगटा लाग्यो',[['missed_period'],['dizziness']]);
t('nepali','आज राम्रो महसुस भयो',[['happy']]);
t('nepali','दही र फलफूल खाएँ',[['dahi'],['fruit']]);
t('nepali','तेलीय छाला र डन्डीफोर छ',[['oily_skin'],['acne']]);
// Romanized Nepali
t('romanized','aaja bihana chiya ra roti khaye, dinbhari tired feel bhayo ani ali anxiety pani thiyo',[['chiya','breakfast'],['roti','breakfast'],['fatigue'],['anxiety']]);
t('romanized','diuso momo khaye ra pet dukhyo',[['momo','lunch'],['cramps']]);
t('romanized','beluka dal bhat ra gundruk khaye',[['dal_bhat','dinner'],['gundruk','dinner']]);
t('romanized','mahina 5 din late bhayo',[['period_late',null,5]]);
t('romanized','aaja mahina bhayo',[['period_started']]);
t('romanized','mahina aayena, chinta lagyo',[['missed_period'],['anxiety']]);
t('romanized','pet fulyo ra tauko dukhyo',[['bloating'],['headache']]);
t('romanized','nidra lagena, thakai lagyo',[['poor_sleep'],['fatigue']]);
t('romanized','cramps chaina, tara tauko dukhyo',[['headache']]);
t('romanized','sel roti ra chiya bihana khaye, samosa pani khaye',[['sel_roti','breakfast'],['chiya','breakfast'],['samosa']]);
t('romanized','ris uthyo ra tension lagyo',[['irritability'],['stress']]);
t('romanized','momo khaina, dal bhat khaye',[['dal_bhat']]);
t('romanized','kapal jharyo ra dandiphor pani aayo',[['hair_thinning'],['acne']]);
t('romanized','aaja ramro lagyo, khushi',[['happy']]);
t('romanized','belukaa lassi ra chatpate khaye, khane man lagyo',[['lassi','dinner'],['chatpate','dinner'],['cravings']]);
// Unlisted foods (not in the vocabulary on purpose)
t('unlisted','had masala dosa for lunch',[['dosa','lunch',null,true]]);
t('unlisted','had kwati for dinner and felt tired',[['kwanti|kwati','dinner',null,true],['fatigue']]);
t('unlisted','bihana gwaramari khaye',[['gwaramari','breakfast',null,true]]);
t('unlisted','diuso idli ra chiya khaye',[['idli','lunch',null,true],['chiya','lunch']]);
t('unlisted','आज दिउँसो क्वाँटी खाएँ',[['kwanti|kwati','lunch',null,true]]);
t('unlisted','बिहान डोसा र चिया खाएँ',[['dosa','breakfast',null,true],['chiya','breakfast']]);
function keyOf(e){return e.vocab_id||String(e.normalized_name||'').toLowerCase()}
function score(results){
  var G={};
  results.forEach(function(r){
    var g=G[r.t.g]||(G[r.t.g]={n:0,err:0,tp:0,fp:0,fn:0,mN:0,mOk:0,dN:0,dOk:0,ok:0,miss:[]});
    if(!r.entries){g.err++;return}
    g.n++;var used=[],missing=[],mOkAll=true;
    r.t.exp.forEach(function(x){
      var hit=-1;
      var alts=x.k.split('|');
      r.entries.forEach(function(e,i){if(hit>=0||used[i])return;var k=keyOf(e),ph=String(e.original_phrase||'').toLowerCase();
        alts.forEach(function(a){if(k===a||(x.loose&&(k.indexOf(a)>=0||ph.indexOf(a)>=0)))hit=hit>=0?hit:i})});
      if(hit<0){g.fn++;missing.push(x.k);return}
      used[hit]=1;g.tp++;var e=r.entries[hit];
      if(x.meal){g.mN++;if(e.meal_type===x.meal)g.mOk++;else mOkAll=false}
      if(x.days){g.dN++;if(e.days_late===x.days)g.dOk++;else mOkAll=false}
    });
    var extra=r.entries.filter(function(e,i){return!used[i]}).map(keyOf);g.fp+=extra.length;
    if(!missing.length&&!extra.length&&mOkAll)g.ok++;else g.miss.push({text:r.t.text,missing:missing,extra:extra});
  });
  return G;
}
var API={tests:T,score:score};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.LANGTEST=API;
})(typeof window!=='undefined'?window:this);
