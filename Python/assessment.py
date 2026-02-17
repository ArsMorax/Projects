from urllib.parse import urlparse

def extract_doc_id(url):
    parsed_url = urlparse(url)
    path_parts = parsed_url.path.split('/')
    try:
        doc_id = path_parts[4]
        return doc_id
    except IndexError:
        return None

doc_url = "https://docs.google.com/document/d/e/2PACX-1vTMOmshQe8YvaRXi6gEPKKlsC6UpFJSMAk4mQjLm_u1gmHdVVTaeh7nBNFBRlui0sTZ-snGwZM4DBCT/pub"
file_id = extract_doc_id(doc_url)
print(file_id)

