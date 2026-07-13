/**
 * Dados de contato e credenciais. Fonte única — trocar aqui muda as 5 versões.
 */

export const WHATSAPP_NUMBER = '351964987386'

export const CONTACT = {
  instagramHandle: '@psialineferezin',
  instagramUrl: 'https://instagram.com/psialineferezin',
  /** Link do WhatsApp com mensagem pré-preenchida (a mensagem vem do conteúdo, por idioma). */
  whatsapp(message: string) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
  },
}

export const CREDENTIALS = {
  fullName: 'Aline Ferezin dos Santos',
  /** Ordem dos Psicólogos Portugueses / Conselho Regional de Psicologia (Brasil). */
  cpp: 'CPP 30603',
  crp: 'CRP 06/162739',
  location: 'Vila Nova de Gaia, Portugal',
}
