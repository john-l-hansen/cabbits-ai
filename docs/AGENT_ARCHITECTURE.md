# Agent Architecture

## Intended Pattern
User → Companion Agent → Orchestrator → Specialist Agents → Tools / Memory

## Agent Types
- Companion Agent: user-facing relationship
- Orchestrator Agent: routes intent
- Teacher Agents: subject-specific help
- Evaluator Agent: evaluates learning output
- Safety Agent: checks age-appropriate behavior
- Group Agent: manages collaborative learning

## MVP Rule
The first scaffold only prepares the product surface. It does not implement real agent orchestration.

## Future Reminders
- **Item Generation Tool**: Implement when transition to active LLM loop begins (see [011 — Agent-Created Objects](file:///Users/johnhansen/Desktop/1-aether-creative-studio/cabbits/specs/011-agent-created-objects.md)).
