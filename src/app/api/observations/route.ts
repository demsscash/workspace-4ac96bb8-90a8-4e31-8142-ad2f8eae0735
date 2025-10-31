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
    const studentId = searchParams.get('studentId')
    const classId = searchParams.get('classId')
    const type = searchParams.get('type')
    const severity = searchParams.get('severity')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      schoolId: user.schoolId
    }

    if (studentId) {
      where.studentId = studentId
    }

    if (classId) {
      where.student = { classId }
    }

    if (type) {
      where.type = type
    }

    if (severity) {
      where.severity = severity
    }

    // Si l'utilisateur est un parent, il ne peut voir que les observations de ses enfants
    if (user.role === 'PARENT') {
      const parentStudents = await db.parentStudent.findMany({
        where: { parentId: user.userId },
        select: { studentId: true }
      })
      where.studentId = { in: parentStudents.map(ps => ps.studentId) }
    }

    const [observations, total] = await Promise.all([
      db.observation.findMany({
        where,
        include: {
          student: {
            include: {
              class: true
            }
          },
          teacher: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.observation.count({ where })
    ])

    return NextResponse.json({
      observations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des observations:', error)
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
      content,
      contentAr,
      type,
      severity,
      studentId
    } = await request.json()

    // Validation des champs requis
    if (!content || !type || !studentId) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Vérifier que l'élève existe et appartient à la même école
    const student = await db.student.findFirst({
      where: {
        id: studentId,
        schoolId: user.schoolId
      }
    })

    if (!student) {
      return NextResponse.json(
        { error: 'Élève non trouvé' },
        { status: 404 }
      )
    }

    // Créer l'observation
    const observation = await db.observation.create({
      data: {
        content,
        contentAr,
        type: type as any,
        severity: severity as any,
        studentId,
        teacherId: user.userId,
        schoolId: user.schoolId
      },
      include: {
        student: {
          include: {
            class: true
          }
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    // Créer une notification pour les parents si la sévérité est importante ou urgente
    if (severity === 'IMPORTANT' || severity === 'URGENT') {
      const parentStudents = await db.parentStudent.findMany({
        where: { studentId },
        include: {
          parent: true
        }
      })

      for (const parentStudent of parentStudents) {
        await db.notification.create({
          data: {
            title: `Nouvelle observation - ${student.firstName} ${student.lastName}`,
            content: content,
            contentAr: contentAr,
            type: 'OBSERVATION',
            channel: 'IN_APP',
            recipientId: parentStudent.parentId,
            studentId,
            schoolId: user.schoolId
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Observation créée avec succès',
      observation
    })

  } catch (error) {
    console.error('Erreur lors de la création de l\'observation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { observationId, isRead } = await request.json()

    if (!observationId) {
      return NextResponse.json(
        { error: 'ID d\'observation requis' },
        { status: 400 }
      )
    }

    // Marquer comme lu
    const observation = await db.observation.update({
      where: { id: observationId },
      data: { isRead },
      include: {
        student: {
          include: {
            class: true
          }
        },
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Observation mise à jour avec succès',
      observation
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'observation:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}