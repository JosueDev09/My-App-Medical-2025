'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useSearchParams } from 'next/navigation';

interface BotonPaypalProps {
  folio: string;
  onPagoVerificado: () => void;
}

export default function BotonPaypal({ folio, onPagoVerificado }: BotonPaypalProps) {
  const searchParams = useSearchParams();
  const folio1 = searchParams?.get('folio');
 
  return (
    // <PayPalScriptProvider options={{clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency: 'MXN' }}>
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

        const res = await fetch(`/api/citas/pago/${folio}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderID,
            folio1,
          }),
        });
      
        console.log('Folio:', folio1);
      
        console.log('Respuesta de PayPal:', res);
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
    // </PayPalScriptProvider>
  );
}
