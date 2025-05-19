import { cn } from '@/lib/utils';

interface StepProps {
  pasoActual: number;
}

const pasos = ['Datos del paciente', 'Pago','Recibo de pago'];

export default function BreadcrumbSteps({ pasoActual }: StepProps) {
  return (
    <div className="flex justify-center items-center mb-3 gap-4">
      {pasos.map((paso, index) => {
        const isActive = index === pasoActual;
        const isCompleted = index < pasoActual;

        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white',
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
                'text-sm',
                isActive
                  ? 'text-primary font-semibold'
                  : isCompleted
                  ? 'text-green-600'
                  : 'text-gray-500'
              )}
            >
              {paso}
            </span>
            {index < pasos.length - 1 && <div className="w-8 h-px bg-gray-300 mx-2"></div>}
          </div>
        );
      })}
    </div>
  );
}
