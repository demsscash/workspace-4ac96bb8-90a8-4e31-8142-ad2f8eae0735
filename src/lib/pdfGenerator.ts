import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface Student {
  id: string
  studentNumber: string
  firstName: string
  lastName: string
  firstNameAr?: string
  lastNameAr?: string
  dateOfBirth: string
  class?: {
    name: string
    level: string
  }
}

interface Grade {
  subject: string
  score: number
  maxScore: number
  percentage: number
  term: string
}

interface BulletinData {
  student: Student
  grades: Grade[]
  term: string
  year: string
  schoolName: string
  schoolAddress: string
  directorName: string
  classTeacher: string
}

export async function generateBulletinPDF(data: BulletinData): Promise<Uint8Array> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Configuration des polices
  pdf.setFont('helvetica', 'normal', 12)
  
  // Couleurs
  const primaryColor = [0, 102, 51] // Vert mauritanien
  const headerColor = [41, 128, 185] // Bleu
  const textColor = [0, 0, 0]
  const lightGray = [245, 245, 245]

  // En-tête
  pdf.setFillColor(headerColor)
  pdf.rect(0, 0, 210, 40)
  pdf.setFillColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold', 16)
  pdf.text('BULLETIN SCOLAIRE', 105, 15, { align: 'center' })
  pdf.setFont('hex', 'normal', 10)
  pdf.text('République Islamique de Mauritanie', 105, 25, { align: 'center' })
  
  // Informations de l'école
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text(data.schoolName, 20, 55)
  pdf.setFont('helvetica', 'normal', 10)
  pdf.text(data.schoolAddress, 20, 65)
  pdf.text(`Année scolaire ${data.year}`, 20, 75)
  pdf.text(`Trimestre ${data.term}`, 20, 85)

  // Informations de l'élève
  pdf.setFillColor(lightGray)
  pdf.rect(20, 100, 170, 40)
  pdf.setFillColor(255, 255, 255)
  pdf.setFont('hex', 'bold', 12)
  pdf.text('Élève :', 25, 110)
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text(`${data.student.firstName} ${data.student.lastName}`, 70, 110)
  pdf.setFont('helvetica', 'normal', 10)
  pdf.text(`N° : ${data.student.studentNumber}`, 70, 120)
  pdf.text(`Classe : ${data.student.class?.name || ''}`, 70, 130)
  pdf.text(`Né(e) le : ${new Date(data.student.dateOfBirth).toLocaleDateString('fr-FR')}`, 70, 140)

  // Photo placeholder
  pdf.setFillColor(lightGray)
  pdf.rect(150, 105, 30, 30)
  pdf.text('Photo', 165, 122, { align: 'center' })

  // Tableau des notes
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text('RÉSULTATS SCOLAIRES', 20, 160)
  
  // En-têtes du tableau
  const headers = ['Matière', 'Note', 'Barème', 'Pourcentage', 'Appréciation']
  const headerWidths = [60, 30, 30, 30, 50]
  let xPos = 20
  
  headers.forEach((header, index) => {
    pdf.setFillColor(primaryColor)
    pdf.rect(xPos, 175, headerWidths[index], 10)
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold', 10)
    pdf.text(header, xPos + 2, 180, { align: 'center' })
    xPos += headerWidths[index]
  })

  // Données des notes
  let yPos = 190
  let totalObtained = 0
  let totalPossible = 0

  data.grades.forEach((grade) => {
    pdf.setFillColor(yPos % 2 === 0 ? lightGray : [255, 255, 255])
    pdf.rect(20, yPos, 170, 15)
    
    pdf.setTextColor(textColor)
    pdf.setFont('helvetica', 'normal', 10)
    pdf.text(grade.subject, 22, yPos + 3)
    pdf.text(grade.score.toString(), 85, yPos + 3, { align: 'center' })
    pdf.text(`/${grade.maxScore}`, 115, yPos + 3, { align: 'center' })
    pdf.text(`${grade.percentage}%`, 145, yPos + 3, { align: 'center' })
    
    // Appréciation
    let appreciation = ''
    if (grade.percentage >= 80) appreciation = 'Excellent'
    else if (grade.percentage >= 60) appreciation = 'Bien'
    else if (grade.percentage >= 50) appreciation = 'Passable'
    else appreciation = 'À améliorer'
    
    pdf.text(appreciation, 175, yPos + 3, { align: 'center' })
    
    totalObtained += grade.score
    totalPossible += grade.maxScore
    yPos += 15
  })

  // Ligne de séparation
  pdf.setDrawColor(200, 200, 200)
  pdf.line(20, yPos + 5, 190, yPos + 5)

  // Moyenne générale
  const generalAverage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0
  yPos += 15
  
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text('MOYENNE GÉNÉRALE', 20, yPos)
  pdf.setFont('helvetica', 'bold', 16)
  pdf.text(`${generalAverage.toFixed(2)}%`, 150, yPos)
  
  // Appréciation générale
  let generalAppreciation = ''
  if (generalAverage >= 80) generalAppreciation = 'Excellent'
  else if (generalAverage >= 60) generalAppreciation = 'Très bon travail'
  else if (generalAverage >= 50) generalAppreciation = 'Bon travail'
  else generalAppreciation = 'Peut mieux faire'
  
  pdf.setFont('helvetica', 'italic', 10)
  pdf.text(generalAppreciation, 20, yPos + 10)

  // Section des observations
  yPos += 30
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text('OBSERVATIONS', 20, yPos)
  
  pdf.setFillColor(lightGray)
  pdf.rect(20, yPos + 10, 170, 40)
  pdf.setFillColor(255, 255, 255)
  pdf.setFont('helvetica', 'normal', 10)
  pdf.text('Aucune observation enregistrée pour ce trimestre.', 25, yPos + 25)

  // Signatures
  yPos += 70
  pdf.setFont('helvetica', 'bold', 10)
  pdf.text('SIGNATURES', 20, yPos)
  
  pdf.setFont('helvetica', 'normal', 9)
  pdf.text('Le Directeur', 30, yPos + 15)
  pdf.text('_________________________', 30, yPos + 25)
  pdf.text(`${data.directorName}`, 30, yPos + 35)
  
  pdf.text('Le Professeur Principal', 120, yPos + 15)
  pdf.text('_________________________', 120, yPos + 25)
  pdf.text(`${data.classTeacher}`, 120, yPos + 35)

  // Pied de page
  pdf.setFont('helvetica', 'italic', 8)
  pdf.text('Fait à Nouakchott, le ' + new Date().toLocaleDateString('fr-FR'), 20, 280, { align: 'center' })
  pdf.text('Page 1/1', 20, 290, { align: 'center' })

  // Convertir en Uint8Array
  const pdfBytes = pdf.output('arraybuffer')
  return new Uint8Array(pdfBytes)
}

