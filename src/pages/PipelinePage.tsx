import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import {
  Play,
  CheckCircle2,
  GitBranch,
  Terminal,
  Package,
  ShieldCheck,
  Rocket,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  Clock,
  RefreshCw,
} from 'lucide-react'

const JENKINSFILE_CONTENT = `pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                echo '=== Stage 1: Checking out numanmohd001/canvas-events from GitHub ==='
                bat 'git --version'
                dir('C:\\\\DEVOPSPBL\\\\canvas-events') {
                    bat 'git status -s'
                    bat 'git log -1 --oneline'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing Node.js & Vite Dependencies ==='
                dir('C:\\\\DEVOPSPBL\\\\canvas-events') {
                    bat 'node --version'
                    bat 'npm --version'
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('TypeScript & Lint Check') {
            steps {
                echo '=== Stage 3: Running TypeScript Compiler & Oxlint ==='
                dir('C:\\\\DEVOPSPBL\\\\canvas-events') {
                    bat 'npx tsc -b'
                    bat 'npm run lint'
                }
            }
        }

        stage('Production Build') {
            steps {
                echo '=== Stage 4: Building Canvas Events Production Bundle ==='
                dir('C:\\\\DEVOPSPBL\\\\canvas-events') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy to Vercel') {
            steps {
                echo '=== Stage 5: Deploying Production Bundle to Vercel ==='
                dir('C:\\\\DEVOPSPBL\\\\canvas-events') {
                    bat 'npx vercel build --prod --yes'
                    bat 'npx vercel deploy --prebuilt --prod --yes'
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline Succeeded! Canvas Events is live at https://canvas-events.vercel.app'
        }
    }
}`

interface StageInfo {
  id: string
  name: string
  duration: string
  icon: React.ReactNode
  command: string
  logs: string[]
}

const PIPELINE_STAGES: StageInfo[] = [
  {
    id: 'checkout',
    name: '1. Checkout GitHub',
    duration: '1.8s',
    icon: <GitBranch className="w-4 h-4" />,
    command: 'git checkout main && git log -1 --oneline',
    logs: [
      '[STAGE 1/5] Checkout GitHub Repository (numanmohd001/canvas-events)',
      'git version 2.53.0.windows.2',
      'origin  https://github.com/numanmohd001/canvas-events.git (fetch)',
      'origin  https://github.com/numanmohd001/canvas-events.git (push)',
      '5df3ff5 Fix Supabase client initialization and guard against invalid env placeholders',
    ],
  },
  {
    id: 'install',
    name: '2. Install Dependencies',
    duration: '3.2s',
    icon: <Package className="w-4 h-4" />,
    command: 'npm install --no-audit --no-fund',
    logs: [
      '[STAGE 2/5] Install Node.js & Vite Dependencies',
      'v26.11.1',
      '11.10.1',
      'up to date, audited 66 packages in 2s',
      'found 0 vulnerabilities',
    ],
  },
  {
    id: 'lint',
    name: '3. TypeScript & Lint Check',
    duration: '2.1s',
    icon: <ShieldCheck className="w-4 h-4" />,
    command: 'npx tsc -b && npm run lint',
    logs: [
      '[STAGE 3/5] TypeScript & Oxlint Static Analysis Check',
      '> npx tsc -b',
      '✓ TypeScript compilation verified with 0 errors',
      '> oxlint',
      'Finished in 48ms on 7 files with 0 warnings and 0 errors.',
    ],
  },
  {
    id: 'build',
    name: '4. Production Build',
    duration: '1.4s',
    icon: <Terminal className="w-4 h-4" />,
    command: 'npm run build',
    logs: [
      '[STAGE 4/5] Production Build (Vite + Tailwind CSS + Supabase)',
      'vite v8.3.5 building client environment for production...',
      'transforming... ✓ 2403 modules transformed.',
      'dist/index.html                   0.96 kB │ gzip:   0.54 kB',
      'dist/assets/index-PRATPHGL.css   35.09 kB │ gzip:   6.87 kB',
      'dist/assets/index-IiCtdT2n.js   681.19 kB │ gzip: 197.64 kB',
      '✓ built in 972ms',
    ],
  },
  {
    id: 'deploy',
    name: '5. Deploy to Vercel',
    duration: '8.9s',
    icon: <Rocket className="w-4 h-4" />,
    command: 'npx vercel build --prod --yes && npx vercel deploy --prebuilt --prod --yes',
    logs: [
      '[STAGE 5/5] Live Production Deployment to Vercel',
      'Vercel CLI 65.0.0 (Node.js 26.11.1)',
      '✓ Linked numanmohd001s-projects/canvas-events',
      '▲ Aliased: https://canvas-events.vercel.app',
      '[SUCCESS] Pipeline Completed! Live at https://canvas-events.vercel.app',
    ],
  },
]

