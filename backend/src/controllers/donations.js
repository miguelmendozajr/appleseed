class DonationController {
    constructor(service, s3Service) {
      this.service = service;
      this.s3Service = s3Service;
    }
    async getOSCDonations(rfc) {
        console.log('Fetching donations for RFC:', rfc);
        const donations = await this.service.getOSCDonations(rfc);
        return donations;
    }

    async getOSCDonationsLastSixMonths(rfc) {
        const donations = await this.service.getOSCDonations(rfc);
        // TODO: Filter donations from the last 6 months

        return donations;
    }

    async submitFile(file) {
        const result = await this.s3Service.uploadFile(file);
        return result;
    }

    async createDonation(donationData) {
        // Helper function to extract URL from object or return string as-is
        const getUrl = (value) => {
            if (!value) return null;
            return typeof value === 'object' && value.url ? value.url : value;
        };

        // Extract donor data for update
        const donorUpdateData = {
            calle: donationData.calle,
            numero_exterior: donationData.numeroExterior,
            colonia: donationData.colonia,
            municipio: donationData.municipio,
            estado: donationData.estado,
            codigo_postal_fiscal: donationData.codigoPostal,
            curp: donationData.curp || null,
            regimen_fiscal: donationData.regimenFiscal || null,
            identificacion: getUrl(donationData.identificacion || donationData.identificacionRepresentante),
            comprobante_domicilio: getUrl(donationData.comprobanteDomicilio),
            constancia_situacion_fiscal: getUrl(donationData.constanciaSituacionFiscal),
            declaracion_beneficiario_controlador: getUrl(donationData.identificacionBeneficiarioControlador),
            acta_constitutiva: getUrl(donationData.actaConstitutiva),
            poderes_legales: getUrl(donationData.poderRepresentanteLegal)
        };

        // Remove undefined/null values
        Object.keys(donorUpdateData).forEach(key => {
            if (donorUpdateData[key] === undefined || donorUpdateData[key] === null) {
                delete donorUpdateData[key];
            }
        });

        // Update donor information
        await this.service.updateDonor(donationData.rfc_donador, donorUpdateData);

        // Prepare donation data
        const donation = {
            monto: donationData.monto || null,
            fecha: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
            necesitaCFDI: donationData.necesitaCFDI || false,
            tipo: donationData.tipoDonacion,
            valorEstimado: donationData.valorEstimado || null,
            rfc_donantes: donationData.rfc_donador,
            rfc_osc: donationData.rfc_osc,
            declaracionOrigenRecursos: getUrl(donationData.declaracionOrigenRecursos),
            cartaDonacion: getUrl(donationData.cartaDonacion),
            acreditacionPropiedad: getUrl(donationData.documentoPropiedad),
            acreditacionValorPropiedad: getUrl(donationData.documentoValor)
        };

        // Create donation record
        const donationId = await this.service.createDonation(donation);

        return { id: donationId, message: 'Donation created successfully' };
    }

    async uploadCFDI(donationId, file) {
        // Upload file to S3
        const result = await this.s3Service.uploadFile(file);
        const fileUrl = result.url;
        
        // Update donation with CFDI URL
        await this.service.updateDonationCFDI(donationId, fileUrl);
        
        return { url: fileUrl, message: 'CFDI uploaded successfully' };
    }

    async getDonorDonations(rfc) {
        const donations = await this.service.getDonorDonations(rfc);
        return donations;
    }
    
}
  
module.exports = DonationController;