export async function generateCertificatePDF(student: Student): Promise<Uint8Array> {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  // Configuration des polices
  pdf.setFont('helvetica', 'normal', 12)
  
  // Couleurs
  const primaryColor = [0, 102, 51] // Vert mauritanien
  const headerColor = [41, 128, 185] // Bleu
  const textColor = [0, 0, 0]

  // En-tête
  pdf.setFillColor(headerColor)
  pdf.rect(0, 0, 297, 40)
  pdf.setFillColor(255, 255, 255)
  pdf.setFont('helvetica', 'bold', 20)
  pdf.text('CERTIFICAT DE SCOLARITÉ', 148.5, 15, { align: 'center' })
  pdf.setFont('helvetica', 'normal', 12)
  pdf.text('République Islamique de Mauritanie', 148.5, 25, { align: 'center' })

  // Informations de l'école
  pdf.setFont('helvetica', 'bold', 14)
  pdf.text('École Primaire Nouakchott', 148.5, 50, { align: 'center' })
  pdf.setFont('helvetica', 'normal', 10)
  pdf.text('Avenue Gamal Abdel Nasser, Nouakchott', 148.5, 60, { align: 'center' })
  pdf.text(`Tél: +222 456 789 012`, 148.5, 70, { align: 'center' })
  pdf.text(`Email: contact@ecole-nouakchott.mr`, 148.5, 80, { align: 'center' })

  // Cadre principal
  pdf.setDrawColor(0, 0, 0)
  pdf.rect(20, 100, 257, 120)

  // Titre
  pdf.setFont('helvetica', 'bold', 16)
  pdf.text('CERTIFICAT DE SCOLARITÉ', 148.5, 120, { align: 'center' })

  // Informations de l'élève
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text('Élève :', 40, 140)
  pdf.setFont('helvetica', 'bold', 12)
  pdf.text(`Nom : ${student.firstName} ${student.lastName}`, 40, 155)
  pdf.setFont('helvetica', 'normal', 10)
  pdf.text(`Né(e) le : ${new Date(student.dateOfBirth).toLocaleDateString('fr-FR')}`, 40, 170)
  pdf.text(`Lieu de naissance : ${student.placeOfBirth || 'Nouakchott'}`, 40, 180)
  pdf.text(`Numéro : ${student.studentNumber}`, 40, 190)
  pdf.text(`Classe : ${student.class?.name || ''}`, 40, 200)

  // Texte du certificat
  pdf.setFont('helvetica', 'justify', 11)
  const certText = `Le soussigné certifie que l'élève susnommé a fréquenté l'école primaire Nouakchott pendant l'année scolaire ${new Date().getFullYear()}. L'élève a suivi avec assiduité les programmes d'enseignement définis par le Ministère de l'Éducation Nationale et a satisfait aux exigences de passage au niveau supérieur.`
  
  const lines = pdf.splitTextToSize(certText, 217)
  let yPos = 230
  
  lines.forEach(line => {
    pdf.text(line, 40, yPos)
    yPos += 7
  })

  // Date et signature
  yPos += 20
  pdf.setFont('helvetica', 'normal', 10)
  pdf.text(`Fait à Nouakchott, le ${new Date().toLocaleDateString('fr-FR')}`, 40, yPos)
  
  yPos += 30
  pdf.text('Le Directeur', 40, yPos)
  pdf.text('_________________________', 40, yPos + 10)
  pdf.text('Signature', 40, yPos + 20)

  // Pied de page
  pdf.setFont('helvetica', 'italic', 8)
  pdf.text('Ce certificat est délivré pour valoir ce qu\'il contient.', 40, 270, { align: 'center' })
  pdf.text('Numéro d\'enregistrement : EPN-2024-001', 40, 280, { align: 'center' })

  // Convertir en Uint8Array
  const pdfBytes = pdf.output('arraybuffer')
  return new Uint8Array(pdfBytes)
}