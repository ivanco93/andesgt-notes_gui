# AngesGT notes GUI project

<!-- TABLE OF HEADER -->
[![NodeJs][skill-node-shield]][skill-node-url]
[![Angular][skill-angular-shield]][skill-angular-url]

<!-- ABOUT THE PROJECT -->

## About The Project

AndesGT notes GUI is an Angular application for calling of notes API REST 

### Project Organization

This section contains the archetype how the project is built and the content of each of the application directories.

    ├── .github
    │   ├── workflows                         
    │   │       └── workflow.yml              <- github actions pipeline for continuous integration
    ├── src
    │   ├── app                               <- main project owner of settings and route register files
    │   │   ├── environments                  <- environments configuration file
    │   │   ├── guard                         <- guards used for authentication validations in routes access
    │   │   ├── login                         <- component used for authentication view
    │   │   ├── model                         <- models used for application
    │   │   ├── notes                         <- component used for notes CRUD view
    │   │   └── services                      <- services used for http requests
    ├── Dockerfile                            <- Docker file used for images creation
    ├── .gitignore                            <- Ignored files for Github
    └── README.md                             

<!-- GETTING STARTED -->

## Getting Started

Instructions on how to configure your project locally. To get a working local copy, follow these example steps.

### Prerequisites

* [Node 20](https://www.node.org/downloads/)
* [Docker](https://docs.docker.com/engine/install/) `For docker images building and testing`

## Installation


### 💻 Locally

```shell
npm install
```


Now, you can start the server(defaul port:4200) with the next command
```shell
npm start
```
### 🧪 Quality assurance

Run unit tests
```shell
npm test
```

# CI/CD

Project uses Github Actions worflows for CI/CD tasks

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://shields.io/ -->

[skill-node-shield]: https://img.shields.io/badge/Node%20JS-20.18-blue

[skill-node-url]: https://www.node.org/downloads/

[skill-angular-shield]: https://img.shields.io/badge/Angular-18-blue

[skill-angular-url]: https://angular.dev/