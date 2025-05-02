"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PredictionForm from "@/components/dashboard/prediction-form";
import ResultTable from "@/components/dashboard/result-table";
import { toast } from "react-hot-toast";

// Tipe data response asli dari API
export interface PredictResults {
  non_Bedah: number;
  bedah: number;
  konsul_Dokter: number;
  konsul_Tenaga_Ahli: number;
  tind_Keperawatan: number;
  penunjang: number;
  radiologi: number;
  laboratorium: number;
  pelayanan_Darah: number;
  rehabilitasi: number;
  akomodasi: number;
  akomodasi_Intensif: number;
  bmhp: number;
  alat_Medis: number;
  obat: number;
  obat_Kronis: number;
  obat_Kemoterapi: number;
  alkes: number;
  total_Cost: number;
}

export interface FormData {
  icdPrimer: string;
  icdSekunder1: string;
  icdSekunder2: string;
  icdSekunder3: string;
  lamaRawat: string;
  tipePasien: string;
}

export default function Dashboard() {
  const [predictResults, setPredictResults] = useState<PredictResults | null>(
    null
  );
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [savingHistory, setSavingHistory] = useState(false);

  const handlePredict = async (formData: FormData) => {
    console.log("Form Data for prediction:", formData);
    setSubmittedFormData(formData);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5059/api/CpCost/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ICDPrimer: formData.icdPrimer,
          ICDSekunder1: formData.icdSekunder1,
          ICDSekunder2: formData.icdSekunder2,
          ICDSekunder3: formData.icdSekunder3,
          LamaRawat: formData.lamaRawat,
          TipePasien: formData.tipePasien,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memanggil API prediction");
      }

      const data: PredictResults = await response.json();
      setPredictResults(data);

      // Simpan ke localStorage
      localStorage.setItem("predictResults", JSON.stringify(data));
      localStorage.setItem("submittedFormData", JSON.stringify(formData));

      // Simpan hasil ke database
      await savePredictionToDatabase(formData, data);
    } catch (error) {
      console.error("Error during prediction:", error);
      toast.error("Gagal melakukan prediksi");
    } finally {
      setLoading(false);
    }
  };

  const savePredictionToDatabase = async (
    formData: FormData,
    results: PredictResults
  ) => {
    setSavingHistory(true);
    try {
      const response = await fetch("/api/prediction/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          results,
        }),
        // Cookie otomatis dikirim dengan setiap request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan data prediksi");
      }

      const data = await response.json();
      console.log("Prediction saved:", data);
      toast.success("Data prediksi berhasil disimpan");
    } catch (error) {
      console.error("Error saving prediction history:", error);
      toast.error("Gagal menyimpan data prediksi");
    } finally {
      setSavingHistory(false);
    }
  };

  useEffect(() => {
    const savedResults = localStorage.getItem("predictResults");
    const savedFormData = localStorage.getItem("submittedFormData");

    if (savedResults && savedFormData) {
      setPredictResults(JSON.parse(savedResults));
      setSubmittedFormData(JSON.parse(savedFormData));
    }
  }, []);

  return (
    <>
      <PredictionForm onPredict={handlePredict} />
      {loading && (
        <div className="mt-8 text-center text-black">
          <p>Loading prediction...</p>
        </div>
      )}

      {predictResults && submittedFormData && !loading && (
        <div className="text-center flex justify-end">
          <Link
            href="/dashboard/history"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-600 hover:bg-gray-500"
          >
            Lihat History Prediksi
          </Link>
        </div>
      )}

      {savingHistory && (
        <div className="mt-2 text-center text-green-600">
          <p>Menyimpan data ke riwayat prediksi...</p>
        </div>
      )}

      {predictResults && submittedFormData && !loading && (
        <div className="mt-8 transition-all duration-300 ease-in-out">
          <ResultTable results={predictResults} formData={submittedFormData} />
        </div>
      )}

      {!predictResults && !loading && (
        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard/history"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Lihat History Prediksi
          </Link>
        </div>
      )}
    </>
  );
}
