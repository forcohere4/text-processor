// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const mergeSortBtn = document.getElementById("merge-sort-btn");
    const exportPdfBtn = document.getElementById("export-pdf-btn");
    const editor = document.getElementById("editor");

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

    // Utility: Normalize text by removing dots, extra spaces, and converting to a clean form
    const normalizeText = (text) => {
        return text.replace(/\./g, '').replace(/\s+/g, '').trim().toLowerCase();
    };

    // Utility: Get base form of text
    const getBaseForm = (text) => {
        const normalized = normalizeText(text);
        return customOrder.find(base => normalized.startsWith(normalizeText(base))) || normalized;
    };

    // Utility: Get custom order index
    const getCustomOrderIndex = (value) => {
        const baseForm = getBaseForm(value);
        const index = customOrder.find(base => normalizeText(base) === normalizeText(baseForm)) 
            ? customOrder.indexOf(baseForm) 
            : Infinity;
        return index;
    };

    // Function to clean extraneous CKEditor elements
    const cleanTableContent = (table) => {
        // Remove <br> elements with data-cke-filler attribute
        table.querySelectorAll('br[data-cke-filler="true"]').forEach((br) => br.remove());

        // Remove <div> elements with ck-table-column-resizer class
        table.querySelectorAll('.ck-table-column-resizer').forEach((div) => div.remove());

        // Replace <p> tags containing only <br> tags with an empty <span>
        table.querySelectorAll('td').forEach((td) => {
            td.querySelectorAll('p').forEach((p) => {
                if (p.textContent.trim() === "") {
                    const span = document.createElement("span");
                    span.classList.add("ck-table-bogus-paragraph");
                    td.replaceChild(span, p);
                }
            });
        });
    };

    // Sorting Logic
    const sortTable = (table) => {
        const tbody = table.querySelector("tbody");
        if (!tbody) return;

        const rows = Array.from(tbody.rows);
        rows.sort((a, b) => {
            const valueA = a.cells[1]?.textContent.trim() || "";
            const valueB = b.cells[1]?.textContent.trim() || "";

            const orderIndexA = getCustomOrderIndex(valueA);
            const orderIndexB = getCustomOrderIndex(valueB);

            if (orderIndexA !== orderIndexB) {
                return orderIndexA - orderIndexB;
            }

            // If same base form, group similar variations together
            const normalizedA = normalizeText(valueA);
            const normalizedB = normalizeText(valueB);
            if (normalizedA !== normalizedB) {
                return normalizedA.localeCompare(normalizedB);
            }

            // Fallback to alphabetical sorting for remaining columns
            for (let i = 2; i < a.cells.length; i++) {
                const cellValueA = a.cells[i]?.textContent.trim() || "";
                const cellValueB = b.cells[i]?.textContent.trim() || "";

                if (cellValueA > cellValueB) return 1;
                if (cellValueA < cellValueB) return -1;
            }

            return 0;
        });

        // Re-append sorted rows to tbody
        rows.forEach(row => tbody.appendChild(row));
    };

    // Merge and Sort Tables
    mergeSortBtn.addEventListener("click", async () => {
        if (fileInput.files.length === 0) {
            alert("Please select .tpsrc files to merge.");
            return;
        }

        editor.innerHTML = ""; // Clear previous content
        const mergedTable = document.createElement("table");
        mergedTable.setAttribute("style", "font-size: 12px; border-collapse: collapse; width: 100%;");
        mergedTable.innerHTML = `
            <colgroup>
                <col style="width:5.69%;">
                <col style="width:5.69%;">
                <col style="width:23.53%;">
                <col style="width:53.71%;">
                <col style="width:5.69%;">
                <col style="width:5.69%;">
            </colgroup>
            <tbody></tbody>
        `;

        const mergedTbody = mergedTable.querySelector("tbody");
        let headerAdded = false; // Track if header is added

        for (const file of fileInput.files) {
            const content = await file.text(); // Read file content
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = content;

            const tables = tempDiv.querySelectorAll("table");
            tables.forEach((table) => {
                const thead = table.querySelector("thead");
                const tbody = table.querySelector("tbody");

                // Add header only once
                if (!headerAdded && thead) {
                    mergedTable.insertBefore(thead.cloneNode(true), mergedTbody);
                    headerAdded = true;
                }

                // Append rows from tbody
                if (tbody) {
                    Array.from(tbody.rows).forEach((row) => {
                        mergedTbody.appendChild(row.cloneNode(true));
                    });
                }
            });
        }

        // Sort the merged table rows
        sortTable(mergedTable);

        // Clean up extraneous CKEditor elements
        cleanTableContent(mergedTable);

        // Append the final cleaned, merged, and sorted table to the editor
        editor.innerHTML = ""; // Clear previous content
        editor.appendChild(mergedTable);
    });

    // Export PDF
    exportPdfBtn.addEventListener("click", async () => {
        const authorNameInput = document.getElementById("author-name");
        const authorName = authorNameInput.value.trim(); // Handle empty or whitespace gracefully

        const orientationInput = document.querySelector('input[name="pdf-view"]:checked');
        const orientation = orientationInput ? orientationInput.value : "portrait"; // Default to portrait if none selected

        const editorContent = editor.innerHTML;

        try {
            const response = await fetch(
                `/generate-pdf-merge?orientation=${orientation}&author=${encodeURIComponent(authorName)}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "text/html" },
                    body: editorContent,
                }
            );

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "merged-sorted.pdf";
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Failed to generate PDF:", response.statusText);
            }
        } catch (error) {
            console.error("Error while generating PDF:", error);
        }
    });
});