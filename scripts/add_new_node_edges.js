#!/usr/bin/env node
// Adds local intra-scope edges connecting newly added nodes to their scope peers
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addEdges(filePath, newEdges) {
  const existing = JSON.parse(fs.readFileSync(filePath));
  const ids = new Set(existing.map(e => e.id));
  let added = 0;
  for (const e of newEdges) {
    if (!ids.has(e.id)) { existing.push(e); ids.add(e.id); added++; }
  }
  if (added) fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
  console.log(path.basename(filePath), 'edges: added', added);
}

// ── History local edges ────────────────────────────────────────────────────────
addEdges(D('data/global/history/edges.json'), [
  // sept_11_attacks
  { id: 'gulf_war_1990__sept_11_attacks',
    source: 'gulf_war_1990', target: 'sept_11_attacks', type: 'ENABLED',
    label: 'Gulf War US military presence in Saudi Arabia became bin Laden\'s primary grievance',
    note: 'Osama bin Laden\'s primary stated justification for the 9/11 attacks was the presence of US military bases in Saudi Arabia following the Gulf War — violation of the sacred Arabian peninsula. The Gulf War thus directly produced the operational grievance that motivated Al-Qaeda\'s attack.',
    confidence: 'high' },
  { id: 'soviet_afghan_war__sept_11_attacks',
    source: 'soviet_afghan_war', target: 'sept_11_attacks', type: 'ENABLED',
    label: 'CIA mujahideen support created the organizational and ideological network that became Al-Qaeda',
    note: 'The CIA\'s Operation Cyclone funded and trained the Afghan mujahideen against the Soviet occupation, creating the organizational infrastructure, transnational jihadist network, and veteran fighters that became Al-Qaeda. Osama bin Laden himself was funded and connected through Pakistani ISI and Saudi channels tied to US support. The 9/11 attackers operated through networks with direct lineage to this CIA program.',
    confidence: 'high' },
  { id: 'sept_11_attacks__iraq_war_wmd',
    source: 'sept_11_attacks', target: 'iraq_war_wmd', type: 'ENABLED',
    label: '9/11 provided the political context that made WMD claims for the Iraq War credible',
    note: 'The Bush administration\'s Iraq WMD case succeeded partly because 9/11 had established a cognitive availability bias: in the post-9/11 environment, existential threats felt omnipresent and the threshold for preventive action was lowered. Without 9/11\'s psychological context, the Iraq WMD case would have faced much higher skepticism. The attacks created the political space for the war.',
    confidence: 'high' },

  // civil_rights_movement
  { id: 'reconstruction_era__civil_rights_movement',
    source: 'reconstruction_era', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Reconstruction\'s failure created the Jim Crow system the Civil Rights Movement dismantled',
    note: 'The Civil Rights Movement was completing Reconstruction\'s unfinished project: the 13th-15th Amendments (1865–1870) had created the constitutional framework for Black citizenship, but Reconstruction\'s violent overthrow produced 80 years of Jim Crow. The Civil Rights Act (1964) and Voting Rights Act (1965) finally enforced what the Reconstruction amendments had promised — making the movement the second Reconstruction.',
    confidence: 'high' },
  { id: 'civil_rights_movement__vietnam_war',
    source: 'civil_rights_movement', target: 'vietnam_war', type: 'ENABLED',
    label: 'Civil rights rhetoric expanded to anti-Vietnam War movement as MLK connected racist violence at home and abroad',
    note: 'MLK\'s 1967 "Beyond Vietnam" speech explicitly connected the Civil Rights Movement to anti-war activism: the same government committing violence against Black Americans was sending disproportionate numbers of Black soldiers to die in Vietnam. The civil rights frame expanded to critique structural violence in US foreign policy, producing the broader New Left coalition that defined late 1960s protest.',
    confidence: 'high' },

  // manifest_destiny
  { id: 'manifest_destiny__american_civil_war',
    source: 'manifest_destiny', target: 'american_civil_war', type: 'ENABLED',
    label: 'Manifest Destiny\'s territorial expansion made slavery\'s extension the central sectional crisis',
    note: 'Every territory acquired through Manifest Destiny expansion (Texas, Mexican Cession, Oregon) required Congress to decide whether to permit or prohibit slavery — creating the succession of crises (Missouri Compromise, Compromise of 1850, Kansas-Nebraska Act) that made civil war inevitable. Expansion resolved nothing; it deferred and then intensified the slavery question until Fort Sumter.',
    confidence: 'high' },
  { id: 'manifest_destiny__latin_american_dirty_wars',
    source: 'manifest_destiny', target: 'latin_american_dirty_wars', type: 'ENABLED',
    label: 'Manifest Destiny evolved into Monroe Doctrine imperialism that justified Cold War intervention',
    note: 'Manifest Destiny\'s theological logic — American Protestant civilization\'s divine right to expand — evolved into Monroe Doctrine imperialism and then Cold War "backyard" interventionism. The Latin American dirty wars (Chile 1973, Argentina 1976, Guatemala 1954, Nicaragua throughout) reflected the same assumption: the US\'s providential mission authorized intervention against perceived threats to its continental order.',
    confidence: 'high' },

  // qin_dynasty
  { id: 'confucius__qin_dynasty',
    source: 'confucius', target: 'qin_dynasty', type: 'ENABLED',
    label: 'Qin\'s book-burning and scholar-execution was a direct assault on Confucian intellectual tradition',
    note: 'Qin Shi Huang\'s 213 BCE book-burning — destruction of Confucian texts and execution of 460 Confucian scholars — was the defining confrontation between Legalist state authority and Confucian scholarly culture. The persecution established the enduring Chinese tension between state power and intellectual tradition, and made Confucianism a site of resistance against authoritarian centralization for two millennia.',
    confidence: 'high' },
]);

