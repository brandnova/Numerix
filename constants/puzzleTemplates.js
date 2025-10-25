// constants/puzzleTemplates.js

// Template generators for dynamic puzzles
export const PUZZLE_GENERATORS = {
  mathematical: {
    easy: [
      // Dynamic: Two-digit addition
      () => {
        const a = Math.floor(Math.random() * 30) + 10; // 10-39
        const b = Math.floor(Math.random() * 30) + 10; // 10-39
        const solution = a + b;
        return {
          puzzle: `I am the sum of ${a} and ${b}. What am I?`,
          solution: solution,
          hints: [
            `Add ${a} + ${b}`,
            `The answer is ${solution > 50 ? 'greater than 50' : 'less than 50'}`,
            `${a} + ${b} = ${solution}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Simple multiplication
      () => {
        const factors = [
          [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
          [2, 12], [3, 11], [4, 9], [5, 7], [6, 8]
        ];
        const [a, b] = factors[Math.floor(Math.random() * factors.length)];
        const solution = a * b;
        return {
          puzzle: `I am the product of ${a} and ${b}. What am I?`,
          solution: solution,
          hints: [
            `Multiply ${a} × ${b}`,
            `The answer is between ${solution - 10} and ${solution + 10}`,
            `${a} × ${b} = ${solution}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Digit sum puzzle
      () => {
        const digits = [
          [1, 9], [2, 8], [3, 7], [4, 6], [5, 5],
          [6, 4], [7, 3], [8, 2], [9, 1]
        ];
        const [tens, ones] = digits[Math.floor(Math.random() * digits.length)];
        const solution = tens * 10 + ones;
        const digitSum = tens + ones;
        return {
          puzzle: `I am a two-digit number. The sum of my digits is ${digitSum}. My tens digit is ${tens}. What am I?`,
          solution: solution,
          hints: [
            `The tens digit is ${tens}`,
            `${tens} + ${ones} = ${digitSum}`,
            `The number is ${tens}${ones}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Prime number puzzle
      () => {
        const primes = [11, 13, 17, 19, 23, 29];
        const solution = primes[Math.floor(Math.random() * primes.length)];
        const digitSum = Math.floor(solution / 10) + (solution % 10);
        return {
          puzzle: `I am a prime number between 10 and 30. The sum of my digits is ${digitSum}. What am I?`,
          solution: solution,
          hints: [
            "Prime numbers are only divisible by 1 and themselves",
            `The number is ${solution < 20 ? 'less than 20' : 'greater than 20'}`,
            `The digits are ${Math.floor(solution / 10)} and ${solution % 10}`
          ],
          maxRange: 50,
        };
      },
      
      // Dynamic: Perfect square
      () => {
        const roots = [4, 5, 6, 7, 8, 9];
        const root = roots[Math.floor(Math.random() * roots.length)];
        const solution = root * root;
        return {
          puzzle: `I am a perfect square. My square root is ${root}. What am I?`,
          solution: solution,
          hints: [
            `Perfect squares: 16, 25, 36, 49, 64, 81...`,
            `${root} × ${root} = ?`,
            `The answer is ${solution}`
          ],
          maxRange: 100,
        };
      },
    ],
    
    medium: [
      // Dynamic: Reverse digits puzzle
      () => {
        const tens = Math.floor(Math.random() * 5) + 4; // 4-8
        const ones = tens - 3;
        const solution = tens * 10 + ones;
        const reversed = ones * 10 + tens;
        const difference = solution - reversed;
        return {
          puzzle: `I am a two-digit number. My tens digit is 3 more than my ones digit. If you reverse my digits, I become ${difference} less. What am I?`,
          solution: solution,
          hints: [
            `The number is between ${(tens - 1) * 10} and ${(tens + 1) * 10}`,
            `${solution} reversed is ${reversed}. ${solution} - ${reversed} = ${difference}`,
            `Tens digit minus ones digit = 3`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Divisibility puzzle
      () => {
        const multiples15 = [15, 30, 45, 60, 75, 90];
        const oddMultiples = multiples15.filter(n => n % 2 !== 0);
        const solution = oddMultiples[Math.floor(Math.random() * oddMultiples.length)];
        return {
          puzzle: `I am divisible by both 3 and 5, but not by 2. I am between 10 and 100. What am I?`,
          solution: solution,
          hints: [
            "Numbers divisible by both 3 and 5 are divisible by 15",
            "The number must be odd",
            `Odd multiples of 15: 15, 45, 75...`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Twin primes
      () => {
        const twinPrimes = [[11, 13], [17, 19], [29, 31], [41, 43]];
        const [prime1, prime2] = twinPrimes[Math.floor(Math.random() * twinPrimes.length)];
        const usePrime1 = Math.random() > 0.5;
        const solution = usePrime1 ? prime1 : prime2;
        const other = usePrime1 ? prime2 : prime1;
        const diff = other - solution;
        return {
          puzzle: `I am a prime number. If you ${diff > 0 ? 'add' : 'subtract'} ${Math.abs(diff)} ${diff > 0 ? 'to' : 'from'} me, you get another prime number (${other}). I am between 10 and 50. What am I?`,
          solution: solution,
          hints: [
            `${solution} is prime, and ${solution} ${diff > 0 ? '+' : '-'} ${Math.abs(diff)} = ${other} (also prime)`,
            `Test prime numbers: 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47`,
            `The answer is ${solution}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Factor puzzle
      () => {
        const numbers = [
          { num: 24, factors: [1, 2, 3, 4, 6, 8, 12, 24] },
          { num: 36, factors: [1, 2, 3, 4, 6, 9, 12, 18, 36] },
          { num: 48, factors: [1, 2, 3, 4, 6, 8, 12, 16, 24, 48] },
          { num: 60, factors: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60] },
        ];
        const selected = numbers[Math.floor(Math.random() * numbers.length)];
        const factorCount = selected.factors.length;
        return {
          puzzle: `I am a number between 20 and 70. I have exactly ${factorCount} factors. What am I?`,
          solution: selected.num,
          hints: [
            `Factors are numbers that divide evenly into a number`,
            `The number has ${factorCount} divisors`,
            `The answer is ${selected.num}`
          ],
          maxRange: 100,
        };
      },
    ],
    
    hard: [
      // Dynamic: Three-digit puzzle
      () => {
        const tens = Math.floor(Math.random() * 4) + 2; // 2-5
        const hundreds = tens * 2;
        const ones = tens * 3;
        const solution = hundreds * 100 + tens * 10 + ones;
        const digitSum = hundreds + tens + ones;
        return {
          puzzle: `I am a three-digit number. My hundreds digit is twice my tens digit. My ones digit is 3 times my tens digit. The sum of all my digits is ${digitSum}. What am I?`,
          solution: solution,
          hints: [
            `Let tens digit = x, then hundreds = 2x, ones = 3x`,
            `2x + x + 3x = ${digitSum}, so 6x = ${digitSum}`,
            `x = ${tens}, so the number is ${solution}`
          ],
          maxRange: 1000,
        };
      },
      
      // Dynamic: LCM puzzle
      () => {
        const lcmSets = [
          { nums: [12, 15, 20], lcm: 60 },
          { nums: [8, 12, 18], lcm: 72 },
          { nums: [10, 15, 25], lcm: 150 },
          { nums: [6, 9, 15], lcm: 90 },
        ];
        const selected = lcmSets[Math.floor(Math.random() * lcmSets.length)];
        return {
          puzzle: `I am the least common multiple of ${selected.nums[0]}, ${selected.nums[1]}, and ${selected.nums[2]}. What am I?`,
          solution: selected.lcm,
          hints: [
            "LCM uses the highest powers of all prime factors",
            `Think about multiples of ${selected.nums[0]}: ${selected.nums[0]}, ${selected.nums[0] * 2}, ${selected.nums[0] * 3}...`,
            `The answer is ${selected.lcm}`
          ],
          maxRange: 200,
        };
      },
      
      // Dynamic: Modular arithmetic
      () => {
        const bases = [
          { mod7: 3, mod5: 2, solutions: [52, 87] },
          { mod7: 4, mod5: 3, solutions: [18, 53, 88] },
          { mod7: 2, mod5: 1, solutions: [51, 86] },
          { mod7: 5, mod5: 4, solutions: [19, 54, 89] },
        ];
        const selected = bases[Math.floor(Math.random() * bases.length)];
        const solution = selected.solutions[Math.floor(Math.random() * selected.solutions.length)];
        return {
          puzzle: `When I divide by 7, the remainder is ${selected.mod7}. When I divide by 5, the remainder is ${selected.mod5}. I am between 10 and 100. What am I?`,
          solution: solution,
          hints: [
            `Number ≡ ${selected.mod7} (mod 7) and ≡ ${selected.mod5} (mod 5)`,
            `Try: ${solution} ÷ 7 = ${Math.floor(solution / 7)} remainder ${selected.mod7}`,
            `The answer is ${solution}`
          ],
          maxRange: 100,
        };
      },
    ],
    
    extreme: [
      // Dynamic: Complex digit relationship
      () => {
        const configs = [
          { h: 3, t: 4, o: 8, sum: 15 }, // 348
          { h: 4, t: 2, o: 6, sum: 12 }, // 426
          { h: 5, t: 3, o: 7, sum: 15 }, // 537
          { h: 2, t: 5, o: 5, sum: 12 }, // 255
        ];
        const config = configs[Math.floor(Math.random() * configs.length)];
        const solution = config.h * 100 + config.t * 10 + config.o;
        const product = config.t * config.o;
        const hSquared = config.h * config.h;
        return {
          puzzle: `I am a three-digit number. My hundreds digit squared (${hSquared}) equals my tens digit times my ones digit (${product}). The sum of my digits is ${config.sum}. What am I?`,
          solution: solution,
          hints: [
            `Think about squared numbers: 1, 4, 9, 16, 25...`,
            `If hundreds = ${config.h}, then ${hSquared} = tens × ones`,
            `${config.h} + ${config.t} + ${config.o} = ${config.sum}`
          ],
          maxRange: 1000,
        };
      },
      
      // Dynamic: Fibonacci-related
      () => {
        const fibPairs = [
          { prev: 13, curr: 21, next: 34 },
          { prev: 21, curr: 34, next: 55 },
          { prev: 34, curr: 55, next: 89 },
        ];
        const selected = fibPairs[Math.floor(Math.random() * fibPairs.length)];
        return {
          puzzle: `I am a Fibonacci number. The number before me is ${selected.prev} and the number after me is ${selected.next}. What am I?`,
          solution: selected.curr,
          hints: [
            `In Fibonacci: each number = sum of previous two`,
            `${selected.prev} + ? = ${selected.next}`,
            `The answer is ${selected.curr}`
          ],
          maxRange: 150,
        };
      },
    ],
  },
  
  logical: {
    easy: [
      // Dynamic: Simple equation
      () => {
        const solution = Math.floor(Math.random() * 40) + 10; // 10-49
        const doubled = solution * 2;
        return {
          puzzle: `If you add me to myself, you get ${doubled}. What am I?`,
          solution: solution,
          hints: [
            `x + x = ${doubled}`,
            `2x = ${doubled}`,
            `x = ${solution}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Half of number
      () => {
        const doubled = Math.floor(Math.random() * 50 + 25) * 2; // Even number 50-150
        const solution = doubled / 2;
        return {
          puzzle: `I am half of ${doubled}. What am I?`,
          solution: solution,
          hints: [
            `${doubled} ÷ 2 = ?`,
            `Think of splitting ${doubled} in half`,
            `${solution} + ${solution} = ${doubled}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Arithmetic sequence
      () => {
        const multiplier = Math.floor(Math.random() * 5) + 2; // 2-6
        const base = Math.floor(Math.random() * 15) + 10; // 10-24
        const subtract = Math.floor(Math.random() * 15) + 5; // 5-19
        const solution = (multiplier * base) - subtract;
        return {
          puzzle: `I am ${subtract} less than ${multiplier} times ${base}. What am I?`,
          solution: solution,
          hints: [
            `First: ${multiplier} × ${base} = ${multiplier * base}`,
            `Then subtract ${subtract}`,
            `${multiplier * base} - ${subtract} = ${solution}`
          ],
          maxRange: 150,
        };
      },
    ],
    
    medium: [
      // Dynamic: Digit sum with multiple constraint
      () => {
        const multiples9 = [54, 63, 72, 81, 90, 99];
        const validNumbers = [];
        for (let num of multiples9) {
          const digitSum = Math.floor(num / 10) + (num % 10);
          if (digitSum >= 9 && digitSum <= 12) {
            validNumbers.push({ num, sum: digitSum });
          }
        }
        const selected = validNumbers[Math.floor(Math.random() * validNumbers.length)];
        return {
          puzzle: `I am between 50-100. My digits add up to ${selected.sum}. I'm a multiple of 9. What am I?`,
          solution: selected.num,
          hints: [
            `Multiples of 9 between 50-100: 54, 63, 72, 81, 90, 99`,
            `Which one has digits that sum to ${selected.sum}?`,
            `${Math.floor(selected.num / 10)} + ${selected.num % 10} = ${selected.sum}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Linear equation
      () => {
        const solution = Math.floor(Math.random() * 20) + 20; // 20-39
        const multiplier = 3;
        const constant = Math.floor(Math.random() * 20) + 10; // 10-29
        const result = multiplier * solution + constant;
        return {
          puzzle: `If you triple me and add ${constant}, you get ${result}. What am I?`,
          solution: solution,
          hints: [
            `3x + ${constant} = ${result}`,
            `3x = ${result} - ${constant} = ${result - constant}`,
            `x = ${result - constant} ÷ 3 = ${solution}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Age puzzle
      () => {
        const currentAge = Math.floor(Math.random() * 30) + 20; // 20-49
        const yearsAgo = Math.floor(Math.random() * 10) + 5; // 5-14
        const ageRatio = 2;
        const pastAge = currentAge - yearsAgo;
        const otherPastAge = pastAge / ageRatio;
        const otherCurrentAge = otherPastAge + yearsAgo;
        
        // Only use if it results in whole numbers
        if (otherCurrentAge === Math.floor(otherCurrentAge)) {
          return {
            puzzle: `I am a number. ${yearsAgo} years ago, I was twice as large as ${Math.floor(otherCurrentAge)}. What am I now?`,
            solution: currentAge,
            hints: [
              `${yearsAgo} years ago, you were ${pastAge}`,
              `${Math.floor(otherCurrentAge)} was ${Math.floor(otherPastAge)} back then`,
              `The answer is ${currentAge}`
            ],
            maxRange: 100,
          };
        }
        // Fallback to simpler puzzle
        return {
          puzzle: `If you triple me and add 12, you get 99. What am I?`,
          solution: 29,
          hints: [
            `3x + 12 = 99`,
            `3x = 87`,
            `x = 29`
          ],
          maxRange: 100,
        };
      },
    ],
    
    hard: [
      // Dynamic: Remainder puzzle
      () => {
        const mod7Remainder = Math.floor(Math.random() * 6) + 1; // 1-6
        const mod5Remainder = Math.floor(Math.random() * 4) + 1; // 1-4
        
        // Find solutions between 10-100
        const solutions = [];
        for (let i = 10; i <= 100; i++) {
          if (i % 7 === mod7Remainder && i % 5 === mod5Remainder) {
            solutions.push(i);
          }
        }
        
        if (solutions.length > 0) {
          const solution = solutions[Math.floor(Math.random() * solutions.length)];
          return {
            puzzle: `When I divide by 7, the remainder is ${mod7Remainder}. When I divide by 5, the remainder is ${mod5Remainder}. I am between 10 and 100. What am I?`,
            solution: solution,
            hints: [
              `Number ≡ ${mod7Remainder} (mod 7) and ≡ ${mod5Remainder} (mod 5)`,
              `Try: ${solution} ÷ 7 = ${Math.floor(solution / 7)} remainder ${mod7Remainder}`,
              `The answer is ${solution}`
            ],
            maxRange: 100,
          };
        }
        
        // Fallback
        return {
          puzzle: `When I divide by 7, I get a remainder of 3. When I divide by 5, I get a remainder of 2. I am between 50 and 100. What am I?`,
          solution: 52,
          hints: [
            "Number ≡ 3 (mod 7) and ≡ 2 (mod 5)",
            "Try: 52 ÷ 7 = 7 remainder 3, 52 ÷ 5 = 10 remainder 2",
            "The answer is 52"
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: System of equations
      () => {
        const x = Math.floor(Math.random() * 20) + 10; // 10-29
        const y = Math.floor(Math.random() * 20) + 10; // 10-29
        const sum = x + y;
        const diff = Math.abs(x - y);
        const solution = Math.max(x, y);
        return {
          puzzle: `I am thinking of two numbers. Their sum is ${sum} and their difference is ${diff}. What is the larger number?`,
          solution: solution,
          hints: [
            `Let the numbers be a and b`,
            `a + b = ${sum} and a - b = ${diff}`,
            `Adding equations: 2a = ${sum + diff}, so a = ${solution}`
          ],
          maxRange: 100,
        };
      },
    ],
  },
  
  pattern: {
    easy: [
      // Dynamic: Arithmetic sequence
      () => {
        const start = Math.floor(Math.random() * 5) + 2; // 2-6
        const step = Math.floor(Math.random() * 4) + 2; // 2-5
        const length = 5;
        const sequence = Array.from({ length }, (_, i) => start + i * step);
        const solution = start + length * step;
        return {
          puzzle: `Complete the pattern: ${sequence.join(', ')}, ?`,
          solution: solution,
          hints: [
            `Each number increases by ${step}`,
            `The pattern: +${step}, +${step}, +${step}...`,
            `${sequence[length - 1]} + ${step} = ${solution}`
          ],
          maxRange: 50,
        };
      },
      
      // Dynamic: Multiples
      () => {
        const multiplier = Math.floor(Math.random() * 5) + 3; // 3-7
        const length = 4;
        const sequence = Array.from({ length }, (_, i) => multiplier * (i + 1));
        const solution = multiplier * (length + 1);
        return {
          puzzle: `Complete the pattern: ${sequence.join(', ')}, ?`,
          solution: solution,
          hints: [
            `Multiples of ${multiplier}`,
            `Add ${multiplier} each time`,
            `${sequence[length - 1]} + ${multiplier} = ${solution}`
          ],
          maxRange: 50,
        };
      },
    ],
    
    medium: [
      // Dynamic: Fibonacci-style
      () => {
        const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        const startIdx = Math.floor(Math.random() * 4); // Start at index 0-3
        const length = 7;
        const sequence = fib.slice(startIdx, startIdx + length);
        const solution = fib[startIdx + length];
        return {
          puzzle: `Complete the Fibonacci sequence: ${sequence.join(', ')}, ?`,
          solution: solution,
          hints: [
            "Each number is the sum of the two before it",
            `${sequence[length - 2]} + ${sequence[length - 1]} = ?`,
            `The answer is ${solution}`
          ],
          maxRange: 100,
        };
      },
      
      // Dynamic: Perfect squares
      () => {
        const start = Math.floor(Math.random() * 3) + 2; // 2-4
        const length = 5;
        const sequence = Array.from({ length }, (_, i) => Math.pow(start + i, 2));
        const solution = Math.pow(start + length, 2);
        return {
          puzzle: `Complete the pattern: ${sequence.join(', ')}, ?`,
          solution: solution,
          hints: [
            `These are perfect squares: ${start}², ${start + 1}², ${start + 2}²...`,
            `What is ${start + length}²?`,
            `${start + length} × ${start + length} = ${solution}`
          ],
          maxRange: 150,
        };
      },
      
      // Dynamic: Doubling sequence
      () => {
        const start = Math.floor(Math.random() * 3) + 2; // 2-4
        const length = 6;
        const sequence = Array.from({ length }, (_, i) => start * Math.pow(2, i));
        const solution = start * Math.pow(2, length);
        return {
          puzzle: `Complete the pattern: ${sequence.join(', ')}, ?`,
          solution: solution,
          hints: [
            "Each number is double the previous",
            `${sequence[length - 1]} × 2 = ?`,
            `The answer is ${solution}`
          ],
          maxRange: 200,
        };
      },
    ],
    
    hard: [
      // Dynamic: Triangular numbers
      () => {
        const start = Math.floor(Math.random() * 3) + 2; // Start at 2nd, 3rd, or 4th triangular
        const length = 5;
        const sequence = [];
        for (let i = 0; i < length; i++) {
          const n = start + i;
          sequence.push((n * (n + 1)) / 2);
        }
        const nextN = start + length;
        const solution = (nextN * (nextN + 1)) / 2;
        return {
          puzzle: `Complete the pattern: ${sequence.join(', ')}, ?`,
          solution: solution,
          hints: [
            "These are triangular numbers: 1, 3, 6, 10, 15, 21...",
            `Pattern: n(n+1)/2`,
            `The answer is ${solution}`
          ],
          maxRange: 150,
        };
      },
      
      // Dynamic: Second differences
      () => {
        const configs = [
          { seq: [2, 6, 12, 20, 30], next: 42, diff: "increases by 2" },
          { seq: [3, 7, 13, 21, 31], next: 43, diff: "increases by 2" },
          { seq: [1, 5, 11, 19, 29], next: 41, diff: "increases by 2" },
        ];
        const config = configs[Math.floor(Math.random() * configs.length)];
        return {
          puzzle: `Complete the pattern: ${config.seq.join(', ')}, ?`,
          solution: config.next,
          hints: [
            `Differences: ${config.seq.map((n, i, arr) => i > 0 ? n - arr[i - 1] : null).filter(Boolean).join(', ')}`,
            `Next difference should be ${config.next - config.seq[config.seq.length - 1]}`,
            `${config.seq[config.seq.length - 1]} + ${config.next - config.seq[config.seq.length - 1]} = ${config.next}`
          ],
          maxRange: 50,
        };
      },
      
      // Dynamic: Geometric with addition
      () => {
        const configs = [
          { seq: [3, 7, 15, 31, 63], next: 127, rule: "(previous × 2) + 1" },
          { seq: [2, 5, 11, 23, 47], next: 95, rule: "(previous × 2) + 1" },
          { seq: [4, 9, 19, 39, 79], next: 159, rule: "(previous × 2) + 1" },
        ];
        const config = configs[Math.floor(Math.random() * configs.length)];
        return {
          puzzle: `Complete the pattern: ${config.seq.join(', ')}, ?`,
          solution: config.next,
          hints: [
            `Each number is ${config.rule}`,
            `${config.seq[config.seq.length - 1]} × 2 = ${config.seq[config.seq.length - 1] * 2}, then add 1`,
            `The answer is ${config.next}`
          ],
          maxRange: 200,
        };
      },
    ],
  },
  
  wordplay: {
    easy: [
      // Fixed wordplay puzzles (these are language-based, harder to randomize)
      () => ({
        puzzle: "A number that sounds like a tool for making holes",
        solution: 4,
        hints: [
          "Think about carpentry tools",
          "Sounds like 'for'",
          "The number is 4 (four/fore)"
        ],
        maxRange: 10,
      }),
      
      () => ({
        puzzle: "A number that sounds like won",
        solution: 1,
        hints: [
          "First place in a race",
          "Homophone of 'won'",
          "The number is 1 (one)"
        ],
        maxRange: 10,
      }),
      
      () => ({
        puzzle: "A number that sounds like 'ate'",
        solution: 8,
        hints: [
          "Past tense of 'eat'",
          "Homophone of 'ate'",
          "The number is 8 (eight)"
        ],
        maxRange: 10,
      }),
      
      () => ({
        puzzle: "A number that sounds like 'too' or 'to'",
        solution: 2,
        hints: [
          "Also means 'also' or 'excessive'",
          "Homophone of 'too' and 'to'",
          "The number is 2 (two)"
        ],
        maxRange: 10,
      }),
    ],
    
    medium: [
      () => ({
        puzzle: "A number that's a score in tennis when you have nothing",
        solution: 0,
        hints: [
          "In tennis, zero is called...",
          "It's also a French word for egg",
          "The answer is 0 (love)"
        ],
        maxRange: 10,
      }),
      
      () => {
        const dozen = 12;
        const bakersDoz = 13;
        const solution = dozen + bakersDoz;
        return {
          puzzle: "A dozen plus a baker's dozen",
          solution: solution,
          hints: [
            `A dozen = ${dozen}`,
            `A baker's dozen = ${bakersDoz}`,
            `${dozen} + ${bakersDoz} = ${solution}`
          ],
          maxRange: 50,
        };
      },
      
      () => {
        const grossItems = 144; // 12 dozen
        const halfGross = grossItems / 2;
        return {
          puzzle: "Half of a gross (a dozen dozen)",
          solution: halfGross,
          hints: [
            "A gross = 12 × 12 = 144",
            "Half of that is 144 ÷ 2",
            `The answer is ${halfGross}`
          ],
          maxRange: 150,
        };
      },
      
      () => ({
        puzzle: "The number of players in a soccer team",
        solution: 11,
        hints: [
          "Think about football/soccer",
          "Each side has this many players on the field",
          "The answer is 11"
        ],
        maxRange: 20,
      }),
    ],
    
    hard: [
      () => {
        const score = 20; // A score = 20 years
        const pentagonSides = 5;
        const solution = score * pentagonSides;
        return {
          puzzle: "The number of years in a score, multiplied by the number of sides on a pentagon",
          solution: solution,
          hints: [
            `A score = ${score} years`,
            `A pentagon has ${pentagonSides} sides`,
            `${score} × ${pentagonSides} = ${solution}`
          ],
          maxRange: 150,
        };
      },
      
      () => {
        const centuryYears = 100;
        const decadeYears = 10;
        const solution = centuryYears / decadeYears;
        return {
          puzzle: "How many decades are in a century?",
          solution: solution,
          hints: [
            `A century = ${centuryYears} years`,
            `A decade = ${decadeYears} years`,
            `${centuryYears} ÷ ${decadeYears} = ${solution}`
          ],
          maxRange: 20,
        };
      },
      
      () => {
        const hoursInDay = 24;
        const daysInWeek = 7;
        const solution = hoursInDay * daysInWeek;
        return {
          puzzle: "The number of hours in a day multiplied by days in a week",
          solution: solution,
          hints: [
            `${hoursInDay} hours in a day`,
            `${daysInWeek} days in a week`,
            `${hoursInDay} × ${daysInWeek} = ${solution}`
          ],
          maxRange: 200,
        };
      },
      
      () => {
        const cardsInDeck = 52;
        const jokersRemoved = 2;
        const quartersInDeck = 4;
        const solution = (cardsInDeck - jokersRemoved) / quartersInDeck;
        return {
          puzzle: "A quarter of a standard deck of cards (without jokers)",
          solution: solution,
          hints: [
            `A standard deck has ${cardsInDeck} cards, minus ${jokersRemoved} jokers = ${cardsInDeck - jokersRemoved}`,
            `Divide by ${quartersInDeck} to get a quarter`,
            `The answer is ${solution}`
          ],
          maxRange: 20,
        };
      },
    ],
  },
};

// Export for use in generator
export default PUZZLE_GENERATORS;