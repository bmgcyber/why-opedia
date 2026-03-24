#!/usr/bin/env node
// add_politics_enrichment2.js — fix low-connectivity politics nodes + add ho_chi_minh edges
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const pe = JSON.parse(fs.readFileSync(D('data/global/politics/edges.json')));
const he = JSON.parse(fs.readFileSync(D('data/global/history/edges.json')));
const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const peIds = new Set(pe.map(e=>e.id));
const heIds = new Set(he.map(e=>e.id));
const meIds = new Set(me.map(e=>e.id));

// ── Politics edges ────────────────────────────────────────────────────────
const newPolitEdges = [
  // patriot_act_surveillance (2 connections; sep_11 is history so add politics edges)
  { id: 'patriot_act_surveillance__january_6_attack',
    source: 'patriot_act_surveillance', target: 'january_6_attack', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent executive branch surveillance and enforcement actions that targeted political opponents using security state infrastructure',
    note: 'The PATRIOT Act surveillance infrastructure built after 9/11 and the January 6 events share the security state institutional context: the surveillance apparatus created under the PATRIOT Act — bulk data collection, FISA courts, expanded FBI powers — became the institutional infrastructure that subsequent administrations could use. Trump\'s claims that Biden/Obama "spied" on him during 2016 inverted the January 6 framing: the security state\'s surveillance capabilities, authorized under the PATRIOT Act\'s broad mandate, created the potential for both legitimate counterterrorism AND political surveillance abuse that each side accused the other of.',
    confidence: 'medium' },
  { id: 'church_committee__patriot_act_surveillance',
    source: 'church_committee', target: 'patriot_act_surveillance', type: 'ENABLED',
    label: 'Church Committee reforms were specifically designed to prevent the surveillance overreach the PATRIOT Act recreated within 25 years',
    note: 'The Church Committee (1975-76) was created to prevent exactly the abuses the PATRIOT Act enabled: bulk domestic surveillance, warrantless wiretapping, and intelligence community operations against American citizens. The Committee\'s FISA Act (1978) was meant to require court warrants for domestic surveillance. The PATRIOT Act (2001) — passed 25 years after Church Committee reforms — systematically expanded the exceptions and loopholes that Church had closed, recreating bulk surveillance capability through the NSA\'s mass data collection programs revealed by Snowden in 2013. The Church Committee reforms lasted exactly as long as the political will to maintain them.',
    confidence: 'high' },
  { id: 'iran_contra__patriot_act_surveillance',
    source: 'iran_contra', target: 'patriot_act_surveillance', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent NSC/executive branch covert operations that circumvented congressional oversight using national security justification',
    note: 'Iran-Contra (Reagan\'s NSC running illegal covert operations through private networks to circumvent congressional oversight) and PATRIOT Act surveillance (NSA bulk data collection kept secret from most of Congress through classification) share the mechanism: executive branch operations conducted in secret under national security claims, circumventing democratic oversight. Iran-Contra used private networks and Swiss bank accounts; PATRIOT Act used classification and FISA court secrecy. Both were revealed through leaks (Eugene Hasenfus plane crash 1986; Snowden 2013) rather than congressional oversight. The pattern — national security justification enabling secret operations outside democratic accountability — is consistent.',
    confidence: 'high' },

  // kerma
  { id: 'kerma__meroe',
    source: 'kerma', target: 'meroe', type: 'PRODUCED',
    label: 'Kerma was the predecessor civilization that established Nubian cultural continuity from which Meroe developed',
    note: 'Kerma (c. 2500-1500 BCE) was the first major Nubian urban civilization, a precursor to the later Nubian kingdoms of Napata and Meroe. Kerma\'s political and cultural institutions — the hierarchical chieftaincy, specialized craftsmanship, cattle-based economy, and distinctive burial practices — established the cultural foundations that later Nubian civilizations built on. After Egyptian conquest and subsequent Nubian revival (Napatan kingdom, 760 BCE), these traditions evolved into the Meroitic civilization that produced the distinctive Nubian cultural synthesis. Kerma represents the indigenous African political tradition that preceded and outlasted Egyptian influence in the Nile Valley.',
    confidence: 'high' },
  { id: 'kerma__egyptian_pharaoh',
    source: 'kerma', target: 'egyptian_pharaoh', type: 'SHARES_MECHANISM_WITH',
    label: 'Kerma and Egypt were rival Nile Valley civilizations that competed, traded, and exchanged cultural practices for millennia',
    note: 'Kerma and ancient Egypt were peer civilizations on the Nile: Kerma was wealthy enough to pose a military threat to Middle Kingdom Egypt (c. 2000-1650 BCE), controlled Nubian gold and trade routes, and maintained political independence against Egyptian attempts at domination. Egypt periodically controlled Nubia; Nubia periodically controlled Egypt (the Nubian Pharaoh period, 760-656 BCE, when Kerma\'s successors ruled all Egypt). The Kerma-Egypt relationship demonstrates that sub-Saharan African civilizations were not peripheral recipients of Egyptian culture but independent civilizational traditions in continuous competition and exchange with Egypt.',
    confidence: 'high' },

  // black_lives_matter
  { id: 'black_lives_matter__voter_suppression_modern',
    source: 'black_lives_matter', target: 'voter_suppression_modern', type: 'ENABLED',
    label: 'BLM\'s challenge to racial justice produced backlash voter suppression laws targeting communities most associated with the movement',
    note: 'Black Lives Matter\'s 2020 protest surge (following George Floyd\'s murder) was met with a wave of voter suppression legislation targeting Black and minority communities: Georgia\'s SB 202 (2021), Texas\'s SB 1, and similar laws in Republican-controlled states restricting voting hours, drop boxes, and voter ID requirements specifically targeted the voting patterns of communities that drove BLM protest turnout. The Brennan Center documented 19 states passing voter suppression laws in 2021 — the most since the 1965 Voting Rights Act. The legislative response to BLM demonstrated how political power converts social movement success into electoral suppression.',
    confidence: 'high' },
  { id: 'black_lives_matter__trump_maga',
    source: 'black_lives_matter', target: 'trump_maga', type: 'ENABLED',
    label: 'BLM and MAGA defined themselves against each other — the 2020 racial justice protests and MAGA backlash were symbiotic political forces',
    note: 'Black Lives Matter and MAGA defined themselves through mutual opposition: the 2020 Floyd protests and BLM surge activated Trump\'s "law and order" campaign rhetoric; Trump\'s response ("when the looting starts, the shooting starts"; threat to deploy the military against American protesters) galvanized BLM support while energizing MAGA base. The political realignment of 2020 — where suburban white women moved toward Biden while white working class men moved toward Trump — was driven substantially by the BLM-MAGA polarization dynamic. Neither movement was politically intelligible without the other as defining enemy.',
    confidence: 'high' },

  // winged_hussars (add politics-relevant edges beyond the history ones)
  { id: 'winged_hussars__peace_of_westphalia',
    source: 'winged_hussars', target: 'peace_of_westphalia', type: 'SHARES_MECHANISM_WITH',
    label: 'The winged hussars\' Vienna defense (1683) and the Peace of Westphalia (1648) both shaped the emerging European nation-state system',
    note: 'The winged hussars\' defense of Vienna (1683) and the Peace of Westphalia (1648) both contributed to defining European political geography: Westphalia established the nation-state sovereignty principle; Vienna demonstrated that the Ottoman threat to that system could be militarily repelled. Together they bookended the period when the modern European state system consolidated — Westphalia establishing the principle, Vienna demonstrating its military defense against non-European empire. The Polish-Lithuanian Commonwealth\'s hussars at Vienna were simultaneously defending European Christian civilization (the ideological frame) and Poland\'s own national security (the practical frame).',
    confidence: 'medium' },

  // papal_swiss_guard
  { id: 'papal_swiss_guard__spanish_inquisition',
    source: 'papal_swiss_guard', target: 'spanish_inquisition', type: 'SHARES_MECHANISM_WITH',
    label: 'Both represent Counter-Reformation Catholic institutional responses using force — military protection and religious enforcement — to defend papal authority',
    note: 'The Papal Swiss Guard and the Spanish Inquisition represent two modes of Counter-Reformation papal power: the Guard provided physical protection for the papacy after the traumatic Sack of Rome (1527) demonstrated its vulnerability; the Inquisition provided theological enforcement of Catholic doctrine in Spain. Both were responses to the Protestant Reformation\'s challenge to papal authority — one military, one juridical. The Inquisition operated under papal authorization but was administered by the Spanish crown; the Guard is directly under papal command. Together they represent the Counter-Reformation\'s strategy of combining military protection with doctrinal enforcement.',
    confidence: 'medium' },
];

