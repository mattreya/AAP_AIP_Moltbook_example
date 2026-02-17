import { AapClient } from '@mnemom/agent-alignment-protocol';
import fs from 'fs/promises';
import path from 'path';

// --- Configuration ---
const ALIGNMENT_CARD_PATH = path.resolve(process.cwd(), 'config', 'alignment-card.json');
const MOLTBOOK_API_ENDPOINT = process.env.MOLTBOOK_API_ENDPOINT || 'http://localhost:3000/api/moltbook'; // Placeholder

async function loadAlignmentCard() {
  try {
    const cardContent = await fs.readFile(ALIGNMENT_CARD_PATH, 'utf-8');
    return JSON.parse(cardContent);
  } catch (error) {
    console.error(`Error loading alignment card from ${ALIGNMENT_CARD_PATH}:`, error);
    process.exit(1);
  }
}

async function interactWithMoltbook(action, data) {
  console.log(`Attempting to ${action} with Moltbook...`);
  // In a real scenario, this would be a call to the Moltbook API.
  // For demonstration, we'll simulate a successful API call.
  try {
    // Example: Using fetch to a hypothetical Moltbook API
    const response = await fetch(`${MOLTBOOK_API_ENDPOINT}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authentication headers here
      },
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

  await aapClient.traceAction({
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

  await aapClient.traceAction({
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

  console.log('Moltbook Bot finished demonstration.');
}

main().catch(console.error);