# Static multilingual website generator

## Installation

```bash
npm i -g static-website
```

## New project

To create a new project run the next command:

```bash
swc new <dir>
```

It will ask you some questions.

## Serve

It is very convenient to develop and see what happens in real time:

```bash
swc serve
```

The command will be automatically rebuilding a project when there are some changes and serve the result using HTTP.

## Build

To build static website run the next command inside the project:

```bash
swc build
```

Directory `dist` will be created with static files inside.
