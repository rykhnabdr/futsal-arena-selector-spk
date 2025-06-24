
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Star } from 'lucide-react';

interface ResultDisplayProps {
  results: any[];
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ results }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <Star className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
  };

  if (!results || results.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">
            Belum ada hasil perhitungan. Silakan lakukan perhitungan SAW terlebih dahulu.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-600 flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Hasil Ranking Lapangan Futsal</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Hasil perhitungan menggunakan metode SAW, diurutkan dari nilai tertinggi ke terendah.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card 
                key={result.id} 
                className={`${getRankColor(result.rank)} border-l-4 ${
                  result.rank === 1 ? 'border-l-yellow-500 shadow-lg' :
                  result.rank === 2 ? 'border-l-gray-400' :
                  result.rank === 3 ? 'border-l-orange-500' :
                  'border-l-blue-500'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getRankIcon(result.rank)}
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          #{result.rank} - {result.name}
                        </h3>
                        <p className="text-sm opacity-90">
                          {result.id} | Skor: {result.finalScore.toFixed(4)}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={result.rank === 1 ? "default" : "secondary"}
                      className="text-lg px-3 py-1"
                    >
                      {(result.finalScore * 100).toFixed(1)}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-90">Harga</div>
                      <div className="font-bold">Rp {result.values.harga.toLocaleString()}</div>
                      <div className="text-xs opacity-75">
                        Normalisasi: {result.normalizedValues?.harga.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-90">Jarak</div>
                      <div className="font-bold">{result.values.jarak} km</div>
                      <div className="text-xs opacity-75">
                        Normalisasi: {result.normalizedValues?.jarak.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-90">Pencahayaan</div>
                      <div className="font-bold">{result.values.pencahayaan}/10</div>
                      <div className="text-xs opacity-75">
                        Normalisasi: {result.normalizedValues?.pencahayaan.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-90">Fasilitas</div>
                      <div className="font-bold">{result.values.fasilitas}/10</div>
                      <div className="text-xs opacity-75">
                        Normalisasi: {result.normalizedValues?.fasilitas.toFixed(3)}
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                      <div className="text-sm opacity-90">Kenyamanan</div>
                      <div className="font-bold">{result.values.kenyamanan}/10</div>
                      <div className="text-xs opacity-75">
                        Normalisasi: {result.normalizedValues?.kenyamanan.toFixed(3)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Statistik</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="font-bold text-lg">Lapangan Terbaik</div>
              <div className="text-yellow-600">{results[0]?.name}</div>
              <div className="text-sm text-gray-600">
                Skor: {(results[0]?.finalScore * 100).toFixed(1)}%
              </div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="font-bold text-lg">Rata-rata Skor</div>
              <div className="text-blue-600">
                {results.length > 0 ? (
                  (results.reduce((sum, r) => sum + r.finalScore, 0) / results.length * 100).toFixed(1)
                ) : 0}%
              </div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="font-bold text-lg">Total Alternatif</div>
              <div className="text-green-600">{results.length}</div>
              <div className="text-sm text-gray-600">Lapangan</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rekomendasi */}
      {results.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">💡 Rekomendasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-3">
              <strong>Lapangan {results[0].name}</strong> mendapat ranking tertinggi dengan skor{' '}
              <strong>{(results[0].finalScore * 100).toFixed(1)}%</strong> dan direkomendasikan sebagai pilihan terbaik.
            </p>
            <div className="text-sm text-green-600">
              <strong>Alasan:</strong> Lapangan ini memiliki kombinasi terbaik dari semua kriteria yang telah Anda tentukan 
              berdasarkan bobot kepentingan masing-masing kriteria.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResultDisplay;
