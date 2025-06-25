"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, Copy, ArrowLeft, QrCode, Sparkles, Gamepad2, CreditCard } from "lucide-react"
import Image from "next/image"
import { sendOrderEmail } from "@/lib/email-service"

interface Package {
  id: string
  name: string
  price: number
  discount?: number
  popular?: boolean
  icon: string
}

interface FormData {
  selectedPackage: Package | null
  phone: string
  playerId: string
  bank: string
  holderPhone: string
  holderName: string
  paymentDate: string
  reference: string
  acceptTerms: boolean
}

const packages: Package[] = [
  { id: "1", name: "100 Diamantes + 10 Bono", price: 108, discount: 5, icon: "💎" },
  { id: "2", name: "310 Diamantes + 31 Bono", price: 331, discount: 5, popular: true, icon: "💎" },
  { id: "3", name: "520 Diamantes + 52 Bono", price: 544, discount: 5, icon: "💎" },
  { id: "4", name: "1060 Diamantes + 106 Bono", price: 1076, discount: 5, icon: "💎" },
  { id: "5", name: "2.180 Diamantes + 216 Bono", price: 2078, discount: 5, icon: "💎" },
  { id: "6", name: "5.600 Diamantes + 560 Bono", price: 4920, popular: true, icon: "💎" },
  { id: "7", name: "Tarjeta Básica", price: 88, icon: "🎫" },
  { id: "8", name: "Tarjeta Mensual", price: 1554, icon: "🎫" },
  { id: "9", name: "Tarjeta Semanal", price: 340, icon: "🎫" },
  { id: "10", name: "Paquete de nivel 6", price: 60, icon: "📦" },
  { id: "11", name: "Paquete de nivel 10", price: 101, icon: "📦" },
  { id: "12", name: "Paquete de nivel 15", price: 101, icon: "📦" },
  { id: "13", name: "Paquete de nivel 20", price: 101, icon: "📦" },
  { id: "14", name: "Paquete de nivel 25", price: 101, icon: "📦" },
  { id: "15", name: "Paquete de nivel 30", price: 159, icon: "📦" },
  { id: "16", name: "Pase Booyah", price: 313, icon: "🚀" },
]

