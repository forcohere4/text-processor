// Initialize Split.js for the viewer and editor with a draggable divider
Split(['.viewer', '.editor'], {
    sizes: [44, 56],  // Initial split size percentages
    minSize: 200,     // Minimum size of each pane
    gutterSize: 5,    // Size of the draggable divider
    cursor: 'col-resize'  // Cursor style when hovering over the divider
});

// Toggle sidebar visibility
function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
}

// File upload functionality
document.getElementById('upload-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('file-upload');
    const ocrCheckbox = document.getElementById('ocr-checkbox').checked;
    const formData = new FormData();

    // Check if file is selected
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }

    // Append the file to the form data
    formData.append('file', fileInput.files[0]);

    // Append OCR option and selected languages
    formData.append('ocrCheckbox', ocrCheckbox ? 'on' : 'off');
    if (document.getElementById('lang-eng').checked) formData.append('lang-eng', 'on');
    if (document.getElementById('lang-guj').checked) formData.append('lang-guj', 'on');
    if (document.getElementById('lang-san').checked) formData.append('lang-san', 'on');
    if (document.getElementById('lang-hin').checked) formData.append('lang-hin', 'on');

    // Show spinner
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'flex';

    // Send file and options to the server
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            // Display the converted HTML in the viewer without removing the hamburger menu
            const viewer = document.querySelector('.viewer');

            // Check if an iframe already exists; if so, update its src, otherwise create one
            let iframe = viewer.querySelector('iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', '100%');
                viewer.appendChild(iframe);
            }
            iframe.src = result.html_url;

            // Save the viewer content URL to local storage
            localStorage.setItem('viewerContentUrl', result.html_url);
        } else {
            alert(result.error || "Failed to upload and process the document.");
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading the file. Please try again.");
    } finally {
        // Hide spinner after completion
        spinner.style.display = 'none';
    }
});

// Load saved viewer content on page load
window.addEventListener('load', () => {
    const savedViewerContentUrl = localStorage.getItem('viewerContentUrl');
    if (savedViewerContentUrl) {
        const viewer = document.querySelector('.viewer');
        let iframe = viewer.querySelector('iframe');
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            viewer.appendChild(iframe);
        }
        iframe.src = savedViewerContentUrl;
    }
});

// Function to clear the editor content
function clearEditorContent() {
    if (editorInstance) {
        const confirmClear = confirm("Are you sure you want to clear the content?");
        if (confirmClear) {
            editorInstance.setData(''); // Clears the content
            localStorage.removeItem('editorContent'); // Clear the saved content
        }
    }
}

function defaultTable() {
    if (editorInstance) {
        const confirmReset = confirm("Are you sure you want to reset the content to the default table?");
        if (confirmReset) {
            const dataInitial = '<table style="font-size: 12px;" class="ck-table-resized"><colgroup><col style="width:5.69%;"><col style="width:5.69%;"><col style="width:23.53%;"><col style="width:53.71%;"><col style="width:5.69%;"><col style="width:5.69%;"></colgroup><thead><tr><th>Sr.</th><th>V.T</th><th>Granth</th><th>ShastraPath</th><th>Pub. Rem</th><th>In. Rem</th></tr></thead><tbody><tr><td>1</td><td>स्व.</td><td></td><td></td><td></td><td></td></tr></tbody></table>';
            editorInstance.setData(dataInitial); // Reset to initial data
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const languageCheckboxes = document.querySelectorAll('.language-options input[type="checkbox"]');
    
    // Ensure "English" is checked by default
    document.getElementById('lang-eng').checked = true;

    languageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Ensure at least one checkbox remains checked
            const anyChecked = Array.from(languageCheckboxes).some(cb => cb.checked);
            if (!anyChecked) {
                checkbox.checked = true;
                alert("At least one language must be selected.");
            }
        });
    });
});

async function exportToPDF() {
    // Store current filter status and make all rows visible
    const editorElement = document.getElementById("editor");
    const rows = editorElement.querySelectorAll("table tr");

    // Save the original display styles to restore them later
    const rowDisplayStyles = Array.from(rows).map(row => row.style.display);

    // Make all rows visible temporarily for export
    rows.forEach(row => row.style.display = '');

    // Get the content from the editor after making all rows visible
    const editorContent = editorElement.innerHTML;

    // Get the author's name
    const authorName = document.getElementById("author-name").value;
    
    // Get the selected orientation
    const orientation = document.querySelector('input[name="pdf-view"]:checked').value;

    try {
        // Send a POST request to the Node server
        const response = await fetch("/generate-pdf?orientation=" + orientation + "&author=" + encodeURIComponent(authorName), {
            method: "POST",
            headers: {
                "Content-Type": "text/html"
            },
            body: editorContent
        });

        // Check if the response is successful
        if (response.ok) {
            // Convert the response to a Blob (PDF file) and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link to download the PDF
            const link = document.createElement("a");
            link.href = url;
            link.download = "export.pdf";
            document.body.appendChild(link);
            link.click();

            // Clean up the temporary URL and link
            link.remove();
            window.URL.revokeObjectURL(url);
        } else {
            console.error("Failed to generate PDF:", response.statusText);
        }
    } catch (error) {
        console.error("Error while generating PDF:", error);
    } finally {
        // Restore the original display styles to maintain the filtered view
        rows.forEach((row, index) => row.style.display = rowDisplayStyles[index]);
    }
}

async function exportfilteredPDF() {
    // Get the content from the editor
    const editorContent = document.getElementById("editor").innerHTML;
    
    // Get the author's name
    const authorName = document.getElementById("author-name").value;
    
    // Get the selected orientation
    const orientation = document.querySelector('input[name="pdf-view"]:checked').value;

    try {
        // Send a POST request to the Node server
        const response = await fetch("/generate-pdf?orientation=" + orientation + "&author=" + encodeURIComponent(authorName), {
            method: "POST",
            headers: {
                "Content-Type": "text/html"
            },
            body: editorContent
        });

        // Check if the response is successful
        if (response.ok) {
            // Convert the response to a Blob (PDF file) and trigger download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link to download the PDF
            const link = document.createElement("a");
            link.href = url;
            link.download = "filtered-export.pdf";
            document.body.appendChild(link);
            link.click();

            // Clean up the temporary URL and link
            link.remove();
            window.URL.revokeObjectURL(url);
        } else {
            console.error("Failed to generate PDF:", response.statusText);
        }
    } catch (error) {
        console.error("Error while generating PDF:", error);
    }
}