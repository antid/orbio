import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { X, Lightbulb, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface JobCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function JobCreationModal({ isOpen, onClose, onComplete }: JobCreationModalProps) {
  const [step, setStep] = useState<'prompt' | 'generating' | 'review' | 'criteria' | 'killer-criteria'>('prompt');
  const [prompt, setPrompt] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: [] as string[],
    criteria: [] as Array<{ id: string; name: string; weight: number; description: string }>,
    killerCriteria: [] as Array<{ id: string; question: string; required: boolean }>
  });

  const suggestions = [
    'Consejos',
    'Incluye competencias requeridas',
    'Especifica nivel de experiencia',
    'Menciona beneficios'
  ];

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

  const handleComplete = () => {
    onComplete();
    onClose();
    setStep('prompt');
    setPrompt('');
    setGenerationProgress(0);
  };

  const getStepNumber = () => {
    switch (step) {
      case 'prompt': return 1;
      case 'generating': return 2;
      case 'review': return 3;
      case 'criteria': return 4;
      case 'killer-criteria': return 5;
      default: return 1;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-8">
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            num <= getStepNumber() 
              ? 'bg-green-100 text-green-800 border-2 border-green-500' 
              : 'bg-gray-100 text-gray-500'
          }`}>
            {num < getStepNumber() ? <CheckCircle size={16} className="text-green-600" /> : num}
          </div>
          {num < 5 && (
            <div className={`w-8 h-0.5 ${
              num < getStepNumber() ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  if (step === 'prompt') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Describe tu Puesto
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </DialogTitle>
            <DialogDescription>
              Cuéntanos sobre el rol que buscas para generar una oferta de empleo personalizada
            </DialogDescription>
          </DialogHeader>

          {renderStepIndicator()}

          <div className="space-y-6">
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="text-green-600" size={24} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Cuéntanos sobre el rol que buscas</h3>
                <p className="text-sm text-gray-600">Cuéntanos sobre el rol que buscas</p>
              </div>

              <Textarea
                placeholder="Describe el puesto que quieres crear. Incluye detalles sobre responsabilidades, requisitos, competencias necesarias, nivel de experiencia y cualquier otra información relevante..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-none"
              />

              <div className="flex items-center gap-2 mt-4">
                <Lightbulb size={16} className="text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handlePromptSubmit}
                disabled={!prompt.trim()}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Generar Oferta de Empleo
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'generating') {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generando vuestro Puesto</DialogTitle>
          </DialogHeader>

          {renderStepIndicator()}

          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Generando vuestro Puesto</h3>
              <p className="text-sm text-gray-600 mb-4">Generando oferta de empleo...</p>
              
              <Progress value={generationProgress} className="w-full max-w-md mx-auto" />
            </div>

            <div className="flex justify-center gap-8 text-sm">
              <div className={`flex items-center gap-2 ${generationProgress >= 33 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded ${generationProgress >= 33 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                Analizando descripción...
              </div>
              <div className={`flex items-center gap-2 ${generationProgress >= 66 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded ${generationProgress >= 66 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                Generando oferta de empleo...
              </div>
              <div className={`flex items-center gap-2 ${generationProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded ${generationProgress >= 100 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                Finalizando mejoras
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'review') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Revisión de la Oferta
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </DialogTitle>
          </DialogHeader>

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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Información del Puesto</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Título</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border">
                      {jobData.title}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Descripción</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded border h-40 overflow-y-auto text-sm">
                      {jobData.description}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Requisitos Identificados</h3>
                <div className="space-y-2">
                  {jobData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                      <CheckCircle size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('prompt')}>
                Volver a Editar
              </Button>
              <Button onClick={handleContinueToCriteria} className="bg-green-600 hover:bg-green-700 text-white">
                Continuar a Criterios
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'criteria') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Criterios de Evaluación
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </DialogTitle>
          </DialogHeader>

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
                {jobData.criteria.map((criterion) => (
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                      <Badge variant="secondary">{criterion.weight}% peso</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{criterion.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Eliminar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('review')}>
                Volver
              </Button>
              <Button onClick={handleContinueToKillerCriteria} className="bg-green-600 hover:bg-green-700 text-white">
                Continuar a Filtros Obligatorios
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (step === 'killer-criteria') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Filtros Obligatorios (Killer Criteria)
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={16} />
              </Button>
            </DialogTitle>
          </DialogHeader>

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
                  <div key={criterion.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-1">{criterion.question}</p>
                        <p className="text-sm text-gray-600">
                          {criterion.required ? 'Respuesta requerida: SÍ' : 'Respuesta recomendada: SÍ'}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="ghost" size="sm" className="text-red-600">Eliminar</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="mt-4">
                + Añadir Pregunta de Filtro
              </Button>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('criteria')}>
                Volver
              </Button>
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700 text-white">
                Crear Posición
                <CheckCircle size={16} className="ml-2" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}