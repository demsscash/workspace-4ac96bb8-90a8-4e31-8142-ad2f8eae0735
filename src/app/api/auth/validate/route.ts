import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Secret key pour JWT (à mettre dans les variables d'environnement en production)
const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-ici'

export async function POST(request: NextRequest) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token manquant ou invalide' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Vérifier et décoder le token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Le token est valide, retourner les informations de l'utilisateur
      return NextResponse.json({
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role,
          schoolId: decoded.schoolId
        }
      })
    } catch (jwtError) {
      // Token invalide ou expiré
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Pour les requêtes GET, vérifier le token dans les cookies ou les headers
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 401 }
      )
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      return NextResponse.json({
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          role: decoded.role,
          schoolId: decoded.schoolId
        }
      })
    } catch (jwtError) {
      return NextResponse.json(
        { valid: false, error: 'Token invalide' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}