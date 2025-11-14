export enum ConfidenceCheckResult {
  TIRE_LIKELY = 'tire likely',
  MAYBE_A_TIRE = 'maybe a tire',
  PROBABLY_NOT_A_TIRE = 'probably not a tire',
}

export const makeConfidenceChecker = (threshold: number): ConfidenceCheckResult => {
    if (threshold >= 0.75) {
        return ConfidenceCheckResult.TIRE_LIKELY;
    }
    if (threshold >= 0.5) {
        return ConfidenceCheckResult.MAYBE_A_TIRE;
    }
    return ConfidenceCheckResult.PROBABLY_NOT_A_TIRE;
}