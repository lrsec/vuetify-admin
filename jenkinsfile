pipeline {
    agent {
        node {
            label ""
            customWorkspace 'workspace/cms-web'
        }
    }

    stages {
        stage('build') {
            steps {
                sh 'npm --registry=https://registry.npm.taobao.org install'
                sh 'npm --registry=https://registry.npm.taobao.org run build'
            }
        }
        stage('deploy') {
            steps {
                sh 'bash ./publish.sh'
            }
        }
    }
}
