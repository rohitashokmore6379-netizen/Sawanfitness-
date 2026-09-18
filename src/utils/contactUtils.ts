/**
 * Contact utility helpers for Sawan Fitness Club
 * Ensures proper external URL handling for tel, mailto, Google Maps, and WhatsApp.
 */

export function cleanPhoneNumber(raw: string): string {
  // Extract only digits and leading plus
  return raw.replace(/[^0-9+]/g, '');
}

export function cleanWhatsAppNumber(raw: string): string {
  // WhatsApp wa.me requires digits only (country code + number, e.g. 918408900786)
  const digits = raw.replace(/\D/g, '');
  // If user enters 10 digits without India code (e.g. 8408900786), prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function getTelUrl(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  return `tel:${cleaned}`;
}

export function getMailtoUrl(email: string, subject = 'Enquiry for Sawan Fitness Club'): string {
  const encodedSubject = encodeURIComponent(subject);
  return `mailto:${email}?subject=${encodedSubject}`;
}

export function getWhatsAppUrl(
  phone: string,
  message = 'Hello Sohel Sir, I would like to know more about Sawan Fitness Club membership and training programs.'
): string {
  const cleanNumber = cleanWhatsAppNumber(phone);
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
}

export function getGoogleMapsDirectionsUrl(address: string, customUrl?: string): string {
  if (customUrl && customUrl.trim().startsWith('http')) {
    return customUrl.trim();
  }
  const query = encodeURIComponent(address || 'Sawan Fitness Club, Gargoti, Kolhapur');
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
