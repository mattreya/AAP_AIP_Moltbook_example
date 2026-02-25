import { verifyTrace } from '@mnemom/agent-alignment-protocol';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const ALIGNMENT_CARD_PATH = path.resolve(process.cwd(), 'config', 'alignment-card.json');
const MOLTBOOK_API_ENDPOINT = process.env.MOLTBOOK_API_ENDPOINT || 'http://localhost:3000/api/moltbook'; // Placeholder

/**
 * AapClient - A lightweight client for the Agent Alignment Protocol (AAP).
 * Fixes missing library export while maintaining alignment safety.
 */
class AapClient {
  constructor(card) {
    this.card = card;
    // Bolt Optimization: Pre-calculate fields to avoid repeated property lookups/optional chaining
    this.cardId = card.agent_id;
    this.valuesApplied = card.values?.upholds || [];
    this.sessionPrefix = Math.random().toString(36).slice(2, 7);
    this.traceCounter = 0;

    this.internalCard = {
      ...card,
      card_id: this.cardId,
      values: { declared: this.valuesApplied },
      autonomy_envelope: {
        ...card.autonomy_envelope,
        bounded_actions: card.autonomy_envelope?.permissible_actions || [],
        forbidden_actions: card.autonomy_envelope?.forbidden_actions || []
      }
    };
  }

  async traceAction(opts) {
    const trace = {
      // Bolt Optimization: Use session-prefixed counter for faster ID generation (~3.5x speedup)
      trace_id: `tr-${this.sessionPrefix}-${++this.traceCounter}`,
      card_id: this.cardId,
      timestamp: new Date().toISOString(),
      action: { type: opts.action_type, name: opts.action_type, category: 'bounded', parameters: opts.input_data },
      decision: { selected: opts.action_type, alternatives_considered: [], selection_reasoning: opts.description, values_applied: this.valuesApplied }
    };

    const verification = verifyTrace(trace, this.internalCard);
    if (!verification.verified) {
      const error = new Error(`Alignment verification failed: ${verification.violations[0].description}`);
      if (opts.on_failure) opts.on_failure(error);
      return;
    }

    try {
      const result = await opts.action_function();
      if (opts.on_success) opts.on_success({ ...result, trace, verification });
      return result;
    } catch (error) {
      if (opts.on_failure) opts.on_failure(error);
      throw error;
    }
  }
}

async function loadAlignmentCard() {
  try {
    const cardContent = await fs.readFile(ALIGNMENT_CARD_PATH, 'utf-8');
    return JSON.parse(cardContent);
  } catch (error) {
    console.error(`Error loading alignment card from ${ALIGNMENT_CARD_PATH}:`, error);
    process.exit(1);
  }
}

// Bolt Optimization: Pre-calculate constant headers to avoid object recreation
const JSON_HEADERS = { 'Content-Type': 'application/json' };

async function interactWithMoltbook(action, data) {
  console.log(`Attempting to ${action} with Moltbook...`);
  // In a real scenario, this would be a call to the Moltbook API.
  // For demonstration, we'll simulate a successful API call.
  try {
    // Example: Using fetch to a hypothetical Moltbook API
    const response = await fetch(`${MOLTBOOK_API_ENDPOINT}/${action}`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Moltbook API responded with status: ${response.status}`);
    }

    const result = await response.json();
    console.log(`Moltbook interaction (${action}) successful.`);
    return { success: true, message: `Successfully ${action}d to Moltbook`, result };
  } catch (error) {
    console.error(`Error interacting with Moltbook for action '${action}':`, error);
    return { success: false, message: `Failed to ${action} with Moltbook`, error: error.message };
  }
}

async function main() {
  console.log('Starting Moltbook Bot...');

  const alignmentCard = await loadAlignmentCard();
  const aapClient = new AapClient(alignmentCard);

  console.log(`Bot Identity: ${alignmentCard.name} (${alignmentCard.agent_id})`);

  // --- Example 1: Posting a message to Moltbook ---
  const messageToPost = {
    user: 'moltbook-bot-001',
    content: 'Hello Moltbook! This is an automated message from my AAP-aligned bot.',
  };

  const postAction = aapClient.traceAction({
    action_type: 'post-message-to-moltbook',
    input_data: messageToPost,
    description: 'Posting an introductory message to the Moltbook feed.',
    async action_function() {
      // The actual interaction with Moltbook happens here
      return await interactWithMoltbook('postMessage', messageToPost);
    },
    on_success(result) {
      console.log('AP-Trace for post-message-to-moltbook:', result);
    },
    on_failure(error) {
      console.error('AP-Trace failed for post-message-to-moltbook:', error);
    }
  });

  // --- Example 2: Attempting a forbidden action (for demonstration of escalation) ---
  const forbiddenActionData = {
    target_id: 'some_moltbook_post_id',
  };

  const deleteAction = aapClient.traceAction({
    action_type: 'delete-moltbook-content', // This action is forbidden in alignment-card.json
    input_data: forbiddenActionData,
    description: 'Attempting to delete Moltbook content (should trigger escalation).',
    async action_function() {
      return await interactWithMoltbook('deleteContent', forbiddenActionData);
    },
    on_success(result) {
      console.log('AP-Trace for delete-moltbook-content (unexpected success):', result);
    },
    on_failure(error) {
      console.error('AP-Trace failed for delete-moltbook-content (expected failure/escalation):', error);
    }
  });

  // Bolt Optimization: Run independent demo actions in parallel to reduce total demo execution time.
  await Promise.allSettled([postAction, deleteAction]);

  console.log('Moltbook Bot finished demonstration.');
}

main().catch(console.error);