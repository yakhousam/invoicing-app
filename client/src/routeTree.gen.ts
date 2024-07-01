/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as AuthImport } from './routes/_auth'
import { Route as AuthLayoutImport } from './routes/_auth/_layout'
import { Route as AuthLayoutIndexImport } from './routes/_auth/_layout/index'
import { Route as AuthLayoutSettingsImport } from './routes/_auth/_layout/settings'
import { Route as AuthLayoutInvoicesIndexImport } from './routes/_auth/_layout/invoices.index'
import { Route as AuthLayoutClientsIndexImport } from './routes/_auth/_layout/clients.index'
import { Route as AuthLayoutInvoicesCreateImport } from './routes/_auth/_layout/invoices.create'
import { Route as AuthLayoutInvoicesIdImport } from './routes/_auth/_layout/invoices.$id'
import { Route as AuthLayoutClientsCreateImport } from './routes/_auth/_layout/clients.create'
import { Route as AuthLayoutClientsIdImport } from './routes/_auth/_layout/clients.$id'

// Create/Update Routes

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthRoute = AuthImport.update({
  id: '/_auth',
  getParentRoute: () => rootRoute,
} as any)

const AuthLayoutRoute = AuthLayoutImport.update({
  id: '/_layout',
  getParentRoute: () => AuthRoute,
} as any)

const AuthLayoutIndexRoute = AuthLayoutIndexImport.update({
  path: '/',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutSettingsRoute = AuthLayoutSettingsImport.update({
  path: '/settings',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutInvoicesIndexRoute = AuthLayoutInvoicesIndexImport.update({
  path: '/invoices/',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutClientsIndexRoute = AuthLayoutClientsIndexImport.update({
  path: '/clients/',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutInvoicesCreateRoute = AuthLayoutInvoicesCreateImport.update({
  path: '/invoices/create',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutInvoicesIdRoute = AuthLayoutInvoicesIdImport.update({
  path: '/invoices/$id',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutClientsCreateRoute = AuthLayoutClientsCreateImport.update({
  path: '/clients/create',
  getParentRoute: () => AuthLayoutRoute,
} as any)

const AuthLayoutClientsIdRoute = AuthLayoutClientsIdImport.update({
  path: '/clients/$id',
  getParentRoute: () => AuthLayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_auth': {
      id: '/_auth'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/_auth/_layout': {
      id: '/_auth/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthLayoutImport
      parentRoute: typeof AuthImport
    }
    '/_auth/_layout/settings': {
      id: '/_auth/_layout/settings'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof AuthLayoutSettingsImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/': {
      id: '/_auth/_layout/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthLayoutIndexImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/clients/$id': {
      id: '/_auth/_layout/clients/$id'
      path: '/clients/$id'
      fullPath: '/clients/$id'
      preLoaderRoute: typeof AuthLayoutClientsIdImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/clients/create': {
      id: '/_auth/_layout/clients/create'
      path: '/clients/create'
      fullPath: '/clients/create'
      preLoaderRoute: typeof AuthLayoutClientsCreateImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/invoices/$id': {
      id: '/_auth/_layout/invoices/$id'
      path: '/invoices/$id'
      fullPath: '/invoices/$id'
      preLoaderRoute: typeof AuthLayoutInvoicesIdImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/invoices/create': {
      id: '/_auth/_layout/invoices/create'
      path: '/invoices/create'
      fullPath: '/invoices/create'
      preLoaderRoute: typeof AuthLayoutInvoicesCreateImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/clients/': {
      id: '/_auth/_layout/clients/'
      path: '/clients'
      fullPath: '/clients'
      preLoaderRoute: typeof AuthLayoutClientsIndexImport
      parentRoute: typeof AuthLayoutImport
    }
    '/_auth/_layout/invoices/': {
      id: '/_auth/_layout/invoices/'
      path: '/invoices'
      fullPath: '/invoices'
      preLoaderRoute: typeof AuthLayoutInvoicesIndexImport
      parentRoute: typeof AuthLayoutImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  AuthRoute: AuthRoute.addChildren({
    AuthLayoutRoute: AuthLayoutRoute.addChildren({
      AuthLayoutSettingsRoute,
      AuthLayoutIndexRoute,
      AuthLayoutClientsIdRoute,
      AuthLayoutClientsCreateRoute,
      AuthLayoutInvoicesIdRoute,
      AuthLayoutInvoicesCreateRoute,
      AuthLayoutClientsIndexRoute,
      AuthLayoutInvoicesIndexRoute,
    }),
  }),
  LoginRoute,
})

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_auth",
        "/login"
      ]
    },
    "/_auth": {
      "filePath": "_auth.tsx",
      "children": [
        "/_auth/_layout"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/_auth/_layout": {
      "filePath": "_auth/_layout.tsx",
      "parent": "/_auth",
      "children": [
        "/_auth/_layout/settings",
        "/_auth/_layout/",
        "/_auth/_layout/clients/$id",
        "/_auth/_layout/clients/create",
        "/_auth/_layout/invoices/$id",
        "/_auth/_layout/invoices/create",
        "/_auth/_layout/clients/",
        "/_auth/_layout/invoices/"
      ]
    },
    "/_auth/_layout/settings": {
      "filePath": "_auth/_layout/settings.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/": {
      "filePath": "_auth/_layout/index.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/clients/$id": {
      "filePath": "_auth/_layout/clients.$id.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/clients/create": {
      "filePath": "_auth/_layout/clients.create.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/invoices/$id": {
      "filePath": "_auth/_layout/invoices.$id.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/invoices/create": {
      "filePath": "_auth/_layout/invoices.create.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/clients/": {
      "filePath": "_auth/_layout/clients.index.tsx",
      "parent": "/_auth/_layout"
    },
    "/_auth/_layout/invoices/": {
      "filePath": "_auth/_layout/invoices.index.tsx",
      "parent": "/_auth/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
