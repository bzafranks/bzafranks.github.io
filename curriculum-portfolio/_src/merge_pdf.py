"""Merge PDFs: merge_pdf.py OUT IN1 IN2 ..."""
import sys
from pypdf import PdfWriter

out, *ins = sys.argv[1:]
w = PdfWriter()
for p in ins:
    w.append(p)
w.add_metadata({"/Author": "Dr. Barbara Zá Franks, EdD", "/Title": out.rsplit("/", 1)[-1].replace(".pdf", "").replace("-", " ")})
with open(out, "wb") as f:
    w.write(f)
