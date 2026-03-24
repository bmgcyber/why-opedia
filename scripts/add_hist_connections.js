#!/usr/bin/env node
// add_hist_connections.js — fills gaps in history scope connectivity
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addEdges(f, ee) {
  const ex=JSON.parse(fs.readFileSync(f)); const ids=new Set(ex.map(e=>e.id)); let a=0;
  for(const e of ee) if(!ids.has(e.id)){ex.push(e);ids.add(e.id);a++;}
  if(a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'edges: +'+a);
}

// ── History: local edges between existing nodes ────────────────────────────────
addEdges(D('data/global/history/edges.json'), [
  // Philosophy lineages
  { id: 'stoicism__epicureanism',
    source: 'stoicism', target: 'epicureanism', type: 'SHARES_MECHANISM_WITH',
    label: 'Stoicism and Epicureanism are parallel Hellenistic responses to the same existential questions',
    note: 'Stoicism (founded by Zeno, c. 300 BCE) and Epicureanism (Epicurus, c. 307 BCE) are parallel Hellenistic philosophical schools addressing the same questions (How do we achieve well-being in an uncertain world?) with contrasting answers: Stoics locate good in virtue and rational control; Epicureans locate it in pleasure (ataraxia — freedom from disturbance). Both reject Platonic metaphysics and Aristotelian teleology, focusing on practical ethics for non-philosophical citizens.',
    confidence: 'high' },
  { id: 'hellenistic_philosophy__stoicism',
    source: 'hellenistic_philosophy', target: 'stoicism', type: 'ENABLED',
    label: 'Stoicism was the dominant practical philosophy of the Hellenistic world',
    note: 'Stoicism was the defining philosophy of the Hellenistic period: Stoic ideas spread with Alexander\'s successors, became the philosophy of Roman administrators (Cicero, Marcus Aurelius, Seneca), and provided the conceptual framework for natural law theory that influenced both Roman law and Christian theology. The Hellenistic synthesis of Greek philosophy with multicultural cosmopolitanism found its best expression in Stoic cosmopolitanism.',
    confidence: 'high' },
  { id: 'protestant_reformation__enlightenment_philosophy',
    source: 'protestant_reformation', target: 'enlightenment_philosophy', type: 'ENABLED',
    label: 'The Reformation\'s sola scriptura created the individual interpretive authority the Enlightenment secularized',
    note: 'The Protestant Reformation\'s sola scriptura — every individual reading the Bible directly, without priestly mediation — established the principle of individual interpretive authority that the Enlightenment secularized into individual reason. Luther\'s insistence that the individual conscience trumps institutional authority (Church or Pope) is structurally the same claim Kant makes about individual reason. The Reformation created the epistemological subject the Enlightenment theorized.',
    confidence: 'high' },
  { id: 'existentialism__postmodernism_philosophy',
    source: 'existentialism', target: 'postmodernism_philosophy', type: 'ENABLED',
    label: 'Postmodernism grew from existentialism\'s critique of universal meaning',
    note: 'Postmodernism extends existentialism\'s core move: if existentialism (Sartre, Heidegger, Camus) argues that there is no essential human nature or predetermined meaning, postmodernism (Foucault, Derrida, Lyotard) extends this to argue that all "grand narratives" — including Marxism, liberal progress, scientific truth — are constructed power arrangements rather than universal truths. Postmodernism is existentialism\'s radical epistemological development.',
    confidence: 'high' },
  { id: 'scholasticism__existentialism',
    source: 'scholasticism', target: 'existentialism', type: 'ENABLED',
    label: 'Existentialism emerged as a revolt against scholasticism\'s rationalist theological system',
    note: 'Existentialism (Kierkegaard, Nietzsche, then Heidegger, Sartre) emerged partly as a revolt against the Scholastic rationalist system: the attempt to comprehend existence through logical categories (God, essence, universal) and deduce particular existence from universal principles. Kierkegaard\'s "leap of faith" and Nietzsche\'s rejection of Christian morality are direct responses to the Hegelian synthesis of Scholastic and Enlightenment rationalism.',
    confidence: 'medium' },

  // Person connections
  { id: 'laozi__taoism',
    source: 'laozi', target: 'taoism', type: 'PRODUCED',
    label: 'Laozi\'s Tao Te Ching is the foundational text of Taoism',
    note: 'The Tao Te Ching (attributed to Laozi, c. 6th-4th century BCE) is the foundational text of both philosophical Taoism (Tao chia) and later religious Taoism (Tao chiao). The 81 chapters establishing wu wei, the Tao, and the sage ruler became the canonical text that subsequent Taoist traditions interpreted, commented upon, and transformed. Laozi → Taoism is the paradigm case of a single text generating a multi-millennial religious-philosophical tradition.',
    confidence: 'high' },
  { id: 'pol_pot__khmer_rouge_genocide',
    source: 'pol_pot', target: 'khmer_rouge_genocide', type: 'CAUSED',
    label: 'Pol Pot led the Khmer Rouge and personally directed the Cambodian genocide',
    note: 'Pol Pot (Saloth Sar) led Democratic Kampuchea (1975–79) and directly oversaw the Khmer Rouge genocide: the evacuation of cities, abolition of money and private property, forced labor camps, and systematic killing of intellectuals, ethnic minorities, and perceived enemies. The killing fields killed approximately 1.5–2 million people (20–25% of Cambodia\'s population). Pol Pot\'s ideology combined French Marxism, Maoist agrarianism, and Khmer ultranationalism.',
    confidence: 'high' },
  { id: 'pol_pot__mao_zedong',
    source: 'pol_pot', target: 'mao_zedong', type: 'ENABLED',
    label: 'Pol Pot modeled Khmer Rouge ideology explicitly on Maoist peasant revolution',
    note: 'Pol Pot explicitly modeled the Khmer Rouge on Maoist principles: peasant revolution against urban elites, the mass line, agrarian collectivization, and continuous revolution against class enemies. The Khmer Rouge\'s radical agrarianism (Year Zero, abolition of cities) can be read as Maoism taken to its logical extreme — a peasant revolution that categorically rejected urban modernity. The Chinese Cultural Revolution provided direct inspiration.',
    confidence: 'high' },
  { id: 'theodor_herzl__founding_of_israel',
    source: 'theodor_herzl', target: 'founding_of_israel', type: 'ENABLED',
    label: 'Herzl\'s Der Judenstaat (1896) established the Zionist program that produced the State of Israel',
    note: 'Theodor Herzl\'s "The Jewish State" (1896) and the subsequent Zionist Congress (1897) established the political program that produced the State of Israel 51 years later: a Jewish national homeland in Palestine, established through legal immigration and negotiation with great powers. Herzl died before the state existed, but his organizational infrastructure (World Zionist Organization), political lobbying (Balfour Declaration), and ideological framing (nation = homeland = solution to antisemitism) directly produced the state.',
    confidence: 'high' },
  { id: 'cleopatra__roman_empire',
    source: 'cleopatra', target: 'roman_empire', type: 'ENABLED',
    label: 'Cleopatra\'s alliance and conflict with Rome produced Octavian\'s Mediterranean hegemony',
    note: 'Cleopatra\'s political strategy — alliance with Caesar (47 BCE), then Mark Antony (41 BCE) — was an attempt to preserve Egyptian sovereignty by leveraging Roman factional conflict. Her failure (Octavian\'s defeat of Antony and Cleopatra at Actium, 31 BCE) produced Octavian\'s unchallenged supremacy and the transformation of the Roman Republic into the Roman Empire. Egypt\'s annexation was the final piece of Roman Mediterranean hegemony.',
    confidence: 'high' },
  { id: 'hirohito__atomic_bombing_hiroshima',
    source: 'hirohito', target: 'atomic_bombing_hiroshima', type: 'ENABLED',
    label: 'Hirohito\'s refusal to surrender before August 1945 made the atomic bombing politically viable',
    note: 'Hirohito\'s role in the lead-up to the atomic bombing is contested but significant: the Emperor approved continuing the war in 1945 despite clear evidence of Japanese military defeat. His post-bombing "Sacred Decision" to surrender was the same moral agency he could have exercised earlier. The question of whether the atomic bombing was necessary is inseparable from the question of why Japan did not surrender before August — which requires understanding Hirohito\'s constraints and choices.',
    confidence: 'medium' },

  // Pre-Socratic / Epicureanism additional connections
  { id: 'pre_socratic_philosophy__stoicism',
    source: 'pre_socratic_philosophy', target: 'stoicism', type: 'ENABLED',
    label: 'Stoic physics was directly built on Pre-Socratic natural philosophy (Heraclitus especially)',
    note: 'Stoic physics is built on Heraclitean foundations: the Stoic logos (rational principle immanent in all matter) is a direct development of Heraclitus\'s fire-logos. Stoic cosmology (pneuma, the rational fiery breath pervading the cosmos) derives from pre-Socratic natural philosophy. The Stoics are thus the heirs of pre-Socratic physics who combined it with Socratic ethics — a synthesis that made Stoicism the dominant philosophy of the Greek-Roman world.',
    confidence: 'high' },
  { id: 'epicureanism__liberation_theology',
    source: 'epicureanism', target: 'liberation_theology', type: 'SHARES_MECHANISM_WITH',
    label: 'Epicureanism and Liberation Theology share the critique of suffering as spiritually valuable',
    note: 'Epicurus and liberation theologians share a fundamental claim: unnecessary suffering is not spiritually valuable and should be reduced. Epicurus argued that the gods were not interested in human suffering and that eliminating fear (of death, of gods, of poverty) was the path to happiness. Liberation theology argues that God\'s "preferential option for the poor" means that material poverty is not God\'s will but injustice to be fought. Both traditions resist the sacralization of avoidable suffering.',
    confidence: 'medium' },

  // Gothic architecture
  { id: 'gothic_architecture__christian_sacred_art',
    source: 'gothic_architecture', target: 'christian_sacred_art', type: 'ENABLED',
    label: 'Gothic architecture was the spatial integration of all Christian sacred art forms',
    note: 'Gothic cathedrals are the total integration of Christian sacred art: sculpture, stained glass, goldsmithing, illuminated manuscripts, and music (liturgy, polyphony) all found their context and greatest expression in the Gothic cathedral program. Gothic architecture is not simply a building style but a comprehensive aesthetic theology — the cathedral as a model of the New Jerusalem, where all sacred arts converged.',
    confidence: 'high' },
]);

