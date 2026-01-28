import axios from "axios";

export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  return axios.post("/api/send-email", { to, subject, text });
}

export async function sendWhatsApp({ phone, message }: { phone: string; message: string }) {
  return axios.post("/api/send-whatsapp", { phone, message });
}
