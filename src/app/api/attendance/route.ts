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
    const classId = searchParams.get('classId')
    const date = searchParams.get('date')
    const studentId = searchParams.get('studentId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      schoolId: user.schoolId
    }

    if (classId) {
      where.student = { classId }
    }

    if (date) {
      where.date = new Date(date)
    } else {
      // Par défaut, aujourd'hui
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      where.date = {
        gte: today,
        lt: tomorrow
      }
    }

    if (studentId) {
      where.studentId = studentId
    }

    const [attendances, total] = await Promise.all([
      db.attendance.findMany({
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
        orderBy: [
          { date: 'desc' },
          { student: { lastName: 'asc' } }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      db.attendance.count({ where })
    ])

    return NextResponse.json({
      attendances,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des présences:', error)
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

    const { date, attendances } = await request.json()

    if (!date || !attendances || !Array.isArray(attendances)) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      )
    }

    const attendanceDate = new Date(date)
    const results = []

    for (const attendanceData of attendances) {
      const { studentId, status, reason } = attendanceData

      // Vérifier que l'étudiant existe
      const student = await db.student.findFirst({
        where: {
          id: studentId,
          schoolId: user.schoolId
        }
      })

      if (!student) {
        continue
      }

      // Vérifier si une présence existe déjà pour cet étudiant à cette date
      const existingAttendance = await db.attendance.findFirst({
        where: {
          studentId,
          date: attendanceDate
        }
      })

      let attendance
      if (existingAttendance) {
        // Mettre à jour la présence existante
        attendance = await db.attendance.update({
          where: { id: existingAttendance.id },
          data: {
            status: status as any,
            reason,
            teacherId: user.userId
          },
          include: {
            student: {
              include: {
                class: true
              }
            }
          }
        })
      } else {
        // Créer une nouvelle présence
        attendance = await db.attendance.create({
          data: {
            date: attendanceDate,
            status: status as any,
            reason,
            studentId,
            teacherId: user.userId,
            schoolId: user.schoolId
          },
          include: {
            student: {
              include: {
                class: true
              }
            }
          }
        })
      }

      // Créer une notification pour les parents si l'élève est absent
      if (status === 'ABSENT') {
        const parentStudents = await db.parentStudent.findMany({
          where: { studentId },
          include: {
            parent: true
          }
        })

        for (const parentStudent of parentStudents) {
          await db.notification.create({
            data: {
              title: `Absence - ${student.firstName} ${student.lastName}`,
              content: `Votre enfant ${student.firstName} ${student.lastName} est absent(e) aujourd'hui (${new Date(attendanceDate).toLocaleDateString('fr-FR')}).`,
              type: 'ABSENCE',
              channel: 'IN_APP',
              recipientId: parentStudent.parentId,
              studentId,
              schoolId: user.schoolId
            }
          })
        }

        results.push({ ...attendance, notifiedParents: parentStudents.length })
      } else {
        results.push(attendance)
      }
    }

    return NextResponse.json({
      message: 'Présences enregistrées avec succès',
      attendances: results
    })

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement des présences:', error)
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

    const { attendanceId, status, reason } = await request.json()

    if (!attendanceId || !status) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    const attendance = await db.attendance.update({
      where: { id: attendanceId },
      data: {
        status: status as any,
        reason
      },
      include: {
        student: {
          include: {
            class: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Présence mise à jour avec succès',
      attendance
    })

  } catch (error) {
    console.error('Erreur lors de la mise à jour de la présence:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}