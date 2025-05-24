# ChatCodeAngular with Claude Sonnet 4
In this example we used GitHub Copilot "agent" mode with Claude Sonnet 4 to: 
- generate an app that searches Wikipedia articles and displays results in a list format using Angular
- generare a diagram of the architecture of the app

## Prompts used
The prompts used in this example are available in the [prompts.md](prompts.md) file.

## Results
### App
The app works as expeted at the first attempt, with no need for further iterations.
### Architecture Diagram
The architecture diagram is available in the [ARCHITECTURE.md](ARCHITECTURE.md) file. It shows the component dependencies and data flow within the application and seems to be correct (to be honest I did not check it in detail, but it looks good).

## Run the app
To run the app, launch the following command in the terminal:
```bash
ng serve
```
Then open your browser and navigate to `http://localhost:4200/`.

## Show the architecture diagram in VSCode
To view the architecture diagram
- Install the Mermaid Preview extension in VS Code
- open the [ARCHITECTURE.md](ARCHITECTURE.md) using the "open preview" option