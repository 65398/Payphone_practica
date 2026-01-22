pipeline {
    agent any

    tools {
        nodejs "Node25"
        dockerTool "Dockertool"
    }

    stages {
        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Ejecutar tests') {
            steps {
                sh 'chmod +x ./node_modules/.bin/jest || true'
                sh 'npm test'
            }
        }

        stage('Construir Imagen Docker') {
            steps {
                sh 'docker build -t catalogo-productos:latest .'
            }
        }

        stage('Ejecutar Contenedor') {
            steps {
                sh '''
                    docker stop catalogo-productos || true
                    docker rm catalogo-productos || true
                    docker run -d --name catalogo-productos -p 3000:3000 catalogo-productos:latest
                '''
            }
        }
    }
}