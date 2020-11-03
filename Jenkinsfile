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
          userRemoteConfigs: [[
            url: 'https://github.com/dynatrace-oss/barista.git'
          ]]
        ])
      }
    }

    stage('Install dependencies') {
      steps {
        nodejs(nodeJSInstallationName: 'Node 12.x') {
          ansiColor('xterm') {
            sh 'npm ci'
          }
        }
      }
    }

    stage('Publish') {
      steps {

        withCredentials([
          string(credentialsId: 'artifactory-url', variable: 'ARTIFACTORY_URL'),
          string(credentialsId: 'circle-ci-token', variable: 'CIRCLE_CI_TOKEN'),
          usernamePassword(credentialsId: 'npm-artifactory', passwordVariable: 'NPM_INTERNAL_PASSWORD', usernameVariable: 'NPM_INTERNAL_USER'),
          usernamePassword(credentialsId: 'npmjs-dynatrace-nodejs-token', passwordVariable: 'NPM_PUBLISH_TOKEN', usernameVariable: 'NPM_USER'),
          usernamePassword(credentialsId: 'dt-ci-github', passwordVariable: 'GITHUB_TOKEN', usernameVariable: 'GITHUB_USER')
        ]) {
          nodejs(nodeJSInstallationName: 'Node 12.x') {

            sh '''
              npm run publish-release
            '''
          }
        }
      }
    }

    stage('Trigger barista-examples-build') {
      steps {
        build quietPeriod: 0, wait: false, propagate: false, job: 'barista/barista-examples-builder'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
