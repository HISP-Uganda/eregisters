import { TEAL, LIGHT_BLUE } from "./theme";

/** The HMIS form's table, tab and field styles (the `hmis105-*` classes). */
export const HMIS_FORM_CSS = `
      .hmis105-form-table {
        width: auto;
        border-collapse: separate;
        border-spacing: 0;
        margin-bottom: 16px;
        border-left: 1px solid ${TEAL};
        border-top: 1px solid ${TEAL};
      }

      .hmis105-form-table th,
      .hmis105-form-table td {
        border-right: 1px solid ${TEAL};
        border-bottom: 1px solid ${TEAL};
        padding: 4px;
        vertical-align: middle;
        min-width: 80px;
      }

      .hmis105-form-table thead th,
      .hmis105-form-table thead td {
        position: sticky;
        top: 0;
        z-index: 3;
      }

      .hmis105-form-table .hmis105-sticky-col {
        position: sticky;
        z-index: 2;
        background: #ffffff;
      }

      .hmis105-form-table thead .hmis105-sticky-col {
        z-index: 4;
      }

      .hmis105-section-title-row td,
      .hmis105-section-row td {
        background: ${TEAL} !important;
        color: #ffffff;
        font-weight: 700;
      }

      .hmis105-subhead-row td,
      .hmis105-subhead-row th {
        background: ${LIGHT_BLUE} !important;
        font-weight: 700;
        text-align: center;
      }

      .hmis105-data-row:hover td,
      .hmis105-label-row:hover td {
        background: ${LIGHT_BLUE} !important;
      }

      .hmis105-data-row:hover .hmis105-sticky-col,
      .hmis105-label-row:hover .hmis105-sticky-col {
        background: ${LIGHT_BLUE} !important;
      }

      .hmis105-field {
        min-width: 80px;
        width: 80px;
        text-align: center;
      }

      /* antd v6 InputNumber uses .ant-input-number-disabled on the wrapper
         and .ant-input-number-input on the actual <input>. Its default
         disabled color is rgba(0,0,0,0.25) which is unreadable on our grey
         background — override both selectors. */
      .hmis105-field.ant-input-number-disabled,
      .hmis105-field.ant-input-disabled {
        background-color: #e6e6e6 !important;
        cursor: not-allowed !important;
      }

      .hmis105-field.ant-input-number-disabled .ant-input-number-input,
      .hmis105-field.ant-input-disabled .ant-input-number-input,
      .hmis105-field.ant-input-number-disabled input,
      .hmis105-field.ant-input-disabled input {
        color: #000 !important;
        -webkit-text-fill-color: #000 !important;
        cursor: not-allowed !important;
      }

      .hmis105-tabs {
        min-height: 0;
      }

      .hmis105-tabs > .ant-tabs {
        height: 100% !important;
        min-height: 0 !important;
        display: flex !important;
        overflow: hidden !important;
      }

      .hmis105-tabs .ant-tabs-nav {
        background: #f7fafb;
        border-right: 1px solid #d5e3e6;
        // padding: 8px 6px;
        flex: 0 0 auto !important;
        align-self: stretch !important;
      }

      .hmis105-tabs .ant-tabs-content-holder {
        flex: 1 1 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
        // padding: 0 0 0 12px;
      }

      .hmis105-tab-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .hmis105-tab-scroll::-webkit-scrollbar-thumb {
        background: #c5d5d9;
        border-radius: 4px;
      }

      .hmis105-tabs .ant-tabs-content-holder::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .hmis105-tabs .ant-tabs-content-holder::-webkit-scrollbar-thumb {
        background: #c5d5d9;
        border-radius: 4px;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap {
        overflow: auto !important;
        height: 100%;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap::before,
      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap::after {
        display: none !important;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-operations {
        display: none !important;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .hmis105-tabs .ant-tabs-nav .ant-tabs-nav-wrap::-webkit-scrollbar {
        display: none;
      }

      .hmis105-tabs .ant-tabs-tab {
        height: auto !important;
        // padding: 10px 12px !important;
        // margin: 4px 2px !important;
        border-radius: 6px;
        transition: background-color 0.15s ease;
      }

      .hmis105-tabs .ant-tabs-tab .ant-tabs-tab-btn {
        color: #4a5b60 !important;
        font-weight: 500;
        white-space: normal !important;
        word-break: break-word;
        line-height: 1.35;
        text-align: left;
      }

      .hmis105-tabs .ant-tabs-tab:not(.ant-tabs-tab-active):hover {
        background: #e6f0f2 !important;
      }

      .hmis105-tabs .ant-tabs-tab.ant-tabs-tab-active {
        background: ${TEAL} !important;
        box-shadow: 0 1px 3px rgba(102, 165, 173, 0.35);
      }

      .hmis105-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      .hmis105-tabs .ant-tabs-ink-bar {
        display: none !important;
      }
    `;
