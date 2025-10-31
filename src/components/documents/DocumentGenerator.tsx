'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  FileText,
  Download,
  Send,
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  Eye
} from 'lucide-react'

interface DocumentTemplate {
  id: string
  name: string
  description: string
  type: 'report' | 'certificate' | 'transcript' | 'attendance' | 'custom'
  category: string
}

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'bulletin',
    name: 'Bulletin scolaire',
    description: 'Bulletin trimestriel avec notes et appréciations',
    type: 'report',
    category: 'académique'
  },
  {
    id: 'certificat',
    name: 'Certificat de scolarité',
    description: 'Attestation de présence dans l établissement',
    type: 'certificate',
    category: 'administratif'
  },
  {
    id: 'releve',
    name: 'Relevé de notes',
    description: 'Relevé détaillé des notes par matière',
    type: 'transcript',
    category: 'académique'
  },
  {
    id: 'presence',
    name: 'Rapport de présence',
    description: 'Statistiques des présences/absences',
    type: 'attendance',
    category: 'discipline'
  },
  {
    id: 'conduite',
    name: 'Certificat de bonne conduite',
    description: 'Attestation de comportement',
    type: 'certificate',
    category: 'discipline'
  }
]

const mockClasses = [
  { id: '1', name: 'CP1', level: 'Primaire' },
  { id: '2', name: 'CP2', level: 'Primaire' },
  { id: '3', name: 'CE1', level: 'Primaire' },
  { id: '4', name: 'CE2', level: 'Primaire' },
  { id: '5', name: 'CM1', level: 'Primaire' },
  { id: '6', name: 'CM2', level: 'Primaire' }
]

const mockStudents = [
  { id: '1', name: 'Mohamed Salem', class: 'CM2' },
  { id: '2', name: 'Fatima Bint', class: 'CE1' },
  { id: '3', name: 'Ahmed Ould', class: 'CP2' },
  { id: '4', name: 'Mariam Sow', class: 'CM1' }
]

export default function DocumentGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [term, setTerm] = useState<string>('T1')
  const [includeComments, setIncludeComments] = useState(true)
  const [includeAttendance, setIncludeAttendance] = useState(true)
  const [customMessage, setCustomMessage] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const getTemplateIcon = (type: string) => {
    switch (type) {
      case 'report': return <BookOpen className="h-5 w-5 text-blue-500" />
      case 'certificate': return <GraduationCap className="h-5 w-5 text-green-500" />
      case 'transcript': return <FileText className="h-5 w-5 text-purple-500" />
      case 'attendance': return <Calendar className="h-5 w-5 text-orange-500" />
      default: return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const handleGenerateDocument = async () => {
    if (!selectedTemplate || selectedStudents.length === 0) return

    setIsGenerating(true)

    // Simuler la génération de document
    setTimeout(() => {
      setIsGenerating(false)
      // Logique de génération réelle serait implémentée ici
      console.log('Génération du document:', {
        template: selectedTemplate,
        students: selectedStudents,
        term,
        options: {
          includeComments,
          includeAttendance,
          customMessage
        }
      })
    }, 2000)
  }

  const handlePreview = () => {
    // Logique de prévisualisation
    console.log('Prévisualisation du document')
  }

  const selectedTemplateData = documentTemplates.find(t => t.id === selectedTemplate)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Générateur de Documents</h2>
          <p className="text-gray-500">Créez et générez des documents scolaires automatiquement</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Prévisualiser
          </Button>
          <Button
            onClick={handleGenerateDocument}
            disabled={!selectedTemplate || selectedStudents.length === 0 || isGenerating}
          >
            {isGenerating ? (
              <>Génération...</>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Générer
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection du modèle */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Type de document</CardTitle>
            <CardDescription>Choisissez le modèle de document</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {documentTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start space-x-3">
                    {getTemplateIcon(template.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration du document */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
            <CardDescription>Paramètres du document</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="class">Classe</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une classe" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedTemplateData?.type !== 'certificate' && (
              <div>
                <Label htmlFor="term">Période</Label>
                <Select value={term} onValueChange={setTerm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="T1">Trimestre 1</SelectItem>
                    <SelectItem value="T2">Trimestre 2</SelectItem>
                    <SelectItem value="T3">Trimestre 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="comments"
                  checked={includeComments}
                  onCheckedChange={(checked) => setIncludeComments(checked as boolean)}
                />
                <Label htmlFor="comments">Inclure les commentaires</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="attendance"
                  checked={includeAttendance}
                  onCheckedChange={(checked) => setIncludeAttendance(checked as boolean)}
                />
                <Label htmlFor="attendance">Inclure les statistiques de présence</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message personnalisé (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Ajoutez un message personnalisé..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Sélection des élèves */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Élèves concernés</CardTitle>
            <CardDescription>Sélectionnez les élèves</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedClass ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">
                    {selectedStudents.length} élève(s) sélectionné(s)
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedStudents.length === mockStudents.length) {
                        setSelectedStudents([])
                      } else {
                        setSelectedStudents(mockStudents.map(s => s.id))
                      }
                    }}
                  >
                    {selectedStudents.length === mockStudents.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                  </Button>
                </div>
                {mockStudents.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedStudents([...selectedStudents, student.id])
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id))
                        }
                      }}
                    />
                    <Label htmlFor={student.id} className="flex-1">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.class}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Sélectionnez d'abord une classe</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Aperçu du document</CardTitle>
            <CardDescription>Prévisualisation du modèle sélectionné</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">{selectedTemplateData?.name}</h3>
              <p className="text-gray-500 mb-4">{selectedTemplateData?.description}</p>
              <div className="text-sm text-gray-400">
                {selectedStudents.length > 0 && (
                  <p>{selectedStudents.length} document(s) seront générés</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}