'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OSC {
  rfc: string;
  nombre: string;
  logo?: string;
  descripcion?: string;
}

interface DonorData {
  nombre: string;
  rfc: string;
  email: string;
  regimenFiscal?: string;
  codigoPostalFiscal?: string;
}

export default function DonorsPage() {
  const router = useRouter();
  const [donorData, setDonorData] = useState<DonorData | null>(null);
  const [oscList, setOscList] = useState<OSC[]>([]);
  const [filteredOSCList, setFilteredOSCList] = useState<OSC[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOSC, setSelectedOSC] = useState<OSC | null>(null);
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [tipoDonacion, setTipoDonacion] = useState('');
  const [referenciaBancaria, setReferenciaBancaria] = useState('');
  const [necesitaCFDI, setNecesitaCFDI] = useState(false);
  
  // Campos específicos por tipo de donativo
  const [descripcionBien, setDescripcionBien] = useState('');
  const [valorEstimado, setValorEstimado] = useState('');
  const [evidenciaFotografica, setEvidenciaFotografica] = useState<File | null>(null);
  const [comprobanteTransferencia, setComprobanteTransferencia] = useState<File | null>(null);
  
  // Campos para CFDI
  const [regimenFiscal, setRegimenFiscal] = useState('');
  const [codigoPostalFiscal, setCodigoPostalFiscal] = useState('');

  useEffect(() => {
    // Check if donor is logged in (placeholder - you'll need to implement donor login)
    const storedData = localStorage.getItem('donor_data');
    
    if (!storedData) {
      router.push('/donor/login');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    setDonorData(parsedData);
      
    // Establecer valores por defecto para CFDI si existen
    if (parsedData.regimenFiscal) {
      setRegimenFiscal(parsedData.regimenFiscal);
    }
    if (parsedData.codigoPostalFiscal) {
      setCodigoPostalFiscal(parsedData.codigoPostalFiscal);
    }
    // Fetch OSCs
    fetchOSCs();
  }, []);

  useEffect(() => {
    // Filter OSCs based on search term
    if (searchTerm.trim() === '') {
      setFilteredOSCList(oscList);
    } else {
      const filtered = oscList.filter(osc =>
        osc.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOSCList(filtered);
    }
  }, [searchTerm, oscList]);

  const fetchOSCs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/osc`);
      if (!response.ok) {
        throw new Error('Error al cargar organizaciones');
      }
      const data = await response.json();
      setOscList(data);
      setFilteredOSCList(data);
    } catch (err) {
      setError('No se pudieron cargar las organizaciones');
      console.error('Error fetching OSCs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('donor_data');
    router.push('/');
  };

  const openModal = (osc: OSC) => {
    setSelectedOSC(osc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOSC(null);
    setMonto('');
    setMetodoPago('');
    setTipoDonacion('');
    setReferenciaBancaria('');
    setNecesitaCFDI(false);
    setDescripcionBien('');
    setValorEstimado('');
    setEvidenciaFotografica(null);
    setComprobanteTransferencia(null);
    
    // Resetear campos CFDI a valores por defecto del donante
    if (donorData?.regimenFiscal) {
      setRegimenFiscal(donorData.regimenFiscal);
    } else {
      setRegimenFiscal('');
    }
    if (donorData?.codigoPostalFiscal) {
      setCodigoPostalFiscal(donorData.codigoPostalFiscal);
    } else {
      setCodigoPostalFiscal('');
    }
  };

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Implement donation submission logic
    console.log('Donation submitted:', {
      osc: selectedOSC?.nombre,
      monto,
      metodoPago,
      tipoDonacion,
      referenciaBancaria,
      necesitaCFDI,
      ...(necesitaCFDI && {
        regimenFiscal,
        codigoPostalFiscal
      }),
      ...(tipoDonacion === 'especie' && {
        descripcionBien,
        valorEstimado,
        evidenciaFotografica: evidenciaFotografica?.name
      }),
      ...(tipoDonacion === 'transferencia' && {
        comprobanteTransferencia: comprobanteTransferencia?.name
      })
    });
    
    // Close modal after submission
    closeModal();
    
    // Show success message (you can add a toast notification here)
    alert('¡Donación registrada exitosamente!');
  };

  // Validar si el formulario está completo
  const isFormValid = () => {
    if (!tipoDonacion) return false;
    
    // Validar campos de CFDI si está seleccionado
    if (necesitaCFDI) {
      if (!regimenFiscal || !codigoPostalFiscal.trim()) {
        return false;
      }
    }
    
    if (tipoDonacion === 'efectivo') {
      return monto.trim() !== '' && parseFloat(monto) > 0;
    }
    
    if (tipoDonacion === 'especie') {
      return descripcionBien.trim() !== '' && 
             valorEstimado.trim() !== '' && 
             parseFloat(valorEstimado) > 0 &&
             evidenciaFotografica !== null;
    }
    
    if (tipoDonacion === 'transferencia') {
      return monto.trim() !== '' && 
             parseFloat(monto) > 0 &&
             comprobanteTransferencia !== null;
    }
    
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-[#4A6B6D]">Apple</span>
                <span className="text-[#8BC34A]">seed</span>
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{donorData?.nombre || 'Organización'}</p>
                <p className="text-xs text-gray-500">{donorData?.rfc}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:text-red-600 cursor-pointer transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Organizaciones Civiles Autorizadas
          </h1>
          <p className="text-gray-600">
            Encuentra y apoya a organizaciones verificadas ante el SAT
          </p>
        </div>

        {/* Search Filter */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre de organización..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* OSC Cards */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Cargando organizaciones...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        ) : filteredOSCList.length === 0 ? (
          <div className=" p-8 text-center">
            <p className="text-gray-500">
              {searchTerm ? 'No se encontraron organizaciones con ese nombre' : 'No hay organizaciones disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOSCList.map((osc) => (
              <div
                key={osc.rfc}
                className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-2 bg-gradient-to-r from-[#8BC34A] to-[#7CB342]"></div>
                
                <div className="p-6">
                  {/* Organization Name - First Row */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                    {osc.nombre}
                  </h3>

                  {/* Two columns below */}
                  <div className="flex gap-6">
                    {/* Left column: Logo */}
                    <div className="flex-shrink-0">
                      <div className="flex justify-center">
                        {osc.logo ? (
                          <div className="w-32 h-32 rounded-full overflow-hidden bg-white relative">
                            <Image 
                              src={osc.logo} 
                              alt={`${osc.nombre} logo`}
                              width={128}
                              height={128}
                              className="object-contain p-2"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-gradient-to-br from-[#4A6B6D] to-[#3A5B5D] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                            {osc.nombre.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right column: Description */}
                    <div className="flex-1 flex flex-col">
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                        {osc.descripcion || 'Organización de la Sociedad Civil autorizada por el SAT para recibir donativos deducibles de impuestos'}
                      </p>
                      
                      {/* Donate Button */}
                      <button 
                        onClick={() => openModal(osc)}
                        className="w-full py-3 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white font-bold rounded-xl hover:from-[#7CB342] hover:to-[#689F38] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
                      >
                        Donar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donation Modal */}
      {isModalOpen && selectedOSC && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Realizar Donación</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Donando a: <span className="font-semibold">{selectedOSC.nombre}</span></p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitDonation} className="p-6 space-y-5">
              {/* Tipo de Donativo - PRIMERO */}
              <div>
                <label htmlFor="tipoDonacion" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo de Donativo
                </label>
                <div className="relative">
                  <select
                    id="tipoDonacion"
                    required
                    value={tipoDonacion}
                    onChange={(e) => setTipoDonacion(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black appearance-none cursor-pointer bg-white"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="especie">Especie</option>
                    <option value="transferencia">Transferencia/Depósito</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Campos condicionales según tipo de donativo */}
              
              {/* SI ES ESPECIE */}
              {tipoDonacion === 'especie' && (
                <>
                  <div>
                    <label htmlFor="descripcionBien" className="block text-sm font-semibold text-gray-700 mb-2">
                      Descripción del Bien
                    </label>
                    <textarea
                      id="descripcionBien"
                      required
                      rows={3}
                      value={descripcionBien}
                      onChange={(e) => setDescripcionBien(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black resize-none"
                      placeholder="Describe el bien que estás donando..."
                    />
                  </div>

                  <div>
                    <label htmlFor="valorEstimado" className="block text-sm font-semibold text-gray-700 mb-2">
                      Valor Estimado (MXN)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        id="valorEstimado"
                        required
                        min="1"
                        step="0.01"
                        value={valorEstimado}
                        onChange={(e) => setValorEstimado(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Evidencia Fotográfica
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="evidenciaFotografica"
                        required
                        accept="image/*"
                        onChange={(e) => setEvidenciaFotografica(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label
                        htmlFor="evidenciaFotografica"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-600">
                          {evidenciaFotografica ? evidenciaFotografica.name : 'Seleccionar archivo...'}
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* SI ES TRANSFERENCIA */}
              {tipoDonacion === 'transferencia' && (
                <>
                  <div>
                    <label htmlFor="monto" className="block text-sm font-semibold text-gray-700 mb-2">
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        id="monto"
                        required
                        min="1"
                        step="0.01"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comprobante de Transferencia
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        id="comprobanteTransferencia"
                        required
                        accept="image/*,.pdf"
                        onChange={(e) => setComprobanteTransferencia(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label
                        htmlFor="comprobanteTransferencia"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      >
                        <span className="text-sm text-gray-600">
                          {comprobanteTransferencia ? comprobanteTransferencia.name : 'Seleccionar archivo...'}
                        </span>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* SI ES EFECTIVO */}
              {tipoDonacion === 'efectivo' && (
                <div>
                  <label htmlFor="monto" className="block text-sm font-semibold text-gray-700 mb-2">
                    Monto
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      id="monto"
                      required
                      min="1"
                      step="0.01"
                      value={monto}
                      onChange={(e) => setMonto(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              {/* Necesita CFDI - Solo si el tipo de donación está seleccionado */}
              {tipoDonacion && (
                <>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="necesitaCFDI"
                      checked={necesitaCFDI}
                      onChange={(e) => setNecesitaCFDI(e.target.checked)}
                      className="w-5 h-5 text-[#8BC34A] border-gray-300 rounded focus:ring-2 focus:ring-[#8BC34A] cursor-pointer"
                    />
                    <label htmlFor="necesitaCFDI" className="text-sm font-medium text-gray-700 cursor-pointer">
                      Necesito CFDI (Factura electrónica para deducción de impuestos)
                    </label>
                  </div>

                  {/* Campos adicionales si necesita CFDI */}
                  {necesitaCFDI && (
                    <>
                      <div>
                        <label htmlFor="regimenFiscal" className="block text-sm font-semibold text-gray-700 mb-2">
                          Régimen Fiscal *
                        </label>
                        <div className="relative">
                          <select
                            id="regimenFiscal"
                            required
                            value={regimenFiscal}
                            onChange={(e) => setRegimenFiscal(e.target.value)}
                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black appearance-none cursor-pointer bg-white"
                          >
                            <option value="">Seleccionar régimen fiscal</option>
                            <option value="601">601 - General de Ley PM</option>
                            <option value="603">603 - Personas Morales Fines no Lucrativos</option>
                            <option value="605">605 - Sueldos y Salarios</option>
                            <option value="606">606 - Arrendamiento</option>
                            <option value="607">607 - Enajenación de Bienes</option>
                            <option value="608">608 - Demás Ingresos</option>
                            <option value="610">610 - Residentes en el Extranjero</option>
                            <option value="611">611 - Dividendos</option>
                            <option value="612">612 - Actividades Empresariales PF</option>
                            <option value="614">614 - Intereses</option>
                            <option value="615">615 - Sin Obligaciones Fiscales</option>
                            <option value="616">616 - Sin Actividad Económica</option>
                            <option value="620">620 - Sociedades Cooperativas</option>
                            <option value="621">621 - Incorporación Fiscal</option>
                            <option value="622">622 - Actividades Agrícolas</option>
                            <option value="623">623 - Opcional para Grupos de Sociedades</option>
                            <option value="624">624 - Coordinados</option>
                            <option value="625">625 - RESICO PF</option>
                            <option value="626">626 - RESICO PM</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="codigoPostalFiscal" className="block text-sm font-semibold text-gray-700 mb-2">
                          Código Postal Fiscal *
                        </label>
                        <input
                          type="text"
                          id="codigoPostalFiscal"
                          required
                          value={codigoPostalFiscal}
                          onChange={(e) => setCodigoPostalFiscal(e.target.value)}
                          maxLength={5}
                          pattern="[0-9]{5}"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                          placeholder="12345"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all duration-300 shadow-lg ${
                    isFormValid()
                      ? 'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white hover:from-[#7CB342] hover:to-[#689F38] hover:shadow-xl cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}