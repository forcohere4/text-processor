from flask import Flask, request, jsonify, send_from_directory, render_template
import os
import subprocess

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["OUTPUT_FOLDER"] = OUTPUT_FOLDER


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded."}), 400

    pdf = request.files['file']
    if not pdf.filename.endswith('.pdf'):
        return jsonify({"error": "Only PDF files are allowed."}), 400

    # Save uploaded PDF
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], pdf.filename)
    pdf.save(file_path)

    # Convert PDF to HTML
    output_html = os.path.join(app.config["OUTPUT_FOLDER"], pdf.filename.rsplit('.', 1)[0] + '.html')
    try:
        subprocess.run(['pdf2htmlEX', file_path, output_html], check=True)
    except subprocess.CalledProcessError as e:
        return jsonify({"error": f"Error converting PDF to HTML: {str(e)}"}), 500

    # Return the HTML file path for rendering
    relative_path = f"outputs/{os.path.basename(output_html)}"
    return render_template('index.html', html_url=relative_path)


@app.route('/outputs/<path:filename>')
def serve_html(filename):
    return send_from_directory(app.config["OUTPUT_FOLDER"], filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)