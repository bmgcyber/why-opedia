#!/usr/bin/env node
// add_media_health_edges.js — fills gaps in media and health scope connectivity
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

function addEdges(f, ee) {
  const ex = JSON.parse(fs.readFileSync(f));
  const ids = new Set(ex.map(e => e.id));
  let a = 0;
  for (const e of ee) if (!ids.has(e.id)) { ex.push(e); ids.add(e.id); a++; }
  if (a) fs.writeFileSync(f, JSON.stringify(ex, null, 2));
  console.log(f.split('/').slice(-2).join('/'), 'edges: +' + a, '→', ex.length);
}

// ── Media: local intra-scope edges ─────────────────────────────────────────
addEdges(D('data/global/media/edges.json'), [
  { id: 'homeric_epics__gilgamesh',
    source: 'homeric_epics', target: 'gilgamesh', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are oral → written foundational epics transmitting cultural cosmology across generations',
    note: 'The Homeric epics and the Epic of Gilgamesh share the same cultural function: oral narratives of heroic figures that were eventually codified in writing and became the canonical cultural text of their civilizations — the curriculum through which citizens learned values, cosmology, and identity. Both feature a flood narrative, a hero\'s journey confronting death, and divine/human interaction. Homeric epic scholarship extensively compares the two traditions, finding parallel compositional techniques and narrative structures.',
    confidence: 'high' },
  { id: 'rt_russia_today__social_media_platforms',
    source: 'rt_russia_today', target: 'social_media_platforms', type: 'ENABLED',
    label: 'RT weaponizes social media algorithms to amplify Russian disinformation beyond its broadcast audience',
    note: 'RT\'s primary influence is not its broadcast ratings (small in Western markets) but its social media strategy: producing emotionally inflammatory content designed to go viral, using bot networks to seed trending topics, and exploiting YouTube/Facebook recommendation algorithms. The Senate Intelligence Committee documented RT\'s social media amplification infrastructure: 3.6 million YouTube subscribers, 2.2 million Twitter followers, and systematic amplification of divisive content. RT understood social media algorithmic mechanics better than most Western news organizations.',
    confidence: 'high' },
  { id: 'deepfakes__social_media_platforms',
    source: 'deepfakes', target: 'social_media_platforms', type: 'ENABLED',
    label: 'Social media\'s low-friction viral sharing infrastructure is what gives deepfakes their political power',
    note: 'A deepfake video is only dangerous if it circulates before debunking. Social media platforms\' viral infrastructure — shares, reposts, algorithmic amplification — is what transforms a deepfake from a technically impressive artifact into a political weapon. Facebook, Twitter, and WhatsApp have the distribution velocity (millions of views in hours) that ensures deepfakes reach their intended audience before fact-checkers can respond. Without social media\'s distribution architecture, deepfakes would be a curiosity rather than a disinformation threat.',
    confidence: 'high' },
  { id: 'attention_economy__local_news_collapse',
    source: 'attention_economy', target: 'local_news_collapse', type: 'PRODUCED',
    label: 'Attention economy siphoned local newspaper advertising to digital platforms, defunding local journalism',
    note: 'The local news collapse was directly caused by the attention economy: Craigslist eliminated classified ad revenue (local papers\' largest income source), Google AdSense captured display advertising, and Facebook news feeds replaced the community-information function of local papers. The mechanism: advertisers follow eyeballs; eyeballs migrated to digital platforms; local papers lost revenue and closed. Between 2005 and 2020, the US lost 2,100 newspapers and 57% of newspaper journalists. The attention economy did not mean to kill local news; local news was collateral damage of attention capture.',
    confidence: 'high' },
  { id: 'infowars_alternative_media__rt_russia_today',
    source: 'infowars_alternative_media', target: 'rt_russia_today', type: 'SHARES_MECHANISM_WITH',
    label: 'Both amplify manufactured grievance and institutional distrust for political destabilization',
    note: 'Infowars and RT share a convergent strategy despite different principals (Jones serving MAGA nationalism; RT serving Russian foreign policy): both amplify content that erodes trust in democratic institutions, science, mainstream media, and electoral processes. The Senate Intelligence Committee documented RT amplifying Infowars content, and Jones appeared on RT. The convergence is not accidental — destabilization of Western democratic discourse serves both principals\' interests, and the content formats (outrage, conspiracy, anti-elite) are identical.',
    confidence: 'high' },
  { id: 'walter_lippmann__cambridge_analytica',
    source: 'walter_lippmann', target: 'cambridge_analytica', type: 'ENABLED',
    label: 'Lippmann\'s theory that public opinion must be manufactured by elites is what Cambridge Analytica operationalized',
    note: 'Walter Lippmann\'s \"Public Opinion\" (1922) argued that the complexity of the modern world makes it impossible for citizens to form independent opinions — elites must manufacture consent by managing information flow to shape public perception. Cambridge Analytica is Lippmann\'s theory operationalized at scale: psychographic profiling identifies each voter\'s cognitive vulnerabilities, and targeted messaging manufactures the consent needed. The Bernays-Lippmann-Cambridge Analytica lineage is explicit — the firm\'s founders cited Bernays (who cited Lippmann) as intellectual inspiration.',
    confidence: 'high' },
  { id: 'yellow_journalism__rt_russia_today',
    source: 'yellow_journalism', target: 'rt_russia_today', type: 'SHARES_MECHANISM_WITH',
    label: 'Yellow journalism and RT share the sensationalism-for-geopolitical-manipulation playbook',
    note: 'Yellow journalism (Hearst, Pulitzer, 1890s) and RT (2005–present) share the same operating logic: emotionally inflammatory, factually unreliable content that serves a geopolitical agenda. Hearst fabricated news to sell papers and push the US toward war with Spain; RT fabricates and distorts to push Western audiences toward institutional distrust and support for Russian foreign policy. The century separating them shows the playbook\'s durability: sensationalism for political manipulation is not a media artifact of a particular era.',
    confidence: 'high' },
  { id: 'televangelism__infowars_alternative_media',
    source: 'televangelism', target: 'infowars_alternative_media', type: 'ENABLED',
    label: 'Alex Jones launched on Christian radio; televangelism created the emotional grift format Infowars perfected',
    note: 'Alex Jones began his career on Christian radio stations and explicitly drew on evangelical broadcast techniques: the charismatic host, the apocalyptic urgency, the conspiracy revelation, the product sales embedded in programming (InfoWars Store supplements mimic televangelism donation drives). The televangelism tradition — a charismatic authority revealing hidden truth and selling the solution — is the cultural parent of the conspiracy media format Jones industrialized. His audience overlaps substantially with evangelical Christianity.',
    confidence: 'high' },
  { id: 'homeric_epics__printing_press',
    source: 'homeric_epics', target: 'printing_press', type: 'ENABLED',
    label: 'The printing press transformed Homer from manuscript rarity to the curriculum text of Western education',
    note: 'Homer was the most printed non-Biblical text in 15th-17th century Europe: the first printed Greek book was a Homer (Florence, 1488). The printing press transformed the Homeric epics from manuscripts available only in major libraries to the curriculum text for grammar schools, universities, and gentlemen\'s education across Europe. The standardization the press imposed — a canonical text replacing the manuscript variants — also transformed how Homer was read, interpreted, and transmitted. The modern Western tradition of Homer as cultural foundation was constructed by the press.',
    confidence: 'high' },
]);

