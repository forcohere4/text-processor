import {
	DecoupledEditor,
	AccessibilityHelp,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BlockQuote,
	BlockToolbar,
	Bold,
	Code,
	// CodeBlock,
	Essentials,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	GeneralHtmlSupport,
	// Heading,
	Highlight,
	HorizontalLine,
	// HtmlComment,
	// HtmlEmbed,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	Markdown,
	MediaEmbed,
	Mention,
	Minimap,
	PageBreak,
	Paragraph,
	PasteFromMarkdownExperimental,
	PasteFromOffice,
	RemoveFormat,
	SelectAll,
	// ShowBlocks,
	SimpleUploadAdapter,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	// Style,
	Subscript,
	Superscript,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	TextPartLanguage,
	TextTransformation,
	// Title,
	TodoList,
	Underline,
	Undo
} from 'ckeditor5';

const editorConfig = {
	toolbar: {
		items: [
			'undo',
			'redo',
			'|',
			// 'showBlocks',
			'|',
			// 'heading',
			// 'style',
			'|',
			'fontSize',
			'fontFamily',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'subscript',
			'superscript',
			'|',
			'link',
			'insertImage',
			'insertTable',
			'highlight',
			'blockQuote',
			// 'codeBlock',
			'|',
			'alignment',
			'|',
			'bulletedList',
			'numberedList',
			'todoList',
			'outdent',
			'indent'
		],
		shouldNotGroupWhenFull: false
	},
	plugins: [
		AccessibilityHelp,
		Alignment,
		Autoformat,
		AutoImage,
		AutoLink,
		Autosave,
		BlockQuote,
		BlockToolbar,
		Bold,
		Code,
		// CodeBlock,
		Essentials,
		FindAndReplace,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		GeneralHtmlSupport,
		// Heading,
		Highlight,
		HorizontalLine,
		// HtmlComment,
		// HtmlEmbed,
		ImageBlock,
		ImageCaption,
		ImageInline,
		ImageInsert,
		ImageInsertViaUrl,
		ImageResize,
		ImageStyle,
		ImageTextAlternative,
		ImageToolbar,
		ImageUpload,
		Indent,
		IndentBlock,
		Italic,
		Link,
		LinkImage,
		List,
		ListProperties,
		Markdown,
		MediaEmbed,
		Mention,
		Minimap,
		PageBreak,
		Paragraph,
		PasteFromMarkdownExperimental,
		PasteFromOffice,
		RemoveFormat,
		SelectAll,
		// ShowBlocks,
		SimpleUploadAdapter,
		SpecialCharacters,
		SpecialCharactersArrows,
		SpecialCharactersCurrency,
		SpecialCharactersEssentials,
		SpecialCharactersLatin,
		SpecialCharactersMathematical,
		SpecialCharactersText,
		Strikethrough,
		// Style,
		Subscript,
		Superscript,
		Table,
		TableCaption,
		TableCellProperties,
		TableColumnResize,
		TableProperties,
		TableToolbar,
		TextPartLanguage,
		TextTransformation,
		// Title,
		TodoList,
		Underline,
		Undo
	],
	blockToolbar: [
		'fontSize',
		'fontColor',
		'fontBackgroundColor',
		'|',
		'bold',
		'italic',
		'|',
		'link',
		'insertImage',
		'insertTable',
		'|',
		'bulletedList',
		'numberedList',
		'outdent',
		'indent'
	],
	fontFamily: {
		supportAllValues: true
	},
	fontSize: {
		options: [10, 12, 14, 'default', 18, 20, 22],
		supportAllValues: true
	},
	heading: {
		options: [
			{
				model: 'paragraph',
				title: 'Paragraph',
				class: 'ck-heading_paragraph'
			},
			{
				model: 'heading1',
				view: 'h1',
				title: 'Heading 1',
				class: 'ck-heading_heading1'
			},
			{
				model: 'heading2',
				view: 'h2',
				title: 'Heading 2',
				class: 'ck-heading_heading2'
			},
			{
				model: 'heading3',
				view: 'h3',
				title: 'Heading 3',
				class: 'ck-heading_heading3'
			},
			{
				model: 'heading4',
				view: 'h4',
				title: 'Heading 4',
				class: 'ck-heading_heading4'
			},
			{
				model: 'heading5',
				view: 'h5',
				title: 'Heading 5',
				class: 'ck-heading_heading5'
			},
			{
				model: 'heading6',
				view: 'h6',
				title: 'Heading 6',
				class: 'ck-heading_heading6'
			}
		]
	},
	htmlSupport: {
		allow: [
			{
				name: /^.*$/,
				styles: true,
				attributes: true,
				classes: true
			}
		]
	},
	image: {
		toolbar: [
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'imageStyle:inline',
			'imageStyle:wrapText',
			'imageStyle:breakText',
			'|',
			'resizeImage'
		]
	},
	link: {
		addTargetToExternalLinks: true,
		defaultProtocol: 'https://',
		decorators: {
			toggleDownloadable: {
				mode: 'manual',
				label: 'Downloadable',
				attributes: {
					download: 'file'
				}
			}
		}
	},
	list: {
		properties: {
			styles: true,
			startIndex: true,
			reversed: true
		}
	},
	mention: {
		feeds: [
			{
				marker: '@',
				feed: [
					/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
				]
			}
		]
	},
	menuBar: {
		isVisible: true
	},
	minimap: {
		container: document.querySelector('#editor-minimap'),
		extraClasses: 'editor-container_include-minimap ck-minimap__iframe-content'
	},
	placeholder: 'Type or paste your content here!',
	style: {
		definitions: [
			{
				name: 'Article category',
				element: 'h3',
				classes: ['category']
			},
			{
				name: 'Title',
				element: 'h2',
				classes: ['document-title']
			},
			{
				name: 'Subtitle',
				element: 'h3',
				classes: ['document-subtitle']
			},
			{
				name: 'Info box',
				element: 'p',
				classes: ['info-box']
			},
			{
				name: 'Side quote',
				element: 'blockquote',
				classes: ['side-quote']
			},
			{
				name: 'Marker',
				element: 'span',
				classes: ['marker']
			},
			{
				name: 'Spoiler',
				element: 'span',
				classes: ['spoiler']
			},
			{
				name: 'Code (dark)',
				element: 'pre',
				classes: ['fancy-code', 'fancy-code-dark']
			},
			{
				name: 'Code (bright)',
				element: 'pre',
				classes: ['fancy-code', 'fancy-code-bright']
			}
		]
	},
	table: {
		contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
	},
	autosave: {
		save(editor) {
            const editorData = document.getElementById('editor').innerHTML;
            if (activeTab) {
                localStorage.setItem(`${localStoragePrefix}${activeTab}`, editorData);
                console.log(`Content saved for ${activeTab}`);
            }
            return Promise.resolve();
        }
	}
};

