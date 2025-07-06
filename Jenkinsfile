pipeline {
    agent any

    tools {
        nodejs 'nodeJS' 
    }

    triggers {
        cron('H 2 * * *') // Run every day at 2 AM
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
                echo 'Installing npm dependencies...'
                sh 'npm install'
            }
        }

        stage('Build TypeScript') {
            steps {
                echo 'Compiling TypeScript...'
                sh 'npx tsc'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing Playwright browsers...'
                sh 'npx playwright install --with-deps'
            }
        }

        stage('Run E2E Purchase Test') {
            steps {
                echo 'Running Playwright tests...'
                sh 'npx playwright test tests/transaction.spec.ts --reporter=junit'
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
