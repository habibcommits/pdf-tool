from PyPDF2 import PdfMerger
from typing import List

def merge_pdfs(pdf_paths: List[str], output_path: str) -> None:
    """
    Merge multiple PDF files into a single PDF.
    
    Args:
        pdf_paths: List of paths to PDF files to merge
        output_path: Path where the merged PDF should be saved
    """
    if not pdf_paths:
        raise ValueError("No PDF files provided")
    
    if len(pdf_paths) < 2:
        raise ValueError("At least 2 PDF files are required for merging")
    
    merger = PdfMerger()
    
    try:
        for pdf_path in pdf_paths:
            merger.append(pdf_path)
        
        merger.write(output_path)
    
    finally:
        merger.close()
