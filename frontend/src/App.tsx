import { useEffect, useRef, useState } from 'react'
import './App.css'

const SYMBOLS = ['MES', 'NQ'] as const
const TIMEFRAMES = ['1m', '5m', '15m', '1h'] as const

type SymbolName = (typeof SYMBOLS)[number]
type Timeframe = (typeof TIMEFRAMES)[number]

interface Candle {
  t: string
  o: number
  h: number
  l: number
  c: number
  v: number
}

interface CandleResponse {
  symbol: SymbolName
  tf: Timeframe
  candles: Candle[]
}

function isSymbolName(value: string): value is SymbolName {
  return SYMBOLS.some((symbol) => symbol === value)
}

function isTimeframe(value: string): value is Timeframe {
  return TIMEFRAMES.some((timeframe) => timeframe === value)
}

const priceFormat = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const volumeFormat = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
})
const timeFormat = new Intl.DateTimeFormat('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
})
const dateFormat = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isCandle(value: unknown): value is Candle {
  if (!isRecord(value)) return false

  return (
    typeof value.t === 'string' &&
    Number.isFinite(Date.parse(value.t)) &&
    typeof value.o === 'number' &&
    Number.isFinite(value.o) &&
    typeof value.h === 'number' &&
    Number.isFinite(value.h) &&
    typeof value.l === 'number' &&
    Number.isFinite(value.l) &&
    typeof value.c === 'number' &&
    Number.isFinite(value.c) &&
    typeof value.v === 'number' &&
    Number.isFinite(value.v)
  )
}

function isCandleResponse(
  value: unknown,
  symbol: SymbolName,
  timeframe: Timeframe,
): value is CandleResponse {
  return (
    isRecord(value) &&
    value.symbol === symbol &&
    value.tf === timeframe &&
    Array.isArray(value.candles) &&
    value.candles.every(isCandle)
  )
}

function getApiErrorMessage(status: number, body: string): string {
  try {
    const parsed: unknown = JSON.parse(body)
    if (isRecord(parsed) && typeof parsed.message === 'string') {
      return parsed.message
    }
    if (
      isRecord(parsed) &&
      Array.isArray(parsed.message) &&
      parsed.message.every((item) => typeof item === 'string')
    ) {
      return parsed.message.join(' ')
    }
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error
  }

  return `El servidor respondió con HTTP ${status}.`
}

function formatPrice(value: number): string {
  return priceFormat.format(value)
}

function formatTime(value: string): string {
  return timeFormat.format(new Date(value))
}

function formatSessionRange(candles: Candle[]): string {
  const first = new Date(candles[0].t)
  const last = new Date(candles[candles.length - 1].t)

  return `${dateFormat.format(first)} · ${timeFormat.format(first)}–${timeFormat.format(last)} UTC`
}

