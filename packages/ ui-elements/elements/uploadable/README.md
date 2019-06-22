# Upload component

upload files to backblaze B2 and return download link

Using example


### UploadableBase
```
const call = ({name, size, type, data, error, success}) => {
    Meteor.callPromise('FilesAction.upload', {name, size, type, data}).then(url => {
      if (_.isFunction(success)) {
        success(url);
      }
    }).catch(e => {
      if (_.isFunction(error)) {
        error(e);
      }
    });
}

<UploadableBase
    onLoaded={url => { console.log(url); }}
    onError={url => { console.error(e); }}
    className="my-test-upload-component-class",
    componentProps: {
      callAction: call
    },
/>
```

### UploadableLink
For using in cells listing structure settings example
```
{
    component: 'uploadableLink',
    config: {
      name: 'CV',
      sortable: true,
      overflow: true,
      width: 55,
    },
    displayField: 'cv',
    valueField: 'cv',
},
```