export type Riddle = {
  riddle: string;
  answer: number;
};

// Add up to 50 riddles here
export const riddles: Riddle[] = [
  { riddle: "I am an odd number. Take away one letter and I become even. What number am I?", answer: 7 },
  { riddle: "What is half of two plus two?", answer: 3 },
  { riddle: "A grandmother, two mothers, and two daughters went to a baseball game. They bought one ticket each. How many tickets did they buy in total?", answer: 3 },
  { riddle: "How many sides does a circle have?", answer: 2 },
  { riddle: "Using only addition, how can you add eight 8s to get the number 1,000?", answer: 888 + 88 + 8 + 8 + 8 },
  { riddle: "What is the next number in the sequence: 1, 4, 9, 16, 25, ...?", answer: 36 },
  { riddle: "If a hen and a half lay an egg and a half in a day and a half, how many eggs will half a dozen hens lay in half a dozen days?", answer: 24 },
  { riddle: "I am a three-digit number. My second digit is 4 times bigger than the third digit. My first digit is 3 less than my second digit. What number am I?", answer: 141 },
  { riddle: "If you multiply this number by any other number, the answer will always be the same. What number is this?", answer: 0 },
  { riddle: "There are 10 apples. You take away 4. How many do you have?", answer: 4 },
  { riddle: "What is 5 x 4?", answer: 20 },
  { riddle: "There are 12 fish in a tank. 5 of them drown. How many are left?", answer: 12 },
  { riddle: "A farmer has 17 sheep and all but 9 die. How many are left?", answer: 9 },
  { riddle: "How many months have 28 days?", answer: 12 },
  { riddle: "What is the sum of the numbers on a standard die?", answer: 21 },
];
