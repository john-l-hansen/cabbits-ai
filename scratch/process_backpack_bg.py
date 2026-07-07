from PIL import Image

def convert_black_to_white():
    img_path = 'public/assets/bag-coming-soon.png'
    img = Image.open(img_path)
    img = img.convert("RGBA")
    
    data = img.getdata()
    new_data = []
    
    for item in data:
        # If the pixel is pure black or extremely close to black, replace it with white
        if item[0] < 15 and item[1] < 15 and item[2] < 15:
            new_data.append((255, 255, 255, 255))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(img_path, "PNG")
    print("Success: Converted black background to white.")

if __name__ == '__main__':
    convert_black_to_white()
