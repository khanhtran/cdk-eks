import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnTypeActivation } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam'
import { IAM_MINIMIZE_POLICIES } from 'aws-cdk-lib/cx-api';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class TypeActivationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const executionRole = new iam.Role(this, 'eks-type-activation-role', {
      roleName: 'eks-type-activation-role',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('resources.cloudformation.amazonaws.com'),
        new iam.ServicePrincipal('lambda.amazonaws.com')
      ),
      inlinePolicies: {
        'awsqs-resource-policy': this.activationRolePolicy()
      }
    })

    new CfnTypeActivation(this, 'awsqs-eks-type-activation', {
      autoUpdate: false,
      typeName: 'AWSQS::EKS::Cluster',
      majorVersion: '1',
      executionRoleArn: executionRole.roleArn
    })    
  }

  private activationRolePolicy(): iam.PolicyDocument {
    return new iam.PolicyDocument({
      statements: [
        new PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: [
            "secretsmanager:GetSecretValue",
            "kms:Decrypt",
            "eks:DescribeCluster",
            "s3:GetObject",
            "sts:AssumeRole",
            "sts:GetCallerIdentity",
            "iam:PassRole",
            "ec2:CreateNetworkInterface",
            "ec2:DescribeNetworkInterfaces",
            "ec2:DeleteNetworkInterface",
            "ec2:DescribeVpcs",
            "ec2:DescribeSubnets",
            "ec2:DescribeRouteTables",
            "ec2:DescribeSecurityGroups",
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents",
            "lambda:UpdateFunctionConfiguration",
            "lambda:DeleteFunction",
            "lambda:GetFunction",
            "lambda:InvokeFunction",
            "lambda:CreateFunction",
            "lambda:UpdateFunctionCode",
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:DescribeLogGroups",
            "logs:DescribeLogStreams",
            "logs:PutLogEvents",
            "cloudwatch:ListMetrics",
            "cloudwatch:PutMetricData",
            "ssm:PutParameter",
            "ssm:GetParameter",
            "ssm:DeleteParameter"
          ]
        })
      ]
    })
  }
}
