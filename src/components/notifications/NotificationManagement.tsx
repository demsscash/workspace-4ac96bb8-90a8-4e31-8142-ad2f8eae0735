'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Send,
  Plus,
  Eye,
  Trash2,
  Check,
  Clock,
  AlertCircle,
  Users,
  Calendar,
  Filter
} from 'lucide-react'

interface Notification {
  id: string
  title: string
  content: string
  contentAr?: string
  type: 'ABSENCE' | 'GRADE' | 'OBSERVATION' | 'MEETING' | 'GENERAL' | 'PAYMENT'
  channel: 'SMS' | 'EMAIL' | 'PUSH' | 'IN_APP'
  recipientId: string
  recipientName: string
  recipientEmail: string
  studentId?: string
  studentName?: string
  schoolId: string
  isRead: boolean
  sentAt?: string
  createdAt: string
}

const notificationTypes = [
  { value: 'ABSENCE', label: 'Absence', icon: AlertCircle, color: 'text-red-500' },
  { value: 'GRADE', label: 'Note', icon: Calendar, color: 'text-blue-500' },
  { value: 'OBSERVATION', label: 'Observation', icon: MessageSquare, color: 'text-orange-500' },
  { value: 'MEETING', label: 'Réunion', icon: Users, color: 'text-purple-500' },
  { value: 'GENERAL', label: 'Général', icon: Bell, color: 'text-gray-500' },
  { value: 'PAYMENT', label: 'Paiement', icon: Calendar, color: 'text-green-500' }
]