export default function SapiClubRechargeForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [formData, setFormData] = useState<FormData>({
    selectedPackage: null,
    phone: "",
    playerId: "",
    bank: "",
    holderPhone: "",
    holderName: "",
    paymentDate: "",
    reference: "",
    acceptTerms: false,
  })

  // Auto-advance when package is selected
  useEffect(() => {
    if (formData.selectedPackage && currentStep === 1) {
      const timer = setTimeout(() => {
        setCurrentStep(2)
      }, 800) // Small delay for smooth transition
      return () => clearTimeout(timer)
    }
  }, [formData.selectedPackage, currentStep])

  const handlePackageSelect = (pkg: Package) => {
    setFormData({ ...formData, selectedPackage: pkg })
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleVerifyOrder = async () => {
    setIsProcessing(true)
    setEmailError("")

    try {
      // Enviar email
      const emailResult = await sendOrderEmail(formData)

      if (emailResult.success) {
        // Simular tiempo de procesamiento
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setOrderCompleted(true)
      } else {
        setEmailError("Error al enviar el pedido. Por favor, inténtalo de nuevo.")
      }
    } catch (error) {
      console.error("Error:", error)
      setEmailError("Error al procesar el pedido. Por favor, inténtalo de nuevo.")
    } finally {
      setIsProcessing(false)
    }
  }

  const StepIndicator = ({
    step,
    title,
    isActive,
    isCompleted,
    icon,
  }: { step: number; title: string; isActive: boolean; isCompleted: boolean; icon: React.ReactNode }) => (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
          isCompleted
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110"
            : isActive
              ? "bg-white text-blue-600 shadow-lg scale-110 ring-4 ring-blue-200"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {isCompleted ? <Check className="w-5 h-5" /> : icon}
      </div>
      <span
        className={`text-sm font-medium transition-colors duration-300 ${
          isActive ? "text-blue-600" : isCompleted ? "text-blue-500" : "text-gray-500"
        }`}
      >
        {title}
      </span>
    </div>
  )

  const TermsAndConditions = () => (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Términos y Condiciones - Sapi Club</h1>

      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">1. Aceptación de Términos</h2>
          <p>Al utilizar nuestro servicio de recargas, usted acepta estar sujeto a estos términos y condiciones.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">2. Proceso de Recarga</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Las recargas se procesan en un plazo de 1 a 24 horas hábiles</li>
            <li>Debe proporcionar información correcta y verificable</li>
            <li>El pago debe realizarse exactamente por el monto indicado</li>
            <li>Conserve el comprobante de pago hasta completar la transacción</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">3. Política de Reembolsos</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Los reembolsos solo se procesan en caso de error del sistema</li>
            <li>No se aceptan reembolsos por cambio de opinión del cliente</li>
            <li>Para solicitar reembolso, contacte dentro de las 48 horas</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">4. Responsabilidades</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Sapi Club no se hace responsable por información incorrecta proporcionada</li>
            <li>El cliente es responsable de verificar su ID de jugador</li>
            <li>Los pagos son procesados por terceros seguros</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-blue-600 mb-3">5. Contacto</h2>
          <p>Para soporte técnico o consultas, contáctenos a través de nuestros canales oficiales.</p>
        </section>

        <div className="bg-blue-50 p-4 rounded-lg mt-6">
          <p className="text-sm text-blue-800">
            <strong>Última actualización:</strong> Enero 2024
          </p>
        </div>
      </div>
    </div>
  )

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white shadow-2xl border-0">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Pedido Recibido!</h2>
            <p className="text-gray-600 mb-6">
              Su pedido será procesado. Le daremos respuesta al número <strong>{formData.phone}</strong> que registró.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>Paquete:</strong> {formData.selectedPackage?.name}
                <br />
                <strong>Monto:</strong> Bs {formData.selectedPackage?.price}
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Nueva Recarga
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl p-4 shadow-lg">
            <Image src="/images/sapi-club-logo.png" alt="Sapi Club" width={60} height={60} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sapi Club</h1>
              <p className="text-blue-600">Sistema de Recargas</p>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between items-center mb-12 bg-white rounded-2xl p-6 shadow-lg">
          <StepIndicator
            step={1}
            title="Seleccionar"
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
            icon={<Gamepad2 className="w-5 h-5" />}
          />
          <div
            className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
              currentStep > 1 ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-200"
            }`}
          ></div>
          <StepIndicator
            step={2}
            title="Completar"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <div
            className={`flex-1 h-1 mx-4 rounded-full transition-all duration-500 ${
              currentStep > 2 ? "bg-gradient-to-r from-blue-500 to-blue-600" : "bg-gray-200"
            }`}
          ></div>
          <StepIndicator
            step={3}
            title="Confirmar"
            isActive={currentStep === 3}
            isCompleted={false}
            icon={<CreditCard className="w-5 h-5" />}
          />
        </div>

        {/* Step 1: Package Selection */}
        {currentStep === 1 && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Elige tu recarga!</h2>
              <p className="text-gray-600">Selecciona el paquete perfecto para ti</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                    formData.selectedPackage?.id === pkg.id
                      ? "ring-4 ring-blue-500 shadow-xl scale-105 bg-gradient-to-br from-blue-50 to-white"
                      : "hover:shadow-lg bg-white"
                  } ${pkg.popular ? "border-2 border-blue-400" : ""}`}
                  onClick={() => handlePackageSelect(pkg)}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold transform rotate-12">
                      Popular
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{pkg.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-3 text-sm">{pkg.name}</h3>
                    <div className="text-2xl font-bold text-blue-600 mb-2">Bs {pkg.price}</div>
                    {pkg.discount && (
                      <div className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {pkg.discount}% OFF
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {formData.selectedPackage && (
              <div className="text-center">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <Check className="w-4 h-4 mr-2" />
                  Paquete seleccionado: {formData.selectedPackage.name}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Complete Data */}
        {currentStep === 2 && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Completa tus datos</h2>
              <p className="text-gray-600">Necesitamos esta información para procesar tu recarga</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="bg-white shadow-xl border-0">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">
                        📱 Teléfono de contacto
                      </Label>
                      <p className="text-sm text-gray-500 mb-2">Te enviaremos el comprobante a este número</p>
                      <Input
                        id="phone"
                        placeholder="0XXX-XXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3 transition-colors duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="playerId" className="text-gray-700 font-medium">
                        🎮 ID del Jugador
                      </Label>
                      <Input
                        id="playerId"
                        placeholder="Ingrese el ID del jugador"
                        value={formData.playerId}
                        onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-between max-w-2xl mx-auto mt-8">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              <Button
                onClick={handleNext}
                disabled={!formData.phone || !formData.playerId}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                Continuar
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Confirmation */}
        {currentStep === 3 && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">¡Último paso!</h2>
              <p className="text-gray-600">Realiza el pago y confirma tu pedido</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Payment Info */}
              <Card className="bg-white shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                  <h3 className="font-bold text-xl flex items-center">
                    <CreditCard className="w-6 h-6 mr-3" />
                    Información de Pago
                  </h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  {[
                    { label: "RIF", value: "J-502785477" },
                    { label: "Celular", value: "0412-6425335" },
                    { label: "Banco", value: "0102 BANCO DE VENEZUELA" },
                    { label: "Monto", value: `Bs ${formData.selectedPackage?.price}` },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      <span className="text-gray-600 font-medium">{item.label}:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-800">{item.value}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(item.value)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        >
                          <Copy className="w-4 h-4 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mt-6">
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Todo
                  </Button>

                  {/* QR Code */}
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center mt-6 bg-blue-50">
                    <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                      <QrCode className="w-24 h-24 text-gray-800" />
                    </div>
                    <p className="text-blue-600 mt-4 font-bold text-lg">¡Escanea y Paga!</p>
                  </div>
                </CardContent>
              </Card>

              {/* Confirmation Form */}
              <Card className="bg-white shadow-xl border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                  <h3 className="font-bold text-xl flex items-center">
                    <Check className="w-6 h-6 mr-3" />
                    Confirmar Pedido
                  </h3>
                  <p className="text-green-100 mt-1">{formData.selectedPackage?.name}</p>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="bank" className="text-gray-700 font-medium mb-2 block">
                      🏦 Banco Origen
                    </Label>
                    <Input
                      id="bank"
                      placeholder="Ej: Banco de Venezuela, Mercantil, Banesco..."
                      value={formData.bank}
                      onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="holderPhone" className="text-gray-700 font-medium mb-2 block">
                        🆔 Cédula
                      </Label>
                      <Input
                        id="holderPhone"
                        placeholder="12345678"
                        value={formData.holderPhone}
                        onChange={(e) => setFormData({ ...formData, holderPhone: e.target.value })}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="holderName" className="text-gray-700 font-medium mb-2 block">
                        📱 Teléfono
                      </Label>
                      <Input
                        id="holderName"
                        placeholder="0XXXXXXXXXX"
                        value={formData.holderName}
                        onChange={(e) => setFormData({ ...formData, holderName: e.target.value })}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentDate" className="text-gray-700 font-medium mb-2 block">
                      📅 Fecha de Pago
                    </Label>
                    <Input
                      id="paymentDate"
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reference" className="text-gray-700 font-medium mb-2 block">
                      🔢 Referencia
                    </Label>
                    <Input
                      id="reference"
                      placeholder="Número de referencia"
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl p-3"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                      className="border-2 border-blue-300"
                    />
                    <Label htmlFor="terms" className="text-gray-700 text-sm">
                      Acepto los{" "}
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="text-blue-600 underline font-medium cursor-pointer hover:text-blue-800">
                            términos y condiciones
                          </span>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Términos y Condiciones</DialogTitle>
                          </DialogHeader>
                          <TermsAndConditions />
                        </DialogContent>
                      </Dialog>
                    </Label>
                  </div>

                  {emailError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {emailError}
                    </div>
                  )}

                  <Button
                    onClick={handleVerifyOrder}
                    disabled={
                      !formData.bank ||
                      !formData.holderPhone ||
                      !formData.holderName ||
                      !formData.paymentDate ||
                      !formData.reference ||
                      !formData.acceptTerms ||
                      isProcessing
                    }
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando pedido...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Verificar Pedido
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-start mt-8">
              <Button
                onClick={handlePrevious}
                variant="outline"
                className="border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
