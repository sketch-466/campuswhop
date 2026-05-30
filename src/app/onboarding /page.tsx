'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { NIGERIAN_UNIVERSITIES } from '@/lib/constants'
import { generateReferralCode } from '@/lib/utils'
import { FACULTIES, LEVELS, DEPARTMENTS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Building2,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react'

const steps = [
  { number: 1, title: 'Personal Info', icon: User, description: 'Tell us who you are' },
  { number: 2, title: 'School Details', icon: Building2, description: 'Your academic info' },
  { number: 3, title: 'About You', icon: BookOpen, description: 'Build your brand' },
  { number: 4, title: 'Complete', icon: CheckCircle2, description: 'Ready to sell!' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(25)

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    bio: '',
    school: '',
    faculty: '',
    department: '',
    level: '',
    avatar_url: '',
    referral_code: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    setProgress(step * 25)
  }, [step])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/auth/login')
      return
    }
    setUser(session.user)

    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .single()

    if (existingProfile) {
      router.push('/dashboard')
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateStep = (): boolean => {
    setError('')
    switch (step) {
      case 1:
        if (!formData.full_name.trim()) {
          setError('Full name is required')
          return false
        }
        if (!formData.username.trim()) {
          setError('Username is required')
          return false
        }
        if (formData.username.length < 3) {
          setError('Username must be at least 3 characters')
          return false
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          setError('Username can only contain letters, numbers, and underscores')
          return false
        }
        break
      case 2:
        if (!formData.school) {
          setError('Please select your university')
          return false
        }
        if (!formData.faculty) {
          setError('Please select your faculty')
          return false
        }
        if (!formData.department) {
          setError('Please select your department')
          return false
        }
        if (!formData.level) {
          setError('Please select your level')
          return false
        }
        break
      case 3:
        if (!formData.bio.trim()) {
          setError('Please tell us a bit about yourself')
          return false
        }
        if (formData.bio.length < 20) {
          setError('Bio must be at least 20 characters')
          return false
        }
        break
    }
    return true
  }

  const nextStep = () => {
    if (validateStep()) {
      if (step < 4) setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    setError('')

    try {
      const referralCode = generateReferralCode()

      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          full_name: formData.full_name,
          username: formData.username.toLowerCase(),
          bio: formData.bio,
          school: formData.school,
          faculty: formData.faculty,
          department: formData.department,
          level: formData.level,
          avatar_url: formData.avatar_url || null,
          referral_code: referralCode,
          is_verified: false,
          is_creator: true,
          total_sales: 0,
          total_earnings: 0,
        })

      if (insertError) {
        if (insertError.message.includes('username') || insertError.message.includes('duplicate')) {
          setError('This username is already taken. Please choose another.')
          setStep(1)
        } else {
          setError(insertError.message)
        }
        setLoading(false)
        return
      }

      if (formData.referral_code.trim()) {
        const { data: referrer } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('referral_code', formData.referral_code.trim().toUpperCase())
          .single()

        if (referrer) {
          await supabase.from('referrals').insert({
            referrer_id: referrer.user_id,
            referred_id: user.id,
            status: 'pending',
            reward_earned: 0,
          })
        }
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Step {step} of 4
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {steps[step - 1].title}
          </h1>
          <p className="text-muted-foreground mt-1">{steps[step - 1].description}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-3">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center gap-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                  step >= s.number
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s.number ? <CheckCircle2 className="w-4 h-4" /> : s.number}
                </div>
                <span className={`text-xs ${step >= s.number ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => updateField('full_name', e.target.value)}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => updateField('username', e.target.value)}
                      placeholder="yourusername"
                      className="pl-7"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your store URL: campuswhop.com/store/@{formData.username || 'username'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: School Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>University <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.school}
                    onValueChange={(value) => {
                      updateField('school', value)
                      updateField('faculty', '')
                      updateField('department', '')
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      {NIGERIAN_UNIVERSITIES.map((uni) => (
                        <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Faculty <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.faculty}
                    onValueChange={(value) => {
                      updateField('faculty', value)
                      updateField('department', '')
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your faculty" />
                    </SelectTrigger>
                    <SelectContent>
                      {FACULTIES.map((fac) => (
                        <SelectItem key={fac} value={fac}>{fac}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => updateField('department', value)}
                    disabled={!formData.faculty}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.faculty ? "Select department" : "Select faculty first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.faculty && DEPARTMENTS[formData.faculty]?.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => updateField('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your level" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((lvl) => (
                        <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 3: About You */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => updateField('bio', e.target.value)}
                    placeholder="Tell students what you create, your expertise, and why they should buy from you..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">{formData.bio.length}/500 characters</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referral_code">Referral Code (Optional)</Label>
                  <Input
                    id="referral_code"
                    value={formData.referral_code}
                    onChange={(e) => updateField('referral_code', e.target.value.toUpperCase())}
                    placeholder="Enter referral code if you have one"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">You're all set!</h3>
                <p className="text-muted-foreground mb-6">
                  Review your profile details before creating it.
                </p>
                <div className="bg-muted rounded-lg p-4 text-left space-y-2 max-w-sm mx-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{formData.full_name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Username:</span>
                    <span className="font-medium">@{formData.username}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">School:</span>
                    <span className="font-medium">{formData.school}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{formData.department}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Level:</span>
                    <span className="font-medium">{formData.level}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && step < 4 ? (
                <Button variant="ghost" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 3 && (
                <Button onClick={nextStep}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {step === 3 && (
                <Button onClick={nextStep}>
                  Review
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {step === 4 && (
                <Button onClick={handleSubmit} disabled={loading} className="min-w-[200px]">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Profile'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
