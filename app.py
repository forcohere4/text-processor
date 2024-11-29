import os
import subprocess
from flask import Flask, request, render_template, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import ocrmypdf
import requests
import threading
import time
import json

app = Flask(__name__)

app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB

app.config['UPLOAD_FOLDER'] = "uploads"
app.config['OUTPUT_FOLDER'] = "outputs"
app.config['TASK_STATUS_FOLDER'] = "task_status"  # New folder for task status

# Ensure all required folders exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)
os.makedirs(app.config['TASK_STATUS_FOLDER'], exist_ok=True)  # New folder

# Allowed extensions for document upload
ALLOWED_EXTENSIONS = {'docx', 'doc', 'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_task_status(task_id, status, message=""):
    """Save task status to a JSON file"""
    status_file = os.path.join(app.config['TASK_STATUS_FOLDER'], f"{task_id}.json")
    with open(status_file, 'w') as f:
        json.dump({
            'status': status,
            'message': message,
            'timestamp': time.time()
        }, f)

def process_ocr(file_path, languages, task_id):
    """Background OCR processing function"""
    try:
        save_task_status(task_id, "processing", "OCR processing in progress...")
        
        ocrmypdf_command = [
            'ocrmypdf',
            '--language', languages,
            '--force-ocr',
            '--output-type', 'pdf',
            file_path,
            file_path
        ]
        
        subprocess.run(ocrmypdf_command, check=True)
        save_task_status(task_id, "completed", "OCR processing completed successfully")
        
    except subprocess.CalledProcessError as e:
        save_task_status(task_id, "failed", f"OCR processing failed: {str(e)}")

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
            # Generate task ID for async processing
            task_id = f"task_{int(time.time())}"
            
            # Start OCR processing in background
            thread = threading.Thread(
                target=process_ocr,
                args=(file_path, languages, task_id)
            )
            thread.start()

            # Return immediately with task ID and file URL
            return jsonify({
                "task_id": task_id,
                "status": "processing",
                "message": "OCR processing started",
                "html_url": f"/uploads/{filename}"
            })

        # Return the PDF URL for direct rendering if OCR not needed
        return jsonify({"html_url": f"/uploads/{filename}"})

    # Convert .doc and .docx files to .html
    if filename.endswith('.doc') or filename.endswith('.docx'):
        # Convert .doc files to .html
        if filename.endswith('.doc'):
            # Convert .doc to text first
            txt_file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename.rsplit('.', 1)[0] + '.txt')
            try:
                convert_command = [
                    'libreoffice',
                    '--headless',
                    '--convert-to', 'txt:Text',
                    '--outdir', app.config['UPLOAD_FOLDER'],
                    file_path
                ]
                subprocess.run(convert_command, check=True)
            except subprocess.CalledProcessError as e:
                return jsonify({"error": f"Error converting .doc to text: {str(e)}"}), 500

            # Update file_path to the converted .txt file
            file_path = txt_file_path

            # Convert text to .html
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
                return jsonify({"error": f"Error converting text to HTML: {str(e)}"}), 500

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

@app.route('/task-status/<task_id>')
def task_status(task_id):
    """Check the status of an OCR task"""
    status_file = os.path.join(app.config['TASK_STATUS_FOLDER'], f"{task_id}.json")
    
    if not os.path.exists(status_file):
        return jsonify({"error": "Task not found"}), 404
        
    with open(status_file, 'r') as f:
        status = json.load(f)
    
    return jsonify(status)

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