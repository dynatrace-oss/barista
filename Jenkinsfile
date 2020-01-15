pipeline {
  agent {
    node {
      label 'default'
    }
  }

  parameters {
      gitParameter(
        branch: '',
        branchFilter: 'origin/([0-9]{1,}\\.x|[0-9]{1,}\\.[0-9]{1,}\\.x|master)',
        defaultValue: 'master',
        description: 'The branch you want to release from',
        name: 'BRANCH',
        quickFilterEnabled: false,
        selectedValue: 'NONE',
        sortMode: 'NONE',
        tagFilter: '*',
        type: 'PT_BRANCH'
      )
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  stages {


    stage('Checkout specified branch') {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: "${params.BRANCH}"]],
          doGenerateSubmoduleConfigurations: false,
          extensions: [[
            $class: 'LocalBranch',
            localBranch: "${params.BRANCH}"
          ]],
          gitTool: 'Default',
          submoduleCfg: [],
          userRemoteConfigs: [[url: 'https://github.com/dynatrace-oss/barista.git']]
        ])
        sh '''
          git status
          git branch --list
        '''
      }
    }

    stage('Install dependencies') {
      steps {
        nodejs(nodeJSInstallationName: 'Node 10.x') {
          ansiColor('xterm') {
            sh 'npm install'
          }
        }
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
