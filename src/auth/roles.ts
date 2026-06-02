export const RIDER_BACKEND_ROLE_ENUMS = ["rider"] as const;
export type RiderBackendRole = (typeof RIDER_BACKEND_ROLE_ENUMS)[number];

const RIDER_ROLE_SET = new Set<string>(RIDER_BACKEND_ROLE_ENUMS);

export type RiderRoleParseResult = {
  roles: RiderBackendRole[];
  hasUnknownRoles: boolean;
};

export function parseRiderRoles(input: unknown): RiderRoleParseResult {
  if (!Array.isArray(input)) {
    return { roles: [], hasUnknownRoles: false };
  }

  const roles = new Set<RiderBackendRole>();
  let hasUnknownRoles = false;

  for (const value of input) {
    if (typeof value !== "string") {
      hasUnknownRoles = true;
      continue;
    }

    const normalized = value.trim().toLowerCase();
    if (!normalized) continue;

    if (RIDER_ROLE_SET.has(normalized)) {
      roles.add(normalized as RiderBackendRole);
    } else {
      hasUnknownRoles = true;
    }
  }

  return {
    roles: Array.from(roles),
    hasUnknownRoles,
  };
}
