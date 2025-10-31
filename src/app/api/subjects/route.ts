import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const classId = searchParams.get('classId')
    const teacherId = searchParams.get('teacherId')

    const subjects = await prisma.subject.findMany({
      where: {
        AND: [
          schoolId ? { schoolId } : {},
          classId ? { classId } : {},
          teacherId ? { teacherId } : {}
        ]
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        grades: {
          select: {
            id: true,
            score: true,
            maxScore: true,
            percentage: true,
            term: true,
            examType: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            grades: true
          }
        }
      },
      orderBy: [
        { class: { name: 'asc' } },
        { name: 'asc' }
      ]
    })

    // Calculer les statistiques pour chaque matière
    const subjectsWithStats = subjects.map(subject => {
      const grades = subject.grades
      const averageScore = grades.length > 0
        ? grades.reduce((sum, grade) => sum + grade.percentage, 0) / grades.length
        : 0

      return {
        ...subject,
        averageScore: Math.round(averageScore * 100) / 100,
        totalGrades: grades.length,
        lastGradeDate: grades.length > 0
          ? grades.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
          : null
      }
    })

    return NextResponse.json(subjectsWithStats)
  } catch (error) {
    console.error('Erreur lors de la récupération des matières:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des matières' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, nameAr, maxScore, coefficient, schoolId, classId, teacherId } = body

    // Validation des données
    if (!name || !schoolId || !classId) {
      return NextResponse.json(
        { error: 'Nom, schoolId et classId sont requis' },
        { status: 400 }
      )
    }

    // Vérifier si la matière existe déjà pour cette classe
    const existingSubject = await prisma.subject.findFirst({
      where: {
        name,
        classId,
        schoolId
      }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Cette matière existe déjà pour cette classe' },
        { status: 409 }
      )
    }

    // Créer la nouvelle matière
    const newSubject = await prisma.subject.create({
      data: {
        name,
        nameAr: nameAr || null,
        maxScore: maxScore || 20,
        coefficient: coefficient || 1,
        schoolId,
        classId,
        teacherId: teacherId || null
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(newSubject, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la matière:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la matière' },
      { status: 500 }
    )
  }
}