let activeTab = null;
const localStoragePrefix = 'editorTab_';
const tabsStateKey = 'editorTabsState';
const editorTabs = document.getElementById('editor-tabs');
let usedTabNumbers = new Set();
let activeTable = null; // Track the active table
let activeColumn = null; // Track the active column
let activeHeaderObserver = null; // Track the observer for active header changes

function cleanupOrphanedTabs() {
    const state = JSON.parse(localStorage.getItem(tabsStateKey) || '{"tabs":[]}');
    const validTabIds = new Set(state.tabs.map(tab => tab.id));

    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(localStoragePrefix)) {
            const tabId = key.replace(localStoragePrefix, '');
            if (!validTabIds.has(tabId)) {
                localStorage.removeItem(key);
            }
        }
    }
}

function saveTabsState() {
    const tabs = Array.from(document.querySelectorAll('.tab')).map(tab => {
        const tabId = tab.getAttribute('data-tab-id');
        return {
            id: tabId,
            name: tab.querySelector('.tab-name').textContent
            // Removed content field to reduce redundancy
        };
    });
    
    const state = {
        tabs,
        activeTab
    };
    
    localStorage.setItem(tabsStateKey, JSON.stringify(state));
}

function createNewTab(editor, name = null, tabId = null, content = null) {
    if (!tabId) {
        let tabNumber = 1;
        while (usedTabNumbers.has(tabNumber)) {
            tabNumber++;
        }
        tabId = `tab_${tabNumber}`;
        usedTabNumbers.add(tabNumber);
    } else {
        const tabNumber = parseInt(tabId.split('_')[1], 10);
        usedTabNumbers.add(tabNumber);
    }

    if (document.querySelector(`[data-tab-id="${tabId}"]`)) {
        console.warn(`Tab ${tabId} already exists, skipping creation`);
        return;
    }

    const newTab = document.createElement('div');
    newTab.className = 'tab';
    newTab.setAttribute('data-tab-id', tabId);

    newTab.innerHTML = `
        <span class="tab-name">${name || `Tab ${tabId.split('_')[1]}`}</span>
        <button class="close-tab">x</button>
    `;

    editorTabs.insertBefore(newTab, document.getElementById('add-tab'));

    // Default table content
    const defaultContent = `<table style="font-size: 12px;" class="ck-table-resized"><colgroup><col style="width:5.69%;"><col style="width:5.69%;"><col style="width:23.53%;"><col style="width:53.71%;"><col style="width:5.69%;"><col style="width:5.69%;"></colgroup><thead><tr><th>Sr.</th><th>V.T</th><th>Granth</th><th>ShastraPath</th><th>Pub. Rem</th><th>In. Rem</th></tr></thead><tbody><tr><td>1</td><td>स्व.</td><td>&#8203;</td><td>&#8203;</td><td>&#8203;</td><td>&#8203;</td></tr></tbody></table>`;

    // Initialize content
    if (content !== null) {
        localStorage.setItem(`${localStoragePrefix}${tabId}`, content);
    } else if (!localStorage.getItem(`${localStoragePrefix}${tabId}`)) {
        localStorage.setItem(`${localStoragePrefix}${tabId}`, defaultContent);
    }

    switchToTab(tabId, editor);
    saveTabsState();
}

