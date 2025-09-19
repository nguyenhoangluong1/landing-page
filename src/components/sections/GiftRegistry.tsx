'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import QRCode from 'react-qr-code'
import { Gift, Copy, Check, CreditCard, Smartphone, Building } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PaymentMethod {
  name: string
  account: string
  qrData: string
  icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
  {
    name: 'Venmo',
    account: '@EmmAndJames',
    qrData: 'venmo://paycharge?txn=pay&recipients=EmmAndJames',
    icon: <Smartphone className="text-blue-500" size={24} />
  },
  {
    name: 'PayPal',
    account: 'gifts@emmaandjames.com',
    qrData: 'https://paypal.me/emmaandjames',
    icon: <CreditCard className="text-blue-600" size={24} />
  },
  {
    name: 'Zelle',
    account: 'gifts@emmaandjames.com',
    qrData: 'https://enroll.zellepay.com/qr-codes?data=gifts@emmaandjames.com',
    icon: <Building className="text-purple-600" size={24} />
  }
]

export const GiftRegistry: React.FC = () => {
  const [activeQR, setActiveQR] = useState<string | null>(null)
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

  const copyToClipboard = async (text: string, methodName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAccount(methodName)
      setTimeout(() => setCopiedAccount(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <section id="gift-registry" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Gift className="text-champagne-500 mx-auto mb-6" size={48} />
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-sage-800 mb-6">
            Gift Registry
          </h2>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed">
            Your presence is the greatest gift, but if you'd like to celebrate with us in another way, 
            we've made it easy with these digital options.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Gift Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-sage-50 rounded-lg p-8 mb-12 text-center"
          >
            <h3 className="font-serif text-2xl text-sage-800 mb-4">
              "The greatest gifts are those lavished on us by people who care enough to give you their time, attention, and love."
            </h3>
            <p className="text-sage-600">
              We're so grateful to have you in our lives. Your love and support mean everything to us!
            </p>
          </motion.div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-champagne-300 transition-all duration-300 hover:shadow-luxury"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-sage-800 mb-2">{method.name}</h3>
                  <p className="text-sm text-sage-600">{method.account}</p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg border mb-4">
                  <QRCode
                    size={128}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={method.qrData}
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    variant="outline-luxury"
                    onClick={() => copyToClipboard(method.account, method.name)}
                    className="w-full text-sm"
                  >
                    {copiedAccount === method.name ? (
                      <>
                        <Check size={16} className="mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} className="mr-2" />
                        Copy Account
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="luxury"
                    onClick={() => window.open(method.qrData, '_blank')}
                    className="w-full text-sm"
                  >
                    <Gift size={16} className="mr-2" />
                    Send Gift
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Traditional Registry Note */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-champagne-50 rounded-lg p-8 text-center"
          >
            <h3 className="font-serif text-2xl text-sage-800 mb-4">
              Traditional Registry
            </h3>
            <p className="text-sage-600 mb-6">
              We're also registered at a few of our favorite stores for those who prefer traditional gifting.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline-luxury"
                onClick={() => window.open('https://www.crateandbarrel.com', '_blank')}
              >
                Crate & Barrel
              </Button>
              <Button
                variant="outline-luxury"
                onClick={() => window.open('https://www.williams-sonoma.com', '_blank')}
              >
                Williams Sonoma
              </Button>
              <Button
                variant="outline-luxury"
                onClick={() => window.open('https://www.amazon.com', '_blank')}
              >
                Amazon
              </Button>
            </div>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-12"
          >
            <p className="font-serif text-2xl text-sage-700 mb-4">
              Thank you for celebrating with us!
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-px bg-champagne-400"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}