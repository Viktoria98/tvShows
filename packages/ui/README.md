# FF UI package

Frontend package containing ui elements for company projects

## Elements
> React elements and components

All React elements should be placed in separate folders. All related files should be divided in groups.
#### Example
```
UI
|-- elements
    |-- graph
        |-- graph.css
        |-- components
            |-- graphComponentOne.js
            |-- graphComponentTwo
        |-- dispatchers
            |-- graphDispatcher.js
        |-- stores
            |-- graphStore.js
```
## Stylesheets
> Global stylesheets

All global and non-related to elements stylesheets.

## Assets
> All required assets

Fonts, images, video, audio files etc. should be placed here.

### Building package
All files from this package should be included to `package.js` in order to be loaded by Meteor.