// ── History edges for ho_chi_minh ─────────────────────────────────────────
const newHistEdges = [
  { id: 'vietnam_war__ho_chi_minh',
    source: 'vietnam_war', target: 'ho_chi_minh', type: 'ENABLED',
    label: 'The Vietnam War\'s human cost on both sides validated Ho Chi Minh\'s strategy of sustained resistance against technologically superior forces',
    note: 'The Vietnam War validated Ho Chi Minh\'s strategic insight: that an outgunned but politically motivated force could defeat a technologically superior enemy by making the war\'s cost in time and casualties unacceptable to democratic public opinion. Ho\'s military doctrine (Vo Nguyen Giap\'s formulation) held that the US would tire before Vietnam would — and was correct. 58,000 American deaths and a decade of protest made continuation politically impossible; 2-3 million Vietnamese deaths were absorbed by a system that did not require public consent for war. Ho Chi Minh\'s legacy is the demonstration that political will is a military force multiplier that equalizes asymmetric conflicts.',
    confidence: 'high' },
  { id: 'ho_chi_minh__cuban_revolution',
    source: 'ho_chi_minh', target: 'cuban_revolution', type: 'SHARES_MECHANISM_WITH',
    label: 'Ho Chi Minh and Fidel Castro were the defining Third World revolutionary figures of the Cold War, both defeating US-backed forces',
    note: 'Ho Chi Minh (Vietnam) and Fidel Castro (Cuba) represent the two most consequential Third World revolutionary success stories of the Cold War: both defeated US military power (directly in Vietnam; indirectly in Cuba\'s survival despite Bay of Pigs, assassination attempts, and 60+ year embargo); both maintained power for decades; both became symbols of small-nation resistance to American hegemony. Their influence on Third World liberation movements — from Angola to Nicaragua — made them the Cold War\'s most important non-superpower actors. The US failure to defeat either Ho or Castro was the most significant constraint on American Cold War power.',
    confidence: 'high' },
];

