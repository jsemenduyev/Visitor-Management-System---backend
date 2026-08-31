type UserContactFields = {
  email?: string | null;
  email2?: string | null;
  phone?: string | null;
  phone2?: string | null;
};

const unique = (values: string[]) => [...new Set(values)];

export const getUserNotificationEmails = (user: UserContactFields): string[] =>
  unique(
    [user.email, user.email2]
      .map((email) => (email ?? "").trim().toLowerCase())
      .filter(Boolean),
  );

export const getUserNotificationPhones = (user: UserContactFields): string[] =>
  unique(
    [user.phone, user.phone2]
      .map((phone) => (phone ?? "").trim())
      .filter(Boolean),
  );
