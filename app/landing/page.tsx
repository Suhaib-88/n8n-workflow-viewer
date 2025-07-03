"use client"

import { useState } from "react"
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs"
import { Eye, ArrowRight, CheckCircle, Zap, Users, Shield, Mail, MessageSquare, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function LandingPage() {
  const { isSignedIn, user } = useUser()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setSubmitSuccess(true)
    setIsSubmitting(false)
    setFormData({ name: "", email: "", message: "" })

    // Reset success message after 3 seconds
    setTimeout(() => setSubmitSuccess(false), 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">n8n Workflow Viewer</h1>
            </div>

            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">Welcome, {user?.firstName || "User"}!</span>
                  <Link href="/">
                    <Button>Go to Dashboard</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <SignInButton mode="modal">
                    <Button variant="outline">Sign In</Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button>Get Started</Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Visualize Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                n8n Workflows
              </span>{" "}
              Like Never Before
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Upload, explore, and share your n8n automation workflows with our interactive viewer. Perfect for teams,
              documentation, and workflow optimization.
            </p>
            <div className="flex items-center justify-center gap-4">
              {isSignedIn ? (
                <Link href="/">
                  <Button size="lg" className="text-lg px-8 py-3">
                    View Workflows
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <SignUpButton mode="modal">
                  <Button size="lg" className="text-lg px-8 py-3">
                    Start Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </SignUpButton>
              )}
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Workflow Viewer?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for n8n workflows with features that make visualization and collaboration effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Interactive Visualization</CardTitle>
                <CardDescription>
                  View your workflows with beautiful, interactive node diagrams that make complex automations easy to
                  understand.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Share workflows with your team, add favorites, and track usage analytics to improve your automation
                  processes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your workflows are stored securely with user authentication and role-based access control for
                  enterprise peace of mind.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions about our workflow viewer? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Contact Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Custom Enterprise Solutions</p>
                      <p className="text-gray-600 text-sm">Tailored workflow viewers for your organization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Integration Support</p>
                      <p className="text-gray-600 text-sm">Help connecting with your existing n8n setup</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">Feature Requests</p>
                      <p className="text-gray-600 text-sm">Suggest new features for the workflow viewer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">500+</div>
                    <div className="text-sm text-gray-600">Workflows Viewed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">50+</div>
                    <div className="text-sm text-gray-600">Happy Users</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Send us a Message
                </CardTitle>
                <CardDescription>We'll get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitSuccess && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Thank you! Your message has been sent successfully.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        className="pl-10 min-h-[120px]"
                        placeholder="Tell us about your workflow visualization needs..."
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">n8n Workflow Viewer</h3>
          </div>
          <p className="text-gray-400 mb-6">Making workflow visualization simple and beautiful.</p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
            © 2024 n8n Workflow Viewer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
