import emailjs from "@emailjs/browser"

// Configuración de EmailJS - CONFIGURADO CON TUS DATOS ✅
const EMAILJS_CONFIG = {
  serviceID: "service_neuwe88", // Tu Service ID ✅
  templateID: "template_xr9mozn", // Tu Template ID ✅
  userID: "PkdJgcdPVxft1urrI", // Tu Public Key ✅
}

export const sendOrderEmail = async (orderData: any) => {
  try {
    const templateParams = {
      to_email: "screcargas2024@gmail.com", // Tu email real ✅
      package_name: orderData.selectedPackage?.name,
      package_price: orderData.selectedPackage?.price,
      customer_phone: orderData.phone,
      player_id: orderData.playerId,
      bank: orderData.bank,
      holder_id: orderData.holderPhone,
      holder_phone: orderData.holderName,
      payment_date: orderData.paymentDate,
      reference: orderData.reference,
    }

    const result = await emailjs.send(
      EMAILJS_CONFIG.serviceID,
      EMAILJS_CONFIG.templateID,
      templateParams,
      EMAILJS_CONFIG.userID,
    )

    console.log("Email enviado exitosamente:", result)
    return { success: true, result }
  } catch (error) {
    console.error("Error enviando email:", error)
    return { success: false, error }
  }
}
