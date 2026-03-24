#!/usr/bin/env node
// fix_remaining_low_degree.js — boost the last 6 low-degree nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const pse = JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json')));

const meIds = new Set(me.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const pseIds = new Set(pse.map(e=>e.id));

// mechanism edges for low-degree nodes
const newMechEdges = [
  // environmental_degradation
  { id: 'environmental_degradation__climate_change_policy',
    source: 'environmental_degradation', target: 'climate_change_policy', type: 'ENABLED',
    label: 'Environmental degradation from fossil fuel extraction is both a cause and consequence of climate change\'s policy failure',
    note: 'Environmental degradation and climate change are causally intertwined: fossil fuel extraction causes localized environmental degradation (mountaintop removal, pipeline spills, fracking contamination) while also producing the greenhouse gases causing global environmental degradation through climate change; deforestation (for agriculture and logging) degrades local ecosystems while eliminating carbon sinks; industrial agriculture produces soil degradation while emitting methane. Climate change policy is simultaneously climate and environmental policy — carbon pricing and clean energy transition would reduce both climate emissions and the extraction-driven environmental degradation that produces them.',
    confidence: 'high' },
  { id: 'environmental_degradation__resource_curse',
    source: 'environmental_degradation', target: 'resource_curse', type: 'ENABLED',
    label: 'Environmental degradation is both a product and reinforcement of resource curse dynamics',
    note: 'Environmental degradation and resource curse are mutually reinforcing: resource extraction produces environmental degradation (oil spills, mining waste, deforestation); environmental degradation destroys the agricultural and fishing livelihoods of communities around extraction zones, making them dependent on extraction revenue; this economic dependency increases resource curse vulnerability; local communities damaged by environmental degradation lack political power to demand accountability because they are economically dependent on the extraction industry. The Niger Delta is the paradigm case: Shell\'s oil extraction destroyed fishing and farming livelihoods, producing economic dependency on oil revenue that made communities complicit in the extraction that was destroying their environment.',
    confidence: 'high' },

  // war_of_worlds_broadcast
  { id: 'war_of_worlds_broadcast__manufactured_consent',
    source: 'war_of_worlds_broadcast', target: 'manufactured_consent', type: 'SHARES_MECHANISM_WITH',
    label: 'The War of the Worlds panic demonstrated media\'s power to shape reality perception — the same capability manufactured consent exploits',
    note: 'The 1938 War of the Worlds broadcast (Orson Welles\' radio drama producing reported panic) has a complex relationship with manufactured consent: the panic is often exaggerated in popular memory (most listeners did not panic), but the episode demonstrated radio\'s capacity to make fictional scenarios feel real; media scholars use it to study the "direct effects" model of media influence. Manufactured consent does not require panic-level manipulation — it operates through routine, institutionalized distortion rather than dramatic deception. But the War of the Worlds episode established the intellectual framework (mass media can directly shape public reality perception) that media manipulation theory has built on since.',
    confidence: 'medium' },
  { id: 'war_of_worlds_broadcast__social_media_algorithms',
    source: 'war_of_worlds_broadcast', target: 'social_media_algorithms', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent the same core mechanism: information systems presenting fiction as reality, with audiences lacking context to distinguish them',
    note: 'The War of the Worlds broadcast and social media misinformation share the core mechanism: audiences receiving information without sufficient context to identify its fictional or fabricated nature. Radio listeners in 1938 tuning in mid-broadcast missed the framing announcement; social media users encounter content without understanding its source, production context, or propagation pathway. The difference is scale and intent: the 1938 broadcast was accidental in its effects; social media misinformation is often deliberately designed to remove context markers that would enable identification as fabricated. Both demonstrate the "context dependency" of media effect — the same content produces radically different understanding depending on what framing information the audience has.',
    confidence: 'medium' },

  // legal_mobilization
  { id: 'legal_mobilization__labor_movement',
    source: 'legal_mobilization', target: 'labor_movement', type: 'ENABLED',
    label: 'Legal mobilization of the NLRA (Wagner Act) transformed labor\'s legal rights from informal to formally enforceable collective bargaining rights',
    note: 'Legal mobilization was essential to labor movement success: the National Labor Relations Act (Wagner Act, 1935) gave workers the legal right to organize and collectively bargain; the NLRB (National Labor Relations Board) provided administrative enforcement; the Supreme Court\'s Jones & Laughlin (1937) upholding of the NLRA gave legal permanence to labor rights. Before the NLRA, labor rights depended on economic power alone — employers could fire organizers legally. After the NLRA, labor had legal mobilization tools: unfair labor practice charges, protected organizing activity, enforced elections. The AFL-CIO\'s subsequent power was substantially based on legal mobilization — using the law courts and NLRB rather than only strikes.',
    confidence: 'high' },

  // stanley_milgram
  { id: 'stanley_milgram__nuremberg_trials',
    source: 'stanley_milgram', target: 'nuremberg_trials', type: 'ENABLED',
    label: 'Milgram\'s obedience experiments were explicitly designed to understand how ordinary Germans obeyed orders to commit Holocaust atrocities',
    note: 'The Milgram experiments were explicitly motivated by the Nuremberg question: Milgram designed the experiments in 1960-1963 during Adolf Eichmann\'s trial in Jerusalem (1961); Hannah Arendt\'s "Eichmann in Jerusalem" (1963) developed the "banality of evil" concept to explain how bureaucratic obedience enabled genocide; Milgram\'s experiments provided empirical evidence that Arendt\'s insight was generalizable — it was not that Germans were especially obedient, but that ordinary people in authority structures were systematically likely to obey commands to harm others regardless of nationality. Milgram intended his research as a systematic empirical answer to the Nuremberg question: how did ordinary people do this?',
    confidence: 'high' },
  { id: 'stanley_milgram__abu_ghraib',
    source: 'stanley_milgram', target: 'abu_ghraib', type: 'ENABLED',
    label: 'Abu Ghraib was the most prominent real-world test case for Milgram\'s findings about authority structure and obedience to torture',
    note: 'Abu Ghraib confirmed Milgram\'s predictions: the soldiers who tortured detainees were ordinary Americans from normal backgrounds, not sadists; they were operating under an institutional authority structure (chain of command, legal "torture memos," institutional normalization); Philip Zimbardo (Stanford Prison Experiment) analyzed Abu Ghraib systematically in "The Lucifer Effect" (2007), demonstrating how situational factors overrode individual moral judgment; investigators found no evidence that abuse was caused by individual pathology — it was institutional. The Abu Ghraib analysis and Milgram/Zimbardo research converge on the same conclusion: ordinary people in institutional authority structures systematically harm others when commanded to, regardless of individual morality.',
    confidence: 'high' },
];

// history edges for low-degree nodes
const newHistEdges = [
  // tulsa_race_massacre
  { id: 'tulsa_race_massacre__historical_revisionism',
    source: 'tulsa_race_massacre', target: 'historical_revisionism', type: 'ENABLED',
    label: 'Tulsa Race Massacre was suppressed from Oklahoma history for 80 years — a deliberate historical revisionism by institutions that participated in or enabled it',
    note: 'Tulsa Race Massacre suppression was organized and deliberate: Tulsa newspapers self-censored for decades; Oklahoma state history curricula excluded the massacre; city and state officials who had participated in or enabled the massacre had institutional interests in suppression; the National Guard records were sealed; the American Red Cross disaster response records minimized the extent. The massacre was virtually absent from public historical memory until the 1996 Oklahoma Commission on the Tulsa Race Riot began official documentation. The 80-year suppression demonstrates how historical revisionism operates in democratic societies — not through overt censorship but through institutional self-interest, curricula design, and the power of those who benefited from erasure to shape what is remembered.',
    confidence: 'high' },
  { id: 'tulsa_race_massacre__dehumanization',
    source: 'tulsa_race_massacre', target: 'dehumanization', type: 'ENABLED',
    label: 'The Tulsa massacre\'s targeting of Black economic success demonstrates dehumanization directed specifically at Black prosperity',
    note: 'The Tulsa massacre demonstrates dehumanization directed at Black economic achievement: Greenwood was targeted specifically because Black prosperity — the Black Wall Street of thriving businesses, professional class, and economic independence — violated the racial hierarchy that required Black inferiority. The dehumanization of successful Black Americans required particular ideological work: the "uppity" characterization, the accusations of assault (the immediate trigger), and the coordinated mob violence reflected anger at Black success that threatened white psychological investment in racial hierarchy. This "dehumanization of success" mechanism — violently punishing Black achievement — also appears in the 1898 Wilmington coup, the destruction of Rosewood (1923), and the pattern of economic retaliation against NAACP chapters.',
    confidence: 'high' },

  // harlem_renaissance
  { id: 'harlem_renaissance__civil_rights_movement',
    source: 'harlem_renaissance', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'The Harlem Renaissance developed Black political thought, cultural confidence, and organizational infrastructure that the Civil Rights Movement built on',
    note: 'The Harlem Renaissance was the intellectual incubator of civil rights: W.E.B. Du Bois (Crisis magazine) developed Black political theory and NAACP strategy from Harlem; the "New Negro" cultural movement asserted Black dignity and equality that civil rights demanded politically; Marcus Garvey\'s UNIA (Black nationalism, Harlem-based) articulated the alternative tradition; Langston Hughes and other Renaissance writers documented and affirmed Black experience that Jim Crow tried to erase. The Civil Rights Movement\'s intellectual confidence — the ability to argue comprehensively for Black equality — was built on the cultural and intellectual work the Renaissance had done. The movement\'s leaders (King, Lewis, Marshall) were educated in institutions the Renaissance had strengthened.',
    confidence: 'high' },
  { id: 'harlem_renaissance__cultural_hegemony',
    source: 'harlem_renaissance', target: 'cultural_hegemony', type: 'DISCREDITED',
    label: 'The Harlem Renaissance challenged cultural hegemony by producing a thriving Black artistic tradition that claimed equal value with Euro-American culture',
    note: 'The Harlem Renaissance was a direct challenge to cultural hegemony: Euro-American cultural hegemony framed Black culture as derivative, inferior, or absent; the Renaissance produced poetry, literature, jazz, and visual art that demonstrated Black cultural creativity and richness; Langston Hughes\'s "I, Too, Sing America" (1945) directly challenged cultural exclusion; the Renaissance forced white Americans to encounter Black culture on its own terms. The challenge was partial — the Renaissance produced some integration into mainstream cultural institutions while also being celebrated in ways that commodified Black culture for white audiences (Harlem nightclubs catering to white tourists). Cultural hegemony can partially accommodate challenges by assimilating them, which is distinct from being discredited by them.',
    confidence: 'high' },
];

// Write files
let meAdded=0, heAdded=0;
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); meAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); heAdded++; } });

fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));

console.log('Mechanism edges: +'+meAdded+' -> '+me.length);
console.log('History edges: +'+heAdded+' -> '+he.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source, 'edge:', e.id); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target, 'edge:', e.id); orphans++; }
  });
});
console.log('Total orphans:', orphans);

// Degree check
const degrees={};
allIds.forEach(id=>degrees[id]=0);
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s=>{
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e=>{
    if(degrees[e.source]!==undefined) degrees[e.source]++;
    if(degrees[e.target]!==undefined) degrees[e.target]++;
  });
});
const lonely=Object.entries(degrees).filter(([,d])=>d<=2).map(([id,d])=>id+':'+d);
console.log('Remaining nodes with degree<=2 ('+lonely.length+'):', lonely.join(', '));
