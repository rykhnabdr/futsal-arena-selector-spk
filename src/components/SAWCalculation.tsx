
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SAWCalculationProps {
  criteria: any;
  alternatives: any[];
  setResults: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const SAWCalculation: React.FC<SAWCalculationProps> = ({ 
  criteria, 
  alternatives, 
  setResults, 
  setActiveTab 
}) => {
  const [showSteps, setShowSteps] = useState(false);
  const [normalizedMatrix, setNormalizedMatrix] = useState([]);
  const [finalScores, setFinalScores] = useState([]);
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateSAW = () => {
    // Validasi data
    const totalWeight = Object.values(criteria).reduce((sum, val) => sum + val, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      toast({
        title: "Error",
        description: "Total bobot kriteria harus = 1.0. Silakan normalisasi bobot kriteria terlebih dahulu.",
        variant: "destructive"
      });
      return;
    }

    // Cek apakah semua alternatif memiliki data
    const hasEmptyData = alternatives.some(alt => 
      Object.values(alt.values).some(val => val <= 0)
    );
    
    if (hasEmptyData) {
      toast({
        title: "Error",
        description: "Semua data alternatif harus diisi dengan nilai > 0",
        variant: "destructive"
      });
      return;
    }

    try {
      // Step 1: Normalisasi Matrix
      const criteriaKeys = Object.keys(criteria);
      const normalized = [];

      // Cari max untuk setiap kriteria (benefit) dan min untuk cost
      const maxValues = {};
      const minValues = {};
      
      criteriaKeys.forEach(key => {
        const values = alternatives.map(alt => alt.values[key]);
        maxValues[key] = Math.max(...values);
        minValues[key] = Math.min(...values);
      });

      // Normalisasi setiap alternatif
      alternatives.forEach(alt => {
        const normalizedRow = { ...alt };
        const normalizedValues = {};
        
        criteriaKeys.forEach(key => {
          // Untuk kriteria cost (harga, jarak), gunakan min/value
          // Untuk kriteria benefit (pencahayaan, fasilitas, kenyamanan), gunakan value/max
          if (key === 'harga' || key === 'jarak') {
            normalizedValues[key] = minValues[key] / alt.values[key];
          } else {
            normalizedValues[key] = alt.values[key] / maxValues[key];
          }
        });
        
        normalizedRow.normalizedValues = normalizedValues;
        normalized.push(normalizedRow);
      });

      setNormalizedMatrix(normalized);

      // Step 2: Hitung skor akhir
      const scores = normalized.map(alt => {
        let totalScore = 0;
        criteriaKeys.forEach(key => {
          totalScore += alt.normalizedValues[key] * criteria[key];
        });
        
        return {
          ...alt,
          finalScore: totalScore
        };
      });

      // Step 3: Sort berdasarkan skor (descending)
      scores.sort((a, b) => b.finalScore - a.finalScore);
      
      // Add ranking
      const rankedResults = scores.map((score, index) => ({
        ...score,
        rank: index + 1
      }));

      setFinalScores(rankedResults);
      setResults(rankedResults);
      setIsCalculated(true);

      toast({
        title: "Perhitungan Berhasil",
        description: "Perhitungan SAW telah selesai. Lihat hasil di tab 'Hasil Ranking'."
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan dalam perhitungan",
        variant: "destructive"
      });
    }
  };

  const viewResults = () => {
    setActiveTab('results');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-600 flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Perhitungan SAW (Simple Additive Weighting)</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Metode SAW menghitung nilai preferensi dengan menjumlahkan hasil perkalian rating kinerja dengan bobot kriteria.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Validasi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-4">
                <div className="text-sm font-medium text-blue-600">Status Bobot Kriteria</div>
                <div className="text-2xl font-bold">
                  {Object.values(criteria).reduce((sum, val) => sum + val, 0).toFixed(3)}
                </div>
                <div className="text-sm text-gray-500">
                  {Math.abs(Object.values(criteria).reduce((sum, val) => sum + val, 0) - 1) < 0.01 
                    ? "✅ Siap untuk perhitungan" 
                    : "❌ Perlu normalisasi"}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-4">
                <div className="text-sm font-medium text-green-600">Status Data Alternatif</div>
                <div className="text-2xl font-bold">
                  {alternatives.filter(alt => 
                    Object.values(alt.values).every(val => val > 0)
                  ).length}/{alternatives.length}
                </div>
                <div className="text-sm text-gray-500">Alternatif lengkap</div>
              </CardContent>
            </Card>
          </div>

          {/* Tombol Perhitungan */}
          <div className="flex space-x-4">
            <Button 
              onClick={calculateSAW}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Hitung SAW
            </Button>
            
            <Button 
              onClick={() => setShowSteps(!showSteps)}
              variant="outline"
              size="lg"
            >
              {showSteps ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showSteps ? 'Sembunyikan' : 'Tampilkan'} Langkah
            </Button>

            {isCalculated && (
              <Button 
                onClick={viewResults}
                variant="secondary"
                size="lg"
              >
                Lihat Hasil Ranking
              </Button>
            )}
          </div>

          {/* Langkah-langkah Perhitungan */}
          {showSteps && (
            <div className="space-y-4">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Langkah-langkah Metode SAW</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold">Normalisasi Matriks Keputusan</h4>
                        <p className="text-sm text-gray-600">
                          Untuk kriteria benefit: r<sub>ij</sub> = x<sub>ij</sub> / max(x<sub>ij</sub>)<br/>
                          Untuk kriteria cost: r<sub>ij</sub> = min(x<sub>ij</sub>) / x<sub>ij</sub>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold">Perhitungan Nilai Preferensi</h4>
                        <p className="text-sm text-gray-600">
                          V<sub>i</sub> = Σ(w<sub>j</sub> × r<sub>ij</sub>)<br/>
                          Dimana w<sub>j</sub> adalah bobot kriteria ke-j
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold">Perankingan Alternatif</h4>
                        <p className="text-sm text-gray-600">
                          Alternatif dengan nilai V<sub>i</sub> tertinggi adalah yang terbaik
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabel Kriteria */}
              <Card>
                <CardHeader>
                  <CardTitle>Jenis Kriteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-red-600 mb-2">Kriteria Cost (Semakin kecil semakin baik)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Harga - semakin murah semakin baik</li>
                        <li>• Jarak - semakin dekat semakin baik</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600 mb-2">Kriteria Benefit (Semakin besar semakin baik)</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Pencahayaan - semakin terang semakin baik</li>
                        <li>• Fasilitas - semakin lengkap semakin baik</li>
                        <li>• Kenyamanan - semakin nyaman semakin baik</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Matrix Ternormalisasi */}
          {isCalculated && normalizedMatrix.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Matrix Ternormalisasi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Alternatif</th>
                        <th className="border border-gray-300 p-2">Harga</th>
                        <th className="border border-gray-300 p-2">Jarak</th>
                        <th className="border border-gray-300 p-2">Pencahayaan</th>
                        <th className="border border-gray-300 p-2">Fasilitas</th>
                        <th className="border border-gray-300 p-2">Kenyamanan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {normalizedMatrix.map((alt) => (
                        <tr key={alt.id}>
                          <td className="border border-gray-300 p-2 font-medium">{alt.name}</td>
                          <td className="border border-gray-300 p-2 text-center">
                            {alt.normalizedValues.harga.toFixed(3)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {alt.normalizedValues.jarak.toFixed(3)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {alt.normalizedValues.pencahayaan.toFixed(3)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {alt.normalizedValues.fasilitas.toFixed(3)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            {alt.normalizedValues.kenyamanan.toFixed(3)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SAWCalculation;
