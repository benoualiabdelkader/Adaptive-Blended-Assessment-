import React, { useEffect, useMemo } from 'react';
import { useStationStore } from '../../store/stationStore';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';

export default function Station06_LearnerClustering() {
  const setInterpretation = useStationStore(state => state.setInterpretation);

  useEffect(() => {
    setInterpretation({
      notes: "K-Means (k=4) identifies four distinct learner archetypes. Cluster 4 (At-Risk) shows early disengagement (post Week 2) and requires immediate pedagogical redirection.",
      findings: [
        "Cluster 1: Strategic (24% Density) - High-effort learners",
        "Cluster 2: Efficient (31% Density) - High output, low time-on-task",
        "Cluster 3: Struggling (18% Density) - High engagement, low performance",
        "Cluster 4: At-Risk (27% Density) - Declining engagement"
      ],
      references: [
        { author: "Siemens (2013)", title: "Learning Analytics: The Emergence of a Discipline" },
        { author: "Bousbia et al. (2010)", title: "Methods for learner profiling" }
      ]
    });
  }, [setInterpretation]);

  const data = useMemo(() => [
    // Strategic (Indigo)
    { x: 85, y: 80, z: 10, cluster: 'Strategic', color: '#c0c1ff' },
    { x: 78, y: 85, z: 10, cluster: 'Strategic', color: '#c0c1ff' },
    { x: 92, y: 75, z: 10, cluster: 'Strategic', color: '#c0c1ff' },
    { x: 88, y: 90, z: 10, cluster: 'Strategic', color: '#c0c1ff' },
    // Efficient (Teal)
    { x: 90, y: 30, z: 10, cluster: 'Efficient', color: '#4fdbc8' },
    { x: 82, y: 25, z: 10, cluster: 'Efficient', color: '#4fdbc8' },
    { x: 95, y: 35, z: 10, cluster: 'Efficient', color: '#4fdbc8' },
    // Struggling (Amber)
    { x: 30, y: 70, z: 10, cluster: 'Struggling', color: '#ffb95f' },
    { x: 35, y: 65, z: 10, cluster: 'Struggling', color: '#ffb95f' },
    { x: 25, y: 75, z: 10, cluster: 'Struggling', color: '#ffb95f' },
    // At-Risk (Red)
    { x: 20, y: 20, z: 10, cluster: 'At-Risk', color: '#ffb4ab' },
    { x: 15, y: 25, z: 10, cluster: 'At-Risk', color: '#ffb4ab' },
    { x: 25, y: 15, z: 10, cluster: 'At-Risk', color: '#ffb4ab' },
  ], []);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Page Heading */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 data-label text-primary">
            <span className="w-1.5 h-1.5 bg-primary animate-pulse shadow-[0_0_8px_rgba(192,193,255,0.6)]"></span>
            STATION 06 / Learner Clustering
          </div>
          <h1 className="editorial-header text-3xl phosphor-glow">Archetypal Mapping</h1>
          <p className="data-label !text-outline mt-2">Multidimensional Feature Analysis • K-Means (k=4)</p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="bg-surface-container-high px-4 py-1.5 data-label !text-secondary">K-Means</span>
          <span className="bg-surface-container-high px-4 py-1.5 data-label !text-primary font-bold">k=4</span>
          <div className="bg-surface-container-high px-4 py-1.5 flex flex-col items-end rounded-sm">
             <span className="data-label !text-[8px] !text-tertiary">Silhouette Score</span>
             <span className="forensic-mono text-sm text-on-surface font-bold">0.71</span>
          </div>
        </div>
      </header>

      {/* Main Scatter Plot Visual */}
      <div className="bg-surface-container-low p-6 lg:p-10 relative h-[500px] flex flex-col overflow-hidden rounded-sm min-w-0">
        <div className="mb-8 space-y-1">
          <h3 className="font-headline italic text-2xl text-on-surface">Engagement vs. Performance</h3>
          <p className="data-label !text-outline !lowercase">Dimensional Distribution Vectors</p>
        </div>

        <div className="flex-1 min-h-0 min-w-0">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={260} initialDimension={{ width: 700, height: 360 }}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#464554" opacity={0.1} />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Performance" 
                unit="%" 
                stroke="#908fa0" 
                fontSize={10}
                label={{ value: 'Writing Performance →', position: 'bottom', fill: '#908fa0', fontSize: 10, dy: 10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Engagement" 
                unit="%" 
                stroke="#908fa0" 
                fontSize={10}
                label={{ value: 'Engagement Intensity →', angle: -90, position: 'left', fill: '#908fa0', fontSize: 10, dx: -10 }}
              />
              <ZAxis type="number" dataKey="z" range={[100, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#181f32', border: '1px solid #464554', borderRadius: '4px' }}
                itemStyle={{ fontSize: '10px', textTransform: 'uppercase' }}
              />
              <Scatter name="Students" data={data}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-6 justify-center border-t border-outline-variant/10 pt-6">
          {['Strategic', 'Efficient', 'Struggling', 'At-Risk'].map((cluster, i) => (
            <div key={cluster} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${['bg-[#c0c1ff]', 'bg-[#4fdbc8]', 'bg-[#ffb95f]', 'bg-[#ffb4ab]'][i]}`}></span>
              <span className="data-label !text-[9px] font-bold">{cluster}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            name: 'Strategic', 
            color: 'text-primary', 
            bg: 'bg-primary/5',
            icon: 'auto_awesome', 
            count: 12,
            desc: 'High-effort learners utilizing sophisticated structural tools and iterative cycles.' 
          },
          { 
            name: 'Efficient', 
            color: 'text-secondary', 
            bg: 'bg-secondary/5',
            icon: 'bolt', 
            count: 15,
            desc: 'Low time-on-task with exceptionally high output quality. Mastery profiles.' 
          },
          { 
            name: 'Struggling', 
            color: 'text-tertiary', 
            bg: 'bg-tertiary/5',
            icon: 'edit_note', 
            count: 8,
            desc: 'High engagement metrics but limited linguistic performance gains. Feedback mismatch.' 
          },
          { 
            name: 'At-Risk', 
            color: 'text-error', 
            bg: 'bg-error/5',
            icon: 'priority_high', 
            count: 5,
            desc: 'Declining engagement and failing performance. Requires immediate intervention.',
            urgent: true
          }
        ].map((p, i) => (
          <div 
            key={i} 
            className={`p-6 rounded-sm hover:bg-surface-container transition-all group cursor-pointer ${p.bg} ${p.urgent ? 'ring-1 ring-error/20 animate-pulse-slow' : ''}`}
          >
            <div className="flex justify-between items-start mb-6">
              <span className={`material-symbols-outlined ${p.color} group-hover:scale-110 transition-transform`}>{p.icon}</span>
              <span className="data-label !text-outline">n={p.count}</span>
            </div>
            <h4 className={`font-headline text-xl ${p.color} tracking-tight mb-2 italic`}>{p.name}</h4>
            <p className="font-body text-[12px] text-on-surface-variant leading-relaxed">{p.desc}</p>
            {p.urgent && (
              <div className="mt-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-ping"></span>
                <span className="data-label !text-error font-bold !text-[9px]">Urgent Baseline Shift</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
