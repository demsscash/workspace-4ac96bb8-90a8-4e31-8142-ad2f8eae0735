import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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

interface Class {
  id: string
  name: string
  level: string
  students: number
  teacher: string
  capacity: number
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStudents()
    fetchClasses()
  }, [])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (!response.ok) throw new Error('Failed to fetch students')
      const data = await response.json()
      setStudents(data.students || [])
    } catch (err) {
      console.error('Error fetching students:', err)
      setError('Erreur lors du chargement des élèves')
    } finally {
      setLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      // Pour l'instant, données mock pour les classes
      const mockClasses: Class[] = [
        { id: '1', name: 'CP1', level: 'Primaire', students: 38, teacher: 'Mme. Diop', capacity: 40 },
        { id: '2', name: 'CP2', level: 'Primaire', students: 42, teacher: 'M. Ba', capacity: 40 },
        { id: '3', name: 'CE1', level: 'Primaire', students: 35, teacher: 'Mme. Fall', capacity: 40 },
        { id: '4', name: 'CE2', level: 'Primaire', students: 39, teacher: 'M. Ndiaye', capacity: 40 },
        { id: '5', name: 'CM1', level: 'Primaire', students: 41, teacher: 'Mme. Sarr', capacity: 40 },
        { id: '6', name: 'CM2', level: 'Primaire', students: 40, teacher: 'M. Sy', capacity: 40 },
      ]
      setClasses(mockClasses)
    } catch (err) {
      console.error('Error fetching classes:', err)
    }
  }

  const handleAddStudent = async (studentData: any) => {
    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      })
      
      if (!response.ok) throw new Error('Failed to add student')
      
      const newStudent = await response.json()
      setStudents(prev => [newStudent.student, ...prev])
    } catch (err) {
      console.error('Error adding student:', err)
      setError('Erreur lors de l\'ajout de l\'élève')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h2>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement des élèves...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h2>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                fetchStudents()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Élèves</h2>
          <p className="text-gray-600">
            {students.length} élève{students.length > 1 ? 's' : ''} inscrit{students.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {student.firstName} {student.lastName}
              </CardTitle>
              <CardDescription>
                {student.studentNumber}
                {student.class && ` • ${student.class.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Statut</span>
                <span className="text-sm font-medium text-green-600">Actif</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {students.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">Aucun élève trouvé</p>
            <button 
              onClick={fetchStudents}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Actualiser
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}