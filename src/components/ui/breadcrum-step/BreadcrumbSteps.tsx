import { cn } from '@/lib/utils';

interface StepProps {
  pasoActual: number;
}

const pasos = ['Datos del paciente', 'Pago','Recibo de pago'];

export default function BreadcrumbSteps({ pasoActual }: StepProps) {
  return (
    <div className="flex justify-center items-center mb-3 gap-2 sm:gap-4">
      {pasos.map((paso, index) => {
        const isActive = index === pasoActual;
        const isCompleted = index < pasoActual;

        return (
          <div key={index} className="flex items-center gap-1 sm:gap-2">
            {/* Versión móvil: solo número sin círculo */}
            <div className="flex sm:hidden items-center">
              <span
                className={cn(
                  'text-xs font-bold px-1',
                  isCompleted
                    ? 'text-green-500'
                    : isActive
                    ? 'text-primary'
                    : 'text-gray-400'
                )}
              >
                {index + 1}
              </span>
            </div>
            
            {/* Versión desktop: círculo completo */}
            <div
              className={cn(
                'hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold text-white',
                isCompleted
                  ? 'bg-green-500'
                  : isActive
                  ? 'bg-primary'
                  : 'bg-gray-300'
              )}
            >
              {index + 1}
            </div>
            
            <span
              className={cn(
                'text-xs sm:text-sm',
                isActive
                  ? 'text-primary font-semibold'
                  : isCompleted
                  ? 'text-green-600'
                  : 'text-gray-500'
              )}
            >
              {paso}
            </span>
            {index < pasos.length - 1 && <div className="w-4 sm:w-8 h-px bg-gray-300 mx-1 sm:mx-2"></div>}
          </div>
        );
      })}
    </div>
  );
}
