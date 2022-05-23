import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam'


export class RoleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // master role
    const clusterRole = new iam.Role(this, 'eks-cluster-role', {
      roleName: 'eks-cluster-role',
      assumedBy: new iam.ServicePrincipal('eks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSClusterPolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSServicePolicy')
      ]
    })


    // node role
    const nodeRole = new iam.Role(this, 'eks-node-role', {
      roleName: 'eks-node-role',
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly')
      ]
    })

    new CfnOutput(this, 'cluster-role-arn', {
      value: clusterRole.roleArn,
      exportName: 'clusterRoleArn'
    })

    new CfnOutput(this, 'worker-node-role-arn', {
      value: nodeRole.roleArn,
      exportName: 'workerNodeRoleArn'
    })
  }
}
