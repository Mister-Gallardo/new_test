import type { EmailInfo } from '../api'

export const getEmailStatus = (email: EmailInfo) => {
  const emailStatus = email.confirmedEmail ? 'confirmed' : email.newEmail ? 'verifying' : 'none'

  return emailStatus
}
