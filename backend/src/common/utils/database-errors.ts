/** PostgreSQL error code for a unique constraint violation. */
const UNIQUE_VIOLATION_CODE = '23505';

export function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  return (error as { code?: string }).code === UNIQUE_VIOLATION_CODE;
}
