#!/usr/bin/env node
// Add cross-scope mechanism edges for politics and history nodes
const fs = require('fs');
const path = require('path');
const D = p => path.join(__dirname, '..', p);

const edges = JSON.parse(fs.readFileSync(D('data/mechanisms/edges.json')));
const existingIds = new Set(edges.map(e => e.id));

const newEdges = [
  // ── Karl Marx ─────────────────────────────────────────────────────────────
  {
    id: 'hegelian_dialectic__karl_marx',
    source: 'hegelian_dialectic', target: 'karl_marx',
    type: 'ENABLED',
    label: 'Marx inverted Hegel\'s dialectic to produce historical materialism',
    note: 'Marx appropriated Hegel\'s dialectical method — thesis, antithesis, synthesis — but inverted it: where Hegel saw the dialectic as the movement of Spirit, Marx saw it as the movement of material conditions. "I found it standing on its head; I put it right way up." Without Hegel, no Marxist theory of history.',
    confidence: 'high'
  },
  {
    id: 'structural_violence__karl_marx',
    source: 'structural_violence', target: 'karl_marx',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Marx provided the foundational theory of structural violence',
    note: 'Marx\'s analysis of surplus value extraction, alienated labor, and class-based exploitation is the original systematic theory of structural violence — harm embedded in economic structures that requires no individual malicious intent, only participation in the system.',
    confidence: 'high'
  },

  // ── Vladimir Lenin ────────────────────────────────────────────────────────
  {
    id: 'democratic_backsliding__vladimir_lenin',
    source: 'democratic_backsliding', target: 'vladimir_lenin',
    type: 'ENABLED',
    label: 'Lenin\'s vanguard party model is the template for democratic backsliding',
    note: 'Lenin\'s theory of the revolutionary vanguard party — an elite of professional revolutionaries who know better than the masses what the masses need — provided the ideological justification for dismantling democratic institutions in the name of the proletariat. The Constituent Assembly dissolved in January 1918, one session after it produced an anti-Bolshevik majority.',
    confidence: 'high'
  },

  // ── Mao Zedong ────────────────────────────────────────────────────────────
  {
    id: 'dehumanization__mao_zedong',
    source: 'dehumanization', target: 'mao_zedong',
    type: 'ENABLED',
    label: 'Mao\'s Cultural Revolution deployed dehumanization against class enemies',
    note: 'The Cultural Revolution (1966–76) deployed systematic dehumanization of landlords, intellectuals, and "class enemies" — public struggle sessions, forced confessions, and mob violence. The dehumanization was the mechanism: once the target group was redefined as enemies of the people, ordinary participants felt licensed to commit atrocities.',
    confidence: 'high'
  },
  {
    id: 'groupthink__mao_zedong',
    source: 'groupthink', target: 'mao_zedong',
    type: 'ENABLED',
    label: 'Great Leap Forward catastrophe exemplifies groupthink preventing error correction',
    note: 'The Great Leap Forward (1958–62) killed an estimated 15–45 million people in famine while officials reported record harvests to avoid punishment. Local officials competed to report impossible grain yields; dissenting voices were silenced. Groupthink in an authoritarian hierarchy prevented the feedback that might have corrected the catastrophe.',
    confidence: 'high'
  },

  // ── Cold War ──────────────────────────────────────────────────────────────
  {
    id: 'manufactured_consent__cold_war',
    source: 'manufactured_consent', target: 'cold_war',
    type: 'ENABLED',
    label: 'Cold War mobilized the US state apparatus for domestic consent manufacture',
    note: 'The Cold War justified a domestic consent-manufacturing apparatus: House Un-American Activities Committee, loyalty oaths, FBI surveillance, and the alignment of media, universities, and labor unions with anticommunist ideology. Chomsky and Herman\'s manufactured consent analysis was built substantially on Cold War examples.',
    confidence: 'high'
  },
  {
    id: 'resource_curse__cold_war',
    source: 'resource_curse', target: 'cold_war',
    type: 'ENABLED',
    label: 'Cold War interventions entrenched the resource curse in developing nations',
    note: 'US and Soviet Cold War interventions in resource-rich nations (Iran 1953, Guatemala 1954, Congo 1960, Chile 1973) repeatedly installed resource-extraction-friendly governments that enriched elites while entrenching the resource curse — the correlation between natural resource wealth and poor governance outcomes.',
    confidence: 'high'
  },

  // ── Ronald Reagan ─────────────────────────────────────────────────────────
  {
    id: 'manufactured_consent__ronald_reagan',
    source: 'manufactured_consent', target: 'ronald_reagan',
    type: 'ENABLED',
    label: 'Reagan pioneered the permanent political communication apparatus',
    note: 'Reagan\'s administration operationalized the permanent campaign as governance: daily media strategy, stage-managed visuals, and message discipline that treated governing as consent manufacture. His communications operation transformed how all subsequent presidencies managed public opinion.',
    confidence: 'high'
  },
  {
    id: 'corporate_regulatory_capture__ronald_reagan',
    source: 'corporate_regulatory_capture', target: 'ronald_reagan',
    type: 'ENABLED',
    label: 'Reagan\'s regulatory rollback institutionalized corporate regulatory capture',
    note: 'Reagan\'s deregulation program — cutting EPA staffing, appointing industry representatives to regulatory agencies, reducing antitrust enforcement — institutionalized corporate regulatory capture as explicit policy rather than covert influence. The revolving door was opened wider and the ideology that regulators should facilitate rather than constrain industry became bipartisan common sense.',
    confidence: 'high'
  },

  // ── Citizens United ───────────────────────────────────────────────────────
  {
    id: 'corporate_regulatory_capture__citizens_united',
    source: 'corporate_regulatory_capture', target: 'citizens_united',
    type: 'ENABLED',
    label: 'Citizens United gave corporate money constitutional protection in politics',
    note: 'The Citizens United decision (2010) removed most limits on corporate political spending, giving corporate interests constitutional protection to fund political campaigns. It converted the regulatory capture mechanism from covert (lobbying) to overt (unlimited political advertising), making capture visible and legal simultaneously.',
    confidence: 'high'
  },
  {
    id: 'political_polarization__citizens_united',
    source: 'political_polarization', target: 'citizens_united',
    type: 'ENABLED',
    label: 'Unlimited political spending accelerated political polarization',
    note: 'Citizens United amplified political polarization by enabling ideologically extreme donors to fund primary campaigns against moderate incumbents. The mechanism: extreme donors fund extreme primary challengers; moderate politicians face electoral threats from their own party; legislative bodies shift to the extremes.',
    confidence: 'high'
  },

  // ── Voter Suppression ─────────────────────────────────────────────────────
  {
    id: 'structural_violence__voter_suppression_modern',
    source: 'structural_violence', target: 'voter_suppression_modern',
    type: 'ENABLED',
    label: 'Voter suppression is structural violence embedded in electoral law',
    note: 'Modern voter suppression — voter ID laws, polling place closures in minority-majority districts, voter roll purges — is structural violence in electoral form. It requires no explicitly racist intent: administering laws that have disparate impact achieves the same disenfranchisement as explicit exclusion.',
    confidence: 'high'
  },
  {
    id: 'democratic_backsliding__voter_suppression_modern',
    source: 'democratic_backsliding', target: 'voter_suppression_modern',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Voter suppression is a democratic backsliding mechanism in competitive democracy',
    note: 'Modern voter suppression exemplifies competitive authoritarian democratic backsliding: formal democratic institutions remain intact while the rules of competition are systematically skewed against opposition constituencies. It achieves authoritarian outcomes through technically legal means.',
    confidence: 'high'
  },

  // ── Tea Party Movement ────────────────────────────────────────────────────
  {
    id: 'legitimate_grievance_capture__tea_party_movement',
    source: 'legitimate_grievance_capture', target: 'tea_party_movement',
    type: 'ENABLED',
    label: 'Tea Party captured legitimate economic anxiety and routed it to corporate tax cuts',
    note: 'The Tea Party movement channeled genuine working-class economic anxiety (2008 financial crisis, job losses, bailouts) into a political agenda that primarily benefited the corporate interests that funded the movement (Koch Brothers). Legitimate grievances about bank bailouts were captured and redirected toward cutting programs that served the grievants.',
    confidence: 'high'
  },
  {
    id: 'radicalization_pipeline__tea_party_movement',
    source: 'radicalization_pipeline', target: 'tea_party_movement',
    type: 'ENABLED',
    label: 'Tea Party infrastructure became the radicalization pipeline for MAGA',
    note: 'The Tea Party radicalized the Republican base between 2009–2014, creating the constituency that elevated Trump in 2016. The pipeline ran: economic anxiety → Tea Party → "establishment" GOP rejection → Trump base. The organizational infrastructure (Fox News, talk radio, congressional freshmen) became the MAGA movement\'s skeleton.',
    confidence: 'high'
  },

  // ── Henry Kissinger ───────────────────────────────────────────────────────
  {
    id: 'moral_disengagement__henry_kissinger',
    source: 'moral_disengagement', target: 'henry_kissinger',
    type: 'ENABLED',
    label: 'Kissinger\'s realpolitik systematized moral disengagement in statecraft',
    note: 'Kissinger\'s diplomatic approach — supporting coups (Chile 1973), authorizing civilian bombing (Cambodia), enabling genocide (Bangladesh 1971) — exemplifies systematic moral disengagement: the cognitive and organizational reframing that separates actors from the moral consequences of their decisions. "Power is the ultimate aphrodisiac" — the personal and the systemic moral disengagement converge.',
    confidence: 'high'
  },
  {
    id: 'oil_geopolitics__henry_kissinger',
    source: 'oil_geopolitics', target: 'henry_kissinger',
    type: 'ENABLED',
    label: 'Kissinger shaped US oil geopolitics through petrodollar arrangements',
    note: 'Kissinger negotiated the petrodollar system (1974): Saudi Arabia prices oil in US dollars; the US provides military protection. This arrangement embedded oil geopolitics into the global financial architecture, making dollar hegemony and Middle East military presence structurally interdependent — a constraint on US foreign policy that persists.',
    confidence: 'high'
  },

  // ── Mahatma Gandhi ────────────────────────────────────────────────────────
  {
    id: 'ahimsa_principle__mahatma_gandhi',
    source: 'ahimsa_principle', target: 'mahatma_gandhi',
    type: 'ENABLED',
    label: 'Gandhi operationalized the ahimsa principle as mass political strategy',
    note: 'Gandhi transformed the ancient Hindu-Jain principle of ahimsa (non-violence) from personal ethical discipline into a mass political strategy — satyagraha (truth-force). The principle that moral force is superior to coercive force, instantiated in the Salt March and Non-Cooperation Movement, demonstrated that the ahimsa doctrine could dismantle empire.',
    confidence: 'high'
  },

  // ── Joseph Stalin ─────────────────────────────────────────────────────────
  {
    id: 'dehumanization__joseph_stalin',
    source: 'dehumanization', target: 'joseph_stalin',
    type: 'ENABLED',
    label: 'Stalinist purges deployed class-based dehumanization as liquidation mechanism',
    note: 'Stalin\'s purges required systematic dehumanization: kulaks as class enemies who deserved extermination, Trotskyites and wreckers as subhuman vermin, national minorities as inherently treacherous. The ideological dehumanization preceded and enabled the physical liquidation — Great Terror (1936–38), collectivization famine, deportations.',
    confidence: 'high'
  },
  {
    id: 'preference_falsification__joseph_stalin',
    source: 'preference_falsification', target: 'joseph_stalin',
    type: 'ENABLED',
    label: 'Stalinist terror produced maximal preference falsification',
    note: 'The Stalinist terror system — where expressing doubt about collectivization, the show trials, or Stalin\'s decisions was potentially fatal — produced systematic preference falsification at mass scale. Populations publicly applauded what they privately opposed. This was both a psychological condition and a systemic feature that made the regime\'s collapse sudden and surprising when it came.',
    confidence: 'high'
  },

  // ── Heinrich Himmler ──────────────────────────────────────────────────────
  {
    id: 'dehumanization__heinrich_himmler',
    source: 'dehumanization', target: 'heinrich_himmler',
    type: 'ENABLED',
    label: 'Himmler industrialized dehumanization as bureaucratic management',
    note: 'Himmler\'s SS was the organizational embodiment of dehumanization as bureaucratic system: mass murder through paperwork, industrial processes, and organizational hierarchy. Himmler himself avoided witnessing the murders — the bureaucratic disembodiment of killing is the purest form of moral disengagement.',
    confidence: 'high'
  },
  {
    id: 'moral_disengagement__heinrich_himmler',
    source: 'moral_disengagement', target: 'heinrich_himmler',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Himmler exemplifies moral disengagement through bureaucratic mediation',
    note: 'Himmler\'s famous fainting episode at an Einsatzgruppen execution and his subsequent push for gas chambers (as less psychologically damaging to perpetrators) reveals the moral disengagement mechanism: the goal was not to eliminate moral concern but to mediate it through bureaucratic distance that made harm invisible to perpetrators.',
    confidence: 'high'
  },

  // ── Pol Pot ───────────────────────────────────────────────────────────────
  {
    id: 'dehumanization__pol_pot',
    source: 'dehumanization', target: 'pol_pot',
    type: 'ENABLED',
    label: 'Khmer Rouge ideology dehumanized intellectuals, urbanites, and ethnic minorities',
    note: 'The Khmer Rouge\'s Year Zero ideology systematically dehumanized educated people, urban dwellers, and ethnic Vietnamese as "enemies of the people" incompatible with agrarian utopia. Glasses marked one as an intellectual; Vietnamese identity marked one for execution. Dehumanization enabled a genocide that killed 25% of Cambodia\'s population.',
    confidence: 'high'
  },

  // ── Leopold II ────────────────────────────────────────────────────────────
  {
    id: 'structural_violence__leopold_ii_belgium',
    source: 'structural_violence', target: 'leopold_ii_belgium',
    type: 'ENABLED',
    label: 'Leopold\'s Congo Free State was structural violence institutionalized as private enterprise',
    note: 'Leopold\'s Congo (1885–1908) was structural violence in its purest corporate form: a privately held territory where the infrastructure (Force Publique, rubber quotas, hand-severing enforcement) was systematically designed to extract maximum profit through violence. Approximately 10 million Congolese died. The structural design required no individual sadism — only compliance with the system\'s demands.',
    confidence: 'high'
  },
  {
    id: 'dehumanization__leopold_ii_belgium',
    source: 'dehumanization', target: 'leopold_ii_belgium',
    type: 'ENABLED',
    label: 'Belgian colonial dehumanization enabled the Congo atrocities',
    note: 'The Congo atrocities depended on the racial dehumanization that characterized Belgian colonial ideology: Congolese people as children requiring civilization, or as labor units requiring productivity quotas. The severed hand became the symbol — a unit of accounting in a dehumanizing system.',
    confidence: 'high'
  },

  // ── Martin Luther (person) ────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__martin_luther',
    source: 'in_group_out_group_dynamics', target: 'martin_luther',
    type: 'ENABLED',
    label: 'Luther\'s Reformation hardened in-group/out-group boundaries with lethal consequences',
    note: 'Luther\'s Reformation created new confessional in-group/out-group structures that shaped European politics for two centuries. The formula cuius regio, eius religio (whose realm, his religion) produced mass population transfers, the Thirty Years\' War, and St. Bartholomew\'s Day Massacre — violence structured by the same in-group/out-group mechanism that preceded it, now with doctrinal rather than ethnic content.',
    confidence: 'high'
  },

  // ── Osama bin Laden ───────────────────────────────────────────────────────
  {
    id: 'wahhabism_salafism__osama_bin_laden',
    source: 'wahhabism_salafism', target: 'osama_bin_laden',
    type: 'ENABLED',
    label: 'Wahhabism provided the theological framework for bin Laden\'s jihadism',
    note: 'Bin Laden was shaped by Wahhabi theology and Sayyid Qutb\'s radical extension of it: the concept of takfir (declaring other Muslims apostates), the obligation of offensive jihad, and the framing of all compromise with Western modernity as apostasy. Without the Saudi-funded global expansion of Wahhabi theology, the Al-Qaeda ideological formation is unintelligible.',
    confidence: 'high'
  },
  {
    id: 'radicalization_pipeline__osama_bin_laden',
    source: 'radicalization_pipeline', target: 'osama_bin_laden',
    type: 'ENABLED',
    label: 'Bin Laden operated a physical radicalization pipeline through Afghanistan',
    note: 'The Afghan jihad training camps (1980s–2001) were a physical radicalization pipeline: young Muslim men with grievances were recruited, indoctrinated in Wahhabi-jihadist theology, trained militarily, and deployed globally. This physical pipeline prefigures the digital radicalization pipeline; the mechanism is identical, only the medium differs.',
    confidence: 'high'
  },

  // ── Gamal Nasser ──────────────────────────────────────────────────────────
  {
    id: 'oil_geopolitics__gamal_nasser',
    source: 'oil_geopolitics', target: 'gamal_nasser',
    type: 'ENABLED',
    label: 'Nasser\'s nationalization of the Suez Canal reshaped oil geopolitics',
    note: 'Nasser\'s 1956 nationalization of the Suez Canal Company challenged Western control of Middle Eastern energy infrastructure and triggered the Suez Crisis. His pan-Arab nationalism demonstrated that resource nationalism could succeed against colonial powers, influencing subsequent nationalizations (Libya 1969, Iraq 1972, Iran 1979).',
    confidence: 'high'
  },

  // ── Genghis Khan ──────────────────────────────────────────────────────────
  {
    id: 'dehumanization__genghis_khan',
    source: 'dehumanization', target: 'genghis_khan',
    type: 'ENABLED',
    label: 'Mongol terror strategy required the dehumanization of resisting populations',
    note: 'Mongol strategic terror — the deliberate massacre of cities that resisted — required the dehumanization of enemy populations as obstacles to be eliminated rather than people to be ruled. Cities that submitted were spared; cities that resisted were destroyed and their populations killed. The conditional dehumanization was itself the terror mechanism.',
    confidence: 'high'
  },

  // ── Charles Darwin ────────────────────────────────────────────────────────
  {
    id: 'cultural_hegemony__charles_darwin',
    source: 'cultural_hegemony', target: 'charles_darwin',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Social Darwinism misappropriated Darwin to naturalize class hierarchy',
    note: 'Darwin\'s evolution theory was rapidly misappropriated into "Social Darwinism" — the application of natural selection to human society to naturalize class hierarchy, racial hierarchy, and imperial competition. Darwin himself resisted some of these extensions. The misappropriation shows how scientific authority (cultural hegemony through science) can be captured for ideological purposes.',
    confidence: 'high'
  },

  // ── Sunni-Shia Split ──────────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__sunni_shia_split',
    source: 'in_group_out_group_dynamics', target: 'sunni_shia_split',
    type: 'ENABLED',
    label: 'The Sunni-Shia split is the foundational in-group/out-group fracture of Islamic civilization',
    note: 'The question of Ali\'s succession (632 CE) created Islam\'s primary confessional in-group/out-group fracture. Over fourteen centuries, this theological dispute has been activated and deactivated by political actors who found communal identity useful for mobilization. The Iran-Saudi Arabia proxy conflict is the contemporary expression of this ancient in-group/out-group dynamic.',
    confidence: 'high'
  },
  {
    id: 'collective_trauma__sunni_shia_split',
    source: 'collective_trauma', target: 'sunni_shia_split',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Karbala is the foundational collective trauma of Shia identity',
    note: 'The Battle of Karbala (680 CE) — the killing of Hussein ibn Ali and his companions — is the constitutive collective trauma of Shia Islam, annually re-enacted in Ashura. Collective trauma becomes identity: the Shia sense of persecution, martyrdom, and righteousness-in-defeat is built on the transmission of this historical trauma across generations.',
    confidence: 'high'
  },

  // ── September 11 Attacks ──────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__september_11_attacks',
    source: 'in_group_out_group_dynamics', target: 'september_11_attacks',
    type: 'ENABLED',
    label: 'September 11 triggered mass in-group/out-group reconfiguration',
    note: 'September 11 produced an immediate, massive reconfiguration of in-group/out-group dynamics in the US and globally. Muslims and Arab-Americans became an out-group; "American" identity was redefined around a traumatic in-group boundary. This reconfiguration enabled the Iraq War, surveillance expansion, and ongoing Islamophobia — all predictable from in-group/out-group activation.',
    confidence: 'high'
  },
  {
    id: 'collective_trauma__september_11_attacks',
    source: 'collective_trauma', target: 'september_11_attacks',
    type: 'CAUSED',
    label: 'September 11 produced collective trauma that structured two decades of US policy',
    note: 'The September 11 attacks are the clearest recent example of collective trauma transmission: a shared catastrophic experience that produced lasting psychological, political, and institutional effects. The trauma structured the post-9/11 surveillance state, two wars, and a political culture of security theater that outlasted the immediate threat.',
    confidence: 'high'
  },

  // ── Balfour Declaration ───────────────────────────────────────────────────
  {
    id: 'israel_palestine_conflict__balfour_declaration',
    source: 'israel_palestine_conflict', target: 'balfour_declaration',
    type: 'ENABLED',
    label: 'The Balfour Declaration is the originating document of the Israel-Palestine conflict',
    note: 'The Balfour Declaration (1917) — "a national home for the Jewish people" in Palestine — while also promising not to prejudice "the civil and religious rights of existing non-Jewish communities" — created the structural contradiction that has generated the ongoing conflict. The impossibility of fulfilling both promises is built into the document itself.',
    confidence: 'high'
  },

  // ── Sykes-Picot Agreement ─────────────────────────────────────────────────
  {
    id: 'structural_violence__sykes_picot_agreement',
    source: 'structural_violence', target: 'sykes_picot_agreement',
    type: 'ENABLED',
    label: 'Sykes-Picot embedded structural violence into the modern Middle East',
    note: 'The Sykes-Picot Agreement (1916) divided the Middle East between British and French spheres of influence, drawing borders that cut across ethnic, religious, and tribal communities. The borders created minority-majority configurations that would require violent suppression to maintain — structural violence embedded in the territorial definition of states.',
    confidence: 'high'
  },

  // ── Iranian Revolution 1979 ───────────────────────────────────────────────
  {
    id: 'wahhabism_salafism__iranian_revolution_1979',
    source: 'wahhabism_salafism', target: 'iranian_revolution_1979',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Iranian Revolution and Wahhabism are competing Islamist political theologies',
    note: 'The Iranian Revolution (1979) and Saudi Wahhabism both represent political Islam but from competing theological traditions. The Iranian model (Shia velayat-e faqih) and Wahhabi Sunni salafism have been in proxy conflict since 1979, structuring Middle East conflicts through competing claims to represent authentic Islamic governance. The theological competition is simultaneously a geopolitical resource war.',
    confidence: 'high'
  },

  // ── Stoicism ──────────────────────────────────────────────────────────────
  {
    id: 'social_contract_theory__stoicism',
    source: 'social_contract_theory', target: 'stoicism',
    type: 'SHARES_MECHANISM_WITH',
    label: 'Stoic cosmopolitanism prefigures social contract universalism',
    note: 'Stoic philosophy — particularly Marcus Aurelius and Epictetus — developed a cosmopolitan ethics that recognized all humans as sharing in the rational logos, regardless of citizenship status. This universalism prefigures the social contract tradition\'s extension of natural rights to all persons, contra the Athenian restriction of citizenship. The intellectual genealogy from Stoicism to natural rights theory is substantial.',
    confidence: 'medium'
  },

  // ── Paul of Tarsus ────────────────────────────────────────────────────────
  {
    id: 'cultural_hegemony__paul_of_tarsus',
    source: 'cultural_hegemony', target: 'paul_of_tarsus',
    type: 'ENABLED',
    label: 'Paul transformed a Jewish sect into a universal cultural hegemony',
    note: 'Paul\'s theological innovations — the gentile mission, faith over works, universal salvation through Christ — were the organizational decisions that transformed a Jewish reform movement into a universal religion. His letters established the cultural and doctrinal architecture that enabled Christianity to become, via Constantine, the hegemonic culture of Western civilization.',
    confidence: 'high'
  },

  // ── Jesus of Nazareth ─────────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__jesus_of_nazareth',
    source: 'in_group_out_group_dynamics', target: 'jesus_of_nazareth',
    type: 'ENABLED',
    label: 'Jesus systematically challenged in-group/out-group boundaries',
    note: 'Jesus\' teachings and actions repeatedly violated in-group/out-group boundaries: healing the Samaritan, Canaanite woman, Roman centurion\'s servant; eating with tax collectors and sinners; the Good Samaritan parable. The early Christian community\'s dissolution of ethnic and class distinctions ("neither Jew nor Greek, slave nor free") was a direct extension of this challenge.',
    confidence: 'high'
  },

  // ── Muhammad ibn Abdallah ─────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__muhammad_ibn_abdallah',
    source: 'in_group_out_group_dynamics', target: 'muhammad_ibn_abdallah',
    type: 'ENABLED',
    label: 'Muhammad created a new in-group (umma) that superseded tribal identity',
    note: 'Muhammad\'s critical political innovation was the Constitution of Medina: replacing the tribal in-group (clan loyalty as primary) with the umma (Muslim community as primary in-group). This was a radical restructuring of in-group/out-group dynamics: tribal loyalty was subordinated to religious identity, enabling a multi-tribal political community. The same reconstitution of in-group boundaries was the mechanism of early Islamic expansion.',
    confidence: 'high'
  },

  // ── Winston Churchill ─────────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__winston_churchill',
    source: 'in_group_out_group_dynamics', target: 'winston_churchill',
    type: 'ENABLED',
    label: 'Churchill\'s colonial in-group/out-group views enabled imperial atrocities',
    note: 'Churchill\'s explicit racial hierarchy — his view of Indians as "a beastly people with a beastly religion," his blocking of famine relief in Bengal (1943, killing 3+ million) — reflects in-group/out-group dynamics operating at imperial scale. The same person who resisted Hitler applied similar logic to colonized peoples, revealing that anti-fascism and colonial racism were psychologically compatible in the same worldview.',
    confidence: 'high'
  },

  // ── Nikita Khrushchev ─────────────────────────────────────────────────────
  {
    id: 'preference_falsification__nikita_khrushchev',
    source: 'preference_falsification', target: 'nikita_khrushchev',
    type: 'ENABLED',
    label: 'Khrushchev\'s Secret Speech revealed the scale of Stalinist preference falsification',
    note: 'Khrushchev\'s 1956 Secret Speech denouncing Stalin revealed — at the highest levels of the Communist Party — how extensively preference falsification had operated: party members who privately doubted Stalinist claims had publicly applauded them for decades. The speech itself was a mass preference revelation event that shocked the international communist movement.',
    confidence: 'high'
  },

  // ── Harriet Tubman ────────────────────────────────────────────────────────
  {
    id: 'structural_violence__harriet_tubman',
    source: 'structural_violence', target: 'harriet_tubman',
    type: 'ENABLED',
    label: 'Tubman navigated and resisted structural violence embedded in American law',
    note: 'Tubman\'s Underground Railroad operated against the structural violence of the Fugitive Slave Act and the entire legal apparatus of slavery. Her resistance demonstrates that structural violence is not unchangeable: organized individual and collective action can create exit routes even when the legal structure makes escape criminal.',
    confidence: 'high'
  },

  // ── Saladin ───────────────────────────────────────────────────────────────
  {
    id: 'in_group_out_group_dynamics__saladin',
    source: 'in_group_out_group_dynamics', target: 'saladin',
    type: 'ENABLES',
    label: 'Saladin unified fractured Muslim in-groups to counter Crusader out-groups',
    note: 'Saladin\'s political achievement was unifying the fractured Muslim world (Sunni, Shia, Arab, Kurdish, Egyptian, Syrian) against the Crusader out-group. His genius was making the Crusader presence the dominant in-group/out-group frame, subordinating inter-Muslim conflicts. His magnanimity toward the Crusader out-group after victory deliberately contrasted with their 1099 massacre.',
    confidence: 'high'
  },

  // ── Church Committee ──────────────────────────────────────────────────────
  {
    id: 'democratic_backsliding__church_committee',
    source: 'democratic_backsliding', target: 'church_committee',
    type: 'ENABLED',
    label: 'The Church Committee documented systematic democratic backsliding in US intelligence',
    note: 'The Church Committee (1975–76) documented the CIA\'s COINTELPRO, NSA domestic surveillance, assassination plots, and covert domestic operations — systematic violations of democratic norms by the intelligence apparatus. The committee\'s reforms (creating FISA courts, intelligence oversight committees) were the institutional response to demonstrated democratic backsliding.',
    confidence: 'high'
  },

  // ── Iranian Revolution (through collective trauma) ────────────────────────
  {
    id: 'collective_trauma__iranian_revolution_1979',
    source: 'collective_trauma', target: 'iranian_revolution_1979',
    type: 'ENABLED',
    label: 'The Iranian Revolution channeled collective trauma of Mossadegh coup and SAVAK',
    note: 'The 1979 revolution was driven partly by collective trauma: the 1953 CIA-backed coup that removed Mossadegh, decades of SAVAK torture and surveillance, and the humiliations of US-backed Pahlavi modernization that felt like cultural colonization. Khomeini successfully mobilized this collective trauma as revolutionary energy.',
    confidence: 'high'
  },
];

let added = 0, skipped = 0;
for (const e of newEdges) {
  if (existingIds.has(e.id)) { skipped++; continue; }
  edges.push(e);
  existingIds.add(e.id);
  added++;
}

fs.writeFileSync(D('data/mechanisms/edges.json'), JSON.stringify(edges, null, 2));
console.log('Added:', added, '| Skipped:', skipped);
console.log('Mechanism edges total:', edges.length);

// Integrity check
const allNodeIds = new Set();
const scopes = ['mechanisms','global/media','global/health','global/psychology','global/politics','global/history'];
for (const s of scopes) JSON.parse(fs.readFileSync(D('data/'+s+'/nodes.json'))).forEach(n => allNodeIds.add(n.id));
let orphans = 0;
for (const e of edges) {
  if (!allNodeIds.has(e.source)) { console.log('ORPHAN src:', e.source); orphans++; }
  if (!allNodeIds.has(e.target)) { console.log('ORPHAN tgt:', e.target); orphans++; }
}
console.log('Orphans:', orphans);
