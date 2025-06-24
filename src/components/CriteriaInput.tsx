
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trophy, MapPin, Zap, Home, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CriteriaInputProps {
  criteria: {
    harga: number;
    jarak: number;
    pencahayaan: number;
    fasilitas: number;
    kenyamanan: number;
  };
  setCriteria: React.Dispatch<React.SetStateAction<any>>;
}

const CriteriaInput: React.FC<CriteriaInputProps> = ({ criteria, setCriteria }) => {
  const criteriaLabels = {
    harga: { label: 'Harga', icon: Trophy, description: 'Kriteria biaya sewa lapangan' },
    jarak: { label: 'Jarak', icon: MapPin, description: 'Kriteria jarak dari lokasi Anda' },
    pencahayaan: { label: 'Pencahayaan', icon: Zap, description: 'Kriteria kualitas pencahayaan lapangan' },
    fasilitas: { label: 'Fasilitas', icon: Home, description: 'Kriteria kelengkapan fasilitas' },
    kenyamanan: { label: 'Kenyamanan', icon: Heart, description: 'Kriteria tingkat kenyamanan' }
  };

  const handleInputChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setCriteria(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const normalizeWeights = () => {
    const total = Object.values(criteria).reduce((sum, val) => sum + val, 0);
    if (total === 0) {
      toast({
        title: "Error",
        description: "Tidak ada bobot yang diisi",
        variant: "destructive"
      });
      return;
    }

    const normalized = {};
    Object.entries(criteria).forEach(([key, value]) => {
      normalized[key] = value / total;
    });
    
    setCriteria(normalized);
    toast({
      title: "Berhasil",
      description: "Bobot kriteria telah dinormalisasi"
    });
  };

  const resetWeights = () => {
    setCriteria({
      harga: 0,
      jarak: 0,
      pencahayaan: 0,
      fasilitas: 0,
      kenyamanan: 0
    });
    toast({
      title: "Reset",
      description: "Semua bobot kriteria telah direset"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-600">
            Input Bobot Kriteria
          </CardTitle>
          <p className="text-sm text-gray-600">
            Masukkan bobot untuk setiap kriteria. Bobot yang lebih tinggi menunjukkan kriteria yang lebih penting.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(criteriaLabels).map(([key, { label, icon: Icon, description }]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="flex items-center space-x-2">
                  <Icon className="h-4 w-4 text-green-600" />
                  <span>{label}</span>
                </Label>
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={criteria[key]}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder="0.0 - 1.0"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">{description}</p>
              </div>
            ))}
          </div>

          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={normalizeWeights}
              className="bg-green-600 hover:bg-green-700"
            >
              Normalisasi Bobot
            </Button>
            <Button 
              onClick={resetWeights}
              variant="outline"
            >
              Reset
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Informasi:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Total bobot saat ini: {Object.values(criteria).reduce((sum, val) => sum + val, 0).toFixed(3)}</li>
              <li>• Bobot yang ideal adalah total = 1.0</li>
              <li>• Gunakan tombol "Normalisasi Bobot" untuk menyesuaikan total menjadi 1.0</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CriteriaInput;
