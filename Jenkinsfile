pipeline {
    agent any
     
    // this tool will be used for all stages/steps except over-written
    tools {nodejs "node1"}
     
    stages {
        stage('before') {
            steps {
                sh 'npm install'
            }
        }
        stage('test'){
          steps {
            sh 'pwd'
            sh 'echo "start test ... "'
          }
        }
        stage('build'){
          steps {
            sh 'echo "start building .."'
            sh 'npm run build'
            sh 'echo "end building .."'
          }
        }
        stage('deploy'){
          steps {
            sh 'scp -P 29130 ./dist root@172.96.221.115:/root/web/' 
          }
        }
    }
}