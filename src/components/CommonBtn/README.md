#### Common Button Component

> Example @/components/ConfirmDialog

```html
  <common-btn
    v-if="cancelText"
    :custom-class="['confirm-dialog-footer-btn']"
    :btn-text="cancelText"
    btn-type="default"
    @click="handleBtnClick('cancel')">
  </common-btn>
```

> Support slot use

```html
  <common-btn
    :custom-class="['confirm-dialog-footer-btn']"
    btn-type="primary"
  >
    <template #button>
      {{ confirmDialogParams.confirmText }}
      <launch-wrap :type="type" :id="id" :inviter-id="inviterId" height="4.8" tag-id="launch-btn-open"></launch-wrap>
    </template>
  </common-btn>
```
