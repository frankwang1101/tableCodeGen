pipeline {
    agent any
     
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
            sh 'echo "packing... "'
            sh 'cd dist && tar czf dist.tar.gz * '
            sh 'echo start scp ... '
            sh 'scp -P 29130 dist.tar.gz root@172.96.221.115:/root/web/dist' 
            sh 'ssh root@172.96.221.115 -p 29130 "cd web/dist && tar xzvf dist.tar.gz && rm dist.tar.gz"'
            sh 'echo "deploy successfully"'
          }
        }
    }
}