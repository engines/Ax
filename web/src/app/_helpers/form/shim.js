// cc.form.shim = {
//
//   controls: {
//
//     combobox: ( f, target ) => ( options={} ) => (a,x) => f.controls.selectinput( options ),
//     json: ( f, target ) => ( options={} ) => (a,x) => x.jsoneditor.form.control( f, { theme: 'bootstrap3', ...options } ),
//     code: ( f, target ) => ( options={} ) => (a,x) => {
//
//         if ( ax.is.object( options.mode) ) {
//           options.mode = {
//             value: options.mode.value || localStorage.editorDefaultMode,
//             selections: options.mode.selections,
//           }
//         }
//
//         return x.codemirror.form.control( f, {
//           keymap: window.localStorage.editorKeymap,
//           ...options,
//         } )
//
//     },
//     markdown: ( f, target ) => ( options={} ) => (a,x) => x.simplemde.form.control( f, options ),
//
//     table: ( f, target ) => ( options={} ) => target( {
//       ...options,
//       sortOnButton: {
//         ...options.sortOnButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.sortOnButton || {} ).buttonTag,
//         },
//       },
//       addButton: {
//         ...options.addButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.addButton || {} ).buttonTag,
//         },
//       },
//       upButton: {
//         ...options.upButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.upButton || {} ).buttonTag,
//         },
//       },
//       downButton: {
//         ...options.downButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.downButton || {} ).buttonTag,
//         },
//       },
//       removeButton: {
//         ...options.removeButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.removeButton || {} ).buttonTag,
//         },
//       },
//
//     } ),
//
//     many: ( f, target ) => ( options={} ) => target( {
//       ...options,
//       sortOnButton: {
//         ...options.sortOnButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.sortOnButton || {} ).buttonTag,
//         },
//       },
//       addButton: {
//         ...options.addButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.addButton || {} ).buttonTag,
//         },
//       },
//       upButton: {
//         ...options.upButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.upButton || {} ).buttonTag,
//         },
//       },
//       downButton: {
//         ...options.downButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.downButton || {} ).buttonTag,
//         },
//       },
//       removeButton: {
//         ...options.removeButton,
//         buttonTag: {
//           class: 'btn app-btn',
//           ...( options.removeButton || {} ).buttonTag,
//         },
//       },
//
//     } ),
//
//   },
//
//   // btns: (f) => ( controller, options={} ) => f.buttons( {
//   //   cancel: {
//   //     onclick: () => history.back(), // controller.open( '..', controller.query, controller.anchor ),
//   //     ...options.cancel
//   //   },
//   //   ...options
//   // } ),
//
//   buttons: (f) => ( options={} ) => (a,x) => a['app-form-buttons']( [
//     ( options.cancel == false ) ? null:  f.button( {
//       label: app.icon( 'fa fa-times', 'Cancel' ),
//       to: cc.hourglass( 'Cancelling…' ),
//       onclick: () => history.back(),
//       ...options.cancel
//     } ),
//     ' ',
//     ( options.submit == false ) ? null:  f.submit( {
//       label: app.icon( 'fa fa-check', 'Submit' ),
//       ...options.submit
//     } ),
//   ], {
//     ...options.buttonsTag,
//     style: {
//       display: 'block',
//       ...( options.buttonsTag || {} ).style,
//     },
//   } ),
//
//   row: ( f, target ) => ( options={} ) => (a,x) => a['div.row'](
//     ( options.columns || [] ).map( (column) => a['div.col-sm'](column) ),
//     options.rowTag
//   ),
//
// }
