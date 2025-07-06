pipeline {
    agent any

    tools {
        nodejs 'nodeJS'
    }

    triggers {
        cron('H 2 * * *')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Build TypeScript') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx tsc'
                    } else {
                        bat 'npx tsc'
                    }
                }
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright install --with-deps'
                    } else {
                        bat 'npx playwright install'
                    }
                }
            }
        }

        stage('Run E2E Purchase Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npx playwright test tests/transaction.spec.ts --reporter=junit'
                    } else {
                        bat 'npx playwright test tests/transaction.spec.ts --reporter=junit'
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Archiving reports and artifacts...'
            archiveArtifacts artifacts: 'playwright-report/**', followSymlinks: false
            archiveArtifacts artifacts: 'downloads/**', followSymlinks: false
            junit 'playwright-report/results.xml'
        }
    }
}