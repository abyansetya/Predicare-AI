"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { toast } from "react-hot-toast";

interface PredictionHistoryItem {
  id: number;
  icd_primer: string;
  icd_sekunder1: string;
  icd_sekunder2: string;
  icd_sekunder3: string;
  lama_rawat: number;
  tipe_pasien: string;
  total_cost: number;
  created_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [detailData, setDetailData] = useState<any | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/prediction/history");

      if (!response.ok) {
        throw new Error("Gagal mengambil data history");
      }

      const data = await response.json();
      setHistory(data.predictions);
    } catch (error) {
      console.error("Error fetching history:", error);
      toast.error("Gagal memuat data history prediksi");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = async (id: number) => {
    if (expandedItem === id) {
      setExpandedItem(null);
      setDetailData(null);
      return;
    }

    try {
      const response = await fetch(`/api/prediction/detail/${id}`);

      if (!response.ok) {
        throw new Error("Gagal mengambil detail prediksi");
      }

      const data = await response.json();
      setDetailData(data.prediction);
      setExpandedItem(id);
    } catch (error) {
      console.error("Error fetching prediction detail:", error);
      toast.error("Gagal memuat detail prediksi");
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM yyyy, HH:mm", { locale: id });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">History Prediksi</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Kembali ke Dashboard
        </Link>
      </div>

      {loading ? (
        <div className="p-10 text-center">
          <p className="text-gray-600">Memuat data history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-gray-600">Belum ada data history prediksi.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ICD Primer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lama Rawat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((item, index) => (
                <>
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.icd_primer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.lama_rawat} hari
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.tipe_pasien}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rp {formatNumber(item.total_cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleDetails(item.id)}
                        className="text-indigo-600 hover:cursor-pointer hover:text-indigo-900"
                      >
                        {expandedItem === item.id ? "Tutup" : "Detail"}
                      </button>
                    </td>
                  </tr>
                  {expandedItem === item.id && detailData && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Data ICD
                            </h3>
                            <p className="text-sm text-gray-600">
                              Primer: {detailData.icd_primer}
                            </p>
                            {detailData.icd_sekunder1 && (
                              <p className="text-sm text-gray-600">
                                Sekunder 1: {detailData.icd_sekunder1}
                              </p>
                            )}
                            {detailData.icd_sekunder2 && (
                              <p className="text-sm text-gray-600">
                                Sekunder 2: {detailData.icd_sekunder2}
                              </p>
                            )}
                            {detailData.icd_sekunder3 && (
                              <p className="text-sm text-gray-600">
                                Sekunder 3: {detailData.icd_sekunder3}
                              </p>
                            )}
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-900">
                              Data Pasien
                            </h3>
                            <p className="text-sm text-gray-600">
                              Lama Rawat: {detailData.lama_rawat} hari
                            </p>
                            <p className="text-sm text-gray-600">
                              Tipe Pasien: {detailData.tipe_pasien}
                            </p>
                          </div>

                          <div>
                            <h3 className="font-medium text-gray-900">
                              Total Biaya
                            </h3>
                            <p className="text-sm text-gray-600">
                              Rp {formatNumber(detailData.total_cost)}
                            </p>
                          </div>

                          <div className="md:col-span-2 lg:col-span-3">
                            <h3 className="font-medium text-gray-900 mb-2">
                              Rincian Biaya
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                              <p className="text-sm text-gray-600">
                                Non Bedah: Rp{" "}
                                {formatNumber(detailData.non_bedah)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Bedah: Rp {formatNumber(detailData.bedah)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Konsul Dokter: Rp{" "}
                                {formatNumber(detailData.konsul_dokter)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Konsul Ahli: Rp{" "}
                                {formatNumber(detailData.konsul_tenaga_ahli)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Keperawatan: Rp{" "}
                                {formatNumber(detailData.tind_keperawatan)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Penunjang: Rp{" "}
                                {formatNumber(detailData.penunjang)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Radiologi: Rp{" "}
                                {formatNumber(detailData.radiologi)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Lab: Rp {formatNumber(detailData.laboratorium)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Pelayanan Darah: Rp{" "}
                                {formatNumber(detailData.pelayanan_darah)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Rehab: Rp{" "}
                                {formatNumber(detailData.rehabilitasi)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Akomodasi: Rp{" "}
                                {formatNumber(detailData.akomodasi)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Akomodasi Intensif: Rp{" "}
                                {formatNumber(detailData.akomodasi_intensif)}
                              </p>
                              <p className="text-sm text-gray-600">
                                BMHP: Rp {formatNumber(detailData.bmhp)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Alat Medis: Rp{" "}
                                {formatNumber(detailData.alat_medis)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Obat: Rp {formatNumber(detailData.obat)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Obat Kronis: Rp{" "}
                                {formatNumber(detailData.obat_kronis)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Obat Kemoterapi: Rp{" "}
                                {formatNumber(detailData.obat_kemoterapi)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Alkes: Rp {formatNumber(detailData.alkes)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
