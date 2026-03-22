import { PipelineLayout, StationHeader, StationFooter } from '../layouts/PipelineLayout';
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
    >
      <div className="max-w-6xl mx-auto p-6 md:p-8 pb-32">
        <StationHeader id={8} title="Bayesian Synthesis" subtitle="Layer 7C: Latent Competence Inference (BKT/Network)" />

        <StationFooter prevPath="/pipeline/7" nextPath="/pipeline/9" />
      </div>
    </PipelineLayout>
  );
}
