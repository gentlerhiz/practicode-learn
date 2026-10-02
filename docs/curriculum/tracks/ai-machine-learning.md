# AI & Machine Learning

*Syllabus v0.1 (draft for practitioner review) · Licensed under CC BY-SA 4.0*

> **Build, evaluate and responsibly deploy machine-learning models, and understand the AI tools everyone is using.**

| | |
|---|---|
| **For** | Learners comfortable with basic algebra; programming experience helps but isn't required |
| **Prerequisites** | Secondary-school maths (algebra, percentages, graphs) |
| **Estimated effort** | ~140 hours across 12 modules plus a capstone |
| **Tools** | Python, Jupyter, NumPy, pandas, scikit-learn, TensorFlow and Keras *(tool list to be confirmed with PractiCode Academy)* |
| **Primary alignment** | [ACM/IEEE-CS/AAAI CS2023](https://csed.acm.org), Artificial Intelligence knowledge area (introductory and machine-learning units) |
| **Also aligned to** | SFIA 9: DATS@2–3, MLNG@2–3 · UNESCO Recommendation on the Ethics of AI (2021) · benchmarked against AWS Certified AI Practitioner (AIF-C01) and Microsoft Azure AI Fundamentals (AI-901) |
| **Credential** | PractiCode Learn Certificate: AI & Machine Learning (Open Badges 3.0) |

## By the end, you can

1. Write Python to load, clean and explore data.
2. Explain the core ideas of machine learning visually and intuitively: features, labels, loss and gradients.
3. Train, evaluate and tune supervised and unsupervised models with scikit-learn.
4. Build and train simple neural networks with TensorFlow and Keras.
5. Use generative AI and large language models effectively and critically.
6. Identify and reduce bias and privacy risks in AI systems.
7. Deploy a model behind a simple interface.

## Modules

| # | Module | Key outcomes | CS2023 / SFIA | Project |
|---|---|---|---|---|
| 1 | **What AI and ML really are** · *Free* | Tell AI, ML and deep learning apart; describe how a model learns from data; spot hype | AI: fundamental issues | "Is this really AI?": analyse five product claims |
| 2 | **Python foundations** | Use variables, control flow, functions, lists and dictionaries; read errors | — | A text-analysis script |
| 3 | **Working with data: NumPy and pandas** | Load, filter, group and join data; handle missing values | DATS@2 | Clean and summarise a public dataset |
| 4 | **The maths of ML, visually** | Explain vectors, distance, slope and gradient, and probability, all through interactive diagrams | AI: ML foundations | An interactive gradient-descent notebook |
| 5 | **Exploratory data analysis** | Visualise distributions and relationships; form hypotheses | DATS@2 | An EDA report |
| 6 | **Supervised learning** | Train regression and classification models; split train and test sets correctly | AI: ML; MLNG@2 | Predict house prices or crop yields |
| 7 | **Evaluating models** | Choose metrics; use cross-validation; diagnose over- and underfitting; tune hyperparameters | MLNG@2–3 | A model comparison report |
| 8 | **Unsupervised learning** | Cluster data; reduce dimensions; use PCA | AI: ML | Customer segmentation |
| 9 | **Neural networks and deep learning** | Explain neurons, layers and backpropagation; train a Keras model | AI: neural networks | An image classifier |
| 10 | **Generative AI and LLMs** | Explain tokens, embeddings and prompting; build a basic retrieval-augmented app; know the limits | AI: generative models | A question-answering assistant over documents |
| 11 | **Responsible AI** | Assess bias, fairness, privacy and transparency; apply the UNESCO principles and data-protection law | AI: society, ethics | A model risk assessment |
| 12 | **Deploying a model** | Save, serve and monitor a model; build a simple web interface | MLNG@3 | Deploy your Module 6 model |
| ★ | **Capstone** | Solve a real problem with ML, end to end, with an ethics review | — | A published notebook, a deployed demo and a write-up |

## How the code runs

Python runs **in the browser** through Pyodide (Python compiled to WebAssembly), which supports NumPy, pandas and scikit-learn. Learners need no installation and no paid cloud notebooks, and the platform has no server cost. Deep-learning modules use small models that run in the browser, with optional free cloud notebooks for larger experiments.

## Assessment

In-lesson predictions and code tasks with tests, module mastery checks, notebook projects marked against a rubric (correctness, evaluation rigour, communication, ethics) and a capstone.

## Device notes

Concept, maths and ethics lessons work well on phones. Coding modules work best on a laptop. Pyodide needs a one-time download of roughly 10–30 MB, depending on which libraries a module uses (scikit-learn and SciPy are the largest). It is cached for offline use, and we say this up front with a "download on Wi-Fi" prompt.
