import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      password, 
      confirmPassword, 
      role, 
      schoolCode 
    } = await request.json()

    // Validation des champs requis
    if (!firstName || !lastName || !email || !password || !role || !schoolCode) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Validation de la confirmation du mot de passe
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      )
    }

    // Validation de la longueur du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
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

    // Rechercher l'école par code
    const school = await db.school.findFirst({
      where: { 
        // Utiliser un champ de code ou un autre identifiant
        // Pour l'instant, nous utilisons le nom comme code
        name: { contains: schoolCode }
      }
    })

    if (!school) {
      return NextResponse.json(
        { error: 'Code établissement invalide' },
        { status: 404 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer le numéro d'étudiant si c'est un parent
    let studentNumber = null
    if (role === 'PARENT') {
      const year = new Date().getFullYear()
      const count = await db.student.count({
        where: { schoolId: school.id }
      })
      studentNumber = `${year}-${String(count + 1).padStart(3, '0')}`
    }

    // Créer l'utilisateur
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: role as any,
        schoolId: school.id,
        isActive: true
      },
      include: {
        school: true
      }
    })

    // Créer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        schoolId: user.schoolId 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    // Retourner les informations utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Inscription réussie',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}