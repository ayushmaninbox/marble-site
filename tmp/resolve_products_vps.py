import csv
import re
import uuid

def generate_slug(text):
    if not text: return ""
    # Simplified slugify for the migration script
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug

def resolve():
    with open('data/products.csv', 'r') as f:
        lines = f.readlines()

    ours = [] # GitHub version (with slugs)
    theirs = [] # VPS version (source of truth)
    
    in_ours = False
    in_theirs = False
    
    # Simple conflict parser
    for line in lines:
        if '<<<<<<< HEAD' in line:
            in_ours = True
            continue
        if '=======' in line:
            in_ours = False
            in_theirs = True
            continue
        if '>>>>>>> Stashed changes' in line:
            in_theirs = False
            continue
        
        if in_ours:
            ours.append(line.strip())
        elif in_theirs:
            theirs.append(line.strip())
        else:
            # Lines outside conflict (like headers)
            # Actually PapaParse might have handled the header already.
            pass

    # If parsing failed or file was simple, just use the backup as a base
    # But since we want slugs, we should take VPS data and add slugs.
    
    # Strategy: Read the VPS data (from our backup) and add the slug column.
    with open('data/products.csv.bak', 'r') as f:
        reader = csv.DictReader(f)
        fields = reader.fieldnames
        rows = list(reader)

    # Ensure 'slug' is in fields
    if 'slug' not in fields:
        # insert 'slug' after 'name' (index 1)
        fields.insert(2, 'slug')

    for row in rows:
        if not row.get('slug'):
            row['slug'] = generate_slug(row.get('name', ''))
        
        # Ensure all fields are present
        for field in fields:
            if field not in row:
                row[field] = ""

    with open('data/products.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Successfully resolved conflict. Saved {len(rows)} products with slugs.")

if __name__ == "__main__":
    resolve()
