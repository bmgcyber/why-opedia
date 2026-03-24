#!/usr/bin/env node
// add_hist_enrichment.js — fixes zero-edge history nodes and enriches key 1-edge nodes
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

addEdges(D('data/global/history/edges.json'), [
  // ── apollo_moon_landing: was completely isolated ───────────────────────────
  { id: 'john_kennedy__apollo_moon_landing',
    source: 'john_kennedy', target: 'apollo_moon_landing', type: 'PRODUCED',
    label: 'JFK\'s 1961 pledge to Congress committed the United States to the moon landing',
    note: 'Kennedy\'s May 25, 1961 address to Congress — \"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon\" — was the decision that produced Apollo. The subsequent \"We choose to go to the Moon\" speech (Rice University, 1962) framed it as a Cold War competition won through technological supremacy. Kennedy\'s decision was made 20 days after Alan Shepard\'s 15-minute suborbital flight — the US was far behind the Soviets. The moon landing was JFK\'s Cold War bet, executed after his assassination.',
    confidence: 'high' },
  { id: 'cuban_missile_crisis__apollo_moon_landing',
    source: 'cuban_missile_crisis', target: 'apollo_moon_landing', type: 'ENABLED',
    label: 'Cuban Missile Crisis established the space race as the peaceful arena for Cold War supremacy competition',
    note: 'The Cuban Missile Crisis (October 1962) brought the US and USSR to the edge of nuclear war. After the crisis, Kennedy explicitly channeled Cold War competition away from direct military confrontation toward the \"peaceful\" arena of space: the Space Race became the approved proxy for US-Soviet superpower rivalry. The Apollo program budget was dramatically expanded in 1962-63, partly as a consequence of the crisis settling the question of where the two superpowers would compete for prestige. The moon landing was the Cold War\'s sublimated competition.',
    confidence: 'high' },

  // ── black_death: was completely isolated ──────────────────────────────────
  { id: 'black_death__protestant_reformation',
    source: 'black_death', target: 'protestant_reformation', type: 'ENABLED',
    label: 'Black Death devastated Church credibility, creating conditions for Protestant reform a century later',
    note: 'The Black Death (1347–51, killing ~1/3 of Europe\'s population) catastrophically damaged the Catholic Church\'s spiritual credibility: clergy died at the same rate as everyone else despite prayers and rites; popes fled to Avignon; the Church\'s explanations (divine punishment, Jewish poisoning of wells) were incoherent. The result was a century of declining institutional trust in the Church that created the receptive audience for Luther\'s reform. The Reformation\'s popular traction depended on a pre-existing wound the Black Death had opened.',
    confidence: 'high' },
  { id: 'black_death__jewish_expulsion_spain_1492',
    source: 'black_death', target: 'jewish_expulsion_spain_1492', type: 'ENABLED',
    label: 'Black Death\'s anti-Jewish pogroms established the persecution template the Spanish Inquisition institutionalized',
    note: 'During the Black Death, Jewish communities across Europe were massacred on the accusation that they had poisoned wells to cause the plague. The 1348-51 pogroms — burning of Jewish communities in over 200 towns from Spain to Germany — established: (1) Jews as legitimate targets for state-sponsored violence, (2) blood libel and conspiracy accusations as mobilization tools, and (3) confiscation of Jewish property as acceptable. The Spanish Inquisition (1478) and expulsion (1492) were operating within this established anti-Jewish violence framework.',
    confidence: 'high' },
  { id: 'black_death__battle_of_agincourt',
    source: 'black_death', target: 'battle_of_agincourt', type: 'ENABLED',
    label: 'Post-plague labor shortages empowered English yeoman archers whose class mobility changed medieval warfare',
    note: 'The Black Death\'s demographic catastrophe (1347-51) disrupted feudal labor relations: surviving peasants could negotiate better terms, creating social mobility that produced the English yeoman archer class. By Agincourt (1415), England\'s armies were composed largely of longbowmen from this socially empowered class — better trained, better motivated, and equipped with a weapon that required years of childhood training possible only in a society where peasant children had time for it. The Black Death created the demographic preconditions for the English tactical advantage that won Agincourt.',
    confidence: 'medium' },

  // ── oslo_accords: was completely isolated ─────────────────────────────────
  { id: 'six_day_war_1967__oslo_accords',
    source: 'six_day_war_1967', target: 'oslo_accords', type: 'ENABLED',
    label: 'Six-Day War\'s territorial conquests created the land-for-peace framework that Oslo operationalized',
    note: 'The Oslo Accords (1993) were structured entirely around the aftermath of the Six-Day War: Israel would exchange occupied territories (West Bank, Gaza, Golan Heights) for recognition and normalization. The \"land for peace\" formula was the only diplomatic framework available because the Six-Day War defined what Israel had to offer and what Palestinians were demanding. Oslo was an attempt to implement UN Resolution 242 (November 1967, written in direct response to the Six-Day War), which established the land-for-peace principle.',
    confidence: 'high' },
  { id: 'nakba__oslo_accords',
    source: 'nakba', target: 'oslo_accords', type: 'ENABLED',
    label: 'Palestinian refugee crisis from the Nakba was the unresolved humanitarian issue Oslo\'s permanent status talks were meant to address',
    note: 'The Oslo Accords deliberately deferred the most difficult issues — Palestinian refugee right of return (the Nakba\'s consequence), Jerusalem\'s status, and final borders — to \"permanent status negotiations\" to be resolved later. The Nakba created 700,000+ Palestinian refugees (1.5+ million by 1993 counting descendants) whose right of return was non-negotiable for Palestinians but existentially threatening to Israel as a Jewish state. Oslo\'s failure to address the refugee question — kicking it to permanent status talks that never resolved it — was its structural flaw.',
    confidence: 'high' },

  // ── malcolm_x: was completely isolated ────────────────────────────────────
  { id: 'civil_rights_movement__malcolm_x',
    source: 'civil_rights_movement', target: 'malcolm_x', type: 'ENABLED',
    label: 'The civil rights movement\'s milieu enabled Malcolm X\'s rise as its Black nationalist countervoice',
    note: 'Malcolm X emerged within and in reaction to the civil rights movement: his Nation of Islam-period critique of nonviolence and integration — \"by any means necessary,\" Black self-determination, rejection of integration as a white-controlled solution — represented the ideological alternative that the civil rights mainstream\'s success made space for but did not satisfy. His assassination (1965) and the subsequent collapse of the nonviolent strategy in face of police violence (1966-68) validated his critique for the Black Power generation.',
    confidence: 'high' },
  { id: 'malcolm_x__martin_luther_king_jr',
    source: 'malcolm_x', target: 'martin_luther_king_jr', type: 'SHARES_MECHANISM_WITH',
    label: 'Malcolm X and MLK represented the two poles of Black liberation strategy: integration vs. self-determination',
    note: 'Malcolm X (integration is capitulation to white supremacy; Black self-determination by any means necessary) and Martin Luther King Jr. (nonviolent direct action; beloved community; integration) are the defining dialectic of 20th-century Black American politics. They were tactical opposites serving the same objective (Black freedom and dignity), and each made the other more effective: Malcolm X\'s radicalism made King\'s demands seem moderate and negotiable to white power structures. Both were assassinated; both\'s intellectual frameworks remain foundational.',
    confidence: 'high' },

  // ── One-edge node strengthening ───────────────────────────────────────────
  { id: 'voltaire__adam_smith',
    source: 'voltaire', target: 'adam_smith', type: 'ENABLED',
    label: 'Voltaire\'s Scottish stay (1726-29) and French philosophical influence directly shaped Adam Smith\'s economics',
    note: 'Voltaire spent three years in England (1726-29) and published \"Letters Concerning the English Nation\" (1733) celebrating English religious toleration and commercial society — which he then brought back to French intellectual circles. His writings on English commerce and Protestant work ethic directly influenced the French Physiocrats (Quesnay) and, through them, Adam Smith. Smith spent time in France (1764-66) meeting Quesnay, Turgot, and others whose ideas had been partially shaped by Voltaire\'s translation of English commercial society into French intellectual terms.',
    confidence: 'medium' },
  { id: 'adam_smith__thomas_aquinas',
    source: 'adam_smith', target: 'thomas_aquinas', type: 'ENABLED',
    label: 'Smith\'s Wealth of Nations systematically dismantled the scholastic just-price theory Aquinas had codified',
    note: 'The Wealth of Nations (1776) is partly a sustained argument against the scholastic economic tradition that Aquinas systematized: just price theory, usury prohibition, and the view that trade creates no net value. Smith\'s price theory (prices emerge from supply and demand, not from inherent value) directly contradicts Aquinas\'s just-price theory. His critique of mercantilism implicitly attacks the Thomistic view of economic exchange as zero-sum. The Enlightenment economics of Smith is comprehensible as the rejection of medieval scholastic economics in favor of market mechanism.',
    confidence: 'high' },
  { id: 'friedrich_nietzsche__postmodernism_philosophy',
    source: 'friedrich_nietzsche', target: 'postmodernism_philosophy', type: 'ENABLED',
    label: 'Nietzsche\'s perspectivism and critique of objective truth is the direct philosophical ancestor of postmodernism',
    note: 'The line from Nietzsche to postmodernism runs through Heidegger to Derrida, Foucault, and Lyotard: Nietzsche\'s claim that there are no facts, only interpretations; that \"truth\" is a mobile army of metaphors; and that moral systems are will-to-power dressed in philosophical clothing — are the core postmodern claims in pre-postmodern form. Foucault explicitly cited Nietzsche as his primary influence. Derrida\'s deconstruction begins with Nietzsche\'s critique of metaphysics. Postmodernism is Nietzscheanism applied systematically to every domain of knowledge.',
    confidence: 'high' },
  { id: 'hannah_arendt__existentialism',
    source: 'hannah_arendt', target: 'existentialism', type: 'ENABLED',
    label: 'Arendt was Heidegger\'s student and lover; existentialism\'s analysis of authentic existence shaped her political philosophy',
    note: 'Hannah Arendt studied with and had a romantic relationship with Martin Heidegger (1924-28). Heidegger\'s existential analysis — the distinction between authentic existence and das Man (the anonymous crowd), the concepts of Dasein, thrownness, and fallenness — shaped Arendt\'s political philosophy in ways she never fully acknowledged. Her concept of the \"banality of evil\" (Eichmann as the ultimate das Man, substituting thoughtlessness for authentic moral choice) is existentialist analysis applied to totalitarianism. The irony: Heidegger joined the Nazi Party; his student applied his existentialism to analyze Nazism.',
    confidence: 'high' },
  { id: 'hannah_arendt__stalinist_purges',
    source: 'hannah_arendt', target: 'stalinist_purges', type: 'SHARES_MECHANISM_WITH',
    label: 'Arendt\'s Origins of Totalitarianism analyzed Nazi and Soviet terror as the same political form',
    note: 'Hannah Arendt\'s \"Origins of Totalitarianism\" (1951) argued that Nazism and Stalinism were not opposite ends of a political spectrum but the same novel political form — totalitarianism — distinguished by: total domination of all spheres of life, ideological reality replacement, systematic use of terror not for specific goals but as an end in itself, and the transformation of human beings into superfluous matter. The Stalinist purges and Nazi Holocaust are, for Arendt, manifestations of the same phenomenon, not comparable-but-different atrocities.',
    confidence: 'high' },
  { id: 'frederick_douglass__civil_rights_movement',
    source: 'frederick_douglass', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Douglass\'s intellectual framework — universal rights require active resistance, not patient waiting — was foundational for civil rights ideology',
    note: 'Frederick Douglass\'s core argument — \"Power concedes nothing without a demand; it never did and it never will\" — was the foundational claim for civil rights activism a century later. His writings on the moral and practical necessity of active resistance to oppression, on the hypocrisy of celebrating Fourth of July liberty while maintaining slavery (\"What to the Slave is the Fourth of July?\", 1852), and on the connection between Black liberation and American democratic ideals, were explicitly cited by civil rights leaders including MLK and John Lewis.',
    confidence: 'high' },
  { id: 'web_du_bois__civil_rights_movement',
    source: 'web_du_bois', target: 'civil_rights_movement', type: 'ENABLED',
    label: 'Du Bois co-founded the NAACP and his frameworks (double consciousness, talented tenth) were foundational for civil rights strategy',
    note: 'W.E.B. Du Bois co-founded the NAACP (1909) — the institutional backbone of the civil rights movement — and provided its core theoretical frameworks: \"double consciousness\" (Black Americans\' divided identity in a white society) and the \"talented tenth\" (educated Black elite as movement leadership). His methodological contribution was also decisive: \"The Philadelphia Negro\" (1899) established empirical sociology of Black urban life, providing the evidentiary basis for desegregation arguments. Du Bois is the civil rights movement\'s intellectual architect as well as its organizational founder.',
    confidence: 'high' },
  { id: 'stalinist_purges__mikhail_gorbachev',
    source: 'stalinist_purges', target: 'mikhail_gorbachev', type: 'ENABLED',
    label: 'Stalinist political economy\'s long-term failure created the conditions Gorbachev\'s reforms tried to address',
    note: 'Gorbachev\'s glasnost and perestroika were responses to the accumulated failures of Stalinist political economy: the command economy\'s technological stagnation, agricultural crisis, and military overextension that Stalinism had bequeathed to its successors. The specific political dysfunction Gorbachev tried to address — an economy that could mobilize resources but not innovate, and a party that could command but not receive honest information — were direct products of Stalinist purges eliminating any independent voice. Gorbachev\'s reforms were the attempted cure for Stalinism\'s long-term pathologies.',
    confidence: 'high' },
  { id: 'ayatollah_khomeini__rise_of_al_qaeda',
    source: 'ayatollah_khomeini', target: 'rise_of_al_qaeda', type: 'ENABLED',
    label: 'Khomeini\'s Islamic revolution demonstrated that political Islam could seize state power, inspiring Sunni Islamist movements',
    note: 'Khomeini\'s 1979 Islamic revolution transformed Islamist political thought globally: it proved that a religious revolution could overturn a secular modernizing state and establish an Islamic government. While Al-Qaeda is Sunni and Khomeini was Shia, the revolutionary example was cross-sectarian: Bin Laden explicitly cited the Iranian Revolution as evidence that Islamic governance was achievable. The 1979 revolution launched the era of political Islam as a governing ideology rather than a pietist alternative, inspiring both the subsequent Sunni Islamist movements and Al-Qaeda\'s jihadist wing.',
    confidence: 'high' },
  { id: 'confucius__laozi',
    source: 'confucius', target: 'laozi', type: 'SHARES_MECHANISM_WITH',
    label: 'Confucius and Laozi were contemporaneous Axial Age Chinese philosophers offering contrasting responses to Zhou dynasty collapse',
    note: 'Confucius (551–479 BCE) and Laozi (traditionally 6th-4th century BCE) were near-contemporaneous philosophers responding to the same historical context: the collapse of Zhou dynasty political order and the resulting social chaos. Their responses were structural opposites: Confucius proposed restoring social order through ritual, hierarchical ethics (ren, li), and meritocratic governance; Laozi proposed abandoning social convention in favor of natural spontaneity (wu wei) and the Way (Tao). Both traditions were responses to the same Axial Age crisis, producing China\'s defining philosophical duality.',
    confidence: 'high' },
  { id: 'frederick_douglass__web_du_bois',
    source: 'frederick_douglass', target: 'web_du_bois', type: 'ENABLED',
    label: 'Du Bois explicitly positioned himself as continuing and extending Douglass\'s abolitionist project into the Jim Crow era',
    note: 'Du Bois\'s \"The Souls of Black Folk\" (1903) opens with a debt to Douglass: the book is the post-Reconstruction continuation of Douglass\'s antebellum project. Du Bois\'s rejection of Booker T. Washington\'s accommodationism mirrors Douglass\'s rejection of colonization and gradualism. Both insisted on full citizenship rights immediately, not conditional future improvement. Du Bois\'s empirical sociology was also Douglass\'s methodology updated: Douglass used first-person testimony; Du Bois used social science data. Both asserted Black humanity against the same dehumanizing ideology.',
    confidence: 'high' },
]);

// Integrity
const allIds = new Set();
['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'].forEach(s =>
  JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allIds.add(n.id)));
let orphans = 0;
JSON.parse(fs.readFileSync(D('data/global/history/edges.json'))).forEach(e => {
  if (!allIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
});
console.log('Orphans:', orphans);
