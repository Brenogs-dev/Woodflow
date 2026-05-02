pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Clonando repositório...'
                checkout scm
            }
        }

        stage('Build - Backend') {
            steps {
                echo 'Instalando dependências do backend...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build - Frontend') {
            steps {
                echo 'Instalando dependências do frontend...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo 'Executando análise SonarQube...'
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        sonar-scanner \
                          -Dsonar.projectKey=woodflow \
                          -Dsonar.projectName=Woodflow \
                          -Dsonar.sources=. \
                          -Dsonar.exclusions=**/node_modules/**,**/build/**
                    '''
                }
            }
        }

        stage('Docker Build & Up') {
            steps {
                echo 'Subindo containers com Docker Compose...'
                sh 'docker compose down --remove-orphans || true'
                sh 'docker compose build'
                sh 'docker compose up -d'
            }
        }

    }

    post {
        success {
            echo 'Pipeline concluída com sucesso!'
        }
        failure {
            echo 'Pipeline falhou. Verifique os logs.'
        }
    }
}
