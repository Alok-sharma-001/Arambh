import os
import glob
import re

files = glob.glob('frontend/src/data/*Data.ts')

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # We want to replace the rigid replace(/\s+/g, '') blocks with semantic checks
    # But wait, this is very complex to do via script.
    
    # Actually, let's just make the execution engine run Pyodide!
