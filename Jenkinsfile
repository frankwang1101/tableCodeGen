pipeline {
  agent {
    docker {
      image 'node:6-alpine'
      args '-v /Users/wangjian/Documents/learn/docker/jenkins:/var/jenkins_home'
    }
    
  }
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