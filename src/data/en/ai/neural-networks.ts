import type { Question } from '@/data/types';

export const neuralNetworksQuestions: Question[] = [
  {
    id: 'ai-neural-networks-001',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What does an activation function do in a neural network?',
    options: [
      'Normalizes the input data before feeding it into the network',
      'Introduces nonlinearity, allowing the network to model complex relationships',
      'Determines the model learning rate',
      'Initializes the starting weights of the neurons',
    ],
    correctIndex: 1,
    explanation:
      'An activation function introduces nonlinearity into a neural network\'s computations. Without it, a network of any depth would be equivalent to a single linear transformation (a composition of linear functions is a linear function). Popular functions: ReLU (max(0, x)) — the standard for hidden layers, Sigmoid (1/(1+e^-x)) — for probabilities, Softmax — for multiclass classification, GELU — used in transformers.',
  },
  {
    id: 'ai-neural-networks-002',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'junior',
    type: 'quiz',
    question: 'What is backpropagation?',
    options: [
      'A method for initializing the weights of a neural network',
      'An algorithm for computing the gradients of the loss function with respect to the network weights via the chain rule of differentiation',
      'A way of passing data from the input to the output of the network',
      'A method for pruning inactive neurons',
    ],
    correctIndex: 1,
    explanation:
      'Backpropagation is an algorithm for efficiently computing the gradients of the loss function with respect to all of the network\'s parameters (weights). It uses the chain rule: gradients are computed from the output layer back to the input layer, reusing intermediate results. The computed gradients are then used by an optimizer (SGD, Adam) to update the weights. Forward pass → compute loss → backward pass (gradients) → update weights.',
  },
  {
    id: 'ai-neural-networks-003',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'junior',
    type: 'quiz',
    question: 'For what type of data were convolutional neural networks (CNNs) originally developed?',
    options: [
      'Tabular data',
      'Images',
      'Text sequences',
      'Graph data',
    ],
    correctIndex: 1,
    explanation:
      'CNNs (Convolutional Neural Networks) were developed to process data with a grid structure, primarily images. Key ideas: convolutional filters (kernels) to extract local features, weight sharing — a single filter is applied across the whole image, and pooling to reduce dimensionality. CNNs are also applied to audio (1D convolutions) and video (3D convolutions). Landmark architectures: LeNet, AlexNet, VGG, ResNet.',
  },
  {
    id: 'ai-neural-networks-004',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What problem do residual connections solve in the ResNet architecture?',
    options: [
      'They speed up inference by skipping layers',
      'They solve the vanishing/exploding gradient problem when training deep networks',
      'They reduce the number of model parameters',
      'They allow the network to be trained without activation functions',
    ],
    correctIndex: 1,
    explanation:
      'Residual connections (skip connections) add a block\'s input to its output: y = F(x) + x. This solves the degradation problem: as the depth of plain networks increases, quality first improves and then declines due to vanishing gradients. Skip connections allow gradients to "flow" directly through the network, bypassing layers. The network learns to model the residual F(x) = H(x) - x, which is easier than directly modeling H(x). ResNet (2015) made it possible to train networks with 100+ layers. The idea of residual connections is now used everywhere, including in transformers.',
  },
  {
    id: 'ai-neural-networks-005',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'middle',
    type: 'quiz',
    question: 'What does Dropout do during the training of a neural network?',
    options: [
      'Removes the layers that contribute the least to the result',
      'Randomly "switches off" neurons with a given probability at each training step, preventing overfitting',
      'Reduces the learning rate when a plateau is reached',
      'Automatically stops training when the validation error starts rising',
    ],
    correctIndex: 1,
    explanation:
      'Dropout (Srivastava, 2014) is a regularization technique: at each training step, each neuron is "switched off" with probability p (usually 0.1–0.5). This forces the network not to rely on specific neurons and creates an implicit ensemble of subnetworks. At inference time dropout is disabled, and the outputs are scaled (or inverted dropout is used during training). The intuition: it is as if a random subnetwork is trained each time, and at inference an averaging over them is used.',
  },
  {
    id: 'ai-neural-networks-006',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'middle',
    type: 'open',
    question: 'Compare RNN, LSTM, and GRU. What problems does each architecture solve, and why have transformers largely replaced them?',
    sampleAnswer:
      'An RNN (Recurrent Neural Network) processes sequences by passing a hidden state between steps. Problem: vanishing/exploding gradients over long sequences — the network "forgets" early tokens. LSTM (Long Short-Term Memory) solves this with a gating mechanism: forget gate, input gate, output gate, and a cell state that lets information "flow" through long sequences. GRU (Gated Recurrent Unit) is a simplified version of LSTM with two gates (reset, update), fewer parameters, and comparable quality. Transformers replaced them because: (1) attention allows direct access to any token without step-by-step passing, (2) parallelization — RNN/LSTM process tokens sequentially, while transformers do so in parallel, (3) they scale better with the amount of data and compute.',
    explanation:
      'The evolution: RNN → LSTM/GRU → Transformer. Each step solved a key problem of its predecessor. RNNs could not handle long-range dependencies; LSTM/GRU partially solved this but remained sequential. Transformers (2017) solved both problems via self-attention. However, RNNs are making a comeback in new forms (Mamba, RWKV) for efficient inference.',
  },
  {
    id: 'ai-neural-networks-007',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'senior',
    type: 'open',
    question: 'Explain the vanishing/exploding gradients problem. What architectural solutions and initialization techniques were developed to address it?',
    sampleAnswer:
      'During backpropagation through a deep network, gradients are multiplied at each layer. If the factors are < 1, gradients vanish; if > 1, they explode. Vanishing: the lower layers do not learn. Exploding: NaN values in the weights, unstable training. Solutions: (1) Architectural: residual connections (ResNet), highway networks, gating mechanisms (LSTM). (2) Initialization: Xavier/Glorot (for sigmoid/tanh), He/Kaiming (for ReLU) — they choose the variance of the initial weights so that the signal neither vanishes nor explodes. (3) Normalization: Batch Normalization, Layer Normalization — they stabilize the distribution of activations between layers. (4) Activation functions: ReLU and its variants (LeakyReLU, ELU) instead of sigmoid, whose gradient saturates. (5) Gradient clipping — clipping gradients by norm to prevent explosion.',
    explanation:
      'Vanishing/exploding gradients is one of the reasons why deep learning became practical only after the 2010s. The combination of ReLU + He initialization + BatchNorm + residual connections made it possible to train networks with hundreds of layers. In transformers, LayerNorm + residual connections is the standard recipe for stability.',
  },
  {
    id: 'ai-neural-networks-008',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'senior',
    type: 'open',
    question: 'Compare the SGD, Adam, and AdamW optimizers. When should you choose each of them?',
    sampleAnswer:
      'SGD (Stochastic Gradient Descent): updates weights proportionally to the gradient with a fixed learning rate. With momentum it adds "inertia", accelerating convergence. Pros: simple, often generalizes better. Cons: sensitive to the learning rate, converges more slowly. Adam (Adaptive Moment Estimation): an adaptive learning rate per parameter, using exponentially moving averages of the gradient (1st moment) and the squared gradient (2nd moment). Pros: fast convergence, less sensitive to the initial LR. Cons: may generalize worse than SGD. AdamW: fixes Adam\'s problem with weight decay — it decouples L2 regularization from the adaptive learning rates (decoupled weight decay). It is the standard for training transformers. Recommendations: SGD + momentum — for CNNs and tasks with well-studied hyperparameters. AdamW — for transformers and LLMs. Adam — for fast prototyping.',
    explanation:
      'The choice of optimizer affects both the convergence speed and the quality of the final model. AdamW became the de facto standard for training transformers after the paper "Decoupled Weight Decay Regularization" (Loshchilov & Hutter, 2019). For fine-tuning LLMs, 8-bit Adam, Adafactor (memory savings), and LAMB/LARS (for large batch sizes) are also used.',
  },
  {
    id: 'ai-neural-networks-009',
    block: 'ai',
    topic: 'neural-networks',
    topicLabel: 'Neural Networks',
    difficulty: 'senior',
    type: 'quiz',
    question: 'What is Batch Normalization, and why is Layer Normalization preferable for transformers?',
    options: [
      'BatchNorm normalizes over the mini-batch, while LayerNorm normalizes over the features of a single example; LayerNorm does not depend on the batch size and is more stable with variable-length sequences',
      'BatchNorm only works during training, while LayerNorm only works at inference time',
      'LayerNorm is faster to compute due to a smaller number of parameters',
      'BatchNorm and LayerNorm are identical; the difference is only in the implementation',
    ],
    correctIndex: 0,
    explanation:
      'BatchNorm: normalizes activations over the mini-batch (along the batch axis), computing the mean and variance across all examples in the batch for each feature. Problems: it depends on the batch size, uses running statistics at inference time, and is unstable with variable-length sequences. LayerNorm: normalizes over all features of a single example, independent of the other examples in the batch. It is ideal for transformers: it works identically during training and inference, and is stable for any batch size and sequence length.',
  },
];
