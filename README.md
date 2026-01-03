# threejs-web-components

experimenting with webcomponents and threejs

# Features

## Scene

### Instancing

### GLB

## Styling

### Properties

### Animations

## Commands

## Interactivity

### Custom element states

Supports some basic interactivity with the objects in the scene. Combined with css styling, we can style meshes based on some states.

Supported states:

- hover: `:state(hovered)`
- selected: `:state(selected)`

## Object click commands

Objects support the `commandfor` and `command` attributes like html button elements and will be invoked when clicked

## Rendering html element overlays

Render html elements in the scene with `twc-html` component. This uses the [threejs css2d renderer](https://threejs.org/docs/#CSS2DRenderer)
