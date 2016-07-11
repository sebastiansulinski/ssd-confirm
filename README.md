# jQuery confirmation plugin

Simple confirmation plugin for jQuery.

[Demo is available here](http://ssd-confirm.ssdtutorials.com/)

## Installation

To make the plugin work you need to include jQuery and styles from within `ssd-confirm.css` file as well as either minified or src version of the plugin.

```
<link href="./assets/css/ssd-confirm.css" rel="stylesheet">

<script src="./node_modules/jquery/dist/jquery.js"></script>
<script src="./src/jquery.ssd-confirm.js"></script>
```

You also need to add the following html towards the bottom of your page structure (all `data` attributes are configurable):

### Confirmation dialog

```
<div data-ssd-confirm>

    <div data-ssd-confirm-block="remove">

        <p data-ssd-confirm-content></p>

        <nav>

            <span data-button-wrapper>

                <span
                    class="small alert button"
                    data-ssd-confirm-yes
                    data-trigger
                >YES</span>

                <span
                    class="small alert disabled button hide"
                    data-processing
                ><i class="fa fa-spinner fa-spin fa-fw"></i></span>

            </span>

            <span class="small button" data-ssd-confirm-no>NO</span>

        </nav>

    </div>

</div>

<div data-ssd-confirm-overlay></div>
```

### Example list of records

```
<table class="table-list">

    <thead>
        <tr>
            <th>
                Name
            </th>
            <th class="col-1">
                <span
                    class="small secondary disabled button"
                >
                    <i class="fa fa-trash fa-fw"></i>
                </span>
            </th>
        </tr>
    </thead>

    <tbody>
        <tr data-row>
            <td>
                Remove row after confirming
            </td>
            <td>
                <span
                    class="small button"
                    data-ssd-confirm-trigger="remove"
                    data-ssd-confirm-message="Are you sure you wish to remove this record?<br />There is no undo!"
                    data-ssd-confirm-url="/remove.json"
                    data-ssd-confirm-behaviour="removeRow"
                >
                    <i class="fa fa-trash fa-fw"></i>
                </span>
            </td>
        </tr>
        <tr data-row>
            <td>
                Reload after confirming
            </td>
            <td>
                <span
                    class="small button"
                    data-ssd-confirm-trigger="remove"
                    data-ssd-confirm-message="Are you sure you wish to remove this record?<br />There is no undo!"
                    data-ssd-confirm-url="/remove.json"
                    data-ssd-confirm-behaviour="reload"
                >
                    <i class="fa fa-trash fa-fw"></i>
                </span>
            </td>
        </tr>
        <tr data-row>
            <td>
                Reload after confirming
            </td>
            <td>
                <span
                    class="small button"
                    data-ssd-confirm-trigger="remove"
                    data-ssd-confirm-message="Are you sure you wish to remove this record?<br />There is no undo!"
                    data-ssd-confirm-url="/remove.json"
                    data-ssd-confirm-behaviour="reload"
                >
                    <i class="fa fa-trash fa-fw"></i>
                </span>
            </td>
        </tr>
    </tbody>

</table>
```

Considering the above, here's how the data attributes from the two code blocks are referring to each other


- `data-ssd-confirm-trigger`: Associated value (in this case `remove`) corresponds to the `data-ssd-confirm-block`. You can have number of different purpose blocks.
- `data-ssd-confirm-message`: Message that will be injected into the `data-ssd-confirm-content`.
- `data-ssd-confirm-url`: End point to be called when the `Yes` button within the confirmation dialog is triggered.
- `data-ssd-confirm-behaviour`: Method that will be executed after successful call.


## Instantiating plugin

Call plugin on the instance of the trigger you wish to apply it to.

```
$('[data-ssd-confirm-trigger]').ssdConfirm();
```

## Options

```
dataType: 'ssd-confirm-trigger',            // trigger 'data-*' attribute - corresponds to the 'dataConfirmBlock'.
dataMessage: 'ssd-confirm-message',         // trigger 'data-*' attribute - corresponds to the 'dataConfirmContent'.
dataUrl: 'ssd-confirm-url',                 // trigger 'data-*' attribute that stores the url / uri to be called when 'Yes' button is triggered.
dataBehaviour: 'ssd-confirm-behaviour',     // trigger 'data-*' attribute that indicates what method should be executed after successful call.

dataConfirmWrapper: 'ssd-confirm',          // dialog wrapper 'data-*' attribute.
dataConfirmBlock: 'ssd-confirm-block',      // dialog block type 'data-*' attribute - corresponds to 'dataType'.
dataConfirmContent: 'ssd-confirm-content',  // dialog content 'data-*' attribute - corresponds to 'dataMessage'.

dataButtonWrapper: 'button-wrapper',        // dialog button wrapper 'data-*' attribute - used when you want to show 'pending' button when ajax call is being made.
dataButtonTrigger: 'trigger',               // dialog trigger 'data-*' attribute - to be used with 'Yes' button.
dataButtonProcessing: 'processing',         // dialog processing 'data-*' attribute - to be used with button that swaps 'Yes' button when ajax call is being made.

dataButtonYes: 'ssd-confirm-yes',           // dialog 'yes' button 'data-*' attribute.
dataButtonNo: 'ssd-confirm-no',             // dialog 'no' button 'data-*' attribute.

dataRecordWrapper: 'row',                   // list record wrapper 'data-*' attribute.

dataOverlay: 'ssd-confirm-overlay',         // overlay 'data-*' attribute.

classActive: 'active',                      // dialog css class used to reveal the confirmation dialog (by default it slides it down).
classShow: 'show',                          // dialog / overlay css class to reveal given block of the confirmation dialog and overlay.
classHide: 'hide',                          // dialog css class to hide 'yes' / 'processing' buttons.

extendBlocks: {},                           // object that can extend blocks (currently only 'remove').
extendBehaviours: {}                        // object that can extend behaviours (currently only 'reload' and 'removeRow').

actionProperties: function(trigger, properties) { return properties; }
// allows you to modify properties before the call is made.
```

## Behaviours

Currently there are only 2 behaviours, but you can add more by adding them to the `extendBehaviours` option.

```
reload: Reloads page.
removeRow: Removes the container of the record. This option requires `dataRecordWrapper` to be applied to the container of your record (default `data-row`), which should contain the trigger button. Example


<tr data-row>
    <td>
        Record name
    </td>
    <td>
        <span
            class="small button"
            data-ssd-confirm-trigger="remove"
            data-ssd-confirm-message="Are you sure you wish to remove this record?<br />There is no undo!"
            data-ssd-confirm-url="/remove.json"
            data-ssd-confirm-behaviour="removeRow"
        >
            <i class="fa fa-trash fa-fw"></i>
        </span>
    </td>
</tr>
```

Behaviour methods take 3 arguments:

```
data:               // data returned from ajax call
trigger:            // instance of the 'yes' button
properties:         // object containing:

    url:            // url / uri to be called
    behaviour:      // behaviour name
    originator:     // instance of the button that triggered the dialog
    processing:     // instance of the 'processing' button if exists - otherwise 'null'
```