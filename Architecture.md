## Classes

Every class implemented by mrujs should implement a `connect()` and
`disconnect()` lifecycle hook. Connect should contain any event
listeners and disconnect should remove those event listeners.

This allows us to do the following:

```js
import Ajax from './ajax.js';
import Csrf from './csrf.js';

export default class Mrujs {
  // connect
  start() {
    this.csrf.connect();
    this.ajax.connect();
  }

  // disconnect
  stop() {
    this.ajax.disconnect();
    this.csrf.disconnect();
  }
  // ...
}
```
