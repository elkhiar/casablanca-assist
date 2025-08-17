import React, { useState } from 'react';
import CasablancaMap from '@/components/CasablancaMap';
import ProblemReportModal from '@/components/ProblemReportModal';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, AlertCircle, Phone, Users, Clock } from 'lucide-react';
import heroImage from '@/assets/casablanca-hero.jpg';

interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface ProblemReport {
  categoryId: string;
  subCategoryId: string;
  description: string;
  location: MapLocation;
}

interface ResultsData {
  authority: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
  generatedText: string;
  instructions: string[];
  category: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'map' | 'results'>('map');
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);

  const handleLocationSelect = (location: MapLocation) => {
    setSelectedLocation(location);
    setIsModalOpen(true);
  };

  const handleProblemSubmit = async (data: ProblemReport) => {
    setIsModalOpen(false);
    
    // Mock API call - in production, this would call your backend
    const mockResults: ResultsData = {
      authority: {
        name: "Service de la Propreté - Arrondissement Anfa",
        address: "123 Boulevard Mohammed V, Casablanca 20000",
        phone: "0522-XX-XX-XX",
        email: "proprete.anfa@casablanca.ma",
        website: "https://casablanca.ma"
      },
      generatedText: `À l'attention du Chef de Service de la Propreté de l'Arrondissement Anfa,

Objet : Signalement d'un problème de collecte des déchets

Madame, Monsieur,

Je me permets de vous contacter pour vous signaler un problème concernant la collecte des déchets dans ma zone de résidence.

Localisation du problème :
- Coordonnées : ${data.location.latitude.toFixed(6)}, ${data.location.longitude.toFixed(6)}
${data.location.address ? `- Adresse : ${data.location.address}` : ''}

Description du problème :
${data.description}

Cette situation nécessite votre attention afin d'assurer la salubrité de notre quartier et le bien-être des résidents.

Je vous remercie par avance pour votre diligence dans le traitement de cette demande.

Cordialement,
[Votre nom]
[Votre contact]`,
      instructions: [
        "Copiez le texte de la demande formelle ci-dessus",
        "Envoyez-le par email à l'adresse indiquée",
        "Ou contactez directement par téléphone pour un traitement plus rapide",
        "Conservez une copie de votre demande pour suivi"
      ],
      category: data.categoryId,
      location: data.location
    };

    setResultsData(mockResults);
    setCurrentView('results');
  };

  const handleBackToMap = () => {
    setCurrentView('map');
    setSelectedLocation(null);
    setResultsData(null);
  };

  if (currentView === 'results' && resultsData) {
    return <ResultsDisplay results={resultsData} onBack={handleBackToMap} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-civic-primary/80 via-civic-primary/60 to-civic-primary/40" />
        </div>

        {/* Header */}
        <header className="relative z-20 p-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <MapPin className="text-civic-primary" size={24} />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">CivicCasa</h1>
                <p className="text-white/80 text-sm">Portail Citoyen de Casablanca</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Phone size={16} />
                <span>0522-XX-XX-XX</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)]">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Signaler un problème
              <br />
              <span className="text-civic-secondary">dans votre quartier</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Identifiez facilement l'autorité responsable et envoyez une demande formelle
              <br />
              en quelques clics seulement
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-civic-secondary">24h</div>
                <div className="text-white/80">Traitement moyen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-civic-secondary">16</div>
                <div className="text-white/80">Arrondissements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-civic-secondary">1200+</div>
                <div className="text-white/80">Problèmes résolus</div>
              </div>
            </div>

            <Button
              variant="civic-accent"
              size="lg"
              className="text-lg px-8 py-4 shadow-floating animate-fade-in"
              onClick={() => {
                document.getElementById('map-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              <MapPin className="mr-2" size={20} />
              Commencer le signalement
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm">Faites défiler pour la carte</span>
            <div className="w-0.5 h-8 bg-white/60"></div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div id="map-section" className="min-h-screen bg-civic-surface-soft">
        {/* Section Header */}
        <div className="py-12 bg-white border-b">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <Badge variant="secondary" className="mb-4">
              Étape 1
            </Badge>
            <h3 className="text-3xl font-bold text-civic-primary mb-4">
              Localisez le problème
            </h3>
            <p className="text-civic-neutral text-lg">
              Cliquez sur la carte ou recherchez une adresse pour identifier l'emplacement exact
            </p>
          </div>
        </div>

        {/* Map Container */}
        <div className="h-screen relative">
          <CasablancaMap
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        </div>
      </div>

      {/* Problem Report Modal */}
      <ProblemReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={selectedLocation}
        onSubmit={handleProblemSubmit}
      />

      {/* Footer */}
      <footer className="bg-civic-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <MapPin className="text-civic-primary" size={18} />
                </div>
                <span className="font-bold text-lg">CivicCasa</span>
              </div>
              <p className="text-white/80">
                Plateforme citoyenne pour améliorer la qualité de vie à Casablanca
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-white/80">
                <p>📞 0522-XX-XX-XX</p>
                <p>✉️ contact@civiccasa.ma</p>
                <p>📍 Casablanca, Maroc</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-white/80">
                <p>Signalement de problèmes</p>
                <p>Contact des autorités</p>
                <p>Suivi des demandes</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 CivicCasa. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;