function CandleChart({ candles }: { candles: Candle[] }) {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartWidth, setChartWidth] = useState(960)

  useEffect(() => {
    const element = chartRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setChartWidth(Math.max(280, Math.round(entry.contentRect.width)))
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const width = chartWidth
  const height = 340
  const left = 66
  const right = width - 18
  const top = 62
  const bottom = 286
  const closes = candles.map((candle) => candle.c)
  const rawMin = Math.min(...closes)
  const rawMax = Math.max(...closes)
  const padding = rawMax === rawMin ? Math.max(Math.abs(rawMin) * 0.001, 1) : (rawMax - rawMin) * 0.12
  const min = rawMin - padding
  const max = rawMax + padding
  const x = (index: number) =>
    candles.length === 1
      ? (left + right) / 2
      : left + (index / (candles.length - 1)) * (right - left)
  const y = (value: number) => top + ((max - value) / (max - min)) * (bottom - top)
  const points = candles.map((candle, index) => `${x(index)},${y(candle.c)}`).join(' ')
  const lastIndex = candles.length - 1
  const lastX = x(lastIndex)
  const lastY = y(candles[lastIndex].c)
  const labelWidth = 112
  const labelX = Math.min(Math.max(lastX - labelWidth / 2, left), right - labelWidth)
  const labelY = 8
  const priceTicks = [0, 1, 2, 3].map((step) => max - ((max - min) * step) / 3)
  const timeIndices = [...new Set([0, Math.floor(lastIndex / 2), lastIndex])]

  return (
    <div className="chart-viewport" ref={chartRef}>
      <svg
        className="price-chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Precio de cierre de ${candles.length} velas. Último cierre ${formatPrice(candles[lastIndex].c)} a las ${formatTime(candles[lastIndex].t)} UTC.`}
      >
        <title>Precio de cierre</title>
        <desc>
          Gráfico de líneas en orden cronológico. El punto final está conectado a
          su precio exacto.
        </desc>
        {priceTicks.map((tick, index) => {
          const tickY = y(tick)
          return (
            <g key={index}>
              <line className="chart-grid" x1={left} x2={right} y1={tickY} y2={tickY} />
              <text className="chart-axis" x={left - 10} y={tickY + 4} textAnchor="end">
                {formatPrice(tick)}
              </text>
            </g>
          )
        })}
        <polyline className="chart-line" points={points} />
        {candles.map((candle, index) => (
          <circle
            className={index === lastIndex ? 'chart-point chart-point-latest' : 'chart-point'}
            cx={x(index)}
            cy={y(candle.c)}
            key={candle.t}
            r={index === lastIndex ? 5 : 2.5}
          >
            <title>
              {formatTime(candle.t)} UTC · cierre {formatPrice(candle.c)}
            </title>
          </circle>
        ))}
        <polyline
          className="latest-guide"
          points={`${labelX + labelWidth / 2},${labelY + 35} ${lastX},${labelY + 35} ${lastX},${lastY - 5}`}
        />
        <rect className="latest-tag" height="25" rx="3" width={labelWidth} x={labelX} y={labelY} />
        <text className="latest-tag-text" textAnchor="middle" x={labelX + labelWidth / 2} y={labelY + 17}>
          {formatPrice(candles[lastIndex].c)}
        </text>
        {timeIndices.map((index) => (
          <text
            className="chart-axis"
            key={candles[index].t}
            textAnchor={index === 0 ? 'start' : index === lastIndex ? 'end' : 'middle'}
            x={x(index)}
            y={height - 13}
          >
            {formatTime(candles[index].t)}
          </text>
        ))}
      </svg>
    </div>
  )
}

function App() {
  const [symbol, setSymbol] = useState<SymbolName>('MES')
  const [timeframe, setTimeframe] = useState<Timeframe>('5m')
  const [response, setResponse] = useState<CandleResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCandles() {
      setLoading(true)
      setError(null)
      setResponse(null)

      try {
        const query = new URLSearchParams({ symbol, tf: timeframe })
        const result = await fetch(`/candles?${query}`, {
          signal: controller.signal,
        })

        if (!result.ok) {
          const body = await result.text()
          throw new Error(getApiErrorMessage(result.status, body))
        }

        let payload: unknown
        try {
          payload = await result.json()
        } catch (parseError) {
          if (!(parseError instanceof SyntaxError)) throw parseError
          throw new Error('La API devolvió una respuesta que no es JSON válido.')
        }

        if (!isCandleResponse(payload, symbol, timeframe)) {
          throw new Error('La API devolvió datos de velas con un formato inesperado.')
        }

        setResponse(payload)
      } catch (loadError) {
        if (controller.signal.aborted) return
        if (loadError instanceof TypeError) {
          setError('No se pudo conectar con el backend. Verifica que esté iniciado e intenta otra vez.')
        } else {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Ocurrió un error inesperado al cargar las velas.',
          )
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadCandles()
    return () => controller.abort()
  }, [retryCount, symbol, timeframe])

  const candles = response?.candles ?? []
  const latest = candles[candles.length - 1]
  const sessionHigh = candles.length > 0 ? Math.max(...candles.map((candle) => candle.h)) : null
  const sessionLow = candles.length > 0 ? Math.min(...candles.map((candle) => candle.l)) : null
  const totalVolume = candles.reduce((total, candle) => total + candle.v, 0)

  return (
    <main className="page-shell">
      <header className="topbar">
        <a aria-label="ArrowFin, inicio" className="wordmark" href="/">
          ARROWFIN <span>/</span> MARKET DATA
        </a>
        <p className="dataset-note">
          <span className="dataset-dot" />
          Datos de evaluación · simulados · UTC
        </p>
      </header>

      <section className="workspace" aria-labelledby="page-title">
        <div className="page-heading">
          <div>
            <h1 id="page-title">Registro de velas</h1>
            <p className="session-date">
              {candles.length > 0
                ? formatSessionRange(candles)
                : 'Una sesión de mercado · 25 ago 2026'}
            </p>
          </div>
          <span className="session-stamp">UNA SESIÓN</span>
        </div>

        <section className="filters" aria-label="Parámetros de consulta">
          <div className="filter-field">
            <label htmlFor="symbol">Contrato</label>
            <select
              id="symbol"
              onChange={(event) => {
                if (isSymbolName(event.currentTarget.value)) {
                  setSymbol(event.currentTarget.value)
                }
              }}
              value={symbol}
            >
              {SYMBOLS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label htmlFor="timeframe">Timeframe</label>
            <select
              id="timeframe"
              onChange={(event) => {
                if (isTimeframe(event.currentTarget.value)) {
                  setTimeframe(event.currentTarget.value)
                }
              }}
              value={timeframe}
            >
              {TIMEFRAMES.map((item) => (
                <option key={item} value={item}>
                  {item === '1h'
                    ? '1 hora'
                    : `${item.slice(0, -1)} ${item === '1m' ? 'minuto' : 'minutos'}`}
                </option>
              ))}
            </select>
          </div>
          <p className="filter-summary">
            {response
              ? `${candles.length} ${candles.length === 1 ? 'intervalo' : 'intervalos'} · ${symbol} · ${timeframe}`
              : 'Selecciona contrato y timeframe'}
          </p>
        </section>

        {error ? (
          <section aria-labelledby="error-title" className="feedback error-panel" role="alert">
            <div className="feedback-mark" aria-hidden="true">!</div>
            <div>
              <h2 id="error-title">No se pudieron cargar las velas</h2>
              <p>{error}</p>
              <button className="retry-button" onClick={() => setRetryCount((count) => count + 1)} type="button">
                Reintentar consulta
              </button>
            </div>
          </section>
        ) : loading ? (
          <section aria-label="Cargando datos de velas" aria-live="polite" className="loading-state" role="status">
            <div className="loading-rule" />
            <p>Consultando {symbol} · {timeframe}…</p>
          </section>
        ) : candles.length === 0 ? (
          <section className="feedback empty-panel" role="status">
            <h2>No hay velas para esta consulta</h2>
            <p>El dataset no contiene intervalos para {symbol} en {timeframe}.</p>
          </section>
        ) : (
          <>
            <section aria-label="Resumen de la respuesta" className="measurements">
              <div className="measurement">
                <span>Último cierre</span>
                <strong>{formatPrice(latest.c)}</strong>
              </div>
              <div className="measurement">
                <span>Máximo de sesión</span>
                <strong>{sessionHigh === null ? '—' : formatPrice(sessionHigh)}</strong>
              </div>
              <div className="measurement">
                <span>Mínimo de sesión</span>
                <strong>{sessionLow === null ? '—' : formatPrice(sessionLow)}</strong>
              </div>
              <div className="measurement">
                <span>Volumen total</span>
                <strong>{volumeFormat.format(totalVolume)}</strong>
              </div>
            </section>

            <figure className="chart-panel">
              <figcaption className="chart-heading">
                <div>
                  <h2>Precio de cierre</h2>
                  <p>{symbol} · velas de {timeframe} · precios en puntos</p>
                </div>
                <span className="chart-legend">
                  <span className="legend-mark" />
                  Cierre
                </span>
              </figcaption>
              <CandleChart candles={candles} />
              <div className="chart-footer">
                <span>HORA DE INICIO · UTC</span>
                <span>{candles.length} VELAS · ORDEN CRONOLÓGICO</span>
              </div>
            </figure>
          </>
        )}

        <footer className="page-footer">
          <span>Fuente: dataset de evaluación</span>
          <span>Los minutos sin operaciones no se completan.</span>
        </footer>
      </section>
    </main>
  )
}

export default App
