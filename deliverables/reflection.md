# Reflection

## 1 — What Worked Well
When working with AI agents, the technique of planning first before moving on to the implementation phase proved essential, as it transfers control of development to the development team, who is then responsible for coordinating what will be developed with the help of artificial intelligence.

The ability to create fully customizable AI agents and use them to orchestrate workflows, from the architecture phase to development and validation, was quite impressive and worked very well!

## 2 — Challenges & Solutions
During the development of my application, I noticed a certain persistence in Claude's tendency to use the user-level defined agents, instead of prioritizing the local agents I created for the project. Several times I had to explicitly state in the prompt that the local agents should be used, instead of the agents defined at user level.

It also became clear that human supervision of the work done by the AI ​​is fundamental: even with a well-defined workflow that included code review, I encountered trivial problems while doing my own review.

## 3 — Best Practices Discovered
Two points particularly caught my attention throughout the course: using AI to document all architectural decisions in the project, and feeding back into the CLAUDE.md file so that it can make decisions based on context. These points not only save tokens and facilitate AI's work, but also greatly help the development team understand the project.

## 4 — Client Application Ideas
Since AI-assisted software development is relatively new, I see that legacy projects in companies are often not adapted to allow the best of artificial intelligence to be extracted within their scope. For the potential of AI to be utilized within the reality of these clients, I believe it is necessary to review and document the current structure of each project in an intelligible way so that AI-assisted development is viable.

On the other hand, for clients starting a project from scratch, I believe that an AI-first approach is currently crucial. All stages, ADRs, and features should be documented so that the development team and AI agents have easy access to the project context, facilitating its maintenance and scalability in a world where artificial intelligence will be increasingly present.