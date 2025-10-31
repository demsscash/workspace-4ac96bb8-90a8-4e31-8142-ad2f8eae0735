import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const includeStudents = searchParams.get('includeStudents') === 'true'
    const includeTeacher = searchParams.get('includeTeacher') === 'true'

    // Si pas de schoolId, retourner toutes les classes
    const classes = await prisma.schoolClass.findMany({
      where: schoolId ? { schoolId } : {},
      include: {
        students: includeStudents ? {
          where: { isActive: true },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentNumber: true
          }
        } : false,
        teacher: includeTeacher ? {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        } : false,
        subjects: {
          select: {
            id: true,
            name: true,
            maxScore: true,
            coefficient: true
          }
        },
        _count: {
          select: {
            students: {
              where: { isActive: true }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Calculer les statistiques pour chaque classe
    const classesWithStats = classes.map(cls => ({
      ...cls,
      fillRate: cls.capacity > 0 ? Math.round((cls._count.students / cls.capacity) * 100) : 0,
      availableSlots: Math.max(0, cls.capacity - cls._count.students)
    }))

    return NextResponse.json(classesWithStats)
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des classes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, level, capacity, schoolId, teacherId } = body

    // Validation des données
    if (!name || !level || !schoolId) {
      return NextResponse.json(
        { error: 'Nom, niveau et schoolId sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si la classe existe déjà pour cette école
    const existingClass = await prisma.schoolClass.findFirst({
      where: {
        name,
        schoolId
      }
    })

    if (existingClass) {
      return NextResponse.json(
        { error: 'Une classe avec ce nom existe déjà dans cette école' },
        { status: 409 }
      )
    }

    // Créer la nouvelle classe
    const newClass = await prisma.schoolClass.create({
      data: {
        name,
        level,
        capacity: capacity || 40,
        schoolId,
        teacherId: teacherId || null
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newClass, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la classe:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la classe' },
      { status: 500 }
    )
  }
}