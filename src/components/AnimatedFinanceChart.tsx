import { useId, useRef } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { useMotionPreferences, AnimatedMoney } from "./nexo-ui";
import { motionTransition } from "../personalization.js";

type Props = {
  values?: number[];
  labels?: string[];
  colors?: string[];
  kind?: "area" | "bars" | "line" | "donut" | "horizontal";
  visible?: boolean;
};

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const money = (cents: number) => currency.format(cents / 100);

/** Receives the original income series in cents; only its presentation changes. */
export function AnimatedFinanceChart(props: Props) {
  // Mount the observer only when the chart is visible, including after an unlock.
  // Protected values never enter the rendered SVG or accessible table.
  if (props.visible === false)
    return (
      <p className="muted">
        Gráfico oculto enquanto os valores estão protegidos.
      </p>
    );
  return <VisibleFinanceChart {...props} />;
}

function VisibleFinanceChart({
  values = [],
  labels = [],
  colors = [],
  kind = "area",
}: Props) {
  const preferences = useMotionPreferences();
  if (preferences.chart && preferences.chart !== "auto") kind = preferences.chart;
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const inView = useInView(root, { once: !!preferences.efficient, amount: 0.15 });
  const id = useId().replace(/:/g, "");
  const gradient = `finance-area-${id}`;
  const clip = `finance-reveal-${id}`;
  const animation = preferences.chartAnimation || "draw";
  const active =
    preferences.motion !== false && !reduced && animation !== "none";
  const shown = !active || inView;
  const transition = motionTransition(preferences, !active) as Transition;
  const rhythm = Math.min(2, Math.max(0.4, preferences.intensity || 1));
  const delayed = (index: number): Transition => ({
    ...transition,
    delay: active && animation === "stagger" ? index * 0.08 * rhythm : 0,
  });

  const total = values.reduce((sum,value)=>sum+Math.max(0,value),0);
  const isFlow = labels[0]==="Entradas" && labels[1]==="Saídas";
  const palette=["#479ce8","#35b88e","#cf78b1","#e8ae42","#887adc","#e58968"];
  const maximum = Math.max(1, ...values);
  const points = values.map((value, index) => [
    12 + (index * 276) / Math.max(1, values.length - 1),
    108 - (value / maximum) * 90,
  ]);
  const line = points
    .map((point, index) => `${index ? "L" : "M"}${point.join(",")}`)
    .join(" ");
  const grow = animation === "grow";
  const stagger = animation === "stagger";
  const period = (index: number) => labels[index] || `Período ${index + 1}`;
  const description = values.length
    ? values
        .map((value, index) => `${period(index)}: ${money(value)}`)
        .join("; ")
    : "Nenhuma receita neste período.";

  return (
    <motion.div ref={root} className={`chart chart-${kind}`} data-chart-animation={animation} initial={active ? {opacity:0,filter:preferences.efficient?"blur(0px)":"blur(4px)",y:6} : false} animate={{opacity:shown?1:0,filter:preferences.efficient?"none":shown?"blur(0px)":"blur(4px)",y:shown?0:6}} transition={{duration:active ? .35 : 0,ease:[.22,1,.36,1]}}>
      {kind === "donut" ? <div className="finance-donut"><svg viewBox="0 0 300 155" role="img" aria-label={description}><circle cx="78" cy="76" r="53" fill="none" stroke="var(--line)" strokeWidth="16"/>{values.map((value,index)=>{const circumference=2*Math.PI*53;const length=total?Math.max(0,value)/total*circumference:0;const offset=values.slice(0,index).reduce((sum,value)=>sum+Math.max(0,value),0)/Math.max(1,total)*circumference;return <motion.circle key={index} cx="78" cy="76" r="53" fill="none" stroke={colors[index]||palette[index%palette.length]} strokeWidth="16" transform="rotate(-90 78 76)" strokeDashoffset={-offset} initial={active?{strokeDasharray:`0 ${circumference}`} : false} animate={{strokeDasharray:`${shown?length:0} ${circumference}`}} transition={delayed(index)}/>;})}<text x="78" y="72" textAnchor="middle" fill="var(--muted)" fontSize="10">Total</text><text x="78" y="89" textAnchor="middle" fill="var(--text)" fontSize="12">{money(total)}</text></svg><div className="finance-donut-legend">{values.map((value,index)=><div key={index}><i style={{background:colors[index]||palette[index%palette.length]}}/><span>{period(index)}</span><b>{total?Math.round(value/total*100):0}%</b></div>)}</div></div> : (kind === "horizontal" || kind === "bars" && values.length === 2) ? (
        <div className="finance-comparison" role="img" aria-label={description}>
          {values.map((value, index) => {
            const ratio = value / maximum;
            return <div className="finance-comparison-row" key={index}>
              <div className="finance-comparison-copy"><span><i style={{ background: colors[index] || "var(--accent)" }} />{labels[index] || `Período ${index + 1}`}</span><strong className={isFlow ? index === 0 ? "positive-text" : "negative-text" : ""}><AnimatedMoney value={isFlow&&index===1?-Math.abs(value):Math.abs(value)} signed={isFlow} fromZero /></strong></div>
              <div className="finance-comparison-track"><motion.div className="finance-comparison-fill" style={{ background: colors[index] || "var(--accent)", transformOrigin: "left" }} initial={active ? { scaleX: 0 } : false} animate={{ scaleX: shown ? ratio : 0 }} transition={delayed(index)} /></div>
            </div>;
          })}
        </div>
      ) : <svg viewBox="0 0 300 130" role="img" aria-label={description}>
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--accent)" stopOpacity=".4" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity=".02" />
          </linearGradient>
          <clipPath id={clip}>
            <motion.rect
              x="0"
              y="0"
              height="130"
              initial={active && !grow ? { width: 0 } : false}
              animate={{ width: shown ? 300 : 0 }}
              transition={
                stagger && active
                  ? {
                      duration: Math.max(0.2, values.length * 0.08 * rhythm),
                      ease: "linear",
                    }
                  : transition
              }
            />
          </clipPath>
        </defs>
        {[28, 68, 108].map((y) => (
          <line key={y} className="gridline" x1="5" x2="295" y1={y} y2={y} />
        ))}
        {kind === "bars" ? (
          values.map((value, index) => {
            const x = 9 + (index * 284) / Math.max(1, values.length);
            const height = Math.max(2, (value / maximum) * 90);
            return (
              <motion.rect
                key={index}
                className="bar"
                x={x}
                y={108 - (value / maximum) * 90}
                width={Math.max(4, 220 / Math.max(1, values.length))}
                height={height}
                rx="6"
                style={{ transformOrigin: `${x}px 108px`, fill: colors[index] || "var(--accent)" }}
                initial={active ? { scaleY: 0, opacity: 0.3 } : false}
                animate={{ scaleY: shown ? 1 : 0, opacity: shown ? 1 : 0.3 }}
                transition={
                  animation === "draw" && active
                    ? { ...transition, delay: index * 0.055 * rhythm }
                    : delayed(index)
                }
              >
                <title>
                  {period(index)}: {money(value)}
                </title>
              </motion.rect>
            );
          })
        ) : (
          <>
            {kind === "area" && points.length > 0 && (
              <motion.path
                d={`${line} L288,108 L12,108 Z`}
                fill={`url(#${gradient})`}
                clipPath={!grow ? `url(#${clip})` : undefined}
                style={{ transformOrigin: "150px 108px" }}
                initial={active ? { scaleY: grow ? 0 : 1, opacity: 0 } : false}
                animate={{
                  scaleY: shown || !grow ? 1 : 0,
                  opacity: shown ? 1 : 0,
                }}
                transition={transition}
              />
            )}
            {stagger ? (
              points
                .slice(1)
                .map(([x, y], index) => (
                  <motion.path
                    key={index}
                    className="line"
                    d={`M${points[index].join(",")} L${x},${y}`}
                    initial={active ? { pathLength: 0, opacity: 0 } : false}
                    animate={{
                      pathLength: shown ? 1 : 0,
                      opacity: shown ? 1 : 0,
                    }}
                    transition={delayed(index)}
                  />
                ))
            ) : (
              <motion.path
                className="line"
                d={line}
                style={{ transformOrigin: "150px 108px" }}
                initial={
                  active
                    ? { pathLength: grow ? 1 : 0, scaleY: grow ? 0 : 1 }
                    : false
                }
                animate={{
                  pathLength: shown || grow ? 1 : 0,
                  scaleY: shown || !grow ? 1 : 0,
                }}
                transition={transition}
              />
            )}
            {points.map(([x, y], index) => (
              <motion.circle
                key={index}
                className="point"
                cx={x}
                cy={y}
                r="3"
                style={{ transformOrigin: `${x}px ${grow ? 108 : y}px` }}
                initial={
                  active
                    ? {
                        opacity: 0,
                        scale: grow ? 1 : 0.3,
                        y: grow ? 108 - y : 0,
                      }
                    : false
                }
                animate={{
                  opacity: shown ? 1 : 0,
                  scale: shown || grow ? 1 : 0.3,
                  y: shown || !grow ? 0 : 108 - y,
                }}
                transition={
                  active && animation === "draw"
                    ? { ...transition, delay: index * 0.055 * rhythm }
                    : delayed(index)
                }
              >
                <title>
                  {period(index)}: {money(values[index])}
                </title>
              </motion.circle>
            ))}
          </>
        )}
      </svg>}
      {!(kind === "donut" || kind === "horizontal" || kind === "bars" && values.length === 2) && <div
        className={`chart-labels${labels.length > 8 ? " dense-labels" : ""}`}
      >
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>}
      <details className="chart-data">
        <summary>Ver valores do gráfico</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Período</th>
              <th scope="col">Valor em R$</th>
            </tr>
          </thead>
          <tbody>
            {values.map((value, index) => (
              <tr key={index}>
                <td>{period(index)}</td>
                <td>{money(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </motion.div>
  );
}
