// components/dashboard/result-table.tsx
import { PredictionResults, FormData } from "@/app/dashboard/page";

interface ResultTableProps {
  results: PredictionResults;
  formData: FormData; // Add formData prop
}

interface CostCategory {
  id: keyof PredictionResults;
  label: string;
  value: number;
}

export default function ResultTable({ results, formData }: ResultTableProps) {
  // Format number to IDR
  const formatIDR = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Calculate total
  const totalBiaya = Object.values(results).reduce(
    (sum, value) => sum + value,
    0
  );

  // Data mapping for the table
  const costCategories: CostCategory[] = [
    { id: "administrasi", label: "Administrasi", value: results.administrasi },
    {
      id: "konsultasiDokter",
      label: "Konsultasi Dokter",
      value: results.konsultasiDokter,
    },
    { id: "laboratorium", label: "Laboratorium", value: results.laboratorium },
    { id: "radiologi", label: "Radiologi", value: results.radiologi },
    { id: "obatObatan", label: "Obat-obatan", value: results.obatObatan },
    { id: "kamarRawat", label: "Kamar Rawat", value: results.kamarRawat },
    {
      id: "tindakanMedis",
      label: "Tindakan Medis",
      value: results.tindakanMedis,
    },
    { id: "perawatan", label: "Perawatan", value: results.perawatan },
    { id: "fisioterapi", label: "Fisioterapi", value: results.fisioterapi },
    {
      id: "alatKesehatan",
      label: "Alat Kesehatan",
      value: results.alatKesehatan,
    },
    {
      id: "medicalCheckup",
      label: "Medical Check-up",
      value: results.medicalCheckup,
    },
    { id: "lainLain", label: "Lain-lain", value: results.lainLain },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Hasil Prediksi Biaya
        </h3>
      </div>

      {/* Input Parameter Summary */}
      <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Parameter Input:
        </h4>
        <div className="grid grid-cols-1 text-black md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium  ">ICD Primer:</span>{" "}
            <span className="text-gray-700">{formData.icdPrimer}</span>
          </div>
          {formData.icdSekunder1 && (
            <div>
              <span className="font-medium">ICD Sekunder 1:</span>{" "}
              <span className="text-gray-700">{formData.icdSekunder1}</span>
            </div>
          )}
          {formData.icdSekunder2 && (
            <div>
              <span className="font-medium">ICD Sekunder 2:</span>{" "}
              <span className="text-gray-700">{formData.icdSekunder2}</span>
            </div>
          )}
          {formData.icdSekunder3 && (
            <div>
              <span className="font-medium">ICD Sekunder 3:</span>{" "}
              <span className="text-gray-700">{formData.icdSekunder3}</span>
            </div>
          )}
          <div>
            <span className="font-medium">Lama Rawat:</span>{" "}
            {formData.lamaRawat} hari
          </div>
          <div>
            <span className="font-medium">Tipe Pasien:</span>{" "}
            {formData.tipePasien}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Kategori Biaya
              </th>
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nilai Prediksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {costCategories.map((category) => (
              <tr key={String(category.id)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {category.label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatIDR(category.value)}
                </td>
              </tr>
            ))}

            <tr className="bg-blue-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                Total Biaya
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {formatIDR(totalBiaya)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
