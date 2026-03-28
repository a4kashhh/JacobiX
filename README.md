# Jacobi Iteration Engine

## Project Title

Implementation of Gauss–Jacobi Iterative Method for Solving Systems of Linear Equations

---

## Academic Details

Guided by: Dr. Anupam Sen
School: School of Advanced Sciences and Languages
Department: Mathematics
Institution: VIT Bhopal University

---

## Abstract

The Gauss–Jacobi Iterative Method is a widely used numerical technique for solving systems of linear equations, particularly when direct methods become computationally expensive. This project presents a complete implementation of the Jacobi method using web technologies, enabling users to compute approximate solutions iteratively.

The system begins with an initial approximation and continuously refines the solution using previously computed values until convergence is achieved. This project combines mathematical theory with practical implementation, making it suitable for both academic learning and real-world applications.

---

## Objectives

* To understand the concept of iterative numerical methods
* To implement the Gauss–Jacobi method using JavaScript
* To analyze convergence conditions of linear systems
* To design a user-friendly interface for solving equations
* To bridge theoretical mathematics with programming

---

## Theoretical Background

A system of linear equations can be written in matrix form as:

Ax = b

Where:
A is the coefficient matrix
x is the vector of unknown variables
b is the constant vector

The Jacobi method rewrites each equation in the form:

xᵢ^(k+1) = (1 / aᵢᵢ) [ bᵢ − Σ(aᵢⱼ xⱼ^(k)) , where j ≠ i ]

Each variable is computed independently using values from the previous iteration.

---

## Convergence Criteria

The method converges if the following conditions are satisfied:

1. Diagonal Dominance
   |aᵢᵢ| > Σ|aᵢⱼ| for j ≠ i

2. Spectral Radius Condition
   The spectral radius of the iteration matrix must be less than 1

If these conditions are not satisfied, the method may fail to converge.

---

## Methodology

1. Accept input system of linear equations
2. Convert into matrix form
3. Initialize variables with an initial guess (usually zero)
4. Apply Jacobi iteration formula
5. Repeat iterations until error is less than tolerance
6. Display final approximate solution

---

## Algorithm

1. Start
2. Input matrix A and vector b
3. Initialize x(0) = 0
4. For each iteration:

   * Compute new values using Jacobi formula
   * Calculate error
   * Check convergence
5. If converged, stop
6. Else, repeat
7. Output final values

---

## Project Structure

```
MathsFinal/
│
├── index.html              # User Interface
├── style.css               # Styling
├── script.js               # Jacobi logic implementation
├── your-college-logo.png   # College branding
└── README.md               # Documentation
```

---

## Technologies Used

* HTML
* CSS
* JavaScript

---

## How to Run

1. Clone the repository

git clone https://github.com/your-username/JacobiIterationEngine.git

2. Open the project folder

3. Run index.html in any modern browser

---

## Example Problem

10x + y + z = 12
2x + 10y + z = 13
2x + 2y + 10z = 14

Initial guess:
x = 0, y = 0, z = 0

The solution improves with each iteration until convergence.

---

## Advantages

* Simple and easy to implement
* Suitable for large systems
* Can be parallelized
* Requires less memory

---

## Limitations

* Convergence is slow
* Requires diagonally dominant matrix
* Sensitive to initial guess
* May diverge in some cases

---

## Future Scope

* Implementation of Gauss–Seidel Method
* Graphical visualization of convergence
* Error vs iteration plots
* Dynamic matrix input system
* Export results as PDF or CSV

---

## Learning Outcomes

* Understanding of numerical methods
* Practical implementation of mathematical algorithms
* Improved problem-solving skills
* Integration of frontend with computational logic

---

## Acknowledgment

I sincerely express my gratitude to Dr. Anupam Sen, School of Advanced Sciences and Languages, Department of Mathematics, for valuable guidance and support throughout the development of this project.

---

## Author

Akash Kumar Pandey
Computer Science Undergraduate
VIT Bhopal University

---

## License

This project is open-source and available under the MIT License.
