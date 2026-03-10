'use client';

import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DonorData {
  rfc: string;
  totalDonated: number;
  count: number;
  lastDonation: string;
}

interface BubbleData {
  name: string;
  value: number;
  count: number;
  x: number;
  y: number;
  z: number;
}

interface DonorsCircleChartProps {
  rfc: string;
}

const COLORS = [
  '#8BC34A', '#4A6B6D', '#FFB74D', '#F06292', 
  '#64B5F6', '#BA68C8', '#4FC3F7', '#81C784',
  '#FF8A65', '#A1887F', '#90A4AE', '#E57373'
];

export default function DonorsCircleChart({ rfc }: DonorsCircleChartProps) {
  const [data, setData] = useState<BubbleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/osc/donors`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rfc }),
          }
        );

        if (!response.ok) {
          throw new Error('Error al cargar donantes');
        }

        const donorsData: DonorData[] = await response.json();
        
        // Crear datos para burbujas
        const bubbleData: BubbleData[] = donorsData.map((donor, index) => ({
          name: donor.rfc,
          value: donor.totalDonated,
          count: donor.count,
          x: index * 2, // Separación horizontal
          y: donor.totalDonated, // Altura basada en monto
          z: donor.totalDonated / 10 // Tamaño de burbuja (ajusta este divisor)
        }));

        setData(bubbleData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (rfc) {
      fetchDonors();
    }
  }, [rfc]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>RFC: {data.name}</p>
          <p style={{ margin: '0' }}>Total donado: ${data.value.toLocaleString()}</p>
          <p style={{ margin: '0' }}>Cantidad: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Cargando donantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No hay donantes registrados</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis 
            type="number" 
            dataKey="x" 
            hide={true} // Ocultar eje X
            domain={[0, data.length * 2]} 
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            hide={true} // Ocultar eje Y
            domain={[0, 'dataMax + 1000']} 
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[50, 400]} // Tamaño mínimo y máximo de burbujas
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter data={data} fill="#8884d8" shape="circle">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}