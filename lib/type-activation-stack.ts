import { Stack, StackProps, CfnTypeActivation } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
    Role,
    PolicyDocument,
    Effect,
    PolicyStatement,
    CompositePrincipal,
    ServicePrincipal
} from 'aws-cdk-lib/aws-iam';

export class TypeActivationStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps) {
        super(scope, id, props)
        const executionRole = new Role(this, 'eks-type-activation-role', {
            roleName: 'eks-type-activation-role',
            assumedBy: new CompositePrincipal(
                new ServicePrincipal('resources.cloudformation.amazonaws.com'),
                new ServicePrincipal('lambda.amazonaws.com')
            ),
            inlinePolicies: {
                'awsqs-resource-policy': this.activationRolePolicy()
            }
        })

        new CfnTypeActivation(this, 'awsqs-eks-type-activation', {
            executionRoleArn: executionRole.roleArn,
            publicTypeArn: 'arn:aws:cloudformation:us-east-2::type/resource/408988dff9e863704bcc72e7e13f8d645cee8311/AWSQS-EKS-Cluster'
        })
    }


    private activationRolePolicy(): PolicyDocument {
        return new PolicyDocument({
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    resources: ['*'],
                    actions: [
                        'cloudformation:ListExport',
                        'ec2:DescribeSecurityGroups',
                        'ec2:DescribeSubnets',
                        'ec2:DescribeVpcs',
                        'eks:CreateCluster',
                        'eks:DeleteCluster',
                        'eks:DescribeCluster',
                        'eks:ListTagsForResource',
                        'eks:TagResource',
                        'eks:UntagResource',
                        'eks:UpdateClusterConfig',
                        'eks:UpdateClusterVersion',
                        'iam:PassRole',
                        'kms:CreateGrant',
                        'kms:DescribeKey',
                        'lambda:CreateFunction',
                        'lambda:DeleteFunction',
                        'lambda:GetFunction',
                        'lambda:InvokeFunction',
                        'lambda:UpdateFunctionCode',
                        'lambda:UpdateFunctionConfiguration',
                        'sts:AssumeRole',
                        'sts:GetCallerIdentity'
                    ]
                })
            ]
        })
    }
}
