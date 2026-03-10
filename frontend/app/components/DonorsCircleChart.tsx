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
  totalDonated: number;
  count: number;
  x: number;
  y: number;
  z: number;
}

interface DonorsCircleChartProps {
  rfc: string;
}

// Color gris para todos los donantes
const DEFAULT_COLOR = '#94A3B8'; // Un gris suave
const HIGHLIGHT_COLOR = '#EF4444'; // Rojo para el destacado

export default function DonorsCircleChart({ rfc }: DonorsCircleChartProps) {
  const [data, setData] = useState<BubbleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topDonor, setTopDonor] = useState<string | null>(null);

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
        
        // Encontrar el donante con mayor donación
        let maxAmount = 0;
        let topDonorRFC = null;
        
        donorsData.forEach(donor => {
          if (donor.totalDonated > maxAmount) {
            maxAmount = donor.totalDonated;
            topDonorRFC = donor.rfc;
          }
        });
        
        setTopDonor(topDonorRFC);
        
        // Encontrar el monto máximo para escalar las burbujas
        const maxAmountForScale = Math.max(...donorsData.map(d => d.totalDonated));
        
        // Crear datos para burbujas con tamaños proporcionales
        const bubbleData: BubbleData[] = donorsData.map((donor) => {
          // Escalar el tamaño
          const minSize = 80;
          const maxSize = 200;
          const scaledSize = minSize + (donor.totalDonated / maxAmountForScale) * (maxSize - minSize);
          
          return {
            name: donor.rfc,
            totalDonated: donor.totalDonated,
            count: donor.count,
            x: donor.count,
            y: donor.totalDonated,
            z: scaledSize
          };
        });

        setData(bubbleData);
        setError(null);
      } catch (err) {
        console.error('Error en fetchDonors:', err);
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
      const isTopDonor = data.name === topDonor;
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '8px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '12px'
        }}>
          <p style={{ 
            fontWeight: 600, 
            margin: '0 0 4px 0', 
            color: isTopDonor ? HIGHLIGHT_COLOR : '#1a202c'
          }}>
            RFC: {data.name}
            {isTopDonor && ' 🏆'}
          </p>
          <p style={{ margin: '2px 0', color: '#2d3748' }}>
            Total donado: ${data.totalDonated.toLocaleString()}
          </p>
          <p style={{ margin: '2px 0', color: '#2d3748' }}>
            No. donaciones: {data.count}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  // Función para determinar el color de cada burbuja
  const getBubbleColor = (donorName: string) => {
    return donorName === topDonor ? HIGHLIGHT_COLOR : DEFAULT_COLOR;
  };

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096', fontSize: '14px' }}>Cargando donantes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#e53e3e', fontSize: '14px' }}>Error: {error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#718096', fontSize: '14px' }}>No hay donantes registrados</p>
      </div>
    );
  }

  // Agrupar donantes por número de donaciones para mejor visualización
  const donorsByCount = data.reduce((acc, donor) => {
    if (!acc[donor.count]) {
      acc[donor.count] = [];
    }
    acc[donor.count].push(donor);
    return acc;
  }, {} as Record<number, BubbleData[]>);

  // Crear una copia de los datos con pequeñas variaciones en X para donantes con el mismo count
  const adjustedData = data.map(donor => {
    // Si hay múltiples donantes con el mismo número de donaciones, 
    // añadir una pequeña variación para que no se superpongan completamente
    const sameCountDonors = donorsByCount[donor.count] || [];
    if (sameCountDonors.length > 1) {
      const index = sameCountDonors.findIndex(d => d.name === donor.name);
      // Añadir un pequeño offset basado en el índice (-0.2 a +0.2)
      const offset = (index - (sameCountDonors.length - 1) / 2) * 0.15;
      return {
        ...donor,
        x: donor.count + offset
      };
    }
    return donor;
  });

  // Obtener valores únicos de count
  const uniqueCounts = [...new Set(data.map(d => d.count))].sort((a, b) => a - b);
  const maxCount = Math.max(...uniqueCounts, 1);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        >
          <XAxis
            type="number"
            dataKey="x"
            name="Número de donaciones"
            label={{
              value: 'Número de donaciones',
              position: 'bottom',
              offset: 20,
              style: { fill: '#4a5568', fontSize: '12px', fontWeight: 500 }
            }}
            domain={[0.5, maxCount + 0.5]}
            ticks={uniqueCounts}
            tick={{ fill: '#718096', fontSize: '11px' }}
            tickLine={{ stroke: '#cbd5e0' }}
            axisLine={{ stroke: '#cbd5e0' }}
            allowDecimals={false}
            interval={0}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Monto total donado"
            label={{
              value: 'Monto total donado ($)',
              angle: -90,
              position: 'left',
              offset: 30,
              style: { fill: '#4a5568', fontSize: '12px', fontWeight: 500, textAnchor: 'middle' }
            }}
            tickFormatter={formatYAxis}
            domain={[0, 'dataMax + 500']}
            tick={{ fill: '#718096', fontSize: '11px' }}
            tickLine={{ stroke: '#cbd5e0' }}
            axisLine={{ stroke: '#cbd5e0' }}
          />
          <ZAxis
            type="number"
            dataKey="z"
            range={[60, 200]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            data={adjustedData}
            fill="#8884d8"
            shape="circle"
            isAnimationActive={false}
          >
            {adjustedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getBubbleColor(entry.name)}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      {/* Leyenda opcional */}
      <div style={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '11px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: DEFAULT_COLOR, marginRight: '6px' }}></div>
          <span style={{ color: '#4a5568' }}>Donantes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: HIGHLIGHT_COLOR, marginRight: '6px' }}></div>
          <span style={{ color: '#4a5568' }}>Mayor donante</span>
        </div>
      </div>
    </div>
  );
}