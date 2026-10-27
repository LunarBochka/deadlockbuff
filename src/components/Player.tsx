import { useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import './Player.css';

interface PlayerCardProps {
	accountId?: string | number;
}

interface MetricSummary {
	avg?: number;
	std?: number;
	[key: string]: number | undefined;
}

type PlayerMetrics = Record<string, MetricSummary>;

const metricLabels: Record<string, string> = {
	boss_damage: 'Урон по боссам',
	self_healing: 'Самолечение',
	self_healing_per_min: 'Самолечение в минуту',
	player_healing_per_min: 'Лечение игроков в минуту',
	player_damage: 'Урон по игрокам',
	kd: 'Убийства к смертям',
	teammate_barriering: 'Защита союзников барьером',
	healing_per_min: 'Лечение в минуту',
	kills_plus_assists: 'Убийства и помощь',
	deaths: 'Смерти',
	healing: 'Лечение',
	assists: 'Помощь',
	player_damage_per_min: 'Урон по игрокам в минуту',
	last_hits: 'Последние удары',
	crit_shot_rate: 'Частота критических попаданий',
	player_damage_per_health: 'Урон по игрокам на единицу здоровья',
	boss_damage_per_min: 'Урон по боссам в минуту',
	kills: 'Убийства',
	net_worth_per_min: 'Души в минуту',
	heal_prevented: 'Предотвращённое лечение',
	denies: 'Отбитые души',
	net_worth: 'Души за матч',
	teammate_healing: 'Лечение союзников',
	player_damage_taken_per_min: 'Полученный урон от игроков в минуту',
	player_healing: 'Лечение игроков',
	accuracy: 'Точность',
	neutral_damage: 'Урон по нейтралам',
	neutral_damage_per_min: 'Урон по нейтралам в минуту',
	kda: 'Убийства, смерти и помощь',
};

const metricFieldLabels: Record<string, string> = {
	avg: 'Среднее значение',
	std: 'Стандартное отклонение',
};

const numberFormatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });

function formatMetricValue(value?: number) {
	return typeof value === 'number' && Number.isFinite(value)
		? numberFormatter.format(value)
		: '—';
}

function formatMetricLabel(metricName: string) {
	return metricLabels[metricName]
		?? metricName.replace(/_/g, ' ').replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatMetricFieldLabel(fieldName: string) {
	const percentile = fieldName.match(/^percentile(\d+)$/);
	return metricFieldLabels[fieldName]
		?? (percentile ? `${percentile[1]}-й процентиль` : fieldName);
}

function translateMetrics(metrics: PlayerMetrics) {
	return Object.fromEntries(
		Object.entries(metrics).map(([metricName, summary]) => [
			formatMetricLabel(metricName),
			Object.fromEntries(
				Object.entries(summary).map(([fieldName, value]) => [formatMetricFieldLabel(fieldName), value]),
			),
		]),
	);
}

function PlayerCard({ accountId: initialAccountId = '' }: PlayerCardProps) {
	const [accountId, setAccountId] = useState(String(initialAccountId));
	const [requestedAccountId, setRequestedAccountId] = useState('');
	const [requestVersion, setRequestVersion] = useState(0);
	const [metrics, setMetrics] = useState<PlayerMetrics | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!requestedAccountId) {
			setLoading(false);
			return;
		}

		let cancelled = false;

		setLoading(true);
		setError(null);
		setMetrics(null);

		axios.get<PlayerMetrics>('https://api.deadlock-api.com/v1/analytics/player-stats/metrics', {
			params: {
				game_mode: 'normal',
				min_unix_timestamp: 1790467200,
				account_ids: requestedAccountId,
				include_buff_metrics: false,
			},
		})
			.then(({ data }) => {
				if (!cancelled) {
					setMetrics(data);
				}
			})
			.catch((requestError: unknown) => {
				if (!cancelled) {
					setError(requestError instanceof Error ? requestError.message : 'Не удалось загрузить данные.');
				}
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => { cancelled = true; };
	}, [requestedAccountId, requestVersion]);

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const normalizedAccountId = accountId.trim();

		if (!/^\d+$/.test(normalizedAccountId)) {
			setError('Введите числовой Steam account ID.');
			setMetrics(null);
			return;
		}

		setError(null);
		setRequestedAccountId(normalizedAccountId);
		setRequestVersion((version) => version + 1);
	}

	const metricEntries = metrics
		? Object.entries(metrics).filter(([, summary]) => summary && typeof summary === 'object')
		: [];

	return (
		<section className="player-tool" aria-labelledby="player-tool-title">
			<div className="player-tool-heading">
				<div>
					<p className="player-tool-kicker">DEADLOCK API</p>
					<h2 id="player-tool-title">Данные игрока</h2>
				</div>
				<span className="player-tool-method">GET /analytics/player-stats/metrics</span>
			</div>

			<form className="player-form" onSubmit={handleSubmit}>
				<label htmlFor="steam-account-id">Steam account ID</label>
				<div className="player-form-controls">
					<input
						id="steam-account-id"
						inputMode="numeric"
						autoComplete="off"
						placeholder="Например, 123456789"
						value={accountId}
						onChange={(event) => setAccountId(event.target.value)}
					/>
					<button type="submit" disabled={loading || !accountId.trim()}>
						{loading && requestedAccountId ? 'Загрузка...' : 'Загрузить'}
					</button>
				</div>
			</form>

			{error && <p className="player-message player-error">Ошибка: {error}</p>}
			{!requestedAccountId && !error && (
				<p className="player-message">Введите ID игрока, чтобы запросить его данные.</p>
			)}
			{loading && requestedAccountId && (
				<p className="player-message">Загружаю данные игрока...</p>
			)}
			{!loading && !error && requestedAccountId && metricEntries.length === 0 && (
				<p className="player-message">Метрики не найдены.</p>
			)}

			{metricEntries.length > 0 && (
				<div className="player-metrics" aria-label="Метрики игрока">
					{metricEntries.map(([metricName, summary]) => {
						const percentiles = Object.entries(summary)
							.filter(([key, value]) => /^percentile\d+$/.test(key) && typeof value === 'number')
							.sort(([first], [second]) => Number(first.replace('percentile', '')) - Number(second.replace('percentile', '')));

						return (
							<article className="player-metric-card" key={metricName}>
								<div className="player-metric-heading">
									<h3>{formatMetricLabel(metricName)}</h3>
									<span>МЕТРИКА</span>
								</div>
								<div className="player-metric-main">
									<div>
										<p>Среднее</p>
										<strong>{formatMetricValue(summary.avg)}</strong>
									</div>
									<div>
										<p>Медиана</p>
										<strong>{formatMetricValue(summary.percentile50)}</strong>
									</div>
									<div>
										<p>Разброс</p>
										<strong>{formatMetricValue(summary.std)}</strong>
									</div>
								</div>
								{percentiles.length > 0 && (
									<div className="player-percentiles" aria-label="Распределение по процентилям">
										{percentiles.map(([key, value]) => (
											<div className="player-percentile" key={key}>
												<span>{key.replace('percentile', '')}-й</span>
												<strong>{formatMetricValue(value)}</strong>
											</div>
										))}
									</div>
								)}
							</article>
						);
					})}
				</div>
			)}

			{metrics !== null && (
				<details className="player-json">
					<summary>Полный ответ API · JSON</summary>
					<pre>{JSON.stringify(translateMetrics(metrics), null, 2)}</pre>
				</details>
			)}
		</section>
	);
}

export default PlayerCard;
