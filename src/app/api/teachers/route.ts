import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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
    const search = searchParams.get('search') || ''

    const where: any = {
      schoolId: user.schoolId,
      role: 'TEACHER'
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } }
      ]
    }

    const [teachers, total] = await Promise.all([
      db.user.findMany({
        where,
        include: {
          teacherClasses: {
            include: {
              class: true
            }
          },
          taughtSubjects: {
            include: {
              class: true
            }
          }
        },
        orderBy: { lastName: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.user.count({ where })
    ])

    return NextResponse.json({
      teachers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des enseignants:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user || user.role !== 'DIRECTOR') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const {
      firstName,
      lastName,
      firstNameAr,
      lastNameAr,
      email,
      phone,
      password,
      speciality,
      hireDate,
      classes,
      subjects
    } = await request.json()

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer l'enseignant
    const teacher = await db.user.create({
      data: {
        firstName,
        lastName,
        firstNameAr,
        lastNameAr,
        email,
        phone,
        password: hashedPassword,
        role: 'TEACHER',
        schoolId: user.schoolId,
        isActive: true
      },
      include: {
        teacherClasses: {
          include: {
            class: true
          }
        }
      }
    })

    // Associer les classes si spécifiées
    if (classes && classes.length > 0) {
      await Promise.all(
        classes.map((classId: string) =>
          db.teacherClass.create({
            data: {
              teacherId: teacher.id,
              classId,
              role: 'TEACHER'
            }
          })
        )
      )
    }

    // Associer les matières si spécifiées
    if (subjects && subjects.length > 0) {
      await Promise.all(
        subjects.map((subjectData: any) =>
          db.subject.create({
            data: {
              name: subjectData.name,
              nameAr: subjectData.nameAr,
              maxScore: subjectData.maxScore,
              classId: subjectData.classId,
              teacherId: teacher.id,
              schoolId: user.schoolId
            }
          })
        )
      )
    }

    return NextResponse.json({
      message: 'Enseignant créé avec succès',
      teacher
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'enseignant:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}