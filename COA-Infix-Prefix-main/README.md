⚙️ Infix to Prefix Assembly Code Generator

A lightweight and interactive web application that converts infix expressions into prefix notation and automatically generates their corresponding assembly-level code.
Built entirely with HTML, CSS, and vanilla JavaScript, this project demonstrates expression parsing, operator precedence, and low-level computation simulation — all within a clean, modern interface.

🌟 Key Features

Infix → Prefix Conversion
Converts standard algebraic expressions into prefix form with correct operator precedence.

Assembly Code Generation
Produces human-readable pseudo-assembly instructions for the given expression.

Interactive Interface
Includes a responsive, neon-themed design with real-time output updates.

Comprehensive Theory Section
A dedicated page explaining infix, prefix, and postfix notations, as well as the fundamentals of assembly code generation.

🧮 Example

Input Expression:

(7 + 3) × (4 − 2)


Prefix Expression:

× + 7 3 − 4 2


Generated Assembly Code:

LOAD 7

ADD 3

STORE T1

LOAD 4

SUB 2

STORE T2

LOAD T1

MUL T2

STORE T3
