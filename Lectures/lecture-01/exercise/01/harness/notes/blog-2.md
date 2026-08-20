
## Reading Included :

- [ Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/)
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)


# Harness engineering: leveraging Codex in an agent-first world

How far can you go into a project without writing a single line of code manually and only relaying on AI Agents. That's what codex engineers where testing when they ran this experiment.

The goal was to make a functional final product with a million lines of code but 0 written by Human Hands.

Spoiler Alert : They Did.

The published product had internal users, Alpha testers, and all the bits you wished for, The project got shipped, it broke, got fixed again and of-course shipped again.
But was a human doing all this manually, Hell NO.

During this project the primary job of engineers wasn't making a finished product, it was :
- Designing environments for he Agent.
- Specify intent precisely for edits.
- and build feedback loops.

The whole project was based on *Maximising human time and attention efficiency.*

---
### The Project

In August 2025, the first commit was made to the GitHub repository, and by the end of the 5th month there where over 1500 Pull Requests made on the repository. 0 manually written code existed in those 1500 PRs.

>  **Redefining the role of Engineers** 

The early progress was really slow, the Agent lacked proper Environment and Development tools. Engineers primary job became not writing code, rather enabling the Agent to be able to on their behalf.

The first change by the team was a *depth first approach* - Breaking larger tasks into smaller cases. The Agent performs each task and complies them together to implement a feature to the main branch.

> **Human Interaction**

The team of engineers were not allowed to interact with the code directly, the only way of contributing to the code was through the agent.
So, Naturally making progress meant tuning the Agent. It was the only way to move forward.

Another important term focused on to make progress was - **[Ralph Loops .](https://youtu.be/CV97l0GkPHo?si=dSZ_ax4wa7717WJA)** 
It suggests that *Everything is a Loop.*

Give a task -> let it work -> Check result -> Rinse and Repeat.

> **Context Management**

Another big challenge by the team was managing the context window. The agent can only remember so much and context is a scarce resource.

The more guidance the agent is provided, More the context window it takes up. Too much guidance = No Guidance. If the agent starts prioritising everything, then nothing is a priority anymore.

To tackle this issue the engineers had one word - *Map.*
Give the agent a Map, not a 1000+ page agent.md file, it's supposed to be a structure not an encyclopedia. The new Agent.md file was barely a 100 lines but the structure of repository was sommthing like :

```
Agent.md
Rules.md
Architecture.md

Design.md/
	|-> Index.md
	|-> Layout.md

docs/
	|-> Index.md
	|-> Core.md
```

> **Agents Perspective**

Anything not visible to the agent simply did not exist, So more context = better understanding. Even a discussion amongst the team was documented and pushed to the agent as it simply didn't exist before the documentation.

By this point the Agent Produces :
- Code and tests
- Config files and release tooling
- Developer tools and installations
- Documentation and design history
- Evaluates Harness against the repositories current state.
- Comments and responses.

The engineering team was kept in the loop but by this point PR's were short lived and the agent throughput far exceeded human attention.

The resulting agent was now capable enough, A single prompt now executed :
- Validate current state
- Record a video of the Bug.
- Implement Fix.
- Validate the fix by testing
- Record a video of fix
- Open a Pull request
- Merge and commit to main branch.