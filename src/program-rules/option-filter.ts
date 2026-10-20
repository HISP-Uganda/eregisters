/** Show actions form one allowlist; explicit hiding always takes precedence. */
export function filterRuleOptions<T extends { id: string; sortOrder?: number }>(
    options: readonly T[],
    groups: ReadonlyMap<string, readonly { id: string }[]>,
    rules: { shownOptionGroups?: string[]; hiddenOptionGroups?: string[]; shownOptions?: string[]; hiddenOptions?: string[] },
): T[] {
    const shown = new Set(rules.shownOptions);
    for (const group of rules.shownOptionGroups ?? []) {
        for (const option of groups.get(group) ?? []) shown.add(option.id);
    }
    const hidden = new Set(rules.hiddenOptions);
    for (const group of rules.hiddenOptionGroups ?? []) {
        for (const option of groups.get(group) ?? []) hidden.add(option.id);
    }
    const restrict = !!(rules.shownOptionGroups?.length || rules.shownOptions?.length);
    return options.filter(option => !hidden.has(option.id) && (!restrict || shown.has(option.id)))
        .sort((a, b) => (a.sortOrder ?? Infinity) - (b.sortOrder ?? Infinity));
}
