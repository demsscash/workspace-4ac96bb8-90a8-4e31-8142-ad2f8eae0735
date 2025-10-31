import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json(
        { error: 'schoolId est requis' },
        { status: 400 }
      )
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Récupérer les statistiques en parallèle
    const [
      totalStudents,
      presentToday,
      absentToday,
      totalTeachers,
      totalClasses,
      monthlyRevenue,
      pendingPayments,
      unreadNotifications,
      thisMonthAttendances,
      thisMonthGrades
    ] = await Promise.all([
      // Total des élèves actifs
      prisma.student.count({
        where: { schoolId, isActive: true }
      }),

      // Élèves présents aujourd'hui
      prisma.attendance.count({
        where: {
          schoolId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          },
          status: 'PRESENT'
        }
      }),

      // Élèves absents aujourd'hui
      prisma.attendance.count({
        where: {
          schoolId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
          },
          status: { in: ['ABSENT', 'EXCUSED'] }
        }
      }),

      // Total des enseignants actifs
      prisma.user.count({
        where: { schoolId, role: 'TEACHER', isActive: true }
      }),

      // Total des classes
      prisma.schoolClass.count({
        where: { schoolId }
      }),

      // Revenus mensuels (simulé - à adapter selon votre logique financière)
      prisma.student.count({
        where: {
          schoolId,
          isActive: true
        }
      }).then(count => count * 25000), // Simulation: 25,000 MRU par élève

      // Paiements en attente (simulé)
      prisma.student.count({
        where: {
          schoolId,
          isActive: true
        }
      }).then(count => Math.floor(count * 25000 * 0.1)), // Simulation: 10% en attente

      // Notifications non lues
      prisma.notification.count({
        where: {
          schoolId,
          isRead: false
        }
      }),

      // Statistiques de présence du mois
      prisma.attendance.groupBy({
        by: ['status'],
        where: {
          schoolId,
          date: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1)
          }
        },
        _count: true
      }),

      // Statistiques des notes du mois
      prisma.grade.aggregate({
        where: {
          schoolId,
          createdAt: {
            gte: new Date(today.getFullYear(), today.getMonth(), 1)
          }
        },
        _avg: {
          percentage: true
        },
        _count: true
      })
    ])

    // Calculer le nombre d'élèves absents aujourd'hui
    const totalActiveStudents = totalStudents
    const actualAbsentToday = totalActiveStudents - presentToday

    // Récupérer les activités récentes - faire des requêtes séparées pour éviter les problèmes SQL
    const recentGrades = await prisma.$queryRaw`
      SELECT
        'grade' as type,
        s.firstName || ' ' || s.lastName as studentName,
        c.name as className,
        strftime('%H:%M', g.createdAt) as time,
        'normal' as status,
        g.createdAt as sortDate
      FROM grades g
      JOIN students s ON g.studentId = s.id
      JOIN subjects sub ON g.subjectId = sub.id
      JOIN classes c ON sub.classId = c.id
      WHERE g.schoolId = ${schoolId}
      ORDER BY g.createdAt DESC
      LIMIT 3
    ` as any[]

    const recentObservations = await prisma.$queryRaw`
      SELECT
        'observation' as type,
        s.firstName || ' ' || s.lastName as studentName,
        c.name as className,
        strftime('%H:%M', o.createdAt) as time,
        CASE o.severity
          WHEN 'URGENT' THEN 'urgent'
          WHEN 'IMPORTANT' THEN 'important'
          ELSE 'normal'
        END as status,
        o.createdAt as sortDate
      FROM observations o
      JOIN students s ON o.studentId = s.id
      JOIN classes c ON s.classId = c.id
      WHERE o.schoolId = ${schoolId}
      ORDER BY o.createdAt DESC
      LIMIT 3
    ` as any[]

    const recentAttendances = await prisma.$queryRaw`
      SELECT
        'absence' as type,
        s.firstName || ' ' || s.lastName as studentName,
        c.name as className,
        strftime('%H:%M', a.createdAt) as time,
        CASE a.status
          WHEN 'ABSENT' THEN 'urgent'
          WHEN 'LATE' THEN 'important'
          ELSE 'normal'
        END as status,
        a.createdAt as sortDate
      FROM attendances a
      JOIN students s ON a.studentId = s.id
      JOIN classes c ON s.classId = c.id
      WHERE a.schoolId = ${schoolId}
        AND a.date >= datetime('now', '-1 day')
      ORDER BY a.createdAt DESC
      LIMIT 3
    ` as any[]

    // Combiner et trier les activités
    const recentActivities = [...recentGrades, ...recentObservations, ...recentAttendances]
      .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
      .slice(0, 6)

    // Formater les activités récentes
    const formattedActivities = (recentActivities as any[]).map(activity => ({
      id: Math.random().toString(),
      type: activity.type,
      student: activity.studentName,
      class: activity.className,
      time: activity.time,
      status: activity.status
    })).slice(0, 6)

    // Récupérer les classes avec leurs statistiques
    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      include: {
        teacher: {
          select: {
            firstName: true,
            lastName: true
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
      orderBy: { name: 'asc' }
    })

    // Calculer les statistiques de présence
    const attendanceStats = {
      present: thisMonthAttendances.find(a => a.status === 'PRESENT')?._count || 0,
      absent: thisMonthAttendances.find(a => a.status === 'ABSENT')?._count || 0,
      late: thisMonthAttendances.find(a => a.status === 'LATE')?._count || 0,
      excused: thisMonthAttendances.find(a => a.status === 'EXCUSED')?._count || 0
    }

    const totalAttendanceRecords = Object.values(attendanceStats).reduce((sum, count) => sum + count, 0)

    return NextResponse.json({
      stats: {
        totalStudents,
        presentToday,
        absentToday: actualAbsentToday,
        totalTeachers,
        totalClasses,
        monthlyRevenue,
        pendingPayments,
        unreadNotifications
      },
      recentActivities: formattedActivities,
      classes: classes.map(cls => ({
        id: cls.id,
        name: cls.name,
        level: cls.level,
        students: cls._count.students,
        capacity: cls.capacity,
        teacher: `${cls.teacher?.firstName || ''} ${cls.teacher?.lastName || ''}`.trim() || 'Non assigné',
        fillRate: cls.capacity > 0 ? Math.round((cls._count.students / cls.capacity) * 100) : 0
      })),
      monthlyStats: {
        attendance: {
          ...attendanceStats,
          rate: totalAttendanceRecords > 0
            ? Math.round((attendanceStats.present / totalAttendanceRecords) * 100)
            : 0
        },
        grades: {
          average: Math.round((thisMonthGrades._avg.percentage || 0) * 100) / 100,
          totalGrades: thisMonthGrades._count
        }
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}