function switchToTab(tabId, editor) {
    if (activeTab && document.querySelector(`[data-tab-id="${activeTab}"]`)) {
        const currentContent = document.getElementById('editor').innerHTML;
        localStorage.setItem(`${localStoragePrefix}${activeTab}`, currentContent);
    }

    const tabContent = localStorage.getItem(`${localStoragePrefix}${tabId}`);
    editor.setData(tabContent || '');
    
    activeTab = tabId;

    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    
    const activeTabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (activeTabElement) {
        activeTabElement.classList.add('active-tab');
    }

    saveTabsState();
}

function closeTab(tabId, editor) {
    const tabElement = document.querySelector(`[data-tab-id="${tabId}"]`);
    if (!tabElement) {
        return;
    }

    const remainingTabs = document.querySelectorAll('.tab');
    
    if (remainingTabs.length <= 1) {
        alert('At least one tab must remain.');
        return;
    }

    if (!confirm('Are you sure you want to close this tab?')) {
        return;
    }

    // First, remove from localStorage before any other operations
    localStorage.removeItem(`${localStoragePrefix}${tabId}`);

    // Then update the tabs state
    const state = JSON.parse(localStorage.getItem(tabsStateKey) || '{"tabs":[]}');
    state.tabs = state.tabs.filter(tab => tab.id !== tabId);
    
    // If this was the active tab, clear it from the state
    if (state.activeTab === tabId) {
        state.activeTab = null;
    }
    
    localStorage.setItem(tabsStateKey, JSON.stringify(state));

    // Remove the tab number from used numbers set
    const tabNumber = parseInt(tabId.split('_')[1], 10);
    usedTabNumbers.delete(tabNumber);

    // Remove the DOM element
    tabElement.remove();

    // Handle active tab switching
    if (activeTab === tabId) {
        const nextTab = document.querySelector('.tab');
        if (nextTab) {
            const nextTabId = nextTab.getAttribute('data-tab-id');
            // Don't save the current tab's content since we're closing it
            activeTab = null; // Clear active tab before switching
            switchToTab(nextTabId, editor);
        } else {
            activeTab = null;
            editor.setData('');
        }
    }
}

function restoreTabs(editor) {
    // Clear existing tabs
    Array.from(document.querySelectorAll('.tab')).forEach(tab => tab.remove());
    usedTabNumbers.clear();

    const savedState = localStorage.getItem(tabsStateKey);
    if (savedState) {
        const { tabs, activeTab: savedActiveTab } = JSON.parse(savedState);
        
        // Restore all tabs
        tabs.forEach(tab => {
            // Only pass name and id, content will be retrieved from localStorage
            createNewTab(editor, tab.name, tab.id);
        });

        // Switch to the previously active tab
        if (savedActiveTab && document.querySelector(`[data-tab-id="${savedActiveTab}"]`)) {
            switchToTab(savedActiveTab, editor);
        } else if (tabs.length > 0) {
            switchToTab(tabs[0].id, editor);
        }
    } else {
        createNewTab(editor);
    }
}