// ── Mechanism edges for new connections ────────────────────────────────────────
const me=JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds=new Set(me.map(e=>e.id));

const mechBatch = [
  { id: 'hegelian_dialectic__existentialism',
    source: 'hegelian_dialectic', target: 'existentialism', type: 'ENABLED',
    label: 'Existentialism emerged as the post-Hegelian revolt against rational systematization',
    note: 'Kierkegaard (the "father of existentialism") explicitly argued against Hegel\'s dialectical system: the existing individual — with concrete suffering, anxiety, and choice — is irreducible to any rational system. Nietzsche\'s critique of Enlightenment rationality continued the anti-Hegelian trajectory. Heidegger\'s Being and Time can be read as the attempt to ask the existential question Hegel\'s system overlooked: what is it to exist at all?',
    confidence: 'high' },

  { id: 'hegelian_dialectic__postmodernism_philosophy',
    source: 'hegelian_dialectic', target: 'postmodernism_philosophy', type: 'ENABLED',
    label: 'Postmodernism\'s critique of grand narratives is a radicalization of Hegelian historical consciousness',
    note: 'Hegel\'s historical consciousness — all truth is historically situated, all thought reflects its era\'s contradictions — was radicalized by postmodernism into the claim that no historical consciousness can escape its own situatedness to reach universal truth. The Frankfurt School (Horkheimer, Adorno) was the mediating figure: they applied Hegelian dialectic to Enlightenment itself, finding that enlightenment produces its opposite (mythology, domination). Postmodernism generalized this to all grand narratives.',
    confidence: 'high' },

  { id: 'social_contract_theory__enlightenment_philosophy',
    source: 'social_contract_theory', target: 'enlightenment_philosophy', type: 'ENABLED',
    label: 'Social contract theory is the political application of Enlightenment individual rationality',
    note: 'Enlightenment political philosophy (Locke, Rousseau, Kant) applied the core Enlightenment claim — rational individuals as the primary moral and political unit — to the question of legitimate authority: governments derive legitimacy from the rational consent of individuals (Locke), the general will of citizens (Rousseau), or universal rational law (Kant). Social contract theory is Enlightenment epistemology applied to politics.',
    confidence: 'high' },

  { id: 'dehumanization__khmer_rouge_genocide',
    source: 'dehumanization', target: 'khmer_rouge_genocide', type: 'CAUSED',
    label: 'Khmer Rouge dehumanization of "old people" and "enemies" enabled the genocide',
    note: 'The Khmer Rouge genocide required systematic dehumanization: "old people" (pre-revolutionary society) were corrupted, intellectuals were tainted (the "four-eyes" purge of anyone wearing glasses), ethnic Vietnamese and Chinese were racial enemies, and "new people" (urban evacuees) were suspect by definition. The Year Zero ideology made everyone outside the peasant revolutionary vanguard effectively subhuman — eliminating their moral standing and making killing morally acceptable.',
    confidence: 'high' },

  { id: 'cultural_hegemony__enlightenment_philosophy',
    source: 'cultural_hegemony', target: 'enlightenment_philosophy', type: 'ENABLED',
    label: 'European Enlightenment philosophy became the cultural hegemony of Western colonialism',
    note: 'Enlightenment philosophy functioned as cultural hegemony for European colonialism: the claim that reason, individual rights, and progress were universal values — not specifically European — made Western colonial domination appear as liberation or civilization. Kant\'s universalism, Locke\'s liberal rights, and Mill\'s utilitarianism were all compatible with slavery, colonialism, and indigenous dispossession through convenient exceptions (Locke\'s "waste lands," Mill\'s "barbarians"). Postcolonial theory (Fanon, Said) is primarily the critique of Enlightenment as hegemony.',
    confidence: 'high' },
];

let added=0;
for(const e of mechBatch) if(!exIds.has(e.id)){me.push(e);exIds.add(e.id);added++;}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('mechanisms/edges: +'+added, '→', me.length);

// Integrity
const allIds=new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s=>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n=>allIds.add(n.id)));
let orphans=0;
me.forEach(e=>{
  if(allIds.has(e.source)===false){console.log('ORPHAN src:',e.source);orphans++;}
  if(allIds.has(e.target)===false){console.log('ORPHAN tgt:',e.target);orphans++;}
});
console.log('Total nodes:',allIds.size,'| Orphans:',orphans);