// ── Health: local intra-scope edges ────────────────────────────────────────
addEdges(D('data/global/health/edges.json'), [
  { id: 'aids_crisis__anti_vaccination_movement',
    source: 'aids_crisis', target: 'anti_vaccination_movement', type: 'ENABLED',
    label: 'AIDS crisis institutionalized government medical dishonesty that fueled lasting vaccine distrust',
    note: 'The AIDS crisis (particularly Reagan\'s refusal to acknowledge it publicly until 1987, after 20,000 Americans had died) created a documented pattern of government dishonesty about epidemic threats that anti-vaccination activists directly cite. The documented pattern: government initially downplayed a health crisis to protect political interests, costing lives. This creates rational grounds for skepticism when the same government later promotes vaccines as safe — the AIDS crisis is part of the evidentiary basis for medical distrust.',
    confidence: 'high' },
  { id: 'aids_crisis__deinstitutionalization',
    source: 'aids_crisis', target: 'deinstitutionalization', type: 'ENABLED',
    label: 'Deinstitutionalization eliminated the residential care infrastructure AIDS patients needed',
    note: 'The AIDS crisis coincided with the aftermath of deinstitutionalization (1960s–80s): the residential care infrastructure that would have housed severely ill AIDS patients had been dismantled. Many AIDS patients in the late 1980s died in emergency rooms or homeless, because there were no long-term care facilities outside expensive hospitals. The deinstitutionalization decision — made for fiscal and ideological reasons — became a structural constraint on the AIDS response.',
    confidence: 'medium' },
  { id: 'aids_crisis__covid19_pandemic',
    source: 'aids_crisis', target: 'covid19_pandemic', type: 'ENABLED',
    label: 'AIDS ACT UP activism created the expedited drug approval and patient advocacy infrastructure COVID used',
    note: 'ACT UP\'s activism during the AIDS crisis fundamentally changed FDA drug approval: the Treatment IND protocol (1987), Parallel Track trials (1989), and Accelerated Approval pathway (1992) were all direct results of AIDS activist pressure. These regulatory changes created the infrastructure that enabled COVID vaccine approval at unprecedented speed — Operation Warp Speed used the same expedited pathways ACT UP won. The COVID vaccine miracle was partly an inheritance from AIDS activist organizing.',
    confidence: 'high' },
  { id: 'pharmaceutical_trials_manipulation__opioid_crisis',
    source: 'pharmaceutical_trials_manipulation', target: 'opioid_crisis', type: 'ENABLED',
    label: 'Purdue\'s manipulated OxyContin trials were the proximate mechanism of the prescription opioid wave',
    note: 'Purdue Pharma\'s 1996 OxyContin launch relied on manipulated clinical data: the claim that OxyContin was less addictive than other opioids, and that addiction risk in chronic pain patients was less than 1%, were both based on manipulated or cherry-picked evidence. The FDA approval was secured with this data. Subsequent prescribing guidelines drew on the manipulated trials. Pharmaceutical trial manipulation was not incidental to the opioid crisis — it was the mechanism through which Purdue\'s product entered legitimate medicine.',
    confidence: 'high' },
  { id: 'sugar_industry_cover_up__opioid_crisis',
    source: 'sugar_industry_cover_up', target: 'opioid_crisis', type: 'SHARES_MECHANISM_WITH',
    label: 'Both used industry-funded research and regulatory capture to suppress evidence of mass harm',
    note: 'The sugar industry (1960s–90s) and Purdue Pharma (1990s–2010s) used structurally identical strategies: fund studies that show favorable results, suppress or deny unfavorable data, capture regulatory agencies through personnel and funding relationships, and maintain market access until the harm is undeniable. The mechanism is the tobacco playbook applied to sugar and opioids. All three industries — tobacco, sugar, and pharma — literally consulted the same PR and lobbying infrastructure.',
    confidence: 'high' },
  { id: 'leaded_gasoline_cover_up__big_pharma_lobbying',
    source: 'leaded_gasoline_cover_up', target: 'big_pharma_lobbying', type: 'SHARES_MECHANISM_WITH',
    label: 'Both: industry funds the science that regulates it, producing systematic suppression of harm evidence',
    note: 'Tetraethyl lead (1920s–80s) and pharmaceutical lobbying share the same regulatory capture mechanism: industry-funded scientists dominate expert panels, industry funding shapes research questions, and regulators depend on industry-submitted data to evaluate industry products. The lead industry suppressed evidence of neurological harm for 60 years; pharma lobbying produced the PDUFA model where pharma pays FDA review fees. Both are examples of the same corporate-regulatory revolving door producing predictable harm suppression.',
    confidence: 'high' },
  { id: 'anti_psychiatry_movement__covid19_pandemic',
    source: 'anti_psychiatry_movement', target: 'covid19_pandemic', type: 'ENABLED',
    label: 'Anti-psychiatry\'s dismantling of mental health infrastructure left COVID patients without treatment',
    note: 'COVID-19 produced a mental health crisis (anxiety, depression, trauma, long COVID psychological symptoms) at a moment when the mental health infrastructure was at its weakest: 50 years of deinstitutionalization and anti-psychiatry-influenced defunding had produced a shortage of beds, psychiatrists, and community mental health centers. The anti-psychiatry movement\'s practical legacy — inadequate publicly funded mental health care — constrained the COVID mental health response.',
    confidence: 'medium' },
  { id: 'covid19_pandemic__big_pharma_lobbying',
    source: 'covid19_pandemic', target: 'big_pharma_lobbying', type: 'ENABLED',
    label: 'COVID vaccine development showed pharmaceutical lobbying\'s success in protecting IP over global access',
    note: 'The COVID vaccine IP controversy demonstrated pharma lobbying\'s sustained power: pharmaceutical companies lobbied successfully against TRIPS waiver provisions that would have allowed Generic manufacturing in developing countries. Pfizer, Moderna, and J&J lobbied against IP waivers, patent sharing, and technology transfer — maintaining monopoly pricing while millions in low-income countries went without vaccines. The COVID response showed both the triumph of pharmaceutical innovation and the lobbying infrastructure that protected profits over lives.',
    confidence: 'high' },
]);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
['global/media','global/health'].forEach(s => {
  JSON.parse(fs.readFileSync(D('data/'+s+'/edges.json'))).forEach(e => {
    if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
    if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
  });
});
console.log('Orphans:', orphans);
