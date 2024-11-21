import os
import subprocess
from flask import Flask, request, render_template, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import ocrmypdf
import requests

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB

app.config['UPLOAD_FOLDER'] = "uploads"
app.config['OUTPUT_FOLDER'] = "outputs"

# Ensure the upload and output folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

# Allowed extensions for document upload
ALLOWED_EXTENSIONS = {'docx', 'doc', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    document = request.files['file']
    filename = secure_filename(document.filename)

    # Ensure the uploaded file is allowed
    if not allowed_file(filename):
        return jsonify({"error": f"Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed."}), 400

    # Save the uploaded file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    document.save(file_path)

    # Check OCR options from form data
    ocr_enabled = request.form.get('ocrCheckbox') == 'on'
    selected_languages = []
    if request.form.get('lang-eng'):
        selected_languages.append('eng')
    if request.form.get('lang-guj'):
        selected_languages.append('guj')
    if request.form.get('lang-san'):
        selected_languages.append('san')
    if request.form.get('lang-hin'):
        selected_languages.append('hin')
    languages = '+'.join(selected_languages) if selected_languages else 'eng'

    # If the file is a PDF, handle it directly
    if filename.endswith('.pdf'):
        if ocr_enabled:
            try:
                # Perform OCR on the PDF
                ocrmypdf_command = [
                'ocrmypdf',
                '--language', languages,  # Pass the selected languages
                '--force-ocr',           # Force OCR even if the PDF is already searchable
                '--output-type', 'pdf',  # Ensure output is a PDF
                file_path,               # Input file
                file_path                # Output file (overwrite)
                ]

                # Run the OCRmyPDF subprocess
                subprocess.run(ocrmypdf_command, check=True)
            except subprocess.CalledProcessError as e:
                return jsonify({"error": f"Error making PDF searchable: {str(e)}"}), 500

        # Return the PDF URL for direct rendering
        return jsonify({"html_url": f"/uploads/{filename}"})

    # Convert .doc and .docx files to .html
    if filename.endswith('.doc') or filename.endswith('.docx'):
        # Convert .doc to .docx if needed
        if filename.endswith('.doc'):
            docx_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename.rsplit('.', 1)[0] + '.docx')
            try:
                convert_command = [
                    'libreoffice',
                    '--headless',
                    '--convert-to', 'docx',
                    '--outdir', app.config['UPLOAD_FOLDER'],
                    file_path
                ]
                subprocess.run(convert_command, check=True)
                file_path = docx_file_path  # Update file_path to the converted .docx
            except subprocess.CalledProcessError as e:
                return jsonify({"error": f"Error converting .doc to .docx: {str(e)}"}), 500

        # Convert .docx to .html
        output_html = os.path.join(app.config['OUTPUT_FOLDER'], filename.rsplit('.', 1)[0] + '.html')
        try:
            convert_command = [
                'libreoffice',
                '--headless',
                '--convert-to', 'html',
                '--outdir', app.config['OUTPUT_FOLDER'],
                file_path
            ]
            subprocess.run(convert_command, check=True)
        except subprocess.CalledProcessError as e:
            return jsonify({"error": f"Error converting .docx to HTML: {str(e)}"}), 500

        # Return the HTML URL for rendering
        return jsonify({"html_url": f"/outputs/{filename.rsplit('.', 1)[0]}.html"})

    # If file format is not supported for conversion
    return jsonify({"error": "Unsupported file format for processing."}), 400


# Serve the uploaded PDFs directly from the upload folder
@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Serve the converted HTML files
@app.route('/outputs/<filename>')
def serve_output(filename):
    return send_from_directory(app.config['OUTPUT_FOLDER'], filename)

# Merge and Sort Tables
@app.route('/merge-sort')
def merge_sort():
    return render_template('merge-sort.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')