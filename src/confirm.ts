// import { EVENT_DEFAULTS, dispatch } from "./utils/events.js";
// import { SELECTORS } from "./utils/dom.js";

// export default class Confirm {
//   /**
//    * An array of queries to run on the document. Each object has an event, and then a queries array.
//    */
//   static get queries() {
//     return [
//       {
//         event: "click",
//         selectors: [
//           SELECTORS.linkClickSelector.selector,
//           SELECTORS.buttonClickSelector.selector,
//           SELECTORS.formInputClickSelector.selector
//         ],
//       },
//       {
//         event: "change",
//         selectors: [
//           SELECTORS.inputChangeSelector.selector,
//         ],
//       },
//       {
//         event: "submit",
//         selectors: [
//           SELECTORS.formSubmitSelector.selector,
//         ]
//       }
//     ]
//   }

//   connect() {
//     // TODO
//     Confirm.queries.forEach((obj) => {
//       obj.selectors.forEach((selector) => {
//         document.querySelectorAll(selector).forEach((element) => {
//           element.addEventListener(obj.event, () => {});
//         })
//       })
//     })
//   }

//   disconnect() {
//   }

//   handleConfirm() {
//   }
// }
