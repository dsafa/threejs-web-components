# threejs-web-components

experimenting with webcomponents and threejs

# Features

## Scene

### Instancing

### GLB

## Styling

Elements re-use some of the existing css properties to allow declarative styling

### Properties

- `background-color`: This applies to the `twc-scene` element which maps to the the color property the scene
- `color`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material color property
- `opacity`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material opacity property
- `visibility`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material visible property where visible = false if visibility == none else true
- `transform`: This applies to any of the object3d based elements and maps to the threejs object matrix property

### Animations

Because these values are controlled by css, animations can be used the change those values

## Commands

Some elements support commands using the [Invoke Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)

`twc-camera-controls` supports these commands:

- `--fit` To fit an object or the scene into view
- `--rotate` To rotate the current camera orbit

## Interactivity

### Custom element states

Supports some basic interactivity with the objects in the scene. Combined with css styling, we can style meshes based on some states.

Supported states:

- hover: `:state(hovered)`
- selected: `:state(selected)`

## Object click commands

Objects support the `commandfor` and `command` attributes like html button elements and will call the commands on their target when clicked

## Rendering html element overlays

Render html elements in the scene with `twc-html` component. This uses the [threejs css2d renderer](https://threejs.org/docs/#CSS2DRenderer)
