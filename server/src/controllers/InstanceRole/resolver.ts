import { Query, Resolver } from 'type-graphql';

import { prisma } from '../../prisma';

import { InstanceRole } from '../../graphql-types/InstanceRole';

@Resolver()
export class InstanceRoleResolver {
  @Query(() => [InstanceRole])
  async instanceRoles(): Promise<InstanceRole[]> {
    return await prisma.instance_roles.findMany({
      include: {
        instance_role_permissions: { include: { instance_permission: true } },
      },
    });
  }
}
