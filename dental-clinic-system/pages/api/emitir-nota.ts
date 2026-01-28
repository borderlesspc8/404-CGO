import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { exemploPayloadNota } from '../../lib/exemplo-payload-notaas';

// Endpoint para emissão manual de NFS-e via Notaas
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Aqui você pode receber os dados do frontend ou usar o exemplo
  const payload = req.body || exemploPayloadNota;

  try {
    const response = await axios.post(
      'https://api.notaas.com/v1/nfse',
      payload,
      {
        headers: {
          'Authorization': `Bearer SUA_API_KEY_AQUI`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || 'Erro ao emitir nota',
    });
  }
}
