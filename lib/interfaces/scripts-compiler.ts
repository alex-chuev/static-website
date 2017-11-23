export interface ScriptsCompiler {
  (source: string, options?: ScopedCredentialOptions, filename?: string): string;
}
