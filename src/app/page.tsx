'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: 'fa-graduation-cap',
      title: 'Gestion des Élèves',
      description: 'Suivi complet des dossiers étudiants, inscriptions et parcours scolaire',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: 'fa-chalkboard-teacher',
      title: 'Enseignants',
      description: 'Administration du corps professoral et gestion des emplois du temps',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: 'fa-chart-line',
      title: 'Notes & Évaluations',
      description: 'Bulletins de notes automatiques et suivi des performances',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: 'fa-calendar-check',
      title: 'Présences',
      description: 'Suivi des absences et gestion des justificatifs en temps réel',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: 'fa-comments',
      title: 'Communications',
      description: 'Messagerie intégrée entre parents, enseignants et administration',
      color: 'from-indigo-500 to-purple-600'
    },
    {
      icon: 'fa-coins',
      title: 'Finance',
      description: 'Gestion des frais de scolarité, paiements et rapports financiers',
      color: 'from-yellow-500 to-amber-600'
    }
  ]

  const stats = [
    { number: '500+', label: 'Établissements', icon: 'fa-school' },
    { number: '50K+', label: 'Élèves', icon: 'fa-user-graduate' },
    { number: '3K+', label: 'Enseignants', icon: 'fa-chalkboard-teacher' },
    { number: '99.9%', label: 'Satisfaction', icon: 'fa-heart' }
  ]

  const testimonials = [
    {
      name: 'Mme. Aïcha Bâ',
      role: 'Directrice, École Primaire Nouakchott',
      content: 'ERP Scolaire a transformé notre gestion administrative. Plus efficace, plus rapide et parfaitement adapté à notre réalité mauritanienne.',
      avatar: '👩‍🏫'
    },
    {
      name: 'M. Mohamed Ould',
      role: 'Directeur, Lycée Technique de Nouadhibou',
      content: 'Un outil exceptionnel qui nous a permis d\'améliorer considérablement notre communication avec les parents et notre organisation.',
      avatar: '👨‍🏫'
    },
    {
      name: 'Mme. Fatimata',
      role: 'Parent d\'élève',
      content: 'Je peux suivre la progression de mes enfants en temps réel. C\'est rassurant et très pratique pour notre quotidien.',
      avatar: '👩‍💼'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 hero-pattern">
      {/* Navigation Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
                <i className="fas fa-graduation-cap text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">ERP Scolaire</h1>
                <p className="text-sm text-gray-600">Solution Mauritanie</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="#features" className="nav-link">Fonctionnalités</Link>
              <Link href="#stats" className="nav-link">Chiffres Clés</Link>
              <Link href="#testimonials" className="nav-link">Témoignages</Link>
              <Link href="#pricing" className="nav-link">Tarifs</Link>
              <button className="btn-primary-modern">
                <i className="fas fa-rocket mr-2"></i>
                Démarrer Gratuitement
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 transition-colors"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 p-6 glass rounded-2xl">
              <div className="flex flex-col space-y-4">
                <Link href="#features" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">Fonctionnalités</Link>
                <Link href="#stats" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">Chiffres Clés</Link>
                <Link href="#testimonials" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">Témoignages</Link>
                <Link href="#pricing" className="block px-4 py-3 rounded-xl hover:bg-white/10 transition-colors">Tarifs</Link>
                <button className="btn-primary-modern w-full">
                  <i className="fas fa-rocket mr-2"></i>
                  Démarrer Gratuitement
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 hero-gradient"></div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-pink-400/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto" data-aos="fade-up">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6 text-blue-700 font-medium">
              <i className="fas fa-star text-yellow-500 mr-2"></i>
              #1 Solution ERP Scolaire en Mauritanie
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Révolutionnez</span>
              <br />
              <span className="text-gray-900">Votre Gestion Scolaire</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              La solution ERP complète adaptée au contexte éducatif mauritanien.
              Gérez votre établissement avec efficacité, modernité et simplicité.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button className="btn-primary-modern text-lg px-8 py-4">
                <i className="fas fa-play mr-2"></i>
                Démo Gratuite
              </button>
              <button className="btn-secondary-modern text-lg px-8 py-4">
                <i className="fas fa-calendar mr-2"></i>
                Prendre RDV
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Aucune carte bancaire</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Configuration rapide</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <span>Support 24/7</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16 relative" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-white rounded-3xl shadow-2xl p-8 glass">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['students', 'teachers', 'classes', 'grades'].map((item, index) => (
                  <div key={item} className="text-center" data-aos="zoom-in" data-aos-delay={index * 100}>
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
                      <i className={`fas fa-${item === 'students' ? 'user-graduate' : item === 'teachers' ? 'chalkboard-teacher' : item === 'classes' ? 'school' : 'chart-line'}`}></i>
                    </div>
                    <p className="text-sm font-medium text-gray-700 capitalize">{item === 'students' ? 'Élèves' : item === 'teachers' ? 'Enseignants' : item === 'classes' ? 'Classes' : 'Notes'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="stat-number mb-2">
                  <i className={`fas ${stat.icon} mr-2 text-blue-600`}></i>
                  {stat.number}
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-4">
              Fonctionnalités <span className="gradient-text">Exceptionnelles</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tout ce dont votre établissement a besoin, dans une seule plateforme moderne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className={`feature-icon bg-gradient-to-br ${feature.color}`}>
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-600 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-4">
              Ce Que Disent <span className="gradient-text">Nos Clients</span>
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de ceux qui nous font confiance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="flex justify-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400"></i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="card-modern text-center p-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white" data-aos="fade-up">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à Transformer Votre Établissement ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des centaines d'établissements qui ont déjà modernisé leur gestion
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl">
                <i className="fas fa-rocket mr-2"></i>
                Commencer Gratuitement
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
                <i className="fas fa-phone mr-2"></i>
                Contacter un Expert
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3 className="text-xl font-bold">ERP Scolaire</h3>
              </div>
              <p className="text-gray-400">La solution de gestion scolaire moderne pour la Mauritanie</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Démo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tutoriels</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p><i className="fas fa-phone mr-2"></i>+222 123 456 789</p>
                <p><i className="fas fa-envelope mr-2"></i>contact@erp-scolaire.mr</p>
                <p><i className="fas fa-map-marker-alt mr-2"></i>Nouakchott, Mauritanie</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2024 ERP Scolaire Mauritanie. Tous droits réservés.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-facebook text-xl"></i>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-linkedin text-xl"></i>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}