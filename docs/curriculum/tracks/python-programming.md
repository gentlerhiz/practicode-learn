# Python Programming

*Syllabus v0.1 (draft for practitioner review) · Licensed under CC BY-SA 4.0*

> **Write real programs in Python, from your very first line to tested, well-organised code: the language behind data analysis, AI, automation and security tools.**

| | |
|---|---|
| **For** | Complete beginners who have never written code, and anyone heading for Data Analysis, AI & Machine Learning or Cybersecurity and the Linux Command Line, which all build on it |
| **Prerequisites** | None. IT Fundamentals helps. |
| **Estimated effort** | ~60 hours across 12 modules (about 75 lessons) plus a capstone (≈ 4 months at 4 hours a week) |
| **Tools** | Python runs in the browser through Pyodide (CPython compiled to WebAssembly, free and open source), so Modules 1–8 need nothing installed and work on a phone. From Module 9, learners also install Python (free) on a laptop. |
| **Primary alignment** | The [Python Institute](https://pythoninstitute.org)'s PCEP-30-02 (Certified Entry-Level Python Programmer) syllabus, then PCAP-31-03 (Certified Associate) for Modules 7–11 |
| **Also aligned to** | [PEP 8](https://peps.python.org/pep-0008/) (Python's style guide) · ACM CS2023: Software Development Fundamentals · SFIA 9 level 2 (Assist): PROG |
| **Credential** | PractiCode Learn Certificate: Python Programming (Open Badges 3.0) |

## By the end, you can

1. Explain what a program is, run Python code, and read Python's error messages to fix your own mistakes.
2. Store and change data with variables, numbers, strings, lists, tuples, dictionaries and sets.
3. Control a program with decisions and loops.
4. Break a problem into functions with clear parameters and return values.
5. Read and write files, including CSV and JSON, and handle errors with exceptions.
6. Organise code into modules and packages, and use the standard library and packages from PyPI.
7. Model real things with classes and objects.
8. Write readable, tested Python that follows PEP 8.
9. Use Python for real work: automating tasks, calling web APIs and a first look at data with pandas.

## Modules

Every module ends with a check and a hands-on project, and includes a *Myth or fact* step on what people commonly get wrong about its topic.

| # | Module | Key outcomes | Standard | Project |
|---|---|---|---|---|
| 1 | **Getting started with Python** · *Free* | Explain what a program is and how Python runs it; print output; read an error message; store values in variables; do maths with Python's operators; build text with strings and f-strings | PCEP 1: Computer programming and Python fundamentals | A receipt printer for a market stall |
| 2 | **Making decisions** | Compare values; write if, elif and else; combine conditions with and, or and not; take input from the user; debug a decision | PCEP 2: Control flow (conditional blocks) | A quiz that marks itself |
| 3 | **Loops** | Repeat with for and range; loop with while; stop or skip with break and continue; build patterns with loops | PCEP 2: Control flow (loops) | A times-table and pattern printer |
| 4 | **Lists and tuples** | Create, index and slice lists; change them; loop over them; write list comprehensions; use tuples; sort and search | PCEP 3: Data collections | A to-do list manager |
| 5 | **Functions** | Define functions with parameters and return values; use default and keyword arguments; explain scope; document and test a function | PCEP 4: Functions and exceptions | A unit converter built from functions |
| 6 | **Dictionaries and sets** | Store and look up data in dictionaries; loop over them; work with nested data; use sets; choose the right collection; convert to and from JSON | PCEP 3: Data collections | A contacts book |
| 7 | **Strings and text** | Use string methods; split and join; format output; search text; explain Unicode; try a first regular expression | PCAP 2: Strings | A text analyser: word counts and the longest word |
| 8 | **Files and errors** | Read and write text and CSV files; handle exceptions with try, except and finally; raise your own errors | PCAP 4: Exceptions · PCAP 5: Files | A grade report from a CSV file |
| 9 | **Modules and packages** | Import modules; use the standard library; write a module and a package; install packages with pip in a virtual environment; read documentation | PCAP 1: Modules and packages | Your own module, used by a small app |
| 10 | **Objects and classes** | Explain objects; write classes with attributes and methods; use inheritance; add special methods; decide when a class helps | PCAP 3: Object-oriented programming | A bank account class with deposits and withdrawals |
| 11 | **Writing good code** | Follow PEP 8; test with pytest; debug with tools; add type hints; refactor safely; keep Python projects in Git | PEP 8 · SFIA 9: PROG | Clean up and test a messy program |
| 12 | **Real-world Python** | Work with dates; automate a task; call a web API; take a first look at data with pandas; build a command-line program | ACM CS2023: Software Development Fundamentals | An automation script for a real chore |
| ★ | **Capstone** | Plan, build, test and document a complete Python program that solves a real problem | All | A complete Python program of your choice, tested and documented |

## Lessons

Each lesson takes 8–14 minutes and follows the [lesson format](../lesson-format.md).

1. **Getting started with Python** (6): What a program is · Your first program: print · Errors are messages · Variables · Numbers and maths · Strings and f-strings
2. **Making decisions** (6): True, False and comparisons · if, elif and else · and, or and not · Nested decisions · Input from the user · Debugging decisions
3. **Loops** (6): Why loops · for loops and range · while loops · break and continue · Loops with conditions · Patterns with loops
4. **Lists and tuples** (7): Lists · Indexing and slicing · Changing lists · Looping over lists · List comprehensions · Tuples · Sorting and searching
5. **Functions** (7): Why functions · Parameters and return · Default and keyword arguments · Scope · Functions calling functions · Docstrings and readable code · Testing a function
6. **Dictionaries and sets** (6): Dictionaries · Looping over dictionaries · Nested data · Sets · Choosing the right collection · JSON and Python
7. **Strings and text** (6): String methods · Splitting and joining · Formatting output · Searching text · Unicode and encodings · Regular expressions: a first look
8. **Files and errors** (6): Reading files · Writing files · CSV files · Exceptions · try, except and finally · Raising your own errors
9. **Modules and packages** (6): Importing modules · The standard library · Writing your own module · Packages · pip and virtual environments · Reading documentation
10. **Objects and classes** (7): Objects everywhere · Classes and instances · Methods · Attributes and __init__ · Inheritance · Special methods · When to use classes
11. **Writing good code** (6): PEP 8 and style · Testing with pytest · Debugging tools · Type hints · Refactoring · Version control for Python
12. **Real-world Python** (6): Working with dates · Automating tasks · Calling web APIs · Data with pandas: a first look · Command-line programs · Where to go next

## Labs

- **How Python runs** (Module 1): a program run one line at a time, with its output building up.
- **Variables** (Module 1): names as labels on values, and what happens when a value changes.
- **Operators** (Module 1): every arithmetic operator on the same two numbers, with the result and its type.
- **Reading a traceback** (Module 1): each part of an error message, and what it tells you.
- **String tools** (Module 1): what len, upper, indexing and f-strings do to one piece of text.
- **Comparisons** (Module 2): one comparison, each side's type, and True or False, including the traps: '10' == 10 and 0.1 + 0.2.
- **The elif ladder** (Module 2): a score marked by if, elif and else, each test checked or skipped, and the same ladder in the wrong order.
- **Truth table** (Module 2): switches for and, or and not, with every combination and the learner's row marked.
- **Decision tree** (Module 2): a decision inside a decision, walked by three people, then written flat.
- **input() gives text** (Module 2): an answer arriving as a string, the TypeError, and int().
- **Python in the browser** (every module): real Python 3.14 through Pyodide, in the code editor, with print output and errors in the console.

## Assessment

In-lesson tasks with instant checks, module mastery checks (80% pass mark), projects with automatic checks, and a capstone.

## Device notes

Modules 1–8 work on a phone. Python takes a few seconds to start the first time, and is cached after that. From Module 9, learners need a laptop or desktop to install Python and packages; the browser labs still work.

## Next steps after this course

Data Analysis (with SQL and Databases), AI & Machine Learning, or Cybersecurity and the Linux Command Line.
