import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/* Simulación de sesión del usuario
 * Correos disponibles: 
 * - usuario@techcorp.com
 * - usuario@orosi.com
*/
async function getCurrentUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'usuario@techcorp.com' },
  })
  return user
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Usuario no autenticado' }, { status: 401 })
    }

    const tickets = await prisma.ticket.findMany({
      where: {
        companyId: currentUser.companyId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    return NextResponse.json({ error: 'Error fetching tickets' }, { status: 500 })
  }
}
