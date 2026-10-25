pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout GitHub') {
            steps {
                echo '=== Stage 1: Checking out numanmohd001/canvas-events from GitHub ==='
                bat 'git --version'
                dir('C:\\DEVOPSPBL\\canvas-events') {
                    bat 'git status -s'
                    bat 'git log -1 --oneline'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 2: Installing Node.js & Vite Dependencies ==='
                dir('C:\\DEVOPSPBL\\canvas-events') {
                    bat 'node --version'
                    bat 'npm --version'
                    bat 'npm install --no-audit --no-fund'
                }
            }
        }

        stage('TypeScript & Lint Check') {
            steps {
                echo '=== Stage 3: Running TypeScript Compiler & Oxlint ==='
                dir('C:\\DEVOPSPBL\\canvas-events') {
                    bat 'npx tsc -b'
                    bat 'npm run lint'
                }
            }
        }

        stage('Production Build') {
            steps {
                echo '=== Stage 4: Building Canvas Events Production Bundle ==='
                dir('C:\\DEVOPSPBL\\canvas-events') {
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy to Vercel') {
            steps {
                echo '=== Stage 5: Deploying Production Bundle to Vercel ==='
                dir('C:\\DEVOPSPBL\\canvas-events') {
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
        failure {
            echo '❌ CI/CD Pipeline Failed. Check stage logs for details.'
        }
    }
}
