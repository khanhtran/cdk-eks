#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RoleStack } from '../lib/role-stack';
import { TypeActivationStack } from '../lib/type-activation-stack';
import { ClusterStack } from '../lib/cluster-stack';

const app = new cdk.App()
const env = {
  account: '657641750194',
  region: 'us-east-2'
}
new RoleStack(app, 'eks-role-stack', {
  env
})

new TypeActivationStack(app, 'eks-type-activation-stack', {
  env
})

new ClusterStack(app, 'eks-cluster-stack', {
  env
})

app.synth()

