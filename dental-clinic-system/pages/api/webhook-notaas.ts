import type { NextApiRequest, NextApiResponse } from 'next';

// Endpoint para receber webhooks de status de nota do Notaas
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Aqui você pode tratar o evento recebido
  const evento = req.body;
  // Exemplo: atualizar status da cobrança no banco de dados
  // await atualizarStatusCobranca(evento);

  res.status(200).json({ received: true });
}
