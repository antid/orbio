import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PositionsList } from './components/PositionsList';
import { JobCreationPage } from './components/JobCreationPage';
import { PositionDetailPage } from './components/PositionDetailPage';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

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

interface Position {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'active' | 'draft' | 'paused' | 'closed';
  candidates: number;
  description: string;
  requirements: string[];
  criteria: EvaluationCriterion[];
  killerCriteria: KillerCriterion[];
  contractType: string;
  salary: string;
}

interface NewPositionData {
  title: string;
  description: string;
  location?: string;
  requirements: string[];
  criteria: EvaluationCriterion[];
  killerCriteria: KillerCriterion[];
  contractType: string;
  salary: string;
}

export default function App() {
  const [currentSection, setCurrentSection] = useState('positions');
  const [showJobCreation, setShowJobCreation] = useState(false);
  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userSidebarCollapsed, setUserSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      title: 'Cocinero/a (40 horas turnos rotativos)',
      location: 'Barcelona',
      date: '02/03/2025',
      status: 'active',
      candidates: 64,
      description: 'Buscamos un cocinero/a con experiencia para trabajar en nuestro restaurante con turnos rotativos de 40 horas semanales. El candidato ideal debe tener pasión por la cocina mediterránea y capacidad para trabajar en equipo.',
      requirements: [
        'Experiencia mínima de 2 años en cocina profesional',
        'Conocimiento de técnicas de cocina mediterránea',
        'Disponibilidad para turnos rotativos',
        'Capacidad de trabajo en equipo'
      ],
      contractType: 'Indefinido',
      salary: '1.800€/mes',
      criteria: [
        {
          id: 'exp-cocina',
          name: 'Experiencia en Cocina',
          weight: 40,
          description: 'Años de experiencia trabajando en cocinas profesionales'
        },
        {
          id: 'tecnicas',
          name: 'Técnicas Culinarias',
          weight: 30,
          description: 'Conocimiento y dominio de técnicas básicas y avanzadas'
        },
        {
          id: 'trabajo-equipo',
          name: 'Trabajo en Equipo',
          weight: 30,
          description: 'Capacidad para colaborar efectivamente con el equipo de cocina'
        }
      ],
      killerCriteria: [
        {
          id: 'disponibilidad',
          question: '¿Tienes disponibilidad para trabajar turnos rotativos incluyendo fines de semana?',
          required: true
        },
        {
          id: 'experiencia-min',
          question: '¿Tienes al menos 2 años de experiencia en cocina profesional?',
          required: true
        }
      ]
    },
    {
      id: '2',
      title: 'Camarero/a (30 horas semanales/turnos rotativos)',
      location: 'Barcelona',
      date: '28/02/2025',
      status: 'active',
      candidates: 302,
      description: 'Necesitamos camarero/a para trabajar 30 horas semanales en turnos rotativos. Buscamos una persona con excelentes habilidades de atención al cliente y experiencia en el sector de la restauración.',
      requirements: [
        'Experiencia previa como camarero/a',
        'Excelentes habilidades de comunicación',
        'Disponibilidad para turnos rotativos',
        'Conocimiento básico de vinos y carta de bebidas'
      ],
      contractType: 'Tiempo Parcial',
      salary: '1.200€/mes',
      criteria: [
        {
          id: 'atencion-cliente',
          name: 'Atención al Cliente',
          weight: 50,
          description: 'Habilidad para brindar un servicio excepcional a los clientes'
        },
        {
          id: 'experiencia-servicio',
          name: 'Experiencia en Servicio',
          weight: 30,
          description: 'Años de experiencia trabajando en restaurantes o bares'
        },
        {
          id: 'conocimiento-bebidas',
          name: 'Conocimiento de Bebidas',
          weight: 20,
          description: 'Conocimiento de vinos, cócteles y otras bebidas'
        }
      ],
      killerCriteria: [
        {
          id: 'disponibilidad-turnos',
          question: '¿Puedes trabajar turnos rotativos incluyendo noches y fines de semana?',
          required: true
        }
      ]
    },
    {
      id: '3',
      title: 'Camarero (Barcelona)',
      location: 'Barcelona',
      date: '01/03/2025',
      status: 'active',
      candidates: 4,
      description: 'Posición de camarero para restaurante en el centro de Barcelona. Buscamos profesionales con experiencia y ganas de formar parte de nuestro equipo.',
      requirements: [
        'Experiencia mínima de 1 año como camarero',
        'Buena presencia y trato al cliente',
        'Conocimientos básicos de inglés'
      ],
      contractType: 'Indefinido',
      salary: '1.600€/mes',
      criteria: [
        {
          id: 'experiencia',
          name: 'Experiencia',
          weight: 60,
          description: 'Experiencia previa en el sector'
        },
        {
          id: 'idiomas',
          name: 'Idiomas',
          weight: 40,
          description: 'Nivel de inglés y otros idiomas'
        }
      ],
      killerCriteria: [
        {
          id: 'experiencia-minima',
          question: '¿Tienes al menos 1 año de experiencia como camarero?',
          required: true
        }
      ]
    },
    {
      id: '4',
      title: 'Prueba Camarero/a',
      location: 'Barcelona',
      date: '19/07/2025',
      status: 'active',
      candidates: 0,
      description: 'Esta es una posición de prueba para validar el proceso de selección.',
      requirements: ['Disponibilidad inmediata', 'Actitud positiva'],
      contractType: 'Temporal',
      salary: '1.400€/mes',
      criteria: [
        {
          id: 'actitud',
          name: 'Actitud',
          weight: 100,
          description: 'Actitud positiva y ganas de aprender'
        }
      ],
      killerCriteria: []
    },
    {
      id: '5',
      title: 'Hostess/Maître (Turno Noche)',
      location: 'Madrid',
      date: '15/02/2025',
      status: 'paused',
      candidates: 23,
      description: 'Buscamos hostess/maître con experiencia en restauración para turno de noche. La posición requiere manejo de reservas, coordinación de mesas y atención al cliente en restaurante de alta gama.',
      requirements: [
        'Experiencia mínima de 1 año como hostess o maître',
        'Conocimiento de sistemas de reservas (OpenTable, etc.)',
        'Disponibilidad para turno de noche',
        'Nivel intermedio de inglés',
        'Excelente presencia y habilidades de comunicación'
      ],
      contractType: 'Indefinido',
      salary: '2.200€/mes',
      criteria: [
        {
          id: 'exp-restauracion',
          name: 'Experiencia en Restauración',
          weight: 45,
          description: 'Años de experiencia trabajando como hostess o maître en restaurantes'
        },
        {
          id: 'sistemas-reservas',
          name: 'Manejo de Sistemas de Reservas',
          weight: 35,
          description: 'Conocimiento de sistemas de gestión de reservas y coordinación de mesas'
        },
        {
          id: 'idiomas-restaurante',
          name: 'Competencias Lingüísticas',
          weight: 20,
          description: 'Nivel de inglés y otros idiomas para atención a clientela internacional'
        }
      ],
      killerCriteria: [
        {
          id: 'turno-noche',
          question: '¿Tienes disponibilidad para trabajar turno de noche hasta cierre del restaurante?',
          required: true
        },
        {
          id: 'exp-hostess',
          question: '¿Tienes experiencia previa como hostess o maître en restaurantes?',
          required: true
        }
      ]
    },
    {
      id: '6',
      title: 'Sous Chef',
      location: 'Valencia',
      date: '10/02/2025',
      status: 'closed',
      candidates: 156,
      description: 'Posición cerrada. Se buscaba sous chef con experiencia en cocina mediterránea para restaurante de alta gama. La posición ha sido cubierta exitosamente.',
      requirements: [
        'Titulación en Gastronomía o experiencia equivalente',
        'Especialización en cocina mediterránea',
        'Certificado de manipulador de alimentos vigente',
        'Experiencia mínima de 3 años como jefe de partida o sous chef'
      ],
      contractType: 'Indefinido',
      salary: '2.800€/mes',
      criteria: [
        {
          id: 'especializacion-mediterranea',
          name: 'Especialización Mediterránea',
          weight: 50,
          description: 'Formación específica y experiencia en cocina mediterránea'
        },
        {
          id: 'experiencia-profesional',
          name: 'Experiencia en Cocina Profesional',
          weight: 30,
          description: 'Años de experiencia en cocinas de restaurante de alto nivel'
        },
        {
          id: 'liderazgo-cocina',
          name: 'Liderazgo en Cocina',
          weight: 20,
          description: 'Habilidades para liderar equipos de cocina y coordinar brigada'
        }
      ],
      killerCriteria: [
        {
          id: 'certificado-manipulador',
          question: '¿Tienes el certificado de manipulador de alimentos vigente?',
          required: true
        },
        {
          id: 'experiencia-sous-chef',
          question: '¿Tienes experiencia específica como sous chef o jefe de partida?',
          required: true
        }
      ]
    },
    {
      id: '7',
      title: 'Auxiliar de Limpieza (Restaurantes)',
      location: 'Sevilla',
      date: '05/02/2025',
      status: 'paused',
      candidates: 89,
      description: 'Posición pausada temporalmente. Buscamos auxiliar de limpieza para trabajar en cadena de restaurantes con protocolos específicos de higiene alimentaria y desinfección.',
      requirements: [
        'Experiencia en limpieza de restaurantes o establecimientos alimentarios',
        'Conocimiento de protocolos APPCC y desinfección',
        'Disponibilidad para turnos rotativos',
        'Certificado de manipulador de alimentos obligatorio'
      ],
      contractType: 'Tiempo Parcial',
      salary: '1.100€/mes',
      criteria: [
        {
          id: 'exp-restaurantes',
          name: 'Experiencia en Restauración',
          weight: 60,
          description: 'Experiencia previa en limpieza de restaurantes o establecimientos alimentarios'
        },
        {
          id: 'protocolos-appcc',
          name: 'Conocimiento de Protocolos APPCC',
          weight: 40,
          description: 'Conocimiento de protocolos de limpieza e higiene alimentaria'
        }
      ],
      killerCriteria: [
        {
          id: 'disponibilidad-turnos-limpieza',
          question: '¿Tienes disponibilidad para trabajar turnos rotativos incluyendo fines de semana?',
          required: true
        },
        {
          id: 'certificado-manipulador-obligatorio',
          question: '¿Tienes el certificado de manipulador de alimentos vigente?',
          required: true
        }
      ]
    },
    {
      id: '8',
      title: 'Chef de Partida - Parrilla',
      location: 'Bilbao',
      date: '28/01/2025',
      status: 'closed',
      candidates: 45,
      description: 'Posición cerrada. Se necesitaba chef especializado en parrilla para restaurante de alta gama. La posición fue cubierta satisfactoriamente.',
      requirements: [
        'Experiencia mínima de 4 años en parrilla',
        'Conocimiento de cortes de carne premium',
        'Experiencia en restaurantes de alta gama',
        'Formación culinaria formal'
      ],
      contractType: 'Indefinido',
      salary: '2.500€/mes',
      criteria: [
        {
          id: 'especialidad-parrilla',
          name: 'Especialidad en Parrilla',
          weight: 50,
          description: 'Dominio técnico de cocción en parrilla y manejo de temperaturas'
        },
        {
          id: 'conocimiento-carnes',
          name: 'Conocimiento de Carnes',
          weight: 30,
          description: 'Conocimiento profundo de cortes, maduración y calidades de carne'
        },
        {
          id: 'experiencia-alta-gama',
          name: 'Experiencia en Alta Gastronomía',
          weight: 20,
          description: 'Experiencia previa en restaurantes de alto nivel'
        }
      ],
      killerCriteria: [
        {
          id: 'exp-parrilla-minima',
          question: '¿Tienes al menos 4 años de experiencia específica en parrilla?',
          required: true
        }
      ]
    },
    {
      id: '9',
      title: 'Sommelier',
      location: 'Barcelona',
      date: '20/01/2025',
      status: 'active',
      candidates: 12,
      description: 'Buscamos sommelier especializado en vinos españoles para restaurante de alta gastronomía. Trabajo en equipo multidisciplinar con chef ejecutivo y equipo de sala.',
      requirements: [
        'Certificación como Sommelier',
        'Conocimiento profundo de vinos españoles',
        'Experiencia en restaurantes de alta gama',
        'Habilidades de maridaje y asesoramiento al cliente'
      ],
      contractType: 'Indefinido',
      salary: '3.200€/mes',
      criteria: [
        {
          id: 'conocimiento-vinos',
          name: 'Conocimiento de Vinos',
          weight: 40,
          description: 'Años de experiencia y conocimiento profundo en enología y viticultura'
        },
        {
          id: 'tecnicas-maridaje',
          name: 'Técnicas de Maridaje',
          weight: 35,
          description: 'Dominio de técnicas de maridaje y asesoramiento gastronómico'
        },
        {
          id: 'trabajo-equipo-restaurante',
          name: 'Trabajo en Equipo de Restaurante',
          weight: 25,
          description: 'Capacidad para trabajar con equipos de cocina y sala'
        }
      ],
      killerCriteria: [
        {
          id: 'certificacion-sommelier',
          question: '¿Tienes certificación oficial como sommelier?',
          required: true
        },
        {
          id: 'exp-restaurante-gama-alta',
          question: '¿Tienes experiencia previa trabajando en restaurantes de alta gama?',
          required: true
        }
      ]
    },
    {
      id: '10',
      title: 'Barista - Cafetería Especializada',
      location: 'Madrid',
      date: '12/01/2025',
      status: 'paused',
      candidates: 67,
      description: 'Posición pausada. Buscamos barista experimentado para cafetería especializada en café de origen. Se requiere conocimiento avanzado de métodos de extracción.',
      requirements: [
        'Experiencia mínima de 2 años como barista',
        'Conocimiento de métodos de extracción (V60, Chemex, Aeropress)',
        'Experiencia con máquinas espresso profesionales',
        'Pasión por el café de especialidad'
      ],
      contractType: 'Indefinido',
      salary: '1.900€/mes',
      criteria: [
        {
          id: 'tecnicas-extraccion',
          name: 'Técnicas de Extracción',
          weight: 45,
          description: 'Dominio de diferentes métodos de preparación de café'
        },
        {
          id: 'conocimiento-cafe',
          name: 'Conocimiento del Café',
          weight: 35,
          description: 'Conocimiento sobre orígenes, tueste y características del café'
        },
        {
          id: 'atencion-cliente-barista',
          name: 'Atención al Cliente Especializada',
          weight: 20,
          description: 'Capacidad para educar y asesorar clientes sobre café'
        }
      ],
      killerCriteria: [
        {
          id: 'exp-barista-especializado',
          question: '¿Tienes experiencia con métodos de extracción manual (V60, Chemex, etc.)?',
          required: true
        }
      ]
    }
  ]);
  const [newPositionData, setNewPositionData] = useState<NewPositionData | null>(null);

  const handleCreatePosition = () => {
    setShowJobCreation(true);
  };

  const handleJobCreationComplete = (positionData: NewPositionData) => {
    // Create new position with generated ID and current date
    const newPosition: Position = {
      id: Date.now().toString(),
      title: positionData.title,
      location: positionData.location || 'Barcelona',
      date: new Date().toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      }),
      status: 'active',
      candidates: 0,
      description: positionData.description,
      requirements: positionData.requirements,
      criteria: positionData.criteria,
      killerCriteria: positionData.killerCriteria,
      contractType: positionData.contractType,
      salary: positionData.salary
    };

    // Add to positions list
    setPositions(prev => [newPosition, ...prev]);
    setNewPositionData(positionData);
    setShowJobCreation(false);
  };

  const handleBackToPositions = () => {
    setShowJobCreation(false);
    setSelectedPositionId(null);
  };

  const handlePositionClick = (positionId: string) => {
    setSelectedPositionId(positionId);
  };

  const handleBackFromDetail = () => {
    setSelectedPositionId(null);
  };

  const handleNavigateToPositions = () => {
    setCurrentSection('positions');
    setShowJobCreation(false);
    setSelectedPositionId(null);
  };

  // Show toast when returning to positions after creating a new one
  useEffect(() => {
    if (!showJobCreation && newPositionData) {
      toast(`✅ Posición "${newPositionData.title}" creada exitosamente`, {
        description: `La posición ha sido añadida y está activa. Lista para recibir candidatos.`,
        duration: 5000,
      });
      setNewPositionData(null);
    }
  }, [showJobCreation, newPositionData]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsedState);
    // Only update user preference if not in job creation mode and not on mobile
    if (!showJobCreation && !isMobile) {
      setUserSidebarCollapsed(newCollapsedState);
    }
  };

  // Auto-collapse sidebar during job creation, mobile screens, or restore user preference
  useEffect(() => {
    if (showJobCreation || isMobile) {
      setSidebarCollapsed(true);
    } else {
      setSidebarCollapsed(userSidebarCollapsed);
    }
  }, [showJobCreation, userSidebarCollapsed, isMobile]);

  const renderContent = () => {
    if (showJobCreation) {
      return (
        <JobCreationPage
          onBack={handleBackToPositions}
          onComplete={handleJobCreationComplete}
        />
      );
    }

    if (selectedPositionId) {
      const selectedPosition = positions.find(p => p.id === selectedPositionId);
      if (selectedPosition) {
        return (
          <PositionDetailPage
            position={selectedPosition}
            onBack={handleBackFromDetail}
          />
        );
      }
    }

    switch (currentSection) {
      case 'positions':
        return (
          <PositionsList 
            positions={positions} 
            onCreatePosition={handleCreatePosition}
            onPositionClick={handlePositionClick}
          />
        );
      case 'candidates':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Candidatos</h1>
            <p className="text-gray-600 mt-2">Gestiona tus candidatos aquí.</p>
          </div>
        );
      case 'metrics':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Métricas</h1>
            <p className="text-gray-600 mt-2">Visualiza las métricas de reclutamiento.</p>
          </div>
        );
      case 'config':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
            <p className="text-gray-600 mt-2">Ajusta la configuración de tu cuenta.</p>
          </div>
        );
      default:
        return (
          <PositionsList 
            positions={positions} 
            onCreatePosition={handleCreatePosition}
            onPositionClick={handlePositionClick}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">

      
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection}
        onNavigateToPositions={handleNavigateToPositions}
        collapsed={sidebarCollapsed}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-200 ${
        isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
      }`}>        
        <div className="max-w-[1280px] mx-auto">
          {renderContent()}
        </div>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            opacity: 1,
            background: 'white',
            color: '#000000',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
          },
          descriptionStyle: {
            color: '#000000',
            opacity: 1
          },
          className: 'toast-all-black'
        }}
      />
    </div>
  );
}