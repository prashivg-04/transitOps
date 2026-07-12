import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertCircle } from 'lucide-react';

// ─── KPI data ─────────────────────────────────────────────────────────────────
const KPI_CARDS = [
  {
    label:  'Fuel Efficiency',
    value:  '8.4',
    unit:   'km/l',
    accent: '#3b82f6',   // blue
    accentBg: 'rgba(59,130,246,0.03)',
  },
  {
    label:  'Fleet Utilization',
    value:  '81',
    unit:   '%',
    accent: '#22c55e',   // green
    accentBg: 'rgba(34,197,94,0.03)',
  },
  {
    label:  'Operational Cost',
    value:  '34,070',
    unit:   '',
    accent: '#f97316',   // orange
    accentBg: 'rgba(249,115,22,0.03)',
  },
  {
    label:  'Vehicle ROI',
    value:  '14.2',
    unit:   '%',
    accent: '#eab308',   // yellow
    accentBg: 'rgba(234,179,8,0.03)',
  },
];

// ─── Monthly revenue bar chart data ──────────────────────────────────────────
const MONTHLY_REVENUE = [
  { month: 'Aug',  value: 52 },
  { month: 'Sep',  value: 61 },
  { month: 'Oct',  value: 58 },
  { month: 'Nov',  value: 70 },
  { month: 'Dec',  value: 67 },
  { month: 'Jan',  value: 80 },
  { month: 'Feb',  value: 90 },
  { month: 'Mar',  value: 84 },
  { month: 'Apr',  value: 95 },
  { month: 'May',  value: 88 },
];

// ─── Costliest vehicles horizontal bar data ───────────────────────────────────
const COSTLIEST = [
  { name: 'TRUCK-11', cost: 2450000, color: '#ef4444' },  // red
  { name: 'MINI-03',  cost: 410000,  color: '#f97316' },  // orange
  { name: 'VAN-05',   cost: 620000,  color: '#3b82f6' },  // blue
];
const MAX_COST = Math.max(...COSTLIEST.map((c) => c.cost));

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCount(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const num = parseFloat(String(target).replace(/,/g, ''));
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(+(num * eased).toFixed(1));
      if (progress < 1) requestAnimationFrame(step);
      else setDisplay(num);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return display;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, unit, accent, accentBg, delay }) {
  const numericTarget = parseFloat(String(value).replace(/,/g, ''));
  const counted = useCount(numericTarget, 900);
  const formatted =
    String(value).includes(',')
      ? Math.round(counted).toLocaleString('en-IN')
      : counted % 1 === 0
      ? String(Math.round(counted))
      : counted.toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-slate-900/35 border border-slate-850 p-5 rounded-2xl shadow-premium backdrop-blur-sm relative overflow-hidden flex flex-col gap-2 group hover:border-slate-800 transition-colors"
      style={{ borderLeft: `4px solid ${accent}`, background: accentBg }}
    >
      <span
        className="text-[10px] font-black uppercase tracking-wider transition-colors"
        style={{ color: accent }}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-3xl font-extrabold text-white leading-none font-mono tracking-tight">
          {formatted}
        </span>
        {unit && (
          <span className="text-sm font-bold text-slate-400 font-mono ml-0.5">{unit}</span>
        )}
      </div>
    </motion.div>
  );
}

// ─── SVG Bar Chart (Monthly Revenue) ─────────────────────────────────────────
const CHART_H   = 180;
const CHART_PAD = { top: 12, bottom: 28, left: 4, right: 4 };
const BAR_COLOR = '#3B82F6';
const BAR_GAP   = 8;

