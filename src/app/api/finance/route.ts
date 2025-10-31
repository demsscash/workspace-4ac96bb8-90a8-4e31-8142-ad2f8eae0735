import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Vérifier l'authentification
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const studentId = searchParams.get('studentId')

    const where: any = {
      schoolId: user.schoolId
    }

    if (type) {
      where.type = type
    }

    if (status) {
      where.status = status
    }

    if (studentId) {
      where.studentId = studentId
    }

    // Pour l'instant, retournons des données mock
    const mockPayments = [
      {
        id: '1',
        type: 'TUITION',
        amount: 25000,
        dueDate: '2024-01-31',
        status: 'PAID',
        description: 'Frais de scolarité - Janvier 2024',
        paymentMethod: 'CASH',
        paidAmount: 25000,
        paidDate: '2024-01-15',
        createdAt: '2024-01-01T00:00:00Z',
        student: {
          id: '1',
          firstName: 'Mohamed',
          lastName: 'Salem',
          studentNumber: '2024-001',
          class: { name: 'CM2' }
        }
      }
    ]

    return NextResponse.json({
      payments: mockPayments,
      pagination: {
        page,
        limit,
        total: mockPayments.length,
        pages: Math.ceil(mockPayments.length / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const {
      studentId,
      type,
      amount,
      dueDate,
      description,
      paymentMethod
    } = await request.json()

    // Validation des champs requis
    if (!studentId || !type || !amount) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Pour l'instant, simulons la création
    const mockPayment = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      dueDate,
      status: 'PENDING',
      description,
      paymentMethod,
      createdAt: new Date().toISOString(),
      student: {
        id: studentId,
        firstName: 'Mock',
        lastName: 'Student',
        studentNumber: '2024-001',
        class: { name: 'CM2' }
      }
    }

    return NextResponse.json({
      message: 'Paiement créé avec succès',
      payment: mockPayment
    })

  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}