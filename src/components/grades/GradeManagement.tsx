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
  Plus, 
  Calculator, 
  FileText, 
  Download,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Award,
  BarChart3,
  Users
} from 'lucide-react'

// Configuration des barèmes mauritaniens
const MAURITANIAN_GRADES = {
  'CP1': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Éveil': 10 },
  'CP2': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Éveil': 10 },
  'CE1': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Sciences': 10 },
  'CE2': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Sciences': 10 },
  'CM1': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 40, 'Histoire-Géographie': 10 },
  'CM2': { 'Arabe': 30, 'Français': 20, 'Mathématiques': 50, 'Sciences': 40, 'Histoire-Géographie': 10 }
}

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

interface Grade {
  id: string
  score: number
  maxScore: number
  percentage: number
  term: string
  examType: string
  comment?: string
  student: Student
  subject: {
    id: string
    name: string
    maxScore: number
  }
}

interface GradeResult {
  student: Student
  subjectScores: { [key: string]: { score: number; maxScore: number; percentage: number } }
  generalAverage: number
  totalObtained: number
  totalPossible: number
  rank: number
  totalStudents: number
}

const mockStudents: Student[] = [
  { id: '1', studentNumber: '2024-001', firstName: 'Mohamed', lastName: 'Salem', class: { id: '6', name: 'CM2' } },
  { id: '2', studentNumber: '2024-002', firstName: 'Fatima', lastName: 'Bint', class: { id: '6', name: 'CM2' } },
  { id: '3', studentNumber: '2024-003', firstName: 'Ahmed', lastName: 'Ould', class: { id: '6', name: 'CM2' } },
  { id: '4', studentNumber: '2024-004', firstName: 'Mariam', lastName: 'Sow', class: { id: '6', name: 'CM2' } },
]

const mockGrades: Grade[] = [
  {
    id: '1',
    score: 45,
    maxScore: 50,
    percentage: 90,
    term: 'T1',
    examType: 'DS',
    student: mockStudents[0],
    subject: { id: '1', name: 'Mathématiques', maxScore: 50 }
  },
  {
    id: '2',
    score: 25,
    maxScore: 30,
    percentage: 83.33,
    term: 'T1',
    examType: 'DS',
    student: mockStudents[0],
    subject: { id: '2', name: 'Arabe', maxScore: 30 }
  }
]

