'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  MapPin,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageSquare
} from 'lucide-react'

interface Meeting {
  id: string
  title: string
  description: string
  type: 'parent_teacher' | 'teacher_council' | 'school_council' | 'training' | 'other'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  date: Date
  time: string
  duration: number
  location: string
  isVirtual: boolean
  participants: Participant[]
  organizer: string
  createdAt: Date
}

interface Participant {
  id: string
  name: string
  role: string
  email: string
  hasConfirmed: boolean
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Réunion parents-professeurs',
    description: 'Discussion sur le progrès des élèves du CM2',
    type: 'parent_teacher',
    status: 'scheduled',
    date: new Date('2024-11-05'),
    time: '14:00',
    duration: 120,
    location: 'Salle des professeurs',
    isVirtual: false,
    participants: [
      { id: '1', name: 'Mme. Diop', role: 'Professeur CM2', email: 'diop@ecole.mr', hasConfirmed: true },
      { id: '2', name: 'M. Salem', role: 'Parent', email: 'salem@email.com', hasConfirmed: true },
      { id: '3', name: 'Mme. Bint', role: 'Parent', email: 'bint@email.com', hasConfirmed: false }
    ],
    organizer: 'Mme. Diop',
    createdAt: new Date('2024-10-25')
  },
  {
    id: '2',
    title: 'Conseil des maîtres',
    description: 'Préparation des évaluations trimestrielles',
    type: 'teacher_council',
    status: 'scheduled',
    date: new Date('2024-11-08'),
    time: '10:00',
    duration: 180,
    location: 'Salle de réunion principale',
    isVirtual: false,
    participants: [
      { id: '4', name: 'M. Ba', role: 'Directeur', email: 'ba@ecole.mr', hasConfirmed: true },
      { id: '5', name: 'Mme. Fall', role: 'Professeur CE1', email: 'fall@ecole.mr', hasConfirmed: true },
      { id: '6', name: 'M. Ndiaye', role: 'Professeur CE2', email: 'ndiaye@ecole.mr', hasConfirmed: true }
    ],
    organizer: 'M. Ba',
    createdAt: new Date('2024-10-24')
  },
  {
    id: '3',
    title: 'Formation pédagogique',
    description: 'Nouvelles méthodes d enseignement des mathématiques',
    type: 'training',
    status: 'scheduled',
    date: new Date('2024-11-12'),
    time: '09:00',
    duration: 240,
    location: 'Visioconférence',
    isVirtual: true,
    participants: [
      { id: '7', name: 'Dr. Ahmed', role: 'Formateur', email: 'ahmed@formation.mr', hasConfirmed: true },
      { id: '8', name: 'Tous les professeurs', role: 'Enseignant', email: '', hasConfirmed: false }
    ],
    organizer: 'Dr. Ahmed',
    createdAt: new Date('2024-10-20')
  }
]

const meetingTypes = [
  { value: 'parent_teacher', label: 'Parents-Professeurs', icon: Users },
  { value: 'teacher_council', label: 'Conseil des maîtres', icon: MessageSquare },
  { value: 'school_council', label: 'Conseil d établissement', icon: Users },
  { value: 'training', label: 'Formation', icon: Video },
  { value: 'other', label: 'Autre', icon: MessageSquare }
]

export default function MeetingManagement() {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'parent_teacher' as Meeting['type'],
    date: new Date(),
    time: '',
    duration: 60,
    location: '',
    isVirtual: false
  })

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusLabel = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled': return 'Programmée'
      case 'in_progress': return 'En cours'
      case 'completed': return 'Terminée'
      case 'cancelled': return 'Annulée'
      default: return status
    }
  }

  const getTypeLabel = (type: Meeting['type']) => {
    const found = meetingTypes.find(t => t.value === type)
    return found?.label || type
  }

  const handleCreateMeeting = () => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...formData,
      status: 'scheduled',
      participants: [],
      organizer: 'Utilisateur actuel',
      createdAt: new Date()
    }

    setMeetings([...meetings, newMeeting])
    setIsCreateDialogOpen(false)
    // Reset form
    setFormData({
      title: '',
      description: '',
      type: 'parent_teacher',
      date: new Date(),
      time: '',
      duration: 60,
      location: '',
      isVirtual: false
    })
  }

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id))
  }

  const upcomingMeetings = meetings.filter(m =>
    m.status === 'scheduled' && m.date >= new Date()
  ).sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Réunions</h2>
          <p className="text-gray-500">Organisez et suivez les réunions et événements</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Liste
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            onClick={() => setViewMode('calendar')}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendrier
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle réunion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle réunion</DialogTitle>
                <DialogDescription>
                  Organisez une réunion avec les participants appropriés
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Titre de la réunion"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Description détaillée de la réunion"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type de réunion</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as Meeting['type']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meetingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    min="30"
                    max="480"
                    step="30"
                  />
                </div>

                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.date, 'PPP', { locale: fr })}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => date && setFormData({...formData, date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Salle de réunion ou adresse de visioconférence"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateMeeting}>
                  Créer la réunion
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
              <CalendarIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Réunions à venir</p>
                <p className="text-2xl font-bold">{upcomingMeetings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-500">Cette semaine</p>
                <p className="text-2xl font-bold">
                  {upcomingMeetings.filter(m => {
                    const weekFromNow = new Date()
                    weekFromNow.setDate(weekFromNow.getDate() + 7)
                    return m.date <= weekFromNow
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Participants totaux</p>
                <p className="text-2xl font-bold">
                  {meetings.reduce((total, meeting) => total + meeting.participants.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-500">Visioconférences</p>
                <p className="text-2xl font-bold">
                  {meetings.filter(m => m.isVirtual).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des réunions */}
      <Card>
        <CardHeader>
          <CardTitle>Réunions programmées</CardTitle>
          <CardDescription>
            {upcomingMeetings.length} réunion(s) à venir
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div key={meeting.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium">{meeting.title}</h3>
                      <Badge className={getStatusColor(meeting.status)}>
                        {getStatusLabel(meeting.status)}
                      </Badge>
                      <Badge variant="outline">{getTypeLabel(meeting.type)}</Badge>
                      {meeting.isVirtual && (
                        <Badge variant="outline">
                          <Video className="h-3 w-3 mr-1" />
                          Visio
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{meeting.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{format(meeting.date, 'dd MMMM yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{meeting.time} ({meeting.duration} min)</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {meeting.isVirtual ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span>{meeting.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{meeting.participants.length} participants</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMeeting(meeting.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {upcomingMeetings.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Aucune réunion programmée</p>
                <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première réunion
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}