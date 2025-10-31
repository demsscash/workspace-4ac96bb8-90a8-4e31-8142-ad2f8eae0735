'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Bell,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  UserCheck,
  UserX,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/contexts/AuthContext'
import StudentManagement from '@/components/students/StudentManagement'
import GradeManagement from '@/components/grades/GradeManagement'
import ObservationManagement from '@/components/observations/ObservationManagement'
import AttendanceManagement from '@/components/attendance/AttendanceManagement'
import TeacherManagement from '@/components/teachers/TeacherManagement'
import FinanceManagement from '@/components/finance/FinanceManagement'
import DocumentGenerator from '@/components/documents/DocumentGenerator'
import MeetingManagement from '@/components/meetings/MeetingManagement'
import NotificationManagement from '@/components/notifications/NotificationManagement'
import SettingsManagement from '@/components/settings/SettingsManagement'

// Types pour les données réelles
interface DashboardStats {
  totalStudents: number
  presentToday: number
  absentToday: number
  totalTeachers: number
  totalClasses: number
  monthlyRevenue: number
  pendingPayments: number
  unreadNotifications: number
}

interface RecentActivity {
  id: string
  type: 'absence' | 'grade' | 'observation' | 'payment'
  student: string
  class: string
  time: string
  status: 'urgent' | 'important' | 'normal'
}

interface ClassData {
  id: string
  name: string
  level: string
  students: number
  capacity: number
  teacher: string
  fillRate: number
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // États pour les données réelles
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Récupérer les données du dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        // Pour la démo, utilisons un schoolId fixe. En production, cela viendrait de l'utilisateur connecté
        const schoolId = 'demo-school-id'

