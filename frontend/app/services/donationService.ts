
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3005';

export interface Donation {
  ID: number;
  Monto: string;
  Fecha: string;
  Necesita_CFDI: number;
  Referencia: string;
  Tipo: string;
  Valor_estimado: string;
  Descripcion_delbien: string | null;
  Fotografia_delbien: string | null;
  rfc_donantes: string;
  rfc_OSC: string;
}

export async function getOSCDonationsLastSixMonths(rfc: string): Promise<Donation[]> {
  try {
    // Ahora usamos POST (no GET)
    const url = `${API_URL}/api/donations/osc/last-six-months`;
    console.log('Enviando POST a:', url);
    console.log('RFC:', rfc);
    
    const response = await fetch(url, {
      method: 'POST',  // Cambiado de GET a POST
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rfc })  // RFC en el body
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('Datos recibidos:', data);
    return data;
  } catch (error) {
    console.error('Error en getOSCDonationsLastSixMonths:', error);
    throw error;
  }
}