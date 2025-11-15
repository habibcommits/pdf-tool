from PIL import Image
from typing import List

def convert_images_to_pdf(image_paths: List[str], output_path: str) -> None:
    """
    Convert multiple images to a single PDF file.
    
    Args:
        image_paths: List of paths to image files
        output_path: Path where the PDF should be saved
    """
    if not image_paths:
        raise ValueError("No images provided")
    
    images = []
    
    try:
        for img_path in image_paths:
            img = Image.open(img_path)
            
            if img.mode == 'RGBA':
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            images.append(img)
        
        if not images:
            raise ValueError("No valid images to convert")
        
        first_image = images[0]
        other_images = images[1:] if len(images) > 1 else []
        
        first_image.save(
            output_path,
            "PDF",
            resolution=100.0,
            save_all=True,
            append_images=other_images
        )
    
    finally:
        for img in images:
            img.close()
