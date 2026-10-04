const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? '')
    .split(/[,;\s]+/)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
)

export function isAdminEmail(email: string | null | undefined) {
  return !!email && adminEmails.has(email.trim().toLowerCase())
}
