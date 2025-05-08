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
  kodeRujukan: string;
}

// Interface untuk hasil klasifikasi dari API CpClasif
export interface Procedure {
  name: string;
  probability: number;
  message: string;
}

export interface Category {
  categoryName: string;
  probability: number;
  procedures: Procedure[];
}

export interface ClassificationResults {
  drug: {
    topCategories: Category[];
  };
  radio: {
    topCategories: Category[];
  };
  laborat: {
    topCategories: Category[];
  };
  timestamp: string;
}

export default function Dashboard() {
  const [predictResults, setPredictResults] = useState<PredictResults | null>(
    null
  );
  const [classifResults, setClassifResults] =
    useState<ClassificationResults | null>(null);
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [classifLoading, setClassifLoading] = useState(false);
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

      // Panggil API klasifikasi setelah prediksi biaya berhasil
      await handleClassifPredict(formData);
    } catch (error) {
      console.error("Error during prediction:", error);
      toast.error("Gagal melakukan prediksi");
    } finally {
      setLoading(false);
    }
  };

  const handleClassifPredict = async (formData: FormData) => {
    setClassifLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5059/api/CpClasif/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ICDPrimer: formData.icdPrimer,
            ICDSekunder1: formData.icdSekunder1,
            ICDSekunder2: formData.icdSekunder2,
            ICDSekunder3: formData.icdSekunder3,
            LamaRawat: parseInt(formData.lamaRawat),
            TipePasien: formData.tipePasien,
            KodeRujukan: formData.kodeRujukan,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memanggil API klasifikasi");
      }

      const data: ClassificationResults = await response.json();
      setClassifResults(data);

      // Simpan ke localStorage
      localStorage.setItem("classifResults", JSON.stringify(data));

      // Simpan ke database
      await saveClassificationToDatabase(formData, data);
    } catch (error) {
      console.error("Error during classification:", error);
      toast.error("Gagal melakukan klasifikasi prosedur");
    } finally {
      setClassifLoading(false);
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

  const saveClassificationToDatabase = async (
    formData: FormData,
    results: ClassificationResults
  ) => {
    try {
      const response = await fetch("/api/classification/save", {
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
        throw new Error(errorData.error || "Gagal menyimpan data klasifikasi");
      }

      const data = await response.json();
      console.log("Classification saved:", data);
      toast.success("Data klasifikasi berhasil disimpan");
    } catch (error) {
      console.error("Error saving classification history:", error);
      toast.error("Gagal menyimpan data klasifikasi");
    }
  };

  useEffect(() => {
    const savedResults = localStorage.getItem("predictResults");
    const savedFormData = localStorage.getItem("submittedFormData");
    const savedClassifResults = localStorage.getItem("classifResults");

    if (savedResults && savedFormData) {
      setPredictResults(JSON.parse(savedResults));
      setSubmittedFormData(JSON.parse(savedFormData));
    }

    if (savedClassifResults) {
      setClassifResults(JSON.parse(savedClassifResults));
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

      {classifLoading && (
        <div className="mt-8 text-center text-black">
          <p>Loading procedure classification...</p>
        </div>
      )}

      {classifResults && submittedFormData && !classifLoading && (
        <div className="mt-8 transition-all duration-300 ease-in-out">
          <ClassificationResultTable
            results={classifResults}
            formData={submittedFormData}
          />
        </div>
      )}
    </>
  );
}

function ClassificationResultTable({
  results,
  formData,
}: {
  results: ClassificationResults;
  formData: FormData;
}) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg my-4">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Prediksi Prosedur Medis
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Berdasarkan input: ICD-P {formData.icdPrimer}, ICD-S1{" "}
          {formData.icdSekunder1}, ICD-S2 {formData.icdSekunder2}, ICD-S3{" "}
          {formData.icdSekunder3}, Lama Rawat {formData.lamaRawat}, Tipe Pasien{" "}
          {formData.tipePasien}, Kode Rujukan {formData.kodeRujukan}
        </p>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Obat</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.drug.topCategories.map((category, idx) => (
            <div key={`drug-${idx}`} className="border rounded p-4">
              <div className="font-semibold">{category.categoryName}</div>
              <ul className="mt-2">
                {category.procedures
                  .filter((proc) => proc.probability > 0)
                  .map((proc, procIdx) => (
                    <li key={`drug-proc-${idx}-${procIdx}`} className="text-sm">
                      {proc.name}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Radiologi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.radio.topCategories.map((category, idx) => (
            <div key={`radio-${idx}`} className="border rounded p-4">
              <div className="font-semibold">{category.categoryName}</div>
              <ul className="mt-2">
                {category.procedures
                  .filter((proc) => proc.probability > 0)
                  .map((proc, procIdx) => (
                    <li
                      key={`radio-proc-${idx}-${procIdx}`}
                      className="text-sm"
                    >
                      {proc.name}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Laboratorium</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.laborat.topCategories.map((category, idx) => (
            <div key={`lab-${idx}`} className="border rounded p-4">
              <div className="font-semibold">{category.categoryName}</div>
              <ul className="mt-2">
                {category.procedures
                  .filter((proc) => proc.probability > 0)
                  .map((proc, procIdx) => (
                    <li key={`lab-proc-${idx}-${procIdx}`} className="text-sm">
                      {proc.name}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6 text-right text-sm text-gray-500">
        Timestamp: {new Date(results.timestamp).toLocaleString()}
      </div>
    </div>
  );
}