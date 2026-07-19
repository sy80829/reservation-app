import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Supabase CLIが自動生成するファイル（手動編集しないためlint対象外）
    "database.types.ts",
    "database.supabase.ts",
    "src/types/supabase.ts",
  ]),
]);

export default eslintConfig;
