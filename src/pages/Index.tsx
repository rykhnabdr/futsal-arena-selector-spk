
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, MapPin, Zap, Home, Heart } from 'lucide-react';
import CriteriaInput from '@/components/CriteriaInput';
import AlternativeInput from '@/components/AlternativeInput';
import SAWCalculation from '@/components/SAWCalculation';
import ResultDisplay from '@/components/ResultDisplay';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [criteria, setCriteria] = useState({
    harga: 0,
    jarak: 0,
    pencahayaan: 0,
    fasilitas: 0,
    kenyamanan: 0
  });
  
  const [alternatives, setAlternatives] = useState([
    { id: 'A1', name: 'Dewisri', values: { harga: 0, jarak: 0, pencahayaan: 0, fasilitas: 0, kenyamanan: 0 } },
    { id: 'A2', name: 'Sipelem', values: { harga: 0, jarak: 0, pencahayaan: 0, fasilitas: 0, kenyamanan: 0 } },
    { id: 'A3', name: 'Rajawali', values: { harga: 0, jarak: 0, pencahayaan: 0, fasilitas: 0, kenyamanan: 0 } },
    { id: 'A4', name: 'JB', values: { harga: 0, jarak: 0, pencahayaan: 0, fasilitas: 0, kenyamanan: 0 } },
    { id: 'A5', name: 'GBN', values: { harga: 0, jarak: 0, pencahayaan: 0, fasilitas: 0, kenyamanan: 0 } }
  ]);

  const [results, setResults] = useState([]);

  const criteriaIcons = {
    harga: Trophy,
    jarak: MapPin,
    pencahayaan: Zap,
    fasilitas: Home,
    kenyamanan: Heart
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">
            ⚽ SPK Pemilihan Lapangan Futsal
          </h1>
          <p className="text-center mt-2 text-green-100">
            Sistem Pendukung Keputusan Menggunakan Metode SAW
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'criteria', label: 'Bobot Kriteria' },
              { id: 'alternatives', label: 'Data Lapangan' },
              { id: 'calculation', label: 'Perhitungan SAW' },
              { id: 'results', label: 'Hasil Ranking' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Selamat Datang di SPK Pemilihan Lapangan Futsal
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Sistem ini menggunakan metode SAW (Simple Additive Weighting) untuk membantu Anda memilih lapangan futsal terbaik 
                berdasarkan kriteria harga, jarak, pencahayaan, fasilitas, dan kenyamanan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(criteriaIcons).map(([key, Icon]) => (
                <Card key={key} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {key === 'pencahayaan' ? 'Pencahayaan' : 
                       key === 'fasilitas' ? 'Fasilitas' :
                       key === 'kenyamanan' ? 'Kenyamanan' :
                       key === 'jarak' ? 'Jarak' : 'Harga'}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-green-600 ml-auto" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{criteria[key].toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      Bobot kriteria
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lapangan Futsal Alternatif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {alternatives.map((alt) => (
                    <div key={alt.id} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">{alt.id}</div>
                      <div className="text-sm font-medium">{alt.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'criteria' && (
          <CriteriaInput criteria={criteria} setCriteria={setCriteria} />
        )}

        {activeTab === 'alternatives' && (
          <AlternativeInput alternatives={alternatives} setAlternatives={setAlternatives} />
        )}

        {activeTab === 'calculation' && (
          <SAWCalculation 
            criteria={criteria} 
            alternatives={alternatives} 
            setResults={setResults}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'results' && (
          <ResultDisplay results={results} />
        )}
      </main>
    </div>
  );
};

export default Index;
