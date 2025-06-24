
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface Alternative {
  id: string;
  name: string;
  values: {
    harga: number;
    jarak: number;
    pencahayaan: number;
    fasilitas: number;
    kenyamanan: number;
  };
}

interface AlternativeInputProps {
  alternatives: Alternative[];
  setAlternatives: React.Dispatch<React.SetStateAction<Alternative[]>>;
}

const AlternativeInput: React.FC<AlternativeInputProps> = ({ alternatives, setAlternatives }) => {
  const criteriaLabels = {
    harga: 'Harga (Rp/jam)',
    jarak: 'Jarak (km)',
    pencahayaan: 'Pencahayaan (1-10)',
    fasilitas: 'Fasilitas (1-10)',
    kenyamanan: 'Kenyamanan (1-10)'
  };

  const handleInputChange = (alternativeId: string, criteria: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAlternatives(prev => 
      prev.map(alt => 
        alt.id === alternativeId 
          ? { 
              ...alt, 
              values: { 
                ...alt.values, 
                [criteria]: numValue 
              } 
            }
          : alt
      )
    );
  };

  const resetAllData = () => {
    setAlternatives(alternatives.map(alt => ({
      ...alt,
      values: { harga: 0, jarak: 0, pencahayaan: 0, fasilitas: 0, kenyamanan: 0 }
    })));
    toast({
      title: "Reset",
      description: "Semua data alternatif telah direset"
    });
  };

  const validateData = () => {
    let isValid = true;
    alternatives.forEach(alt => {
      Object.values(alt.values).forEach(value => {
        if (value <= 0) isValid = false;
      });
    });

    if (isValid) {
      toast({
        title: "Validasi Berhasil",
        description: "Semua data alternatif telah terisi dengan benar"
      });
    } else {
      toast({
        title: "Validasi Gagal",
        description: "Beberapa data masih kosong atau bernilai 0",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-green-600">
            Input Data Lapangan Futsal
          </CardTitle>
          <p className="text-sm text-gray-600">
            Masukkan nilai untuk setiap kriteria pada masing-masing lapangan futsal.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {alternatives.map((alternative) => (
            <Card key={alternative.id} className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">
                  {alternative.id} - {alternative.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(criteriaLabels).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`${alternative.id}-${key}`} className="text-sm font-medium">
                        {label}
                      </Label>
                      <Input
                        id={`${alternative.id}-${key}`}
                        type="number"
                        step={key === 'harga' ? "1000" : "0.1"}
                        min="0"
                        value={alternative.values[key]}
                        onChange={(e) => handleInputChange(alternative.id, key, e.target.value)}
                        placeholder={
                          key === 'harga' ? "contoh: 50000" :
                          key === 'jarak' ? "contoh: 2.5" :
                          "1-10"
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex space-x-4 pt-4">
            <Button 
              onClick={validateData}
              className="bg-green-600 hover:bg-green-700"
            >
              Validasi Data
            </Button>
            <Button 
              onClick={resetAllData}
              variant="outline"
            >
              Reset Semua
            </Button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Petunjuk Pengisian:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>Harga:</strong> Masukkan tarif per jam dalam Rupiah</li>
              <li>• <strong>Jarak:</strong> Masukkan jarak dalam kilometer</li>
              <li>• <strong>Pencahayaan:</strong> Nilai 1-10 (1=sangat gelap, 10=sangat terang)</li>
              <li>• <strong>Fasilitas:</strong> Nilai 1-10 (1=minim, 10=lengkap)</li>
              <li>• <strong>Kenyamanan:</strong> Nilai 1-10 (1=tidak nyaman, 10=sangat nyaman)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlternativeInput;
