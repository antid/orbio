import { ArrowLeft, MapPin, Calendar, Users, Edit2, Award, AlertTriangle, Pause, XCircle, Archive } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';

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

interface DetailedPosition {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'active' | 'draft' | 'paused';
  candidates: number;
  description: string;
  requirements: string[];
  criteria: EvaluationCriterion[];
  killerCriteria: KillerCriterion[];
}

interface PositionDetailPageProps {
  position: DetailedPosition;
  onBack: () => void;
  onEdit?: () => void;
}

export function PositionDetailPage({ position, onBack, onEdit }: PositionDetailPageProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'ACTIVA';
      case 'draft':
        return 'BORRADOR';
      case 'paused':
        return 'PAUSADA';
      case 'closed':
        return 'CERRADA';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-gray-100"
          >
            <ArrowLeft size={16} />
            Volver a Posiciones
          </Button>
        </div>
        {onEdit && (
          <Button
            onClick={onEdit}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Edit2 size={16} />
            Editar Posición
          </Button>
        )}
      </div>

      {/* Position Header Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">{position.title}</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {position.location}
              </div>
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                Creada el {position.date}
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                {position.candidates} candidato{position.candidates !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(position.status)} border-0 uppercase self-start md:self-auto`}>
            {getStatusText(position.status)}
          </Badge>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Descripción del Puesto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {position.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {position.requirements && position.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requisitos Identificados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {position.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm leading-relaxed">{requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Contrato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Tipo de Contrato</h4>
                  <p className="text-gray-600">{position.contractType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Salario</h4>
                  <p className="text-gray-600">{position.salary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Criteria */}
          {position.criteria && position.criteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award size={18} />
                  Criterios de Evaluación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {position.criteria.map((criterion) => (
                    <div key={criterion.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{criterion.name}</h4>

                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {criterion.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Killer Criteria */}
          {position.killerCriteria && position.killerCriteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Criterios Eliminatorios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {position.killerCriteria.map((criterion) => (
                    <div key={criterion.id} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium text-sm leading-relaxed">
                            {criterion.question}
                          </p>
                          <div className="mt-2">
                            <Badge 
                              variant={criterion.required ? "destructive" : "secondary"}
                              className="text-xs"
                            >
                              {criterion.required ? 'Obligatorio' : 'Opcional'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Position Actions - Always visible */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones de Posición</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                >
                  <Pause size={16} />
                  Pausar Posición
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle size={16} />
                  Cerrar Posición
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2 text-gray-600 border-gray-200 hover:bg-gray-50"
                >
                  <Archive size={16} />
                  Archivar Posición
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}