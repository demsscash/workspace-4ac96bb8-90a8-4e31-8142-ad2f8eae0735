'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Plus, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  Info,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  Star,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  UserCheck,
  UserX
} from 'lucide-react'

interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  class?: {
    id: string
    name: string
  }
}

interface Observation {
  id: string
  content: string
  contentAr?: string
  type: 'BEHAVIOR' | 'PEDAGOGICAL' | 'POSITIVE' | 'NEGATIVE'
  severity: 'INFO' | 'ATTENTION' | 'IMPORTANT' | 'URGENT'
  isRead: boolean
  createdAt: string
  student: Student
  teacher: {
    firstName: string
    lastName: string
  }
}

const mockStudents: Student[] = [
  { id: '1', studentNumber: '2024-001', firstName: 'Mohamed', lastName: 'Salem', class: { id: '6', name: 'CM2' } },
  { id: '2', studentNumber: '2024-002', firstName: 'Fatima', lastName: 'Bint', class: { id: '4', name: 'CE2' } },
  { id: '3', studentNumber: '2024-003', firstName: 'Ahmed', lastName: 'Ould', class: { id: '2', name: 'CP2' } },
]

const mockObservations: Observation[] = [
  {
    id: '1',
    content: 'Excellent travail en mathématiques aujourd\'hui. Mohamed a montré une grande compréhension des fractions.',
    type: 'POSITIVE',
    severity: 'INFO',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    student: mockStudents[0],
    teacher: { firstName: 'Mme', lastName: 'Diop' }
  },
  {
    id: '2',
    content: 'Difficultés en lecture. Fatima a besoin de soutien supplémentaire pour la fluidité.',
    type: 'PEDAGOGICAL',
    severity: 'ATTENTION',
    isRead: false,
    createdAt: '2024-01-15T09:15:00Z',
    student: mockStudents[1],
    teacher: { firstName: 'M.', lastName: 'Ba' }
  },
  {
    id: '3',
    content: 'Comportement perturbateur en classe. Ahmed a interrompu plusieurs fois le cours.',
    type: 'NEGATIVE',
    severity: 'IMPORTANT',
    isRead: true,
    createdAt: '2024-01-14T14:20:00Z',
    student: mockStudents[2],
    teacher: { firstName: 'Mme', lastName: 'Fall' }
  }
]

const OBSERVATION_TEMPLATES = {
  POSITIVE: [
    'Excellent travail aujourd\'hui',
    'Participation active en classe',
    'Progrès remarquables',
    'Aide les autres élèves',
    'Travail soigné et appliqué'
  ],
  PEDAGOGICAL: [
    'Difficultés en lecture',
    'Besoin de soutien en mathématiques',
    'Progrès en écriture',
    'Bon raisonnement logique',
    'À encourager à participer davantage'
  ],
  BEHAVIOR: [
    'Comportement exemplaire',
    'Aide les camarades',
    'Respectueux envers les enseignants',
    'Bon esprit d\'équipe',
    'Leadership naturel'
  ],
  NEGATIVE: [
    'Comportement perturbateur',
    'Ne fait pas ses devoirs',
    'Parle pendant les cours',
    'Ne respecte pas le matériel',
    'Retards fréquents'
  ]
}

