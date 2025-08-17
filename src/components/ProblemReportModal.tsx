import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  AlertCircle, 
  Trash2, 
  Lightbulb, 
  Car, 
  Trees, 
  Building, 
  Phone,
  Zap,
  Droplets,
  Home,
  Bus,
  Shield,
  Leaf,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface SubCategory {
  id: string;
  name: string;
  description: string;
}

interface MainCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  subCategories: SubCategory[];
}

interface ProblemReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: MapLocation | null;
  onSubmit: (data: { categoryId: string; subCategoryId: string; description: string; location: MapLocation }) => void;
}

const mainCategories: MainCategory[] = [
  {
    id: 'public-services',
    name: 'Services Publics de Base',
    description: 'Problèmes liés aux services essentiels gérés par les concessionnaires ou offices.',
    icon: <Zap size={24} />,
    subCategories: [
      {
        id: 'electricity',
        name: 'Électricité (ONEE / Lydec)',
        description: 'Coupures, pannes, problèmes de facturation ou de raccordement.'
      },
      {
        id: 'water',
        name: 'Eau Potable (ONEE / Lydec)',
        description: 'Fuites, coupures, qualité de l\'eau, facturation.'
      },
      {
        id: 'sewage',
        name: 'Assainissement liquide (Lydec)',
        description: 'Canalisations bouchées, inondations, égouts.'
      },
      {
        id: 'waste',
        name: 'Collecte des déchets',
        description: 'Problèmes de ramassage des ordures, poubelles pleines, propreté des quartiers.'
      }
    ]
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure et Équipements',
    description: 'Problèmes liés à la voirie, aux bâtiments publics et aux équipements collectifs.',
    icon: <Building size={24} />,
    subCategories: [
      {
        id: 'roads',
        name: 'Voirie et trottoirs',
        description: 'Nids-de-poule, trottoirs abîmés, signalisation routière.'
      },
      {
        id: 'lighting',
        name: 'Éclairage public',
        description: 'Lampadaires en panne, zones non éclairées.'
      },
      {
        id: 'public-buildings',
        name: 'Bâtiments et équipements publics',
        description: 'État des écoles, hôpitaux, centres de santé, etc.'
      },
      {
        id: 'green-spaces',
        name: 'Espaces verts',
        description: 'Entretien des parcs, jardins, plantations.'
      }
    ]
  },
  {
    id: 'transport',
    name: 'Transport et Mobilité',
    description: 'Problèmes liés aux différents modes de transport dans la ville.',
    icon: <Bus size={24} />,
    subCategories: [
      {
        id: 'urban-transport',
        name: 'Transport urbain (Bus et Tramway)',
        description: 'Problèmes de fréquentation, de ponctualité, de propreté.'
      },
      {
        id: 'taxis',
        name: 'Taxis',
        description: 'Problèmes de tarification, de refus de course.'
      },
      {
        id: 'trains',
        name: 'Transport ferroviaire (ONCF)',
        description: 'Problèmes dans les gares ou les trains (pour les plaintes générales).'
      }
    ]
  },
  {
    id: 'security',
    name: 'Sécurité et Ordre Public',
    description: 'Problèmes liés à la sécurité, à la tranquillité publique et à la police.',
    icon: <Shield size={24} />,
    subCategories: [
      {
        id: 'crime',
        name: 'Signalement de crimes',
        description: 'Incidents de sécurité, agressions, vols.'
      },
      {
        id: 'noise',
        name: 'Nuisances sonores',
        description: 'Bruit excessif, fêtes, chantiers.'
      },
      {
        id: 'public-order',
        name: 'Trouble à l\'ordre public',
        description: 'Comportements dérangeants, occupation illégale de l\'espace public.'
      }
    ]
  },
  {
    id: 'environment',
    name: 'Environnement et Urbanisme',
    description: 'Problèmes liés à la pollution, aux constructions et à l\'aménagement du territoire.',
    icon: <Leaf size={24} />,
    subCategories: [
      {
        id: 'pollution',
        name: 'Pollution',
        description: 'Air, eau, bruits industriels.'
      },
      {
        id: 'construction',
        name: 'Constructions et urbanisme',
        description: 'Constructions illégales, bâtiments en ruine.'
      },
      {
        id: 'public-space',
        name: 'Occupation du domaine public',
        description: 'Commerces, étalages qui bloquent les trottoirs.'
      },
      {
        id: 'environment-general',
        name: 'Environnement',
        description: 'Décharges sauvages, respect des règles environnementales.'
      }
    ]
  }
];

