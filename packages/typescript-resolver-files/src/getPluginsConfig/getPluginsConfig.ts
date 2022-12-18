import { GraphQLSchema, isObjectType, isScalarType } from 'graphql';
import { resolvers as scalarResolvers } from 'graphql-scalars';
import type { SourcesMap } from '../parseSources';
import {
  isNativeNamedType,
  isRootObjectType,
  parseLocationForWhitelistedModule,
} from '../utils';

interface GetPluginsConfigParams {
  schemaAst: GraphQLSchema;
  sourcesMap: SourcesMap;
  whitelistedModules: string[];
  blacklistedModules: string[];
}

type GetPluginsConfigResult = Record<
  'defaultScalarTypesMap' | 'defaultScalarExternalResolvers',
  Record<string, string>
>;

export const getPluginsConfig = ({
  schemaAst,
  sourcesMap,
  whitelistedModules,
  blacklistedModules,
}: GetPluginsConfigParams): GetPluginsConfigResult => {
  return Object.entries(schemaAst.getTypeMap()).reduce<GetPluginsConfigResult>(
    (res, [schemaType, namedType]) => {
      if (isNativeNamedType(namedType)) {
        return res;
      }

      const parsedSource = parseLocationForWhitelistedModule({
        location: namedType.astNode?.loc,
        sourcesMap,
        whitelistedModules,
        blacklistedModules,
      });
      if (!parsedSource) {
        return res;
      }

      if (isScalarType(namedType)) {
        handleScalarType(schemaType, res);
      }

      if (isRootObjectType(schemaType) && isObjectType(namedType)) {
        // Do mapper config logic
      }

      return res;
    },
    { defaultScalarTypesMap: {}, defaultScalarExternalResolvers: {} }
  );
};

const handleScalarType = (
  schemaType: string,
  result: GetPluginsConfigResult
): void => {
  const scalarResolver = scalarResolvers[schemaType];
  if (!scalarResolver) {
    return;
  }

  if (
    scalarResolver.extensions.codegenScalarType &&
    typeof scalarResolver.extensions.codegenScalarType === 'string'
  ) {
    result.defaultScalarTypesMap[schemaType] =
      scalarResolver.extensions.codegenScalarType;
  }

  result.defaultScalarExternalResolvers[
    schemaType
  ] = `~graphql-scalars#${scalarResolver.name}Resolver`;
};