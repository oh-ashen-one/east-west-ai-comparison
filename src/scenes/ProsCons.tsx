import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Fragment} from 'react';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import {Eyebrow, Rule, sideColor, sideHi} from '../components/Bits';
import {T, type Side} from '../data';
import {isNarrow, useTier} from '../useLayout';

type Column = {
	side: Side;
	title: string;
	sub: string;
	wins: string[];
	losses: string[];
};

const COLUMNS: Column[] = [
	{
		side: 'east',
		title: 'China-based labs',
		sub: 'Five frontier models, mean index 43.2',
		wins: [
			'Every model on this side has downloadable weights. DeepSeek V4 and MiMo-V2.6 are MIT — genuinely permissive, with no revenue clause and no MaaS review.',
			'Cost per unit of measured capability, decisively. MiMo-V2.6-Pro reaches index 46 at $0.13 a task, roughly a twenty-fifth of what the most capable model costs for the same index band.',
			'Responsiveness at frontier capability. DeepSeek V4.1 Flash returns its first reasoning token in 1.15 seconds; GLM-5.3 does 84 tokens per second at index 45.',
			'Domestic-silicon maturity nobody else has matched. GLM-5.3-Flash has been served on more than 100,000 Chinese accelerators, and Z.AI runs a 1 GW data centre built with no Nvidia silicon at all.',
			'A real two-region data-residency story. Alibaba and Z.AI both operate a China region. The American labs have not listed mainland China as a supported region at all.',
			'Genuine multilingual reach, and it shows on independent evaluation — Anthropic and Google lead the Chinese-language benchmark, but Alibaba leads Southeast Asia by a wide margin.',
		],
		losses: [
			'The top of the capability index is American, and it is not a close call. Anthropic and OpenAI take all ten top slots; the best Chinese model sits thirteenth.',
			'"Open" mostly means datacenter-open. MiMo needs 565 GB at four-bit and a two-node cluster. Only DeepSeek V4-Flash fits on a pair of RTX 4090s.',
			'The three most capable open-weight models all carry revenue-triggered commercial gates — and Kimi’s and Qwen’s gates are lower than GLM’s, so the stronger model is the more restrictively licensed.',
			'Refusal behaviour is keyed to politics rather than capability, and is applied largely at the serving layer rather than in the weights. The same GLM weights score 45% freedom on Z.AI’s API and 100% on Cerebras.',
			'Ecosystem depth still trails. Claude Code, Cursor, Bedrock and Vertex have no equivalent on this side of the ledger.',
			'There is live regulatory risk in both directions: reported talks about restricting overseas access to Chinese models, and the mirror-image fact that Western APIs are not supported inside China.',
		],
	},
	{
		side: 'west',
		title: 'US-based labs',
		sub: 'Five frontier models, mean index 49.2',
		wins: [
			'The capability index, without exception. Claude Opus 5.5 leads at 58 and GPT-6 Astra follows at 53, and the top ten slots between them belong to Anthropic and OpenAI.',
			'Ecosystem and tooling depth by a wide margin — Claude Code, Cursor, Amazon Bedrock, Google Vertex, Microsoft Foundry. This is the part that is hard to replicate and rarely measured.',
			'Refusal policies that are capability-triggered, safety-domain-scoped, and do not key on the user’s nationality. Western models score 100% truthfulness on all sixty China-sensitive questions in FreedomBench.',
			'Genuine deployment privacy. Azure, Bedrock and Vertex put the model inside your own cloud account, with zero-data-retention options. That is a different proposition from downloading weights.',
			'The broadest modality coverage on the page. Gemini and Muse Spark both take text, image, video and audio.',
			'The cheapest entry to the frontier is American. GPT-6 Luna costs $0.03 to $0.07 per task — cheaper than anything on the eastern side.',
		],
		losses: [
			'Nothing is open. Not one downloadable weight set across five frontier models, from a country with a decade of open-release history. Meta has promised a follow-up with no announced date.',
			'Price. $10 and $50 a million for GPT-6 Astra, $4 and $20 for Claude Opus 5.5, and GPT-6 Astra bills prompts over 272K at double input and one-and-a-half-times output for the entire request.',
			'Latency at maximum effort is severe. GPT-6 Astra takes 323.8 seconds to its first token — more than five minutes — and Claude Fable 5.1 takes 223.',
			'Published numbers are frequently floored by policy. Fable 5.1 scored zero on OSWorld 2.0 where safeguards intervened, and several leaderboard rows are marked "with fallback" because the endpoint quietly serves an older model.',
			'The measurement itself is contested. "The Leaderboard Illusion" documented roughly 20% of all Arena battle data going to each of Google and OpenAI, while 83 open-weight models shared about 30%.',
			'Some prices are introductory and about to change. Gemini 3.8 Flash doubles on 1 January 2027.',
		],
	},
];

