import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(to: string) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject: 'Thanks for subscribing to our newsletter!',
      html: `
        <h2>Welcome!</h2>
        <p>Thanks for joining our newsletter. We'll keep you updated on new blogs and news.</p>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error);
  }
}
