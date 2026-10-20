import { D2Functions, TAKES_VARIABLE_NAME } from "./d2-functions";
import { VariableValues } from "./variables";

/** Translate DHIS2 syntax while keeping quoted strings and variable names intact. */
function translate(text: string, values: VariableValues, missing: null | "", strict: boolean): string {
	let pos = 0;
	const literal = (value: unknown) => JSON.stringify(value ?? missing);
	const quoted = () => {
		const quote = text[pos++];
		let value = "";
		while (pos < text.length) {
			const char = text[pos++];
			if (char === quote) return JSON.stringify(value);
			if (char === "\\" && pos < text.length) {
				const next = text[pos];
				// DHIS2 regexes use plain backslashes; also accept legacy doubled ones.
				if (next === quote || next === "\\") { value += next; pos++; }
				else value += char;
			} else value += char;
		}
		throw new Error("Unclosed string");
	};
	const sequence = (argument = false): string => {
		let code = "";
		while (pos < text.length) {
			const char = text[pos];
			if (argument && (char === "," || char === ")")) break;
			if (char === "'" || char === '"') { code += quoted(); continue; }
			const variable = text.slice(pos).match(/^[#AV]\{([^}]+)\}/);
			if (variable) { code += literal(values[variable[1]]); pos += variable[0].length; continue; }
			const call = text.slice(pos).match(/^d2:(\w+)\s*\(/);
			if (call) {
				pos += call[0].length;
				const args: string[] = [];
				while (pos < text.length && text[pos] !== ")") {
					const start = pos;
					let value = sequence(true);
					const raw = text.slice(start, pos).trim();
					const name = raw.match(/^[#AV]\{([^}]+)\}$/);
					if (name && args.length === 0 && TAKES_VARIABLE_NAME.includes(call[1])) value = JSON.stringify(name[1]);
					args.push(value);
					if (text[pos] !== ",") break;
					pos++;
				}
				if (text[pos++] !== ")") throw new Error("Unclosed function call");
				code += `d2Functions.${call[1]}(${args.join(",")})`;
				continue;
			}
			if (char === "(") {
				pos++;
				code += `(${sequence()}`;
				continue;
			}
			if (char === ")") {
				code += char; pos++;
				return code;
			}
			if (strict) {
				const comparison = text.slice(pos).match(/^(===|!==|==|!=|<=|>=|=)/);
				if (comparison) {
					const op = comparison[1];
					code += op === "=" || op === "==" ? "===" : op === "!=" ? "!==" : op;
					pos += op.length;
					continue;
				}
			}
			code += char; pos++;
		}
		return code;
	};
	const result = sequence();
	if (pos !== text.length) throw new Error("Unexpected expression suffix");
	return result;
}

export function createEvaluator(variableValues: VariableValues, d2Functions: D2Functions) {
	const evaluate = (text: string, condition: boolean): any => {
		if (!text?.trim()) return condition ? false : null;
		try {
			const code = translate(text, variableValues, condition ? "" : null, condition);
			const functions = {
				...d2Functions,
				condition: (test: boolean | string, yes: unknown, no: unknown) =>
					(typeof test === "string" ? evaluate(test, true) : test) ? yes : no,
			};
			return new Function("d2Functions", `return (${code})`)(functions);
		} catch (error) {
			console.warn(`Invalid ${condition ? "condition" : "expression"}: ${text}`, error);
			return condition ? false : null;
		}
	};
	return {
		evaluateExpression: (expression: string) => evaluate(expression, false),
		evaluateCondition: (condition: string) => evaluate(condition, true),
	};
}
