import * as path from 'path';
import { Project } from 'ts-morph';
import type { SourcesMap } from '../parseSources';
import { collectTypeMappersFromSourceFile } from './collectTypeMappersFromSourceFile';

export interface ParseTypeMappersParams {
  sourcesMap: SourcesMap;
  resolverTypesPath: string;
  typeMapperFilename: string;
  typeMapperSuffix: string;
}

export interface TypeMapperDetails {
  schemaType: string;
  typeMapperName: string;
  configImportPath: string;
}

export type TypeMappersMap = Record<string, TypeMapperDetails>;

export const parseTypeMappers = ({
  sourcesMap,
  resolverTypesPath,
  typeMapperFilename,
  typeMapperSuffix,
}: ParseTypeMappersParams): TypeMappersMap => {
  const result = Object.entries(sourcesMap).reduce<TypeMappersMap>(
    (res, [_, parsedSource]) => {
      const typeMapperFilePath = path.join(
        parsedSource.moduleDir,
        typeMapperFilename
      );

      const project = new Project();
      const [typeMappersSourceFile] =
        project.addSourceFilesAtPaths(typeMapperFilePath);

      collectTypeMappersFromSourceFile(
        { typeMappersSourceFile, typeMapperSuffix, resolverTypesPath },
        res
      );

      return res;
    },
    {}
  );
  return result;
};