// Initialize the CKEditor with configuration and set up event handlers
DecoupledEditor.create(document.querySelector('#editor'), editorConfig).then(editor => {
    // Store the created editor instance in a global variable
    window.editorInstance = editor;
	
	// Append toolbar and menu bar to the document
	document.querySelector('#editor-toolbar').appendChild(editor.ui.view.toolbar.element);
	document.querySelector('#editor-menu-bar').appendChild(editor.ui.view.menuBarView.element);

	document.getElementById('add-tab').addEventListener('click', () => createNewTab(editor));

    editorTabs.addEventListener('click', event => {
        const tab = event.target.closest('.tab');
        if (tab) {
            const tabId = tab.getAttribute('data-tab-id');
            if (event.target.classList.contains('close-tab')) {
                closeTab(tabId, editor);
            } else {
                switchToTab(tabId, editor);
            }
        }
    });

	// Add clipboard input listener
	editor.editing.view.document.on('clipboardInput', (evt, data) => {
		// Get plain text from clipboard
		const plainText = data.dataTransfer.getData('text/plain')
			.replace(/\r\n/g, '\n')  // Normalize line breaks
			.replace(/\r/g, '\n');
		
		// Prevent the default paste behavior
		evt.stop();

		// Insert the plain text using the model API
		editor.model.change(writer => {
			const insertPosition = editor.model.document.selection.getFirstPosition();
			writer.insertText(plainText, insertPosition);
		});
	});

    // Add window beforeunload handler to save content
    window.addEventListener('beforeunload', () => {
        if (activeTab) {
            const currentContent = document.getElementById('editor').innerHTML;
            localStorage.setItem(`${localStoragePrefix}${activeTab}`, currentContent);
            saveTabsState();
        }
    });

    cleanupOrphanedTabs();
    restoreTabs(editor);

	async function importRawFile() {
		try {
			// Create a file input element
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = ".tpsrc"; // Accept files with the custom extension
	
			// Listen for file selection
			fileInput.addEventListener("change", async (event) => {
				const file = event.target.files[0];
	
				if (!file) {
					alert("No file selected.");
					return;
				}
	
				// Read the content of the file
				const reader = new FileReader();
				reader.onload = (e) => {
					const fileContent = e.target.result;
	
					// Ask for confirmation before replacing the editor content
					const confirmation = confirm(
						"The current editor content will be replaced. Do you want to proceed?"
					);
	
					if (confirmation) {
						// Replace the editor content
						if (window.editorInstance) {
							window.editorInstance.setData(fileContent);
						} else {
							console.error("Editor instance is not available.");
						}
					}
				};
	
				// Handle potential errors while reading the file
				reader.onerror = () => {
					console.error("Error reading the file.");
					alert("Error reading the file.");
				};
	
				// Read the file as a string
				reader.readAsText(file);
			});
	
			// Trigger the file input click
			fileInput.click();
		} catch (error) {
			console.error("Error while importing raw file:", error);
		}
	}
	window.importRawFile = importRawFile;

    const searchInput = document.getElementById('table-search');
    const searchTag = document.createElement('span');
    searchTag.classList.add('search-tag');
    searchInput.parentNode.insertBefore(searchTag, searchInput.nextSibling); // Insert after the input

    // Initially hide search-related elements
    searchTag.style.display = 'none';
    searchInput.style.display = 'none';

    // Handle clicks on table headers
    document.addEventListener('click', event => {
        const target = event.target.closest('th');
        const table = target?.closest('table'); // Find the closest table for the clicked header

        if (target && table) {
            activeTable = table; // Set the active table
            activeColumn = target.cellIndex; // Get column index

            // Stop observing any previously active header
            if (activeHeaderObserver) {
                activeHeaderObserver.disconnect();
            }

            // Set up a MutationObserver to watch for changes in the header text
            activeHeaderObserver = new MutationObserver(() => {
                searchTag.innerHTML = `${target.textContent.trim()} <span class="clear-tag">x</span>`;
            });
            activeHeaderObserver.observe(target, { characterData: true, subtree: true, childList: true });

            // Initialize search tag content
            searchTag.innerHTML = `${target.textContent.trim()} <span class="clear-tag">x</span>`; 
            searchInput.placeholder = 'Filter Column...'; 
            searchInput.value = ''; 
            filterTable(); 
            searchTag.style.display = 'inline'; 
            searchInput.style.display = 'inline'; 
        }
    });

    // Handle clearing the active column and reloading editor content
    searchTag.addEventListener('click', event => {
        if (event.target.classList.contains('clear-tag')) {
            activeTable = null;
            activeColumn = null;
            searchTag.style.display = 'none'; 
            searchInput.style.display = 'none'; 
            searchInput.value = ''; 
            filterTable(); 
            
            // Disconnect the observer when clearing the tag
            if (activeHeaderObserver) {
                activeHeaderObserver.disconnect();
                activeHeaderObserver = null;
            }

            // Reload editor content from local storage
            const savedContent = localStorage.getItem('editorContent');
            if (savedContent) {
                window.editorInstance.setData(savedContent);
            }
        }
    });

    // Filter function for search
    searchInput.addEventListener('input', filterTable);

	function cleanEditor() {
        document.querySelectorAll('#editor .ck-table-column-resizer').forEach(resizer => resizer.remove());
        document.querySelectorAll('#editor br[data-cke-filler="true"]').forEach(filler => filler.remove());
    }
	
    function filterTable() {
		cleanEditor();
        const searchTerm = searchInput.value.toLowerCase();
        if (!activeTable || activeColumn === null) {
            searchTag.style.display = 'none';
            searchInput.style.display = 'none';
            return;
        }

        Array.from(activeTable.tBodies[0].rows).forEach(row => {
            const cellText = row.cells[activeColumn]?.textContent.toLowerCase() || '';
            row.style.display = cellText.includes(searchTerm) ? '' : 'none';
        });
    }

	function sortTables() {
		const tables = document.querySelectorAll('#editor table');
	
		// Define the custom ranking order for the 2nd column
		const customOrder = [
			"व्यु", "व्युत्पत्तिअर्थ",
			"व्या", "व्याख्या",
			"साल", "सान्वर्थलक्षण",
			"ल", "लक्षण",
			"लचि", "लक्षणचिन्ह",
			"पर्या", "पर्यायवाची",
			"विक", "विकल्पवाची",
			"स्व", "स्वरूप",
			"परि", "परिचय"
		];
	
		// Function to normalize text by removing periods and extra spaces
		function normalizeText(text) {
			return text.replace(/\./g, '')  // Remove periods
					   .replace(/\s+/g, '')  // Remove all spaces
					   .trim();              // Trim any remaining whitespace
		}
	
		// Function to get the base form of text for comparison
		function getBaseForm(text) {
			const normalized = normalizeText(text);
	
			// Check for an exact match in the custom order
			if (customOrder.includes(normalized)) {
				return normalized;
			}
	
			// Check for a prefix match in the custom order
			return customOrder.find(base => normalized.startsWith(base)) || normalized;
		}
	
		// Function to get the index based on custom order
		function getCustomOrderIndex(value) {
			const baseForm = getBaseForm(value);
			const index = customOrder.indexOf(baseForm);
			return index !== -1 ? index : Infinity; // Return Infinity if not in custom order
		}
	
		tables.forEach((table) => {
			const rows = Array.from(table.querySelectorAll('tbody tr'));
	
			// Sort rows based on cell content
			rows.sort((a, b) => {
				const cellsA = a.cells;
				const cellsB = b.cells;
	
				// Compare values in the 2nd column based on custom order
				const valueA = cellsA[1].textContent.trim();
				const valueB = cellsB[1].textContent.trim();
	
				const orderIndexA = getCustomOrderIndex(valueA);
				const orderIndexB = getCustomOrderIndex(valueB);
	
				if (orderIndexA !== orderIndexB) {
					return orderIndexA - orderIndexB;
				}
	
				// Fall back to alphabetical comparison for the remaining columns
				for (let i = 2; i < cellsA.length; i++) {
					const cellValueA = cellsA[i].textContent.trim();
					const cellValueB = cellsB[i].textContent.trim();
	
					if (cellValueA > cellValueB) return 1;
					if (cellValueA < cellValueB) return -1;
				}
	
				return 0;
			});
	
			// Clear and re-append sorted rows
			const tbody = table.querySelector('tbody');
			rows.forEach(row => tbody.appendChild(row));
		});
	
		// Cleanup extraneous CKEditor elements
		document.querySelectorAll('#editor .ck-table-column-resizer').forEach(resizer => resizer.remove());
		document.querySelectorAll('#editor br[data-cke-filler="true"]').forEach(filler => filler.remove());
	
		// Update CKEditor content to reflect the sorted tables
		const updatedContent = document.querySelector('#editor').innerHTML;
		window.editorInstance.setData(updatedContent);
	
		// Save the updated content to local storage
		localStorage.setItem('editorContent', updatedContent);
	}
	
	window.sortTables = sortTables;	
	
    return editor;
}).catch(error => {
    console.error(error);
});