import { CfnOutput, CfnResource, Arn, ArnFormat } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Cluster, KubernetesVersion, Nodegroup } from 'aws-cdk-lib/aws-eks'
import { InstanceType, IVpc } from 'aws-cdk-lib/aws-ec2';
import {
    IRole,
    Role,
    ServicePrincipal,
    ManagedPolicy
} from 'aws-cdk-lib/aws-iam'

export class ClusterStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const clusterRoleArn = Fn.importValue('clusterRoleArn')
    
    const resource = new CfnResource(this, 'KubeStateMetrics', {
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
    
    const clusterName = Arn.split(resource.getAtt('Arn').toString(), ArnFormat.SLASH_RESOURCE_NAME).resourceName
    const cluster = Cluster.fromClusterAttributes(scope, 'imported-eks-cluster', {
            clusterName: clusterName!,
            clusterSecurityGroupId: 'sg-05b9eb28277988c95'
            vpc: props.vpc
        })

        new Nodegroup(scope, 'medchem-eks-nodegroup', {
            cluster: cluster,
            nodeRole: this.nodeRole(scope),
            minSize: 1,
            desiredSize: 1,
            maxSize: 1,
            instanceTypes: [new InstanceType('t2.micro')]
        })
  }
  
  
  private nodeRole(scope: Construct): IRole {
        return new Role(scope, 'medchem-eks-node-role', {
            assumedBy: new ServicePrincipal('ec2.amazonaws.com'),
            description: 'Role for EKS worker nodes',
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
                ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
            ]
        })
    }
}
