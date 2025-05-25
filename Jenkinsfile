pipeline {
    agent any

    environment {
        IMAGE_NAME = 'unified-app-image'
        CONTAINER_NAME = 'unified_app_container'
    }

    stages {

        stage('Build Docker Image') {
            steps {
                echo '🏗️ Building Docker image...'
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Code Linting') {
            steps {
                echo '🔍 Running ESLint inside Docker...'
                sh 'docker run --rm $IMAGE_NAME npx eslint . || true'
            }
        }

        stage('Unit Testing') {
            steps {
                echo '🧪 Running Jest unit tests inside Docker...'
                sh 'docker run --rm $IMAGE_NAME npm test'
            }
        }

        stage('Containerized Deployment') {
            steps {
                echo '🚀 Deploying app using Docker Compose...'
                sh 'docker-compose up -d'
                sh 'sleep 5' // Wait for app to fully start
            }
        }

        stage('Selenium Testing') {
            steps {
                echo '🧪 Running Selenium test cases...'
                sh 'docker exec $CONTAINER_NAME /opt/venv/bin/python /tests/test_selenium.py'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up containers...'
            sh 'docker-compose down || true'
            sh 'docker rm -f $CONTAINER_NAME || true'
        }
    }
}
