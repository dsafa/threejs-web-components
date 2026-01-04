# threejs-web-components

experimenting with webcomponents and threejs

# Features

## Scene

Declaratively build the scene with basic object3d elements like object3d and meshes. Also includes elements for materials and geometries for meshes.

```html
<twc-scene>
  <twc-mesh>
    <twc-box-geometry width="5" height="5" depth="5"></twc-box-geometry>
    <twc-basic-material></twc-basic-material>
  </twc-mesh>
  <twc-camera-controls>
    <twc-perspective-camera></twc-perspective-camera>
  </twc-camera-controls>
</twc-scene>
```

Camera controls also have an element which can be used for additional features (read more below)

Then the `twc-output` element can be used to output to a `canvas` element

```html
<twc-renderer>
  <twc-output>
    <canvas width="500px" height="300px"></canvas>
  </twc-output>
</twc-renderer>
```

### Instancing

### GLB

## Styling

Elements re-use some of the existing css properties to allow declarative styling

### Properties

- `background-color`: This applies to the `twc-scene` element which maps to the the color property the scene
- `color`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material color property
- `opacity`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material opacity property
- `visibility`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material visible property where visible = false if visibility == none else true
- `transform`: This applies to any of the object3d based elements and maps to the threejs object matrix property. This will apply to the default transform of the object.

### Animations

Because these values are controlled by css, animations can be used the change those values

> [!TIP]
> Didn't work or try this, but could probably animate the camera this way if interactive camera controls aren't used

## Commands

Some elements support commands using the [Invoke Commands API](https://developer.mozilla.org/en-US/docs/Web/API/Invoker_Commands_API)

`twc-camera-controls` supports these commands:

- `--fit` To fit an object or the scene into view
- `--rotate` To rotate the current camera orbit

Other elements also support invoking commands:

- Objects in the scene: see [Object click commands](#object-click-commands)
- `twc-glb`: invokes the command on load

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