// ── Mechanism edges ───────────────────────────────────────────────────────
const newMechEdges = [
  { id: 'manufactured_consent__ho_chi_minh',
    source: 'manufactured_consent', target: 'ho_chi_minh', type: 'ENABLED',
    label: 'Ho Chi Minh\'s media strategy — maintaining a liberation narrative against American propaganda — was anti-manufactured consent that won the information war',
    note: 'Ho Chi Minh\'s strategic communication — maintaining the "national liberation from foreign invaders" narrative in international media — successfully countered American manufactured consent about "containing communist aggression." By framing the war as anticolonial independence rather than communist expansion (true for most Vietnamese regardless of ideology), Ho and the Viet Minh maintained legitimacy in the Third World and among American antiwar protesters. The manufactured consent problem for Johnson and Nixon was that the war\'s actual nature — preventing Vietnamese reunification under an elected leader (Ho would have won 1956 elections) — was difficult to make sound democratic.',
    confidence: 'high' },
];

// ── Write files ───────────────────────────────────────────────────────────
let pAdded=0, hAdded=0, mAdded=0;
newPolitEdges.forEach(e => { if (!peIds.has(e.id)) { pe.push(e); peIds.add(e.id); pAdded++; } });
newHistEdges.forEach(e => { if (!heIds.has(e.id)) { he.push(e); heIds.add(e.id); hAdded++; } });
newMechEdges.forEach(e => { if (!meIds.has(e.id)) { me.push(e); meIds.add(e.id); mAdded++; } });

fs.writeFileSync(D('data/global/politics/edges.json'), JSON.stringify(pe, null, 2));
fs.writeFileSync(D('data/global/history/edges.json'), JSON.stringify(he, null, 2));
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('politics/edges: +'+pAdded+' → '+pe.length);
console.log('history/edges: +'+hAdded+' → '+he.length);
console.log('mechanisms/edges: +'+mAdded+' → '+me.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
[...pe,...he,...me].forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total orphans:', orphans);
