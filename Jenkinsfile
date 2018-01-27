pipeline {
  agent {
    docker {
      image 'node:6-alpine' 
      args '-p 3000:3000 -v' 
    }
  }
  stages {
    stage('Prepare environment') {
      steps {
        sh 'npm install'
      }
    }
    stage('analyze') {
      steps {
        sh 'echo \'ok, it\'s fake analyze\''
      }
    }
    stage('test') {
      steps {
        sh 'echo \'ok, fake test\''
      }
    }
    stage('build') {
      steps {
        sh '''npm run clean
npm run build'''
      }
    }
  }
  environment {
    q = 'w'
  }
}