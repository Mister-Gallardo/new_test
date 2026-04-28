export const paths = {
  home: () => '/',

  account: () => '/account',

  auth: () => '/auth',

  contracts: {
    root: () => '/contracts',
    detail: (id: string) => `/contracts/${id}`,
    shared: (id: string) => `/contracts/shared/${id}`,
  },

  templates: {
    root: () => '/templates',
    detail: (id: string) => `/templates/${id}`,
    contract: (templateId: string, contractId: string) => `/templates/${templateId}/${contractId}`,
  },

  masquerade: {
    root: () => '/masquerade',
    exit: () => '/masquerade/exit',
  },
} as const
