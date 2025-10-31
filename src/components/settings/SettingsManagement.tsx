'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Settings,
  School,
  Users,
  Bell,
  Shield,
  Database,
  Globe,
  Palette,
  Mail,
  Smartphone,
  Save,
  Upload,
  Download,
  Key,
  Eye,
  EyeOff
} from 'lucide-react'

interface SchoolSettings {
  name: string
  nameAr: string
  address: string
  phone: string
  email: string
  logo: string
  website: string
  schoolYear: string
  maxStudentsPerClass: number
  workingDays: string[]
  workingHours: {
    start: string
    end: string
  }
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  absenceAlerts: boolean
  gradeAlerts: boolean
  meetingReminders: boolean
  paymentReminders: boolean
  automaticReports: boolean
}

interface SystemSettings {
  language: 'fr' | 'ar' | 'both'
  timezone: string
  dateFormat: string
  currency: string
  theme: 'light' | 'dark' | 'auto'
  dataRetention: number
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  twoFactorAuth: boolean
  sessionTimeout: number
}

export default function SettingsManagement() {
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>({
    name: 'École Primaire Nouakchott',
    nameAr: 'مدرسة نواكشوط الابتدائية',
    address: 'Avenue des Nations, Nouakchott, Mauritanie',
    phone: '+222 12345678',
    email: 'contact@ecole-nouakchott.mr',
    logo: '',
    website: 'www.ecole-nouakchott.mr',
    schoolYear: '2024-2025',
    maxStudentsPerClass: 40,
    workingDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    workingHours: {
      start: '08:00',
      end: '16:00'
    }
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    absenceAlerts: true,
    gradeAlerts: true,
    meetingReminders: true,
    paymentReminders: true,
    automaticReports: false
  })

  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    language: 'both',
    timezone: 'Africa/Nouakchott',
    dateFormat: 'DD/MM/YYYY',
    currency: 'MRU',
    theme: 'light',
    dataRetention: 365,
    backupFrequency: 'daily',
    twoFactorAuth: false,
    sessionTimeout: 8
  })

  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSaveSettings = async (section: string) => {
    setSaving(true)
    // Simuler la sauvegarde
    setTimeout(() => {
      setSaving(false)
      console.log(`Settings ${section} saved:`, {
        schoolSettings,
        notificationSettings,
        systemSettings
      })
    }, 1500)
  }

  const handleBackupData = () => {
    console.log('Starting backup...')
    // Logique de sauvegarde
  }

  const handleImportData = () => {
    console.log('Starting import...')
    // Logique d'importation
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Paramètres du Système</h2>
          <p className="text-gray-500">Configurez les paramètres de l'école et du système</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleImportData}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>
          <Button variant="outline" onClick={handleBackupData}>
            <Download className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="school" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="school" className="flex items-center space-x-2">
            <School className="h-4 w-4" />
            <span>École</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Système</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* Paramètres de l'école */}
        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
              <CardDescription>Informations de base sur l'établissement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schoolName">Nom de l'école</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.name}
                    onChange={(e) => setSchoolSettings({...schoolSettings, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="schoolNameAr">Nom de l'école (arabe)</Label>
                  <Input
                    id="schoolNameAr"
                    value={schoolSettings.nameAr}
                    onChange={(e) => setSchoolSettings({...schoolSettings, nameAr: e.target.value})}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={schoolSettings.address}
                    onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={schoolSettings.phone}
                    onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={schoolSettings.website}
                    onChange={(e) => setSchoolSettings({...schoolSettings, website: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="schoolYear">Année scolaire</Label>
                  <Input
                    id="schoolYear"
                    value={schoolSettings.schoolYear}
                    onChange={(e) => setSchoolSettings({...schoolSettings, schoolYear: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxStudents">Max élèves par classe</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={schoolSettings.maxStudentsPerClass}
                    onChange={(e) => setSchoolSettings({...schoolSettings, maxStudentsPerClass: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label>Logo de l'école</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="flex-1"
                    />
                    <Button variant="outline">Uploader</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Heure de début</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={schoolSettings.workingHours.start}
                    onChange={(e) => setSchoolSettings({
                      ...schoolSettings,
                      workingHours: {...schoolSettings.workingHours, start: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">Heure de fin</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={schoolSettings.workingHours.end}
                    onChange={(e) => setSchoolSettings({
                      ...schoolSettings,
                      workingHours: {...schoolSettings.workingHours, end: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('school')} disabled={saving}>
                  {saving ? 'Sauvegarde...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres de notification */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>Configurez comment et quand envoyer les notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Canaux de notification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="emailNotif">Notifications par email</Label>
                    </div>
                    <Switch
                      id="emailNotif"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <Label htmlFor="smsNotif">Notifications SMS</Label>
                    </div>
                    <Switch
                      id="smsNotif"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="pushNotif">Notifications push</Label>
                    </div>
                    <Switch
                      id="pushNotif"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        pushNotifications: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Types d'alertes</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="absenceAlerts">Alertes d'absence</Label>
                    <Switch
                      id="absenceAlerts"
                      checked={notificationSettings.absenceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        absenceAlerts: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="gradeAlerts">Alertes de notes</Label>
                    <Switch
                      id="gradeAlerts"
                      checked={notificationSettings.gradeAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        gradeAlerts: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="meetingReminders">Rappels de réunion</Label>
                    <Switch
                      id="meetingReminders"
                      checked={notificationSettings.meetingReminders}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        meetingReminders: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="paymentReminders">Rappels de paiement</Label>
                    <Switch
                      id="paymentReminders"
                      checked={notificationSettings.paymentReminders}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        paymentReminders: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoReports">Rapports automatiques</Label>
                    <Switch
                      id="autoReports"
                      checked={notificationSettings.automaticReports}
                      onCheckedChange={(checked) => setNotificationSettings({
                        ...notificationSettings,
                        automaticReports: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('notifications')} disabled={saving}>
                  {saving ? 'Sauvegarde...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paramètres système */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration générale</CardTitle>
                <CardDescription>Paramètres de base du système</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="language">Langue principale</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => setSystemSettings({...systemSettings, language: value as SystemSettings['language']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="both">Bilingue (Français/Arabe)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => setSystemSettings({...systemSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Nouakchott">Nouakchott (GMT+0)</SelectItem>
                      <SelectItem value="Africa/Dakar">Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dateFormat">Format de date</Label>
                  <Select value={systemSettings.dateFormat} onValueChange={(value) => setSystemSettings({...systemSettings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Devise</Label>
                  <Select value={systemSettings.currency} onValueChange={(value) => setSystemSettings({...systemSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MRU">MRU - Ouguiya mauritanienne</SelectItem>
                      <SelectItem value="XOF">XOF - Franc CFA</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Thème</Label>
                  <Select value={systemSettings.theme} onValueChange={(value) => setSystemSettings({...systemSettings, theme: value as SystemSettings['theme']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gestion des données</CardTitle>
                <CardDescription>Sauvegarde et rétention des données</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dataRetention">Période de rétention (jours)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    value={systemSettings.dataRetention}
                    onChange={(e) => setSystemSettings({...systemSettings, dataRetention: parseInt(e.target.value)})}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Les données plus anciennes seront archivées
                  </p>
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Fréquence de sauvegarde</Label>
                  <Select value={systemSettings.backupFrequency} onValueChange={(value) => setSystemSettings({...systemSettings, backupFrequency: value as SystemSettings['backupFrequency']})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sessionTimeout">Timeout de session (heures)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="24"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Déconnexion automatique après inactivité
                  </p>
                </div>

                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-3">Actions de maintenance</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="h-4 w-4 mr-2" />
                      Nettoyer la base de données
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter les données
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurer depuis une sauvegarde
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => handleSaveSettings('system')} disabled={saving}>
              {saving ? 'Sauvegarde...' : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Paramètres de sécurité */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Configurez les options de sécurité</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Authentification</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
                    </div>
                    <Switch
                      id="twoFactor"
                      checked={systemSettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSystemSettings({
                        ...systemSettings,
                        twoFactorAuth: checked
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Changer le mot de passe administrateur</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Clés API</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="apiKey">Clé API actuelle</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="apiKey"
                        type="password"
                        value="sk-********************************"
                        readOnly
                      />
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Régénérer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleSaveSettings('security')} disabled={saving}>
                  {saving ? 'Sauvegarde...' : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}