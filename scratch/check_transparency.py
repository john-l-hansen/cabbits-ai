from PIL import Image

def check_transparency():
    img_path = 'public/assets/profile-island.png'
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    # Check if any pixels are transparent (alpha < 255)
    data = img.getdata()
    transparent_pixels = 0
    total_pixels = len(data)
    
    for item in data:
        if item[3] < 255:
            transparent_pixels += 1
            
    percentage = (transparent_pixels / total_pixels) * 100
    print(f"Total pixels: {total_pixels}")
    print(f"Transparent pixels: {transparent_pixels} ({percentage:.2f}%)")

if __name__ == '__main__':
    check_transparency()
