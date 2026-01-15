# Problem 1: Sum to N

Three implementations to calculate sum from 1 to n.

## Solution A: Loop
Iterates from 1 to n using a for loop, accumulates the sum by adding each number.
- **Time Complexity:** O(n) - linear time
- **Space Complexity:** O(1) - constant space
- **Pros:** Simple and easy to understand
- **Cons:** Slower for large values of n

## Solution B: Gauss Formula
Uses the mathematical formula: `n × (n + 1) / 2` to calculate the sum directly.
- **Time Complexity:** O(1) - constant time
- **Space Complexity:** O(1) - constant space
- **Pros:** Fastest solution, no iteration needed
- **Cons:** Requires knowledge of the formula
- **Best choice** for production code

**How it works:** Pairs numbers (1+n, 2+(n-1), ...) where each pair sums to (n+1), with n/2 pairs total.

## Solution C: Recursion
Recursive approach: returns `n + sum_to_n(n - 1)` until base case.
- **Time Complexity:** O(n) - linear time
- **Space Complexity:** O(n) - due to call stack
- **Pros:** Elegant, demonstrates recursion
- **Cons:** Can cause stack overflow for very large n

**Example:** sum_to_n(5) = 5 + sum_to_n(4) = 5 + 4 + sum_to_n(3) = ... = 15
