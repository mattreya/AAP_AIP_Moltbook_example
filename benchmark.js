
import { verifyTrace } from '@mnemom/agent-alignment-protocol';
import { AapClient } from './bot.js';

// Re-implementation of the original logic for comparison
class AapClientOriginal {
  constructor(card) {
    this.card = card;
    this.internalCard = {
      ...card, card_id: card.agent_id,
      values: { declared: card.values?.upholds || [] },
      autonomy_envelope: {
        ...card.autonomy_envelope,
        bounded_actions: card.autonomy_envelope?.permissible_actions || [],
        forbidden_actions: card.autonomy_envelope?.forbidden_actions || []
      }
    };
  }

  async traceAction(opts) {
    const trace = {
      trace_id: `tr-${Math.random().toString(36).slice(2, 11)}`,
      card_id: this.card.agent_id,
      timestamp: new Date().toISOString(),
      action: { type: opts.action_type, name: opts.action_type, category: 'bounded', parameters: opts.input_data },
      decision: { selected: opts.action_type, alternatives_considered: [], selection_reasoning: opts.description, values_applied: this.card.values?.upholds || [] }
    };

    const verification = verifyTrace(trace, this.internalCard);
    if (!verification.verified) {
      return;
    }

    try {
      const result = await opts.action_function();
      return result;
    } catch (error) {
      throw error;
    }
  }
}

const card = {
  agent_id: "moltbook-bot-001",
  name: "Moltbook Interaction Bot",
  values: { upholds: ["transparency", "accuracy", "respectful-communication"] },
  autonomy_envelope: { permissible_actions: ["post-message-to-moltbook"] }
};

const iterations = 100000;

async function runBenchmark() {
  const clientOrig = new AapClientOriginal(card);
  const clientOpt = new AapClient(card);

  console.log(`Running benchmark with ${iterations} iterations...`);

  // Warm up
  for (let i = 0; i < 1000; i++) {
    await clientOrig.traceAction({
      action_type: 'post-message-to-moltbook',
      input_data: { user: 'test', content: 'test' },
      description: 'warmup',
      action_function: async () => ({ success: true })
    });
    await clientOpt.traceAction({
      action_type: 'post-message-to-moltbook',
      input_data: { user: 'test', content: 'test' },
      description: 'warmup',
      action_function: async () => ({ success: true })
    });
  }

  const startOrig = performance.now();
  for (let i = 0; i < iterations; i++) {
    await clientOrig.traceAction({
      action_type: 'post-message-to-moltbook',
      input_data: { user: 'test', content: 'test' },
      description: 'test action',
      action_function: async () => ({ success: true })
    });
  }
  const endOrig = performance.now();

  const startOpt = performance.now();
  for (let i = 0; i < iterations; i++) {
    await clientOpt.traceAction({
      action_type: 'post-message-to-moltbook',
      input_data: { user: 'test', content: 'test' },
      description: 'test action',
      action_function: async () => ({ success: true })
    });
  }
  const endOpt = performance.now();

  const originalTime = endOrig - startOrig;
  const optimizedTime = endOpt - startOpt;
  const diff = originalTime - optimizedTime;
  const percentage = (diff / originalTime) * 100;

  console.log(`Original took: ${originalTime.toFixed(2)}ms`);
  console.log(`Optimized took: ${optimizedTime.toFixed(2)}ms`);
  console.log(`Improvement: ${percentage.toFixed(2)}%`);

  if (percentage > 0) {
    console.log(`⚡ Bolt: Speedup confirmed! Saved ${(diff / iterations * 1000).toFixed(4)} microseconds per call.`);
  } else {
    console.log(`Bolt: No significant speedup detected in this environment.`);
  }
}

runBenchmark();
