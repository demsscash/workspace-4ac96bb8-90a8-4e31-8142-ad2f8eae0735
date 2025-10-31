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

// Barèmes mauritaniens par niveau
const MAURITANIAN_GRADES = {
  'CP1': {
    'Arabe': 30,
    'Français': 20,
    'Mathématiques': 40,
    'Éveil': 10
  },
  'CP2': {
    'Arabe': 30,
    'Français': 20,
    'Mathématiques': 40,
    'Éveil': 10
  },
  'CE1': {
    'Arabe': 30,
    'Français': 20,
    'Mathématiques': 40,
    'Sciences': 10
  },
  'CE2': {
    'Arabe': 30,
    'Français': 20,
    'Mathématiques': 40,
    'Sciences': 10
  },
  'CM1': {
    'Arabe': 30,
    'Français': 20,
    'Mathématiques': 40,
    'Histoire-Géographie': 10
  },
  'CM2': {
    'Arabe': 30,
    'Français': 20,
    'Mathématiques': 50,
    'Sciences': 40,
    'Histoire-Géographie': 10
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
    const subjectId = searchParams.get('subjectId')
    const studentId = searchParams.get('studentId')
    const term = searchParams.get('term')

    const where: any = {
      schoolId: user.schoolId
    }

    if (classId) {
      where.student = { classId }
    }
    if (subjectId) {
      where.subjectId = subjectId
    }
    if (studentId) {
      where.studentId = studentId
    }
    if (term) {
      where.term = term
    }

    const grades = await db.grade.findMany({
      where,
      include: {
        student: {
          include: {
            class: true
          }
        },
        subject: true,
        teacher: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: [
        { student: { lastName: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    })

    return NextResponse.json({ grades })

  } catch (error) {
    console.error('Erreur lors de la récupération des notes:', error)
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
      subjectId,
      score,
      term,
      examType,
      comment
    } = await request.json()

    // Validation des champs requis
    if (!studentId || !subjectId || !score || !term) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    // Récupérer la matière et l'élève
    const [subject, student] = await Promise.all([
      db.subject.findUnique({
        where: { id: subjectId },
        include: {
          class: true
        }
      }),
      db.student.findUnique({
        where: { id: studentId },
        include: {
          class: true
        }
      })
    ])

    if (!subject || !student) {
      return NextResponse.json(
        { error: 'Élève ou matière non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que l'utilisateur est autorisé (professeur de la matière ou directeur)
    if (user.role !== 'DIRECTOR' && subject.teacherId !== user.userId) {
      return NextResponse.json(
        { error: 'Non autorisé à saisir cette note' },
        { status: 403 }
      )
    }

    // Calculer le pourcentage selon le système mauritanien
    const percentage = (score / subject.maxScore) * 100

    // Vérifier si une note existe déjà pour cet élève, matière et trimestre
    const existingGrade = await db.grade.findFirst({
      where: {
        studentId,
        subjectId,
        term
      }
    })

    let grade
    if (existingGrade) {
      // Mettre à jour la note existante
      grade = await db.grade.update({
        where: { id: existingGrade.id },
        data: {
          score,
          maxScore: subject.maxScore,
          percentage,
          examType,
          comment,
          teacherId: user.userId
        },
        include: {
          student: {
            include: {
              class: true
            }
          },
          subject: true
        }
      })
    } else {
      // Créer une nouvelle note
      grade = await db.grade.create({
        data: {
          studentId,
          subjectId,
          score,
          maxScore: subject.maxScore,
          percentage,
          term,
          examType,
          comment,
          teacherId: user.userId,
          schoolId: user.schoolId
        },
        include: {
          student: {
            include: {
              class: true
            }
          },
          subject: true
        }
      })
    }

    return NextResponse.json({
      message: 'Note enregistrée avec succès',
      grade
    })

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la note:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Endpoint pour calculer les moyennes selon le système mauritanien
export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { classId, term } = await request.json()

    if (!classId || !term) {
      return NextResponse.json(
        { error: 'Classe et trimestre requis' },
        { status: 400 }
      )
    }

    // Récupérer tous les élèves de la classe
    const students = await db.student.findMany({
      where: { classId },
      include: {
        grades: {
          where: { term },
          include: {
            subject: true
          }
        }
      }
    })

    // Calculer les moyennes pour chaque élève
    const results = students.map(student => {
      const grades = student.grades
      
      // Calculer le total obtenu et le total possible
      let totalObtained = 0
      let totalPossible = 0
      const subjectScores: { [key: string]: { score: number; maxScore: number; percentage: number } } = {}
      
      grades.forEach(grade => {
        totalObtained += grade.score
        totalPossible += grade.maxScore
        subjectScores[grade.subject.name] = {
          score: grade.score,
          maxScore: grade.maxScore,
          percentage: grade.percentage
        }
      })
      
      // Calculer la moyenne générale selon le système mauritanien
      const generalAverage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0
      
      // Déterminer le rang (simulation)
      const rank = Math.floor(Math.random() * students.length) + 1
      
      return {
        student: {
          id: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentNumber: student.studentNumber
        },
        subjectScores,
        generalAverage: Math.round(generalAverage * 100) / 100,
        totalObtained,
        totalPossible,
        rank,
        totalStudents: students.length
      }
    })

    // Trier par moyenne décroissante pour déterminer les rangs
    results.sort((a, b) => b.generalAverage - a.generalAverage)
    results.forEach((result, index) => {
      result.rank = index + 1
    })

    return NextResponse.json({
      message: 'Moyennes calculées avec succès',
      results,
      classInfo: {
        classId,
        term,
        totalStudents: students.length
      }
    })

  } catch (error) {
    console.error('Erreur lors du calcul des moyennes:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}