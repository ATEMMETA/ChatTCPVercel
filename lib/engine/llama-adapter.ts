// lib/engine/llama-adapter.ts
export async function infer(model: string, prompt: string, lora?: string): Promise<string> {
  return `Mock ${model} output: ${prompt} (LoRA: ${lora || 'none'})`;
}