const channels = [
  { value: 'SMS', label: 'SMS', icon: Smartphone },
  { value: 'EMAIL', label: 'Email', icon: Mail },
  { value: 'PUSH', label: 'Notification Push', icon: Bell },
  { value: 'IN_APP', label: 'Dans l\'application', icon: MessageSquare }
]

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Absence non justifiée',
    content: 'Votre enfant Mohamed Salem n\'était pas présent en classe aujourd\'hui.',
    type: 'ABSENCE',
    channel: 'SMS',
    recipientId: '1',
    recipientName: 'M. Salem',
    recipientEmail: 'salem@email.com',
    studentId: '1',
    studentName: 'Mohamed Salem',
    schoolId: '1',
    isRead: false,
    sentAt: '2024-10-31T08:30:00Z',
    createdAt: '2024-10-31T08:30:00Z'
  },
  {
    id: '2',
    title: 'Note de mathématiques publiée',
    content: 'La note de mathématiques de Fatima Bint pour le T1 est maintenant disponible.',
    type: 'GRADE',
    channel: 'EMAIL',
    recipientId: '2',
    recipientName: 'Mme. Bint',
    recipientEmail: 'bint@email.com',
    studentId: '2',
    studentName: 'Fatima Bint',
    schoolId: '1',
    isRead: true,
    sentAt: '2024-10-30T15:45:00Z',
    createdAt: '2024-10-30T15:45:00Z'
  },
  {
    id: '3',
    title: 'Réunion parents-professeurs',
    content: 'Une réunion est programmée le 5 novembre à 14h pour discuter du progrès des élèves.',
    type: 'MEETING',
    channel: 'IN_APP',
    recipientId: '3',
    recipientName: 'M. Ould',
    recipientEmail: 'ould@email.com',
    schoolId: '1',
    isRead: false,
    createdAt: '2024-10-29T10:00:00Z'
  }
]

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedChannel, setSelectedChannel] = useState<string>('all')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentAr: '',
    type: 'GENERAL' as Notification['type'],
    channel: 'EMAIL' as Notification['channel'],
    recipientIds: [] as string[],
    sendImmediately: true
  })

  const getNotificationIcon = (type: Notification['type']) => {
    const notificationType = notificationTypes.find(t => t.value === type)
    if (!notificationType) return <Bell className="h-4 w-4" />
    const Icon = notificationType.icon
    return <Icon className={`h-4 w-4 ${notificationType.color}`} />
  }

  const getChannelIcon = (channel: Notification['channel']) => {
    const channelData = channels.find(c => c.value === channel)
    if (!channelData) return <MessageSquare className="h-4 w-4" />
    const Icon = channelData.icon
    return <Icon className="h-4 w-4" />
  }

  const getTypeLabel = (type: Notification['type']) => {
    return notificationTypes.find(t => t.value === type)?.label || type
  }

  const getChannelLabel = (channel: Notification['channel']) => {
    return channels.find(c => c.value === channel)?.label || channel
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = selectedType === 'all' || notification.type === selectedType
    const matchesChannel = selectedChannel === 'all' || notification.channel === selectedChannel
    const matchesReadStatus = !showUnreadOnly || !notification.isRead
    return matchesType && matchesChannel && matchesReadStatus
  })

  const handleCreateNotification = async () => {
    if (!formData.title || !formData.content || formData.recipientIds.length === 0) return

    setLoading(true)

    // Simuler la création de notification
    setTimeout(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: formData.title,
        content: formData.content,
        contentAr: formData.contentAr || undefined,
        type: formData.type,
        channel: formData.channel,
        recipientId: formData.recipientIds[0],
        recipientName: 'Destinataire',
        recipientEmail: 'email@example.com',
        schoolId: '1',
        isRead: false,
        sentAt: formData.sendImmediately ? new Date().toISOString() : undefined,
        createdAt: new Date().toISOString()
      }

      setNotifications([newNotification, ...notifications])
      setIsCreateDialogOpen(false)
      setLoading(false)

      // Reset form
      setFormData({
        title: '',
        content: '',
        contentAr: '',
        type: 'GENERAL',
        channel: 'EMAIL',
        recipientIds: [],
        sendImmediately: true
      })
    }, 1000)
  }

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId))
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Notifications</h2>
          <p className="text-gray-500">Envoyez et suivez les notifications aux parents et au personnel</p>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle notification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle notification</DialogTitle>
                <DialogDescription>
                  Envoyez une notification aux parents ou au personnel
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type de notification</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Notification['type']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="channel">Canal d'envoi</Label>
                    <Select value={formData.channel} onValueChange={(value) => setFormData({...formData, channel: value as Notification['channel']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {channels.map((channel) => (
                          <SelectItem key={channel.value} value={channel.value}>
                            {channel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Titre de la notification"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Contenu détaillé de la notification"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="contentAr">Contenu en arabe (optionnel)</Label>
                  <Textarea
                    id="contentAr"
                    value={formData.contentAr}
                    onChange={(e) => setFormData({...formData, contentAr: e.target.value})}
                    placeholder="المحتوى باللغة العربية"
                    rows={3}
                    dir="rtl"
                  />
                </div>

                <div>
                  <Label>Destinataires</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="allParents" />
                      <Label htmlFor="allParents">Tous les parents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="allTeachers" />
                      <Label htmlFor="allTeachers">Tous les enseignants</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendImmediately"
                    checked={formData.sendImmediately}
                    onCheckedChange={(checked) => setFormData({...formData, sendImmediately: checked as boolean})}
                  />
                  <Label htmlFor="sendImmediately">Envoyer immédiatement</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateNotification} disabled={loading}>
                  {loading ? 'Envoi...' : 'Envoyer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Bell className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Total notifications</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Non lues</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Send className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Envoyées aujourd'hui</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => {
                    const today = new Date().toDateString()
                    const notificationDate = new Date(n.createdAt).toDateString()
                    return today === notificationDate
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Smartphone className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">SMS envoyés</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.channel === 'SMS').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-500" />

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les canaux</SelectItem>
                {channels.map((channel) => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="unreadOnly"
                checked={showUnreadOnly}
                onCheckedChange={(checked) => setShowUnreadOnly(checked as boolean)}
              />
              <Label htmlFor="unreadOnly">Non lues uniquement</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            {filteredNotifications.length} notification(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-colors ${
                  !notification.isRead ? 'bg-blue-50 border-blue-200' : 'hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getNotificationIcon(notification.type)}
                      <h3 className={`font-medium ${!notification.isRead ? 'font-semibold' : ''}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          Non lue
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{notification.content}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        {getChannelIcon(notification.channel)}
                        <span>{getChannelLabel(notification.channel)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(notification.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {notification.recipientName && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{notification.recipientName}</span>
                        </div>
                      )}
                      {notification.studentName && (
                        <div className="flex items-center space-x-1">
                          <span>•</span>
                          <span>{notification.studentName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune notification trouvée</p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première notification
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}