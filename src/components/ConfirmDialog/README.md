#### Common Confirm Dialog Component

> Example @/pages/share/index.html

```html
  <confirm-dialog
    v-model:visible="visible"
    :title="title"
    :content="content"
    confirm-text="Confirm"
    cancel-text="Cancel"
    @confirm="onConfirm"
    @cancel="onCancel"
  ></confirm-dialog>
```

> Support slot use: title、content、confirm-button、cancel-button