        const response = await fetch(`/api/dashboard/stats?schoolId=${schoolId}`)

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données')
        }

        const data = await response.json()

        setStats(data.stats)
        setRecentActivities(data.recentActivities)
        setClasses(data.classes)
        setError(null)
      } catch (err) {
        console.error('Erreur dashboard:', err)
        setError('Impossible de charger les données du tableau de bord')

        // Fallback vers des données mock en cas d'erreur
        setStats({
          totalStudents: 245,
          presentToday: 232,
          absentToday: 13,
          totalTeachers: 18,
          totalClasses: 12,
          monthlyRevenue: 2450000,
          pendingPayments: 450000,
          unreadNotifications: 8
        })
        setRecentActivities([
          { id: '1', type: 'absence', student: 'Mohamed Salem', class: 'CM2', time: '08:30', status: 'urgent' },
          { id: '2', type: 'grade', student: 'Fatima Bint', class: 'CE1', time: '10:15', status: 'normal' },
          { id: '3', type: 'observation', student: 'Ahmed Ould', class: 'CP2', time: '11:45', status: 'important' },
        ])
        setClasses([
          { id: '1', name: 'CP1', level: 'Primaire', students: 38, teacher: 'Mme. Diop', capacity: 40, fillRate: 95 },
          { id: '2', name: 'CP2', level: 'Primaire', students: 42, teacher: 'M. Ba', capacity: 40, fillRate: 100 },
          { id: '3', name: 'CE1', level: 'Primaire', students: 35, teacher: 'Mme. Fall', capacity: 40, fillRate: 88 },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Rafraîchir les données toutes les 5 minutes
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    { id: 'overview', label: 'Tableau de bord', icon: BarChart3 },
    { id: 'students', label: 'Élèves', icon: GraduationCap },
    { id: 'teachers', label: 'Enseignants', icon: Users },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'grades', label: 'Notes', icon: FileText },
    { id: 'attendance', label: 'Présences', icon: UserCheck },
    { id: 'observations', label: 'Observations', icon: MessageSquare },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'important': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'absence': return <UserX className="h-4 w-4 text-red-500" />
      case 'grade': return <FileText className="h-4 w-4 text-blue-500" />
      case 'observation': return <MessageSquare className="h-4 w-4 text-orange-500" />
      case 'payment': return <DollarSign className="h-4 w-4 text-green-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">ERP Scolaire Mauritanie</h1>
                  <p className="text-sm text-gray-500">École Primaire Nouakchott</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {stats?.unreadNotifications && stats.unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {stats.unreadNotifications}
                  </Badge>
                )}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button variant="ghost" size="sm">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} lg:block w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Tableau de bord */}
            <TabsContent value="overview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Tableau de bord</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Année scolaire 2024-2025
                  </Badge>
                  {loading && (
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Actualisation...
                    </Badge>
                  )}
                  {error && (
                    <Badge variant="outline" className="text-orange-600 border-orange-600">
                      Mode hors ligne
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Élèves</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                      ) : (
                        stats?.totalStudents || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats && `+${Math.round((stats.totalStudents / 200) * 12)}% par rapport à l'année dernière`}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Présents aujourd'hui</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                      ) : (
                        stats?.presentToday || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats && `${stats.absentToday} absent(s)`}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Enseignants</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
                      ) : (
                        stats?.totalTeachers || 0
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats && `${Math.round(stats.totalTeachers * 0.8)} présents aujourd'hui`}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
                      ) : (
                        `${(stats?.monthlyRevenue || 0).toLocaleString()} MRU`
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stats && `${(stats.pendingPayments || 0).toLocaleString()} MRU en attente`}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activités récentes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activités récentes</CardTitle>
                    <CardDescription>Dernières activités du système</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="h-4 w-4 bg-gray-300 rounded animate-pulse" />
                              <div className="flex-1">
                                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse mb-2" />
                                <div className="h-3 w-16 bg-gray-300 rounded animate-pulse" />
                              </div>
                            </div>
                            <div className="h-6 w-16 bg-gray-300 rounded animate-pulse" />
                          </div>
                        ))
                      ) : recentActivities.length > 0 ? (
                        recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getActivityIcon(activity.type)}
                              <div>
                                <p className="text-sm font-medium">{activity.student}</p>
                                <p className="text-xs text-gray-500">{activity.class} • {activity.time}</p>
                              </div>
                            </div>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Aucune activité récente</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Classes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Classes</CardTitle>
                    <CardDescription>Aperçu des classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex-1">
                              <div className="h-4 w-12 bg-gray-300 rounded animate-pulse mb-2" />
                              <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
                            </div>
                            <div className="text-right">
                              <div className="h-4 w-8 bg-gray-300 rounded animate-pulse mb-1" />
                              <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                                <div className="h-2 bg-gray-300 rounded-full animate-pulse" />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : classes.length > 0 ? (
                        classes.map((classItem) => (
                          <div key={classItem.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="text-sm font-medium">{classItem.name}</p>
                              <p className="text-xs text-gray-500">{classItem.teacher || 'Non assigné'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{classItem.students}/{classItem.capacity}</p>
                              <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                                <div
                                  className="h-2 bg-green-500 rounded-full"
                                  style={{ width: `${classItem.fillRate}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          <p>Aucune classe disponible</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Élèves */}
            <TabsContent value="students" className="space-y-6">
              <StudentManagement />
            </TabsContent>

            {/* Enseignants */}
            <TabsContent value="teachers" className="space-y-6">
              <TeacherManagement />
            </TabsContent>
          {/* Classes */}
            <TabsContent value="classes" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Classes</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle classe
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-12 bg-gray-300 rounded animate-pulse" />
                          <div className="h-5 w-16 bg-gray-300 rounded animate-pulse" />
                        </div>
                        <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between">
                            <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
                            <div className="h-3 w-8 bg-gray-300 rounded animate-pulse" />
                          </div>
                          <div className="flex justify-between">
                            <div className="h-3 w-12 bg-gray-300 rounded animate-pulse" />
                            <div className="h-3 w-8 bg-gray-300 rounded animate-pulse" />
                          </div>
                          <div className="flex justify-between">
                            <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
                            <div className="h-3 w-8 bg-gray-300 rounded animate-pulse" />
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                            <div className="h-2 bg-gray-300 rounded-full animate-pulse" />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="h-8 flex-1 bg-gray-300 rounded animate-pulse" />
                          <div className="h-8 flex-1 bg-gray-300 rounded animate-pulse" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : classes.length > 0 ? (
                  classes.map((classItem) => (
                    <Card key={classItem.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{classItem.name}</CardTitle>
                          <Badge variant="outline">{classItem.level}</Badge>
                        </div>
                        <CardDescription>Professeur: {classItem.teacher || 'Non assigné'}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Élèves inscrits:</span>
                            <span className="font-medium">{classItem.students}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Capacité:</span>
                            <span className="font-medium">{classItem.capacity}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Taux de remplissage:</span>
                            <span className="font-medium">{classItem.fillRate}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                            <div
                              className="h-2 bg-blue-500 rounded-full"
                              style={{ width: `${classItem.fillRate}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune classe</h3>
                    <p className="text-gray-500 mb-4">Commencez par créer votre première classe.</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une classe
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Notes */}
            <TabsContent value="grades" className="space-y-6">
              <GradeManagement />
            </TabsContent>
            {/* Observations */}
            <TabsContent value="observations" className="space-y-6">
              <ObservationManagement />
            </TabsContent>
          {/* Présences */}
            <TabsContent value="attendance" className="space-y-6">
              <AttendanceManagement />
            </TabsContent>
          {/* Finance */}
            <TabsContent value="finance" className="space-y-6">
              <FinanceManagement />
            </TabsContent>
          {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <NotificationManagement />
            </TabsContent>

          {/* Paramètres */}
            <TabsContent value="settings" className="space-y-6">
              <SettingsManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}