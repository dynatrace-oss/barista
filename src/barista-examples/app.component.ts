import { Component } from '@angular/core';

@Component({
  selector: 'barista-examples',
  styleUrls: ['app.component.scss'],
  templateUrl: 'app.component.html',
})
export class App {
  componentItems = [
	{
		"name": "alert",
		"examples": [
			{
				"name": "dark-alert-example-component",
				"route": "/alert/dark-alert-example-component"
			},
			{
				"name": "error-alert-example-component",
				"route": "/alert/error-alert-example-component"
			},
			{
				"name": "interactive-alert-example-component",
				"route": "/alert/interactive-alert-example-component"
			},
			{
				"name": "warning-alert-example-component",
				"route": "/alert/warning-alert-example-component"
			}
		]
	},
	{
		"name": "autocomplete",
		"examples": [
			{
				"name": "attach-different-element-autocomplete-example",
				"route": "/autocomplete/attach-different-element-autocomplete-example"
			},
			{
				"name": "control-values-autocomplete-example",
				"route": "/autocomplete/control-values-autocomplete-example"
			},
			{
				"name": "custom-filter-autocomplete-example",
				"route": "/autocomplete/custom-filter-autocomplete-example"
			},
			{
				"name": "default-autocomplete-example",
				"route": "/autocomplete/default-autocomplete-example"
			},
			{
				"name": "groups-autocomplete-example",
				"route": "/autocomplete/groups-autocomplete-example"
			},
			{
				"name": "highlight-first-option-autocomplete-example",
				"route": "/autocomplete/highlight-first-option-autocomplete-example"
			}
		]
	},
	{
		"name": "breadcrumbs",
		"examples": [
			{
				"name": "dark-breadcrumbs-example-component",
				"route": "/breadcrumbs/dark-breadcrumbs-example-component"
			},
			{
				"name": "default-breadcrumbs-example-component",
				"route": "/breadcrumbs/default-breadcrumbs-example-component"
			},
			{
				"name": "external-breadcrumbs-example-component",
				"route": "/breadcrumbs/external-breadcrumbs-example-component"
			},
			{
				"name": "observable-breadcrumbs-example-component",
				"route": "/breadcrumbs/observable-breadcrumbs-example-component"
			}
		]
	},
	{
		"name": "button-group",
		"examples": [
			{
				"name": "button-group-default-example-component",
				"route": "/button-group/button-group-default-example-component"
			},
			{
				"name": "button-group-disabled-example-component",
				"route": "/button-group/button-group-disabled-example-component"
			},
			{
				"name": "button-group-error-example-component",
				"route": "/button-group/button-group-error-example-component"
			},
			{
				"name": "button-group-interactive-example-component",
				"route": "/button-group/button-group-interactive-example-component"
			},
			{
				"name": "button-group-item-disabled-example-component",
				"route": "/button-group/button-group-item-disabled-example-component"
			}
		]
	},
	{
		"name": "button",
		"examples": [
			{
				"name": "color-button-example-component",
				"route": "/button/color-button-example-component"
			},
			{
				"name": "dark-button-example-component",
				"route": "/button/dark-button-example-component"
			},
			{
				"name": "default-button-example-component",
				"route": "/button/default-button-example-component"
			},
			{
				"name": "disabled-button-example-component",
				"route": "/button/disabled-button-example-component"
			},
			{
				"name": "icon-only-button-example-component",
				"route": "/button/icon-only-button-example-component"
			},
			{
				"name": "icons-button-example-component",
				"route": "/button/icons-button-example-component"
			},
			{
				"name": "interaction-button-example-component",
				"route": "/button/interaction-button-example-component"
			},
			{
				"name": "loading-spinner-button-example-component",
				"route": "/button/loading-spinner-button-example-component"
			},
			{
				"name": "variant-button-example-component",
				"route": "/button/variant-button-example-component"
			}
		]
	},
	{
		"name": "card",
		"examples": [
			{
				"name": "action-buttons-card-example-component",
				"route": "/card/action-buttons-card-example-component"
			},
			{
				"name": "dark-theme-card-example-component",
				"route": "/card/dark-theme-card-example-component"
			},
			{
				"name": "default-card-example-component",
				"route": "/card/default-card-example-component"
			},
			{
				"name": "icon-card-example-component",
				"route": "/card/icon-card-example-component"
			},
			{
				"name": "subtitle-card-example-component",
				"route": "/card/subtitle-card-example-component"
			},
			{
				"name": "title-card-example-component",
				"route": "/card/title-card-example-component"
			}
		]
	},
	{
		"name": "chart",
		"examples": [
			{
				"name": "chart-area-range-example-component",
				"route": "/chart/chart-area-range-example-component"
			},
			{
				"name": "chart-categorized-example-component",
				"route": "/chart/chart-categorized-example-component"
			},
			{
				"name": "chart-default-example-component",
				"route": "/chart/chart-default-example-component"
			},
			{
				"name": "chart-heatfield-example-component",
				"route": "/chart/chart-heatfield-example-component"
			},
			{
				"name": "chart-heatfield-multiple-example-component",
				"route": "/chart/chart-heatfield-multiple-example-component"
			},
			{
				"name": "chart-loading-example-component",
				"route": "/chart/chart-loading-example-component"
			},
			{
				"name": "chart-orderd-colors-example-component",
				"route": "/chart/chart-orderd-colors-example-component"
			},
			{
				"name": "chart-pie-example-component",
				"route": "/chart/chart-pie-example-component"
			},
			{
				"name": "chart-stream-example-component",
				"route": "/chart/chart-stream-example-component"
			}
		]
	},
	{
		"name": "checkbox",
		"examples": [
			{
				"name": "dark-checkbox-example",
				"route": "/checkbox/dark-checkbox-example"
			},
			{
				"name": "default-checkbox-example-component",
				"route": "/checkbox/default-checkbox-example-component"
			},
			{
				"name": "indeterminate-checkbox-example-component",
				"route": "/checkbox/indeterminate-checkbox-example-component"
			}
		]
	},
	{
		"name": "context-dialog",
		"examples": [
			{
				"name": "custom-icon-context-dialog-example-component",
				"route": "/context-dialog/custom-icon-context-dialog-example-component"
			},
			{
				"name": "dark-context-dialog-example-component",
				"route": "/context-dialog/dark-context-dialog-example-component"
			},
			{
				"name": "default-context-dialog-example-component",
				"route": "/context-dialog/default-context-dialog-example-component"
			},
			{
				"name": "interactive-context-dialog-example-component",
				"route": "/context-dialog/interactive-context-dialog-example-component"
			},
			{
				"name": "prev-focus-context-dialog-example-component",
				"route": "/context-dialog/prev-focus-context-dialog-example-component"
			}
		]
	},
	{
		"name": "copy-to-clipboard",
		"examples": [
			{
				"name": "callback-copy-to-clipboard-example-component",
				"route": "/copy-to-clipboard/callback-copy-to-clipboard-example-component"
			},
			{
				"name": "context-copy-to-clipboard-example-component",
				"route": "/copy-to-clipboard/context-copy-to-clipboard-example-component"
			},
			{
				"name": "dark-copy-to-clipboard-example-component",
				"route": "/copy-to-clipboard/dark-copy-to-clipboard-example-component"
			},
			{
				"name": "default-copy-to-clipboard-example-component",
				"route": "/copy-to-clipboard/default-copy-to-clipboard-example-component"
			},
			{
				"name": "disabled-copy-to-clipboard-example-component",
				"route": "/copy-to-clipboard/disabled-copy-to-clipboard-example-component"
			}
		]
	},
	{
		"name": "cta-card",
		"examples": [
			{
				"name": "closable-cta-card-example-component",
				"route": "/cta-card/closable-cta-card-example-component"
			},
			{
				"name": "default-cta-card-example-component",
				"route": "/cta-card/default-cta-card-example-component"
			}
		]
	},
	{
		"name": "expandable-panel",
		"examples": [
			{
				"name": "default-expandable-panel-example-component",
				"route": "/expandable-panel/default-expandable-panel-example-component"
			},
			{
				"name": "open-expandable-panel-example-component",
				"route": "/expandable-panel/open-expandable-panel-example-component"
			},
			{
				"name": "trigger-expandable-panel-example-component",
				"route": "/expandable-panel/trigger-expandable-panel-example-component"
			},
			{
				"name": "trigger-simple-expandable-panel-example-component",
				"route": "/expandable-panel/trigger-simple-expandable-panel-example-component"
			}
		]
	},
	{
		"name": "expandable-section",
		"examples": [
			{
				"name": "default-expandable-section-example-component",
				"route": "/expandable-section/default-expandable-section-example-component"
			},
			{
				"name": "disabled-expandable-section-example-component",
				"route": "/expandable-section/disabled-expandable-section-example-component"
			},
			{
				"name": "interactive-expandable-section-example-component",
				"route": "/expandable-section/interactive-expandable-section-example-component"
			},
			{
				"name": "open-expandable-section-example-component",
				"route": "/expandable-section/open-expandable-section-example-component"
			}
		]
	},
	{
		"name": "filter-field",
		"examples": [
			{
				"name": "default-filter-field-example",
				"route": "/filter-field/default-filter-field-example"
			}
		]
	},
	{
		"name": "form-field",
		"examples": [
			{
				"name": "default-form-field-example",
				"route": "/form-field/default-form-field-example"
			},
			{
				"name": "error-form-field-example",
				"route": "/form-field/error-form-field-example"
			},
			{
				"name": "hint-form-field-example",
				"route": "/form-field/hint-form-field-example"
			},
			{
				"name": "prefix-suffix-form-field-example",
				"route": "/form-field/prefix-suffix-form-field-example"
			}
		]
	},
	{
		"name": "formatters",
		"examples": [
			{
				"name": "bits-example",
				"route": "/formatters/bits-example"
			},
			{
				"name": "bytes-example",
				"route": "/formatters/bytes-example"
			},
			{
				"name": "count-example",
				"route": "/formatters/count-example"
			},
			{
				"name": "percent-example",
				"route": "/formatters/percent-example"
			},
			{
				"name": "rate-example",
				"route": "/formatters/rate-example"
			}
		]
	},
	{
		"name": "icon",
		"examples": [
			{
				"name": "docs-async-icon",
				"route": "/icon/docs-async-icon"
			},
			{
				"name": "all-icon-example",
				"route": "/icon/all-icon-example"
			},
			{
				"name": "default-icon-example",
				"route": "/icon/default-icon-example"
			}
		]
	},
	{
		"name": "inline-editor",
		"examples": [
			{
				"name": "api-inline-editor-example",
				"route": "/inline-editor/api-inline-editor-example"
			},
			{
				"name": "default-inline-editor-example",
				"route": "/inline-editor/default-inline-editor-example"
			},
			{
				"name": "failing-inline-editor-example",
				"route": "/inline-editor/failing-inline-editor-example"
			},
			{
				"name": "required-inline-editor-example",
				"route": "/inline-editor/required-inline-editor-example"
			},
			{
				"name": "successful-inline-editor-example",
				"route": "/inline-editor/successful-inline-editor-example"
			}
		]
	},
	{
		"name": "input",
		"examples": [
			{
				"name": "dark-input-example",
				"route": "/input/dark-input-example"
			},
			{
				"name": "default-input-example",
				"route": "/input/default-input-example"
			},
			{
				"name": "disabled-readonly-input-example",
				"route": "/input/disabled-readonly-input-example"
			},
			{
				"name": "ng-model-input-example",
				"route": "/input/ng-model-input-example"
			},
			{
				"name": "textarea-input-example",
				"route": "/input/textarea-input-example"
			}
		]
	},
	{
		"name": "key-value-list",
		"examples": [
			{
				"name": "default-key-value-list-example-component",
				"route": "/key-value-list/default-key-value-list-example-component"
			},
			{
				"name": "longtext-key-value-list-example-component",
				"route": "/key-value-list/longtext-key-value-list-example-component"
			},
			{
				"name": "multicolumn-key-value-list-example-component",
				"route": "/key-value-list/multicolumn-key-value-list-example-component"
			}
		]
	},
	{
		"name": "link",
		"examples": [
			{
				"name": "link-dark-example-component",
				"route": "/link/link-dark-example-component"
			},
			{
				"name": "link-external-example-component",
				"route": "/link/link-external-example-component"
			},
			{
				"name": "link-notification-example-component",
				"route": "/link/link-notification-example-component"
			},
			{
				"name": "link-simple-example-component",
				"route": "/link/link-simple-example-component"
			}
		]
	},
	{
		"name": "loading-distractor",
		"examples": [
			{
				"name": "default-loading-distractor-example-component",
				"route": "/loading-distractor/default-loading-distractor-example-component"
			},
			{
				"name": "input-loading-distractor-example-component",
				"route": "/loading-distractor/input-loading-distractor-example-component"
			},
			{
				"name": "spinner-loading-distractor-example-component",
				"route": "/loading-distractor/spinner-loading-distractor-example-component"
			}
		]
	},
	{
		"name": "micro-chart",
		"examples": [
			{
				"name": "micro-chart-columns-example-component",
				"route": "/micro-chart/micro-chart-columns-example-component"
			},
			{
				"name": "micro-chart-default-example-component",
				"route": "/micro-chart/micro-chart-default-example-component"
			},
			{
				"name": "micro-chart-stream-example-component",
				"route": "/micro-chart/micro-chart-stream-example-component"
			}
		]
	},
	{
		"name": "overlay",
		"examples": [
			{
				"name": "default-overlay-example-component",
				"route": "/overlay/default-overlay-example-component"
			},
			{
				"name": "dummy-overlay",
				"route": "/overlay/dummy-overlay"
			},
			{
				"name": "programmatic-overlay-example-component",
				"route": "/overlay/programmatic-overlay-example-component"
			},
			{
				"name": "timeline-component",
				"route": "/overlay/timeline-component"
			},
			{
				"name": "timeline-point-component",
				"route": "/overlay/timeline-point-component"
			},
			{
				"name": "timeline-overlay-example-component",
				"route": "/overlay/timeline-overlay-example-component"
			}
		]
	},
	{
		"name": "pagination",
		"examples": [
			{
				"name": "default-pagination-example-component",
				"route": "/pagination/default-pagination-example-component"
			},
			{
				"name": "many-pagination-example-component",
				"route": "/pagination/many-pagination-example-component"
			}
		]
	},
	{
		"name": "progress-bar",
		"examples": [
			{
				"name": "change-progress-bar-example-component",
				"route": "/progress-bar/change-progress-bar-example-component"
			},
			{
				"name": "default-progress-bar-example-component",
				"route": "/progress-bar/default-progress-bar-example-component"
			},
			{
				"name": "right-aligned-progress-bar-example-component",
				"route": "/progress-bar/right-aligned-progress-bar-example-component"
			},
			{
				"name": "with-color-progress-bar-example-component",
				"route": "/progress-bar/with-color-progress-bar-example-component"
			}
		]
	},
	{
		"name": "progress-circle",
		"examples": [
			{
				"name": "change-progress-circle-example-component",
				"route": "/progress-circle/change-progress-circle-example-component"
			},
			{
				"name": "default-progress-circle-example-component",
				"route": "/progress-circle/default-progress-circle-example-component"
			},
			{
				"name": "with-color-progress-circle-example-component",
				"route": "/progress-circle/with-color-progress-circle-example-component"
			},
			{
				"name": "with-icon-progress-circle-example-component",
				"route": "/progress-circle/with-icon-progress-circle-example-component"
			},
			{
				"name": "with-text-progress-circle-example-component",
				"route": "/progress-circle/with-text-progress-circle-example-component"
			}
		]
	},
	{
		"name": "radio",
		"examples": [
			{
				"name": "dark-radio-example",
				"route": "/radio/dark-radio-example"
			},
			{
				"name": "default-radio-example",
				"route": "/radio/default-radio-example"
			},
			{
				"name": "name-grouping-radio-example",
				"route": "/radio/name-grouping-radio-example"
			}
		]
	},
	{
		"name": "select",
		"examples": [
			{
				"name": "complex-value-select-example-component",
				"route": "/select/complex-value-select-example-component"
			},
			{
				"name": "default-select-example-component",
				"route": "/select/default-select-example-component"
			},
			{
				"name": "disabled-select-example-component",
				"route": "/select/disabled-select-example-component"
			},
			{
				"name": "form-field-select-example-component",
				"route": "/select/form-field-select-example-component"
			},
			{
				"name": "forms-select-example-component",
				"route": "/select/forms-select-example-component"
			},
			{
				"name": "groups-select-example-component",
				"route": "/select/groups-select-example-component"
			},
			{
				"name": "value-select-example-component",
				"route": "/select/value-select-example-component"
			}
		]
	},
	{
		"name": "selection-area",
		"examples": [
			{
				"name": "selection-area-chart-example",
				"route": "/selection-area/selection-area-chart-example"
			},
			{
				"name": "selection-area-default-example",
				"route": "/selection-area/selection-area-default-example"
			}
		]
	},
	{
		"name": "show-more",
		"examples": [
			{
				"name": "dark-theme-show-more-example-component",
				"route": "/show-more/dark-theme-show-more-example-component"
			},
			{
				"name": "default-show-more-example-component",
				"route": "/show-more/default-show-more-example-component"
			},
			{
				"name": "interactive-show-more-example-component",
				"route": "/show-more/interactive-show-more-example-component"
			},
			{
				"name": "no-text-show-more-example-component",
				"route": "/show-more/no-text-show-more-example-component"
			}
		]
	},
	{
		"name": "switch",
		"examples": [
			{
				"name": "dark-theme-switch-example-component",
				"route": "/switch/dark-theme-switch-example-component"
			},
			{
				"name": "default-switch-example-component",
				"route": "/switch/default-switch-example-component"
			}
		]
	},
	{
		"name": "table",
		"examples": [
			{
				"name": "table-default-component",
				"route": "/table/table-default-component"
			},
			{
				"name": "table-different-width-component",
				"route": "/table/table-different-width-component"
			},
			{
				"name": "table-dynamic-columns-component",
				"route": "/table/table-dynamic-columns-component"
			},
			{
				"name": "table-empty-custom-state-component",
				"route": "/table/table-empty-custom-state-component"
			},
			{
				"name": "table-empty-state-component",
				"route": "/table/table-empty-state-component"
			},
			{
				"name": "table-expandable-rows-component",
				"route": "/table/table-expandable-rows-component"
			},
			{
				"name": "table-loading-component",
				"route": "/table/table-loading-component"
			},
			{
				"name": "table-min-width-component",
				"route": "/table/table-min-width-component"
			},
			{
				"name": "table-observable-component",
				"route": "/table/table-observable-component"
			},
			{
				"name": "table-problem-component",
				"route": "/table/table-problem-component"
			},
			{
				"name": "table-sorting-full-component",
				"route": "/table/table-sorting-full-component"
			},
			{
				"name": "table-sorting-component",
				"route": "/table/table-sorting-component"
			},
			{
				"name": "table-sticky-header-component",
				"route": "/table/table-sticky-header-component"
			}
		]
	},
	{
		"name": "tabs",
		"examples": [
			{
				"name": "default-tabs-example-component",
				"route": "/tabs/default-tabs-example-component"
			},
			{
				"name": "dynamic-tabs-example-component",
				"route": "/tabs/dynamic-tabs-example-component"
			},
			{
				"name": "interactive-tabs-example-component",
				"route": "/tabs/interactive-tabs-example-component"
			}
		]
	},
	{
		"name": "tag",
		"examples": [
			{
				"name": "default-tag-example-component",
				"route": "/tag/default-tag-example-component"
			},
			{
				"name": "disabled-tag-example-component",
				"route": "/tag/disabled-tag-example-component"
			},
			{
				"name": "interactive-tag-example-component",
				"route": "/tag/interactive-tag-example-component"
			},
			{
				"name": "key-tag-example-component",
				"route": "/tag/key-tag-example-component"
			},
			{
				"name": "removable-tag-example-component",
				"route": "/tag/removable-tag-example-component"
			}
		]
	},
	{
		"name": "tile",
		"examples": [
			{
				"name": "default-tile-example-component",
				"route": "/tile/default-tile-example-component"
			},
			{
				"name": "disabled-tile-example-component",
				"route": "/tile/disabled-tile-example-component"
			},
			{
				"name": "error-tile-example-component",
				"route": "/tile/error-tile-example-component"
			},
			{
				"name": "main-tile-example-component",
				"route": "/tile/main-tile-example-component"
			},
			{
				"name": "recovered-tile-example-component",
				"route": "/tile/recovered-tile-example-component"
			},
			{
				"name": "small-tile-example-component",
				"route": "/tile/small-tile-example-component"
			}
		]
	},
	{
		"name": "toast",
		"examples": [
			{
				"name": "default-toast-example-component",
				"route": "/toast/default-toast-example-component"
			},
			{
				"name": "dynamic-msg-toast-example-component",
				"route": "/toast/dynamic-msg-toast-example-component"
			}
		]
	}
];

  selectedTheme = 'turquoise';
  themes = [
    { value: 'turquoise', name: 'Turquoise' },
    { value: 'blue', name: 'Blue' },
    { value: 'purple', name: 'Purple' },
    { value: 'royalblue', name: 'Royalblue' },
  ];
}