export default function ObservationManagement() {
  const [observations, setObservations] = useState<Observation[]>(mockObservations)
  const [filteredObservations, setFilteredObservations] = useState<Observation[]>(mockObservations)
  const [selectedStudent, setSelectedStudent] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('list')

  // Formulaire d'ajout
  const [formData, setFormData] = useState({
    studentId: '',
    content: '',
    contentAr: '',
    type: '',
    severity: 'INFO',
    notifyParents: false
  })

  useEffect(() => {
    filterObservations()
  }, [observations, selectedStudent, selectedType, selectedSeverity, searchTerm])

  const filterObservations = () => {
    let filtered = observations

    if (selectedStudent !== 'all') {
      filtered = filtered.filter(obs => obs.student.id === selectedStudent)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(obs => obs.type === selectedType)
    }

    if (selectedSeverity !== 'all') {
      filtered = filtered.filter(obs => obs.severity === selectedSeverity)
    }

    if (searchTerm) {
      filtered = filtered.filter(obs =>
        obs.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.student.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredObservations(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const student = mockStudents.find(s => s.id === formData.studentId)
    if (!student) return

    const newObservation: Observation = {
      id: Date.now().toString(),
      content: formData.content,
      contentAr: formData.contentAr,
      type: formData.type as any,
      severity: formData.severity as any,
      isRead: false,
      createdAt: new Date().toISOString(),
      student,
      teacher: { firstName: 'M.', lastName: 'Enseignant' }
    }

    setObservations([newObservation, ...observations])
    
    // Reset form
    setFormData({
      studentId: '',
      content: '',
      contentAr: '',
      type: '',
      severity: 'INFO',
      notifyParents: false
    })
    setIsAddDialogOpen(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'POSITIVE': return <Star className="h-4 w-4 text-yellow-500" />
      case 'PEDAGOGICAL': return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'BEHAVIOR': return <UserCheck className="h-4 w-4 text-green-500" />
      case 'NEGATIVE': return <UserX className="h-4 w-4 text-red-500" />
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      POSITIVE: 'bg-yellow-100 text-yellow-800',
      PEDAGOGICAL: 'bg-blue-100 text-blue-800',
      BEHAVIOR: 'bg-green-100 text-green-800',
      NEGATIVE: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={colors[type as keyof typeof colors]}>
        {type === 'POSITIVE' ? 'Positif' : 
         type === 'PEDAGOGICAL' ? 'Pédagogique' :
         type === 'BEHAVIOR' ? 'Comportement' : 'Négatif'}
      </Badge>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'INFO': return <Info className="h-4 w-4 text-blue-500" />
      case 'ATTENTION': return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'IMPORTANT': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'URGENT': return <AlertTriangle className="h-4 w-4 text-red-600" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    const colors = {
      INFO: 'bg-blue-100 text-blue-800',
      ATTENTION: 'bg-orange-100 text-orange-800',
      IMPORTANT: 'bg-red-100 text-red-800',
      URGENT: 'bg-red-200 text-red-900'
    }
    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity === 'INFO' ? 'Information' :
         severity === 'ATTENTION' ? 'Attention' :
         severity === 'IMPORTANT' ? 'Important' : 'Urgent'}
      </Badge>
    )
  }

  const markAsRead = (observationId: string) => {
    setObservations(observations.map(obs =>
      obs.id === observationId ? { ...obs, isRead: true } : obs
    ))
  }

  const deleteObservation = (observationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette observation ?')) {
      setObservations(observations.filter(obs => obs.id !== observationId))
    }
  }

  const handleUseTemplate = (template: string) => {
    setFormData({ ...formData, content: template })
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cahier d'Observation Numérique</h2>
          <p className="text-gray-600">
            Suivi du comportement et des progrès des élèves
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle observation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouvelle observation</DialogTitle>
              <DialogDescription>
                Enregistrez une observation sur un élève
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Élève *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName} ({student.class?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Type d'observation *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="POSITIVE">Positif</SelectItem>
                      <SelectItem value="PEDAGOGICAL">Pédagogique</SelectItem>
                      <SelectItem value="BEHAVIOR">Comportement</SelectItem>
                      <SelectItem value="NEGATIVE">Négatif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Sévérité</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">Information</SelectItem>
                    <SelectItem value="ATTENTION">Attention</SelectItem>
                    <SelectItem value="IMPORTANT">Important</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type && (
                <div className="space-y-2">
                  <Label>Modèles rapides</Label>
                  <div className="flex flex-wrap gap-2">
                    {OBSERVATION_TEMPLATES[formData.type as keyof typeof OBSERVATION_TEMPLATES].map((template, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Tabs defaultValue="french" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="french">Français</TabsTrigger>
                  <TabsTrigger value="arabic">Arabe</TabsTrigger>
                </TabsList>
                
                <TabsContent value="french" className="space-y-2">
                  <Label htmlFor="content">Observation *</Label>
                  <Textarea
                    id="content"
                    placeholder="Décrivez l'observation en détail..."
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    required
                  />
                </TabsContent>
                
                <TabsContent value="arabic" className="space-y-2">
                  <Label htmlFor="contentAr">الملاحظة (Arabe)</Label>
                  <Textarea
                    id="contentAr"
                    placeholder="اكتب الملاحظة بالتفصيل..."
                    value={formData.contentAr}
                    onChange={(e) => setFormData({...formData, contentAr: e.target.value})}
                    rows={4}
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notifyParents"
                  checked={formData.notifyParents}
                  onCheckedChange={(checked) => setFormData({...formData, notifyParents: checked as boolean})}
                />
                <Label htmlFor="notifyParents" className="text-sm">
                  Notifier les parents
                </Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer l'observation
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans les observations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Élève" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les élèves</SelectItem>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.firstName} {student.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="POSITIVE">Positif</SelectItem>
                  <SelectItem value="PEDAGOGICAL">Pédagogique</SelectItem>
                  <SelectItem value="BEHAVIOR">Comportement</SelectItem>
                  <SelectItem value="NEGATIVE">Négatif</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue placeholder="Sévérité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sévérités</SelectItem>
                  <SelectItem value="INFO">Information</SelectItem>
                  <SelectItem value="ATTENTION">Attention</SelectItem>
                  <SelectItem value="IMPORTANT">Important</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{observations.length}</div>
            <p className="text-sm text-gray-600">Total observations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {observations.filter(o => o.type === 'POSITIVE').length}
            </div>
            <p className="text-sm text-gray-600">Observations positives</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {observations.filter(o => o.severity === 'IMPORTANT' || o.severity === 'URGENT').length}
            </div>
            <p className="text-sm text-gray-600">Important/Urgent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {observations.filter(o => !o.isRead).length}
            </div>
            <p className="text-sm text-gray-600">Non lues</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des observations */}
      <Card>
        <CardHeader>
          <CardTitle>Observations récentes</CardTitle>
          <CardDescription>
            {filteredObservations.length} observation{filteredObservations.length > 1 ? 's' : ''} trouvée{filteredObservations.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredObservations.map((observation) => (
              <div 
                key={observation.id} 
                className={`border rounded-lg p-4 ${!observation.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(observation.type)}
                      {getSeverityIcon(observation.severity)}
                      <span className="font-medium">
                        {observation.student.firstName} {observation.student.lastName}
                      </span>
                      <Badge variant="outline">{observation.student.class?.name}</Badge>
                      {!observation.isRead && (
                        <Badge className="bg-blue-100 text-blue-800">Non lue</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{observation.content}</p>
                    {observation.contentAr && (
                      <p className="text-gray-600 mb-3" dir="rtl">{observation.contentAr}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getTypeBadge(observation.type)}
                        {getSeverityBadge(observation.severity)}
                        <span className="text-sm text-gray-500">
                          Par {observation.teacher.firstName} {observation.teacher.lastName}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(observation.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        {!observation.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(observation.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteObservation(observation.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredObservations.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune observation trouvée
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedStudent !== 'all' || selectedType !== 'all' || selectedSeverity !== 'all'
                  ? 'Essayez de modifier vos filtres'
                  : 'Commencez par ajouter une nouvelle observation'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}