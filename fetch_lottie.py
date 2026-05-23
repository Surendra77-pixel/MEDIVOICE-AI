import urllib.request, json, re
req = urllib.request.Request('https://lottiefiles.com/free-animation/little-power-robot-BtnSKUJQgN', headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    matches = re.findall(r'https://[^"\'\s]+\.json|https://[^"\'\s]+\.lottie', html)
    print(list(set(matches)))
except Exception as e:
    print(e)