const ProblemReportModal: React.FC<ProblemReportModalProps> = ({
  isOpen,
  onClose,
  location,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState<'main' | 'sub'>('main');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMainCategory || !selectedSubCategory || !description.trim() || !location) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        categoryId: selectedMainCategory,
        subCategoryId: selectedSubCategory,
        description: description.trim(),
        location
      });
      
      // Reset form
      setCurrentStep('main');
      setSelectedMainCategory('');
      setSelectedSubCategory('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting problem report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMainCategorySelect = (categoryId: string) => {
    setSelectedMainCategory(categoryId);
    setSelectedSubCategory('');
    setCurrentStep('sub');
  };

  const handleBackToMain = () => {
    setCurrentStep('main');
    setSelectedSubCategory('');
  };

  const selectedMainCategoryData = mainCategories.find(cat => cat.id === selectedMainCategory);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-civic-primary flex items-center gap-2">
            <AlertCircle size={24} />
            Signaler un problème
            {currentStep === 'sub' && (
              <Badge variant="secondary" className="ml-auto">
                Étape 2/2
              </Badge>
            )}
            {currentStep === 'main' && (
              <Badge variant="secondary" className="ml-auto">
                Étape 1/2
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location Display */}
          {location && (
            <Card className="p-4 bg-civic-surface-soft">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-civic-primary" />
                <span className="text-civic-neutral">
                  Position: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </span>
              </div>
              {location.address && (
                <p className="text-sm text-civic-neutral mt-1">{location.address}</p>
              )}
            </Card>
          )}

          {/* Main Category Selection */}
          {currentStep === 'main' && (
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Choisissez une catégorie principale</Label>
                <p className="text-sm text-civic-neutral mt-1">
                  Sélectionnez le domaine qui correspond le mieux à votre problème
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {mainCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="p-4 cursor-pointer transition-all duration-200 hover:shadow-card hover:border-civic-primary/50 group"
                    onClick={() => handleMainCategorySelect(category.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-civic-surface-soft text-civic-primary group-hover:bg-civic-primary group-hover:text-white transition-colors">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-base">{category.name}</h4>
                          <ChevronRight size={20} className="text-civic-neutral group-hover:text-civic-primary" />
                        </div>
                        <p className="text-sm text-civic-neutral leading-relaxed">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Sub Category Selection */}
          {currentStep === 'sub' && selectedMainCategoryData && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToMain}
                  className="p-2"
                >
                  <ArrowLeft size={16} />
                </Button>
                <div>
                  <Label className="text-base font-medium">
                    {selectedMainCategoryData.name}
                  </Label>
                  <p className="text-sm text-civic-neutral">
                    Choisissez le type de problème spécifique
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {selectedMainCategoryData.subCategories.map((subCategory) => (
                  <Card
                    key={subCategory.id}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-card ${
                      selectedSubCategory === subCategory.id
                        ? 'border-civic-primary bg-civic-primary/5 shadow-civic'
                        : 'border-border hover:border-civic-primary/50'
                    }`}
                    onClick={() => setSelectedSubCategory(subCategory.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full mt-2 ${
                        selectedSubCategory === subCategory.id
                          ? 'bg-civic-primary'
                          : 'bg-gray-300'
                      }`} />
                      <div className="flex-1">
                        <h5 className="font-medium text-sm mb-1">{subCategory.name}</h5>
                        <p className="text-xs text-civic-neutral leading-relaxed">
                          {subCategory.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Description */}
              {selectedSubCategory && (
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description du problème
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez le problème en détail... (ex: Les poubelles de ma rue ne sont pas ramassées depuis 4 jours)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-civic-neutral">
                    Soyez aussi précis que possible pour nous aider à traiter votre demande efficacement.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            {currentStep === 'sub' && selectedSubCategory && (
              <Button
                variant="civic"
                onClick={handleSubmit}
                disabled={!selectedMainCategory || !selectedSubCategory || !description.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Traitement...' : 'Trouver l\'autorité responsable'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemReportModal;