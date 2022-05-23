import { Fn, CfnResource, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as eks from 'aws-cdk-lib/aws-eks'

export class ClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const clusterRoleArn = Fn.importValue('clusterRoleArn')
    
    new CfnResource(this, 'KubeStateMetrics', {
      type: 'AWSQS::Kubernetes::Cluster',
      properties: {
        Name: 'eks-cluster-1',
        RoleArn: clusterRoleArn,
        Version: eks.KubernetesVersion.V1_21.version,
        ResourcesVpcConfig: {
          SecurityGroupIds: [
            'sg-05b9eb28277988c95'
          ],
          SubnetIds: [
            'subnet-0488f2b2afec8e5a2',
            'subnet-0a680ad304d67d4c3',
            'subnet-0183ea0b0b3da5124'
          ],
          EndpointPublicAccess: true,
          EndpointPrivateAccess: true
        }
      }
    })
  }
}
