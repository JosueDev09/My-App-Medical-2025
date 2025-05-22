'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';

interface BotonPaypalProps {
  folio: string;
  onPagoVerificado: () => void;
}

export default function BotonPaypal({ folio, onPagoVerificado }: BotonPaypalProps) {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: { value: '500.00', currency_code: 'MXN' },
            },
          ],
          intent: 'CAPTURE',
        });
      }}
      onApprove={async (data) => {
        const orderID = data.orderID;

        const res = await fetch('/api/citas/pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderID,
            folio,
          }),
        });

        if (res.ok) {
          onPagoVerificado(); // notifica al componente padre
        } else {
          alert('No se pudo verificar el pago con PayPal');
        }
      }}
      onError={(err) => {
        console.error(err);
        alert('Error en el pago. Intenta nuevamente.');
      }}
    />
  );
}
