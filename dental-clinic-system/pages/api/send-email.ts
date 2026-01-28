import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { to, subject, text } = req.body
  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    // Configure o transporte SMTP (exemplo com Gmail, troque para produção)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    })
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send email', details: error })
  }
}
