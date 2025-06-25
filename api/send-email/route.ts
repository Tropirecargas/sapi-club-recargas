// API Route para enviar emails con Nodemailer
import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Configurar el transportador de email
    const transporter = nodemailer.createTransporter({
      service: "gmail", // o tu proveedor de email
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password para Gmail
      },
    })

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "tu-email@ejemplo.com",
      subject: `Nueva Recarga - ${orderData.selectedPackage?.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3B82F6;">Nueva Solicitud de Recarga - Sapi Club</h2>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1F2937; margin-top: 0;">Detalles del Pedido:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Paquete:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.selectedPackage?.name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Precio:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">Bs ${orderData.selectedPackage?.price}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Teléfono:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.phone}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>ID Jugador:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.playerId}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Banco:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.bank}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Cédula:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.holderPhone}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Teléfono Titular:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.holderName}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;"><strong>Fecha Pago:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #E5E7EB;">${orderData.paymentDate}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Referencia:</strong></td><td style="padding: 8px 0;">${orderData.reference}</td></tr>
            </table>
          </div>
          
          <p style="color: #6B7280; font-size: 14px;">
            Este pedido fue enviado desde el sistema de recargas de Sapi Club.
          </p>
        </div>
      `,
    }

    // Enviar el email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Email enviado correctamente" })
  } catch (error) {
    console.error("Error enviando email:", error)
    return NextResponse.json({ success: false, error: "Error enviando email" }, { status: 500 })
  }
}
