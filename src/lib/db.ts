import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Fonction pour initialiser les données de base
export async function initializeDatabase() {
  try {
    // Vérifier si l'école par défaut existe
    let school = await db.school.findFirst()
    
    if (!school) {
      school = await db.school.create({
        data: {
          name: 'École Primaire Nouakchott',
          nameAr: 'مدرسة نواكشوط الابتدائية',
          address: 'Avenue Gamal Abdel Nasser, Nouakchott',
          phone: '+222 456 789 012',
          email: 'contact@ecole-nouakchott.mr'
        }
      })
    }

    // Créer l'utilisateur admin par défaut
    const existingAdmin = await db.user.findFirst({
      where: { email: 'admin@ecole.mr' }
    })

    if (!existingAdmin) {
      const bcrypt = require('bcryptjs')
      const hashedPassword = await bcrypt.hash('admin123', 10)
      
      await db.user.create({
        data: {
          email: 'admin@ecole.mr',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'DIRECTOR',
          schoolId: school.id,
          isActive: true
        }
      })
    }

    // Créer les classes par défaut
    const classes = [
      { name: 'CP1', level: 'Primaire', capacity: 40 },
      { name: 'CP2', level: 'Primaire', capacity: 40 },
      { name: 'CE1', level: 'Primaire', capacity: 40 },
      { name: 'CE2', level: 'Primaire', capacity: 40 },
      { name: 'CM1', level: 'Primaire', capacity: 40 },
      { name: 'CM2', level: 'Primaire', capacity: 40 }
    ]

    for (const classData of classes) {
      const existingClass = await db.schoolClass.findFirst({
        where: { 
          name: classData.name,
          schoolId: school.id 
        }
      })
      
      if (!existingClass) {
        await db.schoolClass.create({
          data: {
            ...classData,
            schoolId: school.id
          }
        })
      }
    }

    // Créer les matières avec barèmes mauritaniens
    const mauritanianSubjects = {
      'CP1': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Éveil': 10 },
      'CP2': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Éveil': 10 },
      'CE1': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Sciences': 10 },
      'CE2': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Sciences': 10 },
      'CM1': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Histoire-Géographie': 10 },
      'CM2': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 50, 'Sciences': 40, 'Histoire-Géographie': 10 }
    }

    for (const [className, subjects] of Object.entries(mauritanianSubjects)) {
      const classRecord = await db.schoolClass.findFirst({
        where: { 
          name: className,
          schoolId: school.id 
        }
      })
      
      if (classRecord) {
        for (const [subjectName, maxScore] of Object.entries(subjects)) {
          const existingSubject = await db.subject.findFirst({
            where: {
              name: subjectName,
              classId: classRecord.id
            }
          })
          
          if (!existingSubject) {
            await db.subject.create({
              data: {
                name: subjectName,
                maxScore,
                classId: classRecord.id,
                schoolId: school.id
              }
            })
          }
        }
      }
    }

    // Créer quelques élèves de démonstration
    const demoStudents = [
      {
        studentNumber: '2024-001',
        firstName: 'Mohamed',
        lastName: 'Salem',
        firstNameAr: 'محمد',
        lastNameAr: 'سالم',
        dateOfBirth: new Date('2015-03-15'),
        placeOfBirth: 'Nouakchott',
        gender: 'MALE' as const,
        address: 'Tevragh Zeina'
      },
      {
        studentNumber: '2024-002',
        firstName: 'Fatima',
        lastName: 'Bint',
        firstNameAr: 'فاطمة',
        lastNameAr: 'بنت',
        dateOfBirth: new Date('2016-07-22'),
        placeOfBirth: 'Nouakchott',
        gender: 'FEMALE' as const,
        address: 'Arafat'
      },
      {
        studentNumber: '2024-003',
        firstName: 'Ahmed',
        lastName: 'Ould',
        firstNameAr: 'أحمد',
        lastNameAr: 'ولد',
        dateOfBirth: new Date('2017-11-08'),
        placeOfBirth: 'Rosso',
        gender: 'MALE' as const,
        address: 'Ksar'
      }
    ]

    for (const studentData of demoStudents) {
      const existingStudent = await db.student.findFirst({
        where: { studentNumber: studentData.studentNumber }
      })
      
      if (!existingStudent) {
        const cm2Class = await db.schoolClass.findFirst({
          where: { name: 'CM2', schoolId: school.id }
        })
        
        await db.student.create({
          data: {
            ...studentData,
            schoolId: school.id,
            classId: cm2Class?.id
          }
        })
      }
    }

    console.log('Base de données initialisée avec succès')
    return true

  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error)
    return false
  }
}

export async function createStudent(data: {
  firstName: string
  lastName: string
  firstNameAr?: string
  lastNameAr?: string
  dateOfBirth: string
  placeOfBirth?: string
  gender: 'MALE' | 'FEMALE'
  address?: string
  classId?: string
  schoolId: string
}) {
  try {
    // Générer le numéro d'étudiant
    const year = new Date().getFullYear()
    const count = await db.student.count({
      where: { schoolId: data.schoolId }
    })
    const studentNumber = `${year}-${String(count + 1).padStart(3, '0')}`

    const student = await db.student.create({
      data: {
        studentNumber,
        ...data,
        dateOfBirth: new Date(data.dateOfBirth)
      },
      include: {
        class: true
      }
    })

    return student
  } catch (error) {
    console.error('Erreur lors de la création de l\'élève:', error)
    throw error
  }
}

export async function getStudents(schoolId: string, filters?: {
  classId?: string
  search?: string
  page?: number
  limit?: number
}) {
  try {
    const where: any = {
      schoolId,
      isActive: true
    }

    if (filters?.classId) {
      where.classId = filters.classId
    }

    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { studentNumber: { contains: filters.search } }
      ]
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const skip = (page - 1) * limit

    const [students, total] = await Promise.all([
      db.student.findMany({
        where,
        include: {
          class: true,
          grades: {
            include: {
              subject: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.student.count({ where })
    ])

    return {
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error)
    throw error
  }
}