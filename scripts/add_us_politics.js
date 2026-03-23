#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const nodesPath = path.join(__dirname, '../data/nodes.json');
const edgesPath = path.join(__dirname, '../data/edges.json');
const nodes = JSON.parse(fs.readFileSync(nodesPath));
const edges = JSON.parse(fs.readFileSync(edgesPath));

// ── Modern US Politics Nodes ──────────────────────────────────────────────────
const newNodes = [
  {
    id: 'tea_party_movement',
    label: 'Tea Party Movement',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Tea_Party_movement',
    summary: 'A decentralized American political movement that emerged in 2009 in response to the Obama administration\'s stimulus legislation and the Affordable Care Act. The Tea Party combined libertarian economic positions (anti-tax, anti-government spending, deficit reduction) with populist anger directed at the Republican Party establishment as well as Democrats. Organizationally backed by Koch Brothers-affiliated groups (FreedomWorks, Americans for Prosperity), the Tea Party was simultaneously a genuine grassroots reaction and an astroturfed political operation. The movement shifted the Republican Party rightward, fueled primary challenges to moderate Republicans, and cultivated the anti-establishment populist energy that Donald Trump would later absorb and redirect. The Tea Party normalized the use of debt ceiling threats, government shutdowns, and institutional hardball as standard political tactics.',
    decade: '2009s–2016s',
    tags: ['usa', 'politics', 'republican', 'populism', 'anti-government', 'obama', 'movement']
  },
  {
    id: 'citizens_united',
    label: 'Citizens United Decision',
    node_type: 'reference',
    category: 'policy',
    wikipedia: 'https://en.wikipedia.org/wiki/Citizens_United_v._FEC',
    summary: 'The 2010 Supreme Court decision (Citizens United v. Federal Election Commission) ruling that the First Amendment prohibits the government from restricting political expenditures by corporations, associations, and labor unions. Citizens United held that political spending is a protected form of free speech and that corporations have the same First Amendment rights as individuals. The decision opened the door to unlimited "dark money" in elections through SuperPACs and 501(c)(4) organizations. Critics argue Citizens United enabled the purchasing of political influence at scale — allowing wealthy donors and corporations to spend without limit or disclosure. The decision is associated with the dramatic increase in money in US politics in the 2010s and the rise of billionaire-backed political movements.',
    decade: '2010s–Ongoing',
    tags: ['usa', 'politics', 'supreme-court', 'campaign-finance', 'dark-money', 'corporations', 'democracy']
  },
  {
    id: 'social_media_polarization',
    label: 'Social Media Political Polarization',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Social_media_and_political_polarization',
    summary: 'The process by which social media platforms — particularly Facebook, Twitter/X, and YouTube — accelerate political polarization through algorithmic amplification of emotionally engaging (often outrage-inducing) content, filter bubbles that reinforce existing beliefs, and network effects that cluster users with like-minded others. Algorithmic recommendation systems optimize for engagement, which correlates with emotional activation and outrage rather than accuracy or nuance. This creates incentive structures that reward extreme content, punish moderation, and systematically distort both parties\' perceptions of the opposing side. Research documents that social media significantly increases affective polarization (emotional hostility toward the other party) even if its effect on ideological position change is more contested.',
    decade: '2010s–Ongoing',
    tags: ['usa', 'social-media', 'polarization', 'algorithm', 'facebook', 'technology', 'politics']
  },
  {
    id: 'trump_maga',
    label: 'Trump / MAGA Movement',
    node_type: 'reference',
    category: 'movement',
    wikipedia: 'https://en.wikipedia.org/wiki/Make_America_Great_Again',
    summary: 'The political movement organized around Donald Trump and the "Make America Great Again" slogan, emerging in the 2015–16 Republican primary and dominating the Republican Party through the 2020s. MAGA combined white nationalist-adjacent grievance politics, economic nationalism (trade protectionism, anti-immigration), anti-institutional populism, and the personal cult of Donald Trump as a strongman figure who would "fight" on behalf of his supporters. The movement incorporated and radicalized Tea Party energy, absorbed conspiracy theory communities (including QAnon), and normalized political violence as a legitimate tool. MAGA represents a convergence of long-term Republican radicalization, social media dynamics, economic anxiety, and white demographic anxiety into a movement that broke with post-WWII American democratic norms.',
    decade: '2015s–Ongoing',
    tags: ['usa', 'trump', 'politics', 'republican', 'populism', 'nationalism', 'maga']
  },
  {
    id: 'january_6_attack',
    label: 'January 6th Capitol Attack',
    node_type: 'reference',
    category: 'event',
    wikipedia: 'https://en.wikipedia.org/wiki/2021_United_States_Capitol_attack',
    summary: 'The storming of the United States Capitol on January 6, 2021, by supporters of Donald Trump attempting to prevent the certification of Joe Biden\'s 2020 presidential election victory. Trump supporters, organized through social media and encouraged by Trump\'s speech that day, breached Capitol security, occupied the Senate chamber, and disrupted the constitutional process for several hours. Seven people died in connection with the attack; hundreds were criminally charged. The January 6th attack was the first violent interruption of the peaceful transfer of presidential power in American history and represented the culmination of a coordinated campaign by Trump and allies to overturn the 2020 election results through legal challenges, pressure on state officials, and ultimately mob violence.',
    decade: '2021s',
    tags: ['usa', 'politics', 'trump', 'violence', 'democracy', 'coup', 'january-6']
  },
  {
    id: 'qanon',
    label: 'QAnon',
    node_type: 'reference',
    category: 'ideology',
    wikipedia: 'https://en.wikipedia.org/wiki/QAnon',
    summary: 'A wide-ranging American conspiracy theory and cult of political belief originating in 2017, based on anonymous posts from "Q" claiming insider government knowledge of a secret cabal of Satanic pedophile elites (including Democratic politicians and Hollywood celebrities) who kidnap and abuse children, and that Donald Trump is secretly fighting to expose and destroy this cabal. QAnon synthesized older antisemitic conspiracy tropes (Protocols of the Elders of Zion, blood libel) with contemporary online culture and partisan politics. It spread rapidly through social media platforms, gained millions of believers in the US and internationally, and radicalized participants to real-world violence (including the Capitol attack). QAnon demonstrates how conspiracy theories can be weaponized politically and how digital media enables the rapid spread of delusional belief systems.',
    decade: '2017s–Ongoing',
    tags: ['usa', 'conspiracy', 'politics', 'trump', 'radicalization', 'social-media', 'cult']
  },
  {
    id: 'culture_wars',
    label: 'Culture Wars',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Culture_war',
    summary: 'The political and social conflict over values, identity, and cultural norms that has shaped American politics since the 1980s, intensifying in the 1990s and 2010s. Culture war issues — abortion, gun rights, LGBTQ rights, immigration, race in education, religious expression in public life — involve deep conflicts over identity and worldview rather than material interests, making compromise structurally difficult. Pat Buchanan\'s 1992 RNC speech declaring a "cultural war" named the phenomenon; sociologist James Davison Hunter theorized its structure in "Culture Wars" (1991). The culture war dynamic has been deliberately cultivated by political operatives who find that cultural conflict drives mobilization and fundraising more effectively than economic policy debates.',
    decade: '1990s–Ongoing',
    tags: ['usa', 'politics', 'culture', 'identity', 'polarization', 'values', 'conflict']
  },
  {
    id: 'voter_suppression_modern',
    label: 'Modern Voter Suppression',
    node_type: 'reference',
    category: 'policy',
    wikipedia: 'https://en.wikipedia.org/wiki/Voter_suppression_in_the_United_States',
    summary: 'Contemporary policies that restrict access to voting, disproportionately affecting Black, Latino, Indigenous, young, and poor voters, including: strict photo ID laws, voter roll purges, reduction of polling locations in minority-majority areas, limitations on early voting and mail-in voting, felony disenfranchisement, and gerrymandering. The Supreme Court\'s Shelby County v. Holder (2013) decision gutted the Voting Rights Act\'s preclearance requirement, enabling a wave of restrictive voting laws in former Confederate states. Proponents frame these as anti-fraud measures; critics document that in-person voter fraud is nearly nonexistent while the suppressive effect on minority voters is statistically significant. Modern voter suppression represents a continuation of the post-Reconstruction tradition of using procedural mechanisms to limit Black political power.',
    decade: '2010s–Ongoing',
    tags: ['usa', 'voting', 'race', 'republican', 'suppression', 'civil-rights', 'policy']
  },
  {
    id: 'political_polarization',
    label: 'Political Polarization',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Political_polarization',
    summary: 'The divergence of political attitudes toward ideological extremes, particularly the growing divide between Republican and Democratic voters in the United States. Political scientists distinguish "ideological polarization" (movement away from the center on policy) from "affective polarization" (growing emotional hostility toward the other party). Research documents that affective polarization has grown dramatically since the 1990s — Americans increasingly dislike, fear, and dehumanize political opponents rather than merely disagreeing with them. Drivers of polarization include: media fragmentation and partisan media ecosystems, geographic sorting, negative partisanship (voting against rather than for), social media dynamics, and deliberate radicalization by political actors who benefit from conflict.',
    decade: '1990s–Ongoing',
    tags: ['usa', 'politics', 'polarization', 'partisan', 'democracy', 'social', 'division']
  },
  {
    id: 'info_ecosystem_collapse',
    label: 'Information Ecosystem Collapse',
    node_type: 'reference',
    category: 'phenomenon',
    wikipedia: 'https://en.wikipedia.org/wiki/Media_fragmentation',
    summary: 'The fragmentation and degradation of shared information infrastructure that enables democratic deliberation: the collapse of local newspapers and trusted broadcast news, the rise of siloed partisan media ecosystems (Fox News, MSNBC, online partisan sites), algorithmic social media that optimizes for engagement over accuracy, and the proliferation of disinformation at scale. When a society lacks shared factual premises — agreed-upon basic facts about events and empirical reality — democratic deliberation becomes impossible because debate cannot resolve disagreements about what is happening. The information ecosystem collapse enables the spread of conspiracy theories (QAnon), makes coordinated disinformation campaigns highly effective (Russian interference, domestic disinformation), and creates conditions where authoritarian leaders can define reality for their followers.',
    decade: '2010s–Ongoing',
    tags: ['usa', 'media', 'democracy', 'disinformation', 'polarization', 'information', 'journalism']
  }
];

