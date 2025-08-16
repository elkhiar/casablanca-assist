import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MapPin, AlertCircle, Trash2, Lightbulb, Car, Trees, Building, Phone } from 'lucide-react';

interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

interface ProblemCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ProblemReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: MapLocation | null;
  onSubmit: (data: { categoryId: string; description: string; location: MapLocation }) => void;
}

const problemCategories: ProblemCategory[] = [
  {
    id: 'waste',
    name: 'Collecte des déchets',
    description: 'Problèmes de ramassage des ordures, poubelles pleines',
    icon: <Trash2 size={24} />
  },
  {
    id: 'lighting',
    name: 'Éclairage public',
    description: 'Lampadaires cassés, zones mal éclairées',
    icon: <Lightbulb size={24} />
  },
  {
    id: 'roads',
    name: 'Voirie et trottoirs',
    description: 'Nids de poule, trottoirs abîmés, signalisation',
    icon: <Car size={24} />
  },
  {
    id: 'green',
    name: 'Espaces verts',
    description: 'Entretien des parcs, arbres, jardins publics',
    icon: <Trees size={24} />
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Bâtiments publics, équipements collectifs',
    icon: <Building size={24} />
  },
  {
    id: 'emergency',
    name: 'Urgence',
    description: 'Situations dangereuses nécessitant une intervention rapide',
    icon: <AlertCircle size={24} />
  }
];

const ProblemReportModal: React.FC<ProblemReportModalProps> = ({
  isOpen,
  onClose,
  location,
  onSubmit
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim() || !location) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        categoryId: selectedCategory,
        description: description.trim(),
        location
      });
      
      // Reset form
      setSelectedCategory('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting problem report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-civic-primary flex items-center gap-2">
            <AlertCircle size={24} />
            Signaler un problème
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

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Type de problème</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {problemCategories.map((category) => (
                <Card
                  key={category.id}
                  className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-card ${
                    selectedCategory === category.id
                      ? 'border-civic-primary bg-civic-primary/5 shadow-civic'
                      : 'border-border hover:border-civic-primary/50'
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedCategory === category.id
                        ? 'bg-civic-primary text-white'
                        : 'bg-civic-surface-soft text-civic-primary'
                    }`}>
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{category.name}</h4>
                      <p className="text-xs text-civic-neutral mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Description */}
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
            <Button
              variant="civic"
              onClick={handleSubmit}
              disabled={!selectedCategory || !description.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Traitement...' : 'Trouver l\'autorité responsable'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemReportModal;