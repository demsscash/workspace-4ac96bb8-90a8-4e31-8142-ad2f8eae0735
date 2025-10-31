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
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  Users,
  Search,
  Filter,
  Download,
  RefreshCw,
  UserCheck,
  UserX,
  Eye,
  Edit,
  Save,
  BarChart3
} from 'lucide-react'

interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  photo?: string
  class?: {
    id: string
    name: string
  }
}

interface Attendance {
  id: string
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  reason?: string
  student: Student
  teacher: {
    firstName: string
    lastName: string
  }
}

const mockStudents: Student[] = [
  { id: '1', studentNumber: '2024-001', firstName: 'Mohamed', lastName: 'Salem', class: { id: '6', name: 'CM2' } },
  { id: '2', studentNumber: '2024-002', firstName: 'Fatima', lastName: 'Bint', class: { id: '6', name: 'CM2' } },
  { id: '3', studentNumber: '2024-003', firstName: 'Ahmed', lastName: 'Ould', class: { id: '6', name: 'CM2' } },
  { id: '4', studentNumber: '2024-004', firstName: 'Mariam', lastName: 'Sow', class: { id: '6', name: 'CM2' } },
  { id: '5', studentNumber: '2024-005', firstName: 'Cheikh', lastName: 'Dia', class: { id: '6', name: 'CM2' } },
  { id: '6', studentNumber: '2024-006', firstName: 'Aicha', lastName: 'Tall', class: { id: '6', name: 'CM2' } },
]

const mockAttendances: Attendance[] = [
  {
    id: '1',
    date: '2024-01-15T08:00:00Z',
    status: 'PRESENT',
    student: mockStudents[0],
    teacher: { firstName: 'Mme', lastName: 'Diop' }
  },
  {
    id: '2',
    date: '2024-01-15T08:00:00Z',
    status: 'ABSENT',
    reason: 'Maladie',
    student: mockStudents[1],
    teacher: { firstName: 'Mme', lastName: 'Diop' }
  },
  {
    id: '3',
    date: '2024-01-15T08:00:00Z',
    status: 'LATE',
    reason: 'Retard de transport',
    student: mockStudents[2],
    teacher: { firstName: 'Mme', lastName: 'Diop' }
  }
]

export default function AttendanceManagement() {
  const [selectedClass, setSelectedClass] = useState('6')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendances, setAttendances] = useState<Attendance[]>(mockAttendances)
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [filteredAttendances, setFilteredAttendances] = useState<Attendance[]>(mockAttendances)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('marking')
  const [isSaving, setIsSaving] = useState(false)
  const [attendanceData, setAttendanceData] = useState<{[key: string]: {status: string, reason?: string}}>({})

  useEffect(() => {
    // Initialiser les données de présence pour la date sélectionnée
    const initialData: {[key: string]: {status: string, reason?: string}} = {}
    students.forEach(student => {
      const existingAttendance = attendances.find(a => 
        a.student.id === student.id && 
        new Date(a.date).toDateString() === new Date(selectedDate).toDateString()
      )
      initialData[student.id] = {
        status: existingAttendance?.status || 'PRESENT',
        reason: existingAttendance?.reason || ''
      }
    })
    setAttendanceData(initialData)
  }, [selectedDate, students, attendances])

  useEffect(() => {
    filterAttendances()
  }, [attendances, selectedStatus, searchTerm])

  const filterAttendances = () => {
    let filtered = attendances

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(att => att.status === selectedStatus)
    }

    if (searchTerm) {
      filtered = filtered.filter(att =>
        att.student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        att.student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredAttendances(filtered)
  }

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }))
  }

  const handleReasonChange = (studentId: string, reason: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], reason }
    }))
  }

  const saveAttendance = async () => {
    setIsSaving(true)
    
    try {
      // Simuler l'appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        reason: data.reason
      }))

      // Mettre à jour l'état local
      const newAttendances = attendanceArray.map(data => {
        const student = students.find(s => s.id === data.studentId)
        return {
          id: Date.now().toString() + data.studentId,
          date: new Date(selectedDate).toISOString(),
          status: data.status as any,
          reason: data.reason,
          student: student!,
          teacher: { firstName: 'M.', lastName: 'Enseignant' }
        }
      })

      setAttendances(prev => {
        const filtered = prev.filter(a => 
          new Date(a.date).toDateString() !== new Date(selectedDate).toDateString()
        )
        return [...newAttendances, ...filtered]
      })

      alert('Présences enregistrées avec succès!')
    } catch (error) {
      alert('Erreur lors de l\'enregistrement des présences')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'ABSENT': return <XCircle className="h-5 w-5 text-red-500" />
      case 'LATE': return <Clock className="h-5 w-5 text-orange-500" />
      case 'EXCUSED': return <AlertTriangle className="h-5 w-5 text-blue-500" />
      default: return <CheckCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      PRESENT: 'bg-green-100 text-green-800',
      ABSENT: 'bg-red-100 text-red-800',
      LATE: 'bg-orange-100 text-orange-800',
      EXCUSED: 'bg-blue-100 text-blue-800'
    }
    const labels = {
      PRESENT: 'Présent',
      ABSENT: 'Absent',
      LATE: 'En retard',
      EXCUSED: 'Justifié'
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    )
  }

  const getAttendanceStats = () => {
    const todayAttendances = attendances.filter(a => 
      new Date(a.date).toDateString() === new Date(selectedDate).toDateString()
    )
    
    const total = todayAttendances.length
    const present = todayAttendances.filter(a => a.status === 'PRESENT').length
    const absent = todayAttendances.filter(a => a.status === 'ABSENT').length
    const late = todayAttendances.filter(a => a.status === 'LATE').length
    const excused = todayAttendances.filter(a => a.status === 'EXCUSED').length

    return { total, present, absent, late, excused }
  }

  const stats = getAttendanceStats()

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Présences</h2>
          <p className="text-gray-600">
            Pointage et suivi des présences des élèves
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">CM2</SelectItem>
                  <SelectItem value="5">CM1</SelectItem>
                  <SelectItem value="4">CE2</SelectItem>
                  <SelectItem value="3">CE1</SelectItem>
                  <SelectItem value="2">CP2</SelectItem>
                  <SelectItem value="1">CP1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <Label>Recherche</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un élève..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="marking">Pointage</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="marking" className="space-y-6">
          {/* Statistiques du jour */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-sm text-gray-600">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                <p className="text-sm text-gray-600">Présents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                <p className="text-sm text-gray-600">Absents</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.late}</div>
                <p className="text-sm text-gray-600">Retards</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
                <p className="text-sm text-gray-600">Justifiés</p>
              </CardContent>
            </Card>
          </div>

          {/* Tableau de pointage */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pointage - {selectedDate}</CardTitle>
                  <CardDescription>
                    Classe CM2 • {students.length} élèves
                  </CardDescription>
                </div>
                <Button onClick={saveAttendance} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-gray-500">{student.studentNumber}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Button
                        variant={attendanceData[student.id]?.status === 'PRESENT' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'PRESENT')}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Présent
                      </Button>
                      <Button
                        variant={attendanceData[student.id]?.status === 'ABSENT' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'ABSENT')}
                        className="text-xs"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Absent
                      </Button>
                      <Button
                        variant={attendanceData[student.id]?.status === 'LATE' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'LATE')}
                        className="text-xs"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Retard
                      </Button>
                      <Button
                        variant={attendanceData[student.id]?.status === 'EXCUSED' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'EXCUSED')}
                        className="text-xs"
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Justifié
                      </Button>
                    </div>
                    
                    {(attendanceData[student.id]?.status === 'ABSENT' || 
                      attendanceData[student.id]?.status === 'LATE' || 
                      attendanceData[student.id]?.status === 'EXCUSED') && (
                      <Input
                        placeholder="Raison (optionnel)"
                        value={attendanceData[student.id]?.reason || ''}
                        onChange={(e) => handleReasonChange(student.id, e.target.value)}
                        className="text-xs"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Filtres pour l'historique */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="PRESENT">Présents</SelectItem>
                    <SelectItem value="ABSENT">Absents</SelectItem>
                    <SelectItem value="LATE">Retards</SelectItem>
                    <SelectItem value="EXCUSED">Justifiés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tableau des présences */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des présences</CardTitle>
              <CardDescription>
                {filteredAttendances.length} présence{filteredAttendances.length > 1 ? 's' : ''} trouvée{filteredAttendances.length > 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Élève</th>
                      <th className="text-left p-3 font-medium">Classe</th>
                      <th className="text-left p-3 font-medium">Statut</th>
                      <th className="text-left p-3 font-medium">Raison</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendances.map((attendance) => (
                      <tr key={attendance.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {new Date(attendance.date).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{attendance.student.firstName} {attendance.student.lastName}</p>
                            <p className="text-xs text-gray-500">{attendance.student.studentNumber}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{attendance.student.class?.name}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(attendance.status)}
                            {getStatusBadge(attendance.status)}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600">
                            {attendance.reason || '-'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredAttendances.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune présence trouvée
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm || selectedStatus !== 'all' 
                        ? 'Essayez de modifier vos filtres'
                        : 'Aucune présence enregistrée pour cette période'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques de présence</CardTitle>
              <CardDescription>
                Analyse des tendances de présence et d'absence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Statistiques en cours de développement
                </h3>
                <p className="text-gray-500 mb-4">
                  Les graphiques et analyses détaillées seront bientôt disponibles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">95%</p>
                      <p className="text-sm text-gray-600">Taux de présence mensuel</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">5%</p>
                      <p className="text-sm text-gray-600">Taux d'absence mensuel</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-orange-600">2%</p>
                      <p className="text-sm text-gray-600">Taux de retard mensuel</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}