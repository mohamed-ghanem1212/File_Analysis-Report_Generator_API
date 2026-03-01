export const mapSeverity = (
  eslintSeverity: number,
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  switch (eslintSeverity) {
    case 1:
      return 'LOW';
    case 2:
      return 'HIGH';
    default:
      return 'LOW';
  }
};
