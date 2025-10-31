import { NextRequest, NextResponse } from 'next/server'
import { db, createStudent, getStudents } from '@/lib/db'
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
    const classId = searchParams.get('classId')
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await getStudents(user.schoolId, {
      classId,
      search,
      page,
      limit
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error)
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
      firstName,
      lastName,
      firstNameAr,
      lastNameAr,
      dateOfBirth,
      placeOfBirth,
      gender,
      address,
      classId
    } = await request.json()

    // Validation des champs requis
    if (!firstName || !lastName || !dateOfBirth || !gender) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Créer l'élève
    const student = await createStudent({
      firstName,
      lastName,
      firstNameAr,
      lastNameAr,
      dateOfBirth,
      placeOfBirth,
      gender: gender as any,
      address,
      classId,
      schoolId: user.schoolId
    })

    return NextResponse.json({
      message: 'Élève créé avec succès',
      student
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}