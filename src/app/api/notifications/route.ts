import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const recipientId = searchParams.get('recipientId')
    const schoolId = searchParams.get('schoolId')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      AND: [
        recipientId ? { recipientId } : {},
        schoolId ? { schoolId } : {},
        unreadOnly ? { isRead: false } : {},
        type ? { type: type.toUpperCase() } : {}
      ]
    }

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentNumber: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Compter le total de notifications non lues
    const unreadCount = await prisma.notification.count({
      where: {
        recipientId,
        schoolId,
        isRead: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount,
      total: notifications.length
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      content,
      contentAr,
      type,
      channel,
      recipientId,
      studentId,
      schoolId,
      sendImmediately
    } = body

    // Validation des données
    if (!title || !content || !type || !channel || !recipientId || !schoolId) {
      return NextResponse.json(
        { error: 'Titre, contenu, type, canal, destinataire et école sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que le destinataire existe
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId }
    })

    if (!recipient) {
      return NextResponse.json(
        { error: 'Destinataire non trouvé' },
        { status: 404 }
      )
    }

    // Créer la notification
    const notification = await prisma.notification.create({
      data: {
        title,
        content,
        contentAr: contentAr || null,
        type: type.toUpperCase(),
        channel: channel.toUpperCase(),
        recipientId,
        studentId: studentId || null,
        schoolId,
        isRead: false,
        sentAt: sendImmediately ? new Date() : null
      },
      include: {
        recipient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            studentNumber: true
          }
        }
      }
    })

    // Logique d'envoi selon le canal (à implémenter selon les besoins)
    if (sendImmediately && channel === 'EMAIL' && recipient.email) {
      // Logique d'envoi d'email
      console.log(`Email envoyé à ${recipient.email}: ${title}`)
    }

    if (sendImmediately && channel === 'SMS' && recipient.phone) {
      // Logique d'envoi SMS
      console.log(`SMS envoyé à ${recipient.phone}: ${title}`)
    }

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la notification' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { notificationIds, action, recipientId } = body

    if (!notificationIds || !Array.isArray(notificationIds) || !action) {
      return NextResponse.json(
        { error: 'IDs des notifications et action sont requis' },
        { status: 400 }
      )
    }

    let updateData: any = {}

    switch (action) {
      case 'mark_read':
        updateData = { isRead: true }
        break
      case 'mark_unread':
        updateData = { isRead: false }
        break
      case 'send':
        updateData = { sentAt: new Date() }
        break
      default:
        return NextResponse.json(
          { error: 'Action non valide' },
          { status: 400 }
        )
    }

    // Mettre à jour les notifications
    const result = await prisma.notification.updateMany({
      where: {
        id: { in: notificationIds },
        recipientId: recipientId || undefined
      },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      updatedCount: result.count,
      message: `${result.count} notification(s) mise(s) à jour`
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour des notifications' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')
    const recipientId = searchParams.get('recipientId')
    const olderThan = searchParams.get('olderThan')

    if (!notificationId && !recipientId && !olderThan) {
      return NextResponse.json(
        { error: 'ID de notification, destinataire ou date limite requis' },
        { status: 400 }
      )
    }

    let where: any = {}

    if (notificationId) {
      where.id = notificationId
    }

    if (recipientId) {
      where.recipientId = recipientId
    }

    if (olderThan) {
      const date = new Date(olderThan)
      where.createdAt = { lt: date }
    }

    const result = await prisma.notification.deleteMany({ where })

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `${result.count} notification(s) supprimée(s)`
    })
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression des notifications' },
      { status: 500 }
    )
  }
}