function RevenueBarChart({ data }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const maxVal    = Math.max(...data.map((d) => d.value));
  const innerH    = CHART_H - CHART_PAD.top - CHART_PAD.bottom;
  const barWidth  = `${100 / data.length}%`;

  return (
    <svg
      ref={ref}
      width="100%"
      height={CHART_H}
      className="overflow-visible select-none"
      viewBox={`0 0 ${data.length * 48} ${CHART_H}`}
      preserveAspectRatio="none"
    >
      {data.map((d, i) => {
        const barH   = animated ? (d.value / maxVal) * innerH : 0;
        const x      = i * 48 + BAR_GAP / 2;
        const bw     = 48 - BAR_GAP;
        const y      = CHART_PAD.top + (innerH - barH);

        return (
          <g key={d.month}>
            {/* Bar with gradient accent style */}
            <rect
              x={x}
              y={CHART_PAD.top + innerH}
              width={bw}
              height={0}
              rx={4}
              fill={BAR_COLOR}
              opacity={0.8}
              style={{
                transition: `y 0.7s cubic-bezier(.22,1,.36,1) ${i * 0.04}s, height 0.7s cubic-bezier(.22,1,.36,1) ${i * 0.04}s`,
              }}
            >
              {animated && (
                <animate
                  attributeName="height"
                  from="0"
                  to={barH}
                  dur={`0.7s`}
                  begin={`${i * 0.04}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                  keyTimes="0;1"
                />
              )}
              {animated && (
                <animate
                  attributeName="y"
                  from={CHART_PAD.top + innerH}
                  to={y}
                  dur={`0.7s`}
                  begin={`${i * 0.04}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.22 1 0.36 1"
                  keyTimes="0;1"
                />
              )}
            </rect>

            {/* Month label */}
            <text
              x={x + bw / 2}
              y={CHART_H - 8}
              textAnchor="middle"
              fontSize="8"
              fill="#64748B"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Horizontal Cost Bar ──────────────────────────────────────────────────────
function CostBar({ name, cost, color, maxCost, delay }) {
  const pct = (cost / maxCost) * 100;
  const fmt = new Intl.NumberFormat('en-IN').format(cost);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-4 select-none"
    >
      <span className="text-[10px] font-bold text-slate-400 font-mono w-16 flex-shrink-0">
        {name}
      </span>
      <div className="flex-1 bg-slate-950 border border-slate-900 rounded-xl h-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-xl"
          style={{ background: color }}
        />
      </div>
      <span className="text-[10px] text-slate-400 font-mono w-20 text-right flex-shrink-0 font-bold">
        ₹{fmt}
      </span>
    </motion.div>
  );
}

// ─── Analytics Page ───────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  return (
    <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 min-h-screen text-left bg-slate-950 font-sans relative">

      {/* Page Header */}
      <div>
        <h1 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          <BarChart3 size={20} className="text-primary-light" />
          Operations Intelligence
        </h1>
        <p className="text-xs text-slate-500 max-w-xl mt-1">
          Evaluate fuel diagnostics, equipment uptime, operational cost allocations, and acquisition asset ROI.
        </p>
      </div>

      {/* ── KPI Cards Row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_CARDS.map((card, i) => (
          <KpiCard key={card.label} {...card} delay={i * 0.08} />
        ))}
      </div>

      {/* ── ROI formula note ── */}
      <div className="flex items-center gap-2 bg-slate-900/20 border border-slate-850/50 p-4 rounded-xl -mt-2">
        <AlertCircle size={14} className="text-slate-550 flex-shrink-0" />
        <p className="text-[10px] text-slate-500 leading-normal font-mono font-medium">
          ROI Calculation Formula: (Revenue – (Maintenance + Fuel Refuel)) / Acquisition Cost
        </p>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 items-stretch">

        {/* Monthly Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="lg:col-span-8 flex flex-col gap-5 bg-slate-900/35 border border-slate-850 p-6 rounded-2xl shadow-premium backdrop-blur-sm"
        >
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Monthly Operation Revenue (₹ Lakhs)
          </span>
          <div className="flex-1 flex items-end pt-3">
            <RevenueBarChart data={MONTHLY_REVENUE} />
          </div>
        </motion.div>

        {/* Top Costliest Vehicles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="lg:col-span-4 flex flex-col gap-5 bg-slate-900/35 border border-slate-850 p-6 rounded-2xl shadow-premium backdrop-blur-sm"
        >
          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
            Top Costliest Fleet Assets
          </span>
          <div className="flex flex-col gap-4 flex-1 justify-center py-2">
            {COSTLIEST.map((item, i) => (
              <CostBar
                key={item.name}
                {...item}
                maxCost={MAX_COST}
                delay={0.5 + i * 0.1}
              />
            ))}
          </div>
        </motion.div>

      </div>

    </div>
  );
}
