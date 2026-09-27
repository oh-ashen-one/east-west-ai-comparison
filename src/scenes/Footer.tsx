import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT_BODY, FONT_DISPLAY, label} from '../theme';
import {Eyebrow, Rule} from '../components/Bits';
import {FOOTNOTES, MODELS, SOURCES, T} from '../data';
import {isNarrow, useTier} from '../useLayout';

/**
 * Section 06 — Footer.
 *
 * Every source that produced a number on this page, the date they were read,
 * the flag glossary, and the mark the piece is signed with.
 */
export const Footer: React.FC = () => {
	const frame = useCurrentFrame();
	const start = T.footer.in;
	const narrow = isNarrow(useTier());

	const inAt = (d: number, span = 30) =>
		interpolate(frame, [start + d, start + d + span], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.bezier(0.16, 1, 0.3, 1),
		});

	const mark = inAt(0, 40);

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				padding: `${narrow ? '4vh' : '5vh'} ${narrow ? '6vw' : '6vw'}`,
			}}
		>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: narrow ? '1.4vh' : '2.4vh',
					opacity: mark,
					translate: `0px ${interpolate(mark, [0, 1], [22, 0])}px`,
				}}
			>
				{/* Closing mark */}
				<div
					style={{
						display: 'flex',
						flexDirection: narrow ? 'column' : 'row',
						alignItems: narrow ? 'flex-start' : 'flex-end',
						justifyContent: 'space-between',
						gap: narrow ? 14 : 30,
						flexWrap: 'wrap',
					}}
				>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 20,
						}}
					>
						{/* The two-family mark */}
						<div
							style={{
								display: 'flex',
								width: 46,
								height: 22,
								borderRadius: 2,
								overflow: 'hidden',
							}}
						>
							<div style={{flex: 1, background: C.east}} />
							<div
								style={{
									flex: 1,
									background: `linear-gradient(90deg, ${C.east}, ${C.west})`,
								}}
							/>
							<div style={{flex: 1, background: C.west}} />
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
							<span
								style={{
									fontFamily: FONT_DISPLAY,
									fontSize: narrow ? 24 : 'clamp(24px, 2.4vw, 38px)',
									lineHeight: 1,
									color: C.text,
									letterSpacing: '-0.016em',
								}}
							>
								East vs West
							</span>
							<span style={{...label(8.5), color: C.faint}}>
								Ten models · Seven axes · One afternoon of reading
							</span>
						</div>
					</div>

					<div
						style={{
							display: 'flex',
							gap: narrow ? 22 : 40,
							alignItems: 'flex-end',
							flexWrap: 'wrap',
						}}
					>
						<div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
							<Eyebrow size={8.5}>Compared on</Eyebrow>
							<span
								style={{
									fontFamily: FONT_DISPLAY,
									fontSize: narrow ? 18 : 22,
									color: C.text,
									lineHeight: 1,
								}}
							>
								27 September 2026
							</span>
						</div>
						<a
							href="https://x.com/ashen_one"
							target="_blank"
							rel="noreferrer noopener"
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 5,
								textDecoration: 'none',
							}}
						>
							<Eyebrow size={8.5}>More</Eyebrow>
							<span
								style={{
									fontFamily: FONT_BODY,
									fontSize: narrow ? 13 : 15,
									fontWeight: 500,
									color: C.text,
									letterSpacing: '0.01em',
								}}
							>
								@ashen_one ↗
							</span>
						</a>
					</div>
				</div>

				<Rule progress={inAt(24, 40)} />

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: narrow ? '1fr' : '1.35fr 1fr',
						rowGap: narrow ? '2.2vh' : 0,
						gap: narrow ? '2.2vh' : '0 4vw',
						opacity: inAt(34, 40),
					}}
				>
					{/* Sources */}
					<div style={{display: 'flex', flexDirection: 'column', gap: '1vh'}}>
						<Eyebrow color={C.text} size={9}>
							Sources
						</Eyebrow>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(2, 1fr)',
								gap: '0.9vh 2.4vw',
							}}
						>
							{SOURCES.map((s, i) => {
								const p = interpolate(
									frame,
									[start + 44 + i * 5, start + 44 + i * 5 + 26],
									[0, 1],
									{
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
										easing: Easing.bezier(0.16, 1, 0.3, 1),
									},
								);
								return (
									<div
										key={s.label}
										style={{
											display: 'flex',
											flexDirection: 'column',
											gap: 3,
											opacity: p,
											translate: `${interpolate(p, [0, 1], [-10, 0])}px 0px`,
										}}
									>
										<span
											style={{
												fontFamily: FONT_BODY,
												fontSize: narrow ? 10 : 11,
												fontWeight: 500,
												color: C.text,
											}}
										>
											{s.label}
										</span>
										<span
											style={{
												fontFamily: FONT_BODY,
												fontSize: 9.5,
												fontWeight: 300,
												lineHeight: 1.5,
												color: C.faint,
											}}
										>
											{s.detail}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Flag glossary */}
					<div style={{display: 'flex', flexDirection: 'column', gap: '1vh'}}>
						<Eyebrow color={C.text} size={9}>
							Flags
						</Eyebrow>
						{FOOTNOTES.map((f) => (
							<div
								key={f.mark}
								style={{
									display: 'grid',
									gridTemplateColumns: '14px 1fr',
									gap: 10,
									opacity: inAt(60, 30),
								}}
							>
								<span
									style={{
										fontFamily: FONT_BODY,
										fontSize: 10.5,
										color: C.dim,
									}}
								>
									{f.mark}
								</span>
								<span
									style={{
										fontFamily: FONT_BODY,
										fontSize: narrow ? 7.8 : 9.5,
										fontWeight: 300,
										lineHeight: 1.4,
										color: C.faint,
									}}
								>
									{f.text}
								</span>
							</div>
						))}

						<div
							style={{
								marginTop: '0.8vh',
								paddingTop: '1.2vh',
								borderTop: `1px solid ${C.ruleSoft}`,
								opacity: inAt(78, 30),
							}}
						>
							<p
								style={{
									margin: 0,
									fontFamily: FONT_BODY,
									fontSize: narrow ? 7.8 : 9.5,
									fontWeight: 300,
									lineHeight: 1.45,
									color: C.faint,
								}}
							>
								Leaderboards move daily. Every figure here is a snapshot, and
								some are marked because the vendor, not an independent body,
								published them. {MODELS.length} models were compared; the
								selection is the author’s, and a different ten would produce a
								different mean.
							</p>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};
