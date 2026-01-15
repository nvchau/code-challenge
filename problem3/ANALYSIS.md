# Problem 3: Messy React

## Critical Bugs

### 1. Logic Error in Filter Function
- **Issue:** Uses undefined variable `lhsPriority` instead of `balancePriority`
- **Issue:** Incorrect filter logic - keeps balances with `amount <= 0` instead of filtering them out
- **Impact:** Code will throw `ReferenceError` and filter incorrectly
- **Fix:** Filter balances with `priority > -99` AND `amount > 0`

### 2. Incomplete Sort Function
- **Issue:** Sort comparator doesn't return `0` when priorities are equal
- **Issue:** Unnecessarily complex if-else logic
- **Impact:** Unpredictable sort behavior for equal priorities
- **Fix:** Simplify to `return rightPriority - leftPriority`

---

## Performance Issues

### 3. Incorrect useMemo Dependencies
- **Issue:** `prices` included in dependency array but not used in the memoized computation
- **Impact:** Unnecessary recalculations when `prices` changes
- **Fix:** Remove `prices` from dependencies; use it only in separate `useMemo` for rows

### 4. Redundant Computations
- **Issue:** `formattedBalances` is created but never used
- **Issue:** Type mismatch - uses `FormattedWalletBalance` but data is `WalletBalance[]`
- **Impact:** Wasted computation and potential runtime errors
- **Fix:** Combine filter, sort, and format in single `useMemo` and reuse the result

### 5. Missing Memoization
- **Issue:** `rows` array is recalculated on every render
- **Impact:** Unnecessary re-renders and performance degradation
- **Fix:** Wrap `rows` calculation in `useMemo` with proper dependencies

### 6. Function Recreation
- **Issue:** `getPriority` function is recreated on every render
- **Impact:** Small but unnecessary overhead
- **Fix:** Use `useCallback` or move function outside component

### 7. Repeated Function Calls
- **Issue:** `getPriority` called multiple times for same balance (in filter and sort)
- **Impact:** O(n log n) redundant function calls
- **Note:** Acceptable for readability, but could be optimized with pre-computed map

---

## Code Quality Issues

### 8. React Anti-pattern: Index as Key
- **Issue:** Using array index as React `key` prop
- **Impact:** Incorrect component re-rendering when list order changes
- **Fix:** Use unique identifier like `currency + blockchain`

### 9. Poor Type Safety
- **Issue:** `WalletBalance` interface missing `blockchain` field that code uses
- **Issue:** `getPriority` parameter uses `any` type
- **Impact:** Loss of TypeScript benefits, potential runtime errors
- **Fix:** Add `blockchain` field to interface, use proper `Blockchain` type

### 10. Incorrect Number Formatting
- **Issue:** `toFixed()` called without parameter (no decimal places)
- **Impact:** Currency values displayed without decimals
- **Fix:** Use `toFixed(2)` for proper currency formatting

### 11. Suboptimal Data Structure
- **Issue:** Switch statement for priority lookup
- **Impact:** Less maintainable, slightly slower than object lookup
- **Fix:** Use object/map for O(1) lookup and easier maintenance

---

## Refactoring Approach

### Key Improvements:
1. **Fix Logic Errors**
   - Correct filter condition
   - Complete sort comparator

2. **Optimize Performance**
   - Fix `useMemo` dependencies
   - Combine redundant computations
   - Memoize expensive calculations
   - Use `useCallback` for stable function references

3. **Improve Code Quality**
   - Fix TypeScript types
   - Use proper React keys
   - Improve number formatting
   - Replace switch with object lookup

### Refactored Structure:
```typescript
// 1. Define proper types
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain;
}

// 2. Memoize helper function
const getPriority = useCallback((blockchain: Blockchain): number => {
    return blockchainPriorityMap[blockchain] ?? -99;
}, []);

// 3. Single useMemo for filter, sort, format
const formattedBalances = useMemo(() => {
    return balances
        .filter(balance => {
            const priority = getPriority(balance.blockchain);
            return priority > -99 && balance.amount > 0;
        })
        .sort((lhs, rhs) => {
            return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
        })
        .map(balance => ({
            ...balance,
            formatted: balance.amount.toFixed(2)
        }));
}, [balances, getPriority]);

// 4. Separate useMemo for rows
const rows = useMemo(() => {
    return formattedBalances.map(balance => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
            <WalletRow
                key={`${balance.currency}-${balance.blockchain}`}
                amount={balance.amount}
                usdValue={usdValue}
                formattedAmount={balance.formatted}
            />
        );
    });
}, [formattedBalances, prices]);
```
