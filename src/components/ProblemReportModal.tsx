import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  language: 'ar' | 'fr' | 'darija';
  onSubmit: (data: { 
    categoryId: string; 
    subCategoryId: string; 
    description: string; 
    location: MapLocation;
    files?: File[];
    phone: string;
    email?: string;
    language: 'arabic' | 'french';
  }) => void;
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
  language,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState<'main' | 'sub' | 'details'>('main');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [documentLanguage, setDocumentLanguage] = useState<'arabic' | 'french'>('french');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMainCategory || !selectedSubCategory || !description.trim() || !location || !phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      onSubmit({
        categoryId: selectedMainCategory,
        subCategoryId: selectedSubCategory,
        description: description.trim(),
        location,
        files,
        phone: phone.trim(),
        email: email.trim() || undefined,
        language: documentLanguage
      });
      
      // Reset form
      setCurrentStep('main');
      setSelectedMainCategory('');
      setSelectedSubCategory('');
      setDescription('');
      setFiles([]);
      setPhone('');
      setEmail('');
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

  const handleSubCategorySelect = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId);
    setCurrentStep('details');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
            {language === 'fr' && "Signaler un problème"}
            {language === 'ar' && "الإبلاغ عن مشكلة"}
            {language === 'darija' && "الإبلاغ علا مشكلة"}
            {currentStep === 'details' && (
              <Badge variant="secondary" className="ml-auto">
                {language === 'fr' && "Étape 3/3"}
                {language === 'ar' && "المرحلة ٣/٣"}
                {language === 'darija' && "المرحلة ٣/٣"}
              </Badge>
            )}
            {currentStep === 'sub' && (
              <Badge variant="secondary" className="ml-auto">
                {language === 'fr' && "Étape 2/3"}
                {language === 'ar' && "المرحلة ٢/٣"}
                {language === 'darija' && "المرحلة ٢/٣"}
              </Badge>
            )}
            {currentStep === 'main' && (
              <Badge variant="secondary" className="ml-auto">
                {language === 'fr' && "Étape 1/3"}
                {language === 'ar' && "المرحلة ١/٣"}
                {language === 'darija' && "المرحلة ١/٣"}
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
                    onClick={() => handleSubCategorySelect(subCategory.id)}
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

            </div>
          )}

          {/* Details Form */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep('sub')}
                  className="p-2"
                >
                  <ArrowLeft size={16} />
                </Button>
                <div>
                  <Label className="text-base font-medium">
                    {language === 'fr' && "Détails du problème"}
                    {language === 'ar' && "تفاصيل المشكلة"}
                    {language === 'darija' && "تفاصيل المشكلة"}
                  </Label>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-medium">
                    {language === 'fr' && "Description du problème"}
                    {language === 'ar' && "وصف المشكلة"}
                    {language === 'darija' && "وصف المشكلة"}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={
                      language === 'fr' ? "Décrivez le problème en détail... (ex: Les poubelles de ma rue ne sont pas ramassées depuis 4 jours)" :
                      language === 'ar' ? "صفوا المشكلة بالتفصيل..." :
                      "صفو المشكلة بالتفصيل..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-3">
                  <Label htmlFor="files" className="text-base font-medium">
                    {language === 'fr' && "Photos ou documents (optionnel)"}
                    {language === 'ar' && "صور أو وثائق (اختياري)"}
                    {language === 'darija' && "صور ولا وثائق (اختياري)"}
                  </Label>
                  <Input
                    id="files"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-civic-surface-soft p-2 rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">
                      {language === 'fr' && "Numéro de téléphone *"}
                      {language === 'ar' && "رقم الهاتف *"}
                      {language === 'darija' && "رقم التليفون *"}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      {language === 'fr' && "Email (optionnel)"}
                      {language === 'ar' && "البريد الإلكتروني (اختياري)"}
                      {language === 'darija' && "البريد الإلكتروني (اختياري)"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Document Language Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">
                    {language === 'fr' && "Langue du document officiel"}
                    {language === 'ar' && "لغة الوثيقة الرسمية"}
                    {language === 'darija' && "لغة الوثيقة الرسمية"}
                  </Label>
                  <Select value={documentLanguage} onValueChange={(value: 'arabic' | 'french') => setDocumentLanguage(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="french">
                        {language === 'fr' && "Français"}
                        {language === 'ar' && "الفرنسية"}
                        {language === 'darija' && "الفرنسية"}
                      </SelectItem>
                      <SelectItem value="arabic">
                        {language === 'fr' && "Arabe"}
                        {language === 'ar' && "العربية"}
                        {language === 'darija' && "العربية"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
              {language === 'fr' && "Annuler"}
              {language === 'ar' && "إلغاء"}
              {language === 'darija' && "إلغاء"}
            </Button>
            {currentStep === 'details' && (
              <Button
                variant="civic"
                onClick={handleSubmit}
                disabled={!selectedMainCategory || !selectedSubCategory || !description.trim() || !phone.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  language === 'fr' ? 'Traitement...' :
                  language === 'ar' ? 'جاري المعالجة...' : 'جاري المعالجة...'
                ) : (
                  language === 'fr' ? 'Trouver l\'autorité responsable' :
                  language === 'ar' ? 'العثور على السلطة المسؤولة' : 'العثور على السلطة المسؤولة'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemReportModal;