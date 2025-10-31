import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    // Pour l'instant, utilisons un utilisateur mock pour la démo
    const mockUser = {
      id: '1',
      email: 'admin@ecole.mr',
      password: '$2a$10$rOzJqQjQjQjQjQjQjQjQjO', // password: admin123
      firstName: 'Admin',
      lastName: 'User',
      role: 'DIRECTOR',
      schoolId: '1'
    }

    // Vérifier si c'est l'utilisateur mock
    if (email === mockUser.email) {
      const isPasswordValid = await bcrypt.compare(password, mockUser.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Email ou mot de passe incorrect' },
          { status: 401 }
        )
      }

      // Créer le token JWT
      const token = jwt.sign(
        { 
          userId: mockUser.id, 
          email: mockUser.email, 
          role: mockUser.role,
          schoolId: mockUser.schoolId 
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      )

      // Retourner les informations utilisateur (sans le mot de passe)
      const { password: _, ...userWithoutPassword } = mockUser

      return NextResponse.json({
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token
      })
    }

    // Sinon, vérifier dans la base de données
    const user = await db.user.findUnique({
      where: { email },
      include: {
        school: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    // Mettre à jour la dernière connexion
    await db.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
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

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Connexion réussie',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }
    
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      
      // Pour l'instant, retournons l'utilisateur mock
      if (decoded.email === 'admin@ecole.mr') {
        return NextResponse.json({
          user: {
            id: '1',
            email: 'admin@ecole.mr',
            firstName: 'Admin',
            lastName: 'User',
            role: 'DIRECTOR',
            schoolId: '1'
          }
        })
      }

      // Sinon, vérifier dans la base de données
      const user = await db.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          schoolId: true,
          isActive: true
        }
      })

      if (!user || !user.isActive) {
        return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 })
      }

      return NextResponse.json({ user })

    } catch (error) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}