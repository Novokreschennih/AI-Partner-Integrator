
export interface SimpleButton {
  text: string;
  url?: string;
  callback_data?: string;
}

export interface SimpleMessage {
  text: string;
  buttons?: SimpleButton[][];
}

export interface ScriptBlock {
  id: string;
  trigger: string;
  messages: SimpleMessage[];
}

const generateUUID = () => crypto.randomUUID();

/**
 * Converts an array of structured script blocks into a robust n8n workflow JSON string.
 * This version uses a trigger-based approach, making it independent of the order of blocks.
 * @param scriptBlocks An array of ScriptBlock objects from the AI.
 * @returns A stringified n8n workflow JSON.
 */
export function convertToN8nJson(scriptBlocks: ScriptBlock[]): string {
    const nodes: any[] = [];
    const connections: any = {};
    const credentials = {
        telegramApi: {
            id: 'YOUR_TELEGRAM_CREDENTIALS_ID',
            name: 'Telegram Credentials',
        },
    };

    // 1. Telegram Trigger Node
    const triggerNodeId = generateUUID();
    nodes.push({
        parameters: { events: 'message,callback_query' },
        id: triggerNodeId,
        name: 'Telegram Trigger',
        type: 'n8n-nodes-base.telegramTrigger',
        typeVersion: 1,
        position: [250, 300],
        webhookId: generateUUID(),
        credentials,
    });

    // 2. Collect all triggers and create Switch Node rules
    const switchNodeRules = scriptBlocks.map(block => ({
        operation: block.trigger === '/start' ? 'startsWith' : 'equals',
        value1: block.trigger,
    }));
    // Ensure /start is always the first rule if it exists
    switchNodeRules.sort((a, b) => {
        if (a.value1 === '/start') return -1;
        if (b.value1 === '/start') return 1;
        return 0;
    });

    const switchNodeId = generateUUID();
    const switchNode = {
        parameters: {
            fieldToMatch: '={{ $json.message?.text ?? $json.callback_query?.data }}',
            rules: { values: switchNodeRules },
            options: { alwaysOutputData: true },
        },
        id: switchNodeId,
        name: 'Router',
        type: 'n8n-nodes-base.switch',
        typeVersion: 1,
        position: [500, 300],
    };
    nodes.push(switchNode);
    connections[triggerNodeId] = { main: [[{ node: switchNodeId, input: 'main' }]] };
    
    // Initialize outputs for the switch node
    const numOutputs = switchNode.parameters.rules.values.length;
    connections[switchNodeId] = { main: Array.from({ length: numOutputs + 1 }, () => []) }; // +1 for default output

    // 3. Create Message Chains for each Script Block
    scriptBlocks.forEach((block, blockIndex) => {
        const ruleIndex = switchNodeRules.findIndex(rule => rule.value1 === block.trigger);
        if (ruleIndex === -1) {
            console.warn(`No rule found for trigger: ${block.trigger}. Skipping block.`);
            return;
        }

        let lastNodeInBlockId: string | null = null;
        
        block.messages.forEach((message, messageIndex) => {
            const isFirstMessageInBlock = messageIndex === 0;
            const nodeId = generateUUID();
            // Position nodes based on their block and message index for a clean layout
            const nodePosition = [750 + (blockIndex * 350), 300 + (messageIndex * 200)];

            const telegramNode = {
                parameters: {
                    chatId: '={{ $json.message?.chat.id ?? $json.callback_query.message.chat.id }}',
                    text: message.text,
                    additionalFields: message.buttons && message.buttons.length > 0
                        ? { reply_markup: { inline_keyboard: message.buttons } }
                        : {},
                },
                id: nodeId,
                name: `Msg: ${block.id} (${messageIndex + 1})`,
                type: 'n8n-nodes-base.telegram',
                typeVersion: 1.2,
                position: nodePosition,
                credentials,
            };
            nodes.push(telegramNode);

            if (isFirstMessageInBlock) {
                // Connect the switch output for this trigger to the first message of the block
                connections[switchNodeId].main[ruleIndex].push({ node: nodeId, input: 'main' });
            } else {
                // This message follows another one in the same block. Insert a Wait node.
                const waitNodeId = generateUUID();
                const waitNodePosition = [nodePosition[0] - 175, nodePosition[1]];
                
                nodes.push({
                    parameters: { amount: 2, unit: 'seconds' },
                    id: waitNodeId,
                    name: `Wait for ${block.id}`,
                    type: 'n8n-nodes-base.wait',
                    typeVersion: 1.1,
                    position: waitNodePosition,
                });
                
                connections[lastNodeInBlockId!] = { main: [[{ node: waitNodeId, input: 'main' }]] };
                connections[waitNodeId] = { main: [[{ node: nodeId, input: 'main' }]] };
            }

            lastNodeInBlockId = nodeId;
        });
    });

    const n8nWorkflow = { nodes, connections };
    return JSON.stringify(n8nWorkflow, null, 2);
}