export default function GradeManagement() {
  const [selectedClass, setSelectedClass] = useState('CM2')
  const [selectedTerm, setSelectedTerm] = useState('T1')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [grades, setGrades] = useState<Grade[]>(mockGrades)
  const [gradeResults, setGradeResults] = useState<GradeResult[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('input')
  const [showResults, setShowResults] = useState(false)

  // Formulaire de saisie
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    score: '',
    term: 'T1',
    examType: 'DS',
    comment: ''
  })

  const subjects = Object.keys(MAURITANIAN_GRADES[selectedClass as keyof typeof MAURITANIAN_GRADES] || {})
  const maxScore = selectedSubject ? MAURITANIAN_GRADES[selectedClass as keyof typeof MAURITANIAN_GRADES][selectedSubject] : 0

  const calculateMauritanianAverage = (studentGrades: Grade[]) => {
    let totalObtained = 0
    let totalPossible = 0
    
    studentGrades.forEach(grade => {
      totalObtained += grade.score
      totalPossible += grade.maxScore
    })
    
    return totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100 * 100) / 100 : 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const score = parseFloat(formData.score)
    if (isNaN(score) || score < 0 || score > maxScore) {
      alert(`Veuillez entrer une note valide entre 0 et ${maxScore}`)
      return
    }

    const student = mockStudents.find(s => s.id === formData.studentId)
    if (!student) return

    const newGrade: Grade = {
      id: Date.now().toString(),
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100 * 100) / 100,
      term: formData.term,
      examType: formData.examType,
      comment: formData.comment,
      student,
      subject: {
        id: formData.subjectId,
        name: selectedSubject,
        maxScore
      }
    }

    setGrades([...grades, newGrade])
    
    // Reset form
    setFormData({
      studentId: '',
      subjectId: '',
      score: '',
      term: 'T1',
      examType: 'DS',
      comment: ''
    })
    setIsAddDialogOpen(false)
  }

  const calculateClassAverages = () => {
    const results: GradeResult[] = mockStudents.map(student => {
      const studentGrades = grades.filter(g => g.student.id === student.id && g.term === selectedTerm)
      
      const subjectScores: { [key: string]: { score: number; maxScore: number; percentage: number } } = {}
      let totalObtained = 0
      let totalPossible = 0
      
      studentGrades.forEach(grade => {
        subjectScores[grade.subject.name] = {
          score: grade.score,
          maxScore: grade.maxScore,
          percentage: grade.percentage
        }
        totalObtained += grade.score
        totalPossible += grade.maxScore
      })
      
      const generalAverage = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 100 * 100) / 100 : 0
      
      return {
        student,
        subjectScores,
        generalAverage,
        totalObtained,
        totalPossible,
        rank: 0, // Sera calculé après le tri
        totalStudents: mockStudents.length
      }
    })
    
    // Trier et calculer les rangs
    results.sort((a, b) => b.generalAverage - a.generalAverage)
    results.forEach((result, index) => {
      result.rank = index + 1
    })
    
    setGradeResults(results)
    setShowResults(true)
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (percentage >= 60) return <Badge className="bg-blue-100 text-blue-800">Bien</Badge>
    if (percentage >= 50) return <Badge className="bg-orange-100 text-orange-800">Passable</Badge>
    return <Badge className="bg-red-100 text-red-800">Insuffisant</Badge>
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Système de Notation Mauritanien</h2>
          <p className="text-gray-600">
            Gestion des notes selon le barème officiel mauritanien
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={calculateClassAverages}>
            <Calculator className="h-4 w-4 mr-2" />
            Calculer les moyennes
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Bulletin
          </Button>
        </div>
      </div>

      {/* Configuration des barèmes */}
      <Card>
        <CardHeader>
          <CardTitle>Barèmes {selectedClass}</CardTitle>
          <CardDescription>
            Configuration des barèmes selon le système éducatif mauritanien
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(MAURITANIAN_GRADES[selectedClass as keyof typeof MAURITANIAN_GRADES]).map(([subject, maxScore]) => (
              <div key={subject} className="text-center p-3 border rounded-lg">
                <p className="font-medium text-sm">{subject}</p>
                <p className="text-2xl font-bold text-blue-600">{maxScore}</p>
                <p className="text-xs text-gray-500">points</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Total:</strong> {Object.values(MAURITANIAN_GRADES[selectedClass as keyof typeof MAURITANIAN_GRADES]).reduce((a, b) => a + b, 0)} points</p>
            <p className="text-xs mt-1">La moyenne est calculée en divisant le total obtenu par le total possible</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="input">Saisie des notes</TabsTrigger>
          <TabsTrigger value="view">Consultation</TabsTrigger>
          <TabsTrigger value="results">Résultats et classement</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
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
                      {Object.keys(MAURITANIAN_GRADES).map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Trimestre</Label>
                  <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T1">1er Trimestre</SelectItem>
                      <SelectItem value="T2">2ème Trimestre</SelectItem>
                      <SelectItem value="T3">3ème Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Matière</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une matière" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject} ({MAURITANIAN_GRADES[selectedClass as keyof typeof MAURITANIAN_GRADES][subject]} pts)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tableau de saisie */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Saisie des notes - {selectedSubject}</CardTitle>
                  <CardDescription>
                    Trimestre {selectedTerm} • Barème: {maxScore} points
                  </CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!selectedSubject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Saisir une note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Saisie de note</DialogTitle>
                      <DialogDescription>
                        {selectedSubject} • Barème: {maxScore} points
                      </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Élève</Label>
                        <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un élève" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockStudents.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.firstName} {student.lastName} ({student.studentNumber})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Note ({maxScore} points)</Label>
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          max={maxScore}
                          placeholder={`0 - ${maxScore}`}
                          value={formData.score}
                          onChange={(e) => setFormData({...formData, score: e.target.value})}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Type d'évaluation</Label>
                          <Select value={formData.examType} onValueChange={(value) => setFormData({...formData, examType: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DS">Devoir Surveillé</SelectItem>
                              <SelectItem value="Composition">Composition</SelectItem>
                              <SelectItem value="Interrogation">Interrogation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Trimestre</Label>
                          <Select value={formData.term} onValueChange={(value) => setFormData({...formData, term: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="T1">T1</SelectItem>
                              <SelectItem value="T2">T2</SelectItem>
                              <SelectItem value="T3">T3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Commentaire (optionnel)</Label>
                        <Textarea
                          placeholder="Observations sur la performance..."
                          value={formData.comment}
                          onChange={(e) => setFormData({...formData, comment: e.target.value})}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Annuler
                        </Button>
                        <Button type="submit">
                          Enregistrer
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium">Élève</th>
                      <th className="text-left p-3 font-medium">Note</th>
                      <th className="text-left p-3 font-medium">Barème</th>
                      <th className="text-left p-3 font-medium">Pourcentage</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades
                      .filter(g => g.subject.name === selectedSubject && g.term === selectedTerm)
                      .map((grade) => (
                      <tr key={grade.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{grade.student.firstName} {grade.student.lastName}</p>
                            <p className="text-xs text-gray-500">{grade.student.studentNumber}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`font-bold ${getGradeColor(grade.percentage)}`}>
                            {grade.score}
                          </span>
                        </td>
                        <td className="p-3">{grade.maxScore}</td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${getGradeColor(grade.percentage)}`}>
                              {grade.percentage}%
                            </span>
                            {getGradeBadge(grade.percentage)}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{grade.examType}</Badge>
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {grades.filter(g => g.subject.name === selectedSubject && g.term === selectedTerm).length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune note saisie
                    </h3>
                    <p className="text-gray-500">
                      Commencez par saisir des notes pour {selectedSubject}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notes par élève</CardTitle>
              <CardDescription>
                Consultation de toutes les notes par élève
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockStudents.map((student) => {
                  const studentGrades = grades.filter(g => g.student.id === student.id)
                  const average = calculateMauritanianAverage(studentGrades)
                  
                  return (
                    <div key={student.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium text-lg">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{student.studentNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Moyenne générale</p>
                          <p className={`text-2xl font-bold ${getGradeColor(average)}`}>
                            {average}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studentGrades.map((grade) => (
                          <div key={grade.id} className="border rounded p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-sm">{grade.subject.name}</p>
                              <Badge variant="outline" className="text-xs">
                                {grade.term}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`font-bold ${getGradeColor(grade.percentage)}`}>
                                {grade.score}/{grade.maxScore}
                              </span>
                              <span className={`text-sm ${getGradeColor(grade.percentage)}`}>
                                {grade.percentage}%
                              </span>
                            </div>
                            {grade.comment && (
                              <p className="text-xs text-gray-500 mt-2">{grade.comment}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {showResults && gradeResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Classement - {selectedClass}</CardTitle>
                <CardDescription>
                  Trimestre {selectedTerm} • {gradeResults.length} élèves
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradeResults.map((result, index) => (
                    <div key={result.student.id} className={`border rounded-lg p-4 ${index < 3 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold">
                            {result.rank}
                          </div>
                          {result.rank === 1 && <Award className="h-5 w-5 text-yellow-500" />}
                          <div>
                            <h3 className="font-medium">
                              {result.student.firstName} {result.student.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{result.student.studentNumber}</p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Moyenne</p>
                          <p className={`text-2xl font-bold ${getGradeColor(result.generalAverage)}`}>
                            {result.generalAverage}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {result.totalObtained}/{result.totalPossible} points
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(result.subjectScores).map(([subject, score]) => (
                          <div key={subject} className="text-center p-2 bg-white rounded border">
                            <p className="text-xs font-medium">{subject}</p>
                            <p className={`font-bold ${getGradeColor(score.percentage)}`}>
                              {score.score}/{score.maxScore}
                            </p>
                            <p className="text-xs text-gray-500">{score.percentage}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {!showResults && (
            <Card>
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Calculer les résultats
                </h3>
                <p className="text-gray-500 mb-4">
                  Cliquez sur "Calculer les moyennes" pour voir les résultats et le classement
                </p>
                <Button onClick={calculateClassAverages}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculer maintenant
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}