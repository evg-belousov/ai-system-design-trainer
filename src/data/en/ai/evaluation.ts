import type { Question } from '@/data/types';

export const evaluationQuestions: Question[] = [
  {
    id: 'ai-evaluation-001',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is perplexity and why is it used to evaluate language models?',
    options: [
      'The number of model parameters, which affects quality',
      'A measure of how "surprised" the model is by text: the lower the perplexity, the better the model predicts the text',
      'The time the model needs to generate a single token',
      'The percentage of correct answers on a benchmark',
    ],
    correctIndex: 1,
    explanation:
      'Perplexity = 2^(cross-entropy loss) = exp(average negative log-likelihood). Intuition: a perplexity of N means the model is "choosing" among N equally likely tokens at each step. The lower it is, the more confident the model. Example: perplexity 10 → the model behaves as if choosing among 10 options. Use: comparing base models, assessing quality on domain data. Limitations: it does not reflect instruction-following, safety, or reasoning. Two models with the same perplexity can differ greatly on user-facing metrics.',
  },
  {
    id: 'ai-evaluation-002',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What are the MMLU and HumanEval benchmarks used for?',
    options: [
      'MMLU — for evaluating inference speed, HumanEval — for evaluating UX',
      'MMLU — for evaluating knowledge and reasoning across 57 subjects, HumanEval — for evaluating the ability to generate correct code',
      'Both benchmarks evaluate a model\'s toxicity',
      'MMLU — for evaluating translation, HumanEval — for evaluating summarization',
    ],
    correctIndex: 1,
    explanation:
      'MMLU (Massive Multitask Language Understanding): 57 subjects from mathematics to law. Multiple-choice. Evaluates the "breadth of knowledge" of a model. GPT-4: ~86%, Claude 3.5 Sonnet: ~88%. Criticism: data contamination (models may have seen the answers during training), and multiple-choice does not reflect real-world use. HumanEval: 164 Python tasks. The model generates a function from a docstring, verified by unit tests. pass@1 — the percentage correct on the first attempt. GPT-4: ~86%, Claude 3.5 Sonnet: ~92%. Important: no single benchmark is an exhaustive evaluation — a combination is needed.',
  },
  {
    id: 'ai-evaluation-003',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What are the BLEU and ROUGE metrics?',
    options: [
      'Metrics for evaluating a model\'s training speed',
      'BLEU — a precision-based metric for translation (how many n-grams of the generation match the reference); ROUGE — a recall-based metric for summarization (how many n-grams of the reference are covered by the generation)',
      'Metrics for evaluating a model\'s safety',
      'Metrics for evaluating GPU memory consumption',
    ],
    correctIndex: 1,
    explanation:
      'BLEU (Bilingual Evaluation Understudy): computes the precision of n-grams (1-4). Question: what fraction of the n-grams in the generation are present in the reference? Used for machine translation. ROUGE (Recall-Oriented Understudy for Gisting Evaluation): computes the recall of n-grams. Question: what fraction of the reference\'s n-grams are present in the generation? ROUGE-1 (unigrams), ROUGE-2 (bigrams), ROUGE-L (longest common subsequence). Used for summarization. Limitations of both: they do not account for semantics (a paraphrase gets a low score) and depend on the reference (a single "correct" summary does not exist). For LLMs, LLM-as-judge is increasingly used instead of n-gram metrics.',
  },
  {
    id: 'ai-evaluation-004',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What is "LLM-as-judge" and what are the advantages and limitations of this approach?',
    options: [
      'Using an LLM to train other models',
      'Using an LLM to automatically evaluate the quality of another model\'s responses against given criteria; faster and cheaper than human eval, but has bias (a preference for long answers and for its own style)',
      'The legal use of AI in court proceedings',
      'A method for selecting the best model from a list of candidates',
    ],
    correctIndex: 1,
    explanation:
      'LLM-as-judge: a strong model (GPT-4, Claude) evaluates responses against criteria (relevance, helpfulness, accuracy). Formats: pointwise (a 1-5 score), pairwise (is A better than B?), reference-based (comparison with a gold answer). Advantages: scalable (1000+ evaluations in minutes), 10-100x cheaper than human eval, reproducible. Limitations: position bias (prefers the first answer in pairwise), verbosity bias (longer answers = better), self-enhancement bias (prefers its own style), does not catch subtle factual errors. Best practice: calibrate against human eval, use structured rubrics, randomize the order in pairwise.',
  },
  {
    id: 'ai-evaluation-005',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'middle',
    type: 'open',
    question: 'What is data contamination (benchmark leakage) and why is it a problem for evaluating LLMs?',
    sampleAnswer:
      'Data contamination: benchmark data ends up in an LLM\'s training corpus. The model "memorizes" the answers instead of reasoning. Result: inflated metrics that do not reflect real capabilities. Examples: MMLU and GSM8K are widely available online → models trained on Common Crawl may have seen the answers. Scale: studies show 1-10% overlap for popular benchmarks. Consequences: you cannot trust benchmark scores without checking for contamination. Solutions: (1) Dynamic benchmarks: new tasks regularly (Chatbot Arena — live rankings based on user votes). (2) Contamination detection: n-gram overlap analysis between train data and the benchmark. (3) Private test sets: do not publish answers. (4) Harder benchmarks: tasks requiring reasoning rather than memorization (GPQA, SWE-bench). (5) Held-out evaluation: your own eval sets that are not published online.',
    explanation:
      'Data contamination is a serious industry problem. Chatbot Arena (LMSYS) partly addresses it through live evaluation: real users compare model responses blind. The Arena ELO rating is considered one of the most reliable LLM comparisons. For your own applications: always create your own eval sets.',
  },
  {
    id: 'ai-evaluation-006',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'middle',
    type: 'open',
    question: 'How do you evaluate the quality of a RAG system? Which metrics should you use?',
    sampleAnswer:
      'RAG metrics evaluate two components: retrieval and generation. Retrieval: (1) Context Precision: what fraction of the retrieved chunks is actually relevant to the question. (2) Context Recall: what fraction of the necessary information was found. (3) MRR (Mean Reciprocal Rank): the position of the first relevant result. Generation: (4) Faithfulness: the answer is grounded in the retrieved context (no hallucination). (5) Answer Relevancy: the answer addresses the question. (6) Answer Correctness: factual correctness (comparison with ground truth). End-to-end: (7) Answer Similarity: closeness to a reference answer (semantic similarity). Frameworks: RAGAS (popular, LLM-based metrics), DeepEval, TruLens. Approach: create an eval dataset (50-100 question-answer pairs) and run it on every change to the pipeline (chunking, model, prompts).',
    explanation:
      'Eval-driven development is the key to a quality RAG. Without an eval dataset it is impossible to objectively compare: chunk size 256 vs 512, model A vs B, with a reranker vs without. RAGAS is the de facto standard, but requires calibration for the specific domain.',
  },
  {
    id: 'ai-evaluation-007',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you detect and measure LLM hallucinations? What approaches exist?',
    sampleAnswer:
      'Approaches: (1) Reference-based: comparison with a gold-standard answer. NLI (Natural Language Inference): check whether the answer is entailed by the reference. Limitation: a reference is required. (2) Reference-free (faithfulness): check that the answer follows from the provided context (for RAG). SelfCheckGPT: generate several answers and check consistency — hallucinations are usually inconsistent. (3) LLM-as-judge: ask a strong model to assess factuality. (4) Retrieval-based verification: verify facts from the answer via search. (5) Claim decomposition: break the answer into atomic claims and verify each separately. (6) Uncertainty estimation: high entropy/low confidence → higher hallucination risk. Metrics: hallucination rate (% of answers with false statements), faithfulness score (RAGAS), factual consistency (SummaC, AlignScore). In practice: a combination of LLM-as-judge + claim decomposition for critical applications.',
    explanation:
      'Hallucination detection is an active research area. 100% detection is impossible (you would need to know all facts). Practical approach: (1) reduce hallucinations (RAG, CoT, grounding), (2) detect the remaining ones (automated checks), (3) human verification for critical outputs.',
  },
  {
    id: 'ai-evaluation-008',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is Chatbot Arena (LMSYS) and why is its ELO rating considered one of the most reliable?',
    options: [
      'An automatic benchmark that runs all models on a single set of tasks',
      'A platform where real users blindly compare the responses of two anonymous models; the ELO rating is built on thousands of such votes and is resistant to data contamination',
      'A competition between companies on GPU performance',
      'A closed-source benchmark available only to researchers',
    ],
    correctIndex: 1,
    explanation:
      'Chatbot Arena: (1) A user asks a question. (2) Two anonymous models answer in parallel. (3) The user votes on which answer is better (A/B/tie). (4) After the vote, the models are revealed. The ELO rating is computed based on 1M+ votes. Advantages: (1) human evaluation at scale, (2) no data contamination (fresh questions from users), (3) task diversity (real use cases), (4) blind evaluation (no brand bias). Limitations: bias toward chatbot tasks (not coding, not agents), recency bias, demographic bias (who uses the Arena). Extensions: Arena-Hard (an automatic version using LLM-as-judge on Arena-derived questions).',
  },
  {
    id: 'ai-evaluation-009',
    block: 'ai',
    topic: 'evaluation',
    topicLabel: 'Model Evaluation',
    difficulty: 'senior',
    type: 'open',
    question: 'How do you build an eval system for your own LLM application? Describe the process from the beginning to automation.',
    sampleAnswer:
      'Process: (1) Define criteria: what a "good answer" means for your application. Rubric: accuracy, completeness, format, tone, safety. Each criterion is a 1-5 scale with a description. (2) Create an eval dataset: 50-100 examples (input, expected_output, metadata). Sources: real user queries, edge cases, adversarial inputs. A golden dataset — manually verified pairs. (3) Human eval baseline: have people label the golden dataset. Inter-annotator agreement (Cohen\'s kappa > 0.7). This is the baseline for calibrating automated metrics. (4) Automated evals: LLM-as-judge prompts for each criterion. Calibrate against human eval (correlation > 0.8). Code-based checks: format, length, forbidden words. (5) CI/CD integration: run evals on every change to the prompt/model/pipeline. Fail if quality drops > threshold. (6) Monitoring: sample production traffic for continuous eval. Drift detection on quality metrics. (7) Iteration: expand the eval set (add failure cases), update rubrics. Tools: Braintrust, promptfoo, custom scripts with the OpenAI/Anthropic API.',
    explanation:
      'Eval is not a one-time activity but a continuous process. Principle: eval-driven development — every change is checked against the eval suite. Without eval you optimize blindly. A minimum viable eval: 30 examples + LLM-as-judge + one key criterion.',
  },
];