// ── Politics local edges ───────────────────────────────────────────────────────
addEdges(D('data/global/politics/edges.json'), [
  // january_6_attack already has 2 edges, but let's add key connections
  { id: 'trump_maga__january_6_attack',
    source: 'trump_maga', target: 'january_6_attack', type: 'CAUSED',
    label: 'Trump\'s Stop the Steal campaign directly mobilized the January 6 attack',
    note: 'The House Select Committee documented that Trump\'s 60+ failed election fraud legal challenges, "Stop the Steal" rally organization, and Ellipse speech directly caused the Capitol attack. Trump knew the crowd was armed, was told the attack was happening, and took no action for hours. January 6 is the culmination of the MAGA movement\'s authoritarian trajectory.',
    confidence: 'high' },
  { id: 'january_6_attack__democratic_backsliding',
    source: 'january_6_attack', target: 'democratic_backsliding', type: 'ENABLED',
    label: 'January 6 normalized the idea that election outcomes could be rejected by force',
    note: 'January 6\'s normalization consequence: 147 Republican members of Congress voted to reject certified electoral votes after the attack. The "Big Lie" became Republican Party orthodoxy. Election deniers ran for and won positions as secretaries of state. The attack demonstrated that democratic backsliding could proceed without serious legal consequence — an invitation to future attempts.',
    confidence: 'high' },
]);

// ── Media local edges ──────────────────────────────────────────────────────────
addEdges(D('data/global/media/edges.json'), [
  { id: 'televangelism__fox_news',
    source: 'televangelism', target: 'fox_news', type: 'ENABLED',
    label: 'Televangelism pioneered the emotional manipulation and donor cultivation techniques Fox News professionalized',
    note: 'The techniques Fox News and political talk radio use — charismatic authority figures, manufactured outrage, emotional appeals over factual argument, audience identity capture, and continuous monetization of fear — were pioneered in industrial scale by televangelism. Pat Robertson\'s 700 Club, Jerry Falwell\'s Moral Majority, and Jim Bakker\'s PTL Club trained the conservative media audience in the format Fox News inherited.',
    confidence: 'medium' },
  { id: 'televangelism__edward_bernays',
    source: 'televangelism', target: 'edward_bernays', type: 'SHARES_MECHANISM_WITH',
    label: 'Televangelism independently developed and operationalized Bernays\'s manufactured consent techniques',
    note: 'Oral Roberts and later televangelists independently discovered the manufactured consent toolkit: appeals to unconscious desire (spiritual transformation, physical healing), crowd psychology, testimonial advertising, and manufactured scarcity (the closing window of salvation). Whether or not they read Bernays, televangelism operationalized the same techniques for religious and political mobilization.',
    confidence: 'medium' },
]);

// Final integrity check
const allIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n=>allIds.add(n.id));
let orphans = 0;
const allEdgeFiles = scopes.map(s => JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json')))).flat();
allEdgeFiles.forEach(e => {
  if (allIds.has(e.source) === false) { console.log('ORPHAN src:', e.source); orphans++; }
  if (allIds.has(e.target) === false) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total nodes:', allIds.size, '| Orphans:', orphans);
