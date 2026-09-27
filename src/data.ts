/**
 * Every number in this file was verified against a primary or independently
 * operated source on 27 September 2026. Where a figure is vendor-reported,
 * mixed-harness, or contested, it is flagged inline. See SOURCES at the bottom.
 */

export type Side = 'east' | 'west';

export type Model = {
	id: string;
	name: string;
	vendor: string;
	side: Side;
	/** AA Intelligence Index v4.3, max effort unless noted. */
	index: number;
	/** Artificial Analysis cost-per-task, USD. */
	costPerTask: number;
	/** Output tokens/sec on the default provider. */
	tps: number;
	/** Time to first token, seconds. */
	ttft: number;
	/** API list price, USD per million tokens. */
	priceIn: number;
	priceOut: number;
	context: string;
	/** Abbreviated context for the card chip. */
	ctxShort: string;
	weights: 'Open' | 'Closed';
	license: string;
	/** Params total/active, human readable. */
	params: string;
	/** One-line honest characterisation. */
	lede: string;
	/** Short array of genuine strengths. */
	wins: string[];
	/** Short array of genuine weaknesses. */
	losses: string[];
	/** Footnote markers, e.g. an asterisk. */
	flag?: string;
};

export const MODELS: Model[] = [
	// ───────────────────────────── East ─────────────────────────────
	{
		id: 'deepseek-v4-pro',
		name: 'DeepSeek V4 Pro',
		vendor: 'DeepSeek · Hangzhou',
		side: 'east',
		index: 36,
		costPerTask: 0.67,
		tps: 100,
		ttft: 1.7,
		priceIn: 1.32,
		priceOut: 3.96,
		context: '1,000,000',
		ctxShort: '1M',
		weights: 'Open',
		license: 'MIT',
		params: '1.6T / 49B active',
		lede: 'The most permissively licensed model at the frontier, and the cheapest serious one to run yourself.',
		wins: [
			'MIT licence — no revenue gate, no attribution clause, no MaaS review',
			'1M context with 384K max output, the largest output cap of any open-weight model',
			'V4-Flash runs on two RTX 4090s; the only true single-workstation option at this tier',
			'Accepts both the OpenAI and Anthropic message formats, so existing clients just work',
		],
		losses: [
			'Index 36 — the lowest of the ten models on this page',
			'V4-Pro weights are ~865 GB; the practical local story is the smaller V4-Flash',
			'Peak-hour pricing doubles to $1.32 / $3.96 during weekday UTC business hours',
			'No first-party multimodal story as clean as Gemini or Muse',
		],
	},
	{
		id: 'qwen38-max',
		name: 'Qwen3.8 Max',
		vendor: 'Alibaba Cloud · Hangzhou',
		side: 'east',
		index: 45,
		costPerTask: 5.41,
		tps: 39,
		ttft: 3.0,
		priceIn: 2.0,
		priceOut: 6.0,
		context: '1,000,000 hosted / 262,144 native',
		ctxShort: '1M hosted · 262K native',
		weights: 'Open',
		license: 'Custom qwen3.8-max',
		params: '2.4T / 95B active',
		lede: 'The broadest multilingual reach of any lab on either side — and the only genuine two-region data-residency story.',
		wins: [
			'Best-documented Chinese and Southeast-Asian multilingual coverage in the industry',
			'Two-region offering — China (Beijing) and International — with separate pricing',
			'Token Plan subscriptions speak both OpenAI- and Anthropic-compatible APIs, so Claude Code and Cursor work unchanged',
			'First open-weight release of a Qwen-Max-class model',
		],
		losses: [
			'The custom licence is a regression — Qwen3.6 and the 27B sibling were Apache 2.0',
			'The open weights are text-only; the hosted model is the multimodal one. They are not the same model',
			'Alibaba’s own reference deployment is 72× Blackwell Ultra. "Open" here means downloadable, not runnable',
			'Slowest of the eastern group at 39 tokens/sec',
		],
		flag: '†',
	},
	{
		id: 'kimi-k3',
		name: 'Kimi K3',
		vendor: 'Moonshot AI · Beijing',
		side: 'east',
		index: 44,
		costPerTask: 2.0,
		tps: 35,
		ttft: 5.2,
		priceIn: 3.0,
		priceOut: 15.0,
		context: '1,048,576',
		ctxShort: '1M',
		weights: 'Open',
		license: 'Custom Kimi K3',
		params: '2.8T / 104B active',
		lede: 'The only Chinese model in the Arena top ten — and it got there on a fraction of the vote count.',
		wins: [
			'Ranked #10 on the Arena agent board, #8 on text — the strongest human-preference showing by any Chinese lab',
			'BrowseComp 90.4 at full 1M context with no context management, per Moonshot',
			'On Amazon Bedrock since 18 September 2026 — the cleanest sovereignty path for a Chinese open-weight model',
			'A 90% cache-read discount makes it far cheaper on real agentic workloads than the sticker price suggests',
		],
		losses: [
			'$15/M output is the second-most expensive on this page, behind only Claude Fable',
			'Slowest frontier-tier model in the world at 35 tokens/sec',
			'2.8T parameters is ~1.4 TB at MXFP4 — Moonshot’s own guidance is a supernode of 64+ accelerators',
			'The Kimi K3 licence is not the "modified MIT" its K2 predecessor carried. MaaS above $20M/yr needs a separate agreement',
		],
		flag: '‡',
	},
	{
		id: 'glm-5-3',
		name: 'GLM-5.3',
		vendor: 'Z.AI (Zhipu) · Beijing',
		side: 'east',
		index: 45,
		costPerTask: 2.01,
		tps: 84,
		ttft: 2.7,
		priceIn: 1.4,
		priceOut: 4.4,
		context: '1,048,576',
		ctxShort: '1M',
		weights: 'Open',
		license: 'Custom GLM-5.3',
		params: '744B / 40B active',
		lede: 'The best-documented domestic-silicon deployment in the industry, and the only one that has shipped on 100,000 Chinese chips.',
		wins: [
			'Index 45 at 84 tokens/sec and 2.7s time-to-first-token — the best latency result at frontier capability',
			'GLM-5.3-Flash is MIT at $0.15 / $0.50, roughly a fortieth of Claude Opus list price',
			'Served on more than 100,000 domestically-made accelerators; Z.AI runs a 1 GW data centre with no Nvidia silicon',
			'Ascend serving paths are documented in vLLM-Ascend, xLLM and SGLang Ascend',
		],
		losses: [
			'The custom licence still gates MaaS — though at a $10B revenue threshold, the most permissive of the custom ones',
			'Z.AI held the weights back for two weeks after launch because cyber capability developed faster than expected, and published no hardening report',
			'Z.AI’s own API is where the FreedomBench refusals concentrate — the same weights score far better on a third-party host',
			'GLM-5.3 is text-only; only the Flash variant is multimodal',
		],
		flag: '‡',
	},
	{
		id: 'mimo-v2-6-pro',
		name: 'MiMo-V2.6-Pro',
		vendor: 'Xiaomi · Beijing',
		side: 'east',
		index: 46,
		costPerTask: 0.13,
		tps: 44,
		ttft: 3.8,
		priceIn: 0.435,
		priceOut: 0.87,
		context: '1,048,576',
		ctxShort: '1M',
		weights: 'Open',
		license: 'MIT',
		params: '1.02T / 42B active',
		lede: 'The number one open-weights model in the world, at one fifth the price of the American model it matches.',
		wins: [
			'AA index 46 — level with Grok 4.7, at $0.435 / $0.87 against $2.00 / $6.00',
			'$0.13 per index task makes it roughly 25× cheaper than Claude Fable 5.1 in the same capability band',
			'MIT licence, fully permissive, no strings',
			'Omnimodal on both tiers — text, image, video and audio in — and released six days before this snapshot',
		],
		losses: [
			'Six days old at time of writing. The benchmark record is one snapshot old and will move',
			'No published hardware guidance or throughput figures at all — a genuine gap for self-hosters',
			'At 1.02T parameters, 4-bit is still ~565 GB and the reference deployment is a two-node 16-GPU cluster',
			'Unknown ecosystem maturity compared with Qwen or DeepSeek',
		],
		flag: '†',
	},

	// ───────────────────────────── West ─────────────────────────────
	{
		id: 'claude-opus-5-5',
		name: 'Claude Opus 5.5',
		vendor: 'Anthropic · United States',
		side: 'west',
		index: 58,
		costPerTask: 5.98,
		tps: 82,
		ttft: 33.2,
		priceIn: 4.0,
		priceOut: 20.0,
		context: '1,000,000',
		ctxShort: '1M',
		weights: 'Closed',
		license: 'Proprietary',
		params: 'Undisclosed',
		lede: 'The most capable model on this page, and the only one with a documented, auditable refusal policy.',
		wins: [
			'AA index 58 — the outright leader, with GPT-6 Astra tied-behind at 53',
			'Anthropic and Google lead the independent Chinese-language evaluation, which undercuts the easy story',
			'Cache reads at $0.20/M cut typical agentic workload cost by roughly 30–40% versus the sticker price',
			'The broadest deployment surface of any lab: Bedrock, Vertex, Microsoft Foundry, Claude Code',
		],
		losses: [
			'$4 / $20 list price, and there is no weight you can download or host yourself',
			'Several published figures are marked "with fallback" — the endpoint silently routes to an older model at capacity',
			'Fable 5.1 scored zero on OSWorld 2.0 where safeguards intervened, then fell back to a different model. Published numbers are floored by guardrails, not capability',
			'Preserved thinking blocks API users from editing prior context to extract reasoning',
		],
		flag: '§',
	},
	{
		id: 'gpt-6-astra',
		name: 'GPT-6 Astra',
		vendor: 'OpenAI · United States',
		side: 'west',
		index: 53,
		costPerTask: 3.26,
		tps: 63,
		ttft: 323.8,
		priceIn: 10.0,
		priceOut: 50.0,
		context: '1,050,000',
		ctxShort: '1.05M',
		weights: 'Closed',
		license: 'Proprietary',
		params: 'Undisclosed',
		lede: 'The deepest reasoning and the most capable agent on this page, at a price and a latency that are hard to defend.',
		wins: [
			'Tied for first on the AA index, and first on Arena at 10.85% share behind only Claude Fable',
			'ARC-AGI-3 at 99.9, ExploitBench at 100%, Agents’ Last Exam 59.3 — the strongest published agentic numbers',
			'VPC deployment through Azure and Bedrock, with zero-data-retention options on Bedrock',
			'GPT-6 Luna costs $0.03–0.07 per task — the cheapest frontier entry in the entire leaderboard',
		],
		losses: [
			'$10 / $50 is the second-highest list price here, and prompts over 272K bill at 2× input and 1.5× output for the whole request',
			'323.8 seconds to first token at max effort — the slowest frontier model on earth by an order of magnitude',
			'No weights, no self-hosting, no on-prem. The only privacy story is someone else’s cloud account',
			'OpenAI quotes the AA index at v4.1.1, not v4.3. Its own launch page and the live leaderboard disagree by eight points',
		],
		flag: '§',
	},
	{
		id: 'muse-spark-1-3',
		name: 'Muse Spark 1.3',
		vendor: 'Meta · United States',
		side: 'west',
		index: 48,
		costPerTask: 1.6,
		tps: 214,
		ttft: 25.4,
		priceIn: 1.25,
		priceOut: 4.25,
		context: '1,048,576',
		ctxShort: '1M',
		weights: 'Closed',
		license: 'Proprietary',
		params: 'Undisclosed',
		lede: 'The reason the two-sided framing of this page no longer quite works.',
		wins: [
			'American, closed, and #5 in the world at index 48 — the strongest non-Anthropic, non-OpenAI model',
			'$1.60 per index task is 2.5× cheaper per capability point than Claude Fable 5.1',
			'214 tokens/sec at index 48. Nothing else combines that capability with that speed',
			'Omnimodal input including video and audio, plus a 943,718-token output cap',
		],
		losses: [
			'Closed weights, despite Meta’s public history of open releases and a promised open-weight follow-up with no date',
			'Meta’s actual open model, Muse Glimmer 30B, is a distilled small model scoring about 26 on the index',
			'The Contributor tier is 12–75× cheaper only because Meta trains on your prompts',
			'Audio understanding is degraded in 1.3; Meta tells you to use 1.2 instead',
		],
		flag: '¶',
	},
	{
		id: 'grok-4-7',
		name: 'Grok 4.7',
		vendor: 'xAI (SpaceXAI) · United States',
		side: 'west',
		index: 46,
		costPerTask: 3.74,
		tps: 82,
		ttft: 48.1,
		priceIn: 2.0,
		priceOut: 6.0,
		context: '500,000',
		ctxShort: '500K',
		weights: 'Closed',
		license: 'Proprietary',
		params: 'Undisclosed',
		lede: 'Sold on price-performance rather than supremacy — and a Chinese MIT model matches its index at a fifth of the price.',
		wins: [
			'Index 46 with a $2 / $6 price point against Fable’s $10 / $50',
			'Best-calibrated safeguards of any lab on this page: strong jailbreak resistance with low refusal rates on legitimate security and biology work',
			'Zero-data-retention and disallow-prompt-training available',
			'Grok 4.3 and 4.20 still offer 1M context at $1.25 / $2.50',
		],
		losses: [
			'500K context, the smallest window on this page — half of everyone else',
			'The launch included no clean independent benchmark sweep, and reporting put it behind Fable and Astra on several frontier evals',
			'xAI was acquired by SpaceX in an all-stock deal, so the model’s ownership is now a corporate question as much as a technical one',
			'Closed weights, no open tier at all',
		],
		flag: '†',
	},
	{
		id: 'gemini-3-8-flash',
		name: 'Gemini 3.8 Flash',
		vendor: 'Google DeepMind · United States',
		side: 'west',
		index: 41,
		costPerTask: 1.24,
		tps: 306,
		ttft: 29.8,
		priceIn: 0.75,
		priceOut: 3.75,
		context: '1,000,000',
		ctxShort: '1M',
		weights: 'Closed',
		license: 'Proprietary',
		params: 'Undisclosed',
		lede: 'The best speed-and-capability combination in the world, at an introductory price that doubles in January.',
		wins: [
			'306 tokens/sec at index 41 — nothing else in the world is faster at that capability',
			'Full omni input: text, image, audio and video in',
			'Vertex AI gives the strongest genuine VPC, on-prem and CMEK paths of any Western lab',
			'#3 on the Arena text board, ahead of Kimi K3 and Qwen3.8 Max',
		],
		losses: [
			'The $0.75 / $3.75 rate is introductory and doubles to $1.50 / $7.50 on 1 January 2027',
			'29.8 seconds to first reasoning token — a genuine latency cost of thinking out loud',
			'Google’s own model card concedes some domains are still limited to a January 2025 knowledge cutoff',
			'The only open model is Gemma 4, which scores about 26 on the index',
		],
		flag: '†',
	},
];

// ─────────────────────────── Timeline ───────────────────────────

export const T = {
	hero: {in: 0, out: 330},
	contenders: {in: 300, out: 660},
	axes: {in: 660, out: 1560},
	proscons: {in: 1560, out: 1980},
	verdict: {in: 1980, out: 2280},
	footer: {in: 2270, out: 2400},
} as const;

// ─────────────────────────── Axis panels ───────────────────────────

export type Axis = {
	id: string;
	number: string;
	title: string;
	/** Sub-line under the panel title. */
	standfirst: string;
	/** Which side wins, honestly. */
	verdictSide: Side | 'split';
	verdict: string;
	/** Rows rendered as a bar chart. */
	rows: {label: string; side: Side; value: number; display: string; note?: string}[];
	/** Footnote / methodology note for the panel. */
	method: string;
};

export const AXES: Axis[] = [
	{
		id: 'capability',
		number: '01',
		title: 'Raw capability',
		standfirst:
			'The Artificial Analysis Intelligence Index v4.3 — a composite of ten evaluations including GPQA Diamond, Humanity’s Last Exam, Terminal-Bench Hard and GDPval-AA v2.',
		verdictSide: 'west',
		verdict:
			'Anthropic and OpenAI hold the top ten slots between them. The best Chinese model is thirteenth, and the gap is real — but it is twelve points, not thirty.',
		rows: [
			{label: 'Claude Opus 5.5', side: 'west', value: 58, display: '58', note: 'max effort'},
			{label: 'GPT-6 Astra', side: 'west', value: 53, display: '53'},
			{label: 'Muse Spark 1.3', side: 'west', value: 48, display: '48'},
			{label: 'MiMo-V2.6-Pro', side: 'east', value: 46, display: '46', note: 'MIT · $0.13/task'},
			{label: 'Grok 4.7', side: 'west', value: 46, display: '46'},
			{label: 'Qwen3.8 Max', side: 'east', value: 45, display: '45'},
			{label: 'GLM-5.3', side: 'east', value: 45, display: '45'},
			{label: 'Kimi K3', side: 'east', value: 44, display: '44'},
			{label: 'Gemini 3.8 Flash', side: 'west', value: 41, display: '41'},
			{label: 'DeepSeek V4 Pro', side: 'east', value: 36, display: '36'},
		],
		method:
			'AA Index v4.3, read 27 September 2026. The index is rescaled between versions — v4.1.1 to v4.3 moved MiniMax-M3 from 55 to 29. Never mix versions, and note that vendor launch pages routinely do.',
	},
	{
		id: 'cost',
		number: '02',
		title: 'What a task actually costs',
		standfirst:
			'Cost per task on the AA index — what it costs to get one unit of measured capability out of the model, not what a token costs.',
		verdictSide: 'east',
		verdict:
			'The cheapest capable model in the world is Chinese, MIT-licensed, and roughly twenty-five times cheaper per index point than the most capable one. This is the single largest structural difference on the page.',
		rows: [
			{label: 'MiMo-V2.6-Pro', side: 'east', value: 0.13, display: '$0.13'},
			{label: 'Gemini 3.8 Flash', side: 'west', value: 1.24, display: '$1.24', note: 'introductory, doubles Jan 2027'},
			{label: 'Muse Spark 1.3', side: 'west', value: 1.6, display: '$1.60'},
			{label: 'DeepSeek V4 Pro', side: 'east', value: 0.67, display: '$0.67'},
			{label: 'GLM-5.3', side: 'east', value: 2.01, display: '$2.01'},
			{label: 'Kimi K3', side: 'east', value: 2.0, display: '$2.00'},
			{label: 'GPT-6 Astra', side: 'west', value: 3.26, display: '$3.26'},
			{label: 'Grok 4.7', side: 'west', value: 3.74, display: '$3.74'},
			{label: 'Claude Opus 5.5', side: 'west', value: 5.98, display: '$5.98'},
		],
		method:
			'AA cost-per-task, v4.3. These figures are volatile and vendor pricing pages are frequently stale. Gemini 3.8 Flash is an introductory rate. GPT-6 Luna is not shown here at $0.03–0.07 per task, because at that price it is not doing comparable work.',
	},
	{
		id: 'openness',
		number: '03',
		title: 'Openness and licensing',
		standfirst:
			'Weights you can download, and the licence terms that decide whether you can actually sell what you run.',
		verdictSide: 'east',
		verdict:
			'Every model on the eastern half of this page has downloadable weights. None on the western half does. But "open weights" is not "open source", and the three most capable open-weight models all carry revenue gates.',
		rows: [
			{label: 'DeepSeek V4 Pro', side: 'east', value: 100, display: 'MIT', note: 'fully permissive'},
			{label: 'MiMo-V2.6-Pro', side: 'east', value: 100, display: 'MIT', note: 'fully permissive'},
			{label: 'GLM-5.3', side: 'east', value: 70, display: 'Custom', note: 'MaaS gate above $10B revenue'},
			{label: 'Qwen3.8 Max', side: 'east', value: 55, display: 'Custom', note: 'MaaS gate above $50M revenue'},
			{label: 'Kimi K3', side: 'east', value: 50, display: 'Custom', note: 'MaaS gate above $20M/yr'},
			{label: 'Muse Spark 1.3', side: 'west', value: 0, display: 'Closed', note: 'open follow-up promised, no date'},
			{label: 'Claude Opus 5.5', side: 'west', value: 0, display: 'Closed'},
			{label: 'GPT-6 Astra', side: 'west', value: 0, display: 'Closed'},
			{label: 'Gemini 3.8 Flash', side: 'west', value: 0, display: 'Closed'},
			{label: 'Grok 4.7', side: 'west', value: 0, display: 'Closed'},
		],
		method:
			'The permissiveness scale here is an ordinal judgement, not a measurement — read it as a ranking, not a quantity. Note the ordering, which is counter-intuitive: Kimi’s and Qwen’s commercial gates are lower than GLM’s, so the more capable model is the more restrictively licensed. Qwen regressed from Apache 2.0 at 3.6 to a custom licence at 3.8. Step 5 Preview has no licence published at all.',
	},
	{
		id: 'speed',
		number: '04',
		title: 'Speed and latency',
		standfirst:
			'Output throughput and time to first token, measured on each model’s default API provider.',
		verdictSide: 'split',
		verdict:
			'The West owns raw throughput. The East owns responsiveness. Gemini 3.8 Flash is the fastest capable model on earth; DeepSeek V4.1 Flash gives you a reasoning model’s first token in 1.15 seconds; GPT-6 Astra takes five and a half minutes.',
		rows: [
			{label: 'Gemini 3.8 Flash', side: 'west', value: 306, display: '306 t/s', note: 'index 41'},
			{label: 'Muse Spark 1.3', side: 'west', value: 214, display: '214 t/s', note: 'index 48'},
			{label: 'Claude Opus 5.5', side: 'west', value: 82, display: '82 t/s', note: 'index 58'},
			{label: 'Grok 4.7', side: 'west', value: 82, display: '82 t/s', note: 'index 46'},
			{label: 'GLM-5.3', side: 'east', value: 84, display: '84 t/s', note: 'index 45 · 2.7s TTFT'},
			{label: 'MiMo-V2.6-Pro', side: 'east', value: 44, display: '44 t/s', note: '3.8s TTFT'},
			{label: 'Qwen3.8 Max', side: 'east', value: 39, display: '39 t/s', note: '3.0s TTFT'},
			{label: 'Kimi K3', side: 'east', value: 35, display: '35 t/s', note: '5.2s TTFT · slowest frontier model'},
		],
		method:
			'Throughput is measured on the default provider only, and third-party providers diverge wildly. Raw speed records belong to diffusion inference engines at 1,000–1,500 tokens/sec — at an intelligence index of 6 to 12, which is useless for real work. Time-to-first-token for reasoning models measures the first reasoning token, not the first answer.',
	},
	{
		id: 'preference',
		number: '05',
		title: 'What people actually prefer',
		standfirst:
			'Arena text board, September 2026 — crowdsourced blind pairwise human preference, with vote counts shown because they change the reading.',
		verdictSide: 'west',
		verdict:
			'Two Chinese models are in the text top ten. Kimi K3’s rank rests on 3,600 votes at ±10, which cannot be separated from ranks three through seven. Qwen3.8 Max, on 16,700 votes at ±6, is the more defensible of the two.',
		rows: [
			{label: 'Claude Opus 5', side: 'west', value: 1505, display: '1505', note: '±4 · 42.6K votes'},
			{label: 'Gemini 3.8 Flash', side: 'west', value: 1495, display: '1495', note: '±9 · 5.1K votes'},
			{label: 'Muse Spark 1.1', side: 'west', value: 1480, display: '1480', note: '±5 · 27.6K votes'},
			{label: 'Kimi K3', side: 'east', value: 1482, display: '1482', note: '±10 · only 3.6K votes'},
			{label: 'Qwen3.8 Max', side: 'east', value: 1481, display: '1481', note: '±6 · 16.7K votes'},
		],
		method:
			'Arena has a documented style confound — response length is the dominant style coefficient at 0.249 — which it addresses with Style Control. "The Leaderboard Illusion" (Cohere, Stanford, MIT, AI2) showed Google and OpenAI each received about 20% of all battle data while 83 open-weight models shared roughly 30%. Roughly 9% of monthly prompts are near-duplicates of the prior month.',
	},
	{
		id: 'speech',
		number: '06',
		title: 'What they will and will not say',
		standfirst:
			'The most consequential axis on the page, the least reported, and the one where the two sides fail in opposite directions.',
		verdictSide: 'split',
		verdict:
			'Audits show Chinese models refusing 80% of China-referent collective-action prompts against 11% for Western models. Western models refuse non-political harmful instructions at a higher rate than Chinese models do. The two cohorts point in opposite directions.',
		rows: [
			{label: 'Chinese models — China referent', side: 'east', value: 80.2, display: '80.2%', note: 'refusal rate'},
			{label: 'Chinese models — foreign referent', side: 'east', value: 21.5, display: '21.5%', note: 'same prompt, swapped place name'},
			{label: 'Chinese models — fictional locale', side: 'east', value: 23.6, display: '23.6%', note: 'not statistically different from foreign'},
			{label: 'Western models — China referent', side: 'west', value: 10.8, display: '10.8%'},
			{label: 'Western models — foreign referent', side: 'west', value: 0, display: '0%'},
			{label: 'Doubao — pro-government assembly', side: 'east', value: 96, display: '96%', note: 'lawful, nonviolent, pro-government'},
			{label: 'Western models — non-political harm', side: 'west', value: 88.8, display: '88.8%', note: 'refuse MORE than Chinese models'},
		],
		method:
			'arXiv 2609.07507, 7 September 2026, minimal-pair design matched to within one word. Critically: censorship is applied largely at the serving layer, not baked into the weights. The same GLM weights refuse 27 of 60 FreedomBench questions on Z.AI’s own API and answer all 60 on Cerebras. In Chinese, models deflect rather than refuse — and refusal-only audits undercount the effect by an order of magnitude.',
	},
];

// ─────────────────────────── Verdict ───────────────────────────

export const DECISIONS: {pick: string; then: string; because: string}[] = [
	{
		pick: 'You need weights you can actually host and sell inference on',
		then: 'DeepSeek V4, or MiMo-V2.6',
		because: 'MIT is the only genuinely permissive licence at this tier. Everything else has a revenue clause attached.',
	},
	{
		pick: 'You want the best raw reasoning available anywhere',
		then: 'Claude Opus 5.5',
		because: 'Index 58, and it also leads the independent Chinese-language evaluation — which is the least convenient fact on this page for anyone arguing about national AI prestige.',
	},
	{
		pick: 'You are building an agent and the bill is the problem',
		then: 'MiMo-V2.6-Pro, or GLM-5.3-Flash',
		because: 'Index 46 and 42 respectively, at $0.13 and $0.25 per task. GPT-6 Luna is cheaper still at $0.03, but is not doing comparable work.',
	},
	{
		pick: 'You have China-resident users or data',
		then: 'Qwen3.8 Max, or Z.AI',
		because: 'Both operate a genuine China region. The American labs have not listed mainland China as a supported region at all.',
	},
	{
		pick: 'Latency is your product',
		then: 'Gemini 3.8 Flash, or DeepSeek V4.1 Flash',
		because: '306 tokens/sec and 1.15 seconds to first reasoning token respectively. Mind the Gemini price doubling in January 2027.',
	},
	{
		pick: 'You cannot have your model quote the Tiananmen Square protests',
		then: 'Anything Western, self-hosted',
		because: 'Not the weights — the host. The same GLM weights score 45% freedom on Z.AI’s API and 100% on Cerebras.',
	},
];

export const SOURCES: {label: string; detail: string}[] = [
	{
		label: 'Artificial Analysis',
		detail:
			'Intelligence Index v4.3 and leaderboard, plus the v4.3 rescaling note. Read 27 September 2026. Source of every index, cost-per-task, throughput and latency figure on this page.',
	},
	{
		label: 'Arena',
		detail:
			'Arena agent, text, vision and code boards. Read 27 September 2026; text board via a third-party mirror observed 13 September 2026. Vote counts and confidence intervals shown wherever a rank is cited.',
	},
	{
		label: 'arXiv 2609.07507',
		detail:
			'“What a Model Refuses, a State Fears”, 7 September 2026. Ten instruction-tuned models, minimal-pair referent manipulation.',
	},
	{
		label: 'arXiv 2609.19989',
		detail:
			'Tongji University, Law and Computer Science, 17 September 2026. 2,303 questions, 20 models, PRC AI-content-regulation compliance. The dissenting finding on this page.',
	},
	{
		label: 'arXiv 2603.05494',
		detail: 'Elicitation and lie-detection of censored Chinese open-weight models, 2026.',
	},
	{
		label: 'FreedomBench v1',
		detail:
			'36 models × 60 China-sensitive questions × 12 topics, snapshot 18 June 2026. The source of the serving-layer finding.',
	},
	{
		label: 'PNAS Nexus',
		detail:
			'Political censorship in LLMs originating from China. 145 sensitive questions, 9 models, 2023 and 2025 data. Observational; does not establish causation.',
	},
	{
		label: 'CEIAS',
		detail:
			'Veronika Blablová, 3 July 2026. 5,760 questions across 37 countries plus Taiwan, 4 models. The only major spillover study.',
	},
	{
		label: '“The Leaderboard Illusion”',
		detail: 'Cohere, Stanford, MIT, Allen Institute for AI — on Arena sampling, submission asymmetry and model retirement.',
	},
	{
		label: 'Vendor documentation',
		detail:
			'OpenAI, Anthropic, Google DeepMind, xAI, Meta, Moonshot, DeepSeek, Alibaba Model Studio, Z.AI, MiniMax, Xiaomi and StepFun primary documentation and model cards.',
	},
];

export const FOOTNOTES: {mark: string; text: string}[] = [
	{mark: '†', text: 'Figures marked with a dagger are vendor-reported, introductory, or not independently verified by the evaluating body.'},
	{mark: '‡', text: 'Open weights carry a revenue-triggered commercial clause. Open weights are not the same thing as open source.'},
	{mark: '§', text: 'Several published figures are floored by production safeguards or measured on a fallback model, not the named one.'},
	{mark: '¶', text: 'A closed model from a lab with a history of open releases, and a promised open-weight follow-up with no announced date.'},
];
