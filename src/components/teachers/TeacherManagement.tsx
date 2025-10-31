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
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Filter,
  Download,
  Upload,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'

interface Teacher {
  id: string
  firstName: string
  lastName: string
  firstNameAr?: string
  lastNameAr?: string
  email: string
  phone?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  teacherClasses?: {
    class: {
      id: string
      name: string
      level: string
    }
  }[]
  taughtSubjects?: {
    id: string
    name: string
    class: {
      name: string
    }
  }[]
}

interface Class {
  id: string
  name: string
  level: string
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    firstName: 'Aminata',
    lastName: 'Diop',
    firstNameAr: 'أمينة',
    lastNameAr: 'ديوب',
    email: 'aminata.diop@ecole.mr',
    phone: '+222 22123456',
    isActive: true,
    lastLogin: '2024-01-15T08:30:00Z',
    createdAt: '2023-09-01T00:00:00Z',
    teacherClasses: [
      { class: { id: '6', name: 'CM2', level: 'Primaire' } }
    ],
    taughtSubjects: [
      { id: '1', name: 'Mathématiques', class: { name: 'CM2' } },
      { id: '2', name: 'Sciences', class: { name: 'CM2' } }
    ]
  },
  {
    id: '2',
    firstName: 'Mohamed',
    lastName: 'Ba',
    firstNameAr: 'محمد',
    lastNameAr: 'با',
    email: 'mohamed.ba@ecole.mr',
    phone: '+222 22123457',
    isActive: true,
    lastLogin: '2024-01-15T07:45:00Z',
    createdAt: '2023-09-01T00:00:00Z',
    teacherClasses: [
      { class: { id: '2', name: 'CP2', level: 'Primaire' } }
    ],
    taughtSubjects: [
      { id: '3', name: 'Arabe', class: { name: 'CP2' } },
      { id: '4', name: 'Français', class: { name: 'CP2' } }
    ]
  },
  {
    id: '3',
    firstName: 'Fatou',
    lastName: 'Fall',
    firstNameAr: 'فاطو',
    lastNameAr: 'فال',
    email: 'fatou.fall@ecole.mr',
    phone: '+222 22123458',
    isActive: false,
    lastLogin: '2024-01-10T09:15:00Z',
    createdAt: '2023-09-15T00:00:00Z',
    teacherClasses: [
      { class: { id: '4', name: 'CE2', level: 'Primaire' } }
    ],
    taughtSubjects: [
      { id: '5', name: 'Histoire-Géographie', class: { name: 'CE2' } }
    ]
  }
]

const mockClasses: Class[] = [
  { id: '1', name: 'CP1', level: 'Primaire' },
  { id: '2', name: 'CP2', level: 'Primaire' },
  { id: '3', name: 'CE1', level: 'Primaire' },
  { id: '4', name: 'CE2', level: 'Primaire' },
  { id: '5', name: 'CM1', level: 'Primaire' },
  { id: '6', name: 'CM2', level: 'Primaire' }
]

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers)
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(mockTeachers)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  // Formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    firstNameAr: '',
    lastNameAr: '',
    email: '',
    phone: '',
    password: '',
    speciality: '',
    hireDate: '',
    classes: [] as string[],
    subjects: [] as any[],
    isActive: true
  })

  useEffect(() => {
    filterTeachers()
  }, [teachers, searchTerm, selectedStatus])

  const filterTeachers = () => {
    let filtered = teachers

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(teacher => 
        selectedStatus === 'active' ? teacher.isActive : !teacher.isActive
      )
    }

    setFilteredTeachers(filtered)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingTeacher) {
      // Mode modification
      setTeachers(teachers.map(teacher =>
        teacher.id === editingTeacher.id
          ? { ...teacher, ...formData }
          : teacher
      ))
    } else {
      // Mode ajout
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        firstNameAr: formData.firstNameAr,
        lastNameAr: formData.lastNameAr,
        email: formData.email,
        phone: formData.phone,
        isActive: formData.isActive,
        createdAt: new Date().toISOString(),
        teacherClasses: formData.classes.map(classId => ({
          class: mockClasses.find(c => c.id === classId)!
        })),
        taughtSubjects: formData.subjects.map((subject, index) => ({
          id: Date.now().toString() + index,
          name: subject.name,
          class: { name: mockClasses.find(c => c.id === subject.classId)?.name || '' }
        }))
      }
      setTeachers([...teachers, newTeacher])
    }

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      firstNameAr: '',
      lastNameAr: '',
      email: '',
      phone: '',
      password: '',
      speciality: '',
      hireDate: '',
      classes: [],
      subjects: [],
      isActive: true
    })
    setEditingTeacher(null)
    setIsAddDialogOpen(false)
  }

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    setFormData({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      firstNameAr: teacher.firstNameAr || '',
      lastNameAr: teacher.lastNameAr || '',
      email: teacher.email,
      phone: teacher.phone || '',
      password: '',
      speciality: '',
      hireDate: '',
      classes: teacher.teacherClasses?.map(tc => tc.class.id) || [],
      subjects: teacher.taughtSubjects?.map(ts => ({
        name: ts.name,
        classId: mockClasses.find(c => c.name === ts.class.name)?.id || ''
      })) || [],
      isActive: teacher.isActive
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (teacherId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      setTeachers(teachers.filter(teacher => teacher.id !== teacherId))
    }
  }

  const toggleStatus = (teacherId: string) => {
    setTeachers(teachers.map(teacher =>
      teacher.id === teacherId
        ? { ...teacher, isActive: !teacher.isActive }
        : teacher
    ))
  }

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: '', classId: '', maxScore: 20 }]
    })
  }

  const updateSubject = (index: number, field: string, value: any) => {
    const updatedSubjects = [...formData.subjects]
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value }
    setFormData({ ...formData, subjects: updatedSubjects })
  }

  const removeSubject = (index: number) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Enseignants</h2>
          <p className="text-gray-600">
            {teachers.length} enseignant{teachers.length > 1 ? 's' : ''} inscrit{teachers.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTeacher(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel enseignant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTeacher ? 'Modifier un enseignant' : 'Ajouter un nouvel enseignant'}
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations de l'enseignant
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="french" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="french">Informations (FR)</TabsTrigger>
                    <TabsTrigger value="arabic">Informations (AR)</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="french" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="arabic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstNameAr">الاسم الأول</Label>
                        <Input
                          id="firstNameAr"
                          value={formData.firstNameAr}
                          onChange={(e) => setFormData({...formData, firstNameAr: e.target.value})}
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastNameAr">اسم العائلة</Label>
                        <Input
                          id="lastNameAr"
                          value={formData.lastNameAr}
                          onChange={(e) => setFormData({...formData, lastNameAr: e.target.value})}
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="enseignant@ecole.mr"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+222 22123456"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {!editingTeacher && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="speciality">Spécialité</Label>
                    <Input
                      id="speciality"
                      placeholder="Mathématiques, Sciences, etc."
                      value={formData.speciality}
                      onChange={(e) => setFormData({...formData, speciality: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Date d'embauche</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Classes assignées</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mockClasses.map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${classItem.id}`}
                          checked={formData.classes.includes(classItem.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                classes: [...formData.classes, classItem.id]
                              })
                            } else {
                              setFormData({
                                ...formData,
                                classes: formData.classes.filter(id => id !== classItem.id)
                              })
                            }
                          }}
                        />
                        <Label htmlFor={`class-${classItem.id}`} className="text-sm">
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Matières enseignées</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une matière
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.subjects.map((subject, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Nom de la matière"
                          value={subject.name}
                          onChange={(e) => updateSubject(index, 'name', e.target.value)}
                          className="flex-1"
                        />
                        <Select
                          value={subject.classId}
                          onValueChange={(value) => updateSubject(index, 'classId', value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Classe" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockClasses.map((classItem) => (
                              <SelectItem key={classItem.id} value={classItem.id}>
                                {classItem.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Barème"
                          value={subject.maxScore}
                          onChange={(e) => updateSubject(index, 'maxScore', parseInt(e.target.value))}
                          className="w-20"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubject(index)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({...formData, isActive: checked as boolean})}
                  />
                  <Label htmlFor="isActive">Compte actif</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {editingTeacher ? 'Modifier' : 'Ajouter'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les enseignants</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
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
            <div className="text-2xl font-bold text-blue-600">{teachers.length}</div>
            <p className="text-sm text-gray-600">Total enseignants</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Enseignants actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {teachers.filter(t => !t.isActive).length}
            </div>
            <p className="text-sm text-gray-600">Enseignants inactifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {teachers.filter(t => t.lastLogin && new Date(t.lastLogin).toDateString() === new Date().toDateString()).length}
            </div>
            <p className="text-sm text-gray-600">Connectés aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des enseignants */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des enseignants</CardTitle>
          <CardDescription>
            {filteredTeachers.length} enseignant{filteredTeachers.length > 1 ? 's' : ''} trouvé{filteredTeachers.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-medium">Nom</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Téléphone</th>
                  <th className="text-left p-3 font-medium">Classes</th>
                  <th className="text-left p-3 font-medium">Matières</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                  <th className="text-left p-3 font-medium">Dernière connexion</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                        {teacher.firstNameAr && teacher.lastNameAr && (
                          <p className="text-xs text-gray-500" dir="rtl">
                            {teacher.firstNameAr} {teacher.lastNameAr}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{teacher.email}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{teacher.phone || '-'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {teacher.teacherClasses?.map((tc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tc.class.name}
                          </Badge>
                        )) || '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {teacher.taughtSubjects?.map((subject, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {subject.name}
                          </Badge>
                        )) || '-'}
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {teacher.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs">
                          {teacher.lastLogin 
                            ? new Date(teacher.lastLogin).toLocaleDateString('fr-FR')
                            : 'Jamais'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(teacher)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(teacher.id)}
                          className={teacher.isActive ? 'text-orange-600' : 'text-green-600'}
                        >
                          {teacher.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredTeachers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun enseignant trouvé
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus !== 'all' 
                    ? 'Essayez de modifier vos filtres de recherche'
                    : 'Commencez par ajouter un nouvel enseignant'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}