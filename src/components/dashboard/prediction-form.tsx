// components/PredictionForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import { FormData } from "@/components/dashboard/CostPredictionDashboard";

interface PredictionFormProps {
  onPredict: (formData: FormData) => void;
}

interface OptionType {
  value: string;
  label: string;
}

export default function PredictionForm({ onPredict }: PredictionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    icdPrimer: "",
    icdSekunder1: "",
    icdSekunder2: "",
    icdSekunder3: "",
    lamaRawat: "",
    tipePasien: "",
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onPredict(formData);
  };

  // Data dummy untuk dropdown
  const icdOptions: OptionType[] = [
    { value: "A00", label: "A00 - Cholera" },
    { value: "E11", label: "E11 - Type 2 diabetes mellitus" },
    { value: "I10", label: "I10 - Essential hypertension" },
    { value: "J18", label: "J18 - Pneumonia" },
  ];

  const icdSekunderOptions: OptionType[] = [
    { value: "Z03", label: "Z03 - Medical observation" },
    { value: "R50", label: "R50 - Fever" },
    { value: "I25", label: "I25 - Chronic ischemic heart disease" },
    { value: "K29", label: "K29 - Gastritis and duodenitis" },
  ];

  const lamaRawatOptions: OptionType[] = [
    { value: "1", label: "1 hari" },
    { value: "2", label: "2 hari" },
    { value: "3", label: "3 hari" },
    { value: "4", label: "4 hari" },
    { value: "5", label: "5 hari" },
    { value: "6", label: "6 hari" },
    { value: "7", label: "7 hari" },
    { value: "8+", label: "8+ hari" },
  ];

  const tipePasienOptions: OptionType[] = [
    { value: "BPJS", label: "BPJS" },
    { value: "Asuransi", label: "Asuransi" },
    { value: "Umum", label: "Umum" },
    { value: "Korporasi", label: "Korporasi" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
      <h2 className="text-xl font-semibold text-blue-600 mb-6">
        Prediksi Biaya Medis
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="icdPrimer"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ICD Primer
            </label>
            <select
              id="icdPrimer"
              className="w-full rounded-md text-black p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.icdPrimer}
              onChange={handleChange}
            >
              <option value="">Pilih ICD Primer</option>
              {icdOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="icdSekunder1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ICD Sekunder 1
            </label>
            <select
              id="icdSekunder1"
              className="w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.icdSekunder1}
              onChange={handleChange}
            >
              <option value="">Pilih ICD Sekunder 1</option>
              {icdSekunderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="icdSekunder2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ICD Sekunder 2
            </label>
            <select
              id="icdSekunder2"
              className="w-full  rounded-md text-black p-2border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.icdSekunder2}
              onChange={handleChange}
            >
              <option value="">Pilih ICD Sekunder 2</option>
              {icdSekunderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="icdSekunder3"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ICD Sekunder 3
            </label>
            <select
              id="icdSekunder3"
              className="w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.icdSekunder3}
              onChange={handleChange}
            >
              <option value="">Pilih ICD Sekunder 3</option>
              {icdSekunderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="lamaRawat"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lama Rawat
            </label>
            <select
              id="lamaRawat"
              className="w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.lamaRawat}
              onChange={handleChange}
            >
              <option value="">Pilih Lama Rawat</option>
              {lamaRawatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tipePasien"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipe Pasien
            </label>
            <select
              id="tipePasien"
              className="w-full text-black p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={formData.tipePasien}
              onChange={handleChange}
            >
              <option value="">Pilih Tipe Pasien</option>
              {tipePasienOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Predict
          </button>
        </div>
      </form>
    </div>
  );
}
