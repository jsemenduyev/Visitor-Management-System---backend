export const normalizePhoneDigits = (phone?: string | null): string =>
  (phone ?? "").replace(/\D/g, "");

export const phonesAreDuplicate = (
  primary?: string | null,
  secondary?: string | null,
): boolean => {
  const primaryDigits = normalizePhoneDigits(primary);
  const secondaryDigits = normalizePhoneDigits(secondary);
  return Boolean(
    primaryDigits && secondaryDigits && primaryDigits === secondaryDigits,
  );
};
