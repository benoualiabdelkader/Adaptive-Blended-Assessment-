import React, { useEffect, useMemo } from 'react';
import { useStationStore } from '../../store/stationStore';
import { cn } from '../../lib/utils';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

export default function Station03_LearningAnalytics() {
  const setInterpretation = useStationStore((state) => state.setInterpretation);
  const {
    stats = {
      avgRevisionFreq: 4.2,
      feedbackViewRate: 88,
      avgTimeOnTask: 124,
      highEngagementPct: 43
    }
  } = useStationStore();

  useEffect(() => {
    setInterpretation({
      notes:
        "Behavioral analytics confirm a high correlation between feedback view latency and subsequent revision quality. S01-ALPHA demonstrates a 'Strategic' engagement profile with recursive edit cycles.",
      findings: [
        'Avg Revision Frequency: 4.2 (Cohort Avg: 2.8)',
        'Feedback View Rate: 88% (Target: >75%)',
        'Engagement Pattern: High Intensity / Non-linear'
      ],
      references: [
        { author: 'Zimmerman (2008)', title: 'Investigating self-regulation and motivation' },
        { author: 'Winne & Hadwin (1998)', title: 'Metacognition and self-regulated learning' }
      ]
    });
  }, [setInterpretation]);

  const engagementData = useMemo(
    () => [
      { name: 'High', value: 43, color: '#4fdbc8' },
      { name: 'Moderate', value: 32, color: '#c0c1ff' },
      { name: 'Low', value: 25, color: '#ffb95f' }
    ],
    []
  );

  const timelineData = useMemo(
    () => [
      { name: 'D1', val: 40 },
      { name: 'D2', val: 30 },
      { name: 'D3', val: 65 },
      { name: 'D4', val: 45 },
      { name: 'D5', val: 90 },
      { name: 'D6', val: 55 },
      { name: 'D7', val: 70 },
      { name: 'D8', val: 35 },
      { name: 'D9', val: 80 }
    ],
    []
  );

  return (
    <div className="animate-in fade-in space-y-10 duration-700">
      <header className="space-y-2">
        <div className="data-label flex items-center gap-2 text-primary">
          <span className="h-1.5 w-1.5 animate-pulse bg-primary shadow-[0_0_8px_rgba(192,193,255,0.6)]" />
          STATION 03 / Learning Analytics
        </div>
        <h1 className="editorial-header phosphor-glow text-3xl">Learning Analytics</h1>
        <p className="data-label mt-2 !text-outline">Behavioral Overview • Real-time Forensic Synthesis</p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Avg Revision Freq', value: stats.avgRevisionFreq, change: 'UP 12%', type: 'secondary' },
          { label: 'Feedback View Rate', value: `${stats.feedbackViewRate}%`, change: 'STABLE', type: 'primary' },
          { label: 'Avg Time on Task', value: `${stats.avgTimeOnTask}m`, change: 'AGGREGATE', type: 'primary' },
          { label: 'High Engagement', value: `${stats.highEngagementPct}%`, change: 'TARGET', type: 'secondary' }
        ].map((metric, index) => (
          <div key={index} className="card-base group !p-8 transition-transform hover:scale-[1.02]">
            <div className="mb-6 flex items-start justify-between">
              <span className="data-label !tracking-widest opacity-70">{metric.label}</span>
              <span
                className={cn(
                  'forensic-mono rounded-sm border px-2 py-0.5 text-[10px]',
                  metric.type === 'primary'
                    ? 'border-primary/20 bg-primary/5 text-primary'
                    : 'border-secondary/20 bg-secondary/5 text-secondary'
                )}
              >
                {metric.change}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-5xl italic text-on-surface phosphor-glow">{metric.value}</span>
              <span className="data-label !text-[9px] opacity-30">UNIT_049</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex h-[350px] min-w-0 flex-col rounded-sm bg-surface-container-low p-8">
          <h3 className="data-label mb-4 flex items-center justify-between !text-on-surface-variant">
            Engagement Level distribution
            <span className="material-symbols-outlined text-sm opacity-50">pie_chart</span>
          </h3>
          <div className="min-h-0 min-w-0 flex-1 pb-8">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} initialDimension={{ width: 520, height: 260 }}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ color: '#dbe2fc', fontSize: '10px', textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex h-[350px] min-w-0 flex-col rounded-sm bg-surface-container-low p-8">
          <h3 className="data-label mb-4 !text-on-surface-variant">Submission Intensity Timeline</h3>
          <div className="min-h-0 min-w-0 flex-1 pb-8">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} initialDimension={{ width: 520, height: 260 }}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorVal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ color: '#c0c1ff', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="val" stroke="#c0c1ff" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex h-[350px] min-w-0 flex-col rounded-sm bg-surface-container-low p-8">
          <h3 className="data-label mb-4 !text-on-surface-variant">Feedback View Analysis (Stacked)</h3>
          <div className="min-h-0 min-w-0 flex-1 pb-8">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} initialDimension={{ width: 520, height: 260 }}>
              <BarChart
                data={[
                  { name: 'MOD 01', active: 75, ignored: 25 },
                  { name: 'MOD 02', active: 50, ignored: 50 },
                  { name: 'MOD 03', active: 85, ignored: 15 },
                  { name: 'MOD 04', active: 30, ignored: 70 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#464554" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" stroke="#908fa0" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Bar dataKey="active" stackId="a" fill="#4fdbc8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="ignored" stackId="a" fill="#93000a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex h-[350px] min-w-0 flex-col rounded-sm bg-surface-container-low p-8">
          <h3 className="data-label mb-4 !text-on-surface-variant">Time on Task Frequency (Minutes)</h3>
          <div className="min-h-0 min-w-0 flex-1 pb-8">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220} initialDimension={{ width: 520, height: 260 }}>
              <BarChart
                data={[
                  { range: '0-10', val: 15 },
                  { range: '11-20', val: 45 },
                  { range: '21-30', val: 85 },
                  { range: '31-40', val: 65 },
                  { range: '41-50', val: 30 },
                  { range: '51+', val: 10 }
                ]}
              >
                <XAxis dataKey="range" stroke="#908fa0" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                  itemStyle={{ fontSize: '10px' }}
                />
                <Bar dataKey="val" fill="#c0c1ff" radius={[2, 2, 0, 0]}>
                  <Cell fill="#c0c1ff" fillOpacity={0.2} />
                  <Cell fill="#c0c1ff" fillOpacity={0.2} />
                  <Cell fill="#c0c1ff" fillOpacity={1} />
                  <Cell fill="#c0c1ff" fillOpacity={0.2} />
                  <Cell fill="#c0c1ff" fillOpacity={0.2} />
                  <Cell fill="#c0c1ff" fillOpacity={0.2} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-sm border border-outline-variant/15 bg-surface-container-lowest">
        <div className="flex items-center justify-between border-b border-outline-variant/15 bg-surface-container p-4">
          <h4 className="data-label font-bold !text-primary">Forensic Engagement Registry</h4>
          <span className="data-label !text-[9px] !text-outline">N=28 Subjects</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-label w-full border-collapse text-left !text-[11px]">
            <thead>
              <tr className="bg-surface-container-low text-outline">
                <th className="border-b border-outline-variant/10 px-6 py-3 font-medium uppercase">Student ID</th>
                <th className="border-b border-outline-variant/10 px-6 py-3 font-medium uppercase">Profile Type</th>
                <th className="border-b border-outline-variant/10 px-6 py-3 font-medium uppercase">Revision Index</th>
                <th className="border-b border-outline-variant/10 px-6 py-3 font-medium uppercase">Task Velocity</th>
                <th className="border-b border-outline-variant/10 px-6 py-3 text-right font-medium uppercase">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {[
                {
                  id: '#S01-2025',
                  profile: 'HIGH_ENG',
                  color: 'bg-secondary-container text-on-secondary-container',
                  index: '0.84',
                  velocity: 'High',
                  need: 'LOW'
                },
                {
                  id: '#S02-2025',
                  profile: 'AT_RISK',
                  color: 'bg-tertiary-container text-on-tertiary-container',
                  index: '0.12',
                  velocity: 'Low',
                  need: 'CRITICAL'
                },
                {
                  id: '#S03-2025',
                  profile: 'STABLE',
                  color: 'bg-surface-container-highest text-on-surface-variant',
                  index: '0.45',
                  velocity: 'Med',
                  need: 'NOMINAL'
                },
                {
                  id: '#S04-2025',
                  profile: 'HIGH_ENG',
                  color: 'bg-secondary-container text-on-secondary-container',
                  index: '0.91',
                  velocity: 'High',
                  need: 'LOW'
                },
                {
                  id: '#S05-2025',
                  profile: 'LOW_ENG',
                  color: 'bg-surface-container-high text-outline',
                  index: '0.22',
                  velocity: 'Low',
                  need: 'MONITOR'
                }
              ].map((row, index) => (
                <tr key={index} className="group transition-colors hover:bg-primary/5">
                  <td className="forensic-mono px-6 py-4 text-on-surface-variant transition-colors group-hover:text-primary">
                    {row.id}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${row.color}`}>
                      {row.profile}
                    </span>
                  </td>
                  <td className="forensic-mono px-6 py-4 text-on-surface-variant">{row.index}</td>
                  <td className="px-6 py-4 text-on-surface-variant">{row.velocity}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={cn(
                        'rounded-sm px-2 py-0.5 text-[8px] font-bold tracking-tighter',
                        row.need === 'CRITICAL' ? 'bg-error text-on-error' : 'bg-surface-container text-outline'
                      )}
                    >
                      {row.need}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
