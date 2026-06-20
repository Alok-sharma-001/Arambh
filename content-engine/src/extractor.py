import sys
import json
import argparse
import os

try:
    import fitz  # PyMuPDF
except ImportError:
    print(json.dumps({"error": "PyMuPDF not installed. Run: pip install pymupdf"}))
    sys.exit(1)

def extract_pdf_text(pdf_path):
    if not os.path.exists(pdf_path):
        print(json.dumps({"error": f"File not found: {pdf_path}"}))
        sys.exit(1)
        
    try:
        doc = fitz.open(pdf_path)
        toc = doc.get_toc()
        
        # Segment by chapter using the TOC
        # TOC format: [[lvl, title, page, dest], ...]
        chapters = []
        
        # Filter to only top-level chapters (level 1)
        level1_toc = [item for item in toc if item[0] == 1]
        
        for i, item in enumerate(level1_toc):
            title = item[1]
            start_page = item[2] - 1 # 0-indexed
            
            # End page is the start of the next chapter, or the end of the document
            end_page = level1_toc[i+1][2] - 1 if i + 1 < len(level1_toc) else len(doc)
            
            # Extract text for this chapter
            chapter_text = ""
            for page_num in range(start_page, end_page):
                if page_num >= 0 and page_num < len(doc):
                    page = doc.load_page(page_num)
                    chapter_text += page.get_text() + "\n"
                    
            # Basic cleanup: Remove multiple newlines
            import re
            chapter_text = re.sub(r'\n{3,}', '\n\n', chapter_text)
            
            chapters.append({
                "title": title,
                "text": chapter_text
            })
            
        result = {
            "book": os.path.basename(pdf_path),
            "pages_processed": len(doc),
            "chapters": chapters
        }
        
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Arambh PDF Extractor')
    parser.add_argument('pdf_path', help='Path to the PDF file')
    args = parser.parse_args()
    
    extract_pdf_text(args.pdf_path)
