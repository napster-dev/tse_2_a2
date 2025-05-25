pipeline {
    agent any

    environment {
        IMAGE_NAME = 'unified-app-image'
        CONTAINER_NAME = 'unified_app_container'
    }

    stages {

        stage('Code Linting') {
            steps {
                echo '🔍 Running ESLint...'
                dir('app') {
                    sh 'npm install eslint --save-dev'
                    sh './node_modules/.bin/eslint . || true'
                }
            }
        }

        stage('Code Build') {
            steps {
                echo '🏗️ Installing dependencies...'
                dir('app') {
                    sh 'npm install'
                }
            }
        }

        stage('Unit Testing') {
            steps {
                echo '🧪 Running Jest unit tests inside container...'
                sh 'docker build -t $IMAGE_NAME .'
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
                sh 'docker exec $CONTAINER_NAME python3 /tests/test_selenium.py'
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
