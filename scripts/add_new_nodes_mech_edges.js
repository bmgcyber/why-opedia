#!/usr/bin/env node
// add_new_nodes_mech_edges.js — additional mechanism cross-scope edges for recently added nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const me = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const exIds = new Set(me.map(e => e.id));

const batch = [
  // ── scientific_revolution ─────────────────────────────────────────────────
  { id: 'manufactured_scientific_doubt__scientific_revolution',
    source: 'manufactured_scientific_doubt', target: 'scientific_revolution', type: 'DISCREDITED',
    label: 'The doubt industry attacks the Scientific Revolution\'s core claim that evidence defeats authority',
    note: 'The tobacco, lead, and fossil fuel industries\' manufactured scientific doubt campaigns are attacks on the Scientific Revolution\'s foundational claim: that empirical evidence should determine truth rather than authority, tradition, or interest. By funding doubt-generating research and exploiting scientific norms of uncertainty, the doubt industry undermines the epistemological framework the Scientific Revolution established. Climate denial is the most consequential attack on the Scientific Revolution\'s methodology since the Galileo trial.',
    confidence: 'high' },
  { id: 'institutional_credibility_laundering__scientific_revolution',
    source: 'institutional_credibility_laundering', target: 'scientific_revolution', type: 'EXPLOITED',
    label: 'Scientific institution credibility — built by the Scientific Revolution — is systematically exploited by industry-funded research',
    note: 'The Scientific Revolution\'s achievement was creating institutions (Royal Society, peer review, replication) whose credibility rested on methodological rigor. Industry-funded research exploits this credibility: studies funded by tobacco, sugar, or pharmaceutical companies use the trappings of scientific method while producing predetermined conclusions. The credibility laundering works because the institutional form — peer-reviewed journal, university affiliation — carries the Scientific Revolution\'s epistemic authority even when the content violates its norms.',
    confidence: 'high' },

  // ── american_revolution ───────────────────────────────────────────────────
  { id: 'democratic_backsliding__american_revolution',
    source: 'democratic_backsliding', target: 'american_revolution', type: 'ENABLED',
    label: 'January 6 was the first attempt to overturn the constitutional democratic framework the American Revolution established',
    note: 'January 6, 2021 was democratic backsliding attacking the specific institutions the American Revolution created: the Electoral College certification, peaceful transfer of power, and congressional confirmation process. Trump\'s attempt to reverse the 2020 election was the first direct assault on the American constitutional framework since the Civil War. The January 6 attempt demonstrated that the constitutional system the Founders designed — relying on norms and individual character as much as law — was vulnerable to a President willing to violate norms without legal consequence.',
    confidence: 'high' },
  { id: 'lost_cause_mythology__american_revolution',
    source: 'lost_cause_mythology', target: 'american_revolution', type: 'SHARES_MECHANISM_WITH',
    label: 'Both create founding mythologies that conceal the violence and contradiction embedded in their historical origins',
    note: 'The Lost Cause mythology (Confederate defeat was noble; slavery was a secondary cause; Reconstruction was oppression) and American Revolutionary mythology (Founders as universal rights champions; slavery a regrettable exception that the system would eventually resolve) share the same ideological function: creating a redemptive founding mythology that elides the violence, exploitation, and contradiction of origins. Both make the founding seem legitimate by hiding what it required. American civil religion and Confederate nostalgia are variants of the same founding myth function.',
    confidence: 'high' },

  // ── napoleon_bonaparte ────────────────────────────────────────────────────
  { id: 'democratic_backsliding__napoleon_bonaparte',
    source: 'democratic_backsliding', target: 'napoleon_bonaparte', type: 'ENABLED',
    label: 'Napoleon\'s rise from consul to emperor is the historical template for democratic backsliding into authoritarian personalism',
    note: 'Napoleon Bonaparte\'s political trajectory — from First Consul of the Republic (1799) to Emperor (1804) through constitutional manipulation, plebiscites, and military popularity — is the founding template for democratic backsliding into authoritarian personalism. Levitsky and Ziblatt\'s \"How Democracies Die\" identifies \"Napoleonism\" as a historical pattern: elected or constitutionally legitimate leader gradually concentrates power, eliminates institutional checks, and establishes personal rule. The pattern recurs: Hitler, Mussolini, Chávez, Erdoğan — all Napoleonic trajectories.',
    confidence: 'high' },
  { id: 'cultural_hegemony__napoleon_bonaparte',
    source: 'cultural_hegemony', target: 'napoleon_bonaparte', type: 'ENABLED',
    label: 'Napoleonic Code spread French Enlightenment cultural hegemony through conquest, making French institutions the default of modernity',
    note: 'Napoleon\'s cultural hegemony strategy was juridical: the Code civil (Napoleonic Code, 1804) — equality before law, property rights, religious toleration, secular civil registry — was imposed across conquered Europe as the legal framework of modern governance. By making French Enlightenment law the default for Europe, Napoleon established French legal culture as hegemonic: subsequent generations built on it even after his defeat. The Code remained in force in many countries long after the Napoleonic armies left.',
    confidence: 'high' },

  // ── congress_of_vienna ────────────────────────────────────────────────────
  { id: 'democratic_backsliding__congress_of_vienna',
    source: 'democratic_backsliding', target: 'congress_of_vienna', type: 'ENABLED',
    label: 'The Congress of Vienna was a deliberate multi-power democratic backsliding project, establishing collective legitimism against revolution',
    note: 'The Congress of Vienna (1814-15) is a collective democratic backsliding operation: Metternich, Castlereagh, and Tsar Alexander explicitly designed the Concert of Europe system to prevent the recurrence of 1789. The legitimacy principle (restored dynasties), the Quadruple Alliance (collective intervention against revolution), and the systematic monitoring of liberal movements across Europe were democratic backsliding by great-power concert rather than individual autocratic decision. The Vienna system shows that backsliding can be institutionalized as international order.',
    confidence: 'high' },
  { id: 'overton_window__congress_of_vienna',
    source: 'overton_window', target: 'congress_of_vienna', type: 'ENABLED',
    label: 'Congress of Vienna attempted to reset the Overton window back to pre-revolutionary acceptable governance',
    note: 'The Congress of Vienna\'s Metternich explicitly attempted to make revolutionary ideas \"unthinkable\" again: the Holy Alliance\'s declaration that Christian monarchical principles should govern Europe, the Carlsbad Decrees (press censorship, university surveillance), and the Concert of Europe\'s intervention system were an attempt to move the Overton window back to pre-1789 norms. The attempt failed — 1830, 1848, and 1871 were revolutions against the Vienna settlement — demonstrating that the Overton window, once moved, cannot easily be moved back.',
    confidence: 'high' },

  // ── french_revolution ─────────────────────────────────────────────────────
  { id: 'in_group_out_group_dynamics__french_revolution',
    source: 'in_group_out_group_dynamics', target: 'french_revolution', type: 'ENABLED',
    label: 'The Terror\'s escalating violence was driven by in-group/out-group dynamics identifying ever-more-refined enemies',
    note: 'The Reign of Terror demonstrates how in-group/out-group dynamics escalate under revolutionary conditions: the Committee of Public Safety\'s logic required continuous identification of new enemies (aristocrats → Girondins → Hébertists → Dantonists → eventually Robespierre himself). Each purge narrowed the in-group definition of "true revolutionary," requiring identification of previously-acceptable members as secret counterrevolutionaries. This escalating in-group/out-group dynamic is characteristic of revolutionary terror — it is not aberrant but structurally driven.',
    confidence: 'high' },

  // ── industrial_revolution ─────────────────────────────────────────────────
  { id: 'resource_curse__industrial_revolution',
    source: 'resource_curse', target: 'industrial_revolution', type: 'ENABLED',
    label: 'Industrial Revolution\'s resource extraction from colonies produced the resource curse dynamics in Global South economies',
    note: 'The Industrial Revolution\'s energy requirements produced the colonial resource extraction patterns that became the resource curse: British industrialization required cotton (US South, India), coal (domestic), rubber (Congo, Southeast Asia), and later oil (Middle East). The colonial extraction model — raw materials out, manufactured goods in — created economic structures in colonized territories that resembled resource curse economies: export-dependent, manufactured-goods-importing, politically organized around resource extraction rather than diversified development.',
    confidence: 'high' },

  // ── world_wide_web ────────────────────────────────────────────────────────
  { id: 'broken_epistemology__world_wide_web',
    source: 'world_wide_web', target: 'broken_epistemology', type: 'PRODUCED',
    label: 'The web\'s elimination of editorial gatekeepers produced a broken epistemology where false and true information circulate identically',
    note: 'The World Wide Web produced broken epistemology at civilizational scale: for the first time in human history, false information circulates at the same velocity, reach, and persistence as true information — and with comparable production quality. The web\'s architecture makes no distinction between a peer-reviewed paper and a conspiracy website: both have URLs, both appear in search results, both can go viral. This architectural epistemological equality, combined with the attention economy\'s preference for emotionally engaging (often false) content, produced the epistemic crisis of the 2010s-2020s.',
    confidence: 'high' },
];

let added = 0;
for (const e of batch) {
  if (!exIds.has(e.id)) { me.push(e); exIds.add(e.id); added++; }
}
fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(me, null, 2));
console.log('mechanisms/edges: +' + added + ' → ' + me.length);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
me.forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Total mech edges:', me.length, '| Orphans:', orphans);
