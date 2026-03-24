#!/usr/bin/env node
// add_psych_edges.js — fills gaps in psychology scope connectivity
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

addEdges(D('data/global/psychology/edges.json'), [
  // ── Connect zero-edge nodes ──────────────────────────────────────────────
  { id: 'fat_acceptance_movement__chronic_illness_online_communities',
    source: 'fat_acceptance_movement', target: 'chronic_illness_online_communities', type: 'SHARES_MECHANISM_WITH',
    label: 'Both reframe pathologized conditions as valid identity, creating online communities that resist medicalization',
    note: 'Fat acceptance and chronic illness communities share the same structural dynamic: a condition medicine treats as pathology (obesity, fibromyalgia, long COVID) is reframed by community members as valid identity rather than disease to be cured. Both produce online communities with strong in-group identity, skepticism of medical authority, and members who find the community itself therapeutic — but also with documented patterns of identity reward that can discourage evidence-based treatment.',
    confidence: 'high' },
  { id: 'fat_acceptance_movement__positive_psychology',
    source: 'fat_acceptance_movement', target: 'positive_psychology', type: 'ENABLED',
    label: 'Positive psychology\'s acceptance frameworks provided intellectual support for fat acceptance ideology',
    note: 'The Health at Every Size (HAES) movement draws on positive psychology frameworks: self-compassion (Kristin Neff), acceptance and commitment therapy, and the shift from deficit-based to strengths-based models. Positive psychology\'s critique of the medical model — treating people as broken systems to be fixed rather than capable people to be supported — aligns structurally with fat acceptance\'s critique of medical fatphobia. HAES explicitly cites positive psychology research on unconditional self-worth.',
    confidence: 'medium' },
  { id: 'fat_acceptance_movement__self_help_industry',
    source: 'fat_acceptance_movement', target: 'self_help_industry', type: 'ENABLED',
    label: 'Body positivity and HAES have generated a substantial self-help product market',
    note: 'The fat acceptance movement has generated a thriving self-help market: HAES dieticians, body-positive coaches, intuitive eating programs, and anti-diet books (\"Anti-Diet\" by Christy Harrison; \"Health at Every Size\" by Linda Bacon) are major self-help category sellers. The same self-help infrastructure that marketed diet culture repackaged itself to market anti-diet culture — the market mechanism is identical even as the content reversed. Body positivity is diet culture\'s mirror image within the same industry.',
    confidence: 'high' },
  { id: 'brony_fandom__furry_fandom',
    source: 'brony_fandom', target: 'furry_fandom', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are adult male fandoms around non-masculine media/characters with fursona/ponysona identity displacement',
    note: 'Brony and furry fandoms share structural characteristics: adult male identification with non-traditionally-masculine characters (cartoon ponies; anthropomorphic animals), adoption of fictional avatars (ponysonas; fursonas) as primary identity presentation, intense online community investment, social stigma from outside, and documented community overlap. Both communities developed primarily online and demonstrate the parasocial identity displacement that emerges when socially alienated individuals find belonging in highly specific fandom communities.',
    confidence: 'high' },
  { id: 'brony_fandom__social_media_addiction',
    source: 'brony_fandom', target: 'social_media_addiction', type: 'ENABLED',
    label: 'Brony fandom developed exclusively through social media and sustains itself through platform-dependent community',
    note: 'The brony fandom emerged directly from a 4chan thread (October 2010) and grew entirely through social media platforms: DeviantArt for fan art, YouTube for fan-made content, Reddit for community, FimFiction for fan fiction. Unlike older fandoms with physical meeting structures, brony community is almost entirely platform-dependent. The fandom demonstrates how social media can crystallize a community around a specific object in weeks, and how platform community features (upvotes, engagement, notifications) sustain parasocial investment.',
    confidence: 'high' },
  { id: 'furry_fandom__social_media_addiction',
    source: 'furry_fandom', target: 'social_media_addiction', type: 'ENABLED',
    label: 'Furry fandom\'s growth from 1990s newsgroups to millions of members tracks social media platform expansion',
    note: 'The furry fandom predates the web (1980s science fiction fandom) but grew exponentially with internet platform development: alt.fan.furry (1990), FurryMUCK (1990), Fur Affinity (2005), Twitter and Discord communities (2010s). Fur Affinity alone hosts 80+ million uploaded images. The fandom\'s scale is inseparable from social media: the low cost of online community, the ease of finding other furries globally, and the engagement mechanics of furry art platforms all depend on social media infrastructure.',
    confidence: 'high' },
  { id: 'chronic_illness_online_communities__social_media_addiction',
    source: 'chronic_illness_online_communities', target: 'social_media_addiction', type: 'ENABLED',
    label: 'Chronic illness communities\' TikTok and Instagram presence creates algorithmic identity reward for illness expression',
    note: 'Chronic illness communities on TikTok (#ChronicIllness, 11+ billion views; #SpoonieLife) demonstrate how social media addiction mechanics intersect with identity communities: content about illness symptoms generates engagement (comments, supportive reactions), creating reward loops that incentivize illness expression and identity investment. Researchers document \"TikTok tic disorder\" and spread of functional neurological symptoms through chronic illness communities — not through deliberate deception but through social media\'s algorithmic amplification of emotionally resonant content.',
    confidence: 'high' },
  { id: 'chronic_illness_online_communities__recovered_memory_therapy',
    source: 'chronic_illness_online_communities', target: 'recovered_memory_therapy', type: 'SHARES_MECHANISM_WITH',
    label: 'Both: community dynamics and therapeutic suggestion can generate contested diagnoses that spread socially',
    note: 'Recovered memory therapy (1980s–90s) and some chronic illness communities share the mechanism of iatrogenic and socially-contagious diagnosis: therapists\' leading questions produced false memories of abuse; online chronic illness communities\' symptom discussions produce social spread of diagnoses (functional neurological disorder, multiple chemical sensitivity, some long COVID symptoms). Neither is simply fraudulent — both involve real suffering — but both demonstrate how community and therapeutic suggestion can generate and sustain medical beliefs that don\'t track independent pathology.',
    confidence: 'medium' },

  // ── Strengthen underconnected nodes ──────────────────────────────────────
  { id: 'jordan_peterson__self_help_industry',
    source: 'jordan_peterson', target: 'self_help_industry', type: 'ENABLED',
    label: '\"12 Rules for Life\" is the most commercially successful self-help book of the 2010s',
    note: 'Jordan Peterson\'s \"12 Rules for Life\" (2018, 5+ million copies) is the paradigm case of self-help industry mechanics applied to a public intellectual: self-improvement frameworks dressed in academic language (Jungian archetypes, evolutionary psychology), sold through emotional speeches on YouTube, generating coaching products, speaking tours, and merchandise. Peterson is the self-help industry\'s 2018 version: where Deepak Chopra used quantum physics mysticism, Peterson uses neuroscience and mythology as legitimating frameworks.',
    confidence: 'high' },
  { id: 'mgtow__incel_community',
    source: 'mgtow', target: 'incel_community', type: 'SHARES_MECHANISM_WITH',
    label: 'Both are male communities organized around rejection of women as romantic partners, sharing the manosphere ideology',
    note: 'MGTOW (Men Going Their Own Way) and incels share the ideological core of the manosphere: women are hypergamous, men are systematically disadvantaged by modern gender relations, and male-female relationships harm men. They differ in framing: incels want relationships but claim inability to get them; MGTOW deliberately choose to forgo them. In practice, the communities overlap substantially, members move between them, and both reinforce the same sexual grievance framework. MGTOW functions as the \"ideologically committed\" branch of the same population.',
    confidence: 'high' },
  { id: 'sigmund_freud__recovered_memory_therapy',
    source: 'sigmund_freud', target: 'recovered_memory_therapy', type: 'ENABLED',
    label: 'Freud\'s repression theory provided the intellectual framework that recovered memory therapy operationalized',
    note: 'Recovered memory therapy\'s core premise — that traumatic memories can be repressed and recovered through therapeutic technique — is directly derived from Freud\'s repression theory (1894–1900). The therapeutic practices (hypnosis, free association, dream interpretation to access unconscious content) are Freudian technique. The 1980s-90s recovered memory movement drew explicitly on Freudian concepts even as it extended them beyond what Freud himself claimed. When the movement was discredited, Freudian repression theory itself came under scrutiny — the scientific critique of recovered memory was also a critique of its Freudian foundations.',
    confidence: 'high' },
  { id: 'narcissistic_abuse__attachment_theory',
    source: 'narcissistic_abuse', target: 'attachment_theory', type: 'ENABLED',
    label: 'Attachment insecurity is the vulnerability that narcissistic abusers systematically target and exploit',
    note: 'Narcissistic abuse dynamics — idealization/devaluation cycling, intermittent reinforcement, isolation from support networks — exploit attachment system vulnerabilities: anxiously attached individuals (who fear abandonment) are particularly vulnerable to the idealization phase and intermittent reinforcement cycle; avoidantly attached individuals may find narcissistic confidence initially attractive. Research shows that early attachment patterns (especially anxious attachment) are predictive of vulnerability to narcissistic relationship dynamics. Narcissistic abuse is essentially a systematic exploitation of the attachment system.',
    confidence: 'high' },
  { id: 'stanford_prison_experiment__cult_dynamics',
    source: 'stanford_prison_experiment', target: 'cult_dynamics', type: 'ENABLED',
    label: 'SPE demonstrated how role assignment creates authoritarian compliance — the mechanism underlying cult dynamics',
    note: 'The Stanford Prison Experiment (Zimbardo, 1971) demonstrated that normal individuals rapidly adopt dehumanizing authority roles when institutional structure assigns them — the mechanism directly applicable to cult dynamics. Cult leaders create structural role assignments (leader-as-divine/followers-as-saved), institutional isolation, and ritualized compliance that mirror the SPE\'s guard-prisoner dynamic. Zimbardo himself extensively wrote on the connections between SPE findings and institutional totalism. The SPE\'s methodological problems don\'t undermine its relevance to cult analysis — the mechanisms it described are real even if the experiment was flawed.',
    confidence: 'high' },
  { id: 'online_radicalization__social_media_addiction',
    source: 'online_radicalization', target: 'social_media_addiction', type: 'ENABLED',
    label: 'Social media addiction creates the extended platform engagement that radicalization pipelines require',
    note: 'Radicalization pipelines are time-dependent: the YouTube-to-Telegram pathway requires hundreds of hours of progressive content consumption. Social media addiction — the compulsive checking, engagement reward loops, and extended platform time that characterize heavy social media use — provides the extended exposure that radicalization requires. Studies of online radicalization document that radicalized individuals averaged significantly higher platform usage times before radicalization. The addiction mechanism (variable ratio reward schedules) is what keeps people on platforms long enough for the pipeline to work.',
    confidence: 'high' },
  { id: 'rabbinic_judaism__confucianism',
    source: 'rabbinic_judaism', target: 'confucianism', type: 'SHARES_MECHANISM_WITH',
    label: 'Both emerged as text-based traditions pivoting from destroyed ritual centers to portable learning communities',
    note: 'Rabbinic Judaism (emerging after the destruction of the Second Temple, 70 CE) and Confucianism (emerging after the Zhou dynasty collapse disrupted ritual practice, ~500 BCE) share the same structural response to ritual center destruction: pivot from place-based ritual to portable text-based learning communities. Both created: a canon of authoritative texts (Mishnah/Talmud; Analects/Four Books), a class of learned interpreters (rabbis; Confucian scholars), and a practice-based piety centered on study and ethical conduct rather than sacrifice. The parallel is a textbook case of parallel cultural evolution under similar selective pressure.',
    confidence: 'high' },
]);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
JSON.parse(fs.readFileSync(D('data/global/psychology/edges.json'))).forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Orphans:', orphans);
