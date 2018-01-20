pipeline {
  agent any
  stages {
    stage('Prepare environment') {
      steps {
        git 'https://github.com/frankwang1101/tableCodeGen'
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
}