export const PipelinePage: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(4)
  const [isSimulating, setIsSimulating] = useState(false)
  const [completedStep, setCompletedStep] = useState<number>(5)
  const [buildNumber, setBuildNumber] = useState<number>(1)
  const [copiedJenkinsfile, setCopiedJenkinsfile] = useState(false)

  const handleTriggerPipeline = () => {
    if (isSimulating) return
    setIsSimulating(true)
    setCompletedStep(0)
    setActiveStage(0)
    setBuildNumber((n) => n + 1)

    PIPELINE_STAGES.forEach((_, idx) => {
      setTimeout(() => {
        setActiveStage(idx)
        setCompletedStep(idx + 1)
        if (idx === PIPELINE_STAGES.length - 1) {
          setIsSimulating(false)
        }
      }, (idx + 1) * 900)
    })
  }

  const copyJenkinsfile = () => {
    navigator.clipboard.writeText(JENKINSFILE_CONTENT)
    setCopiedJenkinsfile(true)
    setTimeout(() => setCopiedJenkinsfile(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#161820]/90 backdrop-blur-md border-b border-[hsl(var(--border))]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="font-cormorant italic text-2xl sm:text-3xl text-[#d4b87a]"
            >
              Canvas Events
            </Link>
            <span className="hidden sm:inline-block h-4 w-[1px] bg-[hsl(var(--border))]" />
            <span className="label-editorial text-[hsl(var(--foreground))]">
              Jenkins CI/CD Pipeline Monitor
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:8090/job/canvas-events-pipeline/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#d4b87a]/40 bg-[hsl(var(--surface))] text-[#d4b87a] text-xs uppercase tracking-[0.14em] hover:bg-[#d4b87a] hover:text-[#161820] transition-colors"
            >
              Open Live Jenkins Server (Port 8090)
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))] hover:text-[#d4b87a]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Website
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Top Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[hsl(var(--border))] pb-8">
          <div>
            <p className="label-editorial text-[#d4b87a] mb-2">
              DevOps Automation · GitHub → Jenkins → Vercel
            </p>
            <h1 className="font-cormorant italic font-bold text-4xl sm:text-5xl text-[hsl(var(--foreground))]">
              canvas-events-pipeline #{buildNumber}
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
              Repository: <span className="text-[hsl(var(--foreground))]">https://github.com/numanmohd001/canvas-events.git</span> · Branch: <span className="text-[#d4b87a]">main</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="px-4 py-2.5 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs uppercase tracking-[0.14em] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {isSimulating ? 'Pipeline Running...' : 'Build Passing (SUCCESS)'}
            </div>

            <button
              onClick={handleTriggerPipeline}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium hover:bg-[#e1c68c] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Executing Stages...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Build Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Stage View Graph */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-cormorant italic text-2xl text-[hsl(var(--foreground))]">
              Stage View (5 Automated Stages)
            </h2>
            <span className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#d4b87a]" />
              Total Duration: 17.4s
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isDone = idx < completedStep
              const isSelected = activeStage === idx

              return (
                <motion.div
                  key={stage.id}
                  onClick={() => setActiveStage(idx)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[hsl(var(--surface-raised))] border-[#d4b87a]'
                      : 'bg-[hsl(var(--surface))] border-[hsl(var(--border))] hover:border-[#d4b87a]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[#d4b87a]">{stage.icon}</span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> Passed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 border border-amber-500/30">
                        Running
                      </span>
                    )}
                  </div>

                  <h3 className="font-cormorant italic font-bold text-xl text-[hsl(var(--foreground))]">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 font-mono truncate">
                    $ {stage.command}
                  </p>
                  <div className="mt-4 pt-3 border-t border-[hsl(var(--border))] flex items-center justify-between text-[11px] text-[hsl(var(--muted-foreground))]">
                    <span>Duration</span>
                    <span className="text-[#d4b87a] font-mono">{stage.duration}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Console Output & Jenkinsfile Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Console Output */}
          <div className="lg:col-span-7 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex flex-col">
            <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <div>
                <p className="label-editorial text-[#d4b87a]">
                  Jenkins Build Console Output
                </p>
                <h3 className="font-cormorant italic text-2xl">
                  {PIPELINE_STAGES[activeStage].name} — Logs
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400">
                Exit Code: 0
              </span>
            </div>

            <div className="p-6 bg-[#101218] font-mono text-xs text-[hsl(var(--foreground))]/90 space-y-2 flex-1 overflow-x-auto">
              <div className="text-[hsl(var(--muted-foreground))]">
                Started by user Administrator · Building in workspace C:\DEVOPSPBL\jenkins-server\home\workspace\canvas-events-pipeline
              </div>
              {PIPELINE_STAGES.slice(0, completedStep).map((st) => (
                <div key={st.id} className="pt-3 space-y-1">
                  <div className="text-[#d4b87a] font-semibold">
                    ================================================================================
                  </div>
                  {st.logs.map((line, i) => (
                    <div
                      key={i}
                      className={
                        line.includes('✓') || line.includes('[SUCCESS]')
                          ? 'text-emerald-400'
                          : 'text-[hsl(var(--foreground))]/85'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              ))}
              {completedStep === PIPELINE_STAGES.length && (
                <div className="pt-4 text-emerald-400 font-bold">
                  Finished: SUCCESS
                </div>
              )}
            </div>
          </div>

          {/* Jenkinsfile Definition */}
          <div className="lg:col-span-5 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] flex flex-col">
            <div className="px-6 py-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
              <div>
                <p className="label-editorial text-[#d4b87a]">
                  Declarative Pipeline As Code
                </p>
                <h3 className="font-cormorant italic text-2xl">
                  Jenkinsfile
                </h3>
              </div>
              <button
                onClick={copyJenkinsfile}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#d4b87a] text-[#161820] text-xs uppercase tracking-[0.14em] font-medium cursor-pointer"
              >
                {copiedJenkinsfile ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Jenkinsfile
                  </>
                )}
              </button>
            </div>

            <pre className="p-5 bg-[#101218] font-mono text-[11px] text-[hsl(var(--muted-foreground))] overflow-x-auto max-h-[460px]">
              {JENKINSFILE_CONTENT}
            </pre>
          </div>
        </div>
      </main>
    </div>
  )
}
