// [FIX #9] Define blockchain types for better type safety
type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo' | string;

// [FIX #9] Added missing blockchain field to interface
interface WalletBalance {
    currency: string;
    amount: number;
    blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
    formatted: string;
}

interface Props extends BoxProps {
    // Props interface can be empty or have specific props
}

const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    // [FIX #11] Using object/map for O(1) lookup instead of switch statement
    const blockchainPriorityMap: Record<string, number> = {
        'Osmosis': 100,
        'Ethereum': 50,
        'Arbitrum': 30,
        'Zilliqa': 20,
        'Neo': 20,
    };

    // [FIX #6] Use useCallback to avoid function recreation on every render
    // [FIX #9] Changed parameter type from 'any' to 'Blockchain' for type safety
    const getPriority = useCallback((blockchain: Blockchain): number => {
        return blockchainPriorityMap[blockchain] ?? -99;
    }, []);

    // [FIX #3] Fixed useMemo dependencies - removed 'prices' (not used in this computation)
    // [FIX #4] Combined filter, sort, and format in single useMemo to avoid redundant computation
    const formattedBalances = useMemo(() => {
        return balances
            .filter((balance: WalletBalance) => {
                const balancePriority = getPriority(balance.blockchain);
                // [FIX #1] Fixed undefined variable 'lhsPriority' -> 'balancePriority'
                // [FIX #1] Fixed filter logic: now correctly filters out balances with priority <= -99 OR amount <= 0
                return balancePriority > -99 && balance.amount > 0;
            })
            .sort((lhs: WalletBalance, rhs: WalletBalance) => {
                const leftPriority = getPriority(lhs.blockchain);
                const rightPriority = getPriority(rhs.blockchain);
                // [FIX #2] Simplified sort logic and added return 0 for equal priorities
                return rightPriority - leftPriority;
            })
            .map((balance: WalletBalance): FormattedWalletBalance => {
                return {
                    ...balance,
                    // [FIX #10] Added decimal places parameter (2) for proper currency formatting
                    formatted: balance.amount.toFixed(2),
                };
            });
    }, [balances, getPriority]);

    // [FIX #5] Wrapped rows calculation in useMemo to avoid recalculation on every render
    // [FIX #3] 'prices' is correctly used here in separate useMemo
    const rows = useMemo(() => {
        return formattedBalances.map((balance: FormattedWalletBalance) => {
            const usdValue = prices[balance.currency] * balance.amount;
            return (
                <WalletRow 
                    className={classes.row}
                    // [FIX #8] Use unique key instead of array index to avoid React re-rendering issues
                    key={balance.currency + balance.blockchain}
                    amount={balance.amount}
                    usdValue={usdValue}
                    formattedAmount={balance.formatted}
                />
            );
        });
    }, [formattedBalances, prices]);

    return (
        <div {...rest}>
            {rows}
        </div>
    );
};
