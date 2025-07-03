import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {

  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}.</p>`
  })

  if (res.error) {
    return { error: res.error?.message }
  }
}


export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
  })
  // TODO: check errors
  console.log({ res })
  if (res.error) {
    return { error: res.error?.message }
  }
}

export const sendPasswordResetEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  })

  if (res.error) {
    return { error: res.error?.message }
  }
}

export const sendChangeEmail = async (email: string, token: string) => {
  const changeEmailLink = `${domain}/auth/change-email?token=${token}`

  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Change your email",
    html: `<p>Click <a href="${changeEmailLink}">here</a> to change your email.</p>`
  })

  if (res.error) {
    return { error: res.error?.message }
  }
}