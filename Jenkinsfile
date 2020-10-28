pipeline {
  environment {
    PROJECT = "trainee-2020-6-dagmawit"
    APP_NAME = "backend"
    NAMESPACE= "car-parking-spot-app"
    IMAGE_TAG = "gcr.io/${PROJECT}/${APP_NAME}:${env.BRANCH_NAME}.${BUILD_NUMBER}"
  }
    agent {
        kubernetes {
            defaultContainer 'jnlp'
            yaml '''
apiVersion: v1
kind: Pod
spec:
  serviceAccountName: my-jenkins
  containers:
  - name: gcloud
    image: gcr.io/cloud-builders/gcloud
    command:
    - cat
    tty: true
  - name: kubectl
    image: gcr.io/cloud-builders/kubectl
    command:
    - cat
    tty: true
'''
        }
    }
    stages{
        stage("Build Docker and Push"){
            steps {
                container("gcloud"){
                    sh("gcloud builds submit -t ${IMAGE_TAG} .")
                }
            }
        }
        stage ("Deployment"){
            steps{
                container ("kubectl"){
                sh("sed -i.bak 's#gcr.io/gcr-project/sample:1.0.0#${IMAGE_TAG}#' ./Deployment/deploy.yaml")
                sh("kubectl --namespace=${NAMESPACE} apply -f ./Deployment/deploy.yaml")
                sh("kubectl --namespace=${NAMESPACE} apply -f ./Deployment/service.yaml")
                sh("kubectl --namespace=${NAMESPACE} apply -f ./Deployment/ingress.yaml")
         }
         }
        }
        stage ("Testing. . ."){
            steps{
                sh 'echo Testing. . .'
            }
        }
         stage ("Deploy. . ."){
            steps{
                sh 'echo Deploying. . .'
            }
        }
    }
}