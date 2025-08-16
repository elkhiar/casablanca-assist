import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle, 
  ArrowLeft,
  ExternalLink,
  FileText,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Authority {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

interface ResultsData {
  authority: Authority;
  generatedText: string;
  instructions: string[];
  category: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface ResultsDisplayProps {
  results: ResultsData;
  onBack: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, onBack }) => {
  const [copiedText, setCopiedText] = useState<string>('');
  const { toast } = useToast();

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      toast({
        title: "Copié !",
        description: `${type} copié dans le presse-papier`,
      });
      
      setTimeout(() => setCopiedText(''), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papier",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-civic-primary hover:text-civic-primary-light"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour à la carte
          </Button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-full mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-civic-primary mb-2">
              Autorité identifiée
            </h1>
            <p className="text-civic-neutral">
              Voici les informations pour traiter votre demande
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Authority Information */}
          <Card className="p-6 shadow-card">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-civic-primary/10 rounded-lg flex items-center justify-center">
                  <Building size={24} className="text-civic-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Autorité responsable</h2>
                  <Badge variant="secondary" className="mt-1">
                    {results.category}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-civic-primary text-lg">
                    {results.authority.name}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-civic-surface-soft rounded-lg">
                    <MapPin size={16} className="text-civic-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-civic-neutral">Adresse</p>
                      <p className="text-sm font-medium">{results.authority.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-civic-surface-soft rounded-lg">
                    <Phone size={16} className="text-civic-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-civic-neutral">Téléphone</p>
                      <p className="text-sm font-medium">{results.authority.phone}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.authority.phone, 'Numéro de téléphone')}
                    >
                      {copiedText === 'Numéro de téléphone' ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-civic-surface-soft rounded-lg">
                    <Mail size={16} className="text-civic-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-civic-neutral">Email</p>
                      <p className="text-sm font-medium">{results.authority.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(results.authority.email, 'Adresse email')}
                    >
                      {copiedText === 'Adresse email' ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </Button>
                  </div>

                  {results.authority.website && (
                    <div className="pt-2">
                      <Button
                        variant="civic-outline"
                        size="sm"
                        className="w-full"
                        asChild
                      >
                        <a 
                          href={results.authority.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Portail en ligne
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Generated Request */}
          <Card className="p-6 shadow-card">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-civic-secondary/10 rounded-lg flex items-center justify-center">
                  <FileText size={24} className="text-civic-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Demande formelle</h2>
                  <p className="text-sm text-civic-neutral">Générée automatiquement</p>
                </div>
              </div>

              <div className="bg-civic-surface-soft rounded-lg p-4 border-l-4 border-civic-secondary">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-gray-700">
                    {results.generatedText}
                  </pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="civic-accent"
                  className="flex-1"
                  onClick={() => copyToClipboard(results.generatedText, 'Demande formelle')}
                >
                  {copiedText === 'Demande formelle' ? (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy size={16} className="mr-2" />
                      Copier le texte
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 p-6 shadow-card">
          <h3 className="text-lg font-semibold mb-4 text-civic-primary">
            Étapes suivantes
          </h3>
          <div className="space-y-3">
            {results.instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-civic-primary text-white rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-civic-neutral">{instruction}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Button
            variant="civic"
            onClick={onBack}
            className="px-8"
          >
            Signaler un autre problème
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;