from PyPDF2 import PdfReader, PdfWriter
from PIL import Image
import io

def compress_pdf(input_path: str, output_path: str, dpi: int = 144, image_quality: int = 75, color_mode: str = "no-change") -> None:
    """
    Compress a PDF file with advanced image compression options.
    
    Args:
        input_path: Path to the input PDF file
        output_path: Path where the compressed PDF should be saved
        dpi: DPI for image resampling (72-300)
        image_quality: JPEG quality for images (10-100)
        color_mode: Color mode conversion ('no-change', 'grayscale', 'monochrome')
    """
    reader = PdfReader(input_path)
    writer = PdfWriter()
    
    for page in reader.pages:
        page.compress_content_streams()
        
        if '/Resources' in page and '/XObject' in page['/Resources']:  # type: ignore
            xobjects = page['/Resources']['/XObject'].get_object()  # type: ignore
            
            for obj_name in xobjects:
                obj = xobjects[obj_name]
                
                if obj['/Subtype'] == '/Image':
                    try:
                        width = obj['/Width']
                        height = obj['/Height']
                        
                        if '/Filter' in obj and obj['/Filter'] in ['/DCTDecode', '/FlateDecode']:
                            try:
                                image_data = obj.get_data()
                                image = Image.open(io.BytesIO(image_data))
                                
                                new_width = int(width * (dpi / 150))
                                new_height = int(height * (dpi / 150))
                                
                                if new_width > 0 and new_height > 0 and (new_width < width or new_height < height):
                                    image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                                
                                if color_mode == 'grayscale':
                                    image = image.convert('L')
                                elif color_mode == 'monochrome':
                                    image = image.convert('1')
                                elif image.mode == 'RGBA':
                                    background = Image.new('RGB', image.size, (255, 255, 255))
                                    background.paste(image, mask=image.split()[3])
                                    image = background
                                elif image.mode not in ['RGB', 'L']:
                                    image = image.convert('RGB')
                                
                                img_byte_arr = io.BytesIO()
                                if image.mode == '1':
                                    image.save(img_byte_arr, format='PNG', optimize=True)
                                else:
                                    image.save(img_byte_arr, format='JPEG', quality=image_quality, optimize=True)
                                
                            except Exception as e:
                                print(f"Warning: Could not compress image: {e}")
                    except Exception as e:
                        print(f"Warning: Could not process image object: {e}")
        
        writer.add_page(page)
    
    if reader.metadata:
        writer.add_metadata(reader.metadata)
    
    with open(output_path, "wb") as output_file:
        writer.write(output_file)
