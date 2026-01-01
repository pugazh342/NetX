from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
import nest_asyncio  # <--- IMPORT THIS
from .engine.parser import NetXParser

# <--- APPLY THE PATCH HERE
nest_asyncio.apply()

app = FastAPI(title="NetX API", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"status": "NetX Backend is running"}

# Changed to standard 'def' (removed async) to run in a threadpool
# This prevents blocking the main server loop during heavy parsing
@app.post("/analyze")
def analyze_pcap(file: UploadFile = File(...)):
    """
    Endpoint to upload a PCAP/PCAPNG file and get traffic analysis.
    """
    if not file.filename.endswith(('.pcap', '.pcapng')):
        raise HTTPException(status_code=400, detail="Invalid file type.")

    file_id = str(uuid.uuid4())
    file_extension = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, saved_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    try:
        # Run the Parser
        parser = NetXParser(file_path)
        parsed_data = parser.parse()
        
        # Optional: Delete file after processing to save space
        # os.remove(file_path) 
        
        return {
            "filename": file.filename,
            "packet_count": len(parsed_data),
            "data": parsed_data
        }

    except Exception as e:
        print(f"Error analyzing file: {e}") # Print error to terminal for debugging
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)