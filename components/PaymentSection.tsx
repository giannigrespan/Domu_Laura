import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'paypal', name: 'PayPal', icon: '💳' },
  { id: 'bitcoin', name: 'Bitcoin', icon: '₿' },
  { id: 'ethereum', name: 'Ethereum', icon: 'Ξ' },
  { id: 'usdt', name: 'USDT', icon: '₮' }
];

interface CryptoAddress {
  currency: string;
  address: string;
  network?: string;
}

export const PaymentSection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<string>('paypal');
  const [amount, setAmount] = useState<string>('');
  const [bookingDates, setBookingDates] = useState({ checkin: '', checkout: '' });
  const [showQR, setShowQR] = useState(false);

  // Indirizzi crypto (da configurare nelle variabili d'ambiente)
  const cryptoAddresses: Record<string, CryptoAddress> = {
    bitcoin: {
      currency: 'BTC',
      address: import.meta.env.VITE_BTC_ADDRESS || 'Configura VITE_BTC_ADDRESS',
      network: 'Bitcoin Network'
    },
    ethereum: {
      currency: 'ETH',
      address: import.meta.env.VITE_ETH_ADDRESS || 'Configura VITE_ETH_ADDRESS',
      network: 'Ethereum Network (ERC-20)'
    },
    usdt: {
      currency: 'USDT',
      address: import.meta.env.VITE_USDT_ADDRESS || 'Configura VITE_USDT_ADDRESS',
      network: 'Ethereum Network (ERC-20)'
    }
  };

  // PayPal Client ID (da configurare nelle variabili d'ambiente)
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  useEffect(() => {
    // Carica PayPal SDK solo se il metodo PayPal è selezionato
    if (selectedMethod === 'paypal' && paypalClientId) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=EUR`;
      script.async = true;
      script.onload = () => initPayPalButtons();
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [selectedMethod, paypalClientId]);

  const initPayPalButtons = () => {
    if (!(window as any).paypal) return;

    const paypalContainer = document.getElementById('paypal-button-container');
    if (!paypalContainer || paypalContainer.children.length > 0) return;

    (window as any).paypal.Buttons({
      createOrder: (_data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount || '100.00',
              currency_code: 'EUR'
            },
            description: `Prenotazione Casa Torpè: ${bookingDates.checkin} - ${bookingDates.checkout}`
          }]
        });
      },
      onApprove: async (_data: any, actions: any) => {
        const order = await actions.order.capture();
        alert(t('payment.paymentSuccess'));
        console.log('Payment completed:', order);
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        alert(t('payment.paymentError'));
      }
    }).render('#paypal-button-container');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t('payment.addressCopied'));
  };

  const generateQRCode = (address: string) => {
    // Usa un servizio di QR code gratuito
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(address)}`;
  };

  return (
    <section id="payment" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            {t('payment.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('payment.subtitle')}
          </p>
        </div>

        {/* Booking Details Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t('payment.bookingDetails')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('contact.checkin')}
              </label>
              <input
                type="date"
                value={bookingDates.checkin}
                onChange={(e) => setBookingDates({ ...bookingDates, checkin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('contact.checkout')}
              </label>
              <input
                type="date"
                value={bookingDates.checkout}
                onChange={(e) => setBookingDates({ ...bookingDates, checkout: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('payment.amount')} (EUR)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sardinia-sea focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {t('payment.selectMethod')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMethod === method.id
                    ? 'border-sardinia-sea bg-sardinia-sea/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{method.icon}</div>
                <div className="text-sm font-medium text-gray-700">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {selectedMethod === 'paypal' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('payment.payWithPayPal')}
              </h3>
              {!paypalClientId ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800">
                    ⚠️ {t('payment.configMissingPayPal')}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    {t('payment.paypalDescription')}
                  </p>
                  <div id="paypal-button-container"></div>
                </div>
              )}
            </div>
          )}

          {['bitcoin', 'ethereum', 'usdt'].includes(selectedMethod) && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {t('payment.payWithCrypto')} ({cryptoAddresses[selectedMethod].currency})
              </h3>

              {cryptoAddresses[selectedMethod].address.includes('Configura') ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    ⚠️ {t('payment.configMissingCrypto')}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    {t('payment.cryptoDescription')}
                  </p>

                  {/* Network Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>{t('payment.network')}:</strong> {cryptoAddresses[selectedMethod].network}
                    </p>
                  </div>

                  {/* Address Display */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('payment.walletAddress')}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cryptoAddresses[selectedMethod].address}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(cryptoAddresses[selectedMethod].address)}
                        className="px-4 py-2 bg-sardinia-sea text-white rounded-lg hover:bg-sky-700 transition-colors"
                      >
                        {t('payment.copy')}
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className="mb-4 px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      {showQR ? t('payment.hideQR') : t('payment.showQR')}
                    </button>
                    {showQR && (
                      <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg">
                        <img
                          src={generateQRCode(cryptoAddresses[selectedMethod].address)}
                          alt="QR Code"
                          className="w-64 h-64"
                        />
                      </div>
                    )}
                  </div>

                  {/* Warning */}
                  <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">
                      ⚠️ {t('payment.cryptoWarning')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Note */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {t('payment.contactNote')} <a href="#contact" className="text-sardinia-sea hover:underline">{t('payment.contactUs')}</a>
          </p>
        </div>
      </div>
    </section>
  );
};
