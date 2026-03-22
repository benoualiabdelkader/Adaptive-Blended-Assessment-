import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
import { GlassCard } from '../components/GlassCard';
import { getSelectedStudyCase, useStudyScopeStore } from '../state/studyScope';

export function Station08() {
  const cases = useStudyScopeStore((state) => state.cases);
  const selectedCaseId = useStudyScopeStore((state) => state.selectedCaseId);
  const selectedCase = getSelectedStudyCase({ cases, selectedCaseId });

  return (
    <PipelineLayout
      verifiedEnabled={false}
      unavailableTitle="Verified Bayesian Synthesis Unavailable"
      unavailableMessage={
        selectedCase?.analytics?.bayesian.reason
        ?? 'A verified Bayesian service is not connected in the current live build, so this station stays hidden rather than showing reference values.'
      }
      unavailableContent={
        <div className="space-y-6">
          <StationHeader id={8} title="Bayesian Synthesis" subtitle="Layer 7C: Latent Competence Inference (BKT/Network)" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard className="p-4">
              <div className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-sec)] mb-1">Station Role</div>
              <div className="font-forensic text-lg text-[var(--lav)]">Latent Competence</div>
              <div className="font-body text-xs text-[var(--text-sec)] mt-1">Bayesian inference targets the competencies developing underneath visible writing behaviour.</div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-sec)] mb-1">Live Status</div>
              <div className="font-forensic text-lg text-[var(--gold)]">Gated</div>
              <div className="font-body text-xs text-[var(--text-sec)] mt-1">No verified Bayesian service is connected in the current live build.</div>
            </GlassCard>
            <GlassCard className="p-4">
              <div className="font-navigation text-[10px] uppercase tracking-widest text-[var(--text-sec)] mb-1">Teacher Meaning</div>
              <div className="font-forensic text-lg text-[var(--teal)]">Interpretive Layer</div>
              <div className="font-body text-xs text-[var(--text-sec)] mt-1">When enabled, this station should support teacher diagnosis, not replace teacher judgment.</div>
            </GlassCard>
          </div>

          <GlassCard className="p-6 md:p-8">
            <h3 className="font-navigation text-lg font-medium text-[var(--text-primary)] mb-3">Why This Station Exists</h3>
            <p className="font-body text-sm text-[var(--text-sec)] leading-relaxed mb-4">
              Bayesian competence inference belongs in the station architecture because it targets a different research question from descriptive analytics, clustering, and Random Forest. Its role is to estimate latent writing competencies from multiple evidence streams, not merely to summarize visible behaviour.
            </p>
            <p className="font-body text-sm text-[var(--text-sec)] leading-relaxed">
              This station therefore stays visible in the laboratory map as an advanced modelling layer, but it remains unavailable until the live system can compute verified posterior estimates from real workbook evidence.
            </p>
          </GlassCard>
        </div>
      }
      rightPanel={
        <GlassCard className="p-5">
          <h3 className="font-navigation text-sm uppercase tracking-widest text-[var(--lav)] mb-3">Method Position</h3>
          <p className="font-body text-sm text-[var(--text-sec)] leading-relaxed">
            Bayesian modelling remains part of the research architecture because it addresses latent competence inference. In the current live build, however, this station is intentionally gated until a verified Bayesian service is connected.
          </p>
        </GlassCard>
      }
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationFooter prevPath="/pipeline/7" nextPath="/pipeline/9" />
      </div>
    </PipelineLayout>
  );
}
