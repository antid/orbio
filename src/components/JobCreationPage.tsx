import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Lightbulb, Sparkles, ArrowRight, CheckCircle, ArrowLeft, ChevronDown, ChevronUp, Edit2, Trash2, Plus, Save, X, Check, ChevronsUpDown, Send } from 'lucide-react';
import { Progress } from './ui/progress';
import { Breadcrumb } from './Breadcrumb';

interface EvaluationCriterion {
  id: string;
  name: string;
  weight: number;
  description: string;
}

interface KillerCriterion {
  id: string;
  question: string;
  required: boolean;
}

interface JobCreationPageProps {
  onBack: () => void;
  onComplete: (positionData: { 
    title: string; 
    description: string; 
    location?: string;
    requirements: string[];
    criteria: EvaluationCriterion[];
    killerCriteria: KillerCriterion[];
    contractType: string;
    salary: string;
  }) => void;
}

export function JobCreationPage({ onBack, onComplete }: JobCreationPageProps) {
  const [step, setStep] = useState<'prompt' | 'generating' | 'review' | 'criteria' | 'killer-criteria' | 'publish'>('prompt');
  const [positionTitle, setPositionTitle] = useState('');
  const [selectedCity, setSelectedCity] = useState('Madrid');
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [selectedContractType, setSelectedContractType] = useState('Indefinido');
  const [contractPopoverOpen, setContractPopoverOpen] = useState(false);
  const [salary, setSalary] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [recommendedCriteriaExpanded, setRecommendedCriteriaExpanded] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [deletedRequirements, setDeletedRequirements] = useState<Set<number>>(new Set());
  const [editingRequirement, setEditingRequirement] = useState<{ index: number; text: string } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<{ id: string; name: string; weight: number; description: string } | null>(null);
  const [criterionModalOpen, setCriterionModalOpen] = useState(false);
  const [deletedKillerCriteria, setDeletedKillerCriteria] = useState<Set<string>>(new Set());
  const [editingKillerCriterion, setEditingKillerCriterion] = useState<{ id: string; question: string; required: boolean } | null>(null);
  const [killerCriterionModalOpen, setKillerCriterionModalOpen] = useState(false);
  const [deletedCriteria, setDeletedCriteria] = useState<Set<string>>(new Set());
  const [editingKillerCriterionId, setEditingKillerCriterionId] = useState<string | null>(null);
  const [editKillerValues, setEditKillerValues] = useState<{ question: string; required: boolean }>({ question: '', required: false });
  const [editingCriterionId, setEditingCriterionId] = useState<string | null>(null);
  const [editCriterionValues, setEditCriterionValues] = useState<{ name: string; weight: number; description: string }>({ name: '', weight: 0, description: '' });
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(['orbio']));
  const [showDataReviewModal, setShowDataReviewModal] = useState(false);
  const [reviewPlatform, setReviewPlatform] = useState<string>('');
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: [] as string[],
    criteria: [] as Array<{ id: string; name: string; weight: number; description: string }>,
    killerCriteria: [] as Array<{ id: string; question: string; required: boolean }>
  });

  const spanishCities = [
    'A Coruña', 'Albacete', 'Alicante', 'Almería', 'Barcelona', 'Bilbao', 'Burgos', 'Cáceres', 
    'Cádiz', 'Castelló de la Plana', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Girona', 'Granada', 
    'Guadalajara', 'Huelva', 'Huesca', 'Jaén', 'Las Palmas de Gran Canaria', 'León', 'Lleida', 
    'Logroño', 'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Ourense', 'Oviedo', 'Palencia', 
    'Palma', 'Pamplona', 'Pontevedra', 'Salamanca', 'San Sebastián', 'Santa Cruz de Tenerife', 
    'Santander', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 
    'Valladolid', 'Vigo', 'Vitoria-Gasteiz', 'Zamora', 'Zaragoza'
  ].sort();

  const spanishContractTypes = [
    'Indefinido',
    'Temporal',
    'Obra o servicio', 
    'Interinidad',
    'Formación y aprendizaje',
    'Prácticas',
    'Relevo',
    'Sustitución por anticipación de la edad de jubilación',
    'Temporal por circunstancias excepcionales',
    'Fijo discontinuo'
  ];

  const suggestions = [
    'Consejos',
    'Incluye competencias requeridas',
    'Especifica nivel de experiencia',
    'Menciona beneficios'
  ];

  const handleRefineWithAI = () => {
    if (!prompt.trim() || isRefining) return;
    
    setIsRefining(true);
    
    // Simulate AI refinement process
    setTimeout(() => {
      const refinedContent = generateRefinedDescription(prompt, positionTitle);
      setPrompt(refinedContent);
      setIsRefining(false);
    }, 2000);
  };

  const generateRefinedDescription = (originalPrompt: string, title: string) => {
    // Create a more comprehensive job description based on the original prompt and position title
    const roleType = title.toLowerCase();
    
    let refinedDescription = `**Descripción del Puesto: ${title}**

Buscamos un/a ${title.toLowerCase()} altamente motivado/a para unirse a nuestro equipo dinámico. Esta es una excelente oportunidad para crecer profesionalmente en un ambiente colaborativo y desafiante.

**Responsabilidades Principales:**
`;

    // Add role-specific responsibilities based on the position title
    if (roleType.includes('camarero') || roleType.includes('mesero')) {
      refinedDescription += `• Atender a los clientes de manera profesional y cordial
• Tomar pedidos y servir alimentos y bebidas
�� Mantener las mesas limpias y organizadas
• Procesar pagos y manejar el sistema POS
• Colaborar con el equipo de cocina para garantizar un servicio eficiente
`;
    } else if (roleType.includes('cocinero') || roleType.includes('chef')) {
      refinedDescription += `• Preparar alimentos siguiendo recetas estándares y procedimientos establecidos
• Mantener las estaciones de trabajo limpias y organizadas
• Gestionar el inventario de ingredientes y suministros
• Seguir estrictamente las normas de seguridad alimentaria e higiene
• Colaborar efectivamente con el equipo de cocina durante servicios de alta demanda
`;
    } else if (roleType.includes('ayudante')) {
      refinedDescription += `• Asistir en la preparación de ingredientes y mise en place
• Mantener la limpieza y orden en todas las áreas de trabajo
• Apoyar al equipo durante los servicios de mayor demanda
• Realizar tareas de limpieza profunda según programación
• Recibir y organizar mercancías y suministros
`;
    } else {
      refinedDescription += `• Ejecutar las tareas principales del puesto con profesionalismo y eficiencia
• Mantener altos estándares de calidad en todas las actividades
• Colaborar efectivamente con el equipo de trabajo
• Seguir todos los procedimientos y protocolos establecidos
• Contribuir a un ambiente de trabajo positivo y productivo
`;
    }

    refinedDescription += `
**Requisitos Esenciales:**
• Experiencia previa en posiciones similares (mínimo 1-2 años)
• Excelentes habilidades de comunicación y trabajo en equipo
• Capacidad para trabajar bajo presión en entornos de alta demanda
• Disponibilidad para trabajar en turnos rotativos, incluyendo fines de semana
• Certificaciones relevantes para el sector (manipulación de alimentos, etc.)

**Lo que Ofrecemos:**
• Ambiente de trabajo dinámico y colaborativo
• Oportunidades de crecimiento profesional
• Formación continua y desarrollo de habilidades
• Horarios flexibles y beneficios competitivos
• Equipo de trabajo experimentado y de apoyo

**Competencias Valoradas:**
• Orientación al cliente y enfoque en la calidad del servicio
• Adaptabilidad y flexibilidad ante cambios
• Proactividad y capacidad de resolución de problemas
• Compromiso con la excelencia y mejora continua

${originalPrompt.length > 50 ? `

**Información Adicional:**
${originalPrompt}` : ''}`;

    return refinedDescription;
  };

  const handleEditRequirement = (index: number, requirement: string) => {
    setEditingRequirement({ index, text: requirement });
    setEditModalOpen(true);
  };

  const handleSaveRequirement = () => {
    if (editingRequirement) {
      const updatedRequirements = [...jobData.requirements];
      updatedRequirements[editingRequirement.index] = editingRequirement.text;
      setJobData({ ...jobData, requirements: updatedRequirements });
      setEditModalOpen(false);
      setEditingRequirement(null);
    }
  };

  const handleDeleteRequirement = (index: number) => {
    setDeletedRequirements(prev => new Set([...prev, index]));
  };

  const handleAddRequirement = (index: number) => {
    setDeletedRequirements(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const handleEditCriterion = (criterion: { id: string; name: string; weight: number; description: string }) => {
    setEditingCriterion({ ...criterion });
    setCriterionModalOpen(true);
  };

  const handleSaveCriterion = () => {
    if (editingCriterion) {
      const updatedCriteria = jobData.criteria.map(criterion =>
        criterion.id === editingCriterion.id ? editingCriterion : criterion
      );
      setJobData({ ...jobData, criteria: updatedCriteria });
      setCriterionModalOpen(false);
      setEditingCriterion(null);
    }
  };

  const handleDeleteCriterion = (criterionId: string) => {
    setDeletedCriteria(prev => new Set([...prev, criterionId]));
  };

  const handleAddCriterion = (criterionId: string) => {
    setDeletedCriteria(prev => {
      const newSet = new Set(prev);
      newSet.delete(criterionId);
      return newSet;
    });
  };

  const handleEditKillerCriterion = (criterion: { id: string; question: string; required: boolean }) => {
    setEditingKillerCriterion({ ...criterion });
    setKillerCriterionModalOpen(true);
  };

  const handleSaveKillerCriterion = () => {
    if (editingKillerCriterion) {
      const updatedKillerCriteria = jobData.killerCriteria.map(criterion =>
        criterion.id === editingKillerCriterion.id ? editingKillerCriterion : criterion
      );
      setJobData({ ...jobData, killerCriteria: updatedKillerCriteria });
      setKillerCriterionModalOpen(false);
      setEditingKillerCriterion(null);
    }
  };

  const handleStartEditKillerCriterion = (criterion: { id: string; question: string; required: boolean }) => {
    setEditingKillerCriterionId(criterion.id);
    setEditKillerValues({ question: criterion.question, required: criterion.required });
  };

  const handleSaveInlineKillerCriterion = () => {
    if (editingKillerCriterionId) {
      const updatedKillerCriteria = jobData.killerCriteria.map(criterion =>
        criterion.id === editingKillerCriterionId ? { ...criterion, ...editKillerValues } : criterion
      );
      setJobData({ ...jobData, killerCriteria: updatedKillerCriteria });
      setEditingKillerCriterionId(null);
      setEditKillerValues({ question: '', required: false });
    }
  };

  const handleCancelInlineKillerCriterion = () => {
    setEditingKillerCriterionId(null);
    setEditKillerValues({ question: '', required: false });
  };

  const handleStartEditCriterion = (criterion: { id: string; name: string; weight: number; description: string }) => {
    setEditingCriterionId(criterion.id);
    setEditCriterionValues({ name: criterion.name, weight: criterion.weight, description: criterion.description });
  };

  const handleSaveInlineCriterion = () => {
    if (editingCriterionId) {
      const updatedCriteria = jobData.criteria.map(criterion =>
        criterion.id === editingCriterionId ? { ...criterion, ...editCriterionValues } : criterion
      );
      setJobData({ ...jobData, criteria: updatedCriteria });
      setEditingCriterionId(null);
      setEditCriterionValues({ name: '', weight: 0, description: '' });
    }
  };

  const handleCancelInlineCriterion = () => {
    setEditingCriterionId(null);
    setEditCriterionValues({ name: '', weight: 0, description: '' });
  };

  const handleDeleteKillerCriterion = (criterionId: string) => {
    setDeletedKillerCriteria(prev => new Set([...prev, criterionId]));
  };

  const handleAddKillerCriterion = (criterionId: string) => {
    setDeletedKillerCriteria(prev => {
      const newSet = new Set(prev);
      newSet.delete(criterionId);
      return newSet;
    });
  };

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    
    setStep('generating');
    setGenerationProgress(0);
    
    // Simulate AI generation process
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Generate mock job data
          setJobData({
            title: 'Cocinero/a - Restaurante (Turnos Rotativos)',
            description: `Buscamos un/a cocinero/a experimentado/a para unirse a nuestro equipo en un restaurante de alta rotación. El candidato ideal tendrá experiencia en cocina profesional, capacidad para trabajar bajo presión y mantener los estándares de calidad en un ambiente dinámico.

Responsabilidades:
• Preparar alimentos siguiendo recetas estándares
• Mantener estaciones de trabajo limpias y organizadas
• Colaborar efectivamente con el equipo de cocina
• Seguir protocolos de seguridad alimentaria
• Adaptarse a turnos rotativos y horarios flexibles`,
            requirements: [
              'Mínimo 2 años de experiencia en cocina profesional',
              'Conocimiento de técnicas culinarias básicas',
              'Capacidad para trabajar en turnos rotativos',
              'Experiencia en restaurantes de alta rotación',
              'Certificado de manipulación de alimentos'
            ],
            criteria: [
              {
                id: '1',
                name: 'Experiencia en Cocina Profesional',
                weight: 30,
                description: '2+ años en restaurantes similares con alta rotación'
              },
              {
                id: '2',
                name: 'Habilidades Técnicas',
                weight: 25,
                description: 'Dominio de técnicas básicas: corte, cocción, emplatado'
              },
              {
                id: '3',
                name: 'Trabajo en Equipo',
                weight: 20,
                description: 'Capacidad demostrada de colaboración en equipos grandes'
              },
              {
                id: '4',
                name: 'Adaptabilidad Horarios',
                weight: 15,
                description: 'Disponibilidad para turnos rotativos y fines de semana'
              },
              {
                id: '5',
                name: 'Gestión bajo Presión',
                weight: 10,
                description: 'Experiencia en cocinas de alto volumen y ritmo acelerado'
              }
            ],
            killerCriteria: [
              {
                id: '1',
                question: '¿Tienes al menos 18 años de edad?',
                required: true
              },
              {
                id: '2',
                question: '¿Tienes permiso de trabajo válido en España?',
                required: true
              },
              {
                id: '3',
                question: '¿Tienes certificado de manipulación de alimentos vigente?',
                required: true
              },
              {
                id: '4',
                question: '¿Tienes disponibilidad para trabajar fines de semana?',
                required: true
              }
            ]
          });
          setStep('review');
          return 100;
        }
        return prev + 20;
      });
    }, 600);
  };

  const handleContinueToCriteria = () => {
    setStep('criteria');
  };

  const handleContinueToKillerCriteria = () => {
    setStep('killer-criteria');
  };

  const handleContinueToPublish = () => {
    setStep('publish');
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  const handleOpenDataReview = (platform: string) => {
    setReviewPlatform(platform);
    setShowDataReviewModal(true);
  };

  const handleComplete = () => {
    const positionData = {
      title: positionTitle || jobData.title,
      description: prompt || jobData.description,
      location: selectedCity,
      requirements: jobData.requirements,
      criteria: jobData.criteria.filter(c => !deletedCriteria.has(c.id)),
      killerCriteria: jobData.killerCriteria.filter(kc => !deletedKillerCriteria.has(kc.id)),
      contractType: selectedContractType,
      salary: salary
    };
    onComplete(positionData);
  };

  const getStepNumber = () => {
    switch (step) {
      case 'prompt': return 1;
      case 'generating': return 2;
      case 'review': return 3;
      case 'criteria': return 4;
      case 'killer-criteria': return 5;
      case 'publish': return 6;
      default: return 1;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'prompt': return 'Describe tu Puesto';
      case 'generating': return 'Generando Puesto';
      case 'review': return 'Revisión de la Oferta';
      case 'criteria': return 'Criterios de Evaluación';
      case 'killer-criteria': return 'Filtros Obligatorios';
      case 'publish': return 'Publicar Puesto';
      default: return 'Nueva Posición';
    }
  };

  const getBreadcrumbItems = () => {
    const items = [
      { label: 'Posiciones', onClick: onBack },
      { label: 'Nueva Posición' }
    ];
    
    if (step !== 'prompt') {
      items.push({ label: getStepTitle() });
    }
    
    return items;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium ${
            num <= getStepNumber() 
              ? 'bg-green-100 text-green-800 border-2 border-green-500' 
              : 'bg-gray-100 text-gray-500'
          }`}>
            {num < getStepNumber() ? <CheckCircle size={12} className="text-green-600 md:w-4 md:h-4" /> : num}
          </div>
          {num < 6 && (
            <div className={`w-4 md:w-8 h-0.5 ${
              num < getStepNumber() ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  if (step === 'prompt') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

        <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderStepIndicator()}

            <div className="max-w-4xl mx-auto">
              {/* Main Content */}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <div className="text-center mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                      <Sparkles className="text-green-600" size={20} />
                    </div>
                    <h1 className="text-lg md:text-xl font-medium text-gray-900 mb-1">Cuéntanos sobre el rol que buscas</h1>
                    <p className="text-sm text-gray-600 px-4 md:px-0">Describe el puesto en detalle para que podamos generar la mejor oferta de empleo</p>
                  </div>

                  <div className="space-y-4">
                    {/* Quick Templates */}
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                      <h3 className="text-sm text-gray-700 mb-2 flex items-center gap-1">
                        <Sparkles size={12} />
                        Plantillas Rápidas
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
                        {[
                          { title: "Camarero/a", type: "Hostelería" },
                          { title: "Cocinero/a", type: "Hostelería" },
                          { title: "Ayudante Cocina", type: "Hostelería" },
                          { title: "Encargado/a Sala", type: "Hostelería" }
                        ].map((template, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-2 rounded text-xs border border-gray-200/50 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all"
                            onClick={() => {
                              setPositionTitle(template.title);
                              setPrompt(`Buscamos ${template.title} para nuestro equipo...`);
                            }}
                          >
                            <div className="text-gray-800 truncate">{template.title}</div>
                            <div className="text-gray-500 text-[10px]">{template.type}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="position-title" className="block text-sm font-medium text-gray-700 mb-2">
                        Posición
                      </label>
                      <Input
                        id="position-title"
                        placeholder="Ej: Camarero/a, Cocinero/a, Ayudante de Cocina..."
                        value={positionTitle}
                        onChange={(e) => setPositionTitle(e.target.value)}
                        className="bg-white border-gray-300"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city-selection" className="block text-sm font-medium text-gray-700 mb-2">
                          Ciudad
                        </label>
                        <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={cityPopoverOpen}
                              className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50"
                            >
                              {selectedCity}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command>
                              <CommandInput placeholder="Buscar ciudad..." className="h-9" />
                              <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                              <CommandGroup>
                                <CommandList className="max-h-60">
                                  {spanishCities.map((city) => (
                                    <CommandItem
                                      key={city}
                                      value={city}
                                      onSelect={(currentValue) => {
                                        setSelectedCity(currentValue === selectedCity ? "" : currentValue);
                                        setCityPopoverOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          selectedCity === city ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      {city}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label htmlFor="contract-type-selection" className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Contrato
                        </label>
                        <Popover open={contractPopoverOpen} onOpenChange={setContractPopoverOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={contractPopoverOpen}
                              className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50"
                            >
                              {selectedContractType}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                            <Command>
                              <CommandInput placeholder="Buscar tipo de contrato..." className="h-9" />
                              <CommandEmpty>No se encontró el tipo de contrato.</CommandEmpty>
                              <CommandGroup>
                                <CommandList className="max-h-60">
                                  {spanishContractTypes.map((contractType) => (
                                    <CommandItem
                                      key={contractType}
                                      value={contractType}
                                      onSelect={(currentValue) => {
                                        setSelectedContractType(currentValue === selectedContractType ? "" : currentValue);
                                        setContractPopoverOpen(false);
                                      }}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${
                                          selectedContractType === contractType ? "opacity-100" : "opacity-0"
                                        }`}
                                      />
                                      {contractType}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <label htmlFor="salary-input" className="block text-sm font-medium text-gray-700 mb-2">
                          Salario
                        </label>
                        <Input
                          id="salary-input"
                          placeholder="Ej: 1.500€/mes, 18.000€/año..."
                          value={salary}
                          onChange={(e) => setSalary(e.target.value)}
                          className="bg-white border-gray-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="position-description" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción del puesto
                      </label>
                      <div className="relative">
                        <Textarea
                          id="position-description"
                          placeholder="Describe el puesto que quieres crear. Incluye detalles sobre responsabilidades, requisitos, competencias necesarias, nivel de experiencia y cualquier otra información relevante..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          className="min-h-32 resize-none bg-white border-gray-300 focus:border-transparent focus:ring-0 focus:shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
                        />
                        {prompt.length > 20 && (
                          <Button
                            size="sm"
                            onClick={handleRefineWithAI}
                            disabled={isRefining}
                            className="absolute bottom-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
                          >
                            {isRefining ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                                Refinando...
                              </>
                            ) : (
                              <>
                                <Sparkles size={14} className="mr-1" />
                                Refinar con IA
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>


                </div>



                {/* Smart Recommendations */}
                <div className="bg-green-50 border border-green-200 rounded-md">
                  <button
                    className="w-full p-3 flex items-center justify-between text-left hover:bg-green-100 transition-colors rounded-md"
                    onClick={() => setRecommendedCriteriaExpanded(!recommendedCriteriaExpanded)}
                  >
                    <div>
                      <h3 className="text-sm text-green-900">Criterios Recomendados</h3>
                      <p className="text-xs text-green-700">
                        Basado en posiciones similares en hostelería
                      </p>
                    </div>
                    {recommendedCriteriaExpanded ? (
                      <ChevronUp size={16} className="text-green-600" />
                    ) : (
                      <ChevronDown size={16} className="text-green-600" />
                    )}
                  </button>
                  {recommendedCriteriaExpanded && (
                    <div className="px-3 pt-2 pb-3 grid grid-cols-3 gap-1">
                      {[
                        "Certificado manipulación alimentos",
                        "Experiencia mín. 1-2 años",
                        "Disponibilidad fines de semana",
                        "Trabajo en equipo",
                        "Gestión bajo presión",
                        "Atención al cliente",
                        "Conocimiento de POS"
                      ].map((criterion, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle size={12} className="text-green-600" />
                          <span className="text-green-800">{criterion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button 
                    onClick={handlePromptSubmit}
                    disabled={!prompt.trim() || !positionTitle.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 w-full md:w-auto"
                  >
                    Generar Oferta de Empleo
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>

              {/* Sidebar with Context and Recommendations */}

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Breadcrumb items={getBreadcrumbItems()} />

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-2xl mx-auto">
            {renderStepIndicator()}

            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>

              <div>
                <h1 className="text-xl font-medium text-gray-900 mb-2">Generando vuestro Puesto</h1>
                <p className="text-sm text-gray-600 mb-4">Generando oferta de empleo...</p>
                
                <Progress value={generationProgress} className="w-full max-w-md mx-auto [&>[data-slot=progress-indicator]]:bg-green-600" />
              </div>

              <div className="hidden md:flex justify-center gap-8 text-sm">
                <div className={`flex items-center gap-2 ${generationProgress >= 33 ? 'text-green-600' : 'text-gray-400'}`}>
                  {generationProgress >= 33 ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded bg-gray-300"></div>
                  )}
                  Analizando descripción...
                </div>
                <div className={`flex items-center gap-2 ${generationProgress >= 66 ? 'text-green-600' : 'text-gray-400'}`}>
                  {generationProgress >= 66 ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded bg-gray-300"></div>
                  )}
                  Generando oferta de empleo...
                </div>
                <div className={`flex items-center gap-2 ${generationProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                  {generationProgress >= 100 ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <div className="w-4 h-4 rounded bg-gray-300"></div>
                  )}
                  Finalizando mejoras
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {renderStepIndicator()}

          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-green-600" />
                <span className="font-medium text-green-800">Oferta generada exitosamente</span>
              </div>
              <p className="text-sm text-green-700">
                Hemos creado una descripción completa basada en tu prompt. Revisa los detalles y continúa para configurar los criterios de evaluación.
              </p>
            </div>

            <div className="space-y-6">


              <div>
                <h3 className="font-medium text-gray-900 mb-3">Requisitos Identificados</h3>
                <div className="space-y-2">
                  {jobData.requirements.map((requirement, index) => {
                    const isDeleted = deletedRequirements.has(index);
                    return (
                      <div key={index} className={`p-2 bg-gray-50 rounded group ${isDeleted ? 'opacity-50' : ''}`}>
                        <div className="flex items-start gap-2">
                          <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 flex-1">{requirement}</span>
                          <div className="hidden md:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isDeleted ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAddRequirement(index)}
                                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Plus size={12} className="mr-1" />
                                Agregar
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditRequirement(index, requirement)}
                                  className="h-6 px-2 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                                >
                                  <Edit2 size={12} className="mr-1" />
                                  Editar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteRequirement(index)}
                                  className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 size={12} className="mr-1" />
                                  Eliminar
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex md:hidden gap-2 mt-2 ml-6">
                          {isDeleted ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAddRequirement(index)}
                              className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Plus size={12} className="mr-1" />
                              Agregar
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditRequirement(index, requirement)}
                                className="h-6 px-2 text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-100"
                              >
                                <Edit2 size={12} className="mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteRequirement(index)}
                                className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 size={12} className="mr-1" />
                                Eliminar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <Button variant="outline" onClick={() => setStep('prompt')} className="w-full md:w-auto">
                <ArrowLeft size={16} className="mr-2" />
                Volver a Editar
              </Button>
              <Button onClick={handleContinueToCriteria} className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
                Continuar a Criterios
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Requirement Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Requisito</DialogTitle>
              <DialogDescription>
                Modifica el texto del requisito según tus necesidades.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={editingRequirement?.text || ''}
                onChange={(e) => setEditingRequirement(prev => 
                  prev ? { ...prev, text: e.target.value } : null
                )}
                placeholder="Ingresa el requisito..."
                className="min-h-20"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveRequirement} className="bg-green-600 hover:bg-green-700 text-white">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Criterion Modal */}
        <Dialog open={criterionModalOpen} onOpenChange={setCriterionModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Criterio de Evaluación</DialogTitle>
              <DialogDescription>
                Modifica el nombre, peso y descripción del criterio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="criterion-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Criterio
                </label>
                <Input
                  id="criterion-name"
                  value={editingCriterion?.name || ''}
                  onChange={(e) => setEditingCriterion(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                  placeholder="Ej: Experiencia en Cocina Profesional"
                />
              </div>
              <div>
                <label htmlFor="criterion-weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (%)
                </label>
                <Input
                  id="criterion-weight"
                  type="number"
                  min="0"
                  max="100"
                  value={editingCriterion?.weight || ''}
                  onChange={(e) => setEditingCriterion(prev => 
                    prev ? { ...prev, weight: parseInt(e.target.value) || 0 } : null
                  )}
                  placeholder="30"
                />
              </div>
              <div>
                <label htmlFor="criterion-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <Textarea
                  id="criterion-description"
                  value={editingCriterion?.description || ''}
                  onChange={(e) => setEditingCriterion(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  placeholder="Describe qué se evalúa en este criterio..."
                  className="min-h-20"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCriterionModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveCriterion} className="bg-green-600 hover:bg-green-700 text-white">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Killer Criterion Modal */}
        <Dialog open={killerCriterionModalOpen} onOpenChange={setKillerCriterionModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Criterio Eliminatorio</DialogTitle>
              <DialogDescription>
                Modifica la pregunta y el tipo de criterio eliminatorio.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="killer-criterion-question" className="block text-sm font-medium text-gray-700 mb-1">
                  Pregunta
                </label>
                <Textarea
                  id="killer-criterion-question"
                  value={editingKillerCriterion?.question || ''}
                  onChange={(e) => setEditingKillerCriterion(prev => 
                    prev ? { ...prev, question: e.target.value } : null
                  )}
                  placeholder="¿Tienes experiencia previa en el sector gastronómico?"
                  className="min-h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de criterio
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editingKillerCriterion?.required === true}
                      onChange={() => setEditingKillerCriterion(prev => 
                        prev ? { ...prev, required: true } : null
                      )}
                      className="mr-2"
                    />
                    <span className="text-sm">Requerido (obligatorio)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={editingKillerCriterion?.required === false}
                      onChange={() => setEditingKillerCriterion(prev => 
                        prev ? { ...prev, required: false } : null
                      )}
                      className="mr-2"
                    />
                    <span className="text-sm">Recomendado</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setKillerCriterionModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveKillerCriterion} className="bg-green-600 hover:bg-green-700 text-white">
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (step === 'criteria') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {renderStepIndicator()}

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">¿Qué son los criterios de evaluación?</h3>
              <p className="text-sm text-blue-800">
                Estos criterios definen el perfil del candidato ideal y se usan para puntuar automáticamente a los candidatos. 
                Maria utilizará estos criterios para clasificar y recomendar los mejores candidatos para tu puesto.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Criterios Sugeridos</h3>
              <div className="space-y-4">
                {jobData.criteria.map((criterion) => {
                  const isEditing = editingCriterionId === criterion.id;
                  return (
                    <div key={criterion.id} className={`border border-gray-200 rounded-lg p-4 ${deletedCriteria.has(criterion.id) ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between mb-2">
                        {isEditing ? (
                          <Input
                            value={editCriterionValues.name}
                            onChange={(e) => setEditCriterionValues({ ...editCriterionValues, name: e.target.value })}
                            className="font-medium"
                            placeholder="Nombre del criterio"
                          />
                        ) : (
                          <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                        )}
                      </div>
                      {isEditing ? (
                        <Textarea
                          value={editCriterionValues.description}
                          onChange={(e) => setEditCriterionValues({ ...editCriterionValues, description: e.target.value })}
                          className="text-sm mb-4 md:mb-3"
                          placeholder="Descripción del criterio"
                          rows={2}
                        />
                      ) : (
                        <p className="text-sm text-gray-600 mb-4 md:mb-3">{criterion.description}</p>
                      )}
                      <div className="flex flex-col gap-2 md:flex-row md:gap-2">
                        {deletedCriteria.has(criterion.id) ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddCriterion(criterion.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 w-full md:w-auto"
                          >
                            <Plus size={12} className="mr-1" />
                            Agregar
                          </Button>
                        ) : isEditing ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleSaveInlineCriterion}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 w-full md:w-auto"
                            >
                              <Save size={12} className="mr-1" />
                              Guardar
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={handleCancelInlineCriterion}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 w-full md:w-auto"
                            >
                              <X size={12} className="mr-1" />
                              Cancelar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleStartEditCriterion(criterion)} className="w-full md:w-auto">Editar</Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full md:w-auto" onClick={() => handleDeleteCriterion(criterion.id)}>Eliminar</Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <Button variant="outline" onClick={() => setStep('review')} className="w-full md:w-auto">
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </Button>
              <Button onClick={handleContinueToKillerCriteria} className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
                Continuar a Filtros Obligatorios
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'killer-criteria') {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

        <div className="bg-white rounded-lg border border-gray-200 p-8">
          {renderStepIndicator()}

          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-medium text-red-900 mb-2">¿Qué son los filtros obligatorios?</h3>
              <p className="text-sm text-red-800">
                Estos son requisitos mínimos indispensables. Los candidatos que respondan "NO" a cualquiera de estas preguntas 
                serán automáticamente descartados del proceso. Úsalos solo para criterios verdaderamente esenciales.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-4">Preguntas de Filtro</h3>
              <div className="space-y-4">
                {jobData.killerCriteria.map((criterion) => (
                  <div key={criterion.id} className={`border border-gray-200 rounded-lg p-4 ${deletedKillerCriteria.has(criterion.id) ? 'opacity-50' : ''}`}>
                    {editingKillerCriterionId === criterion.id ? (
                      // Edit mode
                      <div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Pregunta</label>
                          <Input
                            value={editKillerValues.question}
                            onChange={(e) => setEditKillerValues({ ...editKillerValues, question: e.target.value })}
                            placeholder="Escribe la pregunta del criterio..."
                            className="w-full"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={editKillerValues.required}
                              onChange={(e) => setEditKillerValues({ ...editKillerValues, required: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm text-gray-700">Respuesta requerida (eliminatorio)</span>
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={handleSaveInlineKillerCriterion}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Guardar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleCancelInlineKillerCriterion}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-1">{criterion.question}</p>
                          <p className="text-sm text-gray-600">
                            {criterion.required ? 'Respuesta requerida: SÍ' : 'Respuesta recomendada: SÍ'}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          {deletedKillerCriteria.has(criterion.id) ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddKillerCriterion(criterion.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                            >
                              <Plus size={12} className="mr-1" />
                              Agregar
                            </Button>
                          ) : (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleStartEditKillerCriterion(criterion)}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteKillerCriterion(criterion.id)}
                              >
                                Eliminar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button variant="outline" className="mt-4">
                + Añadir Pregunta de Filtro
              </Button>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:justify-between">
              <Button variant="outline" onClick={() => setStep('criteria')} className="w-full md:w-auto">
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </Button>
              <Button onClick={handleContinueToPublish} className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto">
                Continuar
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render modals outside of step-specific returns so they're always available
  return (
    <>
      {/* Step-specific content would be rendered here */}
      {step === 'prompt' && (
        <div className="p-6 max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepIndicator()}
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Descripción de la Posición</h2>
                <p className="text-gray-600">
                  Describe el puesto que quieres crear. María, nuestra IA, analizará tu descripción para generar automáticamente criterios de evaluación inteligentes.
                </p>
              </div>

              <div>
                <label htmlFor="position-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Posición
                </label>
                <Input
                  id="position-title"
                  value={positionTitle}
                  onChange={(e) => setPositionTitle(e.target.value)}
                  placeholder="Ej: Camarero/a para Restaurante"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="city-selection-alt" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityPopoverOpen}
                      className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50"
                    >
                      {selectedCity}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                    <Command>
                      <CommandInput placeholder="Buscar ciudad..." className="h-9" />
                      <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                      <CommandGroup>
                        <CommandList className="max-h-60">
                          {spanishCities.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={(currentValue) => {
                                setSelectedCity(currentValue === selectedCity ? "" : currentValue);
                                setCityPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selectedCity === city ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Puesto
                </label>
                <div className="relative">
                  <Textarea
                    id="job-description"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe las responsabilidades, requisitos, experiencia necesaria, horarios, beneficios, etc."
                    className="w-full min-h-48 resize-none pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefineWithAI}
                    disabled={!prompt.trim() || isRefining}
                    className="absolute top-2 right-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    {isRefining ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                        Refinando...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="mr-1" />
                        Refinar con IA
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Lightbulb className="text-amber-600 mr-3 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-medium text-amber-900 mb-2">Consejos para una mejor descripción</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge key={index} variant="secondary" className="text-amber-800 bg-amber-100 border-amber-300">
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft size={16} className="mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleGenerateDescription}
                  disabled={!positionTitle.trim() || !prompt.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Continuar
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'generating' && (
        <div className="p-6 max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepIndicator()}
            
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-gray-900">María está generando tu descripción</h2>
                <p className="text-gray-600">
                  Analizando tu puesto y creando una descripción optimizada para atraer los mejores candidatos
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${generationProgress}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-500">
                  {generationProgress < 30 && "Analizando requisitos del puesto..."}
                  {generationProgress >= 30 && generationProgress < 60 && "Identificando competencias clave..."}
                  {generationProgress >= 60 && generationProgress < 90 && "Optimizando descripción..."}
                  {generationProgress >= 90 && "Finalizando descripción..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="p-6 max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />
          
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepIndicator()}
            
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Revisa la Descripción Generada</h2>
                <p className="text-gray-600">
                  María ha creado una descripción optimizada para tu puesto. Puedes editarla si es necesario.
                </p>
              </div>

              <div>
                <label htmlFor="final-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Título de la Posición
                </label>
                <Input
                  id="final-title"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="city-selection-review" className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={cityPopoverOpen}
                      className="w-full justify-between bg-white border-gray-300 hover:bg-gray-50"
                    >
                      {selectedCity}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
                    <Command>
                      <CommandInput placeholder="Buscar ciudad..." className="h-9" />
                      <CommandEmpty>No se encontró la ciudad.</CommandEmpty>
                      <CommandGroup>
                        <CommandList className="max-h-60">
                          {spanishCities.map((city) => (
                            <CommandItem
                              key={city}
                              value={city}
                              onSelect={(currentValue) => {
                                setSelectedCity(currentValue === selectedCity ? "" : currentValue);
                                setCityPopoverOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selectedCity === city ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              {city}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label htmlFor="final-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Puesto
                </label>
                <Textarea
                  id="final-description"
                  value={jobData.description}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  className="w-full min-h-96"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">Requisitos Identificados por María</h4>
                <p className="text-sm text-green-800 mb-3">
                  María ha identificado estos requisitos clave. Puedes editarlos o eliminar los que no sean relevantes.
                </p>
                <div className="space-y-2">
                  {jobData.requirements.map((requirement, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 bg-white border border-green-200 rounded-lg ${deletedRequirements.has(index) ? 'opacity-50' : ''}`}>
                      <span className="text-sm text-gray-900">{requirement}</span>
                      <div className="flex gap-2">
                        {deletedRequirements.has(index) ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleAddRequirement(index)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                          >
                            <Plus size={12} className="mr-1" />
                            Agregar
                          </Button>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEditRequirement(index, requirement)}>
                              <Edit2 size={12} className="mr-1" />
                              Editar
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteRequirement(index)}>
                              <Trash2 size={12} className="mr-1" />
                              Eliminar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 ${recommendedCriteriaExpanded ? 'block' : 'hidden'}`}>
                  <div className="border-t border-green-200 pt-4">
                    <h5 className="font-medium text-green-900 mb-2">Criterios de Evaluación Sugeridos</h5>
                    <p className="text-sm text-green-800 mb-3">
                      Basado en tu descripción, María sugiere estos criterios para evaluar a los candidatos:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {jobData.criteria.map((criterion) => (
                        <div key={criterion.id} className="p-3 bg-white border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-900">{criterion.name}</span>
                            <Badge variant="secondary" className="text-xs">{criterion.weight}%</Badge>
                          </div>
                          <p className="text-xs text-gray-600">{criterion.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRecommendedCriteriaExpanded(!recommendedCriteriaExpanded)}
                  className="mt-3 text-green-700 hover:text-green-800 hover:bg-green-100"
                >
                  {recommendedCriteriaExpanded ? (
                    <>
                      <ChevronUp size={16} className="mr-1" />
                      Ocultar criterios sugeridos
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} className="mr-1" />
                      Ver criterios sugeridos
                    </>
                  )}
                </Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('prompt')}>
                  <ArrowLeft size={16} className="mr-2" />
                  Volver
                </Button>
                <Button onClick={handleContinueToCriteria} className="bg-green-600 hover:bg-green-700 text-white">
                  Continuar a Criterios de Evaluación
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Edit Requirement Modal */}
          <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Requisito</DialogTitle>
                <DialogDescription>
                  Modifica el texto del requisito identificado por María.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label htmlFor="requirement-text" className="block text-sm font-medium text-gray-700 mb-1">
                    Texto del Requisito
                  </label>
                  <Textarea
                    id="requirement-text"
                    value={editingRequirement?.text || ''}
                    onChange={(e) => setEditingRequirement(prev => 
                      prev ? { ...prev, text: e.target.value } : null
                    )}
                    placeholder="Describe el requisito..."
                    className="min-h-20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveRequirement} className="bg-green-600 hover:bg-green-700 text-white">
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {step === 'criteria' && (
        <div className="p-6 max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepIndicator()}

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">¿Qué son los criterios de evaluación?</h3>
                <p className="text-sm text-blue-800">
                  Estos criterios definen el perfil del candidato ideal y se usan para puntuar automáticamente a los candidatos. 
                  Maria utilizará estos criterios para clasificar y recomendar los mejores candidatos para tu puesto.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Criterios de Evaluación</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobData.criteria.map((criterion) => (
                    <div key={criterion.id} className={`border border-gray-200 rounded-lg p-4 ${deletedCriteria.has(criterion.id) ? 'opacity-50' : ''}`}>
                      {editingCriterionId === criterion.id ? (
                        // Edit mode
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Criterio</label>
                            <Input
                              value={editCriterionValues.name}
                              onChange={(e) => setEditCriterionValues({ ...editCriterionValues, name: e.target.value })}
                              placeholder="Ej: Experiencia en Cocina Profesional"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (%)</label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={editCriterionValues.weight}
                              onChange={(e) => setEditCriterionValues({ ...editCriterionValues, weight: parseInt(e.target.value) || 0 })}
                              placeholder="30"
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <Textarea
                              value={editCriterionValues.description}
                              onChange={(e) => setEditCriterionValues({ ...editCriterionValues, description: e.target.value })}
                              placeholder="Describe qué se evalúa..."
                              className="min-h-16 resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={handleSaveInlineCriterion}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Guardar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleCancelInlineCriterion}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                            <Badge variant="secondary" className="text-xs">{criterion.weight}%</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{criterion.description}</p>
                          <div className="flex gap-2">
                            {deletedCriteria.has(criterion.id) ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddCriterion(criterion.id)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                              >
                                <Plus size={12} className="mr-1" />
                                Agregar
                              </Button>
                            ) : (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleStartEditCriterion(criterion)}
                                >
                                  Editar
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteCriterion(criterion.id)}
                                >
                                  Eliminar
                                </Button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('review')}>
                  <ArrowLeft size={16} className="mr-2" />
                  Volver
                </Button>
                <Button onClick={handleContinueToKillerCriteria} className="bg-green-600 hover:bg-green-700 text-white">
                  Continuar a Filtros Obligatorios
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'killer-criteria' && (
        <div className="p-6 max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepIndicator()}

            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-medium text-red-900 mb-2">¿Qué son los filtros obligatorios?</h3>
                <p className="text-sm text-red-800">
                  Estos criterios eliminan automáticamente a candidatos que no cumplan con requisitos fundamentales. 
                  Solo define criterios que sean absolutamente necesarios para el puesto.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Filtros Obligatorios</h2>
                <div className="space-y-4">
                  {jobData.killerCriteria.map((criterion) => (
                    <div key={criterion.id} className={`border border-gray-200 rounded-lg p-4 ${deletedKillerCriteria.has(criterion.id) ? 'opacity-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{criterion.question}</p>
                          <Badge 
                            variant={criterion.required ? "destructive" : "secondary"}
                            className={criterion.required ? "bg-red-100 text-red-700 border-red-200" : "bg-orange-100 text-orange-700 border-orange-200"}
                          >
                            {criterion.required ? "Obligatorio" : "Recomendado"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          {deletedKillerCriteria.has(criterion.id) ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddKillerCriterion(criterion.id)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                            >
                              <Plus size={12} className="mr-1" />
                              Agregar
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEditKillerCriterion(criterion)}>Editar</Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteKillerCriterion(criterion.id)}>Eliminar</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('criteria')}>
                  <ArrowLeft size={16} className="mr-2" />
                  Volver
                </Button>
                <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white">
                  Crear Posición
                  <CheckCircle size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'publish' && (
        <div className="p-6 max-w-6xl mx-auto">
          <Breadcrumb items={getBreadcrumbItems()} onBack={onBack} />

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {renderStepIndicator()}

            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-xl font-medium text-gray-900 mb-1">Publicar Puesto</h1>
                <p className="text-gray-600">
                  Elegid dónde publicar vuestro puesto
                </p>
              </div>

              <div className="space-y-4">
                {/* Plataforma Orbio - Always selected */}
                <div className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedPlatforms.has('orbio') 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">O</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Plataforma Orbio</h3>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlatforms.has('orbio') 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPlatforms.has('orbio') && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Infojobs - Selectable */}
                <div className={`border-2 rounded-lg p-4 transition-colors ${
                  selectedPlatforms.has('infojobs') 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3" onClick={() => handlePlatformToggle('infojobs')} style={{ cursor: 'pointer' }}>
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">i</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Infojobs</h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDataReview('infojobs');
                        }}
                        className="text-sm"
                      >
                        Revisar Datos
                      </Button>
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          selectedPlatforms.has('infojobs') 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300'
                        }`}
                        onClick={() => handlePlatformToggle('infojobs')}
                      >
                        {selectedPlatforms.has('infojobs') && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* LinkedIn - Selectable */}
                <div className={`border-2 rounded-lg p-4 transition-colors ${
                  selectedPlatforms.has('linkedin') 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3" onClick={() => handlePlatformToggle('linkedin')} style={{ cursor: 'pointer' }}>
                      <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                        <span className="text-white text-xs font-bold">in</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">LinkedIn</h3>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDataReview('linkedin');
                        }}
                        className="text-sm"
                      >
                        Revisar Datos
                      </Button>
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                          selectedPlatforms.has('linkedin') 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-gray-300'
                        }`}
                        onClick={() => handlePlatformToggle('linkedin')}
                      >
                        {selectedPlatforms.has('linkedin') && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:flex-row md:justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('killer-criteria')} className="w-full md:w-auto">
                  Volver a Requisitos
                </Button>
                <Button 
                  onClick={handleComplete} 
                  className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
                  disabled={selectedPlatforms.size === 0}
                >
                  Publicar Puesto
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Criterion Modal - Always available */}
      <Dialog open={criterionModalOpen} onOpenChange={setCriterionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Criterio de Evaluación</DialogTitle>
            <DialogDescription>
              Modifica el nombre, peso y descripción del criterio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="criterion-name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Criterio
              </label>
              <Input
                id="criterion-name"
                value={editingCriterion?.name || ''}
                onChange={(e) => setEditingCriterion(prev => 
                  prev ? { ...prev, name: e.target.value } : null
                )}
                placeholder="Ej: Experiencia en Cocina Profesional"
              />
            </div>
            <div>
              <label htmlFor="criterion-weight" className="block text-sm font-medium text-gray-700 mb-1">
                Peso (%)
              </label>
              <Input
                id="criterion-weight"
                type="number"
                min="0"
                max="100"
                value={editingCriterion?.weight || ''}
                onChange={(e) => setEditingCriterion(prev => 
                  prev ? { ...prev, weight: parseInt(e.target.value) || 0 } : null
                )}
                placeholder="30"
              />
            </div>
            <div>
              <label htmlFor="criterion-description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Textarea
                id="criterion-description"
                value={editingCriterion?.description || ''}
                onChange={(e) => setEditingCriterion(prev => 
                  prev ? { ...prev, description: e.target.value } : null
                )}
                placeholder="Describe qué se evalúa en este criterio..."
                className="min-h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCriterionModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveCriterion} className="bg-green-600 hover:bg-green-700 text-white">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Killer Criterion Modal - Always available */}
      <Dialog open={killerCriterionModalOpen} onOpenChange={setKillerCriterionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Criterio Eliminatorio</DialogTitle>
            <DialogDescription>
              Modifica la pregunta y el tipo de criterio eliminatorio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="killer-criterion-question" className="block text-sm font-medium text-gray-700 mb-1">
                Pregunta
              </label>
              <Textarea
                id="killer-criterion-question"
                value={editingKillerCriterion?.question || ''}
                onChange={(e) => setEditingKillerCriterion(prev => 
                  prev ? { ...prev, question: e.target.value } : null
                )}
                placeholder="¿Tienes experiencia previa en el sector gastronómico?"
                className="min-h-20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de criterio
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={editingKillerCriterion?.required === true}
                    onChange={() => setEditingKillerCriterion(prev => 
                      prev ? { ...prev, required: true } : null
                    )}
                    className="mr-2"
                  />
                  <span className="text-sm">Requerido (obligatorio)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={editingKillerCriterion?.required === false}
                    onChange={() => setEditingKillerCriterion(prev => 
                      prev ? { ...prev, required: false } : null
                    )}
                    className="mr-2"
                  />
                  <span className="text-sm">Recomendado</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setKillerCriterionModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveKillerCriterion} className="bg-green-600 hover:bg-green-700 text-white">
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Review Modal */}
      <Dialog open={showDataReviewModal} onOpenChange={setShowDataReviewModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${
                reviewPlatform === 'infojobs' ? 'bg-blue-600' : 'bg-blue-700'
              }`}>
                <span className="text-white text-xs font-bold">
                  {reviewPlatform === 'infojobs' ? 'i' : 'in'}
                </span>
              </div>
              <DialogTitle className="capitalize">{reviewPlatform}</DialogTitle>
            </div>
            <DialogDescription>
              Revisa y actualiza los datos de tu oferta antes de publicar en {reviewPlatform === 'infojobs' ? 'InfoJobs' : 'LinkedIn'}.
            </DialogDescription>
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-700">Campos listos para revisión</span>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 max-h-96 overflow-y-auto">
            <div className="text-sm font-medium text-gray-900 mb-4">Required fields</div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <Input defaultValue="Madrid" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract type <span className="text-red-500">*</span>
                </label>
                <Select defaultValue="Indefinido">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indefinido">Indefinido</SelectItem>
                    <SelectItem value="Temporal">Temporal</SelectItem>
                    <SelectItem value="Formativo">Formativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <Select defaultValue="España">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="España">España</SelectItem>
                    <SelectItem value="Francia">Francia</SelectItem>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <Select defaultValue="A Coruña">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A Coruña">A Coruña</SelectItem>
                    <SelectItem value="Madrid">Madrid</SelectItem>
                    <SelectItem value="Barcelona">Barcelona</SelectItem>
                    <SelectItem value="Valencia">Valencia</SelectItem>
                    <SelectItem value="Sevilla">Sevilla</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum experience <span className="text-red-500">*</span>
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin-experiencia">Sin experiencia</SelectItem>
                    <SelectItem value="menos-1-ano">Menos de 1 año</SelectItem>
                    <SelectItem value="1-2-anos">1-2 años</SelectItem>
                    <SelectItem value="2-5-anos">2-5 años</SelectItem>
                    <SelectItem value="mas-5-anos">Más de 5 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of vacancies <span className="text-red-500">*</span>
                </label>
                <Input defaultValue="1" type="number" min="1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary per <span className="text-red-500">*</span>
                </label>
                <Select defaultValue="Bruto/mes">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bruto/mes">Bruto/mes</SelectItem>
                    <SelectItem value="Neto/mes">Neto/mes</SelectItem>
                    <SelectItem value="Bruto/ano">Bruto/año</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary from <span className="text-red-500">*</span>
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">1.000€</SelectItem>
                    <SelectItem value="1500">1.500€</SelectItem>
                    <SelectItem value="2000">2.000€</SelectItem>
                    <SelectItem value="2500">2.500€</SelectItem>
                    <SelectItem value="3000">3.000€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary to <span className="text-red-500">*</span>
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2000">2.000€</SelectItem>
                    <SelectItem value="2500">2.500€</SelectItem>
                    <SelectItem value="3000">3.000€</SelectItem>
                    <SelectItem value="3500">3.500€</SelectItem>
                    <SelectItem value="4000">4.000€</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working day <span className="text-red-500">*</span>
                </label>
                <Select defaultValue="Completa">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Completa">Completa</SelectItem>
                    <SelectItem value="Parcial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDataReviewModal(false)}>
              Cerrar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Actualizar Datos
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}