/**
 * Section 04 — Benefits and drawbacks.
 *
 * Two family columns, each splitting into genuine strengths and genuine
 * weaknesses, revealed in a staggered sequence down the page.
 */
export const ProsCons: React.FC = () => {
	const frame = useCurrentFrame();
	const start = T.proscons.in;
	const narrow = isNarrow(useTier());

	const headerIn = interpolate(frame, [start - 20, start + 10], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const ruleIn = interpolate(frame, [start, start + 60], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	// A slow push across the section so it never sits still.
	const push = interpolate(
		frame,
		[start - 20, start + 180, T.proscons.out + 30],
		[0.93, 1, 1.04],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
			output: 'perceptual-scale',
		},
	);

	return (
		<AbsoluteFill style={{scale: push}}>
			{narrow ? (
				<PhonePages start={start} />
			) : (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						justifyContent: 'center',
						padding: '5vh 5vw',
					}}
				>
					<DesktopLayout start={start} headerIn={headerIn} ruleIn={ruleIn} />
				</div>
			)}
		</AbsoluteFill>
	);
};

/**
 * On a phone, twelve long-form bullets cannot share one viewport without
 * becoming unreadable. Rather than dropping content, the section spends its
 * own frame budget on two sub-pages — every strength, then every failure.
 */
const PhonePages: React.FC<{start: number}> = ({start}) => {
	const frame = useCurrentFrame();
	const half = (T.proscons.out - T.proscons.in) / 2;
	const mid = start + half;

	const first = interpolate(frame, [start - 18, start + 24, mid - 22, mid + 6], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});
	const second = interpolate(frame, [mid - 22, mid + 8, T.proscons.out - 30, T.proscons.out + 16], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	const page = (children: React.ReactNode) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.8vh',
				height: '100%',
			}}
		>
			{children}
		</div>
	);

	return (
		<>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					justifyContent: 'center',
					padding: '4vh 6vw',
					opacity: first,
				}}
			>
				{page(
					<>
						<PhoneHead
							kicker="Section 04 — Honest accounting"
							title="Where each side is right"
							blurb="Six genuine strengths on each side. Keep scrolling for the failures."
						/>
						<Rule progress={first} />
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '3vw', flex: 1, minHeight: 0, alignContent: 'start'}}>
							{COLUMNS.map((col) => (
								<FamilyList key={col.side} col={col} kind="wins" start={start + 12} />
							))}
						</div>
					</>,
				)}
			</div>

			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					justifyContent: 'center',
					padding: '4vh 6vw',
					opacity: second,
				}}
			>
				{page(
					<>
						<PhoneHead
							kicker="Section 04 — continued"
							title="Where each side is wrong"
							blurb="Six genuine failures on each side. These are not hedges."
						/>
						<Rule progress={second} />
						<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '3vw', flex: 1, minHeight: 0, alignContent: 'start'}}>
							{COLUMNS.map((col) => (
								<FamilyList key={col.side} col={col} kind="losses" start={mid + 12} />
							))}
						</div>
					</>,
				)}
			</div>
		</>
	);
};

const PhoneHead: React.FC<{kicker: string; title: string; blurb: string}> = ({
	kicker,
	title,
	blurb,
}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
		<Eyebrow color={C.faint} size={9}>
			{kicker}
		</Eyebrow>
		<h2
			style={{
				margin: 0,
				fontFamily: FONT_DISPLAY,
				fontWeight: 400,
				fontSize: 28,
				lineHeight: 1,
				letterSpacing: '-0.02em',
				color: C.text,
			}}
		>
			{title}
		</h2>
		<p
			style={{
				margin: 0,
				fontFamily: FONT_BODY,
				fontSize: 10.5,
				fontWeight: 300,
				lineHeight: 1.5,
				color: C.dim,
			}}
		>
			{blurb}
		</p>
	</div>
);

const FamilyList: React.FC<{
	col: Column;
	kind: 'wins' | 'losses';
	start: number;
}> = ({col, kind, start}) => (
	<div style={{display: 'flex', flexDirection: 'column', gap: '1.1vh', minWidth: 0}}>
		<span
			style={{
				fontFamily: FONT_DISPLAY,
				fontSize: 16,
				lineHeight: 1.05,
				color: kind === 'wins' ? sideHi(col.side) : C.dim,
				letterSpacing: '-0.012em',
			}}
		>
			{col.title}
		</span>
		<List
			title={kind === 'wins' ? 'Strengths' : 'Failures'}
			color={kind === 'wins' ? sideColor(col.side) : C.faint}
			items={kind === 'wins' ? col.wins : col.losses}
			start={start}
			glyph={kind === 'wins' ? '+' : '−'}
			size={9}
		/>
	</div>
);

const DesktopLayout: React.FC<{
	start: number;
	headerIn: number;
	ruleIn: number;
}> = ({start, headerIn, ruleIn}) => (
	<>
		<div
			style={{
				display: 'flex',
				alignItems: 'flex-end',
				justifyContent: 'space-between',
				gap: 18,
				marginBottom: '2.6vh',
				opacity: headerIn,
				translate: `0px ${interpolate(headerIn, [0, 1], [20, 0])}px`,
				flexWrap: 'wrap',
			}}
		>
			<div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
				<Eyebrow color={C.faint} size={10}>
					Section 04 — Honest accounting
				</Eyebrow>
				<h2
					style={{
						margin: 0,
						fontFamily: FONT_DISPLAY,
						fontWeight: 400,
						fontSize: 'clamp(30px, 3.4vw, 52px)',
						lineHeight: 1,
						letterSpacing: '-0.02em',
						color: C.text,
					}}
				>
					Where each side is right
				</h2>
			</div>
			<p
				style={{
					margin: 0,
					fontFamily: FONT_BODY,
					fontSize: 13,
					fontWeight: 300,
					lineHeight: 1.55,
					color: C.dim,
					maxWidth: 420,
				}}
			>
				Six genuine strengths and six genuine failures on each side. The failures
				are not hedges — they are the reasons the argument is not settled.
			</p>
		</div>

		<Rule progress={ruleIn} style={{marginBottom: '3vh'}} />

		<div
			style={{
				display: 'grid',
				gridTemplateColumns: '1fr 1fr',
				gridTemplateRows: 'auto 1fr',
				rowGap: '2.6vh',
				columnGap: '3vw',
				flex: 1,
				minHeight: 0,
			}}
		>
			{COLUMNS.map((col, ci) => (
				<Fragment key={col.side}>
					<ColumnHead
						col={col}
						start={start}
						style={{gridColumn: ci + 1, gridRow: 1}}
					/>
					<div style={{gridColumn: ci + 1, gridRow: 2, minHeight: 0}}>
						<List
							title="Genuine failures"
							color={C.faint}
							items={col.losses}
							start={start + 56}
							glyph="−"
						/>
					</div>
				</Fragment>
			))}
		</div>
	</>
);

const ColumnHead: React.FC<{
	col: Column;
	start: number;
	style?: React.CSSProperties;
	size?: number;
}> = ({col, start, style, size = 12}) => {
	const frame = useCurrentFrame();
	const c = sideColor(col.side);
	const hi = sideHi(col.side);

	const head = interpolate(frame, [start, start + 22], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '1.8vh',
				minHeight: 0,
				...style,
			}}
		>
			<div
				style={{
					display: 'flex',
					alignItems: 'baseline',
					justifyContent: 'space-between',
					gap: 14,
					opacity: head,
					translate: `0px ${interpolate(head, [0, 1], [16, 0])}px`,
				}}
			>
				<span
					style={{
						fontFamily: FONT_DISPLAY,
						fontSize: 'clamp(22px, 2.1vw, 34px)',
						lineHeight: 1,
						color: hi,
						letterSpacing: '-0.014em',
					}}
				>
					{col.title}
				</span>
				<span style={{...label(8.5), color: C.faint}}>{col.sub}</span>
			</div>

			<List
				title="Genuine strengths"
				color={c}
				items={col.wins}
				start={start + 10}
				glyph="+"
				size={size}
			/>
		</div>
	);
};

const List: React.FC<{
	title: string;
	items: string[];
	color: string;
	start: number;
	glyph: string;
	size?: number;
}> = ({title, items, color, start, glyph, size = 12}) => {
	const frame = useCurrentFrame();

	const head = interpolate(frame, [start - 4, start + 16], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.bezier(0.16, 1, 0.3, 1),
	});

	return (
		<div style={{display: 'flex', flexDirection: 'column', gap: '1.1vh'}}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 12,
					opacity: head,
				}}
			>
				<Eyebrow color={color} size={9}>
					{title}
				</Eyebrow>
				<div style={{flex: 1, height: 1, background: C.ruleSoft}} />
			</div>

			{items.map((item, i) => {
				const at = start + 4 + i * 3;
				const p = interpolate(frame, [at, at + 20], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: Easing.bezier(0.16, 1, 0.3, 1),
				});
				return (
					<div
						key={item}
						style={{
							display: 'grid',
							gridTemplateColumns: '16px 1fr',
							gap: 12,
							opacity: p,
							translate: `${interpolate(p, [0, 1], [-14, 0])}px 0px`,
						}}
					>
						<span
							style={{
								fontFamily: FONT_BODY,
								fontSize: size,
								fontWeight: 400,
								color,
								lineHeight: 1.52,
							}}
						>
							{glyph}
						</span>
						<p
							style={{
								margin: 0,
								fontFamily: FONT_BODY,
								fontSize: size,
								fontWeight: 300,
								lineHeight: 1.52,
								color: C.text,
								opacity: 0.82,
							}}
						>
							{item}
						</p>
					</div>
				);
			})}
		</div>
	);
};
