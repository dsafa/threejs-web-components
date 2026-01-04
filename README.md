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

<details>
  <summary>Notes</summary>

The hierarchy of some of the elements was inspired by [react-three-fiber](https://r3f.docs.pmnd.rs/getting-started/introduction). Things like the `<mesh><geometry/><material/></mesh>` nesting.

For the main canvas, since a html canvas can't have children, the canvas element needs to be a leaf node in the tree. Thats why there is an output node where the canvas element can be slotted instead of having the canvas be the root of the hierarchy.

</details>

### Instancing

### GLB

A `twc-glb` element that can be used to load a glb through the `src` attribute. The element converts the loaded glb objects into the dom elements. This means that the resulting glb element can be [styled](#styling)

## Styling

Elements re-use some of the existing css properties to allow declarative styling

### Properties

- `background-color`: This applies to the `twc-scene` element which maps to the the color property the scene
- `color`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material color property
- `opacity`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material opacity property
- `visibility`: This applies to the `twc-basic-material` element which maps to the threejs mesh basic material visible property where visible = false if visibility == none else true
- `transform`: This applies to any of the object3d based elements and maps to the threejs object matrix property. This will apply to the default transform of the object.

<details>
  <summary>Notes</summary>

Since the default css color is black, a lot of meshes by default will show up as black. And since the background color is also black, the scene will be black too and you can't see anything. Some solutions:

- Use a custom css property / different property instead of color
- Have the custom elements add a default style but then they all need a shadow dom
- Detect the default css style somehow and apply the original material color

</details>

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
