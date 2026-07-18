from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os
import threading
import webbrowser

HOST = "127.0.0.1"
PORT = 8000
ROOT = Path(__file__).resolve().parent

os.chdir(ROOT)

url = f"http://localhost:{PORT}"
print(f"Latin Academy is running at {url}")
print("Press Ctrl+C to stop the server.")

threading.Timer(0.8, lambda: webbrowser.open(url)).start()

try:
    ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler).serve_forever()
except KeyboardInterrupt:
    print("\nLatin Academy server stopped.")
