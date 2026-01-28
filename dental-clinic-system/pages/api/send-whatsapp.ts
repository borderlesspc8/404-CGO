import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { phone, message } = req.body
  if (!phone || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  try {
    // Exemplo usando API pública do CallMeBot (https://www.callmebot.com/)
    // Para produção, use um provedor oficial (Twilio, Z-API, etc)
    const apiKey = process.env.WHATSAPP_API_KEY
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${apiKey}`
    const response = await axios.get(url)
    if (response.data && response.data.success) {
      return res.status(200).json({ success: true })
    }
    return res.status(500).json({ error: 'Failed to send WhatsApp message', details: response.data })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send WhatsApp message', details: error })
  }
}
