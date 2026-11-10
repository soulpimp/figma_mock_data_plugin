import { faker } from '@faker-js/faker';
import cssText from './ui.css';

console.log("UI Script initialized!");

const styleEl = document.createElement('style');
styleEl.textContent = cssText;
document.head.appendChild(styleEl);


// Network and Image Fetch Listener

window.onmessage = async (event: MessageEvent) => {
  const msg = event.data?.pluginMessage;

  if (msg && msg.type === 'FETCH_IMAGE') {
    try {
      const response = await fetch(msg.url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      
      const buffer = await response.arrayBuffer();
      const bytes = Array.from(new Uint8Array(buffer));

      parent.postMessage({
        pluginMessage: {
          type: 'FETCH_IMAGE_SUCCESS',
          url: msg.url,
          bytes: bytes,
          requestId: msg.requestId
        }
      }, '*');
    } catch (err) {
      console.warn("Failed to fetch image in UI thread:", err);
      parent.postMessage({
        pluginMessage: {
          type: 'FETCH_IMAGE_ERROR',
          url: msg.url,
          requestId: msg.requestId
        }
      }, '*');
    }
  }
};


// src/ui.ts

const FIXED_WIDTH = 300;
const MIN_HEIGHT = 200;
const MAX_HEIGHT = 600;

function notifyWindowResize() {
  // Use requestAnimationFrame or a tiny delay so the browser finishes updating layout display state
  requestAnimationFrame(() => {
    const appEl = document.getElementById('app');
    if (!appEl) return;

    // Get the exact container content height
    const contentHeight = appEl.scrollHeight;

    // Clamp height between limits to prevent tiny UI glitches or ultra-long windows
    const targetHeight = Math.min(Math.max(contentHeight, MIN_HEIGHT), MAX_HEIGHT);

    parent.postMessage({
      pluginMessage: {
        type: 'RESIZE_WINDOW',
        width: FIXED_WIDTH,
        height: targetHeight
      }
    }, '*');
  });
}

function setupAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      if (!parentItem) return;

      const isAlreadyActive = parentItem.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach((item) => {
        item.classList.remove('active');
      });

      // Toggle current item
      if (!isAlreadyActive) {
        parentItem.classList.add('active');
      }

      // Recalculate height after DOM updates
      notifyWindowResize();
    });
  });

  // Initial calculation on view load
  notifyWindowResize();

  document.addEventListener('DOMContentLoaded', setupAccordions);

  // Open the single template section by default
  const defaultActive = document.querySelector('.accordion-item');
  defaultActive?.classList.add('active');
}


// Dom Bindings

window.addEventListener('DOMContentLoaded', () => {
    
    setupAccordions();
    
    // Elements: Single Template Section
    const templateSelect = document.getElementById('template-select') as HTMLSelectElement | null;
    const tableOptions = document.getElementById('table-options') as HTMLDivElement | null;
    const initialRowsInput = document.getElementById('initial-rows') as HTMLInputElement | null;
    const btnTemplate = document.getElementById('btn-template') as HTMLButtonElement | null;

    // Elements: Batch & Selection Section
    const schemaSelect = document.getElementById('schema-select') as HTMLSelectElement | null;
    const countInput = document.getElementById('count-input') as HTMLInputElement | null;
    const batchCountInput = document.getElementById('batch-count') as HTMLInputElement | null;
    
    const btnBatchCreate = document.getElementById('btn-batch-create') as HTMLButtonElement | null;
    const btnPopulateExisting = document.getElementById('btn-populate-existing') as HTMLButtonElement | null;
    const btnGenerate = document.getElementById('btn-generate') as HTMLButtonElement | null;
    const btnAddRows = document.getElementById('btn-add-rows') as HTMLButtonElement | null;

    // Elements: Custom JSON Section
    const btnCustom = document.getElementById('btn-custom') as HTMLButtonElement | null;
    const jsonInput = document.getElementById('json-input') as HTMLTextAreaElement | null;


    // Toggle dynamic options when 'data_table' is selected
    templateSelect?.addEventListener('change', () => {
        const isDataTable = templateSelect.value === 'data_table';

        if (tableOptions) {
            tableOptions.style.display = isDataTable ? 'flex' : 'none';
        }
        
        if (btnAddRows) {
            btnAddRows.style.display = isDataTable ? 'inline-block' : 'none'; // or 'block' depending on your layout
        }
    });
    // Action 1: Insert Single Master Template
    btnTemplate?.addEventListener('click', () => {
        const selectedType = templateSelect?.value || 'user_card';

        if (selectedType === 'user_card') {
        parent.postMessage({ pluginMessage: { type: 'CREATE_TEMPLATE_CARD' } }, '*');
        } else if (selectedType === 'product_card') {
        parent.postMessage({ pluginMessage: { type: 'CREATE_TEMPLATE_PRODUCT' } }, '*');
        } else if (selectedType === 'data_table') {
        const rowCount = parseInt(initialRowsInput?.value || '5', 10);
        parent.postMessage({ pluginMessage: { type: 'CREATE_TEMPLATE_TABLE', rowCount } }, '*');
        }
    });

    // Action 2: Batch Generate New Components in Auto Layout Grid
    btnBatchCreate?.addEventListener('click', () => {
        console.log("UI: Triggering batch generation...");
        const schema = schemaSelect?.value || 'user_profile';
        const count = parseInt(batchCountInput?.value || countInput?.value || '6', 10);
        const styleSelect = document.getElementById('avatar-style') as HTMLSelectElement; 

        parent.postMessage({
        pluginMessage: {
            type: 'BATCH_CREATE_COMPONENTS',
            schema: schema,
            count: count,
            avatarStyle: styleSelect.value
        }
        }, '*');
    });

    // Action 3: Populate Selected Nodes on Canvas
    const handlePopulate = () => {
        const schema = schemaSelect?.value || 'user_profile';
        const count = parseInt(countInput?.value || '5', 10);

        parent.postMessage({
        pluginMessage: {
            type: 'GENERATE_CUSTOM_DATA',
            schema: schema,
            count: count
        }
        }, '*');
    };

    btnGenerate?.addEventListener('click', handlePopulate);
    btnPopulateExisting?.addEventListener('click', handlePopulate);

    // Action 4: Add Rows to Selected Table
    btnAddRows?.addEventListener('click', () => {
        const rowCount = parseInt(countInput?.value || '3', 10);
        parent.postMessage({ pluginMessage: { type: 'ADD_TABLE_ROWS', count: rowCount } }, '*');
    });

    // Action 5: Custom JSON Data
    btnCustom?.addEventListener('click', () => {
        try {
        const rawText = jsonInput?.value.trim() || '[]';
        const parsedData = JSON.parse(rawText);

        parent.postMessage({
            pluginMessage: {
            type: 'APPLY_CUSTOM_JSON',
            data: parsedData
            }
        }, '*');
        } catch (err) {
        alert("Invalid JSON format. Please check your syntax.");
        }
    });

    
});