import typescriptRollupPlugin from "@wessberg/rollup-plugin-ts";
import nodeResolveRollupPlugin from "rollup-plugin-node-resolve";
import packageJson from "./package.json";

// noinspection NpmUsedModulesInstalled
import {builtinModules} from "module";

export default {
	input: "src/index.ts",
	output: [
		{
			file: packageJson.main,
			format: "iife",
			sourcemap: true
		}
	],
	context: "window",
	treeshake: true,
	plugins: [
		typescriptRollupPlugin({
			tsconfig: process.env.NODE_ENV === "production" ? "tsconfig.dist.json" : "tsconfig.json",
			include: ["*.ts+(|x)", "**/*.ts+(|x)"],
			exclude: ["*.d.ts", "**/*.d.ts"],
			parseExternalModules: true
		}),
		nodeResolveRollupPlugin()
	]
};