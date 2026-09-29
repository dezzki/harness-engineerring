## There are my notes or understanding of the following lecture - Further reading will be posting is different blog related to each.


# What a Harness actually is -

#### A Harness is not just a prompt it is much more that. To define it in one line :

- **Harness is everything outside the model weight.**

## Okay lets explain this with an ANALOGY :

Say you just got hired by a company as a FrontEnd Developer, You are asked to add a feature on the website and complete it by EOD.

You open the code and there are 0 comments, No README.md, No directions. Even if you are one of the most brilliant Developers - You would be wasting a whole lot of time finding and navigating the Code-Base. But you can at least as you co-workers.

This situation is even worse for an Agent. The Agent without any direction needs to find everything in the directory manually, It would have to navigate the whole Code-base line by line searching and understanding what to do.

This is why **All necessary context should live within the Repository**.

"The repository is a Spec" - Anything that is not visible to the Agent simply does not exist. 
Say you and your Co-founder discussed about a Feature in depth in a meeting and had a vision, Unless that context is fed to the agent - The meeting never took place from the Agent's perspective, It would have no idea about how you want the implementation to function.

Everything in the engineering infrastructure outside the model determines how much the Agents capabilities you unlock :  

- Claude Uses claude.md
- Cursor uses .cursorrules
- Codex uses git trees method - Much faster than an Agent.md file.

- In contrast - AutoGPT lacks the ability of Harness.
	- You would hear people say that AutoGPT doesn't work or is trash. but the real issue is it's Harness Problem.


## Core-Concepts

### 1) What is Harness?

- Everything outside the model weight is the Harness.
- The primary task of a Harness is not to Code, But to Designing environments - Expressing Intent Explicitly - Building feedback loops.

### 2) The Repo is a single source of truth

- Anything beyond the Agent's scope simply does not exist.
- The repository is treated as a **"System on Records"** - All necessary context must live there.

### 3) Give a map, Not a manual :

- Agent.md should be a directory page mapping all important docs, Not an encyclopedia with everything.
- Around a 100 lines is good.
- If all the context does not fit, Split the Agent.md file and create ```Docs/```, the agent can read them on call.

### 4) Constrain, Don't Micromanage

- Harness must have executable rules.
- separate the agents that write the Code and the ones who check/review it - models have been recorded openly praising their self written broken codes.

### 5) Remove one at a time to observe

- **To check the Value of each harness component :** 

	- Remove each element one by one and see which change makes the biggest impact.
	- The harness that grows - dynamically changes with tasks and once moot files become critical to the Agent.