// ── Modern US Politics Edges ──────────────────────────────────────────────────
const newEdges = [
  {
    id: 'tea_party_movement__trump_maga',
    source: 'tea_party_movement',
    target: 'trump_maga',
    type: 'ENABLED',
    label: 'The Tea Party cultivated anti-establishment populist energy that Trump absorbed and radicalized',
    note: 'The Tea Party normalized primary challenges to Republican moderates, built an anti-establishment organizational infrastructure, and cultivated the voter base that Trump mobilized in 2016. Trump absorbed Tea Party voters while replacing its libertarian economic framework with nationalist populism.',
    confidence: 'high'
  },
  {
    id: 'citizens_united__trump_maga',
    source: 'citizens_united',
    target: 'trump_maga',
    type: 'ENABLED',
    label: 'Citizens United\'s dark money flows funded the institutional infrastructure of the MAGA movement',
    note: 'Citizens United enabled unlimited spending by SuperPACs and dark money organizations that funded MAGA-aligned candidates, media, and legal operations. Trump\'s movement was both self-funded (his personal brand) and backed by dark money infrastructure Citizens United made possible.',
    confidence: 'medium'
  },
  {
    id: 'social_media_polarization__political_polarization',
    source: 'social_media_polarization',
    target: 'political_polarization',
    type: 'CAUSED',
    label: 'Social media algorithmic amplification significantly increased affective political polarization',
    note: 'Research documents that social media platforms\' algorithmic recommendation systems amplify outrage, drive users toward increasingly extreme content, and create feedback loops that increase hostility toward political opponents. This particularly affects affective polarization (emotional hostility) more than ideological position.',
    confidence: 'high'
  },
  {
    id: 'social_media_polarization__qanon',
    source: 'social_media_polarization',
    target: 'qanon',
    type: 'ENABLED',
    label: 'Social media algorithms amplified QAnon content and enabled its rapid spread',
    note: 'QAnon content spread primarily through Facebook, YouTube, and Twitter algorithmic amplification. The platforms\' engagement optimization rewarded the emotionally compelling, community-building content QAnon produced. Without algorithmic distribution, QAnon would have remained a fringe phenomenon.',
    confidence: 'high'
  },
  {
    id: 'qanon__january_6_attack',
    source: 'qanon',
    target: 'january_6_attack',
    type: 'ENABLED',
    label: 'QAnon belief radicalized participants in the January 6th attack',
    note: 'Many January 6th participants and organizers held QAnon beliefs. QAnon\'s framing of the 2020 election as a Satanic cabal\'s theft of the election provided the ideological framework that made violent resistance feel morally required rather than merely politically motivated.',
    confidence: 'high'
  },
  {
    id: 'trump_maga__january_6_attack',
    source: 'trump_maga',
    target: 'january_6_attack',
    type: 'CAUSED',
    label: 'Trump\'s Big Lie campaign and direct incitement caused the January 6th Capitol attack',
    note: 'The January 6th Select Committee documented that Trump\'s months-long "Stop the Steal" campaign, his pressure on state officials and Vice President Pence, and his speech on January 6th directly caused the attack. Without Trump\'s active incitement and the MAGA movement\'s organizational infrastructure, the attack would not have occurred.',
    confidence: 'high'
  },
  {
    id: 'culture_wars__trump_maga',
    source: 'culture_wars',
    target: 'trump_maga',
    type: 'ENABLED',
    label: 'Decades of culture war framing created the identity-threat politics that MAGA mobilized',
    note: 'Trump\'s MAGA movement mobilized the accumulated emotional energy of three decades of culture war: white Christian identity threat, anti-immigration anxiety, and the framing of Democratic opponents as existential threats to American civilization. Culture war politics trained Republican voters to see politics as warfare.',
    confidence: 'high'
  },
  {
    id: 'political_polarization__culture_wars',
    source: 'political_polarization',
    target: 'culture_wars',
    type: 'ENABLED',
    label: 'Political polarization made culture war issues the primary terrain of partisan conflict',
    note: 'As economic policy differences between parties narrowed in the 1990s, cultural identity issues became the primary markers of partisan difference. Polarization and culture wars co-evolved: polarization made cultural issues more salient; culture wars deepened polarization.',
    confidence: 'high'
  },
  {
    id: 'political_polarization__political_polarization',
    source: 'political_polarization',
    target: 'political_polarization',
    type: 'SELF_REINFORCES',
    label: 'Political polarization self-reinforces through negative partisanship, media incentives, and geographic sorting',
    note: 'Polarization creates conditions that deepen polarization: negative partisanship (voting against the other party) strengthens as hostility increases; media organizations profit from partisan content; geographic sorting concentrates like-minded voters; institutional hardball escalates as norms erode.',
    confidence: 'high'
  },
  {
    id: 'info_ecosystem_collapse__qanon',
    source: 'info_ecosystem_collapse',
    target: 'qanon',
    type: 'ENABLED',
    label: 'The collapse of shared trusted information infrastructure enabled QAnon to fill the vacuum with conspiracy',
    note: 'QAnon spread most effectively in communities where trusted local news had collapsed and where Facebook was the primary information source. Without shared factual infrastructure, conspiracy theories compete on emotional resonance rather than truth.',
    confidence: 'high'
  },
  {
    id: 'info_ecosystem_collapse__political_polarization',
    source: 'info_ecosystem_collapse',
    target: 'political_polarization',
    type: 'ENABLED',
    label: 'Fragmented media ecosystems enabled partisan information silos that accelerate polarization',
    note: 'When Republicans and Democrats consume entirely different information ecosystems with different factual premises, the shared reality necessary for democratic deliberation collapses. Disagreement about facts (about crime rates, immigration, climate) becomes impossible to resolve through evidence.',
    confidence: 'high'
  },
  {
    id: 'voter_suppression_modern__trump_maga',
    source: 'voter_suppression_modern',
    target: 'trump_maga',
    type: 'ENABLED',
    label: 'Voter suppression efforts were pursued by MAGA-aligned legislators as an electoral strategy',
    note: 'Post-2020 election legislation in Republican-controlled states extended voter suppression policies in ways aligned with MAGA electoral strategy: limiting mail-in voting, reducing polling locations, expanding poll watcher access, and enabling partisan interference in election certification.',
    confidence: 'speculative'
  },
  {
    id: 'jim_crow_laws__voter_suppression_modern',
    source: 'jim_crow_laws',
    target: 'voter_suppression_modern',
    type: 'ENABLED',
    label: 'Jim Crow voter suppression established the legal templates and political logic of modern voter restrictions',
    note: 'Modern voter suppression draws on the Jim Crow playbook: procedural mechanisms (ID requirements, registration purges, polling place reduction) that are nominally race-neutral but have racially disparate effects. The Voting Rights Act of 1965 was designed to end Jim Crow voter suppression; its gutting in Shelby County (2013) enabled its revival.',
    confidence: 'high'
  },
  {
    id: 'social_media_polarization__info_ecosystem_collapse',
    source: 'social_media_polarization',
    target: 'info_ecosystem_collapse',
    type: 'CAUSED',
    label: 'Social media advertising destroyed local news business models and fragmented the shared information ecosystem',
    note: 'Social media platforms captured the advertising revenue that previously funded local newspapers and broadcast news, accelerating the collapse of local journalism. Simultaneously, social media\'s algorithmic content distribution replaced editorial curation, enabling partisan content to outcompete accurate journalism for attention.',
    confidence: 'high'
  },
  {
    id: 'culture_wars__political_polarization',
    source: 'culture_wars',
    target: 'political_polarization',
    type: 'CAUSED',
    label: 'Culture war conflicts deepened partisan identity and affective polarization',
    note: 'Culture war issues (abortion, guns, LGBTQ, immigration) generate strong emotional identity responses that increase affective polarization — the sense that political opponents are not merely wrong but evil or dangerous. This emotional dimension of cultural conflict drives polarization beyond what policy disagreements alone produce.',
    confidence: 'high'
  }
];

// Check for duplicates
const existingNodeIds = new Set(nodes.map(n => n.id));
const dupNodes = newNodes.filter(n => existingNodeIds.has(n.id));
if (dupNodes.length > 0) {
  console.error('DUPLICATE NODE IDs:', dupNodes.map(n => n.id).join(', '));
  process.exit(1);
}
const existingEdgeIds = new Set(edges.map(e => e.id));
const dupEdges = newEdges.filter(e => existingEdgeIds.has(e.id));
if (dupEdges.length > 0) {
  console.error('DUPLICATE EDGE IDs:', dupEdges.map(e => e.id).join(', '));
  process.exit(1);
}

nodes.push(...newNodes);
edges.push(...newEdges);

fs.writeFileSync(nodesPath, JSON.stringify(nodes, null, 2));
fs.writeFileSync(edgesPath, JSON.stringify(edges, null, 2));
console.log('nodes.json:', nodes.length, '(+' + newNodes.length + ')');
console.log('edges.json:', edges.length, '(+' + newEdges.length + ')');
