// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import PredictionForm from "@/components/dashboard/prediction-form";
import ResultTable from "@/components/dashboard/result-table";

// Definisi tipe untuk hasil prediksi
export interface PredictionResults {
  administrasi: number;
  konsultasiDokter: number;
  laboratorium: number;
  radiologi: number;
  obatObatan: number;
  kamarRawat: number;
  tindakanMedis: number;
  perawatan: number;
  fisioterapi: number;
  alatKesehatan: number;
  medicalCheckup: number;
  lainLain: number;
}

// Definisi tipe untuk form data
export interface FormData {
  icdPrimer: string;
  icdSekunder1: string;
  icdSekunder2: string;
  icdSekunder3: string;
  lamaRawat: string;
  tipePasien: string;
}

export default function Dashboard() {
  const [predictionResults, setPredictionResults] =
    useState<PredictionResults | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(
    null
  );

  const handlePredict = (formData: FormData) => {
    // Di sini nantinya akan ada logika untuk memanggil API prediksi
    console.log("Form Data for prediction:", formData);

    // Save the submitted form data
    setSubmittedFormData(formData);

    // Untuk saat ini kita hanya menggunakan data dummy
    setPredictionResults({
      administrasi: 250000,
      konsultasiDokter: 750000,
      laboratorium: 1200000,
      radiologi: 850000,
      obatObatan: 2300000,
      kamarRawat: 1800000,
      tindakanMedis: 3500000,
      perawatan: 950000,
      fisioterapi: 450000,
      alatKesehatan: 750000,
      medicalCheckup: 650000,
      lainLain: 350000,
    });
  };

  return (
    <>
      <PredictionForm onPredict={handlePredict} />

      {predictionResults && submittedFormData && (
        <div className="mt-8 transition-all duration-300 ease-in-out">
          <ResultTable
            results={predictionResults}
            formData={submittedFormData}
          />
        </div>
      )}
    </>
  );
}