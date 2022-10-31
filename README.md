# GraphQL Code Generator Plugins

## Overview

List of [GraphQL Code Generator[https://www.the-guild.dev/graphql/codegen] plugins that complements the official plugins.

## Plugins

- [@eddeee888/gcg-typescript-resolver-files](./packages/typescript-resolver-files): Generates module-based resolvers based on types from [typescript-resolvers](https://www.the-guild.dev/graphql/codegen/plugins/typescript/typescript-resolvers) plugin

## TODOs

### @eddeee888/gcg-typescript-resolver-files

- [ ] Add Scalar handler
- [ ] Add Interface handler
- [ ] Resolvers from root object types (`Query`, `Mutation`, `Subscription`) needs to be prefixed with alias to avoid naming spacing issue in `mainFile` (caused by having the same field name)
