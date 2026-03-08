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
  tipo_persona?: string;
  CFDI?: string | null;
  codigo_postal_fiscal?: string | null;
  regimen_fiscal?: string | null;
  calle?: string | null;
  numero_exterior?: string | null;
  colonia?: string | null;
  municipio?: string | null;
  estado?: string | null;
  curp?: string | null;
  identificacion?: string | null;
  comprobante_domicilio?: string | null;
  declaracion_beneficiario_controlador?: string | null;
  acta_constitutiva?: string | null;
  poderes_legales?: string | null;
  correo_electronico?: string | null;
  constancia_situacion_fiscal?: string | null;
  telefono?: string | null;
  donadoSeisMeses?: number;
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
  const [tipoDonacion, setTipoDonacion] = useState('');
  const [necesitaCFDI, setNecesitaCFDI] = useState(false);
  
  // Campos específicos por tipo de donativo
  const [valorEstimado, setValorEstimado] = useState('');
  const [cartaDonacion, setCartaDonacion] = useState('');
  const [cartaDonacionFileName, setCartaDonacionFileName] = useState('');
  const [documentoPropiedadEspecie, setDocumentoPropiedadEspecie] = useState('');
  const [documentoPropiedadEspecieFileName, setDocumentoPropiedadEspecieFileName] = useState('');
  const [documentoValorEspecie, setDocumentoValorEspecie] = useState('');
  const [documentoValorEspecieFileName, setDocumentoValorEspecieFileName] = useState('');
  
  // Campos para Persona Moral
  const [nombreRepresentanteLegal, setNombreRepresentanteLegal] = useState('');
  const [actaConstitutiva, setActaConstitutiva] = useState('');
  const [actaConstitutivaFileName, setActaConstitutivaFileName] = useState('');
  const [poderRepresentanteLegal, setPoderRepresentanteLegal] = useState('');
  const [poderRepresentanteLegalFileName, setPoderRepresentanteLegalFileName] = useState('');
  const [identificacionRepresentante, setIdentificacionRepresentante] = useState('');
  const [identificacionRepresentanteFileName, setIdentificacionRepresentanteFileName] = useState('');
  const [constanciaSituacionFiscalMoral, setConstanciaSituacionFiscalMoral] = useState('');
  const [constanciaSituacionFiscalMoralFileName, setConstanciaSituacionFiscalMoralFileName] = useState('');
  const [comprobanteDomicilioFiscalMoral, setComprobanteDomicilioFiscalMoral] = useState('');
  const [comprobanteDomicilioFiscalMoralFileName, setComprobanteDomicilioFiscalMoralFileName] = useState('');
  
  // Campos para Persona Física
  const [curp, setCurp] = useState('');
  const [regimenFiscal, setRegimenFiscal] = useState('');
  const [identificacionVigente, setIdentificacionVigente] = useState('');
  const [identificacionVigenteFileName, setIdentificacionVigenteFileName] = useState('');
  const [constanciaSituacionFiscalFisica, setConstanciaSituacionFiscalFisica] = useState('');
  const [constanciaSituacionFiscalFisicaFileName, setConstanciaSituacionFiscalFisicaFileName] = useState('');
  const [comprobanteDomicilioFisica, setComprobanteDomicilioFisica] = useState('');
  const [comprobanteDomicilioFisicaFileName, setComprobanteDomicilioFisicaFileName] = useState('');
  
  // Campos de dirección (compartidos por ambos tipos)
  const [calle, setCalle] = useState('');
  const [numeroExterior, setNumeroExterior] = useState('');
  const [colonia, setColonia] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [estado, setEstado] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  
  // Documentos para montos >= 189,000
  const [declaracionOrigenRecursos, setDeclaracionOrigenRecursos] = useState('');
  const [declaracionOrigenRecursosFileName, setDeclaracionOrigenRecursosFileName] = useState('');
  const [identificacionBeneficiarioControlador, setIdentificacionBeneficiarioControlador] = useState('');
  const [identificacionBeneficiarioControladorFileName, setIdentificacionBeneficiarioControladorFileName] = useState('');
  
  // Upload state
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    // Check if donor is logged in (placeholder - you'll need to implement donor login)
    const storedData = localStorage.getItem('donor_data');
    
    if (!storedData) {
      router.push('/donor/login');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    setDonorData(parsedData);
    
    // Set default values from localStorage if they exist
    if (parsedData.calle) setCalle(parsedData.calle);
    if (parsedData.numero_exterior) setNumeroExterior(parsedData.numero_exterior);
    if (parsedData.colonia) setColonia(parsedData.colonia);
    if (parsedData.municipio) setMunicipio(parsedData.municipio);
    if (parsedData.estado) setEstado(parsedData.estado);
    if (parsedData.codigo_postal_fiscal) setCodigoPostal(parsedData.codigo_postal_fiscal);
    if (parsedData.curp) setCurp(parsedData.curp);
    if (parsedData.regimen_fiscal) setRegimenFiscal(parsedData.regimen_fiscal);
    
    // Fetch OSCs
    fetchOSCs();
  }, [router]);

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
    
    // Load existing files from localStorage
    const storedData = localStorage.getItem('donor_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      // Load person-specific files
      if (parsedData.tipo_persona === 'moral') {
        if (parsedData.acta_constitutiva) {
          setActaConstitutiva(parsedData.acta_constitutiva);
          setActaConstitutivaFileName('Archivo previamente cargado');
        }
        if (parsedData.poderes_legales) {
          setPoderRepresentanteLegal(parsedData.poderes_legales);
          setPoderRepresentanteLegalFileName('Archivo previamente cargado');
        }
        if (parsedData.identificacion) {
          setIdentificacionRepresentante(parsedData.identificacion);
          setIdentificacionRepresentanteFileName('Archivo previamente cargado');
        }
        if (parsedData.constancia_situacion_fiscal) {
          setConstanciaSituacionFiscalMoral(parsedData.constancia_situacion_fiscal);
          setConstanciaSituacionFiscalMoralFileName('Archivo previamente cargado');
        }
        if (parsedData.comprobante_domicilio) {
          setComprobanteDomicilioFiscalMoral(parsedData.comprobante_domicilio);
          setComprobanteDomicilioFiscalMoralFileName('Archivo previamente cargado');
        }
      } else if (parsedData.tipo_persona === 'fisica') {
        if (parsedData.identificacion) {
          setIdentificacionVigente(parsedData.identificacion);
          setIdentificacionVigenteFileName('Archivo previamente cargado');
        }
        if (parsedData.constancia_situacion_fiscal) {
          setConstanciaSituacionFiscalFisica(parsedData.constancia_situacion_fiscal);
          setConstanciaSituacionFiscalFisicaFileName('Archivo previamente cargado');
        }
        if (parsedData.comprobante_domicilio) {
          setComprobanteDomicilioFisica(parsedData.comprobante_domicilio);
          setComprobanteDomicilioFisicaFileName('Archivo previamente cargado');
        }
      }
    }
  };

  // Helper function to extract URL from state (handles both string and object formats)
  const getUrlString = (value: string): string => {
    if (!value) return '';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyValue = value as any;
    return typeof anyValue === 'object' && anyValue.url ? anyValue.url : value;
  };

  // Upload file to S3 immediately when selected
  const handleFileUpload = async (file: File, setUrlState: (url: string) => void, setFileNameState: (name: string) => void) => {
    if (!file) return;
    
    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations/submit-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir archivo');
      }

      const data = await response.json();
      setUrlState(data.url);
      setFileNameState(file.name);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Error al subir archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOSC(null);
    setMonto('');
    setTipoDonacion('');
    setNecesitaCFDI(false);
    setValorEstimado('');
    setCartaDonacion('');
    setCartaDonacionFileName('');
    setDocumentoPropiedadEspecie('');
    setDocumentoPropiedadEspecieFileName('');
    setDocumentoValorEspecie('');
    setDocumentoValorEspecieFileName('');
    
    // Reset donation-specific documents
    setDeclaracionOrigenRecursos('');
    setDeclaracionOrigenRecursosFileName('');
    setIdentificacionBeneficiarioControlador('');
    setIdentificacionBeneficiarioControladorFileName('');

    // Reload donor data from localStorage to repopulate fields
    const storedData = localStorage.getItem('donor_data');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      
      // Reload address fields
      setCalle(parsedData.calle || '');
      setNumeroExterior(parsedData.numero_exterior || '');
      setColonia(parsedData.colonia || '');
      setMunicipio(parsedData.municipio || '');
      setEstado(parsedData.estado || '');
      setCodigoPostal(parsedData.codigo_postal_fiscal || '');
      
      // Reload person-specific fields
      if (parsedData.tipo_persona === 'moral') {
        setNombreRepresentanteLegal('');
        setActaConstitutiva(parsedData.acta_constitutiva || '');
        setActaConstitutivaFileName('');
        setPoderRepresentanteLegal(parsedData.poderes_legales || '');
        setPoderRepresentanteLegalFileName('');
        setIdentificacionRepresentante(parsedData.identificacion || '');
        setIdentificacionRepresentanteFileName('');
        setConstanciaSituacionFiscalMoral(parsedData.constancia_situacion_fiscal || '');
        setConstanciaSituacionFiscalMoralFileName('');
        setComprobanteDomicilioFiscalMoral(parsedData.comprobante_domicilio || '');
        setComprobanteDomicilioFiscalMoralFileName('');
      } else if (parsedData.tipo_persona === 'fisica') {
        setCurp(parsedData.curp || '');
        setRegimenFiscal(parsedData.regimen_fiscal || '');
        setIdentificacionVigente(parsedData.identificacion || '');
        setIdentificacionVigenteFileName('');
        setConstanciaSituacionFiscalFisica(parsedData.constancia_situacion_fiscal || '');
        setConstanciaSituacionFiscalFisicaFileName('');
        setComprobanteDomicilioFisica(parsedData.comprobante_domicilio || '');
        setComprobanteDomicilioFisicaFileName('');
      }
    }
  };

  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Build the JSON payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        tipoDonacion,
        rfc_donador: donorData?.rfc || '',
        rfc_osc: selectedOSC?.rfc || '',
        necesitaCFDI,
        calle,
        numeroExterior,
        colonia,
        municipio,
        estado,
        codigoPostal,
      };
      
      // Amount fields (conditional based on donation type)
      if (tipoDonacion === 'especie') {
        payload.valorEstimado = parseFloat(valorEstimado);
      } else {
        payload.monto = parseFloat(monto);
      }
      
      // Person type specific data and file URLs
      if (donorData?.tipo_persona === 'moral') {
        payload.nombreRepresentanteLegal = nombreRepresentanteLegal;
        
        // Add file URLs
        if (actaConstitutiva) {
          payload.actaConstitutiva = getUrlString(actaConstitutiva);
        }
        if (poderRepresentanteLegal) {
          payload.poderRepresentanteLegal = getUrlString(poderRepresentanteLegal);
        }
        if (identificacionRepresentante) {
          payload.identificacionRepresentante = getUrlString(identificacionRepresentante);
        }
        if (constanciaSituacionFiscalMoral) {
          payload.constanciaSituacionFiscal = getUrlString(constanciaSituacionFiscalMoral);
        }
        if (comprobanteDomicilioFiscalMoral) {
          payload.comprobanteDomicilio = getUrlString(comprobanteDomicilioFiscalMoral);
        }
      } else if (donorData?.tipo_persona === 'fisica') {
        payload.curp = curp;
        payload.regimenFiscal = regimenFiscal;
        
        // Add file URLs
        if (identificacionVigente) {
          payload.identificacion = getUrlString(identificacionVigente);
        }
        if (constanciaSituacionFiscalFisica) {
          payload.constanciaSituacionFiscal = getUrlString(constanciaSituacionFiscalFisica);
        }
        if (comprobanteDomicilioFisica) {
          payload.comprobanteDomicilio = getUrlString(comprobanteDomicilioFisica);
        }
      }
      
      // Donation type specific file URLs
      if (tipoDonacion === 'especie') {
        if (cartaDonacion) {
          payload.cartaDonacion = getUrlString(cartaDonacion);
        }
        
        const valorNum = parseFloat(valorEstimado);
        if (valorNum >= 189000) {
          if (documentoPropiedadEspecie) {
            payload.documentoPropiedad = getUrlString(documentoPropiedadEspecie);
          }
          if (documentoValorEspecie) {
            payload.documentoValor = getUrlString(documentoValorEspecie);
          }
        }
      }
      
      // Documents for amounts >= 189,000
      const montoNumerico = tipoDonacion === 'especie' ? parseFloat(valorEstimado) : parseFloat(monto);
      if (montoNumerico >= 189000) {
        if (declaracionOrigenRecursos) {
          payload.declaracionOrigenRecursos = getUrlString(declaracionOrigenRecursos);
        }
        if (donorData?.tipo_persona === 'moral' && identificacionBeneficiarioControlador) {
          payload.identificacionBeneficiarioControlador = getUrlString(identificacionBeneficiarioControlador);
        }
      }
      
      // Send POST request with JSON
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/donations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al registrar la donación');
      }
      
      const result = await response.json();
      console.log('Donation created:', result);
      
      // Update localStorage with new donor data
      const updatedDonorData: DonorData = {
        nombre: donorData?.nombre || '',
        rfc: donorData?.rfc || '',
        tipo_persona: donorData?.tipo_persona,
        calle,
        numero_exterior: numeroExterior,
        colonia,
        municipio,
        estado,
        codigo_postal_fiscal: codigoPostal,
      };

      // Add person-specific fields
      if (donorData?.tipo_persona === 'moral') {
        updatedDonorData.acta_constitutiva = getUrlString(actaConstitutiva);
        updatedDonorData.poderes_legales = getUrlString(poderRepresentanteLegal);
        updatedDonorData.identificacion = getUrlString(identificacionRepresentante);
        updatedDonorData.constancia_situacion_fiscal = getUrlString(constanciaSituacionFiscalMoral);
        updatedDonorData.comprobante_domicilio = getUrlString(comprobanteDomicilioFiscalMoral);
        if (identificacionBeneficiarioControlador) {
          updatedDonorData.declaracion_beneficiario_controlador = getUrlString(identificacionBeneficiarioControlador);
        }
      } else if (donorData?.tipo_persona === 'fisica') {
        updatedDonorData.curp = curp;
        updatedDonorData.regimen_fiscal = regimenFiscal;
        updatedDonorData.identificacion = getUrlString(identificacionVigente);
        updatedDonorData.constancia_situacion_fiscal = getUrlString(constanciaSituacionFiscalFisica);
        updatedDonorData.comprobante_domicilio = getUrlString(comprobanteDomicilioFisica);
      }

      // Save to localStorage
      localStorage.setItem('donor_data', JSON.stringify(updatedDonorData));
      
      // Update state
      setDonorData(updatedDonorData);
      
      // Close modal after successful submission
      closeModal();
      
      // Show success message
      alert('¡Donación registrada exitosamente!');
      
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert(`Error al registrar la donación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  // Validar si el formulario está completo
  const isFormValid = () => {
    if (!tipoDonacion) return false;
    
    // Validar campos básicos según tipo de donación
    let isBasicValid = false;
    
    if (tipoDonacion === 'efectivo') {
      isBasicValid = monto.trim() !== '' && parseFloat(monto) > 0;
    } else if (tipoDonacion === 'especie') {
      const valorNumerico = parseFloat(valorEstimado);
      isBasicValid = valorEstimado.trim() !== '' && 
             valorNumerico > 0 &&
             cartaDonacion !== '';
      
      // Si el valor es mayor a 189,000, validar documentos adicionales
      if (isBasicValid && valorNumerico >= 189000) {
        isBasicValid = documentoPropiedadEspecie !== '' && documentoValorEspecie !== '';
      }
    } else if (tipoDonacion === 'transferencia') {
      isBasicValid = monto.trim() !== '' && parseFloat(monto) > 0;
    } else if (tipoDonacion === 'cheque') {
      isBasicValid = monto.trim() !== '' && parseFloat(monto) > 0;
    }
    
    if (!isBasicValid) return false;
    
    // Validar campos de dirección (compartidos)
    const isAddressValid = calle.trim() !== '' &&
                          numeroExterior.trim() !== '' &&
                          colonia.trim() !== '' &&
                          municipio.trim() !== '' &&
                          estado.trim() !== '' &&
                          codigoPostal.trim() !== '';
    
    if (!isAddressValid) return false;
    
    // Validar documentos adicionales si el monto >= 189,000
    const montoNumerico = tipoDonacion === 'especie' ? parseFloat(valorEstimado) : parseFloat(monto);
    if (montoNumerico >= 189000) {
      if (declaracionOrigenRecursos === '') return false;
      if (donorData?.tipo_persona === 'moral' && identificacionBeneficiarioControlador === '') return false;
    }
    
    // Validar campos específicos según tipo de persona
    if (donorData?.tipo_persona === 'moral') {
      return nombreRepresentanteLegal.trim() !== '' &&
             actaConstitutiva !== '' &&
             poderRepresentanteLegal !== '' &&
             identificacionRepresentante !== '' &&
             constanciaSituacionFiscalMoral !== '' &&
             comprobanteDomicilioFiscalMoral !== '';
    } else if (donorData?.tipo_persona === 'fisica') {
      return curp.trim() !== '' &&
             regimenFiscal.trim() !== '' &&
             identificacionVigente !== '' &&
             constanciaSituacionFiscalFisica !== '' &&
             comprobanteDomicilioFisica !== '';
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
                    <option value="cheque">Cheque</option>
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
                      Carta de Donación {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          id="cartaDonacion"
                          required={!cartaDonacion}
                          accept=".pdf,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setCartaDonacion, setCartaDonacionFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="cartaDonacion"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {cartaDonacionFileName || 'Seleccionar archivo...'}
                          </span>
                        </label>
                      </div>
                      {cartaDonacion && (
                        <a
                          href={getUrlString(cartaDonacion)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Documentos adicionales si el valor es mayor a 189,000 */}
                  {parseFloat(valorEstimado) >= 189000 && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Documento que Acredite la Propiedad {uploadingFile && '(Subiendo...)'}
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <input
                              type="file"
                              id="documentoPropiedadEspecie"
                              required
                              accept=".pdf,image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, setDocumentoPropiedadEspecie, setDocumentoPropiedadEspecieFileName);
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="documentoPropiedadEspecie"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            >
                              <span className="text-sm text-gray-600">
                                {documentoPropiedadEspecieFileName || 'Seleccionar archivo...'}
                              </span>
                            </label>
                          </div>
                          {documentoPropiedadEspecie && (
                            <a
                              href={getUrlString(documentoPropiedadEspecie)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              Ver archivo
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Documento que Acredite el Valor de la Propiedad {uploadingFile && '(Subiendo...)'}
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <input
                              type="file"
                              id="documentoValorEspecie"
                              required
                              accept=".pdf,image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(file, setDocumentoValorEspecie, setDocumentoValorEspecieFileName);
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="documentoValorEspecie"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                            >
                              <span className="text-sm text-gray-600">
                                {documentoValorEspecieFileName || 'Seleccionar archivo...'}
                              </span>
                            </label>
                          </div>
                          {documentoValorEspecie && (
                            <a
                              href={getUrlString(documentoValorEspecie)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                            >
                              Ver archivo
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {parseFloat(valorEstimado) >= 189000 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Declaración Firmada de Origen de Recursos {uploadingFile && '(Subiendo...)'}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="declaracionOrigenRecursosEspecie"
                            required
                            accept=".pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, setDeclaracionOrigenRecursos, setDeclaracionOrigenRecursosFileName);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="declaracionOrigenRecursosEspecie"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-600">
                              {declaracionOrigenRecursosFileName || 'Seleccionar archivo...'}
                            </span>
                          </label>
                        </div>
                        {declaracionOrigenRecursos && (
                          <a
                            href={getUrlString(declaracionOrigenRecursos)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            Ver archivo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
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

                  {parseFloat(monto) >= 189000 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Declaración Firmada de Origen de Recursos {uploadingFile && '(Subiendo...)'}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="declaracionOrigenRecursosTransferencia"
                            required
                            accept=".pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, setDeclaracionOrigenRecursos, setDeclaracionOrigenRecursosFileName);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="declaracionOrigenRecursosTransferencia"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-600">
                              {declaracionOrigenRecursosFileName || 'Seleccionar archivo...'}
                            </span>
                          </label>
                        </div>
                        {declaracionOrigenRecursos && (
                          <a
                            href={getUrlString(declaracionOrigenRecursos)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            Ver archivo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SI ES EFECTIVO */}
              {tipoDonacion === 'efectivo' && (
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

                  {parseFloat(monto) >= 189000 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Declaración Firmada de Origen de Recursos {uploadingFile && '(Subiendo...)'}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="declaracionOrigenRecursosEfectivo"
                            required
                            accept=".pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, setDeclaracionOrigenRecursos, setDeclaracionOrigenRecursosFileName);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="declaracionOrigenRecursosEfectivo"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-600">
                              {declaracionOrigenRecursosFileName || 'Seleccionar archivo...'}
                            </span>
                          </label>
                        </div>
                        {declaracionOrigenRecursos && (
                          <a
                            href={getUrlString(declaracionOrigenRecursos)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            Ver archivo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SI ES CHEQUE */}
              {tipoDonacion === 'cheque' && (
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

                  {parseFloat(monto) >= 189000 && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Declaración Firmada de Origen de Recursos {uploadingFile && '(Subiendo...)'}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="file"
                            id="declaracionOrigenRecursosCheque"
                            required
                            accept=".pdf,image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, setDeclaracionOrigenRecursos, setDeclaracionOrigenRecursosFileName);
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="declaracionOrigenRecursosCheque"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                          >
                            <span className="text-sm text-gray-600">
                              {declaracionOrigenRecursosFileName || 'Seleccionar archivo...'}
                            </span>
                          </label>
                        </div>
                        {declaracionOrigenRecursos && (
                          <a
                            href={getUrlString(declaracionOrigenRecursos)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            Ver archivo
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Sección de Dirección - compartida por ambos tipos de persona */}
              {tipoDonacion && (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Datos de Domicilio</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label htmlFor="calle" className="block text-sm font-semibold text-gray-700 mb-2">
                        Calle
                      </label>
                      <input
                        type="text"
                        id="calle"
                        required
                        value={calle}
                        onChange={(e) => setCalle(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="Nombre de la calle"
                      />
                    </div>

                    <div>
                      <label htmlFor="numeroExterior" className="block text-sm font-semibold text-gray-700 mb-2">
                        Número Exterior
                      </label>
                      <input
                        type="text"
                        id="numeroExterior"
                        required
                        value={numeroExterior}
                        onChange={(e) => setNumeroExterior(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="123"
                      />
                    </div>

                    <div>
                      <label htmlFor="codigoPostal" className="block text-sm font-semibold text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        id="codigoPostal"
                        required
                        value={codigoPostal}
                        onChange={(e) => setCodigoPostal(e.target.value)}
                        maxLength={5}
                        pattern="[0-9]{5}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="12345"
                      />
                    </div>

                    <div className="col-span-2">
                      <label htmlFor="colonia" className="block text-sm font-semibold text-gray-700 mb-2">
                        Colonia
                      </label>
                      <input
                        type="text"
                        id="colonia"
                        required
                        value={colonia}
                        onChange={(e) => setColonia(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="Nombre de la colonia"
                      />
                    </div>

                    <div>
                      <label htmlFor="municipio" className="block text-sm font-semibold text-gray-700 mb-2">
                        Municipio
                      </label>
                      <input
                        type="text"
                        id="municipio"
                        required
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="Municipio o Alcaldía"
                      />
                    </div>

                    <div>
                      <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        id="estado"
                        required
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                        placeholder="Estado"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Campos específicos para Persona Moral */}
              {tipoDonacion && donorData?.tipo_persona === 'moral' && (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Datos adicionales</h3>
                  </div>

                  <div>
                    <label htmlFor="nombreRepresentanteLegal" className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Representante Legal
                    </label>
                    <input
                      type="text"
                      id="nombreRepresentanteLegal"
                      required
                      value={nombreRepresentanteLegal}
                      onChange={(e) => setNombreRepresentanteLegal(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                      placeholder="Nombre completo"
                    />
                  </div>


                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Acta Constitutiva {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="actaConstitutiva"
                          required={!actaConstitutiva}
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setActaConstitutiva, setActaConstitutivaFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="actaConstitutiva"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {actaConstitutivaFileName || 'Seleccionar PDF...'}
                          </span>
                        </label>
                      </div>
                      {actaConstitutiva && (
                        <a
                          href={getUrlString(actaConstitutiva)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Poder del Representante Legal {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="poderRepresentanteLegal"
                          required={!poderRepresentanteLegal}
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setPoderRepresentanteLegal, setPoderRepresentanteLegalFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="poderRepresentanteLegal"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {poderRepresentanteLegalFileName || 'Seleccionar PDF...'}
                          </span>
                        </label>
                      </div>
                      {poderRepresentanteLegal && (
                        <a
                          href={getUrlString(poderRepresentanteLegal)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Identificación Oficial del Representante {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="identificacionRepresentante"
                          required={!identificacionRepresentante}
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setIdentificacionRepresentante, setIdentificacionRepresentanteFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="identificacionRepresentante"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {identificacionRepresentanteFileName || 'Seleccionar archivo...'}
                          </span>
                        </label>
                      </div>
                      {identificacionRepresentante && (
                        <a
                          href={getUrlString(identificacionRepresentante)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Constancia de Situación Fiscal {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="constanciaSituacionFiscalMoral"
                          required={!constanciaSituacionFiscalMoral}
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setConstanciaSituacionFiscalMoral, setConstanciaSituacionFiscalMoralFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="constanciaSituacionFiscalMoral"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {constanciaSituacionFiscalMoralFileName || 'Seleccionar PDF...'}
                          </span>
                        </label>
                      </div>
                      {constanciaSituacionFiscalMoral && (
                        <a
                          href={getUrlString(constanciaSituacionFiscalMoral)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comprobante de Domicilio Fiscal {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="comprobanteDomicilioFiscalMoral"
                          required={!comprobanteDomicilioFiscalMoral}
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setComprobanteDomicilioFiscalMoral, setComprobanteDomicilioFiscalMoralFileName);
                          }}
                          className="hidden" 
                        />
                        <label
                          htmlFor="comprobanteDomicilioFiscalMoral"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {comprobanteDomicilioFiscalMoralFileName || 'Seleccionar archivo...'}
                          </span>
                        </label>
                      </div>
                      {comprobanteDomicilioFiscalMoral && (
                        <a
                          href={getUrlString(comprobanteDomicilioFiscalMoral)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  {(() => {
                    const montoNumerico = tipoDonacion === 'especie' ? parseFloat(valorEstimado) : parseFloat(monto);
                    return montoNumerico >= 189000;
                  })() && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Identificación del Beneficiario Controlador {uploadingFile && '(Subiendo...)'}
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          id="identificacionBeneficiarioControlador"
                          required
                          accept=".pdf,image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setIdentificacionBeneficiarioControlador, setIdentificacionBeneficiarioControladorFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="identificacionBeneficiarioControlador"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {identificacionBeneficiarioControladorFileName || 'Seleccionar archivo...'}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Campos específicos para Persona Física */}
              {tipoDonacion && donorData?.tipo_persona === 'fisica' && (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Datos Adicionales</h3>
                  </div>

                  <div>
                    <label htmlFor="curp" className="block text-sm font-semibold text-gray-700 mb-2">
                      CURP
                    </label>
                    <input
                      type="text"
                      id="curp"
                      required
                      value={curp}
                      onChange={(e) => setCurp(e.target.value.toUpperCase())}
                      maxLength={18}
                      pattern="[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black"
                      placeholder="CURP (18 caracteres)"
                    />
                  </div>

                  <div>
                    <label htmlFor="regimenFiscalFisica" className="block text-sm font-semibold text-gray-700 mb-2">
                      Régimen Fiscal
                    </label>
                    <div className="relative">
                      <select
                        id="regimenFiscalFisica"
                        required
                        value={regimenFiscal}
                        onChange={(e) => setRegimenFiscal(e.target.value)}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8BC34A] focus:border-transparent transition-colors text-black appearance-none cursor-pointer bg-white"
                      >
                        <option value="">Seleccionar régimen fiscal</option>
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
                        <option value="621">621 - Incorporación Fiscal</option>
                        <option value="622">622 - Actividades Agrícolas</option>
                        <option value="625">625 - RESICO PF</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Identificación Vigente (INE o Pasaporte) {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="identificacionVigente"
                          required={!identificacionVigente}
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setIdentificacionVigente, setIdentificacionVigenteFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="identificacionVigente"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {identificacionVigenteFileName || 'Seleccionar archivo...'}
                          </span>
                        </label>
                      </div>
                      {identificacionVigente && (
                        <a
                          href={getUrlString(identificacionVigente)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Constancia de Situación Fiscal {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="constanciaSituacionFiscalFisica"
                          required={!constanciaSituacionFiscalFisica}
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setConstanciaSituacionFiscalFisica, setConstanciaSituacionFiscalFisicaFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="constanciaSituacionFiscalFisica"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {constanciaSituacionFiscalFisicaFileName || 'Seleccionar PDF...'}
                          </span>
                        </label>
                      </div>
                      {constanciaSituacionFiscalFisica && (
                        <a
                          href={getUrlString(constanciaSituacionFiscalFisica)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Comprobante de Domicilio {uploadingFile && '(Subiendo...)'}
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="file"
                          id="comprobanteDomicilioFisica"
                          required={!comprobanteDomicilioFisica}
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, setComprobanteDomicilioFisica, setComprobanteDomicilioFisicaFileName);
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="comprobanteDomicilioFisica"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#8BC34A] focus-within:border-transparent transition-colors text-black bg-white flex items-center justify-between cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-600">
                            {comprobanteDomicilioFisicaFileName || 'Seleccionar archivo...'}
                          </span>
                        </label>
                      </div>
                      {comprobanteDomicilioFisica && (
                        <a
                          href={getUrlString(comprobanteDomicilioFisica)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          Ver archivo
                        </a>
                      )}
                    </div>
                  </div>

                </>
              )}

              {/* Necesita CFDI checkbox */}
              {tipoDonacion && (
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
                  disabled={!isFormValid() || uploadingFile}
                  className={`flex-1 px-6 py-3 font-bold rounded-lg transition-all duration-300 shadow-lg ${
                    isFormValid() && !uploadingFile
                      ? 'bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white hover:from-[#7CB342] hover:to-[#689F38] hover:shadow-xl cursor-pointer'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {uploadingFile ? 'Subiendo archivo...' : 'Confirmar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}