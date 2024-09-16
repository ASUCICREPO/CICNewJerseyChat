// src/utilities/calculateCost.js
import { MODEL_COSTS } from './constants';

/**
 * Calculate the cost based on total tokens and the model ID.
 *
 * @param {number} inputTokens - The number of input tokens used.
 * @param {number} outputTokens - The number of output tokens used.
 * @param {string} modelId - The ID of the model.
 * @returns {number} - The total cost calculated.
 */
export function calculateCost(inputTokens, outputTokens, modelId) {
  // Find the model in the MODEL_COSTS array
  const model = MODEL_COSTS.find((model) => model.modelId === modelId);

  if (!model) {
    console.error(`Model with ID ${modelId} not found.`);
    return "N/A";
  }

  // Calculate the cost
  const inputCost = (inputTokens / 1000) * model.costPer1000InputTokens;
  const outputCost = (outputTokens / 1000) * model.costPer1000OutputTokens;

  // Return the total cost
  return parseFloat((inputCost + outputCost).toFixed(5));
}
